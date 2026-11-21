import { Route, Routes } from 'react-router';
import { Layout } from './components/Layout';
import { I18nProvider } from './i18n';
import { routes } from './routes';

/** Racine de l'application, partagée par le rendu client et le pré-rendu. */
export function App() {
  return (
    <I18nProvider>
      <Layout>
        <Routes>
          {routes.map(({ path, Component }) => (
            <Route key={path} path={path} element={<Component />} />
          ))}
        </Routes>
      </Layout>
    </I18nProvider>
  );
}
