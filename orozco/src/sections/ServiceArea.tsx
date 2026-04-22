import { MapPin } from 'lucide-react';
import { useLang } from '../i18n';

export function ServiceArea() {
  const { t, lang } = useLang();
  const chipBg = lang === 'es' ? 'bg-mx-green-light text-mx-green' : 'bg-us-blue-light text-us-blue';

  return (
    <section id="area" className="bg-paper border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-ink">{t.area.heading}</h2>
          <p className="mt-3 text-lg text-ink-muted">{t.area.sub}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {t.area.cities.map((c) => (
              <span
                key={c}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold ${chipBg}`}
              >
                <MapPin size={12} /> {c}
              </span>
            ))}
          </div>
          <p className="mt-6 text-sm text-ink-muted">{t.area.note}</p>
        </div>

        <MapMock />
      </div>
    </section>
  );
}

function MapMock() {
  const { lang } = useLang();
  const pinColor = lang === 'es' ? '#C8102E' : '#B31942';
  const bg = lang === 'es' ? '#E6F1EC' : '#E6ECF2';

  return (
    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden ring-1 ring-line shadow-md" style={{ backgroundColor: bg }}>
      <svg viewBox="0 0 400 300" className="absolute inset-0 w-full h-full">
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="400" height="300" fill="url(#grid)" />
        {/* abstract roads */}
        <path d="M0,180 C80,160 180,210 280,170 S400,140 400,140" stroke="#ffffff" strokeWidth="6" fill="none" opacity="0.9" />
        <path d="M120,0 C140,80 90,160 130,240 S160,300 160,300" stroke="#ffffff" strokeWidth="4" fill="none" opacity="0.8" />
        <path d="M0,80 L400,60" stroke="#ffffff" strokeWidth="3" fill="none" opacity="0.7" />
        {/* pins */}
        {[
          { x: 150, y: 170, name: 'Sunnyvale' },
          { x: 90, y: 130, name: 'Mountain View' },
          { x: 230, y: 190, name: 'Cupertino' },
          { x: 70, y: 90, name: 'Palo Alto' },
          { x: 190, y: 130, name: 'Los Altos' },
          { x: 280, y: 160, name: 'Santa Clara' },
        ].map((p) => (
          <g key={p.name}>
            <circle cx={p.x} cy={p.y} r="18" fill={pinColor} opacity="0.15" />
            <circle cx={p.x} cy={p.y} r="7" fill={pinColor} />
            <circle cx={p.x} cy={p.y} r="2.5" fill="#fff" />
          </g>
        ))}
      </svg>
      <div className="absolute left-3 bottom-3 text-[10px] font-bold uppercase tracking-wider text-ink-muted bg-white/90 rounded px-1.5 py-0.5">
        South Bay · Peninsula
      </div>
    </div>
  );
}
