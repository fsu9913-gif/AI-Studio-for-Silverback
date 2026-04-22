import { useLang } from '../i18n';

export function Footer() {
  const { t } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-white/80">
      <div className="mx-auto max-w-6xl px-5 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm">
        <div>
          <div className="text-white font-extrabold tracking-tight text-base">Orozco Landscaping</div>
          <div className="text-white/60 text-xs mt-0.5">Sunnyvale, CA · (408) 205-8417 · migueob89@gmail.com</div>
        </div>
        <div className="text-white/60 text-xs">
          {t.footer.builtBy} ·{' '}
          <a href="mailto:bryan@silverbackai.agency" className="underline decoration-white/30 hover:decoration-white">
            bryan@silverbackai.agency
          </a>
        </div>
        <div className="text-white/40 text-xs">© {year} Orozco Landscaping. {t.footer.rights}</div>
      </div>
    </footer>
  );
}
