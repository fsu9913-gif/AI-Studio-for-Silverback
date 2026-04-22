import { ShieldCheck, Sparkles, Languages, Clock, Award, BadgeDollarSign } from 'lucide-react';
import { useLang } from '../i18n';

export function TrustBar() {
  const { t, lang } = useLang();
  const accent = lang === 'es' ? 'text-mx-green' : 'text-us-blue';

  const items = [
    { Icon: ShieldCheck, label: t.trust.licensed },
    { Icon: Sparkles, label: t.trust.insured },
    { Icon: Award, label: t.trust.bonded },
    { Icon: Clock, label: t.trust.years },
    { Icon: Languages, label: t.trust.bilingual },
    { Icon: BadgeDollarSign, label: t.trust.free },
  ];

  return (
    <section className="bg-paper border-y border-line">
      <div className="mx-auto max-w-6xl px-5 py-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-sm">
        {items.map(({ Icon, label }) => (
          <div key={label} className="flex items-center gap-2">
            <Icon size={16} className={accent} />
            <span className="font-semibold text-ink">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
