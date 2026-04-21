import React from 'react';

type Props = React.HTMLAttributes<HTMLDivElement> & {
  pad?: 'sm' | 'md' | 'lg';
};

export function Card({ pad = 'md', className = '', children, ...rest }: Props) {
  const padMap = { sm: 'p-4', md: 'p-5', lg: 'p-6' };
  return (
    <div
      {...rest}
      className={`rounded-lg bg-bg-card border border-border ${padMap[pad]} ${className}`}
    >
      {children}
    </div>
  );
}
