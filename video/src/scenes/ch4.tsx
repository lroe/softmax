import React from "react";
import {C} from "../theme";
import {Canvas, FadeGroup, clamp01} from "../lib/scene";
import {Arrow, Head, Label, SketchCircle, SketchLine, SketchPath, SketchRect, Underline} from "../lib/Sketch";
import {HBar, SpeechBubble, VectorStrip, WordChip, useT, Cloud} from "../lib/kit";
import {at} from "../timing";
import type {SceneProps} from "./ch1";

const local = (t0: number) => (phrase: string, occ = 0) =>
  Math.max(0, at(phrase, occ) - t0);

const Badge: React.FC<{x: number; y: number; n: string; start: number; color: string; size?: number}> = ({x, y, n, start, color, size = 60}) => (
  <g>
    <SketchCircle x={x} y={y} d={size} start={start} dur={0.2} stroke={color} fill={C.panel} strokeWidth={2.6} seed={2000 + Number(n)} />
    <Label text={n} x={x} y={y} size={size * 0.55} color={color} start={start + 0.08} font="DejaVu Sans" />
  </g>
);

const Page: React.FC<{x: number; y: number; w?: number; h?: number; start?: number; seed?: number; opacity?: number}> = ({x, y, w = 220, h = 300, start = 0, seed = 2010, opacity = 1}) => (
  <g opacity={opacity}>
    <SketchRect x={x} y={y} w={w} h={h} start={start} dur={0.4} stroke={C.soft} fill={C.panel} strokeWidth={2.8} radius={6} seed={seed} />
    {Array.from({length: 8}).map((_, i) => (
      <SketchLine key={i} x1={x + 24} y1={y + 36 + i * 30} x2={x + w - 24 - (i % 3) * 18} y2={y + 36 + i * 30} start={start + 0.2 + i * 0.03} dur={0.15} stroke={C.line} strokeWidth={3} seed={seed + 1 + i} />
    ))}
  </g>
);

/* ------------------------------------------------------------------ */
/* 28 — the pick-a-word price                                          */
/* ------------------------------------------------------------------ */
export const PickPrice: React.FC<SceneProps> = ({t0}) => {
  const S = local(t0);
  const asks = S("Why does a model have to write down");
  const writes = S("When a reasoning model thinks");
  const price = S("Every word costs one full trip");
  return (
    <Canvas>
      <FadeGroup start={0.1} end={asks - 0.02} fade={0.15}>
        {["think", "score", "chances", "pick", "feed back"].map((w, i) => (
          <g key={w}>
            <WordChip text={w} x={250 + i * 355} y={500} w={i === 4 ? 260 : 230} h={78} start={0.1 + i * 0.06} color={i === 3 ? C.red : C.fg} size={40} />
            {i < 4 ? <Arrow x1={250 + i * 355 + 130} y1={500} x2={250 + (i + 1) * 355 - 130} y2={500} start={0.2 + i * 0.08} stroke={C.soft} strokeWidth={3} head={14} /> : null}
          </g>
        ))}
      </FadeGroup>

      <FadeGroup start={asks + 0.03} end={writes + 0.1} fade={0.15}>
        <Cloud x={820} y={400} w={500} h={300} start={0} color={C.cyan} seed={2030} />
        <SketchPath d="M 820 552 Q 820 610 820 645" start={0.6} dur={0.3} stroke={C.cyan} strokeWidth={2.2} seed={2039} opacity={0.7} />
        <SketchCircle x={820} y={690} d={86} start={0.2} dur={0.35} stroke={C.fg} strokeWidth={3.4} seed={2031} />
        <SketchLine x1={820} y1={734} x2={820} y2={850} start={0.3} dur={0.2} stroke={C.fg} strokeWidth={3.4} seed={2032} />
        <SketchLine x1={820} y1={760} x2={768} y2={812} start={0.35} dur={0.2} stroke={C.fg} strokeWidth={3.4} seed={2035} />
        <SketchLine x1={820} y1={760} x2={872} y2={812} start={0.38} dur={0.2} stroke={C.fg} strokeWidth={3.4} seed={2036} />
        <SketchLine x1={820} y1={850} x2={782} y2={930} start={0.42} dur={0.2} stroke={C.fg} strokeWidth={3.4} seed={2037} />
        <SketchLine x1={820} y1={850} x2={858} y2={930} start={0.45} dur={0.2} stroke={C.fg} strokeWidth={3.4} seed={2038} />
        <SketchCircle x={802} y={682} d={4} start={0.4} dur={0.1} stroke={C.fg} fill={C.fg} seed={2033} />
        <SketchCircle x={838} y={682} d={4} start={0.42} dur={0.1} stroke={C.fg} fill={C.fg} seed={2034} />
        <Label text="?" x={1170} y={470} size={120} color={C.soft} start={0.5} font="Caveat" />
      </FadeGroup>

      <FadeGroup start={writes - 0.15} end={price + 0.1} fade={0.2}>
        <Page x={600} y={300} start={0.1} seed={2040} />
        <Page x={650} y={340} start={0.35} seed={2050} />
        <Page x={700} y={380} start={0.6} seed={2060} />
        <Label text="words" x={1000} y={300} size={40} color={C.orange} start={0.8} />
      </FadeGroup>

      <FadeGroup start={price - 0.15} fade={0.2}>
        <WordChip text="word" x={450} y={710} w={160} h={70} start={0.2} color={C.orange} size={40} />
        <Arrow x1={550} y1={710} x2={700} y2={710} start={0.4} stroke={C.soft} strokeWidth={3} head={16} />
        <SketchRect x={710} y={620} w={440} h={180} start={0.5} dur={0.4} stroke={C.purple} fill={C.panel} strokeWidth={4} radius={14} seed={2070} />
        <Label text="model" x={930} y={710} size={44} color={C.purple} start={0.7} />
        <Arrow x1={1160} y1={710} x2={1300} y2={710} start={0.8} stroke={C.soft} strokeWidth={3} head={16} />
        <WordChip text="word" x={1440} y={710} w={160} h={70} start={0.9} color={C.orange} size={40} />
        <Label text="1 trip" x={930} y={870} size={44} color={C.red} start={1.0} />
      </FadeGroup>
    </Canvas>
  );
};

/* ------------------------------------------------------------------ */
/* 29 — squeeze, painting, latent                                      */
/* ------------------------------------------------------------------ */
export const Squeeze: React.FC<SceneProps> = ({t0}) => {
  const S = local(t0);
  const painting = S("It's like describing a painting");
  const latent = S("So some researchers asked");
  const feed = S("Take the thought and feed it straight back");
  return (
    <Canvas>
      <FadeGroup start={0.1} end={painting - 0.1} fade={0.3}>
        <VectorStrip x={420} y={420} n={12} cell={50} start={0} color={C.cyan} seed={2080} />
        <Arrow x1={1060} y1={420} x2={1150} y2={420} start={S("Softmax squeezes it") - 0.2} stroke={C.soft} strokeWidth={3} head={16} />
        <SketchRect x={1160} y={355} w={260} h={130} start={S("Softmax squeezes it") - 0.1} dur={0.35} stroke={C.purple} fill={C.panel} strokeWidth={4} radius={12} seed={2081} />
        <Label text="softmax" x={1290} y={420} size={48} color={C.purple} start={S("Softmax squeezes it") + 0.1} />
        <Arrow x1={1430} y1={420} x2={1520} y2={420} start={S("Softmax squeezes it") + 0.3} stroke={C.soft} strokeWidth={3} head={16} />
        <WordChip text="blue" x={1640} y={420} w={150} h={76} start={S("Softmax squeezes it") + 0.4} color={C.orange} size={40} />
      </FadeGroup>

      <FadeGroup start={painting - 0.05} end={latent - 0.1} fade={0.3}>
        <SketchRect x={660} y={280} w={600} h={400} start={0} dur={0.4} stroke={C.fg} fill={C.panel} strokeWidth={4} radius={4} seed={2090} />
        <SketchPath d="M 700 620 L 850 430 L 1000 620 Z" start={0.2} dur={0.4} stroke={C.cyan} strokeWidth={3} seed={2091} />
        <SketchCircle x={1110} y={390} d={54} start={0.35} dur={0.3} stroke={C.yellow} fill={C.yellow} seed={2092} />
        <WordChip text="blue" x={960} y={760} w={150} h={70} start={0.6} color={C.orange} size={40} />
        <Arrow x1={960} y1={680} x2={960} y2={720} start={0.5} stroke={C.soft} strokeWidth={3} head={14} />
      </FadeGroup>

      <FadeGroup start={latent - 0.05} fade={0.3}>
        <VectorStrip x={520} y={500} n={10} cell={54} start={0} color={C.cyan} seed={2100} showValues={false} />
        <SketchPath d="M 1060 540 Q 890 660 560 540" start={feed - 0.1} dur={0.7} stroke={C.cyan} strokeWidth={3.5} seed={2101} />
        <Head x={560} y={540} angle={-2.6} start={feed + 0.55} color={C.cyan} size={16} />
        <Label text="softmax" x={1230} y={408} size={40} color={C.soft} start={0.15} />
        <SketchRect x={1100} y={440} w={260} h={110} start={0.25} dur={0.3} stroke={C.soft} fill={C.well} strokeWidth={2.5} radius={10} seed={2102} />
        <SketchLine x1={1108} y1={448} x2={1352} y2={542} start={0.45} dur={0.25} stroke={C.red} strokeWidth={4.5} seed={2103} />
        <SketchLine x1={1352} y1={448} x2={1108} y2={542} start={0.5} dur={0.25} stroke={C.red} strokeWidth={4.5} seed={2104} />

        <Label text="latent" x={760} y={850} size={52} color={C.cyan} start={latent + 0.3} />
        <Underline x={760} y={896} w={190} start={latent + 0.45} color={C.cyan} width={3} />
      </FadeGroup>
    </Canvas>
  );
};

/* ------------------------------------------------------------------ */
/* 30 — Coconut and three problems                                     */
/* ------------------------------------------------------------------ */
export const Coconut: React.FC<SceneProps> = ({t0}) => {
  const S = local(t0);
  const p1 = S("One. No tools");
  const p2 = S("Two. You can't read it");
  const p3 = S("Three. A mismatch");
  return (
    <Canvas>
      <FadeGroup start={0.1} end={p1 - 0.2} fade={0.3}>
        <SketchRect x={520} y={360} w={300} h={380} start={0.1} dur={0.4} stroke={C.orange} fill={C.panel} strokeWidth={3.5} radius={10} seed={2110} />
        <Label text="Coconut" x={670} y={540} size={54} color={C.orange} start={0.3} />
        <Label text="2024" x={670} y={620} size={40} color={C.soft} start={0.45} font="DejaVu Sans Mono" />
        <VectorStrip x={920} y={500} n={8} cell={54} start={S("It's faster") - 0.1} color={C.cyan} showValues={false} seed={2120} />
        <WordChip text="word" x={920} y={650} w={150} h={62} start={S("a thought can hold") - 0.1} color={C.soft} size={40} />
      </FadeGroup>

      <FadeGroup start={p1 - 0.1} end={p2 - 0.15} fade={0.3}>
        <Badge x={1080} y={300} n="1" start={0} color={C.red} size={48} />
        <WordChip text="search()" x={1080} y={420} w={230} h={70} start={0.2} color={C.soft} size={40} mono />
        <SketchLine x1={960} y1={390} x2={1200} y2={450} start={0.5} dur={0.2} stroke={C.red} strokeWidth={5} seed={2130} />
        <SketchLine x1={1200} y1={390} x2={960} y2={450} start={0.55} dur={0.2} stroke={C.red} strokeWidth={5} seed={2131} />
      </FadeGroup>

      <FadeGroup start={p2 - 0.1} end={p3 - 0.15} fade={0.3}>
        <Badge x={1080} y={540} n="2" start={0} color={C.red} size={48} />
        <SketchRect x={960} y={620} w={240} h={150} start={0.2} dur={0.3} stroke={C.soft} fill={C.well} strokeWidth={3} radius={8} seed={2140} />
        <Label text="?" x={1080} y={690} size={64} color={C.soft} start={0.45} />
        <Label text="black box" x={1080} y={810} size={40} color={C.soft} start={0.6} />
      </FadeGroup>

      <FadeGroup start={p3 - 0.1} fade={0.3}>
        <Badge x={1080} y={300} n="3" start={0} color={C.red} size={48} />
        <SketchRect x={900} y={390} w={150} h={150} start={0.1} dur={0.3} stroke={C.cyan} fill={C.well} strokeWidth={2.5} radius={4} seed={2150} />
        <SketchRect x={1110} y={390} w={150} h={150} start={0.25} dur={0.3} stroke={C.orange} fill={C.well} strokeWidth={2.5} radius={4} seed={2151} />
        <Arrow x1={1052} y1={465} x2={1108} y2={465} start={0.5} stroke={C.soft} strokeWidth={3} head={12} />
        <SketchLine x1={1080} y1={430} x2={1120} y2={490} start={0.7} dur={0.2} stroke={C.red} strokeWidth={5} seed={2152} />
      </FadeGroup>
    </Canvas>
  );
};

/* ------------------------------------------------------------------ */
/* 31 — Gaia numbers and the hybrid idea                               */
/* ------------------------------------------------------------------ */
export const Gaia: React.FC<SceneProps> = ({t0}) => {
  const S = local(t0);
  const hybrid = S("So here's the idea");
  return (
    <Canvas>
      <FadeGroup start={0.1} end={hybrid - 0.2} fade={0.3}>
        <Label text="Gaia 8B" x={960} y={260} size={44} color={C.soft} start={0.1} />
        <Label text="score" x={700} y={330} size={40} color={C.soft} align="left" start={0.2} font="DejaVu Sans" />
        {[{y: 400, l: "silent", c: C.red, v: 3.9, vt: "3.9", p: "Coconut scores 3.9"},
          {y: 540, l: "text", c: C.green, v: 36, vt: "32–39", p: "A normal text agent"}].map((b, i) => (
          <g key={i}>
            <SketchRect x={700} y={b.y} w={620} h={54} start={0.2 + i * 0.08} dur={0.25} stroke={C.line} fill={C.well} strokeWidth={2.2} radius={6} seed={2160 + i * 2} />
            <SketchRect x={700} y={b.y} w={620 * (b.v / 100)} h={54} start={S(b.p) - 0.1} dur={0.5} stroke={b.c} fill={b.c} strokeWidth={1.5} radius={6} seed={2161 + i * 2} opacity={0.9} />
            <Label text={b.l} x={676} y={b.y + 27} size={42} color={C.soft} align="right" start={0.2 + i * 0.08} />
            <Label text={b.vt} x={1344} y={b.y + 27} size={42} color={b.c} align="left" start={S(b.p) + 0.1} />
          </g>
        ))}
      </FadeGroup>

      <FadeGroup start={hybrid - 0.15} fade={0.3}>
        <Label text="latent" x={640} y={420} size={64} color={C.cyan} start={0.1} />
        <Label text="text" x={1280} y={420} size={64} color={C.orange} start={0.35} />
        <Arrow x1={820} y1={470} x2={1080} y2={470} start={0.5} stroke={C.soft} strokeWidth={3} head={16} />
        <Label text="think" x={700} y={560} size={40} color={C.cyan} start={0.6} />
        <Label text="act" x={1380} y={560} size={40} color={C.orange} start={0.7} />
      </FadeGroup>
    </Canvas>
  );
};

/* ------------------------------------------------------------------ */
/* 32 — how the hybrid agent works                                     */
/* ------------------------------------------------------------------ */
export const HowItWorks: React.FC<SceneProps> = ({t0}) => {
  const S = local(t0);
  const silent = S("writes a special token");
  const count = S("tens, even hundreds");
  const end = S("special end marker");
  return (
    <Canvas>
      <FadeGroup start={0.1} end={silent - 0.15} fade={0.3}>
        <WordChip text="text" x={420} y={400} w={180} h={74} start={0.1} color={C.orange} size={40} />
        <Arrow x1={520} y1={400} x2={650} y2={400} start={0.3} stroke={C.soft} strokeWidth={3} head={16} />
        <SketchRect x={660} y={320} w={400} h={160} start={0.4} dur={0.4} stroke={C.purple} fill={C.panel} strokeWidth={4} radius={14} seed={2170} />
        <Label text="model" x={860} y={400} size={44} color={C.purple} start={0.6} />
        <Arrow x1={1070} y1={400} x2={1200} y2={400} start={silent - 0.2} stroke={C.soft} strokeWidth={3} head={16} />
      </FadeGroup>

      <FadeGroup start={silent - 0.1} end={end - 0.2} fade={0.3}>
        <WordChip text="<silent>" x={1340} y={400} w={240} h={74} start={0} color={C.cyan} size={40} mono />
        <VectorStrip x={700} y={650} n={10} cell={54} start={0.3} color={C.cyan} showValues={false} seed={2180} />
        <Arrow x1={1100} y1={650} x2={1260} y2={650} start={0.5} stroke={C.cyan} strokeWidth={3} head={16} />
        <SketchPath d="M 1245 650 Q 1380 580 1222 440" start={0.6} dur={0.6} stroke={C.cyan} strokeWidth={3.5} seed={2181} />
        <Head x={1222} y={440} angle={-2.55} start={1.05} color={C.cyan} size={16} />
        <Label text="×100" x={1400} y={650} size={50} color={C.cyan} start={count - 0.1} font="DejaVu Sans Mono" />
      </FadeGroup>

      <FadeGroup start={end - 0.1} fade={0.3}>
        <WordChip text="<end>" x={620} y={400} w={210} h={74} start={0} color={C.cyan} size={40} mono />
        <Arrow x1={730} y1={400} x2={860} y2={400} start={0.2} stroke={C.soft} strokeWidth={3} head={16} />
        <WordChip text="tool_call()" x={1080} y={400} w={310} h={74} start={0.35} color={C.orange} size={40} mono />
        <Label text="text" x={840} y={500} size={40} color={C.orange} start={0.5} />
      </FadeGroup>
    </Canvas>
  );
};

/* ------------------------------------------------------------------ */
/* 33 — HybridLink and KV memory                                       */
/* ------------------------------------------------------------------ */
export const HybridLink: React.FC<SceneProps> = ({t0}) => {
  const S = local(t0);
  return (
    <Canvas>
      <VectorStrip x={420} y={470} n={8} cell={54} start={0} color={C.cyan} showValues={false} seed={2190} />
      <Label text="+ δ" x={930} y={400} size={54} color={C.purple} start={S("adds a small correction") - 0.1} font="DejaVu Sans Mono" />
      <Arrow x1={980} y1={470} x2={1080} y2={470} start={0.3} stroke={C.soft} strokeWidth={3} head={16} />
      <VectorStrip x={1100} y={470} n={8} cell={54} start={0.4} color={C.green} showValues={false} seed={2195} />
      <Label text="10M / 4B" x={780} y={680} size={44} color={C.purple} start={S("ten million parameters") - 0.1} font="DejaVu Sans Mono" />
      <HBar x={620} y={780} w={520} value={71.4} label="no link" start={S("71.4 percent") - 0.1} color={C.red} valueText="71.4" labelSize={34} seed={2200} />
      <HBar x={620} y={880} w={520} value={88.2} label="link" start={S("88.2") - 0.1} color={C.green} valueText="88.2" labelSize={34} seed={2202} />
    </Canvas>
  );
};

/* ------------------------------------------------------------------ */
/* 33b — KV memory                                                     */
/* ------------------------------------------------------------------ */
export const Memory: React.FC<SceneProps> = ({t0}) => {
  const S = local(t0);
  return (
    <Canvas>
      <SketchRect x={380} y={320} w={420} h={440} start={0.1} dur={0.4} stroke={C.cyan} fill={C.panel} strokeWidth={3} radius={10} seed={2210} />
      {[0, 1, 2, 3].map((i) => (
        <SketchLine key={i} x1={420} y1={400 + i * 70} x2={760} y2={400 + i * 70} start={0.25 + i * 0.06} dur={0.2} stroke={C.line} strokeWidth={3} seed={2211 + i} />
      ))}
      <Label text="cache" x={590} y={805} size={40} color={C.cyan} start={0.5} />
      <Label text="alive" x={590} y={865} size={40} color={C.green} start={0.65} />

      <WordChip text="tool" x={1180} y={360} w={160} h={62} start={0.2} color={C.orange} size={40} />
      <Page x={1120} y={460} w={200} h={260} start={0.4} seed={2220} />
      <Label text="re-paste" x={1180} y={770} size={40} color={C.red} start={0.7} />
    </Canvas>
  );
};

/* ------------------------------------------------------------------ */
/* 34 — serving warning                                                */
/* ------------------------------------------------------------------ */
export const ServingWarning: React.FC<SceneProps> = ({t0}) => {
  const S = local(t0);
  return (
    <Canvas>
      <FadeGroup start={0.1} end={S("You can't drop this") - 0.1} fade={0.3}>
        <SketchRect x={720} y={300} w={480} h={420} start={0.1} dur={0.4} stroke={C.soft} fill={C.panel} strokeWidth={3} radius={10} seed={2230} />
        {[0, 1, 2].map((i) => (
          <SketchLine key={i} x1={760} y1={400 + i * 80} x2={1160} y2={400 + i * 80} start={0.3 + i * 0.08} dur={0.2} stroke={C.line} strokeWidth={6} seed={2231 + i} />
        ))}
        <SketchLine x1={820} y1={360} x2={1100} y2={660} start={0.6} dur={0.25} stroke={C.red} strokeWidth={6} seed={2235} />
        <SketchLine x1={1100} y1={360} x2={820} y2={660} start={0.7} dur={0.25} stroke={C.red} strokeWidth={6} seed={2236} />
      </FadeGroup>
      <FadeGroup start={S("They extended the training") - 0.1} fade={0.3}>
        <Label text="DIY" x={960} y={800} size={64} color={C.orange} start={0.1} font="Caveat" />
      </FadeGroup>
    </Canvas>
  );
};

const spiralPath = (cx: number, cy: number, turns: number, rmax: number) => {
  const pts: string[] = [];
  const N = 90;
  for (let i = 0; i <= N; i++) {
    const p = i / N;
    const a = p * turns * Math.PI * 2;
    const r = 8 + p * rmax;
    pts.push(`${i === 0 ? "M" : "L"} ${(cx + Math.cos(a) * r).toFixed(1)} ${(cy + Math.sin(a) * r).toFixed(1)}`);
  }
  return pts.join(" ");
};

/* ------------------------------------------------------------------ */
/* 35 — errors snowball                                                */
/* ------------------------------------------------------------------ */
export const Snowball: React.FC<SceneProps> = ({t0}) => {
  const S = local(t0);
  const fix = S("The fix is to train the model");
  return (
    <Canvas>
      <Badge x={520} y={190} n="1" start={0.05} color={C.red} />
      <FadeGroup start={0.1} end={fix - 0.15} fade={0.3}>
        <Label text="text" x={360} y={360} size={40} color={C.orange} align="left" start={0.1} />
        <SketchPath d="M 480 360 L 700 360 L 760 400 L 820 360 L 1100 360" start={0.2} dur={0.7} stroke={C.orange} strokeWidth={3.5} seed={2240} />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <SketchRect x={900 + i * 55} y={335} w={36} h={50} start={0.5 + i * 0.08} dur={0.2} stroke={C.orange} fill={C.well} strokeWidth={2} radius={3} seed={2241 + i} />
            <SketchCircle x={918 + i * 55} y={360} d={8} start={0.6 + i * 0.08} dur={0.12} stroke={C.orange} fill={C.orange} seed={2245 + i} />
          </g>
        ))}
        <Label text="snaps" x={1260} y={360} size={40} color={C.soft} start={0.7} />

        <Label text="latent" x={360} y={620} size={40} color={C.cyan} align="left" start={0.5} />
        <SketchPath d={spiralPath(900, 620, 3.2, 230)} start={0.6} dur={1.4} stroke={C.cyan} strokeWidth={3.5} seed={2250} />
        <Label text="mush" x={1200} y={620} size={44} color={C.red} start={S("after a hundred silent steps") - 0.1} />
      </FadeGroup>

      <FadeGroup start={fix - 0.1} fade={0.3}>
        <Label text="own thoughts" x={760} y={330} size={44} color={C.green} start={0.2} />
        <HBar x={640} y={430} w={620} value={73.8} label="before" start={0.4} color={C.soft} valueText="73.8" labelSize={38} seed={2260} />
        <HBar x={640} y={560} w={620} value={84.2} label="after" start={0.7} color={C.green} valueText="84.2" labelSize={38} seed={2262} />
      </FadeGroup>
    </Canvas>
  );
};

/* ------------------------------------------------------------------ */
/* 36 — RL after silence                                               */
/* ------------------------------------------------------------------ */
export const RL: React.FC<SceneProps> = ({t0}) => {
  const S = local(t0);
  const no = S("No. Silent steps are deterministic");
  const replay = S("You only need chances");
  return (
    <Canvas>
      <Badge x={240} y={170} n="2" start={0.05} color={C.cyan} />
      <FadeGroup start={0.1} end={no - 0.2} fade={0.3}>
        <SketchRect x={640} y={330} w={300} h={180} start={0.1} dur={0.4} stroke={C.purple} fill={C.panel} strokeWidth={4} radius={14} seed={2270} />
        <Label text="GRPO" x={790} y={420} size={50} color={C.purple} start={0.3} />
        <Label text="p ?" x={1080} y={420} size={80} color={C.red} start={S("Where do those chances come from") - 0.1} font="DejaVu Sans Mono" />
        <SketchPath d="M 960 510 Q 1050 580 1120 520" start={0.6} dur={0.4} stroke={C.red} strokeWidth={3} seed={2271} dash />
        <Head x={1120} y={520} angle={-0.35} start={1.0} color={C.red} size={14} />
        <Label text="skip" x={1080} y={600} size={40} color={C.red} start={0.8} />
      </FadeGroup>

      <FadeGroup start={no - 0.1} fade={0.3}>
        <Label text="p = 1" x={620} y={420} size={90} color={C.green} start={0} font="DejaVu Sans Mono" />
        <Label text="× 1" x={930} y={420} size={64} color={C.fg} start={0.3} font="DejaVu Sans Mono" />
        <Label text="nothing changes" x={1240} y={420} size={40} color={C.fg} start={0.5} />
        <FadeGroup start={replay - 0.1} fade={0.3}>
          <Label text="replay exact thoughts" x={960} y={640} size={40} color={C.cyan} start={0} />
          <SketchPath d="M 760 700 Q 960 780 1160 700" start={0.3} dur={0.4} stroke={C.cyan} strokeWidth={3} seed={2280} />
          <Head x={1160} y={700} angle={-0.5} start={0.65} color={C.cyan} size={14} />
        </FadeGroup>
      </FadeGroup>
    </Canvas>
  );
};

/* ------------------------------------------------------------------ */
/* 37 — which steps go silent                                          */
/* ------------------------------------------------------------------ */
export const WhichSteps: React.FC<SceneProps> = ({t0}) => {
  const S = local(t0);
  const noReward = S("no reward for going quiet");
  const drift = S("drifted there on its own");
  const steps = [
    {w: "confident", c: C.green},
    {w: "tool", c: C.orange},
    {w: "confident", c: C.green},
    {w: "decision", c: C.orange},
    {w: "confident", c: C.green},
  ];
  return (
    <Canvas>
      <FadeGroup start={0.1} end={noReward - 0.15} fade={0.3}>
        {steps.map((s, i) => (
          <g key={i}>
            <WordChip text={s.w} x={280 + i * 340} y={440} w={i === 3 ? 250 : 230} h={74} start={0.1 + i * 0.08} color={s.c} size={40} />
            {i < 4 ? <Arrow x1={280 + i * 340 + 120} y1={440} x2={280 + (i + 1) * 340 - 120} y2={440} start={0.2 + i * 0.08} stroke={C.soft} strokeWidth={3} head={14} /> : null}
          </g>
        ))}
        <Label text="silent" x={960} y={560} size={48} color={C.cyan} start={0.5} />
      </FadeGroup>

      <FadeGroup start={noReward - 0.1} fade={0.3}>
        <SketchRect x={660} y={330} w={600} h={180} start={0.1} dur={0.4} stroke={C.purple} fill={C.panel} strokeWidth={3} radius={14} seed={2290} />
        <Label text="reward" x={960} y={420} size={46} color={C.purple} start={0.25} />
        <Label text="0 for quiet" x={960} y={480} size={40} color={C.soft} start={0.4} />
        <FadeGroup start={drift - 0.1} fade={0.3}>
          <SketchLine x1={700} y1={680} x2={1220} y2={680} start={0} dur={0.3} stroke={C.line} strokeWidth={6} seed={2291} />
          <SketchCircle x={1160} y={680} d={40} start={0.3} dur={0.25} stroke={C.cyan} fill={C.cyan} seed={2292} />
          <Label text="drift" x={960} y={760} size={44} color={C.cyan} start={0.5} />
        </FadeGroup>
      </FadeGroup>
    </Canvas>
  );
};

/* ------------------------------------------------------------------ */
/* 38 — results                                                        */
/* ------------------------------------------------------------------ */
export const AgentResults: React.FC<SceneProps> = ({t0}) => {
  const S = local(t0);
  const gaia = S("On Gaia at 14 billion");
  return (
    <Canvas>
      <FadeGroup start={0.1} end={S("about 10 percent better") - 0.3} fade={0.25}>
        <Label text="11 benchmarks" x={960} y={380} size={44} color={C.soft} start={0.2} />
        <SketchLine x1={420} y1={620} x2={1500} y2={620} start={0.4} dur={0.4} stroke={C.line} strokeWidth={3} seed={2319} />
        {Array.from({length: 11}).map((_, i) => (
          <SketchRect key={i} x={430 + i * 100} y={620 - (30 + (i * 37) % 120)} w={54} h={30 + (i * 37) % 120} start={0.3 + i * 0.04} dur={0.25} stroke={[C.cyan, C.purple, C.orange][i % 3]} fill={[C.cyan, C.purple, C.orange][i % 3]} strokeWidth={2.2} radius={4} seed={2320 + i} opacity={0.75} />
        ))}
      </FadeGroup>

      <FadeGroup start={S("about 10 percent better") - 0.3} end={gaia - 0.15} fade={0.3}>
        {[
          {v: "+10%", l: "score", c: C.green, p: "about 10 percent better"},
          {v: "−35–55%", l: "tokens", c: C.cyan, p: "35 to 55 percent fewer tokens"},
          {v: "1.8–2.6×", l: "faster", c: C.orange, p: "1.8 to 2.6 times faster"},
          {v: "2.7–3.7×", l: "cheaper", c: C.purple, p: "2.7 to 3.7 times cheaper"},
        ].map((s, i) => (
          <g key={i}>
            <SketchRect x={230 + i * 380} y={380} w={330} h={230} start={S(s.p) - 0.1} dur={0.35} stroke={s.c} fill={C.panel} strokeWidth={3} radius={12} seed={2300 + i} />
            <Label text={s.v} x={395 + i * 380} y={470} size={58} color={s.c} start={S(s.p) + 0.1} font="Caveat" />
            <Label text={s.l} x={395 + i * 380} y={550} size={40} color={C.soft} start={S(s.p) + 0.2} />
          </g>
        ))}
      </FadeGroup>

      <FadeGroup start={gaia - 0.1} fade={0.3}>
        <HBar x={700} y={330} w={600} value={52.4} label="ours" start={0.1} color={C.green} valueText="52.4" labelSize={42} seed={2310} />
        <HBar x={700} y={450} w={600} value={41.7} label="Kimi" start={0.35} color={C.soft} valueText="41.7" labelSize={42} seed={2312} />
        <HBar x={700} y={570} w={600} value={37.9} label="GPT" start={0.55} color={C.soft} valueText="37.9" labelSize={42} seed={2314} />
        <Label text="Gaia 14B" x={960} y={720} size={40} color={C.soft} start={0.8} />
      </FadeGroup>
    </Canvas>
  );
};

/* ------------------------------------------------------------------ */
/* 39 — the promised table                                             */
/* ------------------------------------------------------------------ */
export const TheTable: React.FC<SceneProps> = ({t0}) => {
  const S = local(t0);
  const rows = [
    {l: "baseline", v: 84.6, c: C.green, p: "At 8 billion parameters"},
    {l: "blocked", v: 80.4, c: C.soft, p: "Block silent mode"},
    {l: "noise", v: 66.4, c: C.cyan, p: "Add heavy random noise"},
    {l: "wrong task", v: 44.8, c: C.orange, p: "Swap in thoughts from a different problem"},
    {l: "random", v: 41.2, c: C.red, p: "Swap in random words"},
  ];
  return (
    <Canvas>
      <FadeGroup start={0.1} fade={0.3}>
        <Label text="accuracy" x={700} y={230} size={40} color={C.soft} start={0.2} font="DejaVu Sans" />
        {rows.map((r, i) => (
          <g key={r.l}>
            <SketchRect x={700} y={300 + i * 120} w={700} h={54} start={0.1 + i * 0.05} dur={0.25} stroke={C.line} fill={C.well} strokeWidth={2.2} radius={6} seed={2330 + i * 2} />
            <SketchRect x={700} y={300 + i * 120} w={700 * (r.v / 100)} h={54} start={S(r.p) - 0.1} dur={0.4} stroke={r.c} fill={r.c} strokeWidth={1.5} radius={6} seed={2331 + i * 2} opacity={0.9} />
            <Label text={r.l} x={676} y={327 + i * 120} size={40} color={C.soft} align="right" start={0.2 + i * 0.08} font="DejaVu Sans" />
            <Label text={`${r.v}`} x={1440} y={327 + i * 120} size={40} color={r.c} align="left" start={S(r.p) + 0.1} font="DejaVu Sans Mono" />
          </g>
        ))}
      </FadeGroup>
      <FadeGroup start={S("Noise hurts less") - 0.1} fade={0.3}>
        <Label text="content" x={960} y={940} size={44} color={C.cyan} start={0.1} />
      </FadeGroup>
    </Canvas>
  );
};

/* ------------------------------------------------------------------ */
/* 40 — reading the thoughts                                           */
/* ------------------------------------------------------------------ */
export const ReadThoughts: React.FC<SceneProps> = ({t0}) => {
  const S = local(t0);
  const proxy = S("Nearest word is a proxy");
  return (
    <Canvas>
      <FadeGroup start={0.1} fade={0.3}>
        {["the", "cat", "sat", "on", "mat"].map((w, i) => (
          <g key={i}>
            <SketchRect x={430 + i * 190} y={360} w={90} h={90} start={0.1 + i * 0.1} dur={0.2} stroke={C.cyan} fill={C.well} strokeWidth={2.4} radius={6} seed={2340 + i} />
            {[0, 1, 2].map((j) => (
              <SketchCircle key={j} x={460 + i * 190 + j * 18} y={405} d={8} start={0.15 + i * 0.1 + j * 0.04} dur={0.12} stroke={C.cyan} fill={C.cyan} seed={2350 + i * 3 + j} />
            ))}
            <Arrow x1={475 + i * 190} y1={460} x2={475 + i * 190} y2={520} start={0.3 + i * 0.1} stroke={C.soft} strokeWidth={2.5} head={12} />
            <Label text={w} x={475 + i * 190} y={580} size={42} color={C.orange} start={0.4 + i * 0.1} />
          </g>
        ))}
      </FadeGroup>
      <FadeGroup start={proxy - 0.1} fade={0.3}>
        <Label text="proxy" x={660} y={700} size={54} color={C.red} start={0} font="Caveat" />
        <Label text="debug only" x={1190} y={700} size={40} color={C.green} start={0.3} />
        <Arrow x1={790} y1={700} x2={1040} y2={700} start={0.5} stroke={C.soft} strokeWidth={3} head={14} />
      </FadeGroup>
    </Canvas>
  );
};

/* ------------------------------------------------------------------ */
/* 41 — safety window                                                  */
/* ------------------------------------------------------------------ */
export const Safety: React.FC<SceneProps> = ({t0}) => {
  const S = local(t0);
  const shutter = S("Move thinking into silence");
  const percent = S("the agent wrote 43");
  return (
    <Canvas>
      <FadeGroup start={0.1} fade={0.3}>
        <SketchRect x={640} y={260} w={640} h={400} start={0.1} dur={0.4} stroke={C.fg} fill={C.well} strokeWidth={4} radius={8} seed={2350} />
        <Label text="reasoning" x={960} y={315} size={40} color={C.soft} start={0.4} />
        {[0, 1, 2, 3].map((i) => (
          <SketchLine key={i} x1={690} y1={340 + i * 60} x2={1180} y2={340 + i * 60} start={0.3 + i * 0.06} dur={0.2} stroke={C.soft} strokeWidth={3} seed={2351 + i} />
        ))}
        <FadeGroup start={shutter - 0.1} fade={0.4}>
          <SketchRect x={640} y={260} w={640} h={200} start={0} dur={0.4} stroke={C.soft} fill={C.line} strokeWidth={3} radius={8} seed={2360} opacity={1} />
          <Label text="silence" x={960} y={360} size={44} color={C.fg} start={0.2} />
        </FadeGroup>
      </FadeGroup>
      <FadeGroup start={percent - 0.1} fade={0.3}>
        <SketchRect x={760} y={470} w={400} h={150} start={0} dur={0.25} stroke={C.bg} fill={C.bg} strokeWidth={1} radius={8} seed={2361} opacity={0.92} />
        <Label text="43–49%" x={960} y={520} size={88} color={C.orange} start={0.05} font="DejaVu Sans Mono" />
        <Label text="monitor" x={960} y={600} size={40} color={C.green} start={0.3} />
      </FadeGroup>
      <Label text="?" x={960} y={760} size={100} color={C.soft} start={S("Is that enough for safety") - 0.1} font="Caveat" />
    </Canvas>
  );
};

/* ------------------------------------------------------------------ */
/* 42 — related work and caveat                                        */
/* ------------------------------------------------------------------ */
export const Related: React.FC<SceneProps> = ({t0}) => {
  const S = local(t0);
  const caveat = S("One last caveat");
  return (
    <Canvas>
      <FadeGroup start={0.1} end={caveat - 0.2} fade={0.3}>
        {["Hybrid", "Token Assorted", "VITAL"].map((w, i) => (
          <g key={w}>
            <WordChip text={w} x={500 + i * 460} y={420} w={i === 1 ? 340 : 260} h={80} start={0.1 + i * 0.2} color={[C.cyan, C.orange, C.purple][i]} size={i === 1 ? 30 : 36} />
          </g>
        ))}

        <SketchRect x={1040} y={740} w={160} h={70} start={1.1} dur={0.3} stroke={C.cyan} fill={C.well} strokeWidth={2.5} radius={35} seed={2371} />
        <SketchCircle x={1170} y={775} d={50} start={1.2} dur={0.2} stroke={C.cyan} fill={C.cyan} seed={2372} />
        <Label text="speak" x={820} y={775} size={40} color={C.soft} start={1.15} />
        <Label text="silent" x={1270} y={775} size={40} color={C.cyan} start={1.25} />
      </FadeGroup>

      <FadeGroup start={caveat - 0.1} fade={0.3}>
        <SketchLine x1={560} y1={500} x2={1360} y2={500} start={0} dur={0.4} stroke={C.soft} strokeWidth={4} seed={2380} />
        {[0, 1, 2, 3].map((i) => (
          <SketchLine key={i} x1={560 + i * 266} y1={482} x2={560 + i * 266} y2={500} start={0.2 + i * 0.06} dur={0.15} stroke={C.soft} strokeWidth={2.5} seed={2381 + i} />
        ))}
        <Label text="Qwen3" x={560} y={420} size={40} color={C.cyan} start={0.2} />
        <Label text="4B" x={560} y={560} size={44} color={C.fg} start={0.35} />
        <Label text="14B" x={1360} y={560} size={44} color={C.fg} start={0.5} />
        <Label text="research" x={960} y={700} size={44} color={C.orange} start={0.6} />
        <Label text="{ } code" x={960} y={800} size={40} color={C.green} start={S("The code is public") - 0.1} font="DejaVu Sans Mono" />
      </FadeGroup>
    </Canvas>
  );
};
