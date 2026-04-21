import React from 'react';

type Tone = 'success' | 'warning' | 'danger' | 'neutral' | 'primary';

const TONE: Record<Tone, string> = {
  success: 'bg-success-light text-success',
  warning: 'bg-warning-light text-warning',
  danger: 'bg-danger-light text-danger',
  neutral: 'bg-border-light text-text-muted',
  primary: 'bg-primary-light text-primary-dark',
};

export function Pill({
  tone = 'neutral',
  children,
  className = '',
}: {
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${TONE[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
