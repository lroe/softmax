#!/usr/bin/env node
/**
 * Chunked, resumable 2K renderer for the Softmax Gate explainer.
 *
 * Why this exists:
 * - Colab runtimes die. Every chunk is copied to Google Drive immediately,
 *   so a rerun picks up where the last chunk stopped.
 * - The final file is stitched from muted video chunks and the original WAV,
 *   so audio never drifts at chunk boundaries.
 *
 * Usage:
 *   node scripts/render-2k.mjs \
 *     --output-dir /content/drive/MyDrive/InferenceEngineering \
 *     --work-dir /content/render-work \
 *     --chunk 600 --scale 1.3333333333 --concurrency 2 --crf 18
 *
 * Progress is emitted as one JSON object per line, prefixed with @@RENDER@@
 * so a notebook can parse it without depending on Remotion's console output.
 */

import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { bundle } from "@remotion/bundler";
import { ensureBrowser, renderMedia, selectComposition } from "@remotion/renderer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const VIDEO_ROOT = path.resolve(__dirname, "..");
const ENTRY_POINT = path.join(VIDEO_ROOT, "src/index.ts");
const PUBLIC_DIR = path.join(VIDEO_ROOT, "public");
const AUDIO_FILE = path.join(PUBLIC_DIR, "audio.wav");
const COMPOSITION_ID = "SoftmaxGate";
const PREFIX = "@@RENDER@@ ";
const MIN_VALID_CHUNK_BYTES = 1024;

const argv = process.argv.slice(2);
const opts = {};
for (let i = 0; i < argv.length; i++) {
  const arg = argv[i];
  if (!arg.startsWith("--")) continue;
  const key = arg.slice(2);
  const next = argv[i + 1];
  if (next === undefined || next.startsWith("--")) {
    opts[key] = true;
  } else {
    opts[key] = next;
    i++;
  }
}

const number = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};
const bool = (value, fallback = false) => {
  if (value === undefined) return fallback;
  if (value === true) return true;
  return !["0", "false", "no", "off"].includes(String(value).toLowerCase());
};

const CONFIG = {
  outputDir: opts["output-dir"] ? path.resolve(opts["output-dir"]) : null,
  workDir: path.resolve(opts["work-dir"] || "/content/render-work"),
  chunksDirName: opts["chunks-dir"] || "chunks",
  outputName: opts["output-name"] || "softmax-gate-2560x1440.mp4",
  chunkFrames: Math.max(1, Math.round(number(opts.chunk, 600))),
  scale: number(opts.scale, 2560 / 1920),
  concurrency: Math.max(1, Math.round(number(opts.concurrency, 2))),
  crf: Math.max(0, Math.min(51, Math.round(number(opts.crf, 18)))),
  gl: opts.gl || "swangle",
  startFrame: opts.start === undefined ? null : Math.max(0, Math.round(number(opts.start, 0))),
  endFrame: opts.end === undefined ? null : Math.max(0, Math.round(number(opts.end, 0))),
  audioBitrate: opts["audio-bitrate"] || "192k",
  cleanupChunks: bool(opts["cleanup-chunks"], false),
  force: bool(opts.force, false),
  skipStitch: bool(opts["skip-stitch"], false),
  posterSecond: number(opts["poster-second"], 5),
};

if (!CONFIG.outputDir) {
  console.error("Missing --output-dir");
  process.exit(2);
}

const chunksDir = path.join(CONFIG.outputDir, CONFIG.chunksDirName);
const logsDir = path.join(CONFIG.outputDir, "logs");
const statePath = path.join(CONFIG.outputDir, "render_state.json");
const metadataPath = path.join(CONFIG.outputDir, "render_metadata.json");
const finalPath = path.join(CONFIG.outputDir, CONFIG.outputName);
const localFinalPath = path.join(CONFIG.workDir, CONFIG.outputName);
const concatListPath = path.join(CONFIG.workDir, "concat.txt");

let lastEmit = 0;
function emit(type, payload = {}) {
  process.stdout.write(PREFIX + JSON.stringify({ type, at: new Date().toISOString(), ...payload }) + "\n");
}
function emitThrottled(type, payload = {}, minMs = 800) {
  const now = Date.now();
  if (now - lastEmit < minMs) return;
  lastEmit = now;
  emit(type, payload);
}
function fmtDuration(seconds) {
  const s = Math.max(0, Math.round(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return h > 0 ? `${h}h ${m}m ${sec}s` : m > 0 ? `${m}m ${sec}s` : `${sec}s`;
}
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function ensureDirs() {
  await fsp.mkdir(CONFIG.outputDir, { recursive: true });
  await fsp.mkdir(chunksDir, { recursive: true });
  await fsp.mkdir(logsDir, { recursive: true });
  await fsp.mkdir(CONFIG.workDir, { recursive: true });
}

function chunkLabel(start, end) {
  return `${String(start).padStart(6, "0")}-${String(end).padStart(6, "0")}`;
}
function chunkFile(start, end) {
  return path.join(chunksDir, `chunk_${chunkLabel(start, end)}.mp4`);
}
function localChunkFile(start, end) {
  return path.join(CONFIG.workDir, `chunk_${chunkLabel(start, end)}.mp4`);
}
function signatureFor(durationInFrames) {
  return {
    compositionId: COMPOSITION_ID,
    durationInFrames,
    chunkFrames: CONFIG.chunkFrames,
    scale: Number(CONFIG.scale.toFixed(6)),
    crf: CONFIG.crf,
    codec: "h264",
  };
}
function sameSignature(a, b) {
  return Boolean(a) && Boolean(b) && JSON.stringify(a) === JSON.stringify(b);
}

async function writeJsonAtomic(file, value) {
  const tmp = `${file}.tmp-${process.pid}`;
  await fsp.writeFile(tmp, JSON.stringify(value, null, 2));
  await fsp.rename(tmp, file);
}

async function fileSize(file) {
  try {
    const stat = await fsp.stat(file);
    return stat.isFile() ? stat.size : 0;
  } catch {
    return 0;
  }
}

async function copyWithProgress(src, dest, onProgress) {
  const total = await fileSize(src);
  if (!total) throw new Error(`Cannot copy missing/empty file: ${src}`);
  await fsp.mkdir(path.dirname(dest), { recursive: true });
  const tmp = `${dest}.part-${process.pid}`;
  let copied = 0;
  let last = 0;

  await new Promise((resolve, reject) => {
    const reader = fs.createReadStream(src);
    const writer = fs.createWriteStream(tmp);
    let settled = false;
    const fail = (err) => {
      if (settled) return;
      settled = true;
      reader.destroy();
      writer.destroy();
      fsp.unlink(tmp).catch(() => {});
      reject(err);
    };
    reader.on("error", fail);
    writer.on("error", fail);
    reader.on("data", (buf) => {
      copied += buf.length;
      const now = Date.now();
      if (now - last > 700 || copied === total) {
        last = now;
        onProgress?.({ copied, total, percent: (copied / total) * 100 });
      }
    });
    writer.on("finish", () => {
      if (settled) return;
      settled = true;
      resolve();
    });
    reader.pipe(writer);
  });

  await fsp.rename(tmp, dest);
  const destSize = await fileSize(dest);
  if (destSize !== total) throw new Error(`Copy size mismatch for ${dest}: ${destSize}/${total}`);
  return total;
}

async function copyToDriveWithRetries(src, dest, label) {
  let lastError = null;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      emit("copy_start", { label, attempt, bytes: await fileSize(src) });
      let lastPercent = -1;
      const bytes = await copyWithProgress(src, dest, ({ copied, total, percent }) => {
        const rounded = Math.floor(percent / 5) * 5;
        if (rounded !== lastPercent) {
          lastPercent = rounded;
          emitThrottled("copy_progress", { label, copied, total, percent, attempt }, 700);
        }
      });
      emit("copy_done", { label, bytes, attempt });
      return bytes;
    } catch (err) {
      lastError = err;
      emit("copy_retry", { label, attempt, message: String(err?.message || err) });
      await sleep(1500 * attempt);
    }
  }
  throw lastError;
}

function runProcess(command, args, { cwd, onStdout, onStderr } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (buf) => {
      const text = buf.toString();
      stdout += text;
      onStdout?.(text);
    });
    child.stderr.on("data", (buf) => {
      const text = buf.toString();
      stderr += text;
      onStderr?.(text);
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve({ stdout, stderr });
      else reject(new Error(`${command} exited with code ${code}\n${stderr.slice(-4000)}`));
    });
  });
}

async function probeVideo(file) {
  const { stdout } = await runProcess("ffprobe", [
    "-v", "error",
    "-show_entries", "stream=index,codec_type,codec_name,width,height,r_frame_rate,nb_frames,duration",
    "-show_entries", "format=duration,size,bit_rate",
    "-of", "json",
    file,
  ]);
  return JSON.parse(stdout);
}

async function renderChunk({ serveUrl, composition, start, end, index, chunkCount, completedFrames, totalFrames }) {
  const label = chunkLabel(start, end);
  const driveFile = chunkFile(start, end);
  const localFile = localChunkFile(start, end);
  const chunkTotal = end - start + 1;
  const startedAt = Date.now();

  const existing = await fileSize(driveFile);
  if (existing > MIN_VALID_CHUNK_BYTES && !CONFIG.force) {
    emit("chunk_skip", {
      index, chunkCount, label, start, end,
      frames: chunkTotal,
      completedFrames: completedFrames + chunkTotal,
      totalFrames,
      bytes: existing,
      reason: "already on Google Drive",
    });
    return { skipped: true, bytes: existing, seconds: 0 };
  }

  let localBytes = await fileSize(localFile);
  if (localBytes > MIN_VALID_CHUNK_BYTES && !CONFIG.force) {
    emit("chunk_reuse", { index, chunkCount, label, start, end, frames: chunkTotal, bytes: localBytes });
  } else {
    emit("chunk_start", {
      index, chunkCount, label, start, end, frames: chunkTotal,
      completedFrames, totalFrames,
      percent: (completedFrames / totalFrames) * 100,
    });

    let lastProgress = 0;
    await renderMedia({
      composition,
      serveUrl,
      codec: "h264",
      outputLocation: localFile,
      frameRange: [start, end],
      muted: true,
      scale: CONFIG.scale,
      crf: CONFIG.crf,
      concurrency: CONFIG.concurrency,
      chromiumOptions: { gl: CONFIG.gl },
      logLevel: "warn",
      overwrite: true,
      onProgress: ({ renderedFrames, encodedFrames, renderEstimatedTime, stitchStage }) => {
        const now = Date.now();
        if (now - lastProgress < 700 && renderedFrames < chunkTotal) return;
        lastProgress = now;
        const elapsed = (now - startedAt) / 1000;
        emit("progress", {
          index, chunkCount, label, start, end,
          chunkRendered: renderedFrames,
          chunkEncoded: encodedFrames,
          chunkFrames: chunkTotal,
          completedFrames,
          globalRendered: completedFrames + renderedFrames,
          totalFrames,
          percent: ((completedFrames + renderedFrames) / totalFrames) * 100,
          renderPercent: (renderedFrames / chunkTotal) * 100,
          stage: stitchStage,
          fps: elapsed > 0 ? renderedFrames / elapsed : 0,
          etaSeconds: renderEstimatedTime ? Math.round(renderEstimatedTime / 1000) : null,
        });
      },
    });

    localBytes = await fileSize(localFile);
    if (!localBytes) throw new Error(`Render produced no file for chunk ${label}`);
    emit("chunk_rendered", { index, chunkCount, label, bytes: localBytes, seconds: (Date.now() - startedAt) / 1000 });
  }

  await copyToDriveWithRetries(localFile, driveFile, `chunk ${index + 1}/${chunkCount} (${label})`);
  const bytes = await fileSize(driveFile);
  const seconds = (Date.now() - startedAt) / 1000;
  emit("chunk_done", {
    index, chunkCount, label, start, end, frames: chunkTotal,
    bytes, seconds, completedFrames: completedFrames + chunkTotal, totalFrames,
    percent: ((completedFrames + chunkTotal) / totalFrames) * 100,
  });
  return { skipped: false, bytes, seconds };
}

async function stitch({ ranges, totalFrames, durationInFrames, fps }) {
  const lines = [];
  for (const [start, end] of ranges) {
    const driveFile = chunkFile(start, end);
    const localFile = localChunkFile(start, end);
    const localBytes = await fileSize(localFile);
    const driveBytes = await fileSize(driveFile);
    if (localBytes > MIN_VALID_CHUNK_BYTES) {
      lines.push(`file '${localFile.replace(/'/g, "'\\''")}'`);
    } else if (driveBytes > MIN_VALID_CHUNK_BYTES) {
      lines.push(`file '${driveFile.replace(/'/g, "'\\''")}'`);
    } else {
      throw new Error(`Missing chunk ${chunkLabel(start, end)} in both work dir and Drive`);
    }
  }
  await fsp.writeFile(concatListPath, lines.join("\n") + "\n");

  const expectedSeconds = totalFrames / fps;
  emit("stitch_start", { chunks: ranges.length, output: finalPath, expectedSeconds });

  let lastStitch = 0;
  const args = [
    "-hide_banner", "-nostdin", "-y",
    "-fflags", "+genpts",
    "-f", "concat", "-safe", "0", "-i", concatListPath,
    "-i", AUDIO_FILE,
    "-map", "0:v:0", "-map", "1:a:0",
    "-c:v", "copy",
    "-c:a", "aac", "-b:a", CONFIG.audioBitrate,
    "-shortest", "-movflags", "+faststart",
    "-progress", "pipe:1", "-nostats",
    localFinalPath,
  ];
  let progressBuffer = "";
  await runProcess("ffmpeg", args, {
    onStdout: (text) => {
      progressBuffer += text;
      const lines = progressBuffer.split(/\r?\n/);
      progressBuffer = lines.pop() || "";
      for (const line of lines) {
        const match = line.match(/^out_time_us=(\d+)/);
        if (!match) continue;
        const seconds = Number(match[1]) / 1_000_000;
        const now = Date.now();
        if (now - lastStitch < 900 && seconds < expectedSeconds - 0.5) continue;
        lastStitch = now;
        emit("stitch_progress", {
          seconds,
          expectedSeconds,
          percent: Math.min(99.5, (seconds / expectedSeconds) * 100),
        });
      }
    },
  });

  const localBytes = await fileSize(localFinalPath);
  if (!localBytes) throw new Error("ffmpeg stitch produced no output");
  emit("stitch_rendered", { bytes: localBytes, path: localFinalPath });
  await copyToDriveWithRetries(localFinalPath, finalPath, "final 2K video");
  emit("stitch_done", { path: finalPath, bytes: await fileSize(finalPath) });

  const probe = await probeVideo(finalPath);
  const video = probe.streams?.find((s) => s.codec_type === "video");
  const audio = probe.streams?.find((s) => s.codec_type === "audio");
  const info = {
    file: finalPath,
    bytes: Number(probe.format?.size || (await fileSize(finalPath))),
    durationSeconds: Number(probe.format?.duration || 0),
    width: video?.width,
    height: video?.height,
    fps: video?.r_frame_rate,
    videoCodec: video?.codec_name,
    audioCodec: audio?.codec_name,
    durationInFrames,
    renderedAt: new Date().toISOString(),
    config: {
      scale: CONFIG.scale,
      crf: CONFIG.crf,
      chunkFrames: CONFIG.chunkFrames,
      concurrency: CONFIG.concurrency,
      gl: CONFIG.gl,
    },
  };
  await writeJsonAtomic(metadataPath, info);
  emit("metadata", info);

  // A poster frame is handy for YouTube and for a quick visual check.
  try {
    const poster = path.join(CONFIG.outputDir, "poster_2560x1440.jpg");
    await runProcess("ffmpeg", [
      "-hide_banner", "-loglevel", "error", "-y",
      "-ss", String(CONFIG.posterSecond), "-i", finalPath,
      "-frames:v", "1", "-q:v", "2", poster,
    ]);
    emit("poster", { path: poster, bytes: await fileSize(poster) });
  } catch (err) {
    emit("log", { level: "warn", message: `Poster frame failed: ${String(err?.message || err)}` });
  }

  if (CONFIG.cleanupChunks) {
    emit("cleanup_start", { chunks: ranges.length });
    for (const [start, end] of ranges) {
      await fsp.unlink(chunkFile(start, end)).catch(() => {});
    }
    emit("cleanup_done", {});
  }
  return info;
}

async function main() {
  const startedAt = Date.now();
  await ensureDirs();
  emit("start", {
    config: CONFIG,
    node: process.version,
    platform: `${process.platform} ${process.arch}`,
    cpus: (await import("node:os")).cpus().length,
    outputDir: CONFIG.outputDir,
    workDir: CONFIG.workDir,
  });

  emit("browser_start", {});
  const browser = await ensureBrowser({
    chromeMode: "headless-shell",
    logLevel: "warn",
  });
  emit("browser_ready", { browser });

  emit("bundle_start", { entryPoint: ENTRY_POINT, publicDir: PUBLIC_DIR });
  const bundleOut = path.join(CONFIG.workDir, "bundle");
  await fsp.rm(bundleOut, { recursive: true, force: true });
  const serveUrl = await bundle({
    entryPoint: ENTRY_POINT,
    publicDir: PUBLIC_DIR,
    outDir: bundleOut,
    enableCaching: true,
    onProgress: (percent) => emitThrottled("bundle_progress", { percent }, 500),
  });
  emit("bundle_done", { serveUrl });

  emit("composition_start", {});
  const composition = await selectComposition({
    serveUrl,
    id: COMPOSITION_ID,
    chromiumOptions: { gl: CONFIG.gl },
    chromeMode: "headless-shell",
    logLevel: "warn",
  });
  const durationInFrames = composition.durationInFrames;
  const start = CONFIG.startFrame ?? 0;
  const end = CONFIG.endFrame ?? durationInFrames - 1;
  if (start < 0 || end >= durationInFrames || start > end) {
    throw new Error(`Invalid frame range ${start}-${end} for composition with ${durationInFrames} frames`);
  }
  const totalFrames = end - start + 1;
  emit("composition_ready", {
    composition,
    start, end, totalFrames,
    outputWidth: Math.round(composition.width * CONFIG.scale),
    outputHeight: Math.round(composition.height * CONFIG.scale),
    expectedSeconds: totalFrames / composition.fps,
    fullRender: start === 0 && end === durationInFrames - 1,
  });

  const ranges = [];
  for (let s = start; s <= end; s += CONFIG.chunkFrames) {
    ranges.push([s, Math.min(end, s + CONFIG.chunkFrames - 1)]);
  }

  const signature = signatureFor(durationInFrames);
  let state = null;
  try {
    state = JSON.parse(await fsp.readFile(statePath, "utf8"));
  } catch {
    state = null;
  }
  if (state && !sameSignature(state.signature, signature)) {
    emit("log", {
      level: "warn",
      message: "Existing render_state.json was made with different settings; chunk filenames will be reused only if their frame ranges match.",
      oldSignature: state.signature,
      newSignature: signature,
    });
  }
  const previousChunks = state && sameSignature(state.signature, signature) ? state.chunks || {} : {};
  state = {
    version: 1,
    signature,
    outputName: CONFIG.outputName,
    totalFrames,
    chunkFrames: CONFIG.chunkFrames,
    chunks: { ...previousChunks },
    startedAt: (state && sameSignature(state.signature, signature) && state.startedAt) || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await writeJsonAtomic(statePath, state);

  const totalChunks = ranges.length;
  emit("plan", {
    chunkFrames: CONFIG.chunkFrames,
    totalChunks,
    ranges: ranges.map(([s, e], i) => ({ index: i, label: chunkLabel(s, e), start: s, end: e, frames: e - s + 1 })),
    statePath,
  });

  let completedFrames = 0;
  for (let i = 0; i < ranges.length; i++) {
    const [s, e] = ranges[i];
    const result = await renderChunk({
      serveUrl,
      composition,
      start: s,
      end: e,
      index: i,
      chunkCount: totalChunks,
      completedFrames,
      totalFrames,
    });
    completedFrames += e - s + 1;
    state.chunks[chunkLabel(s, e)] = {
      start: s,
      end: e,
      frames: e - s + 1,
      bytes: result.bytes,
      skipped: result.skipped,
      seconds: result.seconds,
      completedAt: new Date().toISOString(),
    };
    state.updatedAt = new Date().toISOString();
    await writeJsonAtomic(statePath, state);
  }

  emit("render_done", {
    seconds: (Date.now() - startedAt) / 1000,
    completedFrames,
    totalFrames,
    chunks: totalChunks,
  });

  if (CONFIG.skipStitch) {
    emit("done", { stitched: false, outputDir: CONFIG.outputDir, statePath });
    return;
  }

  const info = await stitch({ ranges, totalFrames, durationInFrames, fps: composition.fps });
  emit("done", {
    stitched: true,
    output: finalPath,
    bytes: info.bytes,
    durationSeconds: info.durationSeconds,
    width: info.width,
    height: info.height,
    metadataPath,
    statePath,
    totalSeconds: (Date.now() - startedAt) / 1000,
    humanTime: fmtDuration((Date.now() - startedAt) / 1000),
  });
}

main().catch((err) => {
  emit("error", {
    message: String(err?.stack || err?.message || err),
    hint: "Completed chunks are already on Google Drive. Fix the error and rerun; finished chunks are skipped.",
  });
  process.exit(1);
});
