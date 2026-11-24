import React from "react";
import {AbsoluteFill, Freeze, useVideoConfig} from "remotion";
import {Video} from "./Video";
import {C} from "./theme";

export const JudgeGrid: React.FC<{frames: number[]; cols?: number; label?: string; labels?: string[]}> = ({frames, cols = 2, label, labels}) => {
  const {width, height} = useVideoConfig();
  const rows = Math.ceil(frames.length / cols);
  const cellW = width / cols;
  const cellH = height / rows;
  return (
    <AbsoluteFill style={{backgroundColor: C.bg}}>
      {frames.map((f, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: col * cellW,
              top: row * cellH,
              width: cellW,
              height: cellH,
              overflow: "hidden",
              border: `2px solid ${C.line}`,
              boxSizing: "border-box",
            }}
          >
            <div style={{width, height, transform: `scale(${cellW / width})`, transformOrigin: "top left"}}>
              <Freeze frame={f}>
                <Video />
              </Freeze>
            </div>
            <div
              style={{
                position: "absolute",
                left: 10,
                top: 8,
                fontFamily: "DejaVu Sans Mono",
                fontSize: 20,
                color: C.fg,
                background: "rgba(30,31,41,0.8)",
                padding: "2px 8px",
              }}
            >
              {labels?.[i] ? `${labels[i]} · ` : label ? `${label} · ` : ""}f{f}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
