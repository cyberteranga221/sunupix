import type { ReactNode } from 'react';
import { Link, NavLink } from 'react-router';
import { APP } from '../config';
import { useI18n } from '../i18n';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';

export function Layout({ children }: { children: ReactNode }) {
  const { t, lang, setLang } = useI18n();
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-full px-3 py-2 text-sm transition hover:text-fg ${isActive ? 'text-fg font-medium' : 'text-muted'}`;

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#contenu"
        className="bg-accent text-on-accent sr-only z-50 rounded-lg px-4 py-2 focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        {t.common.skipToContent}
      </a>
      <div className="flag-stripe" aria-hidden="true" />
      <header className="border-line/70 bg-bg/80 sticky top-0 z-40 border-b backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-4 sm:px-6">
          <Link
            to="/"
            className="mr-auto flex items-center gap-2.5 rounded-lg font-semibold tracking-tight"
          >
            <Logo />
            <span className="text-lg">{APP.name}</span>
          </Link>
          <nav aria-label={t.nav.menu} className="hidden items-center sm:flex">
            <NavLink to="/faq" className={navClass}>
              {t.nav.faq}
            </NavLink>
            <NavLink to="/a-propos" className={navClass}>
              {t.nav.about}
            </NavLink>
          </nav>
          <button
            type="button"
            onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
            className="text-muted hover:bg-surface-2 hover:text-fg rounded-full px-3 py-2 text-sm font-medium transition"
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
      <footer className="border-line/70 border-t">
        <div className="text-muted mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm sm:flex-row sm:items-center sm:px-6">
          <p className="mr-auto">
            {APP.name} · {t.notices.privacy}
          </p>
          <nav aria-label="Liens" className="flex flex-wrap gap-x-5 gap-y-2">
            <Link to="/faq" className="hover:text-fg">
              {t.nav.faq}
            </Link>
            <Link to="/confidentialite" className="hover:text-fg">
              {t.nav.privacy}
            </Link>
            <Link to="/a-propos" className="hover:text-fg">
              {t.nav.about}
            </Link>
            <Link to="/contact" className="hover:text-fg">
              {t.nav.contact}
            </Link>
            <a href={APP.repoUrl} className="hover:text-fg" rel="noopener">
              GitHub
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
