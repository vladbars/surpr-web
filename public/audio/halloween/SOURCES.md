# Halloween reveal voices

Base recording: **Scary "Boo!" / 02** by **unfa** (2013-05-01).

- Source: https://freesound.org/people/unfa/sounds/187106/
- Author: https://freesound.org/people/unfa/
- License stated on the source page: **CC0 1.0 Universal**.
- License text: https://creativecommons.org/publicdomain/zero/1.0/
- Local source file: `boo-voice.mp3`, Freesound HQ preview, downloaded 2026-10-15.

`boo-ghost.m4a`, `boo-pumpkin.m4a`, and `boo-vampire.m4a` are edited derivatives: silence trimmed, layered pitch shifts, saturation, presence EQ, compression, a brief original synthesized impact and finite stereo room response. No model training or voice cloning is involved.

Reproduce on macOS with installed Chrome and project dependencies:

```sh
cd apps/web
node scripts/render-halloween-voices.mjs
```

The application serves these files locally and does not contact Freesound at runtime.
