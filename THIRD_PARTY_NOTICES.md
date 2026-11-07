# Third-party notices / Сторонние материалы

Lingo Stories includes the third-party materials listed below. Everything not listed here (story, dialogue, characters' names and personalities, posters, bot avatar, glossary, code in `js/`, `tools/`, `index.html`) is original work of the Lingo Stories authors.

В игре используются перечисленные ниже сторонние материалы. Всё, чего нет в этом списке, — собственная разработка авторов Lingo Stories: сюжет, диалоги, имена и характеры персонажей, постеры, аватарка бота, словарь, код в `js/`, `tools/` и `index.html`.

Record date / дата фиксации: 2026-11-07.

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

## 2. 3D models and animations — Quaternius, CC0 1.0 (public domain)

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

All packs above were obtained before the Quaternius Asset License v1.0 (2026-08-28) and are published by Quaternius under CC0. The models were compressed (glTF-Transform + meshopt), recoloured and re-targeted; the original files are kept in `assets/src/` (not published).

---

## 3. Voices — generated with Kokoro-82M

All voice lines in `assets/voice/*.mp3` were generated locally by the Lingo Stories authors with the Kokoro-82M text-to-speech model. They are synthetic voices, not recordings of real people.

- Model: Kokoro-82M by hexgrad — Apache License 2.0 — https://huggingface.co/hexgrad/Kokoro-82M (`kokoro-v1.0.onnx`, `voices-v1.0.bin`)
- Voices used: bf_isabella, am_adam, af_nova, bm_george, bf_lily, bm_lewis
- Tool: kokoro-onnx 0.6.1 (MIT) — https://github.com/thewh1teagle/kokoro-onnx; phonemizer 3.6.0 and espeakng-loader 0.2.4 used only on the authors' computer (not distributed)
- Generator script: `tools/make_voices.py`

The model itself is not distributed with the game.
