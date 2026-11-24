import React from "react";
import {at} from "../timing";
import {C} from "../theme";
import {Canvas, FadeGroup, clamp01} from "../lib/scene";
import {Arrow, Bracket, Head, Label, SketchCircle, SketchLine, SketchPath, SketchRect, Underline} from "../lib/Sketch";
import {Gate, WordChip, useT, Cloud, SpeechBubble, HBar, VectorStrip} from "../lib/kit";

export type SceneProps = {t0: number};

const local = (t0: number) => (phrase: string, occ = 0) =>
  Math.max(0, at(phrase, occ) - t0);

/** Small hand-drawn page icon. */
const PageIcon: React.FC<{x: number; y: number; start?: number; w?: number; h?: number; color?: string; seed?: number}> = ({
  x, y, start = 0, w = 140, h = 176, color = C.fg, seed = 700,
}) => (
  <g>
    <SketchPath d={`M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`} start={start} dur={0.4} stroke={color} strokeWidth={3.2} seed={seed} fill={C.panel} />
    <SketchPath d={`M ${x + w - 40} ${y} L ${x + w} ${y + 40} L ${x + w - 40} ${y + 40} Z`} start={start + 0.2} dur={0.25} stroke={color} strokeWidth={2.6} seed={seed + 1} fill={C.well} />
    {[0, 1, 2].map((i) => (
      <SketchLine key={i} x1={x + 20} y1={y + 64 + i * 26} x2={x + w - 24} y2={y + 64 + i * 26} start={start + 0.3 + i * 0.06} dur={0.2} stroke={C.soft} strokeWidth={2.3} seed={seed + 3 + i} />
    ))}
  </g>
);

/** A signal meter that drains to zero. */
const SignalMeter: React.FC<{
  x: number;
  y: number;
  w: number;
  start: number;
  drain: number;
  drainAt: number;
}> = ({x, y, w, start, drain, drainAt}) => {
  const t = useT();
  const p = clamp01((t - drainAt) / 0.7);
  const fill = w * (1 - p) * drain;
  const thumbX = x + fill;
  return (
    <g>
      <Label text="signal" x={x} y={y - 46} size={40} color={C.soft} align="left" start={start} />
      <SketchRect x={x} y={y} w={w} h={18} start={start} dur={0.35} stroke={C.line} fill={C.well} strokeWidth={2.6} radius={9} seed={322} />
      <SketchRect x={x} y={y} w={Math.max(0, fill)} h={18} start={start + 0.1} dur={0.2} stroke={C.green} fill={C.green} strokeWidth={1.5} radius={9} seed={323} />
      <SketchCircle x={thumbX} y={y + 9} d={40} start={start + 0.15} dur={0.25} stroke={C.green} fill={C.green} seed={324} />
    </g>
  );
};

/** Paper 1, 2, 3 icons for the roadmap. */
const RoadmapIcon: React.FC<{kind: 1 | 2 | 3; x: number; y: number; start: number; color: string}> = ({kind, x, y, start, color}) => {
  if (kind === 1) {
    return (
      <g>
        <SketchRect x={x - 62} y={y - 62} w={124} h={124} start={start} dur={0.4} stroke={color} fill={C.well} strokeWidth={3.2} radius={14} seed={750} />
        <SketchPath d={`M ${x + 10} ${y - 44} L ${x - 6} ${y - 14} L ${x + 14} ${y + 8} L ${x - 2} ${y + 32} L ${x + 6} ${y + 48}`} start={start + 0.4} dur={0.3} stroke={C.red} strokeWidth={4} seed={751} />
      </g>
    );
  }
  if (kind === 2) {
    return (
      <g>
        <SketchPath d={`M ${x - 80} ${y - 32} C ${x - 110} ${y - 62} ${x - 60} ${y - 80} ${x - 20} ${y - 70} C ${x + 30} ${y - 90} ${x + 95} ${y - 62} ${x + 76} ${y - 10} C ${x + 102} ${y + 40} ${x + 20} ${y + 64} ${x - 20} ${y + 42} C ${x - 70} ${y + 62} ${x - 110} ${y + 26} ${x - 80} ${y - 4} Z`} start={start} dur={0.5} stroke={color} strokeWidth={3} fill={C.well} seed={760} roughness={0.9} />
        <Label text=". . ." x={x - 4} y={y - 6} size={44} color={color} start={start + 0.4} />
      </g>
    );
  }
  return (
    <g>
      {[0, 1, 2, 3].map((i) => (
        <SketchRect key={i} x={x - 70 + i * 22} y={y - 20} w={16} h={40} start={start + i * 0.05} dur={0.2} stroke={color} fill={C.well} strokeWidth={2.4} radius={3} seed={770 + i} />
      ))}
      <Arrow x1={x + 18} y1={y} x2={x + 48} y2={y} start={start + 0.25} stroke={color} strokeWidth={3} head={14} />
      <SketchRect x={x + 56} y={y - 24} w={32} h={48} start={start + 0.4} dur={0.2} stroke={color} fill={C.well} strokeWidth={2.6} radius={4} seed={775} />
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* 01 — one function                                                   */
/* ------------------------------------------------------------------ */
export const Hook: React.FC<SceneProps> = ({t0}) => {
  const S = local(t0);
  return (
    <Canvas>
      <FadeGroup start={0.05} end={S("Softmax.") + 0.5} fade={0.4}>
        {Array.from({length: 15}).map((_, i) => {
          const col = i % 5;
          const row = Math.floor(i / 5);
          return (
            <SketchRect
              key={i}
              x={720 + col * 96}
              y={92 + row * 76}
              w={72}
              h={54}
              start={0.06 + i * 0.035}
              dur={0.24}
              stroke={C.soft}
              fill={C.panel}
              strokeWidth={2.6}
              radius={6}
              seed={200 + i}
              roughness={0.9}
            />
          );
        })}
      </FadeGroup>

      {[0, 1, 2, 3, 4].map((i) => (
        <Arrow
          key={i}
          x1={756 + i * 96}
          y1={340}
          x2={800 + i * 80}
          y2={530}
          curve={i < 2 ? 18 : i > 2 ? -18 : 0}
          start={1.2 + i * 0.04}
          dur={0.5}
          stroke={C.purple}
          strokeWidth={2.8}
          head={15}
          seed={230 + i}
        />
      ))}

      <SketchRect x={740} y={540} w={440} h={168} start={1.0} dur={0.4} stroke={C.purple} fill={C.panel} strokeWidth={4.5} radius={16} seed={250} />
      <FadeGroup start={1.45} end={S("Softmax.") - 0.05} fade={0.15}>
        <Label text="?" x={960} y={624} size={72} color={C.soft} start={0} dur={0.2} font="Caveat" />
      </FadeGroup>
      <Label text="softmax" x={960} y={624} size={82} color={C.purple} start={S("Softmax.")} dur={0.3} />
      <Underline x={960} y={700} w={280} start={S("Softmax.") + 0.15} color={C.purple} width={3} />
    </Canvas>
  );
};

/* ------------------------------------------------------------------ */
/* 02 — the bug                                                        */
/* ------------------------------------------------------------------ */
export const TheBug: React.FC<SceneProps> = ({t0}) => {
  const S = local(t0);
  const bug = S("standard version of it has a bug");
  const zero = S("exactly zero");
  const sure = S("most sure of itself");
  return (
    <Canvas>
      <FadeGroup start={0.1} end={bug + 0.08} fade={0.2}>
        <PageIcon x={725} y={430} start={0.1} w={130} h={164} color={C.fg} />
        <Label text="DeepMind" x={915} y={500} size={76} color={C.fg} align="left" start={0.5} />
      </FadeGroup>

      <FadeGroup start={bug + 0.2} end={sure - 0.35} fade={0.3}>
        <SketchRect x={740} y={300} w={440} h={190} start={0} dur={0.4} stroke={C.purple} fill={C.panel} strokeWidth={4.5} radius={16} seed={300} />
        <Label text="softmax" x={960} y={395} size={78} color={C.purple} start={0.2} />
        <SketchPath d="M 1080 340 L 1062 380 L 1090 410 L 1072 445 L 1086 480" start={0.5} dur={0.4} stroke={C.red} strokeWidth={4.5} seed={310} roughness={1.2} />
        <Label text="bug" x={1130} y={262} size={40} color={C.red} start={0.75} />
      </FadeGroup>

      <FadeGroup start={S("best learning signal") - 0.3} end={sure - 0.1} fade={0.3}>
        <SignalMeter x={730} y={650} w={500} start={0} drain={1} drainAt={zero} />
        <Label text="0" x={1260} y={654} size={96} color={C.red} align="left" start={zero} />
      </FadeGroup>

      <FadeGroup start={sure - 0.4} fade={0.1}>
        <Label text="99.9%" x={960} y={560} size={150} color={C.orange} start={0.05} font="Caveat" />
        <SketchRect x={660} y={680} w={600} h={44} start={0.2} dur={0.3} stroke={C.line} fill={C.well} strokeWidth={2.4} radius={8} seed={330} />
        <SketchRect x={660} y={680} w={596} h={44} start={0.3} dur={0.5} stroke={C.orange} fill={C.orange} strokeWidth={2} radius={8} seed={331} />
      </FadeGroup>
    </Canvas>
  );
};

/* ------------------------------------------------------------------ */
/* 03 — the silent agent                                               */
/* ------------------------------------------------------------------ */
export const SilentAgent: React.FC<SceneProps> = ({t0}) => {
  const S = local(t0);
  const T = useT();
  const dim = clamp01((T - (S("beat several frontier models") - 0.4)) / 0.5);
  return (
    <Canvas>
      <g opacity={1 - dim * 0.55}>
        <Cloud x={610} y={300} w={500} h={300} start={S("most of its thinking in silence")} color={C.cyan} seed={410} />
        <SketchCircle x={575} y={450} d={16} start={S("most of its thinking in silence") + 0.5} dur={0.15} stroke={C.cyan} fill={C.cyan} seed={411} />
        <SketchCircle x={600} y={490} d={10} start={S("most of its thinking in silence") + 0.55} dur={0.15} stroke={C.cyan} fill={C.cyan} seed={412} />
        <SketchCircle x={615} y={522} d={5} start={S("most of its thinking in silence") + 0.6} dur={0.15} stroke={C.cyan} fill={C.cyan} seed={413} />

        <SketchCircle x={620} y={610} d={92} start={0.15} dur={0.4} stroke={C.fg} strokeWidth={3.6} seed={400} />
        <SketchLine x1={620} y1={656} x2={620} y2={780} start={0.25} dur={0.25} stroke={C.fg} strokeWidth={3.6} seed={401} />
        <SketchLine x1={620} y1={685} x2={556} y2={752} start={0.32} dur={0.22} stroke={C.fg} strokeWidth={3.6} seed={402} />
        <SketchLine x1={620} y1={685} x2={684} y2={752} start={0.36} dur={0.22} stroke={C.fg} strokeWidth={3.6} seed={403} />
        <SketchLine x1={620} y1={780} x2={568} y2={910} start={0.4} dur={0.22} stroke={C.fg} strokeWidth={3.6} seed={404} />
        <SketchLine x1={620} y1={780} x2={672} y2={910} start={0.44} dur={0.22} stroke={C.fg} strokeWidth={3.6} seed={405} />
        <SketchCircle x={600} y={602} d={4} start={0.5} dur={0.1} stroke={C.fg} fill={C.fg} seed={406} />
        <SketchCircle x={640} y={602} d={4} start={0.52} dur={0.1} stroke={C.fg} fill={C.fg} seed={407} />
      </g>

      <FadeGroup start={S("No words") - 0.15} end={S("only speaks when it needs a tool") - 0.1} fade={0.3}>
        <SpeechBubble x={1210} y={470} w={470} h={240} start={0} color={C.soft} tail="left" seed={430}>
          <Label text=". . ." x={1210} y={470} size={90} color={C.soft} start={0.2} />
        </SpeechBubble>
      </FadeGroup>

      <FadeGroup start={S("only speaks when it needs a tool") - 0.1} end={S("beat several frontier models") - 0.35} fade={0.3}>
        <Arrow x1={700} y1={560} x2={1045} y2={480} curve={-40} start={0} dur={0.4} stroke={C.cyan} strokeWidth={3} head={16} />
        <WordChip text="tool_call()" x={1200} y={470} w={300} start={0.15} color={C.cyan} size={40} mono />
      </FadeGroup>

      <FadeGroup start={S("beat several frontier models") - 0.2} end={S("half as many tokens") - 0.35} fade={0.35}>
        <Label text="score" x={1010} y={250} size={36} color={C.soft} start={0} align="left" font="DejaVu Sans" />
        <HBar x={1100} y={350} w={470} value={58} start={0.1} color={C.soft} dim labelSize={38} seed={450} />
        <HBar x={1100} y={430} w={470} value={66} start={0.22} color={C.soft} dim labelSize={38} seed={452} />
        <HBar x={1100} y={510} w={470} value={54} start={0.34} color={C.soft} dim labelSize={38} seed={454} />
        <Bracket x={1060} y1={370} y2={570} dir={1} start={0.42} color={C.soft} size={14} />
        <Label text="frontier" x={1100} y={325} size={36} color={C.soft} start={0.45} font="DejaVu Sans" />
        <HBar x={1100} y={620} w={470} value={94} label="silent" start={0.55} color={C.green} valueText="94" labelSize={42} seed={456} />
        <SketchLine x1={1100} y1={700} x2={1570} y2={700} start={0.75} dur={0.3} stroke={C.line} strokeWidth={3} seed={458} />
        <Label text="0" x={1100} y={734} size={36} color={C.soft} start={0.8} font="DejaVu Sans" />
        <Label text="100" x={1570} y={734} size={36} color={C.soft} start={0.85} font="DejaVu Sans" />
      </FadeGroup>

      <FadeGroup start={S("half as many tokens") - 0.2} fade={0.35}>
        <Label text="tokens" x={1010} y={782} size={36} color={C.soft} start={0} align="left" />
        <HBar x={1110} y={790} w={420} value={100} label="normal" start={0} color={C.soft} valueText="100%" labelSize={40} seed={460} />
        <HBar x={1110} y={880} w={420} value={50} label="silent" start={0.35} color={C.cyan} valueText="50%" labelSize={40} seed={462} />
      </FadeGroup>
    </Canvas>
  );
};

/* ------------------------------------------------------------------ */
/* 04 — roadmap                                                        */
/* ------------------------------------------------------------------ */
export const Roadmap: React.FC<SceneProps> = ({t0}) => {
  const S = local(t0);
  const code = S("five lines of code");
  const sayLess = S("say less");
  return (
    <Canvas>
      <FadeGroup start={0.1} end={code + 0.1} fade={0.4}>
        {[
          {x: 480, n: "1", c: C.purple},
          {x: 960, n: "2", c: C.cyan},
          {x: 1440, n: "3", c: C.orange},
        ].map((node, i) => (
          <g key={i}>
            <SketchCircle x={node.x} y={560} d={200} start={0.2 + i * 0.2} dur={0.4} stroke={node.c} fill={C.panel} strokeWidth={3.2} seed={710 + i} />
            <SketchCircle x={node.x} y={410} d={54} start={0.35 + i * 0.2} dur={0.25} stroke={node.c} fill="none" strokeWidth={2.4} seed={712 + i} />
            <Label text={node.n} x={node.x} y={410} size={42} color={node.c} start={0.4 + i * 0.2} />
            <RoadmapIcon kind={(i + 1) as 1 | 2 | 3} x={node.x} y={560} start={0.45 + i * 0.2} color={node.c} />
            {i < 2 ? <Arrow x1={node.x + 108} y1={560} x2={node.x + 372} y2={560} start={0.6 + i * 0.25} stroke={C.soft} strokeWidth={3} head={16} /> : null}
          </g>
        ))}
      </FadeGroup>

      <FadeGroup start={code + 0.1} end={sayLess - 0.05} fade={0.3}>
        <SketchRect x={640} y={250} w={640} h={430} start={0} dur={0.4} stroke={C.green} fill={C.panel} strokeWidth={3} radius={12} seed={490} />
        {[
          "z = logits",
          "p = softmax(z)",
          "g = p - y",
          "s = g.sum()",
          "print(s > 1e-7)",
        ].map((line, i) => (
          <Label key={i} text={line} x={700} y={340 + i * 62} size={38} color={C.green} align="left" font="DejaVu Sans Mono" start={0.2 + i * 0.12} />
        ))}
        <Label text="5 lines" x={960} y={740} size={44} color={C.green} start={0.85} />
      </FadeGroup>

      <FadeGroup start={sayLess + 0.05} fade={0.3}>
        <SpeechBubble x={960} y={490} w={620} h={260} start={0} color={C.fg} tail="left" seed={500}>
          <Label text="say less" x={960} y={470} size={92} color={C.orange} start={0.3} />
        </SpeechBubble>
      </FadeGroup>
    </Canvas>
  );
};

/* ------------------------------------------------------------------ */
/* 05 — two things per word + two questions                            */
/* ------------------------------------------------------------------ */
export const TwoQuestions: React.FC<SceneProps> = ({t0}) => {
  const S = local(t0);
  const q1 = S("One. Softmax sits");
  const q2 = S("Two. If every thought");
  return (
    <Canvas>
      <FadeGroup start={0.1} end={S("That gives us two questions") + 0.2} fade={0.35}>
        <Label text="scores" x={370} y={370} size={40} color={C.soft} start={0.15} />
        {[9, -9, 4, -2, 7].map((v, i) => (
          <g key={i}>
            <SketchRect x={170 + i * 100} y={430} w={80} h={64} start={0.2 + i * 0.05} dur={0.2} stroke={C.orange} fill={C.well} strokeWidth={2.6} radius={6} seed={520 + i} />
            <Label text={`${v}`} x={210 + i * 100} y={463} size={40} color={C.orange} start={0.25 + i * 0.05} font="DejaVu Sans Mono" />
          </g>
        ))}
        <Arrow x1={700} y1={462} x2={810} y2={462} start={S("turns scores into chances") - 0.3} stroke={C.soft} strokeWidth={3} />
        <SketchRect x={810} y={395} w={300} h={134} start={S("turns scores into chances")} dur={0.4} stroke={C.purple} fill={C.panel} strokeWidth={4} radius={12} seed={530} />
        <Label text="softmax" x={960} y={464} size={54} color={C.purple} start={S("turns scores into chances") + 0.2} />
        <Arrow x1={1110} y1={462} x2={1220} y2={462} start={S("turns scores into chances") + 0.35} stroke={C.soft} strokeWidth={3} />
        {[
          {v: 78, c: C.green, w: "cat"},
          {v: 12, c: C.cyan, w: "dog"},
          {v: 6, c: C.orange, w: "a"},
          {v: 4, c: C.soft, w: "the"},
        ].map((b, i) => (
          <g key={i}>
            <SketchRect x={1230} y={382 + i * 44} w={Math.max(10, 430 * (b.v / 100))} h={28} start={S("turns scores into chances") + 0.5 + i * 0.07} dur={0.3} stroke={b.c} fill={b.c} strokeWidth={2} radius={5} seed={540 + i} />
            <Label text={`${b.v}%`} x={1680} y={397 + i * 44} size={36} color={b.c} align="left" start={S("turns scores into chances") + 0.7 + i * 0.07} font="DejaVu Sans Mono" />
            <Label text={b.w} x={1210} y={397 + i * 44} size={36} color={C.soft} align="right" start={S("turns scores into chances") + 0.55 + i * 0.07} />
          </g>
        ))}
        <FadeGroup start={S("picks one word and throws everything else away") - 0.1} fade={0.3}>
          <WordChip text="cat" x={960} y={720} w={190} h={86} start={0} color={C.green} size={56} />
          {[0, 1, 2, 3].map((i) => (
            <SketchRect key={i} x={1180 + i * 66} y={760 - i * 22} w={50} h={36} start={0.35 + i * 0.05} dur={0.2} stroke={C.dim} fill="none" strokeWidth={2} radius={4} seed={560 + i} opacity={0.45} />
          ))}
        </FadeGroup>
      </FadeGroup>

      <FadeGroup start={S("That gives us two questions") + 0.25} end={q2 + 0.15} fade={0.3}>
        <SketchCircle x={820} y={340} d={58} start={0} dur={0.2} stroke={C.purple} fill={C.panel} strokeWidth={2.6} seed={578} />
        <Label text="1" x={820} y={340} size={40} color={C.purple} start={0.05} />
        <Label text="?" x={1050} y={340} size={150} color={C.purple} start={0.1} font="Caveat" />
        {[
          {v: 78, c: C.green, w: "cat"},
          {v: 12, c: C.cyan, w: "dog"},
          {v: 6, c: C.orange, w: "a"},
          {v: 4, c: C.soft, w: "the"},
        ].map((b, i) => (
          <g key={i}>
            <SketchRect x={620} y={470 + i * 78} w={Math.max(10, 520 * (b.v / 100))} h={42} start={q1 - 0.05 + i * 0.06} dur={0.25} stroke={b.c} fill={b.c} strokeWidth={2} radius={5} seed={582 + i} />
            <Label text={b.w} x={590} y={491 + i * 78} size={38} color={C.soft} align="right" start={q1 + i * 0.06} />
          </g>
        ))}
        <Label text="sum = 1" x={960} y={850} size={50} color={C.fg} start={q1 + 0.35} />
        <Underline x={960} y={890} w={220} start={q1 + 0.5} color={C.purple} width={3} />
      </FadeGroup>

      <FadeGroup start={q2 + 0.05} fade={0.3}>
        <SketchCircle x={830} y={340} d={58} start={0} dur={0.2} stroke={C.cyan} fill={C.panel} strokeWidth={2.6} seed={590} />
        <Label text="2" x={830} y={340} size={40} color={C.cyan} start={0.05} />
        <Label text="?" x={1060} y={340} size={150} color={C.cyan} start={0.1} font="Caveat" />
        <VectorStrip x={760} y={570} n={8} cell={54} start={0.1} color={C.cyan} showValues={false} seed={570} />
        <Arrow x1={1200} y1={570} x2={1300} y2={570} start={0.35} stroke={C.cyan} strokeWidth={3.2} head={16} />
        <WordChip text="one" x={1440} y={570} w={180} h={78} start={0.3} color={C.orange} size={46} />
        <Label text="word" x={1440} y={650} size={38} color={C.soft} start={0.5} />
      </FadeGroup>
    </Canvas>
  );
};

/* ------------------------------------------------------------------ */
/* 06 — gate summary + table + chapter                                 */
/* ------------------------------------------------------------------ */
export const OneIdea: React.FC<SceneProps> = ({t0}) => {
  const S = local(t0);
  const leak = S("Paper one says the gate leaks");
  const push = S("Papers two and three");
  const table = S("One test in the second paper");
  const startZero = S("But first, let's start from zero");
  return (
    <Canvas>
      <FadeGroup start={0.1} end={table + 0.1} fade={0.3}>
        <Cloud x={400} y={430} w={300} h={180} start={0.2} color={C.cyan} fill={C.panel} seed={580} />
        <Arrow x1={570} y1={430} x2={740} y2={430} start={0.6} stroke={C.cyan} strokeWidth={3} head={16} />
        <Gate x={760} y={330} w={400} h={400} start={0.2} color={C.purple} label="softmax" leak={1} leakStart={leak} />
        <Arrow x1={1180} y1={430} x2={1300} y2={430} start={0.75} stroke={C.orange} strokeWidth={3} head={16} />
        {["cat", "a"].map((w, i) => (
          <WordChip key={i} text={w} x={1400} y={390 + i * 80} w={120} start={0.9 + i * 0.08} color={C.orange} size={38} />
        ))}
        <Arrow x1={570} y1={470} x2={750} y2={470} start={push - 0.05} stroke={C.orange} strokeWidth={8} head={18} />
        <Label text="2+3" x={660} y={390} size={36} color={C.orange} start={push + 0.1} />
      </FadeGroup>

      <FadeGroup start={table + 0.2} end={startZero - 0.05} fade={0.3}>
        <SketchRect x={600} y={240} w={720} h={500} start={0.05} dur={0.4} stroke={C.fg} fill={C.panel} strokeWidth={3.2} radius={10} seed={620} />
        {[0, 1, 2, 3].map((r) => (
          <SketchLine key={r} x1={600} y1={340 + r * 95} x2={1320} y2={340 + r * 95} start={0.3 + r * 0.05} dur={0.2} stroke={C.line} strokeWidth={2.4} seed={630 + r} />
        ))}
        {["baseline", "block", "noise", "wrong problem", "random"].map((t, i) => (
          <Label key={i} text={t} x={630} y={292 + i * 95} size={36} color={C.soft} align="left" start={0.35 + i * 0.05} />
        ))}
        {["?", "?", "?", "?", "?"].map((t, i) => (
          <Label key={i} text={t} x={1270} y={292 + i * 95} size={44} color={C.orange} start={0.55 + i * 0.06} />
        ))}
      </FadeGroup>

      <FadeGroup start={startZero + 0.1} fade={0.4}>
        <Label text="0" x={960} y={545} size={340} color={C.fg} start={0.1} font="Caveat" />
        <SketchPath
          d={`M ${960 + 300 * Math.cos(2.7)} ${545 + 300 * Math.sin(2.7)} A 300 300 0 1 1 ${960 + 300 * Math.cos(0.55)} ${545 + 300 * Math.sin(0.55)}`}
          start={0.35}
          dur={0.9}
          stroke={C.purple}
          strokeWidth={4}
          seed={650}
        />
        <Head x={960 + 300 * Math.cos(0.55)} y={545 + 300 * Math.sin(0.55)} angle={0.55 + Math.PI / 2} start={1.15} color={C.purple} size={20} />
      </FadeGroup>
    </Canvas>
  );
};
