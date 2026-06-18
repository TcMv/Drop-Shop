import Link from 'next/link';

export function InfoPage({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-display font-bold mb-3">
          <span className="amber-gradient">{title}</span>
        </h1>
        {subtitle && (
          <p className="text-[var(--color-text-secondary)] mb-10">{subtitle}</p>
        )}
        <div className="space-y-8">{children}</div>
        <div className="mt-14 pt-8 border-t border-[var(--color-border-default)]">
          <Link href="/" className="text-sm text-[var(--color-brand-400)] hover:text-[var(--color-brand-300)] transition-colors">
            ← Back to the store
          </Link>
        </div>
      </div>
    </div>
  );
}

export function InfoSection({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section className="p-6 sm:p-8 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border-default)]">
      <h2 className="font-display font-semibold text-lg text-[var(--color-text-primary)] mb-3">
        {heading}
      </h2>
      <div className="text-sm text-[var(--color-text-secondary)] leading-relaxed space-y-3">
        {children}
      </div>
    </section>
  );
}
