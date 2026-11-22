import { FEATURES } from '../../config';

/** Bouton de don. DÉSACTIVÉ par défaut (FEATURES.donate = false) : rien n'est affiché. */
export function DonateButton({ label }: { label: string }) {
  if (!FEATURES.donate || !FEATURES.donateUrl) return null;
  return (
    <a href={FEATURES.donateUrl} rel="noopener" className="btn-secondary">
      {label}
    </a>
  );
}
