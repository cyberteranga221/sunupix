/**
 * Petit serveur statique qui imite Vercel pour tester le site construit (dist/) :
 *  - /faq → dist/faq/index.html, page inconnue → dist/404.html (statut 404) ;
 *  - applique les en-têtes de vercel.json (CSP, cache…), pour tester la sécurité en local.
 * Usage : node scripts/serve.mjs [port]   (par défaut 4173)
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
import { brotliCompressSync, constants } from 'node:zlib';

const root = resolve(import.meta.dirname, '..');
const dist = join(root, 'dist');
const port = Number(process.argv[2] ?? 4173);
const config = JSON.parse(await readFile(join(root, 'vercel.json'), 'utf8'));

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.wasm': 'application/wasm',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
};

/** En-têtes vercel.json applicables à un chemin (« source » au format Vercel simplifié). */
function headersFor(pathname) {
  const out = {};
  for (const rule of config.headers) {
    const pattern = new RegExp(`^${rule.source.replace(/\(\.\*\)/g, '.*')}$`);
    if (pattern.test(pathname)) for (const h of rule.headers) out[h.key] = h.value;
  }
  return out;
}

async function isFile(path) {
  try {
    return (await stat(path)).isFile();
  } catch {
    return false;
  }
}

createServer(async (req, res) => {
  const pathname = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname);
  const safe = normalize(pathname).replace(/^(\.\.[/\\])+/, '');
  let file = join(dist, safe);
  let status = 200;
  if (!(await isFile(file))) file = join(dist, safe, 'index.html');
  if (!(await isFile(file))) {
    file = join(dist, '404.html');
    status = 404;
  }
  let body = await readFile(file);
  const headers = {
    'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream',
    ...headersFor(pathname),
  };
  // Compression Brotli, comme Vercel (sauf images déjà compressées).
  if (/\bbr\b/.test(req.headers['accept-encoding'] ?? '') && extname(file) !== '.png') {
    body = brotliCompressSync(body, { params: { [constants.BROTLI_PARAM_QUALITY]: 9 } });
    headers['Content-Encoding'] = 'br';
    headers['Vary'] = 'Accept-Encoding';
  }
  res.writeHead(status, headers);
  res.end(body);
}).listen(port, () => console.log(`SunuPix (dist) : http://localhost:${port}`));
