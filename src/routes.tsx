import type { ComponentType } from 'react';
import { HomePage } from './pages/HomePage';

export interface AppRoute {
  path: string;
  Component: ComponentType;
}

/** Liste unique des routes : sert au routeur, au pré-rendu et au sitemap. */
export const routes: AppRoute[] = [{ path: '/', Component: HomePage }];
