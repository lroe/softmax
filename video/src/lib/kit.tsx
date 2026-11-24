import React from "react";
import {useCurrentFrame, useVideoConfig} from "remotion";
import {C} from "../theme";
import {Arrow, Label, RichText, SketchArc, SketchCircle, SketchLine, SketchPath, SketchPolygon, SketchRect, clamp01, PanelBox} from "./Sketch";

export const useT = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return frame / fps;
};

export const easeOut = (p: number) => 1 - Math.pow(1 - clamp01(p), 3);

export const prog = (t: number, start: number, dur = 0.45) => clamp01((t - start) / dur);

/** Word / token chip. */
export const WordChip: React.FC<{
  text: string;
  x: number;
  y: number;
  w?: number;
  h?: number;
  start?: number;
  color?: string;
  fill?: string;
  size?: number;
  seed?: number;
  mono?: boolean;
}> = ({text, x, y, w, h = 62, start = 0, color = C.orange, fill = C.well, size = 40, seed = 5, mono = false}) => {
  const width = w ?? Math.max(84, text.length * size * 0.62 + 36);
  return (
    <g>
      <SketchRect x={x - width / 2} y={y - h / 2} w={width} h={h} start={start} dur={0.32} stroke={color} fill={fill} strokeWidth={3} radius={10} seed={seed} />
      <Label text={text} x={x} y={y + 1} size={size} color={color} start={start + 0.1} dur={0.3} font={mono ? "DejaVu Sans Mono" : "Patrick Hand"} />
    </g>
  );
};

/** A horizontal strip of number cells (hidden state / embedding). */
export const VectorStrip: React.FC<{
  x: number;
  y: number;
  n?: number;
  cell?: number;
  start?: number;
  color?: string;
  fill?: string;
  values?: string[];
  highlight?: number[];
  seed?: number;
  label?: string;
  showValues?: boolean;
}> = ({x, y, n = 12, cell = 52, start = 0, color = C.cyan, fill = C.well, values, highlight = [], seed = 20, label, showValues = true}) => {
  return (
    <g>
      {Array.from({length: n}).map((_, i) => (
        <g key={i}>
          <SketchRect
            x={x + i * cell}
            y={y - cell / 2}
            w={cell - 6}
            h={cell}
            start={start + i * 0.028}
            dur={0.22}
            stroke={highlight.includes(i) ? C.fg : color}
            fill={fill}
            strokeWidth={highlight.includes(i) ? 4 : 2.4}
            radius={5}
            seed={seed + i}
            roughness={0.9}
          />
          {showValues ? (
            <Label
              text={values?.[i] ?? `${((i * 37) % 9) - 4}`}
              x={x + i * cell + (cell - 6) / 2}
              y={y + 2}
              size={Math.min(28, cell * 0.44)}
              color={highlight.includes(i) ? C.fg : C.soft}
              start={start + 0.1 + i * 0.028}
              dur={0.2}
              font="DejaVu Sans Mono"
            />
          ) : (
            <SketchCircle x={x + i * cell + (cell - 6) / 2} y={y} d={10} start={start + 0.08 + i * 0.028} dur={0.15} stroke={color} fill={color} seed={seed + 40 + i} />
          )}
        </g>
      ))}
      {label ? <Label text={label} x={x + (n * cell) / 2} y={y + cell * 0.95} size={38} color={C.soft} start={start + 0.4} /> : null}
    </g>
  );
};

/** Horizontal bar with a percentage label. */
export const Bar: React.FC<{
  x: number;
  y: number;
  w: number;
  h?: number;
  value: number;
  max?: number;
  start?: number;
  color?: string;
  label?: string;
  valueText?: string;
  labelSize?: number;
  seed?: number;
}> = ({x, y, w, h = 46, value, max = 100, start = 0, color = C.green, label, valueText, labelSize = 40, seed = 40}) => {
  const t = useT();
  const p = easeOut(prog(t, start, 0.7));
  const bw = Math.max(2, (value / max) * w * p);
  return (
    <g>
      {label ? (
        <Label text={label} x={x + w / 2} y={y + h + 32} size={labelSize} color={C.soft} start={start} dur={0.3} />
      ) : null}
      <SketchRect x={x} y={y} w={w} h={h} start={start - 0.1} dur={0.3} stroke={C.line} fill={C.well} strokeWidth={2.4} radius={7} seed={seed} />
      <SketchRect x={x} y={y} w={bw} h={h} start={start} dur={0.25} stroke={color} fill={color} strokeWidth={2} radius={7} seed={seed + 1} opacity={0.92} />
      <Label text={valueText ?? `${value}%`} x={x + bw + 20} y={y + h / 2 + 1} size={labelSize} color={color} align="left" start={start + 0.45} dur={0.3} font="DejaVu Sans Mono" />
    </g>
  );
};

/** Simple axis chart with a polyline. */
export const LineChart: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  points: [number, number][];
  start?: number;
  color?: string;
  axisColor?: string;
  xLabel?: string;
  yLabel?: string;
  labelSize?: number;
  seed?: number;
  markers?: {at: number; text: string; color?: string}[];
}> = ({x, y, w, h, points, start = 0, color = C.orange, axisColor = C.soft, xLabel, yLabel, labelSize = 38, seed = 60, markers = []}) => {
  const t = useT();
  const p = easeOut(prog(t, start, 1.4));
  const path = points
    .map(([px, py], i) => `${i === 0 ? "M" : "L"} ${x + px * w} ${y + h - py * h}`)
    .join(" ");
  return (
    <g>
      <SketchLine x1={x} y1={y} x2={x} y2={y + h} start={start - 0.35} dur={0.35} stroke={axisColor} strokeWidth={3} seed={seed} />
      <SketchLine x1={x} y1={y + h} x2={x + w} y2={y + h} start={start - 0.25} dur={0.35} stroke={axisColor} strokeWidth={3} seed={seed + 1} />
      <SketchPath d={path} start={start} dur={1.2} stroke={color} strokeWidth={4.5} seed={seed + 2} progress={p} roughness={0.7} bowing={0.6} />
      {xLabel ? <Label text={xLabel} x={x + w / 2} y={y + h + 44} size={labelSize} color={C.soft} start={start + 0.3} /> : null}
      {yLabel ? <Label text={yLabel} x={x - 26} y={y} size={labelSize} color={C.soft} align="right" start={start + 0.3} /> : null}
      {markers.map((m, i) => (
        <g key={i}>
          <SketchCircle x={x + m.at * w} y={y + h - 12} d={12} start={start + 0.8 + i * 0.1} dur={0.18} stroke={m.color ?? C.red} fill={m.color ?? C.red} seed={seed + 30 + i} />
          <Label text={m.text} x={x + m.at * w} y={y - 26 - i * 4} size={labelSize} color={m.color ?? C.red} start={start + 0.9 + i * 0.1} />
        </g>
      ))}
    </g>
  );
};

/** Big hand-drawn gate: the recurring metaphor for softmax. */
export const Gate: React.FC<{
  x: number;
  y: number;
  w?: number;
  h?: number;
  start?: number;
  color?: string;
  fill?: string;
  label?: string;
  leak?: number;
  subtitle?: string;
  leakStart?: number;
  seed?: number;
}> = ({x, y, w = 300, h = 380, start = 0, color = C.purple, fill = C.panel, label = "softmax", leak = 0, subtitle, leakStart = 0, seed = 70}) => {
  const t = useT();
  const lp = prog(t, leakStart, 0.6);
  return (
    <g>
      {/* posts + arch */}
      <SketchRect x={x} y={y} w={44} h={h} start={start} dur={0.45} stroke={color} fill={color} strokeWidth={4} radius={4} seed={seed} />
      <SketchRect x={x + w - 44} y={y} w={44} h={h} start={start + 0.1} dur={0.45} stroke={color} fill={color} strokeWidth={4} radius={4} seed={seed + 1} />
      <SketchPath
        d={`M ${x + 22} ${y + 8} Q ${x + w / 2} ${y - 130} ${x + w - 22} ${y + 8}`}
        start={start + 0.2}
        dur={0.6}
        stroke={color}
        strokeWidth={5}
        seed={seed + 2}
        roughness={1}
      />
      <SketchLine x1={x + 22} y1={y + h} x2={x + w - 22} y2={y + h} start={start + 0.3} dur={0.4} stroke={color} strokeWidth={5} seed={seed + 12} />
      <Label text={label} x={x + w / 2} y={y + 92} size={56} color={color} start={start + 0.55} />
      {subtitle ? <Label text={subtitle} x={x + w / 2} y={y + 152} size={38} color={C.soft} start={start + 0.7} /> : null}
      {leak > 0 ? (
        <g opacity={lp}>
          <SketchPath
            d={`M ${x + w * 0.64} ${y + h * 0.52} L ${x + w * 0.6} ${y + h * 0.72} L ${x + w * 0.65} ${y + h * 0.88} L ${x + w * 0.61} ${y + h + 22}`}
            start={leakStart}
            dur={0.5}
            stroke={C.red}
            strokeWidth={4.5}
            seed={seed + 8}
          />
          <SketchCircle x={x + w * 0.61} y={y + h + 42} d={12} start={leakStart + 0.35} dur={0.2} stroke={C.red} fill={C.red} seed={seed + 10} />
        </g>
      ) : null}
    </g>
  );
};

/** Transformer as a stack of floors. */
export const FloorStack: React.FC<{
  x: number;
  y: number;
  w?: number;
  h?: number;
  floors?: number;
  start?: number;
  color?: string;
  fill?: string;
  seed?: number;
  topLabel?: string;
  bottomLabel?: string;
  onFloor?: (i: number) => React.ReactNode;
}> = ({x, y, w = 260, h = 420, floors = 5, start = 0, color = C.fg, fill = C.panel, seed = 80, topLabel, bottomLabel, onFloor}) => {
  const gap = 10;
  const fh = (h - gap * (floors - 1)) / floors;
  return (
    <g>
      {Array.from({length: floors}).map((_, i) => (
        <g key={i}>
          <SketchRect x={x} y={y + i * (fh + gap)} w={w} h={fh} start={start + i * 0.09} dur={0.3} stroke={color} fill={fill} strokeWidth={3} radius={5} seed={seed + i} />
          {onFloor ? onFloor(i) : null}
        </g>
      ))}
      {topLabel ? <Label text={topLabel} x={x + w + 24} y={y + 22} size={36} color={C.soft} align="left" start={start + 0.6} /> : null}
      {bottomLabel ? <Label text={bottomLabel} x={x + w + 24} y={y + h - 22} size={36} color={C.soft} align="left" start={start + 0.7} /> : null}
    </g>
  );
};

/** Balance scale, used for the two trade-offs. */
export const Scale: React.FC<{
  x: number;
  y: number;
  w?: number;
  start?: number;
  left: string;
  right: string;
  tilt?: number;
  color?: string;
  seed?: number;
}> = ({x, y, w = 340, start = 0, left, right, tilt = 0, color = C.fg, seed = 90}) => {
  const t = useT();
  const k = prog(t, start + 0.6, 0.8) * tilt;
  const lx = x - w / 2;
  const rx = x + w / 2;
  const ly = y + 80 - k * 40;
  const ry = y + 80 + k * 40;
  return (
    <g>
      <SketchLine x1={x} y1={y - 90} x2={x} y2={y + 120} start={start} dur={0.3} stroke={color} strokeWidth={4} seed={seed} />
      <SketchLine x1={x - 90} y1={y + 120} x2={x + 90} y2={y + 120} start={start + 0.12} dur={0.3} stroke={color} strokeWidth={4} seed={seed + 1} />
      <SketchLine x1={lx} y1={ly - 24} x2={rx} y2={ry - 24} start={start + 0.2} dur={0.4} stroke={color} strokeWidth={4} seed={seed + 2} />
      <SketchLine x1={lx} y1={ly - 24} x2={lx} y2={ly + 8} start={start + 0.35} dur={0.2} stroke={color} strokeWidth={3} seed={seed + 3} />
      <SketchLine x1={rx} y1={ry - 24} x2={rx} y2={ry + 8} start={start + 0.35} dur={0.2} stroke={color} strokeWidth={3} seed={seed + 4} />
      <SketchPath d={`M ${lx - 74} ${ly + 8} L ${lx + 74} ${ly + 8} L ${lx + 54} ${ly + 66} L ${lx - 54} ${ly + 66} Z`} start={start + 0.38} dur={0.3} stroke={color} fill={C.panel} seed={seed + 5} />
      <SketchPath d={`M ${rx - 74} ${ry + 8} L ${rx + 74} ${ry + 8} L ${rx + 54} ${ry + 66} L ${rx - 54} ${ry + 66} Z`} start={start + 0.42} dur={0.3} stroke={color} fill={C.panel} seed={seed + 6} />
      <Label text={left} x={lx} y={ly + 38} size={38} color={C.orange} start={start + 0.7} />
      <Label text={right} x={rx} y={ry + 38} size={38} color={C.cyan} start={start + 0.8} />
    </g>
  );
};

/** A memory / brain blob with dots. */
export const Brain: React.FC<{x: number; y: number; scale?: number; start?: number; color?: string; dots?: boolean; seed?: number}> = ({
  x, y, scale = 1, start = 0, color = C.cyan, dots = true, seed = 100,
}) => {
  const t = useT();
  const d = `M ${x - 90} ${y + 20} C ${x - 135} ${y - 40} ${x - 80} ${y - 95} ${x - 25} ${y - 72} C ${x + 5} ${y - 125} ${x + 100} ${y - 100} ${x + 100} ${y - 30} C ${x + 160} ${y - 10} ${x + 145} ${y + 65} ${x + 80} ${y + 72} C ${x + 40} ${y + 115} ${x - 60} ${y + 105} ${x - 65} ${y + 55} C ${x - 110} ${y + 55} ${x - 120} ${y + 30} ${x - 90} ${y + 20} Z`;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale}) translate(${-x} ${-y})`}>
      <SketchPath d={d} start={start} dur={0.7} stroke={color} strokeWidth={4} seed={seed} />
      {dots
        ? [[-45, -25], [-10, -48], [30, -20], [55, 20], [-20, 18], [-55, 40], [15, 55], [0, -5]].map(([dx, dy], i) => (
            <SketchCircle key={i} x={x + dx} y={y + dy} d={8 + (i % 3) * 4} start={start + 0.6 + i * 0.06} dur={0.15} stroke={color} fill={color} seed={seed + 10 + i} />
          ))
        : null}
      {[[-30, 0], [25, 30], [40, -35]].map(([dx, dy], i) => (
        <SketchPath key={i} d={`M ${x + dx - 15} ${y + dy} Q ${x + dx} ${y + dy - 8} ${x + dx + 15} ${y + dy}`} start={start + 0.8 + i * 0.1} dur={0.2} stroke={color} strokeWidth={2} seed={seed + 30 + i} />
      ))}
    </g>
  );
};

/** Index card used for papers and concepts. */
export const PaperCard: React.FC<{
  x: number;
  y: number;
  w?: number;
  h?: number;
  kicker?: string;
  title: string;
  sub?: string;
  start?: number;
  color?: string;
  fill?: string;
  titleSize?: number;
  subSize?: number;
  seed?: number;
  children?: React.ReactNode;
  opacity?: number;
}> = ({x, y, w = 380, h = 430, kicker, title, sub, start = 0, color = C.fg, fill = C.panel, titleSize = 54, subSize = 36, seed = 115, children, opacity = 1}) => (
  <g opacity={opacity}>
    <SketchRect x={x} y={y} w={w} h={h} start={start} dur={0.55} stroke={color} fill={fill} strokeWidth={3.5} radius={10} seed={seed} roughness={1.15} />
    {kicker ? <Label text={kicker} x={x + w / 2} y={y + 44} size={34} color={color} start={start + 0.18} letterSpacing={2} /> : null}
    {children ? <g>{children}</g> : null}
    <Label text={title} x={x + w / 2} y={y + h - 128} size={titleSize} color={C.fg} start={start + 0.35} />
    {sub ? <Label text={sub} x={x + w / 2} y={y + h - 66} size={subSize} color={C.soft} start={start + 0.5} /> : null}
  </g>
);

export const StatCard: React.FC<{
  x: number;
  y: number;
  w?: number;
  h?: number;
  value: string;
  label: string;
  start?: number;
  color?: string;
  size?: number;
  seed?: number;
}> = ({x, y, w = 360, h = 200, value, label, start = 0, color = C.green, size = 76, seed = 130}) => (
  <g>
    <SketchRect x={x} y={y} w={w} h={h} start={start} dur={0.4} stroke={color} fill={C.panel} strokeWidth={3} radius={12} seed={seed} />
    <Label text={value} x={x + w / 2} y={y + h * 0.42} size={size} color={color} start={start + 0.15} />
    <Label text={label} x={x + w / 2} y={y + h * 0.77} size={38} color={C.soft} start={start + 0.28} />
  </g>
);

export const CheckRow: React.FC<{
  x: number;
  y: number;
  text: string;
  start?: number;
  color?: string;
  size?: number;
  w?: number;
  num?: string;
}> = ({x, y, text, start = 0, color = C.green, size = 46, w = 1100, num}) => (
  <g>
    {num ? <Label text={num} x={x - 30} y={y} size={size + 10} color={color} align="right" start={start} /> : null}
    <Label text={text} x={x + w / 2} y={y} size={size} color={C.fg} start={start + 0.08} align="left" />
  </g>
);

/** Closed thought cloud. */
export const Cloud: React.FC<{
  x: number;
  y: number;
  w?: number;
  h?: number;
  start?: number;
  color?: string;
  fill?: string;
  dots?: boolean;
  dotColor?: string;
  seed?: number;
  opacity?: number;
}> = ({x, y, w = 520, h = 300, start = 0, color = C.cyan, fill = C.panel, dots = true, dotColor = C.cyan, seed = 800, opacity = 1}) => {
  const path =
    `M ${x - 0.42 * w} ${y + 0.16 * h} ` +
    `C ${x - 0.64 * w} ${y - 0.06 * h} ${x - 0.46 * w} ${y - 0.4 * h} ${x - 0.2 * w} ${y - 0.3 * h} ` +
    `C ${x - 0.1 * w} ${y - 0.62 * h} ${x + 0.2 * w} ${y - 0.56 * h} ${x + 0.24 * w} ${y - 0.24 * h} ` +
    `C ${x + 0.52 * w} ${y - 0.42 * h} ${x + 0.66 * w} ${y - 0.02 * h} ${x + 0.5 * w} ${y + 0.16 * h} ` +
    `C ${x + 0.58 * w} ${y + 0.44 * h} ${x + 0.2 * w} ${y + 0.54 * h} ${x + 0.02 * w} ${y + 0.38 * h} ` +
    `C ${x - 0.22 * w} ${y + 0.58 * h} ${x - 0.54 * w} ${y + 0.44 * h} ${x - 0.42 * w} ${y + 0.16 * h} Z`;
  return (
    <g opacity={opacity}>
      <SketchPath d={path} start={start} dur={0.7} stroke={color} strokeWidth={3.2} seed={seed} fill={fill} roughness={0.8} bowing={0.6} />
      {dots
        ? [[-0.25, 0.02], [-0.1, -0.16], [0.08, 0.04], [0.24, -0.1], [0.34, 0.12], [-0.02, 0.2], [-0.3, 0.24]].map(([dx, dy], i) => (
            <SketchCircle key={i} x={x + dx * w} y={y + dy * h} d={11 + (i % 3) * 4} start={start + 0.5 + i * 0.05} dur={0.15} stroke={dotColor} fill={dotColor} seed={seed + 10 + i} />
          ))
        : null}
    </g>
  );
};

/** Closed speech bubble with a tail. */
export const SpeechBubble: React.FC<{
  x: number;
  y: number;
  w?: number;
  h?: number;
  start?: number;
  color?: string;
  fill?: string;
  tail?: "left" | "right";
  children?: React.ReactNode;
  seed?: number;
}> = ({x, y, w = 520, h = 240, start = 0, color = C.fg, fill = C.panel, tail = "left", children, seed = 820}) => {
  const tx = tail === "left" ? x - w * 0.28 : x + w * 0.28;
  const ty = y + h * 0.62;
  return (
    <g>
      <SketchPath
        d={`M ${x - w / 2 + 36} ${y - h / 2} L ${x + w / 2 - 36} ${y - h / 2} Q ${x + w / 2} ${y - h / 2} ${x + w / 2} ${y - h / 2 + 36} L ${x + w / 2} ${y + h / 2 - 36} Q ${x + w / 2} ${y + h / 2} ${x + w / 2 - 36} ${y + h / 2} L ${x - w / 2 + 36} ${y + h / 2} Q ${x - w / 2} ${y + h / 2} ${x - w / 2} ${y + h / 2 - 36} L ${x - w / 2} ${y - h / 2 + 36} Q ${x - w / 2} ${y - h / 2} ${x - w / 2 + 36} ${y - h / 2} Z`}
        start={start}
        dur={0.5}
        stroke={color}
        strokeWidth={3.2}
        fill={fill}
        seed={seed}
        roughness={0.9}
      />
      <SketchPath d={`M ${tx} ${ty} L ${tail === "left" ? tx - 56 : tx + 56} ${ty + 84} L ${tx + (tail === "left" ? 34 : -34)} ${ty + 10} Z`} start={start + 0.2} dur={0.3} stroke={color} strokeWidth={3} fill={fill} seed={seed + 1} roughness={0.9} />
      {children}
    </g>
  );
};

/** Horizontal bar with a label and value, for benchmark comparisons. */
export const HBar: React.FC<{
  x: number;
  y: number;
  w: number;
  h?: number;
  value: number;
  max?: number;
  start?: number;
  color?: string;
  label?: string;
  valueText?: string;
  labelSize?: number;
  seed?: number;
  dim?: boolean;
}> = ({x, y, w, h = 54, value, max = 100, start = 0, color = C.green, label, valueText, labelSize = 36, seed = 840, dim = false}) => {
  const t = useT();
  const p = easeOut(prog(t, start, 0.65));
  const bw = Math.max(2, (value / max) * w * p);
  return (
    <g opacity={dim ? 0.5 : 1}>
      {label ? <Label text={label} x={x - 24} y={y + h / 2} size={labelSize} color={C.soft} align="right" start={start} dur={0.3} /> : null}
      <SketchRect x={x} y={y} w={w} h={h} start={start - 0.1} dur={0.3} stroke={C.line} fill={C.well} strokeWidth={2.2} radius={6} seed={seed} />
      <SketchRect x={x} y={y} w={bw} h={h} start={start} dur={0.2} stroke={color} fill={color} strokeWidth={1.5} radius={6} seed={seed + 1} opacity={0.9} />
      {valueText ? <Label text={valueText} x={x + w + 22} y={y + h / 2} size={labelSize} color={color} align="left" start={start + 0.45} dur={0.3} font="DejaVu Sans Mono" /> : null}
    </g>
  );
};

/** Semicircular surprise gauge. */
export const Gauge: React.FC<{
  x: number;
  y: number;
  r?: number;
  value: number;
  value2?: number;
  switchAt?: number;
  start?: number;
  color?: string;
  color2?: string;
  label?: string;
  valueText?: string;
  valueText2?: string;
  seed?: number;
}> = ({x, y, r = 180, value, value2, switchAt = 9999, start = 0, color = C.orange, color2, label, valueText, valueText2, seed = 900}) => {
  const t = useT();
  const p = prog(t, start + 0.1, 0.6);
  const q = clamp01((t - switchAt) / 0.6);
  const v = value + ((value2 ?? value) - value) * q;
  const c = q > 0.55 ? color2 ?? color : color;
  const angle = Math.PI - v * Math.PI * p;
  const ex = x + r * Math.cos(angle);
  const ey = y - r * Math.sin(angle);
  const text = q > 0.55 ? valueText2 ?? valueText : valueText;
  return (
    <g>
      <SketchArc x={x} y={y} w={r * 2} h={r * 2} startAngle={Math.PI} stopAngle={Math.PI * 2} start={start} dur={0.6} stroke={C.line} strokeWidth={10} seed={seed} />
      <SketchLine x1={x} y1={y} x2={ex} y2={ey} start={start + 0.3} dur={0.4} stroke={c} strokeWidth={4.5} seed={seed + 1} />
      <SketchCircle x={x} y={y} d={20} start={start + 0.2} dur={0.2} stroke={c} fill={c} seed={seed + 2} />
      {text ? <Label text={text} x={x} y={y + 62} size={54} color={c} start={start + 0.4} /> : null}
      {label ? <Label text={label} x={x} y={y + 122} size={40} color={C.soft} start={start + 0.5} /> : null}
    </g>
  );
};

/** Tiny singer with a microphone. */
export const Singer: React.FC<{x: number; y: number; scale?: number; start?: number; color?: string; seed?: number}> = ({
  x, y, scale = 1, start = 0, color = C.fg, seed = 920,
}) => {
  const s = scale;
  return (
    <g>
      <SketchCircle x={x} y={y - 170 * s} d={56 * s} start={start} dur={0.3} stroke={color} strokeWidth={3.2} seed={seed} />
      <SketchLine x1={x} y1={y - 142 * s} x2={x} y2={y - 55 * s} start={start + 0.1} dur={0.25} stroke={color} strokeWidth={3.2} seed={seed + 1} />
      <SketchLine x1={x} y1={y - 120 * s} x2={x - 34 * s} y2={y - 80 * s} start={start + 0.18} dur={0.25} stroke={color} strokeWidth={3.2} seed={seed + 2} />
      <SketchLine x1={x} y1={y - 120 * s} x2={x + 30 * s} y2={y - 140 * s} start={start + 0.24} dur={0.25} stroke={color} strokeWidth={3.2} seed={seed + 3} />
      <SketchLine x1={x} y1={y - 55 * s} x2={x - 24 * s} y2={y} start={start + 0.3} dur={0.22} stroke={color} strokeWidth={3.2} seed={seed + 4} />
      <SketchLine x1={x} y1={y - 55 * s} x2={x + 24 * s} y2={y} start={start + 0.34} dur={0.22} stroke={color} strokeWidth={3.2} seed={seed + 5} />
      <SketchCircle x={x - 10 * s} y={y - 174 * s} d={3 * s} start={start + 0.38} dur={0.1} stroke={color} fill={color} seed={seed + 6} />
      <SketchCircle x={x + 10 * s} y={y - 174 * s} d={3 * s} start={start + 0.4} dur={0.1} stroke={color} fill={color} seed={seed + 7} />
      <SketchRect x={x + 26 * s} y={y - 156 * s} w={16 * s} h={26 * s} start={start + 0.42} dur={0.2} stroke={C.orange} fill={C.orange} strokeWidth={2} radius={6} seed={seed + 8} />
      <SketchLine x1={x + 34 * s} y1={y - 130 * s} x2={x + 34 * s} y2={y - 112 * s} start={start + 0.5} dur={0.15} stroke={color} strokeWidth={2.4} seed={seed + 9} />
    </g>
  );
};

/** Vertical bar for grouped charts. */
export const VBar: React.FC<{
  x: number;
  baseline: number;
  w?: number;
  value: number;
  max?: number;
  h?: number;
  start?: number;
  color?: string;
  label?: string;
  valueText?: string;
  labelSize?: number;
  seed?: number;
  opacity?: number;
}> = ({x, baseline, w = 62, value, max = 100, h = 300, start = 0, color = C.cyan, label, valueText, labelSize = 34, seed = 1500, opacity = 1}) => {
  const t = useT();
  const p = easeOut(prog(t, start, 0.7));
  const bh = Math.max(2, (value / max) * h * p);
  return (
    <g opacity={opacity}>
      <SketchRect x={x} y={baseline - bh} w={w} h={bh} start={start} dur={0.2} stroke={color} fill={color} strokeWidth={2} radius={5} seed={seed} />
      {valueText ? <Label text={valueText} x={x + w / 2} y={baseline - bh - 26} size={34} color={color} start={start + 0.4} /> : null}
      {label ? <Label text={label} x={x + w / 2} y={baseline + 34} size={labelSize} color={C.soft} start={start + 0.2} /> : null}
    </g>
  );
};

/** Calculator with a fixed-width mono display. */
export const Calc: React.FC<{
  x: number;
  y: number;
  w?: number;
  h?: number;
  lines: {text: string; color?: string; size?: number; start?: number}[];
  start?: number;
  seed?: number;
}> = ({x, y, w = 520, h = 260, lines, start = 0, seed = 1520}) => (
  <g>
    <SketchRect x={x} y={y} w={w} h={h} start={start} dur={0.4} stroke={C.fg} fill={C.panel} strokeWidth={3.2} radius={14} seed={seed} />
    <SketchRect x={x + 28} y={y + 26} w={w - 56} h={h - 90} start={start + 0.15} dur={0.3} stroke={C.soft} fill={C.well} strokeWidth={2.2} radius={8} seed={seed + 1} />
    {lines.map((l, i) => (
      <Label key={i} text={l.text} x={x + w / 2} y={y + 64 + i * 52} size={l.size ?? 44} color={l.color ?? C.green} start={l.start ?? start + 0.3 + i * 0.1} font="DejaVu Sans Mono" />
    ))}
    {[0, 1, 2].map((i) => (
      <SketchCircle key={i} x={x + w - 70 + i * 26} y={y + h - 32} d={12} start={start + 0.4 + i * 0.05} dur={0.15} stroke={C.soft} fill={C.soft} seed={seed + 3 + i} />
    ))}
  </g>
);

/** Small arrow-with-label row used for transformations. */
export const FlowArrow: React.FC<{x1: number; x2: number; y: number; start?: number; color?: string; label?: string}> = ({x1, x2, y, start = 0, color = C.soft, label}) => (
  <g>
    <Arrow x1={x1} y1={y} x2={x2} y2={y} start={start} stroke={color} strokeWidth={3} head={14} />
    {label ? <Label text={label} x={(x1 + x2) / 2} y={y - 34} size={32} color={color} start={start + 0.2} /> : null}
  </g>
);
