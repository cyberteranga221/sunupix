import { StrictMode } from 'react';
import { prerender } from 'react-dom/static';
import { StaticRouter } from 'react-router';
import { App } from './App';
import { APP } from './config';
import { fr } from './i18n/fr';
import { routes } from './routes';
import { renderHead } from './seo/head';

/** Pages à pré-rendre au build (utilisé par scripts/prerender.mjs). « * » devient 404.html. */
export const pages = routes.map((route) => ({
  path: route.path,
  sitemap: route.sitemap,
  file:
    route.path === '*'
      ? '404.html'
      : route.path === '/'
        ? 'index.html'
        : `${route.path.slice(1)}/index.html`,
}));

export const siteUrl = APP.siteUrl;

/** Rend une page en HTML statique (en français), avec ses balises <head>. */
export async function render(path: string): Promise<{ html: string; head: string }> {
  const route = routes.find((r) => r.path === path);
  if (!route) throw new Error(`route inconnue : ${path}`);
  const url = path === '*' ? '/404' : path;
  const { prelude } = await prerender(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  );
  return { html: await new Response(prelude).text(), head: renderHead(route.meta(fr)) };
}
