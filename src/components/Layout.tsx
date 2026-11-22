import type { ReactNode } from 'react';
import { Link, NavLink } from 'react-router';
import { APP } from '../config';
import { useI18n } from '../i18n';
import { CONVERTER_PAGES } from '../routes';
import { Icon } from './Icon';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';

export function Layout({ children }: { children: ReactNode }) {
  const { t, lang, setLang } = useI18n();

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#contenu"
        className="sr-only z-50 rounded-lg bg-accent px-4 py-2 text-on-accent focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        {t.common.skipToContent}
      </a>
      <div className="flag-stripe" aria-hidden="true" />
      <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/80 backdrop-blur-md backdrop-saturate-150">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-1 px-4 sm:px-6">
          <Link
            to="/"
            className="mr-auto flex items-center gap-2.5 rounded-lg font-semibold tracking-tight"
          >
            <Logo className="size-7" />
            <span className="text-[17px]">{APP.name}</span>
          </Link>
          <nav aria-label={t.nav.menu} className="mr-1 hidden items-center sm:flex">
            {(
              [
                ['/faq', t.nav.faq],
                ['/a-propos', t.nav.about],
              ] as const
            ).map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `rounded-full px-3 py-2 text-sm transition hover:bg-surface-2 hover:text-fg ${isActive ? 'font-medium text-fg' : 'text-muted'}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
            className="inline-flex h-10 items-center rounded-full px-3 font-mono text-sm font-medium text-muted transition hover:bg-surface-2 hover:text-fg"
            aria-label={t.nav.switchLanguageLabel}
            lang={lang === 'fr' ? 'en' : 'fr'}
          >
            {lang === 'fr' ? 'EN' : 'FR'}
          </button>
          <ThemeToggle />
        </div>
      </header>
      <main id="contenu" className="flex-1">
        {children}
      </main>
      <footer className="border-t border-line/70">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 text-sm sm:px-6 md:grid-cols-[minmax(0,1.4fr)_repeat(2,minmax(0,1fr))]">
          <div className="max-w-sm space-y-3">
            <p className="flex items-center gap-2 font-semibold text-fg">
              <Logo className="size-5" />
              {APP.name}
            </p>
            <p className="leading-relaxed text-muted">{t.footer.tagline}</p>
            <a
              href={APP.repoUrl}
              rel="noopener"
              className="inline-flex items-center gap-2 text-muted hover:text-fg"
            >
              <Icon name="github" className="size-4" />
              {t.footer.license}
            </a>
          </div>
          <nav aria-label={t.nav.converters}>
            <p className="font-medium">{t.nav.converters}</p>
            <ul className="mt-3 space-y-2 text-muted">
              {CONVERTER_PAGES.map((c) => (
                <li key={c.slug}>
                  <Link to={`/${c.slug}`} className="hover:text-fg">
                    {t.converters.items[c.slug].label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label={APP.name}>
            <p className="font-medium">{APP.name}</p>
            <ul className="mt-3 space-y-2 text-muted">
              {(
                [
                  ['/faq', t.nav.faq],
                  ['/confidentialite', t.nav.privacy],
                  ['/a-propos', t.nav.about],
                  ['/contact', t.nav.contact],
                ] as const
              ).map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="hover:text-fg">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </footer>
    </div>
  );
}
