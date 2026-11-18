# Super Leia to the Rescue! promo (motion graphics)

Same pipeline as `../promo-kindergarten` (engine, captions, SFX), different scenes.

1. `python3 prep_art.py <repo-root>` — crops the coloured interior pages from the Etsy slideshow, the Leia avatar from the cover, and a real QR code (to https://www.logicmanse.ca/LeiaColoringBook/).
2. Narration (ElevenLabs "Marie – Young and Optimistic", eleven_v4) and music (eleven_music_v2) were generated in ElevenLabs; word timings from Scribe are in `captions.json` (already shifted +2.3 s for the hook).
3. `python3 make_captions.py` → `captions.js`, `captions.srt`, `captions.vtt`. `python3 assemble.py` → `scene.js` (shared engine from the Kindergarten build + `builders.js`).
4. Render with `node render.cjs <start> <end> <outdir>` (30 fps, 1272 frames), `node cues.cjs > cues.json`, `python3 build_audio.py cues.json sfx.wav`, then mix: narration delayed 2.3 s, music ducked under it, SFX at 0.6, loudnorm + limiter, 48 kHz stereo, H.264 crf 26.
