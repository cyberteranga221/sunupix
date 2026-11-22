import { Link } from 'react-router';
import { Converter } from '../components/converter/Converter';
import { Icon } from '../components/Icon';
import type { OutputFormat } from '../engine/types';
import { useT } from '../i18n';
import { CONVERTER_PAGES, type ConverterSlug } from '../routes';

/** Page dédiée à une conversion (« HEIC en JPG »…) : convertisseur pré-réglé + explications. */
export function ConverterPage({ slug, format }: { slug: ConverterSlug; format: OutputFormat }) {
  const t = useT();
  const page = t.converters.items[slug];
  return (
    <>
      <div className="mx-auto grid max-w-6xl gap-8 px-4 pt-8 pb-16 sm:px-6 sm:pt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,34rem)] lg:gap-14 lg:pt-20 lg:pb-24">
        <header className="lg:sticky lg:top-28 lg:self-start">
          <h1 className="text-[2.5rem] leading-[1.02] font-bold tracking-[-0.035em] text-balance sm:text-6xl">
            {page.h1}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-pretty text-muted">
            {page.intro}
          </p>
        </header>
        <Converter presetFormat={format} />
      </div>
      <section className="border-t border-line/70">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-14 lg:py-20">
          <div className="max-w-2xl space-y-5 text-[16px] leading-relaxed text-pretty text-muted">
            {page.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <nav aria-label={t.converters.otherTitle}>
            <h2 className="text-sm font-semibold tracking-wide text-muted uppercase">
              {t.converters.otherTitle}
            </h2>
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {CONVERTER_PAGES.filter((c) => c.slug !== slug).map((c) => (
                <li key={c.slug}>
                  <Link
                    to={`/${c.slug}`}
                    className="flex items-center justify-between py-3 font-medium hover:text-accent"
                  >
                    {t.converters.items[c.slug].label}
                    <Icon name="arrow" className="size-4 text-muted" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>
    </>
  );
}
