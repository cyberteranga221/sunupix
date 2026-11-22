import { useEffect, useRef } from 'react';
import { FEATURES } from '../../config';

/**
 * Emplacement publicitaire AdSense. DÉSACTIVÉ par défaut (FEATURES.ads = false) :
 * dans ce cas, rien n'est affiché et aucun script n'est chargé.
 *
 * Avant d'activer : plan Vercel payant (le plan gratuit interdit l'usage commercial),
 * mise à jour de la page Confidentialité, de la CSP dans vercel.json et d'un bandeau de
 * consentement si la loi l'exige.
 */
export function AdSlot({ slot }: { slot: string }) {
  const ref = useRef<HTMLModElement>(null);
  useEffect(() => {
    if (!FEATURES.ads || !FEATURES.adsenseClientId || !ref.current) return;
    const id = 'adsense-script';
    if (!document.getElementById(id)) {
      const script = document.createElement('script');
      script.id = id;
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${FEATURES.adsenseClientId}`;
      document.head.append(script);
    }
    const w = window as unknown as { adsbygoogle?: unknown[] };
    (w.adsbygoogle ??= []).push({});
  }, []);

  if (!FEATURES.ads || !FEATURES.adsenseClientId) return null;
  return (
    <ins
      ref={ref}
      className="adsbygoogle block"
      data-ad-client={FEATURES.adsenseClientId}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
