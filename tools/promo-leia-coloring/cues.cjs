const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch({ args: ['--no-sandbox', '--allow-file-access-from-files'] });
  const p = await b.newPage(); await p.goto('file://' + path.resolve(__dirname, 'render.html')); await p.waitForFunction('window.READY===true');
  console.log(JSON.stringify(await p.evaluate(() => window.getCues()))); await b.close(); })();
