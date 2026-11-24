import React from "react";
import {C} from "../theme";
import {Canvas, FadeGroup, clamp01} from "../lib/scene";
import {Arrow, Head, Label, SketchCircle, SketchLine, SketchPath, SketchRect, Underline} from "../lib/Sketch";
import {Gate, HBar, SpeechBubble, VBar, WordChip, useT, Cloud, VectorStrip} from "../lib/kit";
import {at} from "../timing";
import type {SceneProps} from "./ch1";

const local = (t0: number) => (phrase: string, occ = 0) =>
  Math.max(0, at(phrase, occ) - t0);

const Badge: React.FC<{x: number; y: number; n: string; start: number; color: string; size?: number}> = ({x, y, n, start, color, size = 58}) => (
  <g>
    <SketchCircle x={x} y={y} d={size} start={start} dur={0.2} stroke={color} fill={C.panel} strokeWidth={2.6} seed={2500 + Number(n)} />
    <Label text={n} x={x} y={y} size={size * 0.55} color={color} start={start + 0.08} font="DejaVu Sans" />
  </g>
);

/* ------------------------------------------------------------------ */
/* 43 — paper three                                                    */
/* ------------------------------------------------------------------ */
export const PaperThree: React.FC<SceneProps> = ({t0}) => {
  const S = local(t0);
  return (
    <Canvas>
      <SketchRect x={800} y={320} w={320} h={400} start={0.1} dur={0.4} stroke={C.orange} fill={C.panel} strokeWidth={3.5} radius={10} seed={2510} />
      <Label text="3" x={960} y={540} size={160} color={C.orange} start={0.3} font="Caveat" />
      <Label text="training" x={960} y={660} size={40} color={C.soft} start={0.5} />
    </Canvas>
  );
};

/* ------------------------------------------------------------------ */
/* 44 — floors and latent feedback                                     */
/* ------------------------------------------------------------------ */
export const Floors: React.FC<SceneProps> = ({t0}) => {
  const S = local(t0);
  const feedback = S("Latent feedback changes one thing");
  const T = useT();
  return (
    <Canvas>
      <FloorsDiagram start={0.1} t0={t0} mode={T >= feedback - 0.1 ? "feedback" : "up"} />
      <FadeGroup start={feedback - 0.05} fade={0.3}>
        <Label text="4 lines" x={1440} y={760} size={40} color={C.green} start={S("four lines of code") - 0.1} />
        <Label text="1.2×" x={1440} y={850} size={44} color={C.orange} start={S("1.2 times more compute") - 0.1} font="DejaVu Sans Mono" />
      </FadeGroup>
    </Canvas>
  );
};

const FloorsDiagram: React.FC<{start: number; t0: number; mode: "up" | "feedback"}> = ({start, t0, mode}) => {
  const S = local(t0);
  const frame = useT();
  const floors = 5;
  const top = 250;
  const floorH = 92;
  const gap = 12;
  const bottomY = top + floors * (floorH + gap);
  const climb = clamp01((frame - (S("The thought climbs") - 0.1)) / 2.2);
  const dotY = bottomY - 46 - climb * (bottomY - top - 46 - 40);
  const nx = 960;
  return (
    <g>
      <SketchRect x={nx - 160} y={top} w={320} h={floors * (floorH + gap)} start={start} dur={0.5} stroke={C.fg} fill={C.panel} strokeWidth={4} radius={8} seed={2520} />
      {Array.from({length: floors}).map((_, i) => (
        <g key={i}>
          <SketchLine x1={nx - 160} y1={top + (i + 1) * (floorH + gap) - gap / 2} x2={nx + 160} y2={top + (i + 1) * (floorH + gap) - gap / 2} start={start + 0.2 + i * 0.08} dur={0.2} stroke={C.line} strokeWidth={3} seed={2521 + i} />
          <SketchRect x={nx - 120} y={top + i * (floorH + gap) + 14} w={240} h={floorH - 28} start={start + 0.25 + i * 0.08} dur={0.2} stroke={C.dim} fill={C.well} strokeWidth={2} radius={5} seed={2530 + i} opacity={0.6} />
        </g>
      ))}
      <Label text="top" x={nx} y={top - 26} size={40} color={C.soft} start={start + 0.6} />
      <Label text="bottom" x={nx} y={top + floors * (floorH + gap) + 34} size={40} color={C.soft} start={start + 0.7} />

      <WordChip text="cat" x={480} y={bottomY - 46} w={150} h={66} start={start + 0.5} color={C.orange} size={40} />
      <Arrow x1={558} y1={bottomY - 46} x2={nx - 166} y2={bottomY - 46} start={start + 0.7} stroke={C.soft} strokeWidth={3} head={14} />
      <SketchCircle x={nx} y={dotY} d={24} start={0.5} dur={0.3} stroke={C.cyan} fill={C.cyan} seed={2540} />

      {mode === "feedback" ? (
        <g>
          <SketchPath d={`M ${nx + 170} ${top + 46} Q ${1420} ${top + 20} ${1420} ${bottomY - 70}`} start={0.2} dur={0.8} stroke={C.cyan} strokeWidth={3.5} seed={2550} />
          <Head x={1420} y={bottomY - 50} angle={1.57} start={0.95} color={C.cyan} size={16} />
          <WordChip text="next" x={1420} y={bottomY - 10} w={170} h={66} start={0.4} color={C.orange} size={40} />
        </g>
      ) : (
        <g>
          <Arrow x1={nx + 170} y1={top + 46} x2={1280} y2={top + 46} start={start + 0.8} stroke={C.soft} strokeWidth={3} head={14} />
          <WordChip text="next" x={1370} y={top + 46} w={170} h={66} start={start + 0.9} color={C.orange} size={40} />
        </g>
      )}
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* 45 — the fair fight                                                 */
/* ------------------------------------------------------------------ */
export const FairFight: React.FC<SceneProps> = ({t0}) => {
  const S = local(t0);
  return (
    <Canvas>
      <FadeGroup start={0.1} end={S("So if you have extra compute") - 0.15} fade={0.3}>
        <Label text="data" x={420} y={360} size={40} color={C.soft} align="left" start={0} />
        <SketchLine x1={740} y1={760} x2={1320} y2={760} start={0.2} dur={0.4} stroke={C.soft} strokeWidth={3} seed={2572} />
        <Label text="value" x={740} y={330} size={40} color={C.soft} align="left" start={0.2} font="DejaVu Sans" />
        <Label text="passes" x={1320} y={800} size={40} color={C.soft} start={0.3} />
        {[0, 1, 2].map((i) => (
          <SketchRect key={i} x={420} y={400 + i * 60} w={260 - i * 40} h={42} start={0.2 + i * 0.15} dur={0.3} stroke={C.orange} fill={C.well} strokeWidth={2.5} radius={5} seed={2570 + i} opacity={1 - i * 0.22} />
        ))}
        <SketchPath d="M 760 340 C 860 340 880 500 980 520 C 1120 540 1200 700 1320 720" start={0.7} dur={1.0} stroke={C.red} strokeWidth={4} seed={2580} />
        <Label text="repeats" x={1400} y={650} size={40} color={C.red} start={1.0} />
      </FadeGroup>
    </Canvas>
  );
};

/* ------------------------------------------------------------------ */
/* 46 — scaling results                                                */
/* ------------------------------------------------------------------ */
export const Scaling: React.FC<SceneProps> = ({t0}) => {
  const S = local(t0);
  const size = S("They tested models from 60 million");
  const serve = S("And at serving time");
  return (
    <Canvas>
      <FadeGroup start={0.1} end={S("up to 48 percent less compute") - 0.4} fade={0.25}>
        <Label text="unique text" x={960} y={450} size={44} color={C.soft} start={0.2} />
        <SketchRect x={620} y={510} w={680} h={30} start={0.3} dur={0.3} stroke={C.line} fill={C.well} strokeWidth={2.4} radius={6} seed={2565} />
        {Array.from({length: 14}).map((_, i) => (
          <SketchCircle key={i} x={650 + i * 44} y={525} d={12} start={0.5 + i * 0.06} dur={0.12} stroke={C.cyan} fill={C.cyan} seed={2566 + i} />
        ))}
      </FadeGroup>

      <FadeGroup start={S("up to 48 percent less compute") - 0.35} end={size - 0.15} fade={0.3}>
        <Label text="48%" x={620} y={430} size={120} color={C.green} start={S("up to 48 percent less compute") - 0.1} font="Caveat" />
        <Label text="compute" x={620} y={520} size={40} color={C.soft} start={S("up to 48 percent less compute") + 0.1} />
        <Label text="47%" x={1300} y={430} size={120} color={C.cyan} start={S("up to 47 percent less unique data") - 0.1} font="Caveat" />
        <Label text="data" x={1300} y={520} size={40} color={C.soft} start={S("up to 47 percent less unique data") + 0.1} />
      </FadeGroup>

      <FadeGroup start={size - 0.1} end={serve - 0.15} fade={0.3}>
        <Label text="60M" x={480} y={500} size={52} color={C.soft} start={0} />
        <Arrow x1={600} y1={500} x2={1250} y2={500} start={0.2} stroke={C.soft} strokeWidth={3} head={16} />
        <Label text="778M" x={1380} y={500} size={52} color={C.fg} start={0.4} />
        <Label text="parameters" x={960} y={590} size={40} color={C.soft} start={0.5} />
        <Label text="0.3%" x={960} y={680} size={76} color={C.green} start={S("within 0.3 percent") - 0.1} />
        <Label text="predict" x={960} y={760} size={40} color={C.soft} start={S("within 0.3 percent") + 0.2} />
      </FadeGroup>

      <FadeGroup start={serve - 0.1} fade={0.3}>
        <SketchRect x={520} y={420} w={300} h={220} start={0.1} dur={0.4} stroke={C.purple} fill={C.panel} strokeWidth={3} radius={12} seed={2590} />
        <Label text="params" x={670} y={540} size={40} color={C.purple} start={0.3} />
        <SketchRect x={1100} y={420} w={300} h={220} start={0.4} dur={0.4} stroke={C.cyan} fill={C.panel} strokeWidth={3} radius={12} seed={2591} />
        <Label text="cache" x={1250} y={540} size={40} color={C.cyan} start={0.6} />
        <Label text="same" x={960} y={760} size={48} color={C.green} start={0.8} />
        <Arrow x1={870} y1={530} x2={1060} y2={530} start={0.7} stroke={C.green} strokeWidth={3} head={14} />
      </FadeGroup>
    </Canvas>
  );
};

/* ------------------------------------------------------------------ */
/* 47 — the catch and the same story                                   */
/* ------------------------------------------------------------------ */
export const Catch: React.FC<SceneProps> = ({t0}) => {
  const S = local(t0);
  const same = S("It's the same story");
  return (
    <Canvas>
      <FadeGroup start={0.1} end={same - 0.15} fade={0.3}>
        <SketchLine x1={440} y1={700} x2={1500} y2={700} start={0} dur={0.5} stroke={C.soft} strokeWidth={3.5} seed={2600} />
        <SketchLine x1={440} y1={700} x2={440} y2={300} start={0.1} dur={0.4} stroke={C.soft} strokeWidth={3.5} seed={2601} />
        <Label text="compute" x={400} y={320} size={40} color={C.soft} align="right" start={0.3} font="DejaVu Sans" />
        <Label text="tokens" x={1500} y={748} size={40} color={C.soft} align="left" start={0.3} font="DejaVu Sans" />
        <SketchPath d="M 460 640 C 700 620 820 680 960 680 C 1120 680 1280 480 1480 380" start={0.5} dur={1.0} stroke={C.green} strokeWidth={4} seed={2602} />
        <SketchLine x1={960} y1={330} x2={960} y2={700} start={S("At 12.5 unique tokens") - 0.1} dur={0.4} stroke={C.red} strokeWidth={3} seed={2603} dash />
        <Label text="12.5" x={960} y={310} size={40} color={C.red} start={S("At 12.5 unique tokens") - 0.05} font="DejaVu Sans Mono" />
        <Label text="+8%" x={640} y={420} size={64} color={C.red} start={S("8 percent more compute") - 0.1} />
      </FadeGroup>

      <FadeGroup start={same - 0.1} fade={0.3}>
        <VectorStrip x={500} y={480} n={8} cell={54} start={0} color={C.cyan} showValues={false} seed={2610} />
        <Arrow x1={960} y1={480} x2={1110} y2={480} start={0.3} stroke={C.soft} strokeWidth={3} head={16} />
        <SketchRect x={1130} y={380} w={240} h={220} start={0.4} dur={0.4} stroke={C.red} fill={C.panel} strokeWidth={3} radius={10} seed={2611} />
        <Label text="trash" x={1250} y={490} size={40} color={C.red} start={0.6} />
        <SketchLine x1={1190} y1={440} x2={1310} y2={440} start={0.8} dur={0.2} stroke={C.red} strokeWidth={4} seed={2612} />
        <Label text="thrown away" x={800} y={640} size={44} color={C.red} start={S("throws it away") - 0.1} />
      </FadeGroup>
    </Canvas>
  );
};

/* ------------------------------------------------------------------ */
/* 48 — the dial                                                       */
/* ------------------------------------------------------------------ */
export const Dial: React.FC<SceneProps> = ({t0}) => {
  const S = local(t0);
  const T = useT();
  const left = S("Turn it all the way left");
  const right = S("Turn it all the way right");
  const middle = S("Hybrid agents sit in the middle");
  const pos = T < left ? 0 : T < right ? clamp01((T - left) / Math.max(0.1, right - left)) : T < middle ? 1 : 0.5;
  const knobX = 380 + pos * 760;
  return (
    <Canvas>
      <SketchLine x1={340} y1={600} x2={1580} y2={600} start={0.1} dur={0.5} stroke={C.line} strokeWidth={10} seed={2620} />
      <SketchLine x1={340} y1={600} x2={720} y2={600} start={0.2} dur={0.3} stroke={C.orange} strokeWidth={10} seed={2621} />
      <SketchLine x1={720} y1={600} x2={1200} y2={600} start={0.25} dur={0.3} stroke={C.purple} strokeWidth={10} seed={2624} />
      <SketchLine x1={1200} y1={600} x2={1580} y2={600} start={0.3} dur={0.3} stroke={C.cyan} strokeWidth={10} seed={2622} />
      <Label text="write" x={530} y={520} size={44} color={C.orange} start={0.4} />
      <Label text="hybrid" x={960} y={520} size={44} color={C.purple} start={0.5} />
      <Label text="silent" x={1390} y={520} size={44} color={C.cyan} start={0.6} />
      <SketchCircle x={knobX} y={600} d={54} start={0.6} dur={0.2} stroke={C.fg} fill={C.fg} seed={2623} />
      <FadeGroup start={middle - 0.1} fade={0.3}>
        <Label text="say what matters" x={960} y={760} size={46} color={C.purple} start={0.1} />
      </FadeGroup>
    </Canvas>
  );
};

/* ------------------------------------------------------------------ */
/* 49 — the gate summary                                               */
/* ------------------------------------------------------------------ */
export const GateSummary: React.FC<SceneProps> = ({t0}) => {
  const S = local(t0);
  const leak = S("paper one says the gate leaks");
  const push = S("Papers two and three");
  return (
    <Canvas>
      <Cloud x={420} y={430} w={300} h={180} start={0.1} color={C.cyan} seed={2630} />
      <Arrow x1={580} y1={430} x2={756} y2={430} start={0.4} stroke={C.cyan} strokeWidth={3} head={16} />
      <Gate x={760} y={330} w={400} h={400} start={0.2} color={C.purple} label="softmax" leak={1} leakStart={leak} />
      <Arrow x1={1180} y1={430} x2={1348} y2={430} start={0.6} stroke={C.orange} strokeWidth={3} head={16} />
      {["cat", "a"].map((w, i) => <WordChip key={i} text={w} x={1420} y={390 + i * 80} w={110} start={0.75 + i * 0.1} color={C.orange} size={40} />)}
      <FadeGroup start={push - 0.1} fade={0.3}>
        <Arrow x1={580} y1={470} x2={730} y2={470} start={0} stroke={C.orange} strokeWidth={8} head={18} />
        <Label text="2+3" x={660} y={380} size={40} color={C.orange} start={0.1} />
        <Label text="leak" x={1100} y={800} size={40} color={C.red} start={0.6} />
      </FadeGroup>
    </Canvas>
  );
};

/* ------------------------------------------------------------------ */
/* 50 — distillation guess                                             */
/* ------------------------------------------------------------------ */
export const DistillGuess: React.FC<SceneProps> = ({t0}) => {
  const S = local(t0);
  const guess = S("This next part is a guess");
  return (
    <Canvas>
      <FadeGroup start={0.1} fade={0.3}>
        <SketchRect x={420} y={320} w={360} h={260} start={0.1} dur={0.4} stroke={C.purple} fill={C.panel} strokeWidth={4} radius={14} seed={2650} />
        <Label text="teacher" x={600} y={450} size={42} color={C.purple} start={0.3} />
        <Arrow x1={790} y1={420} x2={960} y2={420} start={0.5} stroke={C.soft} strokeWidth={3} head={16} />
        <SketchRect x={980} y={400} w={260} h={140} start={0.6} dur={0.4} stroke={C.cyan} fill={C.panel} strokeWidth={3.5} radius={12} seed={2651} />
        <Label text="student" x={1110} y={470} size={40} color={C.cyan} start={0.8} />
        <Label text="guess" x={960} y={750} size={56} color={C.red} start={guess - 0.1} font="Caveat" />
        <Label text="not a result" x={960} y={840} size={40} color={C.soft} start={guess + 0.15} />
      </FadeGroup>
      <FadeGroup start={S("second bug lives") - 0.1} fade={0.3}>
        <Label text="0.84123400" x={510} y={300} size={40} color={C.orange} start={0} font="DejaVu Sans Mono" />
        <Label text="0.84123394" x={1110} y={300} size={40} color={C.cyan} start={0.2} font="DejaVu Sans Mono" />
        <Label text="6×10⁻⁸" x={960} y={680} size={54} color={C.red} start={S("worth an afternoon") - 0.2} font="DejaVu Sans Mono" />
      </FadeGroup>
    </Canvas>
  );
};

/* ------------------------------------------------------------------ */
/* 51 — Monday checklist                                               */
/* ------------------------------------------------------------------ */
export const Monday: React.FC<SceneProps> = ({t0}) => {
  const S = local(t0);
  return (
    <Canvas>
      {[
        {n: "1", y: 360, l: "sum = 0", c: C.red},
        {n: "2", y: 560, l: "grad = 0", c: C.green},
        {n: "3", y: 760, l: "read code", c: C.cyan},
      ].map((row, i) => (
        <g key={i}>
          <Badge x={360} y={row.y} n={row.n} start={S(["Run the gradient test", "If you distill", "If you build agents"][i]) - 0.1} color={row.c} size={62} />
          <Label text={row.l} x={620} y={row.y} size={54} color={row.c} align="left" start={S(["Run the gradient test", "If you distill", "If you build agents"][i]) + 0.2} font={i === 2 ? "Patrick Hand" : "DejaVu Sans Mono"} />
        </g>
      ))}
    </Canvas>
  );
};

/* ------------------------------------------------------------------ */
/* 52 — closing and CTA                                                */
/* ------------------------------------------------------------------ */
export const Close: React.FC<SceneProps> = ({t0}) => {
  const S = local(t0);
  const more = S("One more thing");
  const post = S("So run the five-line test");
  return (
    <Canvas>
      <FadeGroup start={0.1} end={more - 0.1} fade={0.3}>
        <Cloud x={700} y={400} w={460} h={280} start={0.1} color={C.cyan} seed={2660} />
        <Label text="throw away" x={700} y={760} size={44} color={C.red} start={S("thinking we throw away") - 0.1} />
        <Arrow x1={960} y1={500} x2={1120} y2={500} start={0.5} stroke={C.red} strokeWidth={3} head={16} />
        <SketchRect x={1140} y={400} w={220} h={220} start={0.6} dur={0.4} stroke={C.red} fill={C.panel} strokeWidth={3} radius={10} seed={2661} />
        <Label text="trash" x={1250} y={510} size={40} color={C.red} start={0.8} />
      </FadeGroup>

      <FadeGroup start={more - 0.05} end={post - 0.1} fade={0.3}>
        <Label text="maybe clean" x={720} y={420} size={44} color={C.green} start={S("Maybe your runs are clean") - 0.1} />
        <Label text="maybe not" x={1200} y={420} size={44} color={C.red} start={S("Maybe they're not") - 0.1} />
        <Label text="?" x={960} y={620} size={120} color={C.soft} start={0.5} font="Caveat" />
      </FadeGroup>

      <FadeGroup start={post - 0.1} fade={0.3}>
        <SketchRect x={560} y={300} w={800} h={330} start={0} dur={0.4} stroke={C.fg} fill={C.panel} strokeWidth={3} radius={12} seed={2670} />
        {["z = logits", "p = softmax(z)", "s = (p - y).sum()", "print(s)"].map((l, i) => (
          <Label key={i} text={l} x={620} y={380 + i * 56} size={40} color={C.green} align="left" font="DejaVu Sans Mono" start={0.2 + i * 0.12} />
        ))}
        <SpeechBubble x={960} y={800} w={520} h={180} start={S("post your number") - 0.2} color={C.orange} tail="left" seed={2671}>
          <Label text="your number" x={960} y={795} size={40} color={C.orange} start={S("post your number") + 0.1} />
        </SpeechBubble>
      </FadeGroup>
    </Canvas>
  );
};
