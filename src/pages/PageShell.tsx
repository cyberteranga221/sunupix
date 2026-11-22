import type { ReactNode } from 'react';

/** Gabarit des pages de contenu : titre, chapeau et colonne de lecture confortable. */
export function PageShell({
  title,
  lead,
  children,
}: {
  title: string;
  lead?: string;
  children: ReactNode;
}) {
  return (
    <article className="mx-auto max-w-3xl px-4 pt-12 pb-20 sm:px-6 sm:pt-16">
      <h1 className="text-4xl font-bold tracking-[-0.03em] text-balance sm:text-5xl">{title}</h1>
      {lead && <p className="mt-5 text-lg leading-relaxed text-pretty text-muted">{lead}</p>}
      <div className="mt-12">{children}</div>
    </article>
  );
}

/** Suite de sections titrées. */
export function Sections({ items }: { items: ReadonlyArray<{ title: string; text: string }> }) {
  return (
    <div className="space-y-10">
      {items.map((section) => (
        <section key={section.title}>
          <h2 className="text-xl font-semibold tracking-tight">{section.title}</h2>
          <p className="mt-3 text-[16px] leading-relaxed text-pretty text-muted">{section.text}</p>
        </section>
      ))}
    </div>
  );
}

/** Liste de questions dépliables (balises natives <details>, accessibles sans JavaScript). */
export function FaqList({ items }: { items: ReadonlyArray<{ q: string; a: string }> }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item) => (
        <details key={item.q} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-medium select-none">
            {item.q}
            <svg
              viewBox="0 0 24 24"
              className="size-4 shrink-0 text-muted transition-transform group-open:rotate-90"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="m9 6 6 6-6 6" />
            </svg>
          </summary>
          <p className="max-w-2xl pb-6 text-[15px] leading-relaxed text-muted">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
