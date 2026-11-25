import React from "react";
import {Composition} from "remotion";
import {Video} from "./Video";
import {AUDIO_DURATION} from "./timing";
import {Welch30s} from "./welch/Welch30s";

export const Root: React.FC = () => (
  <>
    <Composition
      id="SoftmaxGate"
      component={Video}
      durationInFrames={Math.ceil(AUDIO_DURATION * 30)}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="Welch30s"
      component={Welch30s}
      durationInFrames={900}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
