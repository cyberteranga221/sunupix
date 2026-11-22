import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { App } from './App';
import './styles.css';

const container = document.getElementById('root');
if (!container) throw new Error('#root introuvable');
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// Page pré-rendue : on « hydrate » le HTML existant. Sinon (mode dev) : rendu classique.
if (container.firstElementChild) hydrateRoot(container, app);
else createRoot(container).render(app);

// Mode hors ligne : le service worker est généré au build (scripts/prerender.mjs).
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register('/sw.js').catch(() => undefined);
  });
}
