import React from "react";
import {AbsoluteFill, Easing, interpolate, staticFile, useCurrentFrame} from "remotion";
import {loadFont} from "@remotion/fonts";
import {at} from "../timing";
import {C, FPS} from "../theme";
import {Canvas} from "../lib/scene";
import {
  Arrow,
  Head,
  Label,
  Pop,
  RichText,
  SketchArc,
  SketchCircle,
  SketchEllipse,
  SketchLine,
  SketchPath,
  SketchRect,
  Underline,
  clamp01,
} from "../lib/Sketch";
import {Cloud, SpeechBubble, WordChip, easeOut} from "../lib/kit";

loadFont({
  family: "Patrick Hand",
  url: staticFile("fonts/PatrickHand.ttf"),
  weight: "400",
  format: "truetype",
}).catch(() => undefined);

loadFont({
  family: "Caveat",
  url: staticFile("fonts/Caveat.ttf"),
  weight: "400 700",
  format: "truetype",
}).catch(() => undefined);

loadFont({
  family: "DejaVu Sans Mono",
  url: staticFile("fonts/DejaVuSansMono.ttf"),
  weight: "400",
  format: "truetype",
}).catch(() => undefined);

/* ------------------------------------------------------------------ */
/*  word-locked beats                                                  */
/* ------------------------------------------------------------------ */

const F = (phrase: string, occ = 0) => Math.round(at(phrase, occ) * FPS);
const S = (frame: number) => frame / FPS;

const F_LAST = F("Last");
const F_DM = F("DeepMind");
const F_BUG = F("bug");
const F_THEBUG = F("The bug");
const F_BEST = F("best");
const F_ZERO = F("zero");
const F_MOMENT = F("moment");
const F_SURE = F("most");
const F_SUREWORD = F("sure");
const F_JAX = F("JAX");
const F_PT = F("PyTorch");
const F_TF = F("TensorFlow");
const F_TB = F("textbooks");
const F_HALF = 646; // 21.52 s, "half"
const F_SAME = F("The same month");
const F_NOWORDS = F("No words");
const F_ONLY = F("only speaks");

/* ------------------------------------------------------------------ */
/*  camera                                                             */
/* ------------------------------------------------------------------ */

type CamKey = {f: number; x: number; y: number; z: number};

const CAM_KEYS: CamKey[] = [
  {f: 0, x: 960, y: 500, z: 1.0},
  {f: 100, x: 960, y: 490, z: 1.0},
  {f: 200, x: 1000, y: 460, z: 1.02},
  {f: 300, x: 1120, y: 420, z: 1.04},
  {f: 390, x: 1120, y: 460, z: 1.04},
  {f: 510, x: 960, y: 400, z: 1.02},
  {f: 600, x: 1000, y: 500, z: 1.0},
  {f: 645, x: 960, y: 560, z: 0.92},
  {f: 900, x: 960, y: 560, z: 0.92},
];

const CameraRig: React.FC<{children: React.ReactNode}> = ({children}) => {
  const frame = useCurrentFrame();
  const fs = CAM_KEYS.map((k) => k.f);
  const ease = Easing.inOut(Easing.cubic);
  const x = interpolate(frame, fs, CAM_KEYS.map((k) => k.x), {
    easing: ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(frame, fs, CAM_KEYS.map((k) => k.y), {
    easing: ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const zoom = interpolate(frame, fs, CAM_KEYS.map((k) => k.z), {
    easing: ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <g transform={`translate(${960 - x * zoom} ${540 - y * zoom}) scale(${zoom})`}>
      {children}
    </g>
  );
};

/* ------------------------------------------------------------------ */
/*  dim helpers                                                        */
/* ------------------------------------------------------------------ */

const useKeys = (keys: [number, number][]) => {
  const frame = useCurrentFrame();
  return interpolate(
    frame,
    keys.map((k) => k[0]),
    keys.map((k) => k[1]),
    {
      easing: Easing.inOut(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
};

/* ------------------------------------------------------------------ */
/*  tactile cards                                                      */
/* ------------------------------------------------------------------ */

const TokenCard: React.FC<{
  text: string;
  x: number;
  y: number;
  w: number;
  h?: number;
  start: number;
  color: string;
  seed: number;
  target?: boolean;
}> = ({text, x, y, w, h = 72, start, color, seed, target = false}) => (
  <g>
    {target ? (
      <SketchRect
        x={x - w / 2 + 10}
        y={y - h / 2 + 10}
        w={w}
        h={h}
        start={start}
        dur={0.4}
        stroke={color}
        strokeWidth={3}
        fill="none"
        radius={12}
        seed={seed - 1}
        opacity={0.28}
      />
    ) : null}
    <SketchRect
      x={x - w / 2}
      y={y - h / 2}
      w={w}
      h={h}
      start={start}
      dur={0.3}
      stroke={color}
      strokeWidth={3.2}
      fill={C.panel}
      radius={12}
      seed={seed}
      roughness={1.1}
    />
    <SketchLine
      x1={x - w / 2 + 14}
      y1={y - h / 2 + 9}
      x2={x + w / 2 - 14}
      y2={y - h / 2 + 9}
      start={start + 0.22}
      dur={0.2}
      stroke={color}
      strokeWidth={3}
      seed={seed + 1}
      opacity={0.35}
    />
    <SketchCircle
      x={x - w / 2 + 16}
      y={y - h / 2 + 17}
      d={7}
      start={start + 0.2}
      dur={0.15}
      stroke={color}
      fill={color}
      seed={seed + 2}
      opacity={0.9}
    />
    <Label
      text={text}
      x={x}
      y={y + 7}
      size={44}
      color={color}
      start={start + 0.1}
      dur={0.3}
      font="Patrick Hand"
    />
  </g>
);

/* ------------------------------------------------------------------ */
/*  model + scores                                                     */
/* ------------------------------------------------------------------ */

const ModelBlock: React.FC<{start: number}> = ({start}) => (
  <g>
    <SketchRect
      x={780}
      y={330}
      w={260}
      h={200}
      start={start}
      dur={0.45}
      stroke={C.fg}
      strokeWidth={3.2}
      fill={C.panel}
      radius={14}
      seed={310}
      roughness={1.15}
    />
    <Label text="model" x={910} y={368} size={56} color={C.fg} start={start + 0.32} font="Patrick Hand" />
    <SketchLine
      x1={802}
      y1={396}
      x2={1018}
      y2={396}
      start={start + 0.4}
      dur={0.25}
      stroke={C.soft}
      strokeWidth={3}
      seed={311}
      opacity={0.4}
    />
    {["0.21", "-0.11", "0.32"].map((v, i) => (
      <g key={v}>
        <SketchRect
          x={802}
          y={402 + i * 42}
          w={216}
          h={38}
          start={start + 0.5 + i * 0.1}
          dur={0.26}
          stroke={C.line}
          strokeWidth={3}
          fill={C.well}
          radius={5}
          seed={312 + i}
          roughness={0.9}
        />
        <Label
          text={v}
          x={910}
          y={422 + i * 42}
          size={40}
          color={C.cyan}
          start={start + 0.6 + i * 0.1}
          dur={0.24}
          font="DejaVu Sans Mono"
        />
      </g>
    ))}
  </g>
);

const ScoreStack: React.FC<{start: number}> = ({start}) => (
  <g>
    <Label text="scores" x={1164} y={310} size={40} color={C.soft} start={start} font="Patrick Hand" />
    {["3.2", "1.1", "0.4"].map((v, i) => (
      <g key={v}>
        <SketchRect
          x={1096}
          y={340 + i * 60}
          w={138}
          h={52}
          start={start + 0.12 + i * 0.09}
          dur={0.26}
          stroke={C.line}
          strokeWidth={3}
          fill={C.well}
          radius={7}
          seed={330 + i}
          roughness={0.95}
        />
        <Label
          text={v}
          x={1165}
          y={367 + i * 60}
          size={40}
          color={C.orange}
          start={start + 0.24 + i * 0.09}
          dur={0.24}
          font="DejaVu Sans Mono"
        />
      </g>
    ))}
  </g>
);

/* ------------------------------------------------------------------ */
/*  the gate                                                           */
/* ------------------------------------------------------------------ */

const SoftmaxGate: React.FC<{start: number; crackStart: number; highlightStart: number}> = ({
  start,
  crackStart,
  highlightStart,
}) => (
  <g>
    <SketchPath
      d="M 1341 540 L 1341 344 Q 1445 236 1549 344 L 1549 540 Z"
      start={start}
      dur={0.5}
      stroke="none"
      fill={C.well}
      seed={401}
      opacity={0.6}
    />
    <SketchRect
      x={1330}
      y={340}
      w={22}
      h={200}
      start={start}
      dur={0.4}
      stroke={C.purple}
      strokeWidth={3}
      fill={C.purple}
      radius={3}
      seed={402}
      roughness={1.15}
    />
    <SketchRect
      x={1538}
      y={340}
      w={22}
      h={200}
      start={start + 0.08}
      dur={0.4}
      stroke={C.purple}
      strokeWidth={3}
      fill={C.purple}
      radius={3}
      seed={403}
      roughness={1.15}
    />
    <SketchPath
      d="M 1341 344 Q 1445 236 1549 344"
      start={start + 0.16}
      dur={0.55}
      stroke={C.purple}
      strokeWidth={5}
      seed={404}
      roughness={1}
    />
    <SketchLine
      x1={1326}
      y1={540}
      x2={1564}
      y2={540}
      start={start + 0.26}
      dur={0.4}
      stroke={C.purple}
      strokeWidth={5}
      seed={405}
    />
    <SketchLine
      x1={1326}
      y1={549}
      x2={1352}
      y2={549}
      start={start + 0.42}
      dur={0.2}
      stroke={C.purple}
      strokeWidth={3}
      seed={406}
    />
    <SketchLine
      x1={1538}
      y1={549}
      x2={1564}
      y2={549}
      start={start + 0.46}
      dur={0.2}
      stroke={C.purple}
      strokeWidth={3}
      seed={407}
    />
    <Label
      text="softmax"
      x={1445}
      y={462}
      size={52}
      color={C.purple}
      start={S(122)}
      dur={0.32}
      font="Patrick Hand"
      letterSpacing={-1}
    />
    <SketchPath
      d="M 1531 320 L 1546 352 L 1534 396 L 1550 442 L 1538 494 L 1547 542"
      start={crackStart}
      dur={0.5}
      stroke={C.red}
      strokeWidth={4.2}
      seed={409}
      roughness={1.2}
    />
    <SketchLine
      x1={1534}
      y1={396}
      x2={1512}
      y2={412}
      start={crackStart + 0.25}
      dur={0.2}
      stroke={C.red}
      strokeWidth={3}
      seed={410}
    />
    <SketchLine
      x1={1550}
      y1={442}
      x2={1568}
      y2={426}
      start={crackStart + 0.3}
      dur={0.2}
      stroke={C.red}
      strokeWidth={3}
      seed={411}
    />
    <Label text="bug" x={1445} y={374} size={40} color={C.red} start={crackStart + 0.18} dur={0.28} font="Patrick Hand" />
  </g>
);

/* ------------------------------------------------------------------ */
/*  probabilities                                                      */
/* ------------------------------------------------------------------ */

const ProbRow: React.FC<{
  x: number;
  y: number;
  w: number;
  word: string;
  pct: number;
  tint: string;
  textColor: string;
  start: number;
  seed: number;
}> = ({x, y, w, word, pct, tint, textColor, start, seed}) => {
  const frame = useCurrentFrame();
  const p = easeOut(clamp01((frame / FPS - start) / 0.65));
  const bw = Math.max(2, (pct / 62) * w * p);
  return (
    <g>
      <Label text={word} x={x} y={y} size={40} color={textColor} align="left" start={start} dur={0.3} font="Patrick Hand" />
      <Label
        text={`${pct}%`}
        x={x + w}
        y={y}
        size={40}
        color={textColor}
        align="right"
        start={start + 0.18}
        dur={0.3}
        font="DejaVu Sans Mono"
      />
      <SketchRect
        x={x}
        y={y + 13}
        w={w}
        h={16}
        start={start - 0.12}
        dur={0.3}
        stroke={C.line}
        strokeWidth={3}
        fill={C.well}
        radius={8}
        seed={seed}
        roughness={0.85}
      />
      <SketchRect
        x={x}
        y={y + 13}
        w={bw}
        h={16}
        start={start}
        dur={0.2}
        stroke={tint}
        strokeWidth={3}
        fill={tint}
        radius={8}
        seed={seed + 1}
        roughness={0.8}
        opacity={0.92}
      />
    </g>
  );
};

const ProbBlock: React.FC<{start: number}> = ({start}) => (
  <g>
    <Label text="chances" x={1710} y={290} size={40} color={C.soft} start={start} font="Patrick Hand" />
    <ProbRow x={1596} y={336} w={228} word="mat" pct={62} tint={C.orange} textColor={C.orange} start={start + 0.06} seed={440} />
    <ProbRow x={1596} y={396} w={228} word="rug" pct={21} tint={C.dim} textColor={C.soft} start={start + 0.24} seed={442} />
    <ProbRow x={1596} y={456} w={228} word="floor" pct={9} tint={C.dim} textColor={C.soft} start={start + 0.42} seed={444} />
    <ProbRow x={1596} y={516} w={228} word="bed" pct={8} tint={C.dim} textColor={C.soft} start={start + 0.6} seed={446} />
  </g>
);

/* ------------------------------------------------------------------ */
/*  paper                                                              */
/* ------------------------------------------------------------------ */

const PaperCard: React.FC<{start: number}> = ({start}) => (
  <Pop start={start} x={1440} y={190} scaleFrom={0.88} duration={0.55}>
    <SketchRect
      x={1290}
      y={120}
      w={300}
      h={140}
      start={start}
      dur={0.5}
      stroke={C.fg}
      strokeWidth={3.2}
      fill={C.panel}
      radius={12}
      seed={470}
      roughness={1.15}
    />
    <SketchLine
      x1={1310}
      y1={134}
      x2={1570}
      y2={134}
      start={start + 0.18}
      dur={0.25}
      stroke={C.purple}
      strokeWidth={3}
      seed={471}
      opacity={0.55}
    />
    <SketchPath
      d="M 1304 146 L 1332 146 L 1342 156 L 1342 194 L 1304 194 Z"
      start={start + 0.2}
      dur={0.35}
      stroke={C.soft}
      strokeWidth={3}
      seed={472}
      fill={C.well}
      roughness={0.9}
    />
    <SketchLine
      x1={1332}
      y1={146}
      x2={1332}
      y2={156}
      start={start + 0.35}
      dur={0.18}
      stroke={C.soft}
      strokeWidth={3}
      seed={473}
    />
    <SketchLine
      x1={1312}
      y1={166}
      x2={1334}
      y2={166}
      start={start + 0.4}
      dur={0.18}
      stroke={C.soft}
      strokeWidth={3}
      seed={474}
      opacity={0.6}
    />
    <SketchLine
      x1={1312}
      y1={176}
      x2={1328}
      y2={176}
      start={start + 0.44}
      dur={0.18}
      stroke={C.soft}
      strokeWidth={3}
      seed={475}
      opacity={0.6}
    />
    <Label text="DeepMind" x={1466} y={186} size={56} color={C.fg} start={start + 0.3} dur={0.32} font="Patrick Hand" />
    <Underline x={1466} y={218} w={210} start={start + (F_DM - F_LAST) / FPS} color={C.yellow} width={3} />
    <SketchLine
      x1={1358}
      y1={232}
      x2={1568}
      y2={232}
      start={start + 0.46}
      dur={0.22}
      stroke={C.line}
      strokeWidth={3}
      seed={476}
      opacity={0.6}
    />
    <SketchLine
      x1={1358}
      y1={246}
      x2={1498}
      y2={246}
      start={start + 0.5}
      dur={0.22}
      stroke={C.line}
      strokeWidth={3}
      seed={477}
      opacity={0.45}
    />
  </Pop>
);

/* ------------------------------------------------------------------ */
/*  signal meter                                                       */
/* ------------------------------------------------------------------ */

const SignalMeter: React.FC<{start: number; drain: number}> = ({start, drain}) => {
  const frame = useCurrentFrame();
  const p = clamp01((frame - drain) / 18);
  const left = 1442;
  const width = 130;
  const fill = width * (1 - p);
  return (
    <g>
      <Label text="signal" x={1284} y={656} size={40} color={C.soft} align="left" start={start} dur={0.3} font="Patrick Hand" />
      <SketchRect
        x={left}
        y={648}
        w={width}
        h={14}
        start={start}
        dur={0.3}
        stroke={C.line}
        strokeWidth={3}
        fill={C.well}
        radius={7}
        seed={450}
        roughness={0.9}
      />
      {fill > 2 ? (
        <SketchRect
          x={left}
          y={648}
          w={fill}
          h={14}
          start={start + 0.1}
          dur={0.2}
          stroke={C.green}
          strokeWidth={3}
          fill={C.green}
          radius={7}
          seed={451}
          roughness={0.8}
          opacity={0.95}
        />
      ) : null}
      {fill > 2 ? (
        <SketchCircle
          x={left + fill}
          y={655}
          d={24}
          start={start + 0.15}
          dur={0.2}
          stroke={C.green}
          strokeWidth={3}
          fill={C.green}
          seed={452}
        />
      ) : null}
      {[0, 1, 2, 3, 4].map((i) => (
        <SketchLine
          key={i}
          x1={left + i * 32}
          y1={670}
          x2={left + i * 32}
          y2={678}
          start={start + 0.2 + i * 0.04}
          dur={0.15}
          stroke={C.line}
          strokeWidth={3}
          seed={453 + i}
        />
      ))}
    </g>
  );
};

/* ------------------------------------------------------------------ */
/*  confidence                                                         */
/* ------------------------------------------------------------------ */

const ConfidenceReadout: React.FC<{start: number; done: number; sure: number}> = ({start, done, sure}) => {
  const frame = useCurrentFrame();
  const p = clamp01((frame - start) / Math.max(1, done - start));
  const value = 99.0 + 0.9 * easeOut(p);
  const q = clamp01((frame - start) / 18);
  const angle = Math.PI - Math.PI * 0.997 * q;
  const nx = 744 + 30 * Math.cos(angle);
  const ny = 300 - 30 * Math.sin(angle);
  return (
    <g>
      <SketchRect
        x={780}
        y={314}
        w={320}
        h={16}
        start={S(start)}
        dur={0.35}
        stroke={C.line}
        strokeWidth={3}
        fill={C.well}
        radius={8}
        seed={490}
      />
      <SketchRect
        x={780}
        y={314}
        w={319}
        h={16}
        start={S(start) + 0.12}
        dur={0.45}
        stroke={C.orange}
        strokeWidth={3}
        fill={C.orange}
        radius={8}
        seed={491}
      />
      <Label
        text={`${value.toFixed(1)}%`}
        x={930}
        y={274}
        size={96}
        color={C.orange}
        start={S(start)}
        dur={0.4}
        font="DejaVu Sans Mono"
        weight={700}
      />
      <Label text="sure" x={930} y={196} size={40} color={C.soft} start={S(sure)} dur={0.3} font="Patrick Hand" />
    </g>
  );
};

/* ------------------------------------------------------------------ */
/*  lower lane                                                         */
/* ------------------------------------------------------------------ */

const Agent: React.FC<{start: number}> = ({start}) => (
  <g>
    <SketchLine
      x1={240}
      y1={990}
      x2={430}
      y2={990}
      start={start}
      dur={0.3}
      stroke={C.line}
      strokeWidth={3}
      seed={700}
      opacity={0.7}
    />
    <SketchCircle
      x={330}
      y={900}
      d={56}
      start={start}
      dur={0.3}
      stroke={C.fg}
      strokeWidth={3.4}
      seed={701}
    />
    <SketchLine x1={330} y1={928} x2={330} y2={958} start={start + 0.1} dur={0.25} stroke={C.fg} strokeWidth={3.4} seed={702} />
    <SketchLine x1={330} y1={938} x2={298} y2={926} start={start + 0.16} dur={0.22} stroke={C.fg} strokeWidth={3.4} seed={703} />
    <SketchLine x1={298} y1={926} x2={306} y2={916} start={start + 0.22} dur={0.2} stroke={C.fg} strokeWidth={3.4} seed={704} />
    <SketchLine x1={330} y1={928} x2={356} y2={954} start={start + 0.24} dur={0.22} stroke={C.fg} strokeWidth={3.4} seed={705} />
    <SketchLine x1={330} y1={958} x2={308} y2={988} start={start + 0.28} dur={0.22} stroke={C.fg} strokeWidth={3.4} seed={706} />
    <SketchLine x1={330} y1={958} x2={352} y2={988} start={start + 0.32} dur={0.22} stroke={C.fg} strokeWidth={3.4} seed={707} />
    <SketchCircle x={320} y={896} d={5} start={start + 0.4} dur={0.12} stroke={C.fg} fill={C.fg} seed={708} />
    <SketchCircle x={340} y={896} d={5} start={start + 0.44} dur={0.12} stroke={C.fg} fill={C.fg} seed={709} />
  </g>
);

/* ------------------------------------------------------------------ */
/*  scene                                                              */
/* ------------------------------------------------------------------ */

export const WelchScene: React.FC = () => {
  const frame = useCurrentFrame();

  const inputOp = useKeys([
    [0, 1],
    [F_LAST, 1],
    [F_LAST + 14, 0.4],
    [F_BUG - 1, 0.4],
    [F_BUG + 4, 0.28],
  ]);
  const flowOp = useKeys([
    [0, 1],
    [F_LAST, 1],
    [F_LAST + 14, 0.4],
    [F_BUG - 1, 0.4],
    [F_BUG + 4, 0.28],
  ]);
  const gateOp = useKeys([
    [0, 1],
    [F_LAST, 1],
    [F_LAST + 12, 0.42],
    [F_BUG - 10, 0.42],
    [F_BUG + 2, 1],
    [F_BEST, 0.62],
    [F_MOMENT, 0.62],
    [F_MOMENT + 30, 1],
    [F_JAX, 1],
    [F_JAX + 30, 0.66],
  ]);
  const formulaOp = useKeys([
    [0, 1],
    [F_LAST, 1],
    [F_LAST + 12, 0.42],
    [F_BUG, 0.42],
    [F_BUG + 6, 0.3],
  ]);
  const barsOp = useKeys([
    [0, 1],
    [F_LAST, 1],
    [F_LAST + 12, 0.42],
    [F_BUG - 1, 0.42],
    [F_BUG, 0.72],
    [F_BEST, 0.4],
  ]);
  const paperOp = useKeys([
    [0, 0],
    [F_LAST - 2, 0],
    [F_LAST + 2, 1],
    [F_BUG - 1, 1],
    [F_BUG + 8, 0.45],
    [F_BEST, 0.34],
  ]);
  const signalOp = useKeys([
    [0, 0],
    [F_THEBUG - 2, 0],
    [F_THEBUG + 2, 1],
    [F_MOMENT, 1],
    [F_MOMENT + 6, 0.5],
  ]);
  const confOp = useKeys([
    [0, 0],
    [F_MOMENT - 2, 0],
    [F_MOMENT + 2, 1],
    [F_JAX, 1],
    [F_JAX + 20, 0.6],
  ]);
  const fwOp = useKeys([
    [0, 0],
    [F_JAX - 4, 0],
    [F_JAX, 1],
  ]);
  const pointerOp = useKeys([
    [0, 0],
    [F_BEST - 2, 0],
    [F_BEST + 2, 1],
    [F_ZERO + 20, 1],
    [F_ZERO + 34, 0],
  ]);
  const confArrowOp = useKeys([
    [0, 0],
    [F_MOMENT - 2, 0],
    [F_MOMENT + 2, 1],
    [F_JAX, 1],
    [F_JAX + 18, 0],
  ]);
  const topDim = useKeys([
    [0, 1],
    [F_SAME, 1],
    [F_SAME + 18, 0.3],
  ]);
  const laneOp = useKeys([
    [0, 0],
    [F_HALF, 0],
    [F_HALF + 18, 1],
  ]);
  const loopOp = useKeys([
    [0, 0],
    [F_SAME, 0],
    [F_SAME + 10, 1],
    [F_NOWORDS, 1],
    [F_NOWORDS + 12, 0],
  ]);
  const fadeOut = interpolate(frame, [894, 899], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{backgroundColor: C.bg}}>
      <Canvas>
        <defs>
          <pattern id="welch-dots" width={54} height={54} patternUnits="userSpaceOnUse">
            <circle cx={2} cy={2} r={1.5} fill={C.line} />
          </pattern>
        </defs>
        <rect x={0} y={0} width={1920} height={1080} fill="url(#welch-dots)" opacity={0.42} />

        <CameraRig>
          {/* ---------------- top lane: the word route ---------------- */}
          <g opacity={topDim}>
            {/* flow paths, behind the cards */}
            <g opacity={flowOp}>
              <SketchPath
                d="M 120 432 Q 122 454 146 454 L 512 454 Q 528 454 530 436"
                start={0.22}
                dur={0.4}
                stroke={C.cyan}
                strokeWidth={3}
                seed={101}
                roughness={1}
              />
              <Arrow x1={530} y1={436} x2={772} y2={430} start={0.3} dur={0.4} stroke={C.cyan} strokeWidth={3.2} head={16} seed={102} curve={4} />
              <Arrow x1={1046} y1={430} x2={1086} y2={430} start={0.66} dur={0.3} stroke={C.soft} strokeWidth={3} head={13} seed={103} />
              <Arrow x1={1240} y1={430} x2={1316} y2={430} start={0.98} dur={0.32} stroke={C.purple} strokeWidth={3.2} head={14} seed={104} />
              <Arrow x1={1564} y1={430} x2={1588} y2={430} start={1.24} dur={0.3} stroke={C.orange} strokeWidth={3} head={10} seed={105} />
            </g>

            {/* input */}
            <g opacity={inputOp}>
              <TokenCard text="the" x={168} y={370} w={96} start={-0.3} color={C.cyan} seed={120} />
              <TokenCard text="cat" x={276} y={370} w={96} start={-0.22} color={C.cyan} seed={122} />
              <TokenCard text="sat" x={384} y={370} w={96} start={-0.14} color={C.cyan} seed={124} />
              <TokenCard text="on" x={486} y={370} w={84} start={-0.06} color={C.cyan} seed={126} />
              <TokenCard text="mat" x={630} y={370} w={104} start={-0.1} color={C.orange} seed={128} target />
              <Label text="next" x={630} y={286} size={40} color={C.soft} start={0.24} dur={0.3} font="Patrick Hand" />
              <Arrow x1={630} y1={310} x2={630} y2={328} start={0.36} dur={0.25} stroke={C.orange} strokeWidth={3} head={11} seed={129} />
              <ModelBlock start={0.16} />
              <ScoreStack start={0.42} />
            </g>

            {/* gate */}
            <g opacity={gateOp}>
              <SoftmaxGate start={0.18} crackStart={S(F_BUG)} highlightStart={S(122)} />
            </g>

            {/* formula, only after the concrete bars */}
            <g opacity={formulaOp}>
              <RichText
                parts={[
                  {t: "softmax(z) = ", c: C.purple},
                  {t: "e^z", c: C.orange},
                  {t: " / ", c: C.purple},
                  {t: "Σe^z", c: C.orange},
                ]}
                x={1445}
                y={600}
                size={40}
                font="DejaVu Sans Mono"
                weight={600}
                start={S(123)}
                dur={0.5}
              />
            </g>

            {/* probabilities */}
            <g opacity={barsOp}>
              <ProbBlock start={0.55} />
            </g>

            {/* paper */}
            <g opacity={paperOp}>
              <PaperCard start={S(F_LAST)} />
            </g>

            {/* signal */}
            <g opacity={signalOp}>
              <SignalMeter start={S(F_THEBUG)} drain={F_ZERO} />
              <Label text="0" x={1610} y={652} size={72} color={C.red} start={S(F_ZERO)} dur={0.3} font="DejaVu Sans Mono" weight={700} />
            </g>

            {/* pointers */}
            <g opacity={pointerOp}>
              <Arrow x1={1372} y1={706} x2={1446} y2={660} start={S(F_BEST)} dur={0.35} stroke={C.yellow} strokeWidth={4} head={16} seed={140} curve={16} />
            </g>

            {/* confidence */}
            <g opacity={confOp}>
              <ConfidenceReadout start={F_MOMENT} done={F_SURE} sure={F_SUREWORD} />
            </g>
            <g opacity={confArrowOp}>
              <SketchPath d="M 1110 252 Q 1210 168 1326 332" start={S(F_MOMENT)} dur={0.55} stroke={C.yellow} strokeWidth={3.4} seed={141} roughness={0.9} />
              <Head x={1326} y={332} angle={0.96} start={S(F_MOMENT) + 0.5} color={C.yellow} size={16} />
            </g>

            {/* frameworks */}
            <g opacity={fwOp}>
              <WordChip text="JAX" x={700} y={712} w={118} h={58} start={S(F_JAX)} color={C.purple} size={44} seed={160} />
              <WordChip text="PyTorch" x={915} y={722} w={196} h={58} start={S(F_PT)} color={C.orange} size={44} seed={162} />
              <WordChip text="TensorFlow" x={1180} y={710} w={262} h={58} start={S(F_TF)} color={C.yellow} size={44} seed={164} />
              <WordChip text="textbooks" x={1475} y={720} w={240} h={58} start={S(F_TB)} color={C.cyan} size={44} seed={166} />
            </g>
          </g>

          {/* ---------------- bottom lane: silent thinking ---------------- */}
          <g opacity={laneOp}>
            <rect x={190} y={756} width={1540} height={238} rx={26} fill={C.well} opacity={0.5} />
            <rect
              x={190}
              y={756}
              width={1540}
              height={238}
              rx={26}
              fill="none"
              stroke={C.line}
              strokeWidth={3}
              strokeDasharray="12 14"
              opacity={0.85}
            />

            <Agent start={S(650)} />
            <Label text="silent" x={250} y={790} size={40} color={C.cyan} start={S(650)} dur={0.3} font="Patrick Hand" />

            <Cloud x={470} y={800} w={260} h={160} start={S(660)} color={C.cyan} fill={C.panel} dotColor={C.cyan} seed={800} />
            <SketchCircle x={340} y={866} d={8} start={S(668)} dur={0.15} stroke={C.cyan} fill={C.cyan} seed={801} />
            <SketchCircle x={348} y={854} d={11} start={S(672)} dur={0.15} stroke={C.cyan} fill={C.cyan} seed={802} />
            <SketchCircle x={356} y={841} d={14} start={S(676)} dur={0.15} stroke={C.cyan} fill={C.cyan} seed={803} />

            <g opacity={loopOp}>
              <SketchPath
                d="M 650 806 C 706 744 812 742 852 790 C 878 824 838 858 798 840"
                start={S(F_SAME)}
                dur={0.6}
                stroke={C.cyan}
                strokeWidth={3}
                seed={810}
                roughness={0.85}
                opacity={0.85}
              />
              <Head x={798} y={840} angle={-2.72} start={S(F_SAME) + 0.55} color={C.cyan} size={15} />
            </g>

            <g>
              <SpeechBubble x={890} y={828} w={330} h={120} start={S(F_NOWORDS)} color={C.soft} fill={C.panel} tail="left" seed={820}>
                <Label text="..." x={890} y={820} size={72} color={C.soft} start={S(F_NOWORDS) + 0.25} dur={0.3} font="Patrick Hand" />
              </SpeechBubble>
              <WordChip text="tool_call()" x={1250} y={850} w={310} h={72} start={S(F_ONLY)} color={C.cyan} size={40} seed={830} mono />
              <Arrow x1={1058} y1={818} x2={1092} y2={842} start={S(F_ONLY) + 0.15} dur={0.3} stroke={C.cyan} strokeWidth={3} head={11} seed={831} curve={-6} />
              <Underline x={1250} y={898} w={250} start={S(F_ONLY + 6)} color={C.yellow} width={3.5} />
            </g>
          </g>
        </CameraRig>

        <rect x={0} y={0} width={1920} height={1080} fill={C.bg} opacity={fadeOut} />
      </Canvas>
    </AbsoluteFill>
  );
};

export default WelchScene;
