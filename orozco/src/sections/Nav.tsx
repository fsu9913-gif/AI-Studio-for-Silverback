import { Phone } from 'lucide-react';
import { useLang } from '../i18n';
import { LangToggle } from '../ui/LangToggle';

const PHONE_DIGITS = '+14082058417';
const PHONE_DISPLAY = '(408) 205-8417';

export function Nav() {
  const { t, lang } = useLang();
  const accent = lang === 'es' ? 'text-mx-green' : 'text-us-blue';
  const btn = lang === 'es' ? 'btn-primary-mx' : 'btn-primary-us';

  return (
    <header className="sticky top-0 z-30 bg-paper/95 backdrop-blur border-b border-line">
      <div className="mx-auto max-w-6xl px-5 h-14 flex items-center justify-between gap-4">
        <a href="#top" className="flex items-center gap-2 font-extrabold tracking-tight">
          <span className={accent}>Orozco</span>
          <span className="text-ink-muted font-semibold">Landscaping</span>
        </a>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-ink-muted">
          <a href="#services" className="hover:text-ink">{t.nav.services}</a>
          <a href="#story" className="hover:text-ink">{t.nav.story}</a>
          <a href="#area" className="hover:text-ink">{t.nav.area}</a>
          <a href="#contact" className="hover:text-ink">{t.nav.contact}</a>
        </nav>

        <div className="flex items-center gap-2">
          <LangToggle />
          <a
            href={`tel:${PHONE_DIGITS}`}
            className={`hidden sm:inline-flex items-center gap-2 h-9 px-3 rounded-lg text-xs font-bold ${btn}`}
          >
            <Phone size={14} /> {PHONE_DISPLAY}
          </a>
        </div>
      </div>
    </header>
  );
}
