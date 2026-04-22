import { ArrowRight, Clock, ShieldCheck, Sprout, Mail } from 'lucide-react';

const TOOLS = [
  {
    slug: 'orozco',
    href: '/orozco/',
    title: 'Orozco Landscaping',
    kicker: 'Case study',
    description:
      'One-page customer site for a 10-year Sunnyvale landscaping crew. Bilingual, phone-first, built to convert a Google Business Profile tap into a call.',
    icon: Sprout,
    accent: 'text-[color:var(--color-moss)]',
    bg: 'bg-[color:var(--color-moss)]/10',
  },
  {
    slug: 'timesheets',
    href: 'https://belichickgillismusk.github.io/ai-studio-for-silverback/',
    title: 'Time Sheets',
    kicker: 'Product',
    description:
      'Bilingual time-and-labor SaaS for field-service crews. PIN-pad clock-in, job-site picker, CA Labor Code-aware. Seeded for Orozco; built to scale.',
    icon: Clock,
    accent: 'text-[color:var(--color-ink)]',
    bg: 'bg-[color:var(--color-ink)]/5',
    external: true,
  },
  {
    slug: 'security',
    href: '#contact',
    title: 'Silverback Security',
    kicker: 'In progress',
    description:
      'AI-assisted video monitoring for small apartment buildings. Privacy-first, Oakland-compliant, built around tenants not against them.',
    icon: ShieldCheck,
    accent: 'text-[color:var(--color-accent-dark)]',
    bg: 'bg-[color:var(--color-accent)]/15',
  },
];

const WORRIES = [
  'Payroll Sunday night, again, with a shoebox of paper timecards.',
  'Is the crew actually on site — or parked at the taqueria?',
  'A tenant incident at 2 a.m. and nobody watching the cameras.',
  'Google Business Profile looks like it was made in 2014.',
];

export default function App() {
  return (
    <div className="min-h-full">
      <Header />
      <Hero />
      <Worries />
      <Toolkit />
      <Contact />
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-20 bg-[color:var(--color-cream)]/85 backdrop-blur border-b border-[color:var(--color-line)]">
      <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 font-bold tracking-tight">
          <LogoMark />
          <span>Silverback<span className="text-[color:var(--color-ink-light)]"> AI</span></span>
        </a>
        <nav className="hidden sm:flex items-center gap-6 text-sm text-[color:var(--color-ink-muted)]">
          <a href="#toolkit" className="hover:text-[color:var(--color-ink)]">Toolkit</a>
          <a href="#contact" className="hover:text-[color:var(--color-ink)]">Contact</a>
        </nav>
      </div>
    </header>
  );
}

function LogoMark() {
  return (
    <span
      aria-hidden
      className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-ink text-white text-[11px] font-black tracking-[0.14em]"
    >
      SB
    </span>
  );
}

function Hero() {
  return (
    <section className="bg-ink text-white">
      <div className="max-w-6xl mx-auto px-5 py-20 sm:py-28">
        <p className="text-xs font-mono uppercase tracking-[0.22em] text-[color:var(--color-accent)] mb-5">
          Silverback AI · Agency + Studio
        </p>
        <h1 className="text-4xl sm:text-6xl font-black leading-[1.04] tracking-tight">
          Software for the stuff
          <br />
          that keeps you up at night.
        </h1>
        <p className="mt-6 max-w-2xl text-lg sm:text-xl text-[color:var(--color-silver)]">
          We build small, sharp tools for operators — landscaping crews, landlords,
          small-business owners — who already know what's broken and don't have a quarter
          to spend on a rebuild.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <a
            href="#toolkit"
            className="inline-flex items-center gap-2 rounded-md bg-[color:var(--color-accent)] px-5 py-3 text-sm font-semibold text-[color:var(--color-ink)] hover:bg-[color:var(--color-accent-dark)] hover:text-white transition-colors"
          >
            See the toolkit
            <ArrowRight className="w-4 h-4" aria-hidden />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-md border border-white/25 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
          >
            Start a project
          </a>
        </div>
      </div>
    </section>
  );
}

function Worries() {
  return (
    <section className="bg-[color:var(--color-paper)] border-y border-[color:var(--color-line)]">
      <div className="max-w-6xl mx-auto px-5 py-14">
        <h2 className="text-xs font-mono uppercase tracking-[0.22em] text-[color:var(--color-ink-light)]">
          What keeps you up at night
        </h2>
        <ul className="mt-6 grid sm:grid-cols-2 gap-x-10 gap-y-4 text-lg text-[color:var(--color-ink-soft)]">
          {WORRIES.map((w) => (
            <li key={w} className="flex gap-3">
              <span
                aria-hidden
                className="mt-2 inline-block w-1.5 h-1.5 rounded-full bg-[color:var(--color-accent)] shrink-0"
              />
              <span>{w}</span>
            </li>
          ))}
        </ul>
        <p className="mt-10 max-w-2xl text-[color:var(--color-ink-muted)]">
          We ship the tool that makes one of these disappear — usually in weeks, not quarters.
          Below: what we've shipped so far, and what's next.
        </p>
      </div>
    </section>
  );
}

function Toolkit() {
  return (
    <section id="toolkit" className="bg-[color:var(--color-cream)]">
      <div className="max-w-6xl mx-auto px-5 py-20">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <h2 className="text-xs font-mono uppercase tracking-[0.22em] text-[color:var(--color-ink-light)]">
              The toolkit
            </h2>
            <p className="mt-3 text-3xl sm:text-4xl font-black tracking-tight max-w-xl">
              Every project becomes a tool. Every tool earns its place.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {TOOLS.map((t) => (
            <ToolCard key={t.slug} tool={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ToolCard({ tool }: { tool: (typeof TOOLS)[number] }) {
  const Icon = tool.icon;
  return (
    <a
      href={tool.href}
      target={tool.external ? '_blank' : undefined}
      rel={tool.external ? 'noreferrer' : undefined}
      className="card rounded-xl p-6 flex flex-col gap-4 hover:-translate-y-0.5 transition-transform"
    >
      <div className={`w-11 h-11 rounded-lg ${tool.bg} flex items-center justify-center`}>
        <Icon className={`w-5 h-5 ${tool.accent}`} aria-hidden />
      </div>
      <div className="flex-1">
        <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-[color:var(--color-ink-light)]">
          {tool.kicker}
        </p>
        <h3 className="mt-1 text-xl font-bold tracking-tight">{tool.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-ink-muted)]">
          {tool.description}
        </p>
      </div>
      <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--color-ink)]">
        {tool.external ? 'Open demo' : 'Visit site'}
        <ArrowRight className="w-4 h-4" aria-hidden />
      </div>
    </a>
  );
}

function Contact() {
  return (
    <section id="contact" className="bg-ink text-white">
      <div className="max-w-6xl mx-auto px-5 py-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Got something that's been broken for a year?
            </h2>
            <p className="mt-5 text-lg text-[color:var(--color-silver)] max-w-xl">
              Short call, honest answer on whether it's a week of work or a quarter.
              No decks, no retainer pitch.
            </p>
          </div>
          <div className="card rounded-xl p-6 text-[color:var(--color-ink)]">
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-[color:var(--color-ink-light)]">
              Start a conversation
            </p>
            <a
              href="mailto:hello@silverbackai.agency"
              className="mt-3 inline-flex items-center gap-3 text-xl font-semibold hover:text-[color:var(--color-accent-dark)]"
            >
              <Mail className="w-5 h-5" aria-hidden />
              hello@silverbackai.agency
            </a>
            <p className="mt-4 text-sm text-[color:var(--color-ink-muted)]">
              One-line of context in the subject is plenty. Replies usually same-day.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[color:var(--color-paper)] border-t border-[color:var(--color-line)]">
      <div className="max-w-6xl mx-auto px-5 py-10 flex flex-wrap items-center justify-between gap-4 text-sm text-[color:var(--color-ink-muted)]">
        <div className="flex items-center gap-2">
          <LogoMark />
          <span>&copy; {new Date().getFullYear()} Silverback AI</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="/orozco/" className="hover:text-[color:var(--color-ink)]">Orozco</a>
          <a
            href="https://belichickgillismusk.github.io/ai-studio-for-silverback/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[color:var(--color-ink)]"
          >
            Time Sheets
          </a>
          <a
            href="mailto:hello@silverbackai.agency"
            className="hover:text-[color:var(--color-ink)]"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
