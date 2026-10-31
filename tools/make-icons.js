// Genera los PNG de los iconos a partir de icons/icon.svg (necesita Playwright instalado).
// Uso: node tools/make-icons.js
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const root = path.join(__dirname, '..');
const svg = fs.readFileSync(path.join(root, 'icons/icon.svg'), 'utf8');
const defs = svg.match(/<defs>[\s\S]*?<\/defs>/)[0];
const art = svg.slice(svg.indexOf('<g id="art">'), svg.lastIndexOf('</svg>'));
// Maskable: fondo a sangre completa y el dibujo dentro de la zona segura (círculo del 80%).
const maskable = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">' + defs +
  '<rect width="512" height="512" fill="url(#bg)"/>' +
  '<g transform="translate(256 256) scale(.74) translate(-256 -256)">' + art + '</g></svg>';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const jobs = [
    ['icons/icon-192.png', svg, 192],
    ['icons/icon-512.png', svg, 512],
    ['icons/icon-maskable-512.png', maskable, 512],
    ['icons/apple-touch-icon.png', maskable, 180]
  ];
  for (const [out, markup, size] of jobs) {
    await page.setViewportSize({ width: size, height: size });
    const sized = markup.replace('<svg ', '<svg width="' + size + '" height="' + size + '" ');
    await page.setContent('<html><body style="margin:0;background:transparent">' + sized + '</body></html>');
    await page.screenshot({ path: path.join(root, out), omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } });
    console.log('ok', out);
  }
  await browser.close();
})();
