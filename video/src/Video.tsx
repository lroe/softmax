import React from "react";
import {Audio, AbsoluteFill, Sequence, staticFile, useVideoConfig} from "remotion";
import {loadFont} from "@remotion/fonts";
import {C, FPS} from "./theme";
import {SceneFrame} from "./lib/scene";
import {Meme} from "./lib/Meme";
import {SCENES, TOTAL_DURATION} from "./scenes";

loadFont({
  family: "Patrick Hand",
  url: staticFile("fonts/PatrickHand.ttf"),
  weight: "400",
  format: "truetype",
}).catch((e) => console.error("Patrick Hand font failed", e));

loadFont({
  family: "Caveat",
  url: staticFile("fonts/Caveat.ttf"),
  weight: "400 700",
  format: "truetype",
}).catch((e) => console.error("Caveat font failed", e));

loadFont({
  family: "DejaVu Sans Mono",
  url: staticFile("fonts/DejaVuSansMono.ttf"),
  weight: "400",
  format: "truetype",
}).catch((e) => console.error("DejaVu Sans Mono font failed", e));

export const MEMES = [
  {
    src: "memes/pikachu.png",
    w: 1893,
    h: 1893,
    start: 16.9,
    end: 22.1,
    maxW: 900,
    maxH: 900,
    captions: [
      {x: 0.5, y: 0.135, w: 0.86, text: "the bug is in every framework.", size: 56, color: "#16171d", stroke: false},
    ],
  },
  {
    src: "memes/monkey.png",
    w: 923,
    h: 768,
    start: 63.4,
    end: 68.6,
    maxW: 900,
    maxH: 760,
    captions: [
      {x: 0.5, y: 0.115, w: 0.9, text: "softmax ... or the squeeze?", size: 46, color: "#17181e", stroke: false},
    ],
  },
  {
    src: "memes/this-is-fine.png",
    w: 1160,
    h: 564,
    start: 262.3,
    end: 268.3,
    maxW: 1320,
    maxH: 720,
    captions: [],
  },
  {
    src: "memes/panik.png",
    w: 640,
    h: 881,
    start: 348.0,
    end: 353.6,
    maxW: 580,
    maxH: 800,
    captions: [
      {x: 0.2, y: 0.165, w: 0.34, text: "the model is sure", size: 34, color: "#17181e", stroke: false},
      {x: 0.2, y: 0.5, w: 0.34, text: "loss is zero", size: 34, color: "#17181e", stroke: false},
      {x: 0.2, y: 0.835, w: 0.34, text: "gradient is zero too", size: 34, color: "#17181e", stroke: false},
    ],
  },
  {
    src: "memes/batman.png",
    w: 900,
    h: 871,
    start: 414.2,
    end: 419.2,
    maxW: 820,
    maxH: 800,
    captions: [
      {x: 0.22, y: 0.1, w: 0.36, text: "the tiny error", size: 42},
      {x: 0.8, y: 0.1, w: 0.3, text: "Adam", size: 42},
    ],
  },
  {
    src: "memes/distracted.png",
    w: 1200,
    h: 800,
    start: 589.8,
    end: 595.8,
    maxW: 1450,
    maxH: 850,
    captions: [
      {x: 0.2, y: 0.1, w: 0.36, text: "the rich thought", size: 52},
      {x: 0.52, y: 0.1, w: 0.32, text: "softmax", size: 52},
      {x: 0.83, y: 0.1, w: 0.3, text: "one word", size: 52},
    ],
  },
  {
    src: "memes/woman-cat.png",
    w: 1220,
    h: 786,
    start: 646.9,
    end: 652.2,
    maxW: 1280,
    maxH: 820,
    captions: [
      {x: 0.18, y: 0.1, w: 0.34, text: "text agents 32–39", size: 38},
      {x: 0.78, y: 0.55, w: 0.3, text: "silent 3.9", size: 38},
    ],
  },
  {
    src: "memes/drake.png",
    w: 1200,
    h: 1200,
    start: 668.6,
    end: 674.4,
    maxW: 820,
    maxH: 820,
    captions: [
      {x: 0.835, y: 0.16, w: 0.31, text: "write the thought\nas a word", size: 38, color: "#17181e", stroke: false},
      {x: 0.835, y: 0.5, w: 0.31, text: "feed the thought\nstraight back", size: 38, color: "#17181e", stroke: false},
    ],
  },
  {
    src: "memes/one-does-not-simply.png",
    w: 1136,
    h: 670,
    start: 746.0,
    end: 751.4,
    maxW: 1260,
    maxH: 760,
    captions: [
      {x: 0.5, y: 0.86, w: 0.9, text: "drop this into your serving stack tomorrow", size: 48},
    ],
  },
  {
    src: "memes/roll-safe.png",
    w: 1200,
    h: 675,
    start: 807.0,
    end: 812.2,
    maxW: 1280,
    maxH: 720,
    captions: [
      {x: 0.5, y: 0.92, w: 0.9, text: "silent step: p = 1", size: 48},
    ],
  },
  {
    src: "memes/absolute-cinema.png",
    w: 1035,
    h: 802,
    start: 909.0,
    end: 914.2,
    maxW: 1200,
    maxH: 800,
    captions: [
      {x: 0.5, y: 0.92, w: 0.8, text: "the thought is doing the work", size: 42},
    ],
  },
  {
    src: "memes/two-buttons.png",
    w: 900,
    h: 1362,
    start: 1027.4,
    end: 1033.2,
    maxW: 500,
    maxH: 760,
    captions: [
      {x: 0.27, y: -0.105, w: 0.46, text: "latent\nfeedback", size: 34},
      {x: 0.73, y: -0.105, w: 0.5, text: "another\npass", size: 36},
    ],
  },
  {
    src: "memes/expanding-brain.png",
    w: 857,
    h: 1202,
    start: 1089.4,
    end: 1096.6,
    maxW: 640,
    maxH: 900,
    captions: [
      {x: 0.25, y: 0.155, w: 0.44, text: "write every thought", size: 34, color: "#17181e", stroke: false},
      {x: 0.25, y: 0.405, w: 0.44, text: "summarize it", size: 34, color: "#17181e", stroke: false},
      {x: 0.25, y: 0.655, w: 0.44, text: "think in latent", size: 34, color: "#17181e", stroke: false},
      {x: 0.25, y: 0.905, w: 0.44, text: "say nothing", size: 34, color: "#17181e", stroke: false},
    ],
  },
  {
    src: "memes/always-has-been.png",
    w: 1440,
    h: 810,
    start: 1189.88,
    end: 1194.88,
    maxW: 1320,
    maxH: 760,
    captions: [
      {x: 0.36, y: 0.3, w: 0.5, text: "wait, it's all softmax?", size: 42},
      {x: 0.76, y: 0.16, w: 0.42, text: "always has been.", size: 46},
    ],
  },
];

export const Video: React.FC = () => {
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{backgroundColor: C.bg}}>
      <Audio src={staticFile("audio.wav")} />
      {SCENES.map((s, i) => {
        const from = Math.round(s.start * FPS);
        const to = Math.round((i === SCENES.length - 1 ? TOTAL_DURATION : SCENES[i + 1].start) * FPS);
        const dur = Math.max(1, to - from);
        return (
          <Sequence key={s.id} from={from} durationInFrames={dur} name={`${s.id} ${s.title}`}>
            <SceneFrame duration={dur} first={i === 0}>
              <s.Component t0={s.start} />
            </SceneFrame>
          </Sequence>
        );
      })}
      {MEMES.map((m, i) => {
        const from = Math.round(m.start * fps);
        const dur = Math.round((m.end - m.start) * fps);
        return (
          <Sequence key={i} from={from} durationInFrames={dur} name={`meme ${m.src}`}>
            <Meme
              src={m.src}
              width={m.w}
              height={m.h}
              start={0}
              end={m.end - m.start}
              maxW={m.maxW}
              maxH={m.maxH}
              captions={m.captions as never}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
