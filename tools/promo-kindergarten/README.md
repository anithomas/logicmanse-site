# Leia Kindergarten promo (motion graphics)

Rebuilds `public/leia-kindergarten-workbook/promo.mp4` from code.
Every frame is a pure function of time in `scene.js`, rendered by Chromium (Playwright).

1. `python3 prep_art.py <free-printables.pdf> assets` — cuts the character stickers and land icons from the PDF (needs `pdftoppm`, numpy, scipy, Pillow).
2. Render frames (4 workers): `node render.cjs 0 347 frames` … `node render.cjs 1044 1391 frames` (30 fps, 1392 frames).
2b. Captions: `captions.json` holds the narration's word timings (ElevenLabs Scribe); `python3 make_captions.py` writes `captions.js` (burned in by `scene.js`) and the `.srt`/`.vtt` copied to `public/leia-kindergarten-workbook/promo-captions.*`.
3. `node cues.cjs > cues.json && python3 build_audio.py cues.json sfx.wav` — synthesised sound effects from the animation's cue list.
4. Mix with the original voice + music (delayed 2.3 s for the hook) and encode:
   `ffmpeg -framerate 30 -i frames/%05d.jpg -i orig.mp4 -i sfx.wav -filter_complex "[1:a]adelay=2300|2300,apad=whole_dur=46.4[a1];[2:a]volume=0.6[s];[a1][s]amix=inputs=2:normalize=0:duration=first,atrim=0:46.4[a]" -map 0:v -map "[a]" -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart -t 46.4 promo.mp4`

`orig.mp4` is the earlier cut (commit e5c3068) — its audio track (voice + music) is reused unchanged.
