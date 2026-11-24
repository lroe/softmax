import React from "react";
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from "remotion";
import {C} from "../theme";

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** 3-frame fade to the Dracula background at each end of a scene. */
export const SceneFrame: React.FC<{
  duration: number;
  first?: boolean;
  children: React.ReactNode;
}> = ({duration, first, children}) => {
  const f = useCurrentFrame();
  const fin = first ? 1 : clamp01(f / 3);
  const fout = clamp01((duration - f) / 3);
  return (
    <AbsoluteFill style={{backgroundColor: C.bg, opacity: Math.min(fin, fout)}}>
      {children}
    </AbsoluteFill>
  );
};

export const Canvas: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 1920 1080"
    preserveAspectRatio="xMidYMid meet"
    style={{position: "absolute", inset: 0, overflow: "visible"}}
  >
    {children}
  </svg>
);

export const FadeGroup: React.FC<{
  start: number;
  end?: number;
  fade?: number;
  children: React.ReactNode;
  opacity?: number;
}> = ({start, end = 9999, fade = 0.22, children, opacity = 1}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const a = clamp01((t - start) / fade);
  const b = end >= 9999 ? 1 : clamp01((end - t) / fade);
  return <g opacity={Math.min(a, b) * opacity}>{children}</g>;
};
