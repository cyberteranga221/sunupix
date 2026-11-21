import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { APP } from '../config';
import { useI18n } from '../i18n';
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
          <a
            href={APP.repoUrl}
            rel="noopener"
            className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm text-muted transition hover:bg-surface-2 hover:text-fg sm:inline-flex"
          >
            <Icon name="github" className="size-4" />
            GitHub
          </a>
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
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 text-sm text-muted sm:flex-row sm:items-start sm:justify-between sm:px-6">
          <div className="max-w-sm space-y-2">
            <p className="flex items-center gap-2 font-semibold text-fg">
              <Logo className="size-5" />
              {APP.name}
            </p>
            <p className="leading-relaxed">{t.footer.tagline}</p>
          </div>
          <a
            href={APP.repoUrl}
            rel="noopener"
            className="inline-flex items-center gap-2 hover:text-fg"
          >
            <Icon name="github" className="size-4" />
            {t.footer.license}
          </a>
        </div>
      </footer>
    </div>
  );
}
