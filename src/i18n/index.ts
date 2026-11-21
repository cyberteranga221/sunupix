import { useContext } from 'react';
import { I18nContext } from './context';

export { I18nProvider } from './I18nProvider';
export type { Lang } from './context';

/** Langue courante, dictionnaire et changement de langue. */
export const useI18n = () => useContext(I18nContext);
/** Dictionnaire de la langue courante : `t.hero.title`, `t.actions.convert(3)`… */
export const useT = () => useContext(I18nContext).t;
