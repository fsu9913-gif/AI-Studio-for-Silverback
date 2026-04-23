import {
  ArrowRight,
  Phone,
  Mail,
  Globe,
  MapPin,
  Clock,
  Check,
  Shield,
  Users,
  Building2,
  ArrowUpRight,
  FileText,
} from 'lucide-react';

const AGENCY = {
  name: 'Silverback AI Agency',
  email: 'bryan@silverbackai.agency',
  short: 'Silverback',
};

const SITE_BASE = import.meta.env.BASE_URL.replace(/\/$/, '') || '';
const link = (path: string) => `${SITE_BASE}/${path.replace(/^\//, '')}`;

export default function App() {
  return (
    <div className="min-h-screen bg-silverback text-white">
      <Nav />
      <Hero />
      <ProductsSection />
      <SiteProfileProduct />
      <TimeclockProduct />
      <BundleNote />
      <OrozcoCaseStudy />
      <AgencyFooter />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-midnight/70 border-b border-white/5">
      <div className="mx-auto max-w-6xl px-5 h-14 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5">
          <Logo className="w-7 h-7" />
          <div className="leading-tight">
            <div className="text-[15px] font-extrabold tracking-tight">Silverback</div>
            <div className="text-[10px] font-semibold tracking-[0.18em] uppercase text-silver/80 -mt-0.5">
              AI Agency
            </div>
          </div>
        </a>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-white/70">
          <a href="#site-profile" className="hover:text-white">Site + Profile</a>
          <a href="#timeclock" className="hover:text-white">Timeclock</a>
          <a href="#case" className="hover:text-white">Case study</a>
        </nav>
        <a
          href={`mailto:${AGENCY.email}?subject=${encodeURIComponent('Silverback tools — inquiry')}`}
          className="btn-silver inline-flex items-center gap-2 h-9 px-3.5 rounded-full text-xs font-bold"
        >
          <Mail size={14} /> Contact Bryan
        </a>
      </div>
    </header>
  );
}

function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect width="32" height="32" rx="8" fill="#0B1020" />
      <path
        d="M8 10 L16 6 L24 10 L24 18 C24 22 20 25 16 26 C12 25 8 22 8 18 Z"
        fill="none"
        stroke="#E8D9B0"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="15" r="2.5" fill="#E8D9B0" />
    </svg>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-5 pt-14 md:pt-20 pb-10 md:pb-14">
        <div className="inline-flex items-center gap-2 rounded-full border border-silver/30 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-silver">
          <Shield size={12} /> AI-assisted tools for field-service businesses
        </div>
        <h1 className="mt-5 text-4xl md:text-6xl font-black tracking-tight leading-[1.03] max-w-4xl">
          Small tools.
          <span className="text-silver"> Big leverage.</span>
          <br />
          Built for the crews that actually build things.
        </h1>
        <p className="mt-6 text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed">
          Silverback ships production software for contractors, landscapers, concrete crews and
          service businesses. Each tool is sold on its own. Use one. Use both. Stop juggling vendors.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a href="#products" className="btn-silver inline-flex items-center gap-2 h-12 px-5 rounded-xl text-base font-bold">
            See the tools <ArrowRight size={18} />
          </a>
          <a
            href={`mailto:${AGENCY.email}`}
            className="inline-flex items-center gap-2 h-12 px-5 rounded-xl text-base font-bold bg-white/10 hover:bg-white/15 transition text-white border border-white/15"
          >
            <Mail size={16} /> {AGENCY.email}
          </a>
        </div>
      </div>
    </section>
  );
}

function ProductsSection() {
  return (
    <section id="products" className="border-t border-white/5 bg-midnight-2/30">
      <div className="mx-auto max-w-6xl px-5 py-14 md:py-16">
        <div className="grid md:grid-cols-2 gap-5">
          <ProductSummary
            anchor="site-profile"
            tag="Tool 01"
            Icon={Globe}
            title="Site + Profile"
            subtitle="Website + Google Business Profile"
            oneLiner="Show up on Google and look like a real business. Done in a week."
            price="From $299 launch · $99/mo"
            accent="from-emerald-700 to-emerald-900"
          />
          <ProductSummary
            anchor="timeclock"
            tag="Tool 02"
            Icon={Clock}
            title="Timeclock"
            subtitle="Crew time tracking, payroll, CA compliance"
            oneLiner="PIN clock-in, live labor cost, payroll-ready CSV. No app to install."
            price="$199/mo · no setup fee"
            accent="from-indigo-700 to-indigo-900"
          />
        </div>
      </div>
    </section>
  );
}

function ProductSummary({
  anchor, tag, Icon, title, subtitle, oneLiner, price, accent,
}: {
  anchor: string;
  tag: string;
  Icon: typeof Globe;
  title: string;
  subtitle: string;
  oneLiner: string;
  price: string;
  accent: string;
}) {
  return (
    <a
      href={`#${anchor}`}
      className="card-glass group rounded-2xl p-6 flex flex-col hover:-translate-y-0.5 transition"
    >
      <div className={`relative h-28 -mx-6 -mt-6 mb-5 rounded-t-2xl overflow-hidden bg-gradient-to-br ${accent}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon size={56} className="text-white/85" />
        </div>
        <span className="absolute top-3 left-3 text-[10px] font-bold tracking-[0.14em] uppercase bg-black/30 backdrop-blur rounded-full px-2.5 py-1 text-white">
          {tag}
        </span>
      </div>
      <h3 className="text-2xl font-extrabold tracking-tight">{title}</h3>
      <div className="text-sm font-semibold text-silver mt-0.5">{subtitle}</div>
      <p className="mt-3 text-sm text-white/75 leading-relaxed flex-1">{oneLiner}</p>
      <div className="mt-5 flex items-center justify-between text-sm">
        <span className="font-bold text-white tabular">{price}</span>
        <span className="inline-flex items-center gap-1 font-semibold text-silver group-hover:gap-2 transition-all">
          Details <ArrowRight size={14} />
        </span>
      </div>
    </a>
  );
}

function SiteProfileProduct() {
  const features = [
    { Icon: Globe, title: 'One-page website', body: 'Bilingual, fast, mobile-first. Hosted on silverbackai.agency or a domain you own.' },
    { Icon: MapPin, title: 'Verified Google Business Profile', body: 'Categories, service area, hours, services list, opening post, attributes, photos plan — all loaded.' },
    { Icon: FileText, title: 'GBP starter pack document', body: '10-minute copy-paste onboarding. You own the profile; we set it up so you pass Google verification cleanly.' },
    { Icon: Phone, title: 'Call-tracking setup', body: 'Dedicated tracked number so we (and you) can measure which leads came from Google vs. referrals.' },
    { Icon: Building2, title: 'Ongoing updates', body: 'Photo swaps, copy updates, seasonal GBP posts, Bing + Apple Maps mirroring — included monthly.' },
    { Icon: Users, title: 'Bilingual content', body: 'Every page ships EN + ES. Hispanic homeowners search in Spanish; English owners search in English. Catch both.' },
  ];

  return (
    <section id="site-profile" className="border-t border-white/5">
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
        <ProductHeader
          tag="Tool 01"
          title="Site + Profile"
          subtitle="Your website + a verified Google Business Profile. Designed to show up on Google Maps and convert the phone calls that result."
        />

        <div className="mt-10 grid md:grid-cols-3 gap-4">
          {features.map(({ Icon, title, body }) => (
            <div key={title} className="card-glass rounded-2xl p-5">
              <div className="w-10 h-10 rounded-lg bg-silver/15 text-silver flex items-center justify-center">
                <Icon size={18} />
              </div>
              <h4 className="mt-4 text-base font-bold tracking-tight">{title}</h4>
              <p className="mt-1.5 text-sm text-white/70 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        <PriceCard
          tag="Site + Profile pricing"
          setup="$299"
          setupLabel="launch (one-time)"
          monthly="$99"
          monthlyLabel="/month"
          includes={[
            'One-page bilingual website',
            'Google Business Profile setup + verification',
            'Call-tracking phone number',
            'Monthly content/photo updates',
            'Bing Places + Apple Business mirroring',
          ]}
          primaryCta={{ label: 'Book Site + Profile', href: `mailto:${AGENCY.email}?subject=${encodeURIComponent('Site + Profile — booking')}` }}
          secondaryCta={{ label: 'See a live example', href: link('orozco/'), Icon: ArrowUpRight }}
        />
      </div>
    </section>
  );
}

function TimeclockProduct() {
  const features = [
    { Icon: Clock, title: 'PIN clock-in from any phone', body: 'No app install. Name, 4-digit PIN, clock running. Works on the crew\'s own phones.' },
    { Icon: MapPin, title: 'Job-site geofencing', body: 'Every punch is tied to a site. Per-site labor cost in real time on the owner dashboard.' },
    { Icon: Shield, title: 'CA Labor Code compliance', body: 'Missed meals, late meals, rest-break tracking, daily OT thresholds — flagged with the §-citation attached.' },
    { Icon: Users, title: 'Bilingual crew UI', body: 'Spanish for the crew, English for the owner. Same data, two audiences.' },
    { Icon: FileText, title: 'Payroll-ready CSV', body: 'Weekly export ready for QuickBooks, Gusto, ADP. No Sunday-night spreadsheets.' },
    { Icon: Building2, title: 'Owner report + audit trail', body: 'Who worked where, for how long, at what cost. Immutable audit log for Labor Board peace of mind.' },
  ];

  return (
    <section id="timeclock" className="border-t border-white/5 bg-midnight-2/30">
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
        <ProductHeader
          tag="Tool 02"
          title="Timeclock"
          subtitle="A time clock your crew will actually use. Know your labor cost by job, stay audit-clean, and get payroll-ready CSV every Sunday."
        />

        <div className="mt-10 grid md:grid-cols-3 gap-4">
          {features.map(({ Icon, title, body }) => (
            <div key={title} className="card-glass rounded-2xl p-5">
              <div className="w-10 h-10 rounded-lg bg-silver/15 text-silver flex items-center justify-center">
                <Icon size={18} />
              </div>
              <h4 className="mt-4 text-base font-bold tracking-tight">{title}</h4>
              <p className="mt-1.5 text-sm text-white/70 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        <PriceCard
          tag="Timeclock pricing"
          setup="$0"
          setupLabel="no setup fee"
          monthly="$199"
          monthlyLabel="/month · up to 10 crew"
          includes={[
            'PIN clock-in from any phone',
            'Live labor cost per job site',
            'CA Labor Code compliance alerts',
            'Payroll-ready CSV export',
            'Owner report + audit trail',
          ]}
          primaryCta={{ label: 'Book Timeclock', href: `mailto:${AGENCY.email}?subject=${encodeURIComponent('Timeclock — booking')}` }}
          secondaryCta={{ label: 'Run the live demo', href: link('timesheets/'), Icon: ArrowUpRight }}
        />
      </div>
    </section>
  );
}

function ProductHeader({ tag, title, subtitle }: { tag: string; title: string; subtitle: string }) {
  return (
    <div className="max-w-3xl">
      <div className="text-xs font-bold tracking-[0.18em] uppercase text-silver">{tag}</div>
      <h2 className="mt-2 text-4xl md:text-5xl font-black tracking-tight">{title}</h2>
      <p className="mt-4 text-lg text-white/75 leading-relaxed">{subtitle}</p>
    </div>
  );
}

function PriceCard({
  tag, setup, setupLabel, monthly, monthlyLabel, includes, primaryCta, secondaryCta,
}: {
  tag: string;
  setup: string;
  setupLabel: string;
  monthly: string;
  monthlyLabel: string;
  includes: string[];
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string; Icon: typeof ArrowUpRight };
}) {
  return (
    <div className="mt-10 grid lg:grid-cols-[1.1fr_1fr] gap-5">
      <div className="card-glass rounded-2xl p-7 relative overflow-hidden">
        <div className="absolute -top-14 -right-14 w-48 h-48 rounded-full bg-silver/10 blur-2xl pointer-events-none" />
        <div className="text-xs font-bold tracking-[0.18em] uppercase text-silver">{tag}</div>
        <div className="mt-3 flex flex-wrap items-baseline gap-6">
          <div>
            <div className="text-5xl font-black tabular">{setup}</div>
            <div className="text-xs text-white/55 font-semibold tracking-wider uppercase mt-0.5">{setupLabel}</div>
          </div>
          <div className="h-12 w-px bg-white/10" />
          <div>
            <div className="text-5xl font-black tabular">{monthly}</div>
            <div className="text-xs text-white/55 font-semibold tracking-wider uppercase mt-0.5">{monthlyLabel}</div>
          </div>
        </div>
        <div className="mt-7 flex flex-wrap gap-3">
          <a
            href={primaryCta.href}
            className="btn-silver inline-flex items-center gap-2 h-11 px-5 rounded-xl text-sm font-bold"
          >
            <Mail size={16} /> {primaryCta.label}
          </a>
          <a
            href={secondaryCta.href}
            target={secondaryCta.href.startsWith('http') || secondaryCta.href.startsWith(SITE_BASE) ? undefined : '_blank'}
            className="inline-flex items-center gap-2 h-11 px-5 rounded-xl text-sm font-bold bg-white/10 hover:bg-white/15 transition border border-white/15"
          >
            {secondaryCta.label} <secondaryCta.Icon size={14} />
          </a>
        </div>
      </div>

      <div className="card-glass rounded-2xl p-7">
        <h4 className="text-sm font-bold tracking-[0.12em] uppercase text-silver">What's included</h4>
        <ul className="mt-4 space-y-3">
          {includes.map((i) => (
            <li key={i} className="flex gap-2 text-sm text-white/85">
              <Check size={16} className="text-silver mt-0.5 shrink-0" />
              {i}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function BundleNote() {
  return (
    <section className="border-t border-white/5">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="rounded-2xl bg-silver text-midnight p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-5 justify-between">
          <div>
            <div className="text-[11px] font-bold tracking-[0.18em] uppercase text-midnight/70">Bundle</div>
            <div className="mt-1 text-xl md:text-2xl font-extrabold tracking-tight">
              Buy Timeclock — get Site + Profile free, as long as you're subscribed.
            </div>
            <div className="mt-1 text-sm text-midnight/75 max-w-2xl">
              $299 first month (Site + Profile launch) · $199/mo ongoing.
              Acquisition incentive for Timeclock buyers. Website + GBP retire if you cancel.
            </div>
          </div>
          <a
            href={`mailto:${AGENCY.email}?subject=${encodeURIComponent('Bundle — both tools')}`}
            className="inline-flex items-center gap-2 h-12 px-5 rounded-xl text-base font-bold bg-midnight text-white hover:bg-midnight-2 transition shrink-0"
          >
            <Mail size={16} /> Claim the bundle
          </a>
        </div>
      </div>
    </section>
  );
}

function OrozcoCaseStudy() {
  return (
    <section id="case" className="border-t border-white/5 bg-midnight-2/30">
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
        <div className="text-xs font-bold tracking-[0.18em] uppercase text-silver">Case study</div>
        <h2 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight">
          Orozco Landscaping · Sunnyvale, CA
        </h2>
        <p className="mt-4 max-w-3xl text-white/75 leading-relaxed text-lg">
          Miguel Orozco ran a 10-year landscaping and concrete business with zero online presence.
          No website, no Google Maps listing, no timeclock. Every lead came from word-of-mouth. We
          shipped the full stack in a week: bilingual site, verified GBP, and Timeclock with his
          crew pre-seeded. He answers the phone. We handle the rest.
        </p>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <CaseLink href={link('orozco/')} title="Live site" sub="The one-pager" />
          <CaseLink href={link('gbp.md')} title="GBP pack" sub="Copy-paste Google onboarding" />
          <CaseLink href={link('orozco/send/orozco-landscaping-EN.pdf')} title="Brochure EN" sub="Letter · 7 pages" download />
          <CaseLink href={link('orozco/send/orozco-landscaping-ES.pdf')} title="Folleto ES" sub="Carta · 7 páginas" download />
        </div>
      </div>
    </section>
  );
}

function CaseLink({
  href, title, sub, download,
}: { href: string; title: string; sub: string; download?: boolean }) {
  return (
    <a
      href={href}
      download={download}
      className="card-glass rounded-xl p-4 hover:bg-white/[0.06] transition flex items-start justify-between gap-3"
    >
      <div>
        <div className="text-sm font-bold">{title}</div>
        <div className="text-xs text-white/55 mt-0.5">{sub}</div>
      </div>
      <ArrowUpRight size={16} className="text-silver shrink-0 mt-1" />
    </a>
  );
}

function AgencyFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-midnight border-t border-white/5">
      <div className="mx-auto max-w-6xl px-5 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm">
        <div className="flex items-center gap-2.5">
          <Logo className="w-6 h-6" />
          <div className="leading-tight">
            <div className="text-white font-extrabold tracking-tight text-sm">{AGENCY.name}</div>
            <div className="text-white/50 text-[11px]">AI-assisted tools for field-service businesses</div>
          </div>
        </div>
        <div className="text-white/50 text-xs">
          <a href={`mailto:${AGENCY.email}`} className="hover:text-white/80">{AGENCY.email}</a>
        </div>
        <div className="text-white/40 text-xs">© {year} {AGENCY.short}.</div>
      </div>
    </footer>
  );
}
