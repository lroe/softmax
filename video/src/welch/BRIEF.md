# Welch Labs 30s prototype — scene brief

Create **one** Remotion scene: `src/welch/WelchScene.tsx`.

## Hard constraints
- 1920×1080, 30 fps, 900 frames (30.00 s). One continuous macro-scene. No cuts.
- Dracula palette only. Never use `#6272A4` for text. Text >= 40px everywhere.
- Rough.js seeds fixed on every shape. No `Math.random`, no CSS animation, no full render.
- 55–75% negative space. One focal zone per beat. Dim context to 0.28, never delete it.
- Use existing `Canvas`, `Label`, `SketchRect`, `SketchPath`, `SketchLine`, `Arrow`, `WordChip`, `Cloud`, `SpeechBubble`, `Underline`, `useT` from `src/lib` where possible.
- The audio is `public/audio-30s.wav`; word-level timings are in `src/data/words.json` and `at()` from `src/timing.ts`.
- Return only the file path, typecheck result, and 3 key frame numbers.

## Spatial map (persistent, camera pans/zooms)
### Top lane — the word route
- Left: four tactile token cards `the` `cat` `sat` `on` in cyan, x≈120–560, y≈370. A small target card `mat` in orange at x≈630, y≈370 (the next word).
- Center: model block x≈780-1040, y≈330-530, label `model` 56px. Inside, a small cyan vector strip `0.21 -0.11 0.32` 40px.
- Right: scores stack / three logits `3.2 1.1 0.4` at x≈1100-1230, y≈360-490, label `scores` 40px.
- Far right: softmax gate x≈1330-1560, y≈320-540, label `softmax` 52px. Use a clean gate/doorway (single posts+arch+threshold), purple.
- Probabilities x≈1600-1840: `mat 62%`, `rug 21%`, `floor 9%`, `bed 8%`, orange/muted bars, label `chances` 40px.
- Formula under gate at y≈600: `softmax(z) = eᶻ / Σeᶻ` in mono 40px, appears **after** the concrete bars.
- Paper card above gate, x≈1280-1600, y≈120-260, `DeepMind` 56px plus a tiny page glyph. No “new paper / a bug in softmax” title.
- Signal meter under gate at y≈640: `signal` 40px and a thin bar; drains to `0` at 12.58 s.
- Confidence readout at x≈780-1040, y≈220-330: big `99.9%` 112px + small arc/needle, appears at 15.34 s.
- Framework tags along y≈710, x≈420-1580: `JAX` purple, `PyTorch` orange, `TensorFlow` yellow, `textbooks` cyan, 44px; staggered on their words.

### Bottom lane — silent thinking (hidden until 21.52 s)
- Dashed rounded lane frame, very faint.
- Stick agent at x≈360, y≈940, head at 840; thought cloud (x≈470, y≈760, 300×190) with cyan dots.
- Empty speech bubble with `...` at x≈850, y≈850 appears at 27.64 s.
- `tool_call()` chip at x≈1250, y≈840 appears at 28.64 s.
- Lane 2 fades in at 21.52; top lane dims to 0.3 at 22.8.

## Timing / beats
0.00 “Every” — wide map anchored: input → model → scores → softmax → bars. Camera zoom 1.0.
2.28 “runs through one function” — camera zooms to softmax gate 1.14×.
3.20 “one function” — formula appears, bars remain visible.
4.06 “Softmax.” — gate label/hero highlight.
5.12 “Last month” — DeepMind paper card pops above gate; other elements dim to 0.35.
6.08 “DeepMind” — paper card spotlight.
7.20 “standard version” / 8.70 “bug” — red crack on gate; label `bug` 40px.
9.32 “The bug” — camera shifts to signal meter, input/model dim.
10.56 “best learning signal” — yellow pointer arrow to signal bar.
12.58 “zero” — signal bar drains; big red `0`.
13.62 “moment” — confidence readout draws at 99.9%; arrow from confidence to gate.
17.64 “JAX” — first framework tag; then PyTorch 18.74, TensorFlow 19.58, textbooks 20.60.
21.52 “half” — camera zooms out 0.92×; bottom lane fades in; top lane stays at 0.3.
22.80–27.18 “same month … silence” — agent + cloud spotlight, loop/feedback path from cloud.
27.64 “No words” — empty speech bubble `...`.
28.64 “only speaks” / 29.72 “tool” — `tool_call()` chip.
29.7–30.0 — final hold, fade to #282A36 in last 6 frames.

## Camera keyframes (frame numbers at 30fps)
0: center 960,500 zoom 1.00
66: 960,500 1.00
90: 1330,430 1.14
150: 1330,430 1.14
160: 1000,430 1.00
260: 1200,400 1.06
390: 1200,470 1.08
510: 960,360 1.04
600: 1000,520 1.00
645: 960,560 0.92
900: 960,560 0.92
Use easeInOutCubic in `CameraRig`; apply as `<g transform={`translate(${960 - x*zoom} ${540 - y*zoom}) scale(${zoom})`}>` around the map.

## QA targets
- frame 120: concrete example visible, one focal (softmax)
- frame 360: DeepMind + crack + signal
- frame 500: 99.9% + frameworks
- frame 780: both lanes, silent agent
