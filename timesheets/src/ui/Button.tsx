import React from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'warning' | 'ghost';
type Size = 'md' | 'lg' | 'xl';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  full?: boolean;
};

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-primary text-white hover:bg-primary-dark active:bg-primary-dark disabled:bg-border disabled:text-text-light',
  secondary:
    'bg-white text-text border border-border hover:bg-bg hover:border-text-light disabled:text-text-light',
  danger:
    'bg-danger text-white hover:brightness-95 active:brightness-90 disabled:bg-border disabled:text-text-light',
  warning:
    'bg-warning text-white hover:brightness-95 active:brightness-90 disabled:bg-border disabled:text-text-light',
  ghost:
    'bg-transparent text-text hover:bg-border-light disabled:text-text-light',
};

const SIZES: Record<Size, string> = {
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-5 text-base',
  xl: 'h-14 px-6 text-base',
};

export function Button({
  variant = 'primary',
  size = 'md',
  full,
  className = '',
  children,
  ...rest
}: Props) {
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center gap-2 rounded-md font-semibold transition
        ${VARIANTS[variant]} ${SIZES[size]} ${full ? 'w-full' : ''}
        disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
}
