# Third-party notices / Сторонние материалы

Lingo Stories includes the third-party materials listed below. Story text, dialogue, posters, bot avatar, glossary and application code were created for this project. This notice records component provenance and does not itself establish exclusive rights to AI-assisted material or to any unlisted third-party inputs.

В игре используются перечисленные ниже сторонние материалы. Сюжет, диалоги, постеры, аватарка бота, словарь и код приложения созданы для этого проекта. Этот перечень фиксирует происхождение компонентов, но сам по себе не доказывает исключительные права на материалы, созданные с помощью ИИ, или на неучтённые сторонние элементы.

Record date / дата обновления: 2026-11-19.

---

## 1. Software (bundled in `vendor/`)

### three.js r170 — MIT License
Files: `vendor/three.module.js`, `vendor/addons/loaders/GLTFLoader.js`, `vendor/addons/utils/BufferGeometryUtils.js`, `vendor/addons/utils/SkeletonUtils.js`
Source: https://github.com/mrdoob/three.js/tree/r170

```
The MIT License

Copyright © 2010-2024 three.js authors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```

### meshoptimizer (decoder) — MIT License
File: `vendor/addons/libs/meshopt_decoder.module.js`
Source: https://github.com/zeux/meshoptimizer

```
MIT License

Copyright (c) 2016-2022 Arseny Kapoulkine

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### Loaded at runtime from third-party servers (not bundled)
- Telegram Web App script — https://telegram.org/js/telegram-web-app.js (Telegram).
- Google Fonts — Special Elite (Apache License 2.0), Share Tech Mono, Caveat, Inter (SIL Open Font License 1.1), served by fonts.googleapis.com.

---

## 2. 3D models and animations

### Quaternius packs — CC0 1.0 (public domain)

Author: Quaternius — https://quaternius.com · https://www.patreon.com/quaternius
License: CC0 1.0 Universal — https://creativecommons.org/publicdomain/zero/1.0/
Attribution is not required by CC0; given here as a courtesy and as a record of provenance.

| Pack | Official page | Used in | Files obtained from (mirror, commit) |
|---|---|---|---|
| Ultimate Modular Men | https://quaternius.com/packs/ultimatemodularcharacters.html | `assets/models/m_men_*.glb` | github.com/trebeljahr/quaternius-showcase, licence record `LICENSES.md` @ 335270d8 |
| Ultimate Modular Women | https://quaternius.com/packs/ultimatemodularwomen.html | `assets/models/m_women_*.glb` | same as above |
| Ultimate House Interior | https://quaternius.com/packs/ultimatehomeinterior.html | `assets/models/props_interior.glb` | same as above |
| Modular Streets | https://quaternius.com/packs/modularstreets.html | `props_interior.glb` (Sign_NoParking, Streetlight_Single, TrafficLight) | same as above |
| Universal Animation Library (Standard) | https://quaternius.com/packs/universalanimationlibrary.html | `assets/models/anim_ual1.glb` | github.com/Dallolz/moorfall-assets `animations/UAL1.glb` @ 43824dae (2026-07-05), with CC0 `LICENSE.md` |
| Universal Animation Library 2 (Standard) | https://quaternius.com/packs/universalanimationlibrary2.html | `assets/models/anim_ual2.glb` | github.com/Dallolz/moorfall-assets `animations/UAL2.glb` (2026-07-05) |

The listed pack pages currently identify the packs as CC0. Quaternius also publishes a general Asset License v1.0. All 57 local GLB inputs for the listed models, props and animations match Git blobs at the cited mirror revisions. See `docs/rights/source-mirror-check.json` in the workspace for the exact paths and hashes. This comparison establishes identity with the mirrors. The author's original download archives and the acquisition dates remain unverified. The prepared release contains the processed game files.

### The Camden Cover Story characters assembled in VRoid Studio

Kit, Leo, Ava, Dana, Sienna and the player character were made for Lingo Stories with Claude Code in VRoid Studio 2.16.0. The models use base meshes, presets and texture layers provided by pixiv Inc. The game adapts Quaternius animations to their rigs and adds Dana’s glasses and Leo’s headphones through scene code. [VRoid Studio Guidelines](https://vroid.com/en/studio/guidelines).

The six game-ready GLBs were reproduced byte for byte from the local VRoid exports. All PNG layers recovered from the six editor projects matched images built into the local VRoid Studio installation. The mobile GLBs use the same exports and geometry with textures reduced to a maximum dimension of 512 pixels. The [asset record](docs/rights/backstage-cast.json) lists the checked files and hashes for both variants. Only game-ready GLBs are deployed. The original VRM files and their permission metadata remain in the local archive. The project uses the characters in the game according to the project owner’s request. No standalone avatar reuse license is granted by this notice.

---

## 3. Voices — generated with Kokoro-82M

All voice lines in `assets/voice/*.mp3` were generated locally by the Lingo Stories authors with the Kokoro-82M text-to-speech model. They are synthetic voices, not recordings of real people.

- Model: Kokoro-82M by hexgrad — Apache License 2.0 — https://huggingface.co/hexgrad/Kokoro-82M (`kokoro-v1.0.onnx`, `voices-v1.0.bin`)
- Voices used: bf_isabella, am_adam, af_nova, bm_george, bf_lily, bm_lewis, af_kore, af_sarah, am_puck, bm_daniel, bf_emma, bm_fable, bf_alice (some passed through an ffmpeg radio / echo filter)
- Tool: kokoro-onnx 0.6.1 (MIT) — https://github.com/thewh1teagle/kokoro-onnx; phonemizer 3.6.0 and espeakng-loader 0.2.4 used only on the authors' computer (not distributed)
- Generator script: `tools/make_voices.py`

The model itself is not distributed with the game.

## 4. License evidence and distribution

Current official pack pages, software/font licenses and the Kokoro model card were archived in `docs/rights/licenses/`; `index.json` records URL, retrieval time and SHA-256. These snapshots record today's publication, not the original acquisition date or the identity of meshes obtained from mirrors. Voice-source hashes record the local files found now, not proof of which historical model version produced every MP3.

Use `node tools/build-release.mjs` for distribution. It verifies the reviewed asset manifest and copies only game files, notices and required license evidence into `.runtime/release/`. Source models, retired files, trial portraits, development viewers and audit reports are excluded. Remaining document and clearance gaps are recorded in `docs/rights/implementation-status.md`; replacing the cast does not assert that every legal question is resolved.
