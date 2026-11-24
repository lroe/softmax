import React from "react";
import {AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {C} from "../theme";
import {clamp01} from "./scene";

export type MemeCaption = {
  /** centre x as a fraction of the image box */
  x: number;
  /** centre y as a fraction of the image box */
  y: number;
  /** max width as a fraction of the image box */
  w?: number;
  text: string | string[];
  size?: number;
  color?: string;
  align?: "center" | "left" | "right";
  stroke?: boolean;
};

/**
 * Full-bleed meme card. The meme is the only thing on screen: no diagram,
 * no labels from the scene underneath. 4-frame fade in/out on the Dracula bg.
 */
export const Meme: React.FC<{
  src: string;
  width: number;
  height: number;
  start: number;
  end: number;
  captions?: MemeCaption[];
  bg?: string;
  maxW?: number;
  maxH?: number;
}> = ({src, width, height, start, end, captions = [], bg = C.bg, maxW = 1360, maxH = 800}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  if (t < start - 0.15 || t > end + 0.15) return null;
  const scale = Math.min(maxW / width, maxH / height, 1.6);
  const w = width * scale;
  const h = height * scale;
  const fin = clamp01((t - start) / 0.14);
  const fout = clamp01((end - t) / 0.14);
  const op = Math.min(fin, fout);
  return (
    <AbsoluteFill style={{backgroundColor: bg, opacity: op, zIndex: 50}}>
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 540,
          width: w,
          height: h,
          transform: "translate(-50%, -50%)",
        }}
      >
        <Img
          src={staticFile(src)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "fill",
            imageRendering: "auto",
          }}
        />
        {captions.map((c, i) => {
          const left = c.x * w;
          const top = c.y * h;
          const maxWidth = (c.w ?? 0.8) * w;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left,
                top,
                width: maxWidth,
                transform: "translate(-50%, -50%)",
                textAlign: c.align ?? "center",
                color: c.color ?? "#FFFFFF",
                fontFamily: "DejaVu Sans, sans-serif",
                fontWeight: 700,
                fontSize: c.size ?? 46,
                lineHeight: 1.12,
                letterSpacing: 0.5,
                WebkitTextStroke: c.stroke === false ? undefined : "2.5px rgba(0,0,0,0.92)",
                paintOrder: "stroke fill",
                textShadow: "0 3px 0 rgba(0,0,0,0.45)",
                whiteSpace: "pre-wrap",
              }}
            >
              {Array.isArray(c.text) ? c.text.map((l, j) => <div key={j}>{l}</div>) : c.text}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
