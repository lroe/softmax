import React from "react";
import {C} from "../theme";
import {Canvas, FadeGroup, clamp01} from "../lib/scene";
import {Arrow, Bracket, Head, Label, SketchCircle, SketchLine, SketchPath, SketchRect, Underline} from "../lib/Sketch";
import {FlowArrow, Gauge, HBar, VBar, WordChip, useT, Calc} from "../lib/kit";
import {RichText} from "../lib/Sketch";
import {at} from "../timing";
import type {SceneProps} from "./ch1";

const local = (t0: number) => (phrase: string, occ = 0) =>
  Math.max(0, at(phrase, occ) - t0);

const Badge: React.FC<{x: number; y: number; n: string; start: number; color: string; size?: number}> = ({x, y, n, start, color, size = 64}) => (
  <g>
    <SketchCircle x={x} y={y} d={size} start={start} dur={0.2} stroke={color} fill={C.panel} strokeWidth={2.6} seed={1600 + Number(n)} />
    <Label text={n} x={x} y={y} size={size * 0.55} color={color} start={start + 0.08} font="DejaVu Sans" />
  </g>
);

const LossChart: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  spikesAt?: number;
  label?: string;
  labelAt?: number;
  start?: number;
}> = ({x, y, w, h, spikesAt = 9999, label, labelAt = 0, start = 0}) => {
  const t = useT();
  const p = clamp01((t - start) / 1.6);
  const flat = `M ${x} ${y + h * 0.18} L ${x + w * 0.55} ${y + h * 0.18}`;
  const drop = `L ${x + w * 0.62} ${y + h * 0.62} L ${x + w * 0.7} ${y + h * 0.86} L ${x + w} ${y + h * 0.88}`;
  return (
    <g>
      <SketchLine x1={x} y1={y} x2={x} y2={y + h} start={start - 0.3} dur={0.35} stroke={C.soft} strokeWidth={3} seed={1610} />
      <SketchLine x1={x} y1={y + h} x2={x + w} y2={y + h} start={start - 0.2} dur={0.35} stroke={C.soft} strokeWidth={3} seed={1611} />
      <Label text="loss" x={x - 26} y={y + 8} size={36} color={C.soft} align="right" start={start + 0.2} font="DejaVu Sans" />
      <Label text="steps" x={x + w / 2} y={y + h + 44} size={36} color={C.soft} start={start + 0.3} font="DejaVu Sans" />
      <Label text="0" x={x} y={y + h + 34} size={36} color={C.soft} start={start + 0.3} font="DejaVu Sans" />
      <SketchPath d={flat + drop} start={start} dur={1.5} stroke={C.fg} strokeWidth={4} seed={1612} progress={p} roughness={0.6} />
      {label ? <Label text={label} x={x + w * 0.82} y={y + h * 0.7} size={46} color={C.green} start={labelAt} /> : null}
      <FadeGroup start={spikesAt} fade={0.3}>
        <SketchPath d={`M ${x + w * 0.2} ${y + h * 0.12} L ${x + w * 0.3} ${y + h * 0.02} L ${x + w * 0.34} ${y + h * 0.3} L ${x + w * 0.42} ${y + h * 0.02} L ${x + w * 0.46} ${y + h * 0.26} L ${x + w * 0.56} ${y + h * 0.1}`} start={0} dur={0.6} stroke={C.red} strokeWidth={3.4} seed={1613} />
      </FadeGroup>
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* 14 — grokking story                                                 */
/* ------------------------------------------------------------------ */
export const Grokking: React.FC<SceneProps> = ({t0}) => {
  const S = local(t0);
  return (
    <Canvas>
      <FadeGroup start={0.1} end={S("Then it sits there, stuck") - 0.1} fade={0.25}>
        <SketchRect x={700} y={400} w={520} h={190} start={0.2} dur={0.4} stroke={C.purple} fill={C.panel} strokeWidth={4} radius={16} seed={1620} />
        <Label text="2 + 3 =" x={860} y={480} size={64} color={C.orange} start={0.45} font="DejaVu Sans Mono" />
        <Label text="5" x={1120} y={480} size={64} color={C.green} start={S("guesses the next word") + 0.1} font="DejaVu Sans Mono" />
      </FadeGroup>

      <FadeGroup start={S("Then it sits there, stuck") - 0.1} fade={0.3}>
        <LossChart x={440} y={330} w={1040} h={420} start={0} label="grokking" labelAt={S("grokking") - S("Then it sits there, stuck") + 0.1} />
      </FadeGroup>
    </Canvas>
  );
};

/* ------------------------------------------------------------------ */
/* 15 — one line of arithmetic                                         */
/* ------------------------------------------------------------------ */
export const OneLine: React.FC<SceneProps> = ({t0}) => {
  const S = local(t0);
  const two = S("To see it, you need two small ideas");
  return (
    <Canvas>
      <FadeGroup start={0.1} end={two - 0.1} fade={0.25}>
        <Label text="softmax" x={960} y={250} size={44} color={C.purple} start={0.1} />
        <Label text="exp(z)" x={960} y={410} size={90} color={C.orange} start={0.3} font="DejaVu Sans Mono" />
        <SketchLine x1={740} y1={470} x2={1180} y2={470} start={0.5} dur={0.3} stroke={C.fg} strokeWidth={5} seed={1650} />
        <Label text="Σ exp(z)" x={960} y={560} size={90} color={C.orange} start={0.55} font="DejaVu Sans Mono" />
      </FadeGroup>

      <FadeGroup start={two - 0.05} fade={0.25}>
        <Badge x={760} y={520} n="1" start={0.1} color={C.purple} size={84} />
        <Badge x={1160} y={520} n="2" start={0.35} color={C.cyan} size={84} />
      </FadeGroup>
    </Canvas>
  );
};

/* ------------------------------------------------------------------ */
/* 16 — overflow and the max-shift trick                               */
/* ------------------------------------------------------------------ */
export const MaxShift: React.FC<SceneProps> = ({t0}) => {
  const S = local(t0);
  const shift = S("subtracts the biggest score");
  const after = S("After the shift, the bottom line");
  return (
    <Canvas>
      <Badge x={700} y={230} n="1" start={0.05} color={C.purple} />
      <FadeGroup start={0.1} end={shift - 0.15} fade={0.25}>
        <Label text="e" x={770} y={500} size={120} color={C.orange} start={0.2} font="DejaVu Sans Mono" />
        <Label text="89" x={840} y={430} size={64} color={C.orange} start={0.25} font="DejaVu Sans" />
        <Arrow x1={980} y1={470} x2={1150} y2={470} start={S("like 89") - 0.05} stroke={C.soft} strokeWidth={3.5} head={18} />
        <Label text="∞" x={1300} y={480} size={150} color={C.red} start={S("Infinity") - 0.05} font="Caveat" />
      </FadeGroup>

      <FadeGroup start={shift - 0.1} end={after - 0.15} fade={0.25}>
        {[
          {y: 330, vals: ["89", "−9", "−9"], c: [C.orange, C.soft, C.soft], label: "scores"},
          {y: 470, vals: ["0", "−98", "−98"], c: [C.fg, C.soft, C.soft], label: "− max"},
          {y: 610, vals: ["1", "≈0", "≈0"], c: [C.green, C.soft, C.soft], label: "exp"},
        ].map((row, ri) => (
          <g key={ri}>
            {row.vals.map((v, i) => (
              <WordChip key={i} text={v} x={760 + i * 200} y={row.y} w={150} h={82} start={0.1 + ri * 0.35 + i * 0.06} color={row.c[i]} size={42} mono />
            ))}
            <Label text={row.label} x={600} y={row.y} size={38} color={C.soft} align="right" start={0.2 + ri * 0.35} />
          </g>
        ))}
        <Label text="max-shift" x={960} y={780} size={48} color={C.purple} start={0.9} />
      </FadeGroup>

      <FadeGroup start={after - 0.1} fade={0.25}>
        <Label text="1 + tiny" x={960} y={380} size={110} color={C.fg} start={0.1} font="DejaVu Sans Mono" />
        <Label text="exp(−lead)" x={1270} y={520} size={48} color={C.orange} start={S("Each tiny number is") - 0.1} font="DejaVu Sans Mono" />
        <Arrow x1={1170} y1={500} x2={1240} y2={500} start={S("Each tiny number is") - 0.2} stroke={C.orange} strokeWidth={3} head={14} />
        <Label text="lead" x={960} y={660} size={40} color={C.soft} start={S("where the lead is") - 0.1} />
        <SketchLine x1={700} y1={700} x2={1200} y2={700} start={S("Bigger lead, tinier number") - 0.2} dur={0.4} stroke={C.purple} strokeWidth={4} seed={1660} />
        <Arrow x1={560} y1={700} x2={680} y2={700} start={S("Bigger lead, tinier number") + 0.1} stroke={C.purple} strokeWidth={3} head={14} />
      </FadeGroup>
    </Canvas>
  );
};

/* ------------------------------------------------------------------ */
/* 17 — calculator precision                                           */
/* ------------------------------------------------------------------ */
export const Precision: React.FC<SceneProps> = ({t0}) => {
  const S = local(t0);
  const real = S("Real computers do the same thing");
  const swallowed = S("tiny number gets swallowed");
  return (
    <Canvas>
      <Badge x={700} y={230} n="2" start={0.05} color={C.cyan} />
      <FadeGroup start={0.1} end={real - 0.2} fade={0.25}>
        <Calc x={640} y={300} w={640} h={330} lines={[
          {text: "1000000000", color: C.green, start: 0.2},
          {text: "+ 0.01", color: C.orange, start: S("Add one cent") - 0.1},
          {text: "1000000000", color: C.green, start: S("Still one billion") - 0.05},
        ]} />
        <Label text="precision" x={960} y={700} size={40} color={C.soft} start={0.45} />
      </FadeGroup>

      <FadeGroup start={real - 0.1} fade={0.25}>
        <Calc x={640} y={270} w={640} h={360} lines={[
          {text: "1 + 0.00000004", color: C.fg, size: 44, start: 0.1},
          {text: "= 1.000000", color: C.soft, start: 0.4},
          {text: "= 1", color: C.red, size: 54, start: swallowed - 0.1},
        ]} />
        <Label text="swallowed" x={960} y={700} size={40} color={C.red} start={swallowed - 0.1} />
      </FadeGroup>
    </Canvas>
  );
};

/* ------------------------------------------------------------------ */
/* 18 — one plus tiny, rounds to one                                   */
/* ------------------------------------------------------------------ */
export const Combine: React.FC<SceneProps> = ({t0}) => {
  const S = local(t0);
  const rounds = S("computer rounds it to one");
  const loss = S("loss becomes exactly zero");
  const grad = S("gradient on the right word");
  const wrong = S("But the wrong words");
  return (
    <Canvas>
      <FadeGroup start={S("When your model gets confident")} end={rounds - 0.05} fade={0.25}>
        <Label text="lead" x={960} y={300} size={40} color={C.soft} start={0.1} />
        <SketchRect x={620} y={360} w={680} h={44} start={0.2} dur={0.3} stroke={C.line} fill={C.well} strokeWidth={2.4} radius={6} seed={1690} />
        <SketchRect x={620} y={360} w={620} h={44} start={0.35} dur={0.5} stroke={C.orange} fill={C.orange} strokeWidth={2} radius={6} seed={1691} />
        <Label text="99.9%" x={960} y={520} size={84} color={C.orange} start={0.6} font="Caveat" />
      </FadeGroup>

      <FadeGroup start={rounds - 0.1} fade={0.25}>
        {[
          {y: 240, t: "1 + 2×10⁻⁴", c: C.fg, s: 70, st: 0},
          {y: 400, t: "= 1", c: C.orange, s: 90, st: 0.7},
          {y: 560, t: "p = 1", c: C.orange, s: 74, st: S("right word's chance")},
          {y: 700, t: "loss = 0", c: C.red, s: 70, st: loss},
          {y: 840, t: "grad = 0", c: C.red, s: 70, st: grad},
        ].map((row, i) => (
          <Label key={i} text={row.t} x={960} y={row.y} size={row.s} color={row.c} start={row.st} font="DejaVu Sans Mono" />
        ))}
        <Arrow x1={960} y1={286} x2={960} y2={352} start={0.7} stroke={C.red} strokeWidth={3} head={14} />
        <Arrow x1={960} y1={446} x2={960} y2={512} start={S("right word's chance") + 0.1} stroke={C.red} strokeWidth={3} head={14} />
        <Arrow x1={960} y1={606} x2={960} y2={652} start={loss + 0.1} stroke={C.red} strokeWidth={3} head={14} />
        <Arrow x1={960} y1={746} x2={960} y2={792} start={grad + 0.1} stroke={C.red} strokeWidth={3} head={14} />
      </FadeGroup>

      <FadeGroup start={wrong - 0.1} fade={0.25}>
        <Label text="right" x={760} y={250} size={38} color={C.green} start={0} />
        <Label text="0" x={760} y={330} size={64} color={C.red} start={0.1} font="DejaVu Sans Mono" />
        <Label text="others" x={1160} y={250} size={38} color={C.orange} start={0.2} />
        <Label text="2×10⁻⁴" x={1160} y={330} size={44} color={C.orange} start={0.3} font="DejaVu Sans Mono" />
        <Label text="1×10⁻⁴" x={1160} y={395} size={44} color={C.orange} start={0.4} font="DejaVu Sans Mono" />
      </FadeGroup>
    </Canvas>
  );
};

/* ------------------------------------------------------------------ */
/* 19 — paper example, rope cut                                        */
/* ------------------------------------------------------------------ */
export const PaperExample: React.FC<SceneProps> = ({t0}) => {
  const S = local(t0);
  const standard = S("Standard code says the loss is zero");
  const truth = S("The truth is a tiny loss");
  const cut = S("rope in our tug of war is cut");
  return (
    <Canvas>
      <FadeGroup start={0.1} end={cut + 0.2} fade={0.25}>
        {["9", "−9", "−9"].map((v, i) => (
          <g key={i}>
            <WordChip text={v} x={660 + i * 170} y={300} w={130} h={84} start={0.1 + i * 0.12} color={i === 0 ? C.green : C.soft} size={46} mono />
          </g>
        ))}
        <Label text="right" x={960} y={195} size={38} color={C.green} start={S("right answer is the first") - 0.05} />

        <FadeGroup start={standard - 0.1} fade={0.2}>
          <Label text="code" x={620} y={520} size={38} color={C.soft} start={0} />
          <Label text="loss 0" x={620} y={590} size={46} color={C.red} start={0.1} font="DejaVu Sans Mono" />
          <Label text="grad 0" x={620} y={660} size={46} color={C.red} start={0.2} font="DejaVu Sans Mono" />
        </FadeGroup>
        <FadeGroup start={truth - 0.1} fade={0.2}>
          <Label text="truth" x={1200} y={520} size={38} color={C.soft} start={0} />
          <Label text="loss 2×10⁻⁸" x={1200} y={590} size={40} color={C.orange} start={0.1} font="DejaVu Sans Mono" />
          <Label text="grad −2×10⁻⁸" x={1200} y={660} size={40} color={C.green} start={0.2} font="DejaVu Sans Mono" />
        </FadeGroup>
      </FadeGroup>

      <FadeGroup start={cut - 0.1} fade={0.25}>
        <SketchLine x1={620} y1={800} x2={900} y2={800} start={0} dur={0.4} stroke={C.fg} strokeWidth={5} seed={1710} />
        <SketchLine x1={1020} y1={800} x2={1300} y2={800} start={0.1} dur={0.4} stroke={C.fg} strokeWidth={5} seed={1711} />
        <SketchPath d="M 930 780 L 950 820 L 970 780 L 990 820 L 1010 780" start={0.3} dur={0.35} stroke={C.red} strokeWidth={5} seed={1712} />
        <Label text="≠ 0" x={960} y={900} size={64} color={C.red} start={0.6} font="DejaVu Sans Mono" />
      </FadeGroup>
    </Canvas>
  );
};

/* ------------------------------------------------------------------ */
/* 20 — precision cliff                                                */
/* ------------------------------------------------------------------ */
export const Cliff: React.FC<SceneProps> = ({t0}) => {
  const S = local(t0);
  return (
    <Canvas>
      <FadeGroup start={0.1} fade={0.25}>
        <SketchLine x1={300} y1={760} x2={1620} y2={760} start={0} dur={0.5} stroke={C.soft} strokeWidth={4} seed={1720} />
        {[0, 10, 20, 30, 40].map((v, i) => (
          <g key={v}>
            <SketchLine x1={300 + v * 33} y1={742} x2={300 + v * 33} y2={760} start={0.3 + i * 0.05} dur={0.15} stroke={C.soft} strokeWidth={2.5} seed={1721 + i} />
            <Label text={`${v}`} x={300 + v * 33} y={792} size={36} color={C.soft} start={0.4 + i * 0.05} font="DejaVu Sans" />
          </g>
        ))}
        <Label text="lead" x={960} y={850} size={36} color={C.soft} start={0.6} font="DejaVu Sans" />

        {[
          {v: 5.5, c: C.red, l: "bf16 5.5", p: "In B F sixteen", y: 560},
          {v: 16.6, c: C.orange, l: "fp32 16.6", p: "In F P thirty-two", y: 530},
          {v: 36.7, c: C.yellow, l: "fp64 36.7", p: "In F P sixty-four", y: 500},
        ].map((m, i) => (
          <g key={i}>
            <SketchLine x1={300 + m.v * 33} y1={760} x2={300 + m.v * 33} y2={m.y + 50} start={S(m.p) - 0.1} dur={0.5} stroke={m.c} strokeWidth={6} seed={1730 + i} />
            <Label text={m.l} x={300 + m.v * 33} y={m.y} size={42} color={m.c} start={S(m.p) + 0.1} />
          </g>
        ))}
      </FadeGroup>
    </Canvas>
  );
};

/* ------------------------------------------------------------------ */
/* 21 — Adam                                                           */
/* ------------------------------------------------------------------ */
export const Adam: React.FC<SceneProps> = ({t0}) => {
  const S = local(t0);
  const turns = S("Adam sees something small");
  return (
    <Canvas>
      <FadeGroup start={0.1} end={turns - 0.2} fade={0.25}>
        {[
          {y: 330, g: 50, step: 150, color: C.cyan},
          {y: 560, g: 220, step: 60, color: C.orange},
        ].map((row, i) => (
          <g key={i}>
            <Label text="grad" x={500} y={row.y} size={38} color={C.soft} align="left" start={0.1} />
            <SketchRect x={630} y={row.y - 22} w={row.g} h={44} start={0.2 + i * 0.2} dur={0.3} stroke={row.color} fill={row.color} strokeWidth={2} radius={5} seed={1740 + i} />
            <Arrow x1={650 + row.g + 12} y1={row.y} x2={650 + row.g + 12 + row.step} y2={row.y} start={0.4 + i * 0.2} stroke={C.green} strokeWidth={3} head={14} />
            <SketchLine x1={650 + row.g + 12 + row.step} y1={row.y - 18} x2={650 + row.g + 12 + row.step} y2={row.y + 18} start={0.55 + i * 0.2} dur={0.15} stroke={C.green} strokeWidth={3} seed={1750 + i} />
            <Label text="step" x={650 + row.g + 12 + row.step / 2} y={row.y + 60} size={36} color={C.green} start={0.5 + i * 0.2} />
          </g>
        ))}
        <Label text="quiet" x={720} y={280} size={38} color={C.soft} start={0.6} />
        <Label text="loud" x={720} y={510} size={38} color={C.soft} start={0.8} />
      </FadeGroup>

      <FadeGroup start={turns - 0.1} end={S("explains the slingshot spikes") - 0.15} fade={0.25}>
        <Label text="2×10⁻⁸" x={500} y={480} size={44} color={C.red} start={0} font="DejaVu Sans Mono" />
        <Arrow x1={620} y1={480} x2={760} y2={480} start={0.2} stroke={C.red} strokeWidth={3.5} head={16} />
        <SketchRect x={780} y={390} w={360} h={180} start={0.3} dur={0.4} stroke={C.purple} fill={C.panel} strokeWidth={4} radius={16} seed={1760} />
        <Label text="Adam" x={960} y={480} size={56} color={C.purple} start={0.5} />
        <Arrow x1={1160} y1={480} x2={1320} y2={480} start={0.7} stroke={C.red} strokeWidth={7} head={22} />
        <Label text="push" x={1240} y={430} size={40} color={C.red} start={0.9} />
      </FadeGroup>

      <FadeGroup start={S("explains the slingshot spikes") - 0.15} fade={0.25}>
        <LossChart x={500} y={320} w={900} h={380} start={0} spikesAt={0.1} />
      </FadeGroup>
    </Canvas>
  );
};

/* ------------------------------------------------------------------ */
/* 22 — results                                                        */
/* ------------------------------------------------------------------ */
export const Results: React.FC<SceneProps> = ({t0}) => {
  const S = local(t0);
  const stall = S("And look at where the standard");
  const yFor = (v: number) => 740 - ((v - 88) / 12) * 380;
  return (
    <Canvas>
      <FadeGroup start={0.1} end={stall - 0.15} fade={0.25}>
        <SketchLine x1={420} y1={740} x2={1500} y2={740} start={0} dur={0.4} stroke={C.soft} strokeWidth={3.5} seed={1770} />
        <SketchLine x1={420} y1={740} x2={420} y2={300} start={0.1} dur={0.4} stroke={C.soft} strokeWidth={3.5} seed={1771} />
        {[88, 92, 96, 100].map((v, i) => (
          <g key={v}>
            <SketchLine x1={412} y1={yFor(v)} x2={420} y2={yFor(v)} start={0.3 + i * 0.05} dur={0.15} stroke={C.soft} strokeWidth={2.5} seed={1772 + i} />
            <Label text={`${v}`} x={390} y={yFor(v)} size={36} color={C.soft} align="right" start={0.35 + i * 0.05} font="DejaVu Sans" />
          </g>
        ))}
        <Label text="accuracy" x={420} y={265} size={36} color={C.soft} align="left" start={0.4} font="DejaVu Sans" />
        {[{x: 620, n: "bf16"}, {x: 960, n: "fp32"}, {x: 1300, n: "fp64"}].map((g, i) => (
          <Label key={i} text={g.n} x={g.x} y={790} size={38} color={C.fg} start={S("In B F sixteen") + 0.1 + i * 0.5} font="DejaVu Sans" />
        ))}
        <SketchPath d={`M 620 ${yFor(93.3)} L 960 ${yFor(94.3)} L 1300 ${yFor(100)}`} start={S("In B F sixteen") - 0.1} dur={1.2} stroke={C.red} strokeWidth={4} seed={1780} />
        <SketchPath d={`M 560 ${yFor(100)} L 1360 ${yFor(100)}`} start={S("fixed version reaches 100") - 0.2} dur={1.0} stroke={C.green} strokeWidth={4} seed={1781} />
        {[{x: 620, v: 93.3}, {x: 960, v: 94.3}, {x: 1300, v: 100}].map((p, i) => (
          <g key={i}>
            <SketchCircle x={p.x} y={yFor(p.v)} d={16} start={S("In B F sixteen") + 0.5 + i * 0.5} dur={0.2} stroke={C.red} fill={C.red} seed={1782 + i} />
            <Label text={`${p.v}`} x={p.x} y={yFor(p.v) + 44} size={36} color={C.red} start={S("In B F sixteen") + 0.6 + i * 0.5} font="DejaVu Sans Mono" />
          </g>
        ))}
      </FadeGroup>

      <FadeGroup start={stall - 0.1} fade={0.25}>
        <Label text="5.1" x={720} y={440} size={64} color={C.red} start={0.1} font="DejaVu Sans Mono" />
        <Arrow x1={800} y1={440} x2={950} y2={440} start={0.3} stroke={C.soft} strokeWidth={3} head={16} />
        <Label text="5.5" x={1090} y={440} size={64} color={C.orange} start={0.45} font="DejaVu Sans Mono" />
        <SketchPath d="M 1090 520 L 1060 590 L 1100 640 L 1070 710 L 1090 800" start={0.6} dur={0.4} stroke={C.red} strokeWidth={6} seed={1795} />
        <Label text="stall" x={940} y={870} size={48} color={C.red} start={0.9} />
      </FadeGroup>
    </Canvas>
  );
};

/* ------------------------------------------------------------------ */
/* 23 — distillation bug                                               */
/* ------------------------------------------------------------------ */
export const Distill: React.FC<SceneProps> = ({t0}) => {
  const S = local(t0);
  const left = S("their last digits disagree");
  return (
    <Canvas>
      <FadeGroup start={0.1} end={left - 0.15} fade={0.25}>
        <SketchRect x={300} y={340} w={420} h={240} start={0.1} dur={0.4} stroke={C.purple} fill={C.panel} strokeWidth={4} radius={16} seed={1800} />
        <Label text="teacher" x={510} y={460} size={44} color={C.purple} start={0.3} />
        <SketchRect x={1180} y={410} w={260} h={160} start={0.5} dur={0.4} stroke={C.cyan} fill={C.panel} strokeWidth={3.5} radius={14} seed={1801} />
        <Label text="student" x={1310} y={490} size={36} color={C.cyan} start={0.7} />
        <Arrow x1={740} y1={450} x2={1170} y2={450} start={0.8} stroke={C.soft} strokeWidth={3} head={16} />
        {[{x: 1000, v: 78, c: C.green}, {x: 1000, v: 16, c: C.cyan}].map((b, i) => (
          <SketchRect key={i} x={b.x} y={590 + i * 58} w={420 * (b.v / 100)} h={40} start={1.0 + i * 0.1} dur={0.3} stroke={b.c} fill={b.c} strokeWidth={2} radius={5} seed={1810 + i} />
        ))}
      </FadeGroup>

      <FadeGroup start={left - 0.1} fade={0.25}>
        <RichText
          parts={[
            {t: "0.84123400", c: C.orange},
            {t: " − ", c: C.fg},
            {t: "0.84123394", c: C.cyan},
            {t: " = ", c: C.fg},
            {t: "6×10⁻⁸", c: C.red},
          ]}
          x={960}
          y={440}
          size={40}
          start={0}
        />
        <Arrow x1={1100} y1={680} x2={1290} y2={680} start={0.7} stroke={C.red} strokeWidth={4} head={18} />
        <Label text="drift" x={1220} y={730} size={40} color={C.red} start={0.9} />
      </FadeGroup>
    </Canvas>
  );
};

/* ------------------------------------------------------------------ */
/* 24 — the fix                                                        */
/* ------------------------------------------------------------------ */
export const Fix: React.FC<SceneProps> = ({t0}) => {
  const S = local(t0);
  const rewrite = S("rewrites cross-entropy");
  return (
    <Canvas>
      <FadeGroup start={0.1} end={rewrite - 0.2} fade={0.25}>
        <Label text="1 + tiny" x={700} y={450} size={80} color={C.soft} start={0} font="DejaVu Sans Mono" />
        <Label text="✗" x={470} y={450} size={84} color={C.red} start={0.3} font="DejaVu Sans" />
        {["softplus", "expm1", "log1p"].map((f, i) => (
          <WordChip key={f} text={f} x={1230} y={370 + i * 95} w={260} h={72} start={S(["softplus", "exp-m-one", "log-one-p"][i]) + 0.1} color={C.green} size={40} mono />
        ))}
      </FadeGroup>

      <FadeGroup start={rewrite - 0.1} fade={0.25}>
        <Label text="g(right) = −Σ g(others)" x={760} y={430} size={54} color={C.green} start={0} font="DejaVu Sans Mono" />
        <Label text="sum = 0" x={760} y={560} size={64} color={C.fg} start={0.4} font="DejaVu Sans Mono" />
        <Label text="88" x={1300} y={430} size={120} color={C.green} start={S("around a lead of 88") - 0.1} font="DejaVu Sans Mono" />
        <Label text="lead" x={1300} y={530} size={40} color={C.soft} start={S("around a lead of 88") + 0.1} />
        <Arrow x1={1050} y1={500} x2={1210} y2={500} start={S("around a lead of 88") - 0.1} stroke={C.green} strokeWidth={4} head={18} />
      </FadeGroup>
    </Canvas>
  );
};

/* ------------------------------------------------------------------ */
/* 25 — code test                                                      */
/* ------------------------------------------------------------------ */
export const CodeTest: React.FC<SceneProps> = ({t0}) => {
  const S = local(t0);
  return (
    <Canvas>
      <SketchRect x={560} y={220} w={800} h={480} start={0} dur={0.4} stroke={C.fg} fill={C.panel} strokeWidth={3} radius={12} seed={1840} />
      {["z = logits", "p = softmax(z)", "g = p - onehot", "s = g.sum()", "print(s)"].map((l, i) => (
        <Label key={i} text={l} x={620} y={310 + i * 70} size={42} color={C.green} align="left" font="DejaVu Sans Mono" start={0.2 + i * 0.15} />
      ))}
      <Label text="fp32" x={1290} y={260} size={36} color={C.soft} start={0.4} />
      <FadeGroup start={S("Run it. The sum comes out") - 0.1} fade={0.2}>
        <Label text="3×10⁻⁸" x={960} y={820} size={96} color={C.red} start={0.1} font="DejaVu Sans Mono" />
      </FadeGroup>
    </Canvas>
  );
};

/* ------------------------------------------------------------------ */
/* 26 — caveats one and two                                            */
/* ------------------------------------------------------------------ */
export const Caveats: React.FC<SceneProps> = ({t0}) => {
  const S = local(t0);
  const two = S("No framework has adopted it yet");
  return (
    <Canvas>
      <FadeGroup start={0.1} end={two - 0.15} fade={0.25}>
        <SketchRect x={760} y={270} w={400} h={460} start={0.1} dur={0.4} stroke={C.soft} fill={C.panel} strokeWidth={3} radius={10} seed={1850} />
        {[0, 1, 2].map((i) => (
          <SketchLine key={i} x1={800} y1={380 + i * 90} x2={1120} y2={380 + i * 90} start={0.3 + i * 0.08} dur={0.2} stroke={C.soft} strokeWidth={2.4} seed={1851 + i} />
        ))}
        <Label text="preprint" x={960} y={620} size={48} color={C.orange} start={S("This is a preprint") - 0.1} />
      </FadeGroup>

      <FadeGroup start={two - 0.1} fade={0.25}>
        {["JAX", "PyTorch", "TensorFlow"].map((w, i) => (
          <g key={w}>
            <WordChip text={w} x={700 + i * 260} y={360} w={220} h={76} start={0.1 + i * 0.12} color={C.soft} size={38} />
            <SketchLine x1={620 + i * 260} y1={330} x2={780 + i * 260} y2={390} start={0.4 + i * 0.1} dur={0.2} stroke={C.red} strokeWidth={5} seed={1860 + i} />
          </g>
        ))}
        <Label text="snippet" x={960} y={560} size={48} color={C.green} start={0.7} />
        <Label text="fp64 safe" x={960} y={700} size={44} color={C.cyan} start={1.0} />
      </FadeGroup>
    </Canvas>
  );
};

/* ------------------------------------------------------------------ */
/* 27 — caveat three                                                   */
/* ------------------------------------------------------------------ */
export const CaveatThree: React.FC<SceneProps> = ({t0}) => {
  const S = local(t0);
  return (
    <Canvas>
      <SketchRect x={800} y={300} w={320} h={340} start={0.1} dur={0.4} stroke={C.soft} fill={C.panel} strokeWidth={3} radius={10} seed={1870} />
      <Label text="v2" x={960} y={420} size={64} color={C.orange} start={0.3} font="DejaVu Sans Mono" />
      <Label text="strong lead" x={960} y={720} size={48} color={C.green} start={S("So treat it as a strong lead") - 0.1} />
      <SketchCircle x={500} y={440} d={34} start={0.5} dur={0.2} stroke={C.red} fill={C.red} seed={1871} />
      <SketchCircle x={500} y={560} d={34} start={0.65} dur={0.2} stroke={C.red} fill={C.red} seed={1872} />
      <Arrow x1={530} y1={440} x2={790} y2={400} start={0.8} stroke={C.red} strokeWidth={3} head={14} />
      <Arrow x1={530} y1={560} x2={790} y2={540} start={0.9} stroke={C.red} strokeWidth={3} head={14} />
      <Label text="1 fix" x={650} y={640} size={44} color={C.green} start={1.1} />
    </Canvas>
  );
};
