"""Render voice lines with Kokoro (local, free) and save them as small mono mp3 files.

Usage: python make_voices.py jobs.json ../assets/voice
jobs.json comes from tools/voice-jobs.mjs. Existing files are skipped, so re-running only renders new lines.
Needs: kokoro-onnx, soundfile, ffmpeg in PATH. Model: ~/.cache/hyperframes/tts (downloaded by `npx hyperframes tts`).
"""
import json, os, subprocess, sys, tempfile
from pathlib import Path
import soundfile as sf
from kokoro_onnx import Kokoro

jobs = json.loads(Path(sys.argv[1]).read_text(encoding='utf-8'))
out = Path(sys.argv[2]); out.mkdir(parents=True, exist_ok=True)
home = Path.home() / '.cache' / 'hyperframes' / 'tts'
kokoro = Kokoro(str(home / 'models' / 'kokoro-v1.0.onnx'), str(home / 'voices' / 'voices-v1.0.bin'))

# a touch of character per voice: speed
SPEED = {'bf_isabella': 0.95, 'am_adam': 1.05, 'af_nova': 1.1, 'bm_george': 0.92, 'bf_lily': 1.02, 'bm_lewis': 0.9,
         'af_kore': 0.92, 'af_sarah': 1.05, 'am_puck': 1.0, 'bm_daniel': 0.92}
# 'voice+fx' in a job: the same Kokoro voice through a filter (radio, the station computer)
FX = {
    'radio': 'highpass=f=320,lowpass=f=3100,acompressor=threshold=-20dB:ratio=6,volume=1.6',
    'aria': 'aecho=0.8:0.5:18:0.3,highpass=f=140,lowpass=f=7000',
}
done = 0
for j in jobs:
    mp3 = out / f"{j['key']}.mp3"
    if mp3.exists():
        continue
    voice, _, fx = j['voice'].partition('+')
    lang = 'en-gb' if voice.startswith('b') else 'en-us'
    samples, sr = kokoro.create(j['text'], voice=voice, speed=SPEED.get(voice, 1.0), lang=lang)
    with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as tmp:
        sf.write(tmp.name, samples, sr)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', tmp.name, '-af', 'silenceremove=start_periods=1:start_threshold=-50dB,' + (FX[fx] + ',' if fx else '') + 'loudnorm=I=-18:TP=-2',
                    '-ac', '1', '-ar', '24000', '-b:a', '40k', str(mp3)], check=True)
    os.unlink(tmp.name)
    done += 1
    print(f"{done}/{len(jobs)} {j['voice']}: {j['text'][:60]}", flush=True)
print('ok', done, 'new files')
