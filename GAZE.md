# Original-media hero tracking

The existing React/esbuild entry remains in place. The hero uses the supplied
`docs/assets/character-poster.png` (served as an optimized WebP) and the original
`docs/assets/hero-flow.mp4`. Neither original is changed. No new character images,
face morphing, independent eye layers, CSS rotation, or dual-video dissolves are used.

## Source inspection

The Flow film is 1280×720, 24 fps, approximately ten seconds. Screen-space anchors:

| View | Source seconds |
| --- | ---: |
| Original still / start | 0.00 |
| Left | 1.55 or 8.05 |
| Upper left | 2.45 |
| Up | 3.25 |
| Upper right | 3.65 |
| Right | 4.55 |
| Lower right | 5.45 |
| Down | 6.35 |
| Lower left | 7.55 |
| Frontal, eyes open | 9.42 |

These are approximate directions from a filmed sweep, not a calibrated 3D pose
library. Blinks around 0.9–1.22, 2.95–3.2, 3.88–4.02 and 8.4–8.85 seconds are
preserved in transit but excluded as final holds.

## Hybrid behavior and limits

Pointer coordinates are clamped to [-1, 1] relative to the hero. Exponential
smoothing applies first to the pointer and then to source time, with bounded
travel. An angular map interpolates target time within the recorded arc. A center
dead zone prevents jitter. One paused decoder seeks serially to source frames;
there is no dissolve between different faces. A settled pose uses no animation
loop. Leaving returns through the source to its first frame and the original still.
Hidden/offscreen states cancel work immediately and restore the original still.

This cannot supply arbitrary continuous 2D head rotation or separately prioritize
the eyes: both are baked into the MP4. Changes between distant cursor directions
must pass through the filmed intermediate poses and therefore respond more slowly
than a rigged model. The implementation preserves source geometry rather than
inventing those missing transitions. A rigged original 3D model or additional
center-to-direction source clips would be needed to remove that limitation.

The full character envelope is fitted absolutely within the hero; portrait phones
place it higher so the existing text stays below the face. Orange edge masks blend
the original scene into the hero. No menu/text/button positioning is changed.

## Assets and resource policy

`assets/gaze/hero-scrub.mp4` is an H.264 derivative of the original with no audio,
fast-start metadata and a keyframe every six frames (~3.4 MB). This bounds decoder
work compared with seeking the original long GOP. Generation:

```sh
ffmpeg -i docs/assets/hero-flow.mp4 -an -c:v libx264 -preset slow -crf 20 \
  -g 6 -keyint_min 6 -sc_threshold 0 -pix_fmt yuv420p -movflags +faststart \
  docs/assets/gaze/hero-scrub.mp4
```

The static original WebP is ~128 KB. Coarse pointers, reduced motion, data saving,
loading failures and decoding timeouts retain that still. The video has no `src`
until the hero is visible on an eligible fine-pointer device. `requestAnimationFrame`
runs only with pending movement, a visible hero, and a visible document; while a
seek is outstanding the decoder's event resumes work instead of polling each frame.

## Validation

Run `node --test tests/gaze-motion.test.mjs`, `npm run build`, and `npm run typecheck`.
Browser checks cover frame envelope sizes 320–1920 px, stopped movement, offscreen
cancellation, return to the original still, touch/reduced-motion loading policy,
and failed-video fallback. Testimonial controls and the full-width portrait-tablet
layout are exercised separately.
