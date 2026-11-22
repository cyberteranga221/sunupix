/**
 * Génère les images PNG de la marque à partir des SVG (icônes PWA, Apple, image de partage).
 * Usage : node scripts/brand/render-png.mjs   (nécessite Playwright + Chromium)
 * Variable facultative : PLAYWRIGHT_CHROMIUM_PATH=/chemin/vers/chrome
 */
import { chromium } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..', '..');
const pub = join(root, 'public');
const svg = (name) => readFile(join(pub, 'brand', name), 'utf8');

const browser = await chromium.launch(
  process.env.PLAYWRIGHT_CHROMIUM_PATH
    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH }
    : {},
);

async function render(html, file, width, height) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  await page.setContent(`<!doctype html><html><body style="margin:0">${html}</body></html>`);
  await page.waitForTimeout(150);
  await page.screenshot({ path: join(pub, file), omitBackground: true });
  await page.close();
  console.log('écrit', file);
}

const symbole = await svg('sunupix-symbole.svg');
const plein = await svg('sunupix-symbole-plein.svg');
const logo = await svg('sunupix-logo.svg');
const sized = (s, w, h) =>
  s.replace('<svg ', `<svg width="${w}" height="${h}" style="display:block" `);

await render(sized(symbole, 192, 192), 'icon-192.png', 192, 192);
await render(sized(symbole, 512, 512), 'icon-512.png', 512, 512);
await render(sized(plein, 512, 512), 'icon-maskable-512.png', 512, 512);
await render(sized(plein, 180, 180), 'apple-touch-icon.png', 180, 180);

// Image de partage (Open Graph / Twitter) 1200 × 630.
await render(
  `<div style="box-sizing:border-box;width:1200px;height:630px;padding:72px 80px;background:#F6F6F3;
     font-family:'Inter Display',Inter,system-ui,sans-serif;color:#14161A;display:flex;flex-direction:column;position:relative">
     <div style="position:absolute;top:0;left:0;right:0;height:8px;background:linear-gradient(90deg,#00853F 0 33.33%,#FDEF42 33.33% 66.66%,#E31B23 66.66%)"></div>
     ${sized(logo, 260, 64)}
     <div style="margin-top:auto;font-size:76px;font-weight:700;letter-spacing:-0.035em;line-height:1.02">
       Des centaines de photos converties.<br/>Aucune envoyée.</div>
     <div style="margin-top:36px;display:flex;align-items:center;gap:28px;font-size:28px;color:#5A6068">
       <span style="font-family:'JetBrains Mono',monospace;background:#fff;border:2px solid #E2E2DC;border-radius:14px;padding:12px 20px;color:#14161A;white-space:nowrap">
         IMG_4821.HEIC → IMG_4821<b style="color:#0B6E3F">.JPG</b></span>
       <span style="white-space:nowrap">Gratuit · sans upload</span>
     </div></div>`,
  'og-image.png',
  1200,
  630,
);

await browser.close();
