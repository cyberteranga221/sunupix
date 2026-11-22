import { Link } from 'react-router';
import { useT } from '../i18n';

export function NotFoundPage() {
  const t = useT();
  return (
    <div className="mx-auto flex max-w-xl flex-col items-start px-4 pt-20 pb-28 sm:px-6">
      <p className="font-mono text-sm text-muted">404</p>
      <h1 className="mt-3 text-4xl font-bold tracking-[-0.03em]">{t.pages.notFoundTitle}</h1>
      <p className="mt-4 text-lg text-muted">{t.pages.notFoundText}</p>
      <Link to="/" className="mt-8 btn-primary">
        {t.pages.notFoundCta}
      </Link>
    </div>
  );
}
