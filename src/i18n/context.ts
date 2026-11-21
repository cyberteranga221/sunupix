import { createContext } from 'react';
import { fr, type Dictionary } from './fr';

export type Lang = 'fr' | 'en';

export interface I18nValue {
  lang: Lang;
  t: Dictionary;
  setLang: (lang: Lang) => void;
}

export const I18nContext = createContext<I18nValue>({
  lang: 'fr',
  t: fr,
  setLang: () => undefined,
});
