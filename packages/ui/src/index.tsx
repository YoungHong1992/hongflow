import type { PropsWithChildren } from 'react';

export const cn = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(' ');

export const ShellCard = ({
  className,
  children,
}: PropsWithChildren<{ className?: string }>) => (
  <section
    className={cn(
      'rounded-3xl border border-white/10 bg-[#0e1324]/80 p-4 shadow-[0_16px_60px_rgba(0,0,0,0.28)] backdrop-blur',
      className,
    )}
  >
    {children}
  </section>
);

export const SectionTitle = ({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) => (
  <div className="space-y-2">
    <p className="text-xs uppercase tracking-[0.28em] text-[#9eb2d4]">{eyebrow}</p>
    <div className="space-y-1">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <p className="text-sm leading-6 text-[#a8b4cc]">{description}</p>
    </div>
  </div>
);

export const StatusBadge = ({
  tone,
  label,
}: {
  tone: 'neutral' | 'success' | 'warning' | 'danger';
  label: string;
}) => {
  const toneClassName =
    tone === 'success'
      ? 'bg-emerald-500/15 text-emerald-200'
      : tone === 'warning'
        ? 'bg-amber-500/15 text-amber-200'
        : tone === 'danger'
          ? 'bg-rose-500/15 text-rose-200'
          : 'bg-white/8 text-[#d7e0f2]';

  return (
    <span className={cn('rounded-full px-3 py-1 text-xs font-medium', toneClassName)}>
      {label}
    </span>
  );
};
