import { initials } from '../lib/time';

type Size = 'sm' | 'md' | 'lg' | 'xl';
const SIZES: Record<Size, string> = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base',
  xl: 'w-20 h-20 text-2xl',
};

export function Avatar({
  name,
  size = 'md',
}: {
  name: string;
  size?: Size;
}) {
  return (
    <div
      className={`${SIZES[size]} rounded-full bg-navy text-white font-semibold inline-flex items-center justify-center shrink-0`}
      aria-hidden="true"
    >
      {initials(name)}
    </div>
  );
}
