import type { ComponentType } from 'react';
import type { OutputFormat } from './engine/types';
import type { Dictionary } from './i18n/fr';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { ConverterPage } from './pages/ConverterPage';
import { FaqPage } from './pages/FaqPage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { faqPageLd, webApplicationLd, type PageMeta } from './seo/head';

export type ConverterSlug = keyof Dictionary['converters']['items'];

/** Pages de conversion pré-réglées : adresse → format de sortie imposé. */
export const CONVERTER_PAGES: ReadonlyArray<{ slug: ConverterSlug; format: OutputFormat }> = [
  { slug: 'heic-en-jpg', format: 'jpeg' },
  { slug: 'heic-en-png', format: 'png' },
  { slug: 'png-en-jpg', format: 'jpeg' },
  { slug: 'jpg-en-png', format: 'png' },
  { slug: 'webp-en-jpg', format: 'jpeg' },
];

export interface AppRoute {
  path: string;
  Component: ComponentType;
  meta: (t: Dictionary) => PageMeta;
  /** Présente dans sitemap.xml. */
  sitemap: boolean;
}

const converterRoutes: AppRoute[] = CONVERTER_PAGES.map(({ slug, format }) => ({
  path: `/${slug}`,
  Component: () => <ConverterPage slug={slug} format={format} />,
  meta: (t) => {
    const page = t.converters.items[slug];
    return {
      title: page.title,
      description: page.description,
      path: `/${slug}`,
      jsonLd: [webApplicationLd(`SunuPix — ${page.label}`, page.description, `/${slug}`)],
    };
  },
  sitemap: true,
}));

/** Liste unique des routes : routeur, pré-rendu, métadonnées et sitemap. */
export const routes: AppRoute[] = [
  {
    path: '/',
    Component: HomePage,
    meta: (t) => ({
      ...t.seo.home,
      path: '/',
      jsonLd: [
        webApplicationLd(t.seo.siteName, t.seo.home.description, '/'),
        faqPageLd(t.home.faq),
      ],
    }),
    sitemap: true,
  },
  ...converterRoutes,
  {
    path: '/faq',
    Component: FaqPage,
    meta: (t) => ({
      ...t.seo.faq,
      path: '/faq',
      jsonLd: [faqPageLd([...t.home.faq, ...t.pages.faqMore])],
    }),
    sitemap: true,
  },
  {
    path: '/confidentialite',
    Component: PrivacyPage,
    meta: (t) => ({ ...t.seo.privacy, path: '/confidentialite' }),
    sitemap: true,
  },
  {
    path: '/a-propos',
    Component: AboutPage,
    meta: (t) => ({ ...t.seo.about, path: '/a-propos' }),
    sitemap: true,
  },
  {
    path: '/contact',
    Component: ContactPage,
    meta: (t) => ({ ...t.seo.contact, path: '/contact' }),
    sitemap: true,
  },
  {
    path: '*',
    Component: NotFoundPage,
    meta: (t) => ({ ...t.seo.notFound, path: '/404', noindex: true }),
    sitemap: false,
  },
];
