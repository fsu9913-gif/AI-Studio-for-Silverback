import { Phone, Mail } from 'lucide-react';
import { useLang } from '../i18n';

const PHONE_DIGITS = '+14082058417';
const PHONE_DISPLAY = '(408) 205-8417';
const EMAIL = 'migueob89@gmail.com';

export function Contact() {
  const { t, lang } = useLang();
  const bg = lang === 'es' ? 'bg-grass' : 'bg-stars-stripes';
  const btn = lang === 'es' ? 'btn-primary-mx' : 'btn-primary-us';

  return (
    <section id="contact" className={`${bg} relative`}>
      <div className="mx-auto max-w-4xl px-5 py-16 md:py-24 text-center">
        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">{t.contact.heading}</h2>
        <p className="mt-4 text-lg text-white/90 max-w-2xl mx-auto">{t.contact.sub}</p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href={`tel:${PHONE_DIGITS}`}
            className={`inline-flex items-center gap-2 h-14 px-6 rounded-2xl text-lg font-bold ${btn}`}
          >
            <Phone size={20} /> {t.contact.cta}
          </a>
          <a
            href={`mailto:${EMAIL}?subject=${encodeURIComponent('Free estimate request')}`}
            className="inline-flex items-center gap-2 h-14 px-6 rounded-2xl text-lg font-bold bg-white text-ink hover:bg-cream transition"
          >
            <Mail size={20} /> {EMAIL}
          </a>
        </div>

        <p className="mt-6 text-sm font-semibold text-white/85 tabular">{PHONE_DISPLAY} · Sunnyvale, CA</p>
      </div>
    </section>
  );
}
