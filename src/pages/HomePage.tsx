import type { ReactNode } from 'react';
import { Converter } from '../components/converter/Converter';
import { Icon } from '../components/Icon';
import { EXTENSION } from '../engine/types';
import { useT } from '../i18n';
import { useOptions } from '../state/useOptions';

export function HomePage() {
  return (
    <>
      <div className="mx-auto grid max-w-6xl gap-8 px-4 pt-8 pb-16 sm:px-6 sm:pt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,34rem)] lg:gap-14 lg:pt-20 lg:pb-24">
        <Hero />
        <Converter />
      </div>
      <HowItWorks />
      <Privacy />
      <Faq />
    </>
  );
}

/** Accroche : le titre, la promesse, et le nom de fichier qui suit le format choisi. */
function Hero() {
  const t = useT();
  const { format } = useOptions();
  const ext = EXTENSION[format].toUpperCase();
  return (
    <header className="lg:sticky lg:top-28 lg:self-start">
      <h1 className="text-[2.5rem] leading-[1.02] font-bold tracking-[-0.035em] text-balance sm:text-6xl">
        {t.hero.title}
      </h1>
      <p className="mt-4 max-w-xl text-base leading-relaxed text-pretty text-muted sm:mt-5 sm:text-lg">
        {t.hero.subtitle}
      </p>

      {/* Signature : le nom de fichier d'un iPhone, avant et après. */}
      <p
        className="mt-6 inline-flex max-w-full items-center gap-3 overflow-hidden rounded-xl border border-line bg-surface px-4 py-3 font-mono text-sm sm:text-base"
        aria-label={`${t.hero.sampleName}.HEIC → ${t.hero.sampleName}.${ext}`}
      >
        <span className="truncate text-muted">
          {t.hero.sampleName}
          <span className="text-fg">.HEIC</span>
        </span>
        <Icon name="arrow" className="size-4 shrink-0 text-muted" />
        <span className="truncate">
          {t.hero.sampleName}
          <span key={ext} className="animate-ext-swap font-semibold text-accent">
            .{ext}
          </span>
        </span>
      </p>

      <ul className="mt-8 hidden space-y-2.5 sm:block">
        {t.hero.facts.map((fact) => (
          <li key={fact} className="flex items-center gap-3 text-[15px]">
            <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-accent/12 text-accent">
              <Icon name="check" className="size-3" />
            </span>
            {fact}
          </li>
        ))}
      </ul>
    </header>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="border-t border-line/70">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-14 lg:py-24">
        <h2 id={id} className="text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
          {title}
        </h2>
        <div>{children}</div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const t = useT();
  return (
    <Section id="comment" title={t.home.howTitle}>
      <ol className="grid gap-8 sm:grid-cols-3 sm:gap-6">
        {t.home.how.map((step, i) => (
          <li key={step.title}>
            <span className="font-mono text-sm text-accent tabular-nums">{i + 1}</span>
            <h3 className="mt-2 font-semibold">{step.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">{step.text}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

function Privacy() {
  const t = useT();
  return (
    <Section id="confidentialite" title={t.home.privacyTitle}>
      <p className="max-w-2xl text-lg leading-relaxed text-pretty">{t.home.privacyText}</p>
      <ul className="mt-8 grid gap-3 sm:grid-cols-3">
        {t.home.privacyPoints.map((point) => (
          <li
            key={point}
            className="flex gap-3 rounded-2xl border border-line bg-surface p-4 text-[15px] leading-snug"
          >
            <Icon name="shield" className="mt-0.5 size-5 shrink-0 text-accent" />
            {point}
          </li>
        ))}
      </ul>
    </Section>
  );
}

function Faq() {
  const t = useT();
  return (
    <Section id="faq" title={t.home.faqTitle}>
      <div className="divide-y divide-line border-y border-line">
        {t.home.faq.map((item) => (
          <details key={item.q} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-medium select-none">
              {item.q}
              <Icon
                name="chevron"
                className="size-4 shrink-0 text-muted transition-transform group-open:rotate-90"
              />
            </summary>
            <p className="max-w-2xl pb-6 text-[15px] leading-relaxed text-muted">{item.a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
