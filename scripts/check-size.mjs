/**
 * Vérifie le poids du JavaScript chargé à l'ouverture de la page (gzip).
 * Le décodeur HEIC, chargé seulement à la demande, n'est pas compté.
 * Échoue si le budget est dépassé : la performance sur connexion lente est la priorité n°1.
 */
import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { gzipSync } from 'node:zlib';

const BUDGET_KB = 150;
const dist = resolve(import.meta.dirname, '..', 'dist');
const html = await readFile(join(dist, 'index.html'), 'utf8');
const files = new Set(
  [
    ...html.matchAll(/<(?:script[^>]+src|link[^>]+rel="modulepreload"[^>]+href)="([^"]+\.js)"/g),
  ].map((m) => m[1]),
);
let total = 0;
for (const file of files) {
  const size = gzipSync(await readFile(join(dist, file))).length;
  total += size;
  console.log(`  ${file}  ${(size / 1024).toFixed(1)} Ko gzip`);
}
const kb = total / 1024;
console.log(`JavaScript initial : ${kb.toFixed(1)} Ko gzip (budget ${BUDGET_KB} Ko)`);
if (kb > BUDGET_KB) {
  console.error('Budget dépassé !');
  process.exit(1);
}
