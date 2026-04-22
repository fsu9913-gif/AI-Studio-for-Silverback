import { Image as ImageIcon } from 'lucide-react';
import { useLang } from '../i18n';

type Tile = { label: string; tone: 'green' | 'tan' | 'stone' };

const TILES: Tile[] = [
  { label: 'Lawn · Sunnyvale', tone: 'green' },
  { label: 'Driveway · Mountain View', tone: 'stone' },
  { label: 'Sprinklers · Cupertino', tone: 'green' },
  { label: 'Pavers · Los Altos', tone: 'tan' },
  { label: 'Fence · Santa Clara', tone: 'stone' },
  { label: 'Sod · Palo Alto', tone: 'green' },
];

export function Gallery() {
  const { t } = useLang();

  return (
    <section id="gallery" className="bg-cream">
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-ink">{t.gallery.heading}</h2>
        <p className="mt-3 text-lg text-ink-muted">{t.gallery.sub}</p>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TILES.map((tile, i) => (
            <PlaceholderTile key={i} tone={tile.tone} label={tile.label} fallback={t.gallery.placeholder} />
          ))}
        </div>

        <p className="mt-6 text-xs text-ink-light">
          {/* REPLACE WITH MIGUEL'S PHOTOS — drop files in orozco/public/photos/ and swap tiles for <img src="/photos/X.jpg" /> */}
        </p>
      </div>
    </section>
  );
}

function PlaceholderTile({ tone, label, fallback }: { tone: Tile['tone']; label: string; fallback: string }) {
  const bg =
    tone === 'green'
      ? 'bg-gradient-to-br from-mx-green-dark via-mx-green to-[#2E8B57]'
      : tone === 'tan'
        ? 'bg-gradient-to-br from-[#C9A678] via-[#A8824A] to-[#6F5430]'
        : 'bg-gradient-to-br from-[#6B7280] via-[#4B5563] to-[#1F2937]';

  return (
    <div className={`relative aspect-[4/3] rounded-2xl overflow-hidden ${bg} ring-1 ring-black/5 shadow-md`}>
      <div className="absolute inset-0 flex items-center justify-center">
        <ImageIcon size={36} className="text-white/40" />
      </div>
      <div className="absolute left-0 right-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
        <div className="text-white font-bold text-sm drop-shadow">{label}</div>
        <div className="text-white/70 text-[11px] font-medium">{fallback}</div>
      </div>
    </div>
  );
}
