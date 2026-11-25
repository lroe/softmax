import React from "react";
import {AbsoluteFill, Audio, staticFile} from "remotion";
import {C} from "../theme";
import {WelchScene} from "./WelchScene";

export const Welch30s: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: C.bg}}>
    <Audio src={staticFile("audio-30s.wav")} />
    <WelchScene />
  </AbsoluteFill>
);
