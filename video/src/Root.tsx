import React from "react";
import {Composition} from "remotion";
import {Video} from "./Video";
import {AUDIO_DURATION} from "./timing";

export const Root: React.FC = () => (
    <Composition
      id="SoftmaxGate"
      component={Video}
      durationInFrames={Math.ceil(AUDIO_DURATION * 30)}
      fps={30}
      width={1920}
      height={1080}
    />

);
