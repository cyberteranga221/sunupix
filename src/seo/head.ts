/**
 * Balises <head> propres à chaque page : titre, description, URL canonique, Open Graph,
 * Twitter Card et données structurées JSON-LD. Utilisé au pré-rendu (HTML statique)
 * et côté navigateur lors des changements de page.
 */
import { APP } from '../config';

export interface PageMeta {
  title: string;
  description: string;
  /** Chemin de la page, ex. « /heic-en-jpg ». */
  path: string;
  /** Données structurées (schema.org) à intégrer. */
  jsonLd?: object[];
  /** Page à ne pas indexer (404). */
  noindex?: boolean;
}

export const canonicalUrl = (path: string) => `${APP.siteUrl}${path === '/' ? '/' : path}`;

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** JSON dans <script> : on neutralise « < » pour qu'aucun texte ne puisse fermer la balise. */
const safeJson = (data: object) => JSON.stringify(data).replace(/</g, '\\u003c');

/** Génère le HTML des balises <head> (pré-rendu). */
export function renderHead(meta: PageMeta): string {
  const url = canonicalUrl(meta.path);
  const title = escapeHtml(meta.title);
  const description = escapeHtml(meta.description);
  const tags = [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    meta.noindex
      ? '<meta name="robots" content="noindex" />'
      : `<link rel="canonical" href="${url}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    ...(meta.jsonLd ?? []).map(
      (data) => `<script type="application/ld+json">${safeJson(data)}</script>`,
    ),
  ];
  return tags.join('\n    ');
}

/** Met à jour le <head> lors d'une navigation côté navigateur. */
export function applyHead(meta: PageMeta): void {
  document.title = meta.title;
  const set = (selector: string, attr: string, value: string) => {
    document.head.querySelector(selector)?.setAttribute(attr, value);
  };
  set('meta[name="description"]', 'content', meta.description);
  set('link[rel="canonical"]', 'href', canonicalUrl(meta.path));
  set('meta[property="og:title"]', 'content', meta.title);
  set('meta[property="og:description"]', 'content', meta.description);
  set('meta[property="og:url"]', 'content', canonicalUrl(meta.path));
  set('meta[name="twitter:title"]', 'content', meta.title);
  set('meta[name="twitter:description"]', 'content', meta.description);
}

/** Schéma « WebApplication » : décrit l'outil pour les moteurs de recherche. */
export function webApplicationLd(name: string, description: string, path: string): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    description,
    url: canonicalUrl(path),
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Tous (navigateur web)',
    browserRequirements: 'Navigateur récent avec WebAssembly',
    inLanguage: ['fr', 'en'],
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'XOF' },
    image: `${APP.siteUrl}/og-image.png`,
    author: { '@type': 'Person', name: APP.author, url: APP.authorUrl || undefined },
  };
}

/** Schéma « FAQPage » : les questions-réponses visibles sur la page. */
export function faqPageLd(items: ReadonlyArray<{ q: string; a: string }>): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}
