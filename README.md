# Softmax Gate — local preview

A 19:54 hand-drawn Dracula-dark explainer about three 2026 papers: the softmax precision bug, silent (latent) reasoning agents, and latent feedback at training time.

No full video render was made. This project is set up for the Remotion Studio preview.

## Preview

The studio is already running:

**http://localhost:3111**

Then choose the **SoftmaxGate** composition. It is the first composition in the list. `JudgeGrid` is only a QA helper.

If you need to restart it:

```bash
cd video
npm run studio
```

## What is in here

- `video/src/Video.tsx` — master timeline, audio, scene sequences, full-screen meme cards
- `video/src/scenes/` — 51 scenes in seven chapter files
- `video/src/lib/` — rough.js sketch primitives, layout kit, meme overlay
- `video/src/data/words.json` — word-level Whisper alignment used for speech-locked reveals
- `video/public/audio.wav` — narration
- `video/public/memes/` — the seven full-screen meme cards

## Format

- 1920×1080, 30 fps
- 1194.88 s narration
- Dracula palette (`#282A36`)
- Patrick Hand / Caveat / DejaVu Sans Mono
- 4–6 frame fade through the background at scene cuts
- Memes are full-screen, have no diagram behind them, and last 5.0–6.0 s each

## Notes

- The meme captions are drawn by Remotion over the supplied meme templates, so the text stays crisp at 1080p.
- `whisper_words.json` was produced with faster-whisper `small.en` on CPU. The script words were aligned to the audio with difflib, and gaps were interpolated.
- Scene timing is phrase-based (`at("...")`) rather than fixed offsets, so each visual is tied to the narration word it explains.
