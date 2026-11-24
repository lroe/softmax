import React from "react";
import {C} from "../theme";
import {Canvas, FadeGroup, clamp01} from "../lib/scene";
import {Arrow, Bracket, Head, Label, SketchCircle, SketchLine, SketchPath, SketchRect, Underline} from "../lib/Sketch";
import {Gauge, Singer, VectorStrip, WordChip, useT} from "../lib/kit";
import {at} from "../timing";
import type {SceneProps} from "./ch1";

const local = (t0: number) => (phrase: string, occ = 0) =>
  Math.max(0, at(phrase, occ) - t0);

const ModelBox: React.FC<{x: number; y: number; w?: number; h?: number; start?: number; label?: string; color?: string; seed?: number}> = ({
  x, y, w = 380, h = 170, start = 0, label = "model", color = C.purple, seed = 1000,
}) => (
  <g>
    <SketchRect x={x} y={y} w={w} h={h} start={start} dur={0.45} stroke={color} fill={C.panel} strokeWidth={4} radius={14} seed={seed} />
    <Label text={label} x={x + w / 2} y={y + h / 2} size={50} color={color} start={start + 0.25} />
  </g>
);

const StepBadge: React.FC<{x: number; y: number; n: string; start: number; color: string; size?: number}> = ({x, y, n, start, color, size = 56}) => (
  <g>
    <SketchCircle x={x} y={y} d={size} start={start} dur={0.2} stroke={color} fill={C.panel} strokeWidth={2.6} seed={1100 + Number(n)} />
    <Label text={n} x={x} y={y} size={size * 0.55} color={color} start={start + 0.08} font="DejaVu Sans" />
  </g>
);

/* ------------------------------------------------------------------ */
/* 07 — the loop                                                       */
/* ------------------------------------------------------------------ */
export const Loop: React.FC<SceneProps> = ({t0}) => {
  const S = local(t0);
  const add = S("Then it adds that word");
  const whole = S("That's the whole loop");
  const steps = S("Inside one guess");
  return (
    <Canvas>
      <ModelBox x={770} y={420} w={380} h={170} start={0.1} />
      <FadeGroup start={S("reads some text and guesses the next word")} end={add + 0.05} fade={0.2}>
        <Label text="the cat sat" x={250} y={500} size={48} color={C.orange} start={0} font="DejaVu Sans Mono" />
        <Underline x={250} y={532} w={250} start={0.2} color={C.orange} width={3} />
      </FadeGroup>
      <Arrow x1={590} y1={508} x2={764} y2={508} start={S("reads some text and guesses the next word") + 0.3} stroke={C.soft} strokeWidth={3} head={16} />
      <Arrow x1={1160} y1={508} x2={1320} y2={508} start={S("reads some text and guesses the next word") + 0.55} stroke={C.soft} strokeWidth={3} head={16} />

      <FadeGroup start={S("reads some text and guesses the next word") + 0.45} end={add + 0.2} fade={0.25}>
        <WordChip text="on" x={1400} y={508} w={150} h={82} start={0.1} color={C.orange} size={48} />
      </FadeGroup>

      <FadeGroup start={add + 0.15} fade={0.25}>
        <Label text="the cat sat on" x={250} y={500} size={48} color={C.orange} start={0} font="DejaVu Sans Mono" />
        <Underline x={250} y={532} w={350} start={0.15} color={C.orange} width={3} />
        <Arrow x1={620} y1={508} x2={750} y2={508} start={0.05} stroke={C.soft} strokeWidth={3} head={16} />
      </FadeGroup>

      <FadeGroup start={whole - 0.15} fade={0.3}>
        <SketchPath d="M 1380 610 Q 1420 790 1150 860 Q 700 940 430 850 Q 300 790 330 620" start={0} dur={1.0} stroke={C.purple} strokeWidth={4} seed={1010} />
        <Head x={330} y={620} angle={-1.42} start={0.95} color={C.purple} size={18} />
      </FadeGroup>

      <FadeGroup start={steps - 0.1} fade={0.3}>
        {["1", "2", "3"].map((n, i) => (
          <StepBadge key={n} x={860 + i * 100} y={760} n={n} start={0.1 + i * 0.12} color={C.purple} size={54} />
        ))}
      </FadeGroup>
    </Canvas>
  );
};

/* ------------------------------------------------------------------ */
/* 08 — step one: hidden state                                         */
/* ------------------------------------------------------------------ */
export const HiddenState: React.FC<SceneProps> = ({t0}) => {
  const S = local(t0);
  return (
    <Canvas>
      <StepBadge x={710} y={250} n="1" start={0.05} color={C.purple} size={64} />
      <Label text="the cat sat" x={250} y={500} size={46} color={C.orange} start={0.2} font="DejaVu Sans Mono" />
      <Arrow x1={585} y1={500} x2={702} y2={500} start={S("turns your text into a long list") - 0.1} stroke={C.soft} strokeWidth={3} head={16} />
      <VectorStrip x={710} y={500} n={10} cell={64} start={S("turns your text into a long list")} color={C.cyan} seed={1020} />

      <FadeGroup start={S("thousands of them") - 0.05} fade={0.3}>
        <VectorStrip x={710} y={590} n={10} cell={64} start={0} color={C.cyan} seed={1040} showValues={false} />
        <VectorStrip x={710} y={660} n={10} cell={64} start={0.12} color={C.cyan} seed={1060} showValues={false} />
        <Label text="..." x={1440} y={610} size={54} color={C.cyan} start={0.3} />
      </FadeGroup>

      <Label text="hidden state" x={960} y={790} size={54} color={C.cyan} start={S("hidden state") - 0.1} />
      <Underline x={960} y={836} w={250} start={S("hidden state") + 0.1} color={C.cyan} width={3} />
    </Canvas>
  );
};

/* ------------------------------------------------------------------ */
/* 09 — steps two and three: logits, then chances                      */
/* ------------------------------------------------------------------ */
export const LogitsChances: React.FC<SceneProps> = ({t0}) => {
  const S = local(t0);
  const scores = S("Step three. Scores are not chances");
  const machine = S("machine that turns scores into chances");
  return (
    <Canvas>
      <FadeGroup start={0.1} end={scores - 0.05} fade={0.3}>
        <StepBadge x={700} y={250} n="2" start={0.1} color={C.cyan} size={64} />
        <VectorStrip x={700} y={300} n={10} cell={54} start={0.2} color={C.cyan} seed={1080} showValues={false} />
        {[
          {w: "cat", v: "9.0"},
          {w: "dog", v: "3.1"},
          {w: "the", v: "0.4"},
          {w: "a", v: "-1.2"},
          {w: "of", v: "-3.8"},
        ].map((row, i) => (
          <g key={i}>
            <Label text={row.w} x={720} y={430 + i * 76} size={46} color={C.orange} align="left" start={S("Step two. The model scores every word") + 0.2 + i * 0.1} />
            <Label text={row.v} x={1020} y={430 + i * 76} size={46} color={i === 0 ? C.green : C.soft} align="left" start={S("Step two. The model scores every word") + 0.35 + i * 0.1} font="DejaVu Sans Mono" />
          </g>
        ))}
        <Bracket x={1180} y1={385} y2={690} dir={1} start={S("Fifty thousand words") - 0.15} color={C.orange} size={16} />
        <Label text="50,000" x={1220} y={338} size={56} color={C.orange} align="left" start={S("Fifty thousand words") - 0.05} />
        <Label text="logits" x={900} y={850} size={54} color={C.orange} start={S("Those scores are called logits") - 0.05} />
        <Underline x={900} y={896} w={170} start={S("Those scores are called logits") + 0.1} color={C.orange} width={3} />
      </FadeGroup>

      <FadeGroup start={scores - 0.15} fade={0.3}>
        <StepBadge x={700} y={250} n="3" start={0} color={C.purple} size={64} />
        <Label text="scores" x={460} y={470} size={40} color={C.soft} start={0.1} />
        <WordChip text="9" x={320} y={560} w={110} h={82} start={0.2} color={C.orange} size={48} mono />
        <WordChip text="-9" x={470} y={560} w={130} h={82} start={0.28} color={C.orange} size={48} mono />
        <Arrow x1={560} y1={560} x2={690} y2={560} start={0.4} stroke={C.soft} strokeWidth={3} head={16} />
        <SketchRect x={700} y={500} w={220} h={120} start={0.45} dur={0.35} stroke={C.purple} fill={C.panel} strokeWidth={4} radius={12} seed={1090} />
        <Label text="?" x={810} y={560} size={66} color={C.purple} start={0.6} font="Caveat" />
        <Arrow x1={930} y1={560} x2={1030} y2={560} start={S("ninety percent cat") - 0.2} stroke={C.soft} strokeWidth={3} head={16} />

        {[
          {l: "cat", v: 90, c: C.green},
          {l: "dog", v: 8, c: C.cyan},
        ].map((b, i) => (
          <g key={i}>
            <SketchRect x={1050} y={490 + i * 90} w={520 * (b.v / 100)} h={56} start={S("ninety percent cat") + i * 0.12} dur={0.35} stroke={b.c} fill={b.c} strokeWidth={2} radius={6} seed={1100 + i} />
            <Label text={b.l} x={1040} y={518 + i * 90} size={38} color={C.soft} align="right" start={S("ninety percent cat") + i * 0.12} />
            <Label text={`${b.v}%`} x={1600} y={518 + i * 90} size={42} color={b.c} align="left" start={S("ninety percent cat") + 0.15 + i * 0.12} font="DejaVu Sans Mono" />
          </g>
        ))}
      </FadeGroup>
    </Canvas>
  );
};

/* ------------------------------------------------------------------ */
/* 10 — softmax, three singers                                         */
/* ------------------------------------------------------------------ */
export const Singers: React.FC<SceneProps> = ({t0}) => {
  const S = local(t0);
  const exp = S("First, it makes every score positive");
  const divide = S("Second, it divides by the total");
  const result = S("Now the singers have 84");
  const widen = S("Widen the gap");
  const win = S("winner takes almost everything");
  const cols = [580, 960, 1340];

  return (
    <Canvas>
      <SketchRect x={780} y={140} w={360} h={104} start={0} dur={0.4} stroke={C.purple} fill={C.panel} strokeWidth={4} radius={14} seed={1130} />
      <Label text="softmax" x={960} y={193} size={58} color={C.purple} start={0.2} />

      <Label text="total 23.8" x={960} y={292} size={42} color={C.soft} start={divide + 0.1} />
      <SketchLine x1={480} y1={372} x2={1440} y2={372} start={0.45} dur={0.4} stroke={C.line} strokeWidth={3} seed={1135} />

      {[3, 1, 0].map((v, i) => (
        <g key={i}>
          <FadeGroup start={0.1} end={result - 0.05} fade={0.25}>
            <Singer x={cols[i]} y={800} scale={1} start={S("smallest example") + 0.2 + i * 0.12} color={C.fg} seed={1140 + i * 10} />
          </FadeGroup>
          <FadeGroup start={S("judges give 3") - 0.05} end={exp - 0.05} fade={0.2}>
            <Label text={`${v}`} x={cols[i]} y={500} size={96} color={C.fg} start={0.15 + i * 0.1} font="Caveat" />
          </FadeGroup>
          <FadeGroup start={exp - 0.05} end={result - 0.05} fade={0.2}>
            <Label text={["e³", "e¹", "e⁰"][i]} x={cols[i] - 48} y={452} size={38} color={C.soft} start={0.05 + i * 0.08} />
            <Label text={["20.1", "2.7", "1"][i]} x={cols[i]} y={515} size={70} color={C.orange} start={0.15 + i * 0.08} font="Caveat" />
          </FadeGroup>
          <FadeGroup start={result - 0.05} end={widen - 0.05} fade={0.25}>
            <Label text={["84%", "11%", "4%"][i]} x={cols[i]} y={515} size={82} color={[C.green, C.cyan, C.soft][i]} start={0.05 + i * 0.08} />
          </FadeGroup>
          <FadeGroup start={widen - 0.05} fade={0.25}>
            <Label text={["99%", "0.5%", "0.5%"][i]} x={cols[i]} y={515} size={82} color={[C.green, C.cyan, C.soft][i]} start={i * 0.08} />
          </FadeGroup>
        </g>
      ))}

      <FadeGroup start={result + 0.2} end={widen - 0.1} fade={0.3}>
        {[84, 11, 4].map((v, i) => (
          <SketchRect key={i} x={cols[i] - 70} y={860 - v * 2.4} w={140} h={Math.max(4, v * 2.4)} start={0.1 + i * 0.1} dur={0.5} stroke={[C.green, C.cyan, C.soft][i]} fill={[C.green, C.cyan, C.soft][i]} strokeWidth={2} radius={6} seed={1170 + i} opacity={0.85} />
        ))}
        <SketchLine x1={400} y1={860} x2={1520} y2={860} start={0.05} dur={0.3} stroke={C.line} strokeWidth={4} seed={1180} />
      </FadeGroup>

      <FadeGroup start={widen - 0.1} fade={0.3}>
        {[99, 0.5, 0.5].map((v, i) => (
          <SketchRect key={i} x={cols[i] - 70} y={860 - v * 2.4} w={140} h={Math.max(4, v * 2.4)} start={i * 0.08} dur={0.5} stroke={[C.green, C.cyan, C.soft][i]} fill={[C.green, C.cyan, C.soft][i]} strokeWidth={2} radius={6} seed={1190 + i} opacity={0.9} />
        ))}
        <SketchLine x1={400} y1={860} x2={1520} y2={860} start={0} dur={0.2} stroke={C.line} strokeWidth={4} seed={1200} />
        <Label text="winner" x={580} y={912} size={38} color={C.green} start={win - 0.05} />
      </FadeGroup>
    </Canvas>
  );
};

/* ------------------------------------------------------------------ */
/* 11 — loss and gradient                                              */
/* ------------------------------------------------------------------ */
export const LossGradient: React.FC<SceneProps> = ({t0}) => {
  const S = local(t0);
  const loss = S("cross-entropy loss");
  const grad = S("That's the gradient");
  const formula = S("chance you gave it");
  const one = S("Gave it one percent");
  return (
    <Canvas>
      <FadeGroup start={0.1} end={grad - 0.05} fade={0.25}>
        <Label text="cat" x={960} y={210} size={54} color={C.green} start={0.1} />
        <Gauge
          x={960}
          y={640}
          r={250}
          value={0.15}
          value2={0.92}
          switchAt={one + 0.25}
          start={1.8}
          color={C.green}
          color2={C.red}
          valueText="84%"
          valueText2="1%"
          label="surprise"
          seed={1210}
        />
        <Label text="loss" x={960} y={880} size={50} color={C.red} start={loss - 0.05} />
      </FadeGroup>

      <FadeGroup start={grad + 0.05} fade={0.25}>
        <Label text="gradient" x={960} y={220} size={48} color={C.purple} start={0} />
        {[
          {w: "cat", p: "0.84", g: "−0.16", c: C.red, dir: 1},
          {w: "dog", p: "0.11", g: "+0.11", c: C.green, dir: -1},
          {w: "a", p: "0.04", g: "+0.04", c: C.green, dir: -1},
        ].map((row, i) => (
          <g key={i}>
            <Label text={row.w} x={500} y={400 + i * 110} size={46} color={C.orange} align="left" start={0.05 + i * 0.1} />
            <Label text={row.p} x={760} y={400 + i * 110} size={46} color={C.soft} start={0.1 + i * 0.1} font="DejaVu Sans Mono" />
            <SketchLine x1={840} y1={400 + i * 110} x2={950} y2={400 + i * 110} start={0.15 + i * 0.1} dur={0.2} stroke={C.line} strokeWidth={3} seed={1240 + i} />
            <Label text={row.g} x={1080} y={400 + i * 110} size={48} color={row.c} start={0.25 + i * 0.1} font="DejaVu Sans Mono" />
            <Arrow x1={1210} y1={400 + i * 110 - row.dir * 12} x2={1210} y2={400 + i * 110 + row.dir * 40} start={0.4 + i * 0.1} stroke={row.c} strokeWidth={3.2} head={12} />
          </g>
        ))}
        <Label text="p − 1" x={700} y={800} size={54} color={C.red} start={formula + 0.1} font="DejaVu Sans Mono" />
        <Label text="p" x={1150} y={800} size={54} color={C.green} start={formula + 0.25} font="DejaVu Sans Mono" />
        <Label text="right word" x={700} y={860} size={36} color={C.soft} start={formula + 0.35} />
        <Label text="others" x={1150} y={860} size={36} color={C.soft} start={formula + 0.45} />
      </FadeGroup>
    </Canvas>
  );
};

/* ------------------------------------------------------------------ */
/* 12 — the rope, the token, the recap                                 */
/* ------------------------------------------------------------------ */
const StickPull: React.FC<{x: number; y: number; ropeY: number; flip?: boolean; start?: number}> = ({x, y, ropeY, flip = false, start = 0}) => {
  const d = flip ? -1 : 1;
  return (
    <g>
      <SketchCircle x={x} y={y - 120} d={44} start={start} dur={0.25} stroke={C.fg} strokeWidth={3} seed={1300 + x} />
      <SketchLine x1={x} y1={y - 98} x2={x} y2={y - 35} start={start + 0.1} dur={0.2} stroke={C.fg} strokeWidth={3} seed={1301 + x} />
      <SketchLine x1={x} y1={y - 82} x2={x + 58 * d} y2={ropeY} start={start + 0.15} dur={0.25} stroke={C.fg} strokeWidth={3} seed={1302 + x} />
      <SketchLine x1={x} y1={y - 72} x2={x + 34 * d} y2={ropeY + 14} start={start + 0.2} dur={0.22} stroke={C.fg} strokeWidth={3} seed={1305 + x} />
      <SketchLine x1={x} y1={y - 35} x2={x - 20} y2={y + 20} start={start + 0.2} dur={0.2} stroke={C.fg} strokeWidth={3} seed={1303 + x} />
      <SketchLine x1={x} y1={y - 35} x2={x + 20} y2={y + 20} start={start + 0.24} dur={0.2} stroke={C.fg} strokeWidth={3} seed={1304 + x} />
    </g>
  );
};

export const RopeTokenRecap: React.FC<SceneProps> = ({t0}) => {
  const S = local(t0);
  const token = S("One last step");
  const recap = S("Think. Score. Chances");
  return (
    <Canvas>
      <FadeGroup start={0.1} end={token - 0.15} fade={0.35}>
        <SketchLine x1={520} y1={620} x2={1400} y2={620} start={0.1} dur={0.5} stroke={C.fg} strokeWidth={4} seed={1310} />
        <SketchCircle x={960} y={620} d={18} start={0.5} dur={0.2} stroke={C.orange} fill={C.orange} seed={1311} />
        <StickPull x={420} y={800} ropeY={620} flip start={0.2} />
        <StickPull x={280} y={800} ropeY={620} flip start={0.35} />
        <StickPull x={1500} y={800} ropeY={620} start={0.3} />
        <StickPull x={1640} y={800} ropeY={620} start={0.45} />
        <Label text="−0.16" x={410} y={500} size={48} color={C.red} start={0.1} />
        <Label text="+0.11" x={1400} y={470} size={48} color={C.green} start={0.3} />
        <Label text="+0.04" x={1580} y={540} size={48} color={C.green} start={0.4} />
        <Label text="0" x={960} y={460} size={120} color={C.fg} start={S("you always get zero") - 0.1} font="Caveat" />
      </FadeGroup>

      <FadeGroup start={token - 0.1} end={recap - 0.2} fade={0.3}>
        <WordChip text="cat" x={430} y={500} w={190} h={84} start={0} color={C.orange} size={52} />
        <Arrow x1={540} y1={500} x2={670} y2={500} start={0.2} stroke={C.soft} strokeWidth={3} head={16} />
        <VectorStrip x={700} y={500} n={8} cell={48} start={0.3} color={C.cyan} showValues={false} seed={1340} />
        <Label text="token" x={430} y={590} size={40} color={C.orange} start={0.15} />
        <Label text="embedding" x={910} y={590} size={40} color={C.cyan} start={0.45} />
        <SketchPath d="M 1080 500 Q 1200 430 1320 500" start={0.6} dur={0.4} stroke={C.purple} strokeWidth={3.5} seed={1350} />
        <Head x={1320} y={500} angle={-0.4} start={0.85} color={C.purple} size={15} />
        <SketchRect x={1340} y={440} w={280} h={140} start={0.9} dur={0.35} stroke={C.purple} fill={C.panel} strokeWidth={3.5} radius={12} seed={1352} />
        <Label text="model" x={1480} y={510} size={42} color={C.purple} start={1.1} />
      </FadeGroup>

      <FadeGroup start={recap - 0.2} fade={0.3}>
        {["think", "score", "chances", "pick", "feed back"].map((w, i) => (
          <g key={w}>
            <WordChip text={w} x={250 + i * 355} y={520} w={i === 4 ? 260 : 230} h={78} start={i * 0.1} color={C.fg} size={40} />
            {i < 4 ? <Arrow x1={250 + i * 355 + 118} y1={520} x2={250 + (i + 1) * 355 - 118} y2={520} start={0.2 + i * 0.1} stroke={C.soft} strokeWidth={3} head={14} /> : null}
          </g>
        ))}
        <Arrow x1={1670} y1={600} x2={250} y2={600} curve={90} start={0.8} dur={0.8} stroke={C.purple} strokeWidth={3.5} head={18} seed={1360} />
      </FadeGroup>
    </Canvas>
  );
};

/* ------------------------------------------------------------------ */
/* 13 — two weak spots, decision model                                 */
/* ------------------------------------------------------------------ */
export const WeakSpots: React.FC<SceneProps> = ({t0}) => {
  const S = local(t0);
  const decision = S("reads the question once");
  const noLoop = S("No picking. No looping");
  return (
    <Canvas>
      <FadeGroup start={0.1} end={decision - 0.2} fade={0.3}>
        {["think", "score", "chances", "pick", "feed back"].map((w, i) => (
          <g key={w}>
            <WordChip text={w} x={250 + i * 355} y={500} w={i === 4 ? 260 : 230} h={78} start={0.1 + i * 0.06} color={i === 2 || i === 3 ? C.red : C.fg} size={40} />
            {i < 4 ? <Arrow x1={250 + i * 355 + 118} y1={500} x2={250 + (i + 1) * 355 - 118} y2={500} start={0.2 + i * 0.08} stroke={C.soft} strokeWidth={3} head={14} /> : null}
          </g>
        ))}
        <Arrow x1={1670} y1={600} x2={250} y2={600} curve={90} start={0.5} dur={0.7} stroke={C.purple} strokeWidth={3.5} head={18} seed={1402} />
        <FadeGroup start={S("The softmax step") - 0.05} fade={0.25}>
          <SketchRect x={830} y={445} w={260} h={110} start={0} dur={0.3} stroke={C.red} fill="none" strokeWidth={3.5} radius={18} seed={1400} />
        </FadeGroup>
        <FadeGroup start={S("And the pick-a-word step") - 0.05} fade={0.25}>
          <SketchRect x={1185} y={445} w={260} h={110} start={0} dur={0.3} stroke={C.red} fill="none" strokeWidth={3.5} radius={18} seed={1401} />
        </FadeGroup>
      </FadeGroup>

      <FadeGroup start={decision - 0.15} fade={0.35}>
        <WordChip text="question" x={340} y={500} w={240} h={80} start={0} color={C.orange} size={40} />
        <Arrow x1={470} y1={500} x2={610} y2={500} start={0.2} stroke={C.soft} strokeWidth={3} head={16} />
        <ModelBox x={630} y={420} w={420} h={170} start={0.25} color={C.cyan} />
        <Arrow x1={1065} y1={500} x2={1170} y2={500} start={0.4} stroke={C.soft} strokeWidth={3} head={16} />
        {[
          {v: 78, c: C.green},
          {v: 12, c: C.cyan},
          {v: 6, c: C.orange},
        ].map((b, i) => (
          <SketchRect key={i} x={1190} y={410 + i * 60} w={430 * (b.v / 100)} h={38} start={0.5 + i * 0.08} dur={0.3} stroke={b.c} fill={b.c} strokeWidth={2} radius={5} seed={1410 + i} />
        ))}
        <Label text="chances" x={1400} y={640} size={40} color={C.soft} start={0.75} />
        <FadeGroup start={noLoop - 0.1} fade={0.3}>
          <SketchPath d="M 900 720 Q 780 790 660 720" start={0} dur={0.4} stroke={C.red} strokeWidth={3} seed={1420} />
          <Head x={660} y={720} angle={-0.9} start={0.3} color={C.red} size={14} />
          <SketchLine x1={700} y1={680} x2={650} y2={740} start={0.35} dur={0.2} stroke={C.red} strokeWidth={5} seed={1422} />
          <SketchLine x1={650} y1={680} x2={700} y2={740} start={0.4} dur={0.2} stroke={C.red} strokeWidth={5} seed={1423} />
        </FadeGroup>
      </FadeGroup>
    </Canvas>
  );
};
