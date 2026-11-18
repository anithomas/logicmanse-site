// node render.js <startFrame> <endFrame> <outDir> [fps]
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const [a, b, out, fpsArg] = process.argv.slice(2);
  const fps = +(fpsArg || 30);
  const browser = await chromium.launch({ args: ['--no-sandbox', '--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  page.on('pageerror', e => console.error('PAGEERROR', e.message));
  page.on('console', m => { if (m.type() === 'error') console.error('CONSOLE', m.text()); });
  await page.goto('file://' + path.resolve(__dirname, 'render.html'));
  await page.waitForFunction('window.READY === true');
  await page.evaluate(async () => { await Promise.all([...document.images].map(i => i.decode().catch(() => {}))); });
  require('fs').mkdirSync(out, { recursive: true });
  const frames = a.includes(',') ? a.split(',').map(Number) : Array.from({ length: +b - +a + 1 }, (_, i) => +a + i);
  for (const f of frames) {
    await page.evaluate(t => window.renderAt(t), f / fps);
    await page.screenshot({ path: `${out}/${String(f).padStart(5, '0')}.jpg`, type: 'jpeg', quality: 93 });
  }
  if (process.argv[6] === 'cues') console.log(JSON.stringify(await page.evaluate(() => window.getCues())));
  await browser.close();
})();
