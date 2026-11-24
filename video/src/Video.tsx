import React from "react";
import {Audio, AbsoluteFill, Sequence, staticFile, useVideoConfig} from "remotion";
import {loadFont} from "@remotion/fonts";
import {C, FPS} from "./theme";
import {SceneFrame} from "./lib/scene";
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
    </AbsoluteFill>
  );
};
