import { Converter } from '../components/converter/Converter';
import { Icon, type IconName } from '../components/Icon';
import { useT } from '../i18n';

export function HomePage() {
  const t = useT();
  const badges: Array<[IconName, string]> = [
    ['lock', t.hero.badgePrivate],
    ['gift', t.hero.badgeFree],
    ['wifiOff', t.hero.badgeOffline],
  ];
  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 pb-16 sm:px-6 sm:pt-16">
      <header className="mx-auto mb-10 max-w-2xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
          {t.hero.title}
        </h1>
        <p className="text-muted mt-4 text-base text-pretty sm:text-lg">{t.hero.subtitle}</p>
        <ul className="mt-6 flex flex-wrap justify-center gap-2 text-sm">
          {badges.map(([icon, label]) => (
            <li
              key={label}
              className="border-line bg-surface inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5"
            >
              <Icon name={icon} className="text-accent size-4" />
              {label}
            </li>
          ))}
        </ul>
      </header>
      <Converter />
    </div>
  );
}
