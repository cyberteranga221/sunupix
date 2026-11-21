/**
 * Pré-rendu statique (SSG) maison.
 *
 * Après `vite build` (client) et `vite build --ssr` (serveur), ce script :
 *  1. charge le rendu serveur (dist-ssr/entry-server.js) ;
 *  2. génère le HTML de chaque route dans le gabarit dist/index.html ;
 *  3. écrit dist/<route>/index.html.
 * Aucun serveur n'est nécessaire ensuite : tout est statique.
 */
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = resolve(import.meta.dirname, '..');
const dist = join(root, 'dist');
const ssrDir = join(root, 'dist-ssr');

const template = await readFile(join(dist, 'index.html'), 'utf8');
const { render, paths } = await import(pathToFileURL(join(ssrDir, 'entry-server.js')).href);

for (const path of paths) {
  const html = await render(path);
  const page = template.replace('<!--app-html-->', html).replace('<!--app-head-->', '');
  const file = path === '/' ? join(dist, 'index.html') : join(dist, path, 'index.html');
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, page);
  console.log(`pré-rendu : ${path}`);
}

await rm(ssrDir, { recursive: true, force: true });
