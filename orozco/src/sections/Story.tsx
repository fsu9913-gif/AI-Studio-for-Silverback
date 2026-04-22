import { Quote } from 'lucide-react';
import { useLang } from '../i18n';

export function Story() {
  const { t, lang } = useLang();
  const accent = lang === 'es' ? 'text-mx-green' : 'text-us-blue';

  return (
    <section id="story" className="bg-paper border-t border-line">
      <div className="mx-auto max-w-4xl px-5 py-16 md:py-20">
        <div className="flex items-start gap-4">
          <Quote size={40} className={`${accent} shrink-0 mt-1`} />
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-ink">{t.story.heading}</h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-muted">{t.story.body}</p>
            <div className="mt-6 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full ${lang === 'es' ? 'bg-mx-green' : 'bg-us-blue'} text-white font-extrabold flex items-center justify-center`}>
                MO
              </div>
              <div>
                <div className="text-sm font-bold text-ink">Miguel Orozco</div>
                <div className="text-xs text-ink-muted">{lang === 'es' ? 'Fundador · Orozco Landscaping' : 'Founder · Orozco Landscaping'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
