/**
 * Pré-rendu statique (SSG) maison.
 *
 * Après `vite build` (client) et `vite build --ssr` (serveur), ce script :
 *  1. génère le HTML de chaque page dans le gabarit dist/index.html (contenu + <head>) ;
 *  2. écrit dist/<page>/index.html et dist/404.html ;
 *  3. écrit sitemap.xml et robots.txt ;
 *  4. génère le service worker (mode hors ligne) avec Workbox, une fois toutes les pages prêtes.
 * Aucun serveur n'est nécessaire ensuite : tout est statique.
 */
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { generateSW } from 'workbox-build';

const root = resolve(import.meta.dirname, '..');
const dist = join(root, 'dist');
const ssrDir = join(root, 'dist-ssr');

const template = await readFile(join(dist, 'index.html'), 'utf8');
const { render, pages, siteUrl } = await import(
  pathToFileURL(join(ssrDir, 'entry-server.js')).href
);

for (const page of pages) {
  const { html, head } = await render(page.path);
  const output = template.replace('<!--app-head-->', head).replace('<!--app-html-->', html);
  const file = join(dist, page.file);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, output);
  console.log(`pré-rendu : ${page.path === '*' ? '404' : page.path}`);
}

// Plan du site et robots.txt.
const today = new Date().toISOString().slice(0, 10);
const urls = pages
  .filter((p) => p.sitemap)
  .map((p) => `  <url><loc>${siteUrl}${p.path}</loc><lastmod>${today}</lastmod></url>`)
  .join('\n');
await writeFile(
  join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);
await writeFile(
  join(dist, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
);

// Service worker : met en cache le site pour qu'il fonctionne hors ligne après la première visite.
const { count, size } = await generateSW({
  globDirectory: dist,
  swDest: join(dist, 'sw.js'),
  // Coque de l'application : pages, scripts, styles, icônes. Pas le décodeur HEIC (voir plus bas).
  globPatterns: ['**/*.{html,js,css,svg,webmanifest}', 'icon-192.png', 'apple-touch-icon.png'],
  globIgnores: ['**/libheif-*', 'brand/**', 'sw.js', 'workbox-*.js'],
  directoryIndex: 'index.html',
  // Les pages sont servies sans « /index.html » (ex. /faq) : on les met en cache sous cette adresse.
  manifestTransforms: [
    async (entries) => ({
      manifest: entries.map((entry) =>
        entry.url.endsWith('/index.html')
          ? { ...entry, url: entry.url.slice(0, -'/index.html'.length) }
          : entry,
      ),
      warnings: [],
    }),
  ],
  ignoreURLParametersMatching: [/.*/],
  skipWaiting: true,
  clientsClaim: true,
  cleanupOutdatedCaches: true,
  inlineWorkboxRuntime: true,
  sourcemap: false,
  // Décodeur HEIC (~1,5 Mo) : mis en cache à sa première utilisation, pas dès la première visite.
  runtimeCaching: [
    {
      urlPattern: ({ url }) => url.pathname.startsWith('/assets/libheif-'),
      handler: 'CacheFirst',
      options: { cacheName: 'sunupix-decodeur-heic', expiration: { maxEntries: 8 } },
    },
  ],
});
console.log(`service worker : ${count} fichiers en cache (${Math.round(size / 1024)} Ko)`);

await rm(ssrDir, { recursive: true, force: true });
