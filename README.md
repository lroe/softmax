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
- `video/public/memes/` — the fourteen full-screen meme cards

## Format

- 1920×1080, 30 fps
- 1194.88 s narration
- Dracula palette (`#282A36`)
- Patrick Hand / Caveat / DejaVu Sans Mono
- 4–6 frame fade through the background at scene cuts
- Memes are full-screen, have no diagram behind them, and last 5.0–7.2 s each
- The meme beats are cutaways only: the scene diagram is fully hidden underneath

## Notes

- The meme captions are drawn by Remotion over the supplied meme templates, so the text stays crisp at 1080p.
- `whisper_words.json` was produced with faster-whisper `small.en` on CPU. The script words were aligned to the audio with difflib, and gaps were interpolated.

## Meme beats

| Time | Meme | Beat |
|---|---|---|
| 0:17 | surprised pikachu | the bug is in every framework |
| 1:03 | monkey puppet | softmax… or the squeeze? |
| 4:22 | this is fine | loss spikes / slingshots |
| 5:48 | panik-kalm-panik | confident → loss 0 → gradient 0 |
| 6:54 | Batman slapping Robin | Adam turns a tiny error up |
| 9:50 | distracted boyfriend | rich thought vs one token |
| 10:47 | woman yelling at cat | text agents vs silent 3.9 |
| 11:09 | Drake | write it vs feed it back |
| 12:26 | one does not simply | serving stack tomorrow |
| 13:27 | roll safe | silent step: p = 1 |
| 15:09 | absolute cinema | the thought is doing the work |
| 17:07 | two buttons | latent feedback vs another pass |
| 18:09 | expanding brain | write → summarize → latent → silent |
| 19:50 | always has been | softmax has been everywhere |
- Scene timing is phrase-based (`at("...")`) rather than fixed offsets, so each visual is tied to the narration word it explains.
