export const C = {
  bg: "#282A36",
  fg: "#F8F8F2",
  line: "#44475A",
  panel: "#313342",
  well: "#1E1F29",
  red: "#FF5555",
  green: "#50FA7B",
  pink: "#FF79C6",
  purple: "#BD93F9",
  cyan: "#8BE9FD",
  orange: "#FFB86C",
  yellow: "#F1FA8C",
  soft: "#B8B9C5",
  white: "#F8F8F2",
  dim: "#6272A4",
};

export const FONT = "Patrick Hand";
export const FONT_HAND = "Caveat";
export const FONT_MONO = "DejaVu Sans Mono";

export const W = 1920;
export const H = 1080;
export const FPS = 30;

export const SAFE = 120;

// Phone-safe type scale at 1080p. Never go below 36.
export const TYPE = {
  micro: 36,
  small: 42,
  body: 48,
  key: 56,
  big: 68,
  h1: 82,
  hero: 100,
  number: 132,
  huge: 190,
} as const;
