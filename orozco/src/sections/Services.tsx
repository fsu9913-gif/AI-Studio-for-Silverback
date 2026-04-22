import { Sprout, Droplets, TreeDeciduous, Hammer, Grid3x3, Fence } from 'lucide-react';
import { useLang } from '../i18n';

const ICONS = [Sprout, Droplets, TreeDeciduous, Hammer, Grid3x3, Fence];

export function Services() {
  const { t, lang } = useLang();
  const accentBg = lang === 'es' ? 'bg-mx-green-light' : 'bg-us-blue-light';
  const accentText = lang === 'es' ? 'text-mx-green' : 'text-us-blue';

  return (
    <section id="services" className="bg-cream">
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-ink">{t.services.heading}</h2>
          <p className="mt-3 text-lg text-ink-muted">{t.services.sub}</p>
        </div>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {t.services.items.map((item, i) => {
            const Icon = ICONS[i] ?? Sprout;
            return (
              <div
                key={item.title}
                className="card-paper rounded-2xl p-5 flex gap-4 hover:-translate-y-0.5 transition"
              >
                <div className={`w-11 h-11 rounded-xl ${accentBg} ${accentText} flex items-center justify-center shrink-0`}>
                  <Icon size={22} />
                </div>
                <div className="min-w-0">
                  <div className="text-base font-bold text-ink">{item.title}</div>
                  <div className="mt-1 text-sm text-ink-muted leading-relaxed">{item.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
