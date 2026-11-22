import { useEffect } from 'react';
import { Route, Routes } from 'react-router';
import { startAnalytics } from './analytics';
import { Layout } from './components/Layout';
import { I18nProvider, useT } from './i18n';
import { routes, type AppRoute } from './routes';
import { applyHead } from './seo/head';

/** Une page + la mise à jour du <head> (titre, description…) lors des navigations. */
function RouteView({ route }: { route: AppRoute }) {
  const t = useT();
  useEffect(() => {
    applyHead(route.meta(t));
  }, [route, t]);
  // Nouvelle page : retour en haut (mais pas lors d'un simple changement de langue).
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route]);
  return <route.Component />;
}

/** Racine de l'application, partagée par le rendu client et le pré-rendu. */
export function App() {
  useEffect(() => {
    void startAnalytics();
  }, []);
  return (
    <I18nProvider>
      <Layout>
        <Routes>
          {routes.map((route) => (
            <Route key={route.path} path={route.path} element={<RouteView route={route} />} />
          ))}
        </Routes>
      </Layout>
    </I18nProvider>
  );
}
