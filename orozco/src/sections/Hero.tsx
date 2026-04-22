import { Phone, Mail, ShieldCheck, Clock } from 'lucide-react';
import { useLang, isOpenNow } from '../i18n';

const PHONE_DIGITS = '+14082058417';
const PHONE_DISPLAY = '(408) 205-8417';
const EMAIL = 'migueob89@gmail.com';

export function Hero() {
  const { t, lang } = useLang();
  const bg = lang === 'es' ? 'bg-grass' : 'bg-stars-stripes';
  const btn = lang === 'es' ? 'btn-primary-mx' : 'btn-primary-us';
  const accent = lang === 'es' ? 'text-mx-red' : 'text-us-red';
  const open = isOpenNow();

  return (
    <section id="top" className={`${bg} relative overflow-hidden`}>
      <div className="mx-auto max-w-6xl px-5 pt-12 pb-16 md:pt-20 md:pb-24">
        <div className="grid md:grid-cols-[1.15fr_1fr] gap-10 items-center">
          <div className="text-white">
            <div className="inline-flex items-center gap-2 bg-white/12 backdrop-blur rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide text-white/95 ring-1 ring-white/20">
              <ShieldCheck size={14} /> {t.hero.eyebrow}
            </div>
            <h1 className="mt-5 text-4xl md:text-6xl font-black leading-[1.05] tracking-tight">
              {t.hero.title}
              <br />
              <span className={`${accent} bg-white rounded-md px-2 py-0.5 inline-block mt-2 shadow-lg`}>
                {t.hero.titleAccent}
              </span>
            </h1>
            <p className="mt-5 text-lg text-white/90 max-w-xl">{t.hero.subtitle}</p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={`tel:${PHONE_DIGITS}`}
                className={`inline-flex items-center gap-2 h-12 px-5 rounded-xl text-base font-bold ${btn}`}
              >
                <Phone size={18} /> {t.hero.ctaCall}
              </a>
              <a
                href={`mailto:${EMAIL}?subject=${encodeURIComponent('Free estimate request')}`}
                className="inline-flex items-center gap-2 h-12 px-5 rounded-xl text-base font-bold bg-white text-ink hover:bg-cream transition"
              >
                <Mail size={18} /> {t.hero.ctaEstimate}
              </a>
            </div>

            <div className="mt-5 flex items-center gap-3 text-xs text-white/80">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-semibold ${
                  open ? 'bg-white/15 text-white' : 'bg-black/25 text-white/80'
                }`}
              >
                <Clock size={12} /> {open ? t.hours.openNow : t.hours.closedNow}
              </span>
              <span className="font-medium">{t.hero.trust}</span>
            </div>
          </div>

          <HeroCard />
        </div>
      </div>

      {/* bottom edge fade */}
      <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-b from-transparent to-cream/60 pointer-events-none" />
    </section>
  );
}

function HeroCard() {
  const { t, lang } = useLang();
  const stripe = lang === 'es'
    ? ['bg-mx-green', 'bg-white', 'bg-mx-red']
    : ['bg-us-red', 'bg-white', 'bg-us-blue'];

  return (
    <div className="card-paper rounded-2xl p-5 md:p-6 max-w-md md:justify-self-end w-full">
      <div className="flex items-center gap-1 h-2.5 rounded-full overflow-hidden mb-5 ring-1 ring-line">
        <div className={`flex-1 h-full ${stripe[0]}`} />
        <div className={`flex-1 h-full ${stripe[1]}`} />
        <div className={`flex-1 h-full ${stripe[2]}`} />
      </div>

      <div className="text-xs font-bold tracking-widest text-ink-muted uppercase">
        {lang === 'es' ? 'Propietario' : 'Owner'}
      </div>
      <div className="mt-1 text-2xl font-extrabold tracking-tight">Miguel Orozco</div>
      <div className="text-sm text-ink-muted">Sunnyvale, CA · 10 {lang === 'es' ? 'años' : 'years'}</div>

      <div className="mt-5 space-y-2.5 text-sm">
        <a
          href={`tel:${PHONE_DIGITS}`}
          className="flex items-center gap-3 rounded-lg border border-line px-3 py-2.5 hover:bg-cream transition"
        >
          <span className="w-8 h-8 rounded-full bg-mx-green-light text-mx-green flex items-center justify-center">
            <Phone size={14} />
          </span>
          <span className="flex-1 font-semibold tabular">{PHONE_DISPLAY}</span>
          <span className="text-xs font-bold text-ink-light">{t.contact.callLabel}</span>
        </a>
        <a
          href={`mailto:${EMAIL}`}
          className="flex items-center gap-3 rounded-lg border border-line px-3 py-2.5 hover:bg-cream transition"
        >
          <span className="w-8 h-8 rounded-full bg-mx-green-light text-mx-green flex items-center justify-center">
            <Mail size={14} />
          </span>
          <span className="flex-1 font-semibold truncate">{EMAIL}</span>
          <span className="text-xs font-bold text-ink-light">{t.contact.emailLabel}</span>
        </a>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[10px] font-bold uppercase tracking-wide text-ink-muted">
        <div className="rounded-md bg-cream py-2">{t.trust.licensed}</div>
        <div className="rounded-md bg-cream py-2">{t.trust.insured}</div>
        <div className="rounded-md bg-cream py-2">{t.trust.bonded}</div>
      </div>
    </div>
  );
}
