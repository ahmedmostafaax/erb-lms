export function AuthCard({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-line bg-paper-raised p-8 shadow-sm shadow-ink/5">
        <span className="font-mono text-xs uppercase tracking-wider text-primary">{eyebrow}</span>
        <h1 className="mt-2 font-display text-2xl font-bold text-ink">{title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink/60">{subtitle}</p>

        <div className="mt-6">{children}</div>
      </div>

      {footer && <div className="mt-6 text-center text-sm text-ink/70">{footer}</div>}
    </div>
  );
}
