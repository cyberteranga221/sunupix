import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { I18nContext, type Lang } from './context';
import { fr, type Dictionary } from './fr';

const STORAGE_KEY = 'sunupix:lang';

/** Chargement paresseux de l'anglais : le français est dans le bundle initial. */
const loaders: Record<Lang, () => Promise<Dictionary>> = {
  fr: () => Promise.resolve(fr),
  en: () => import('./en').then((m) => m.en),
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('fr');
  const [t, setT] = useState<Dictionary>(fr);

  const setLang = useCallback((next: Lang) => {
    void loaders[next]().then((dict) => {
      setT(dict);
      setLangState(next);
      document.documentElement.lang = next;
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* sans importance */
      }
    });
  }, []);

  // Le pré-rendu est en français ; on applique la langue mémorisée après l'hydratation.
  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === 'en') setLang('en');
    } catch {
      /* sans importance */
    }
  }, [setLang]);

  const value = useMemo(() => ({ lang, t, setLang }), [lang, t, setLang]);
  return <I18nContext value={value}>{children}</I18nContext>;
}
