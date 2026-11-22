/**
 * Symbole SunuPix : le « S » de Sunu qui libère un pixel jaune (Pix).
 * Couleurs fixes de la marque (identiques en mode clair et sombre). Voir docs/charte-graphique.md.
 */
export function Logo({ className = 'size-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <rect width="64" height="64" rx="15" fill="#0B6E3F" />
      <path
        d="M41.5 17.6C39 15.2 35.8 14 32 14c-7.2 0-12 3.9-12 9.4 0 12.2 24 6.8 24 18.4 0 5.6-5 9.2-12.2 9.2-5 0-9.4-2-11.8-5.8"
        fill="none"
        stroke="#fff"
        strokeWidth="6.5"
        strokeLinecap="round"
      />
      <rect x="42.5" y="10" width="8.5" height="8.5" rx="2.2" fill="#F2C230" />
    </svg>
  );
}
