import { Route, Routes } from 'react-router';
import { routes } from './routes';

/** Racine de l'application, partagée par le rendu client et le pré-rendu. */
export function App() {
  return (
    <Routes>
      {routes.map(({ path, Component }) => (
        <Route key={path} path={path} element={<Component />} />
      ))}
    </Routes>
  );
}
