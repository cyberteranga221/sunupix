import { useSyncExternalStore } from 'react';
import { useT } from '../i18n';
import { Icon } from './Icon';

type Theme = 'light' | 'dark';
const STORAGE_KEY = 'sunupix:theme';

const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
const readTheme = (): Theme =>
  document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';

/**
 * Bascule clair/sombre. Le thème initial est appliqué avant l'affichage par un petit
 * script dans <head> (voir index.html), pour éviter tout flash.
 */
export function ThemeToggle() {
  const t = useT();
  const theme = useSyncExternalStore<Theme>(subscribe, readTheme, () => 'light');

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* sans importance */
    }
    for (const listener of listeners) listener();
  };

  const label = theme === 'dark' ? t.nav.themeLight : t.nav.themeDark;
  return (
    <button
      type="button"
      onClick={toggle}
      className="text-muted hover:bg-surface-2 hover:text-fg inline-flex size-10 items-center justify-center rounded-full transition"
      aria-label={label}
      title={label}
    >
      <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
    </button>
  );
}
