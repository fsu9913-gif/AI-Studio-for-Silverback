import { useLang, isOpenNow } from '../i18n';

export function Hours() {
  const { t, lang } = useLang();
  const open = isOpenNow();
  const today = new Date().getDay(); // 0 Sun .. 6 Sat
  const todayIndex = today === 0 ? 6 : today - 1; // our array is Mon..Sun
  const badge = open
    ? lang === 'es'
      ? 'bg-mx-green text-white'
      : 'bg-us-blue text-white'
    : 'bg-ink text-white';

  return (
    <section id="hours" className="bg-cream">
      <div className="mx-auto max-w-3xl px-5 py-16 md:py-20">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-ink">{t.hours.heading}</h2>
          <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-bold ${badge}`}>
            <span className={`w-2 h-2 rounded-full ${open ? 'bg-white' : 'bg-white/60'}`} /> {open ? t.hours.openNow : t.hours.closedNow}
          </span>
        </div>
        <ul className="mt-6 card-paper rounded-2xl overflow-hidden divide-y divide-line">
          {t.hours.days.map((d, i) => {
            const isToday = i === todayIndex;
            return (
              <li
                key={d.label}
                className={`flex items-center justify-between px-5 py-3.5 text-sm ${
                  isToday ? (lang === 'es' ? 'bg-mx-green-light' : 'bg-us-blue-light') : ''
                }`}
              >
                <span className={`font-semibold ${isToday ? 'text-ink' : 'text-ink-muted'}`}>
                  {d.label}
                  {isToday && <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-ink-light">{lang === 'es' ? 'Hoy' : 'Today'}</span>}
                </span>
                <span className="tabular font-semibold text-ink">{d.value}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
