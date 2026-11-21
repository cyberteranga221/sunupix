import { StrictMode } from 'react';
import { prerender } from 'react-dom/static';
import { StaticRouter } from 'react-router';
import { App } from './App';
import { routes } from './routes';

/** Chemins à pré-rendre au build (utilisé par scripts/prerender.mjs). */
export const paths = routes.map((r) => r.path);

/** Rend une page en HTML statique. `prerender` attend la fin de tous les Suspense. */
export async function render(url: string): Promise<string> {
  const { prelude } = await prerender(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  );
  return new Response(prelude).text();
}
