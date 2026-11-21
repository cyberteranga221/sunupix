export function Logo({ className = 'size-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <rect width="64" height="64" rx="16" fill="var(--color-brand-600)" />
      <path d="M14 46l11-14 8 10 6-7 11 11z" fill="#fff" />
      <circle cx="44" cy="20" r="6" fill="var(--color-sun-400)" />
    </svg>
  );
}
