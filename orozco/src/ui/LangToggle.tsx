import { useLang } from '../i18n';

export function LangToggle() {
  const { lang, setLang, t } = useLang();
  return (
    <div
      role="group"
      aria-label={t.langToggle.label}
      className="inline-flex items-center rounded-full border border-line bg-paper p-0.5 text-xs font-bold"
    >
      <button
        type="button"
        onClick={() => setLang('en')}
        aria-pressed={lang === 'en'}
        className={`px-2.5 h-7 rounded-full transition ${
          lang === 'en' ? 'bg-us-blue text-white' : 'text-ink-muted hover:text-ink'
        }`}
      >
        {t.langToggle.en}
      </button>
      <button
        type="button"
        onClick={() => setLang('es')}
        aria-pressed={lang === 'es'}
        className={`px-2.5 h-7 rounded-full transition ${
          lang === 'es' ? 'bg-mx-green text-white' : 'text-ink-muted hover:text-ink'
        }`}
      >
        {t.langToggle.es}
      </button>
    </div>
  );
}
