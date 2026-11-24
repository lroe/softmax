# Softmax Gate — local preview

A 19:54 hand-drawn Dracula-dark explainer about three 2026 papers: the softmax precision bug, silent (latent) reasoning agents, and latent feedback at training time.

No full video render was made. This project is set up for the Remotion Studio preview.

## Preview

The studio is already running:

**http://localhost:3111**

Then choose the **SoftmaxGate** composition. It is the first composition in the list. `JudgeGrid` is only a QA helper.

If you need to restart it:

```bash
cd video
npm run studio
```

## What is in here

- `video/src/Video.tsx` — master timeline, audio, scene sequences, full-screen meme cards
- `video/src/scenes/` — 51 scenes in seven chapter files
- `video/src/lib/` — rough.js sketch primitives, layout kit, meme overlay
- `video/src/data/words.json` — word-level Whisper alignment used for speech-locked reveals
- `video/public/audio.wav` — narration

## Format

- 1920×1080, 30 fps
- 1194.88 s narration
- Dracula palette (`#282A36`)
- Patrick Hand / Caveat / DejaVu Sans Mono
- 4–6 frame fade through the background at scene cuts

## Notes

- The meme captions are drawn by Remotion over the supplied meme templates, so the text stays crisp at 1080p.
- `whisper_words.json` was produced with faster-whisper `small.en` on CPU. The script words were aligned to the audio with difflib, and gaps were interpolated.

## 2K Colab render

The notebook `render_2k_colab.ipynb` renders this project at **2560 × 1440** and writes resumable chunks, logs, stills, and the final MP4 to Google Drive.

- Open it in Colab:
  `https://colab.research.google.com/github/lroe/softmax/blob/main/render_2k_colab.ipynb`
- The first Drive cell asks for Google Drive permission. Nothing is written to Drive before that.
- Output folder: `MyDrive/SoftmaxGate2K/`
- The renderer streams live frame counts, FPS, chunk number, and ETA.
- Every 20-second chunk is synced to Drive; rerunning skips finished chunks.
- `skill.md` is deliberately excluded from the repository.

