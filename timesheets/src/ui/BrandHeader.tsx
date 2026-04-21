import { Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export function BrandHeader({
  right,
  to = '/',
  variant = 'default',
}: {
  right?: React.ReactNode;
  to?: string;
  variant?: 'default' | 'light';
}) {
  const textClass = variant === 'light' ? 'text-white' : 'text-text';
  const subClass = variant === 'light' ? 'text-white/70' : 'text-text-muted';
  return (
    <header className="flex items-center justify-between">
      <Link to={to} className="flex items-center gap-2.5 group">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-primary text-white">
          <Clock size={18} strokeWidth={2.25} />
        </span>
        <span className="flex flex-col leading-none">
          <span className={`font-bold text-lg ${textClass}`}>Time Sheets</span>
          <span className={`text-[10px] font-semibold tracking-wide uppercase ${subClass}`}>
            by Silverback
          </span>
        </span>
      </Link>
      {right}
    </header>
  );
}
