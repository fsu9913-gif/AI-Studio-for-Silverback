import { Smartphone, DollarSign, Scale, Globe, MapPin, Clock } from 'lucide-react';

const BUNDLE = [
  {
    icon: Clock,
    title: 'Time Sheets app',
    body:
      'PIN clock-in, live labor cost, CA Labor Code compliance, payroll-ready CSV. The paid core.',
    price: '$199/mo',
  },
  {
    icon: Globe,
    title: 'One-page website',
    body:
      'A branded, bilingual site live in 48 hours. Hosted on silverbackai.agency. Stays free as long as you subscribe.',
    price: 'Free',
  },
  {
    icon: MapPin,
    title: 'Google Business Profile',
    body:
      "We set up + verify your Google listing so customers find you on Maps. Photos, hours, reviews — all loaded.",
    price: 'Free',
  },
];

const FEATURES = [
  {
    icon: Smartphone,
    title: 'Clock in from any phone',
    body:
      'No apps to install, no passwords to remember. A name, a 4-digit PIN, and the clock is running.',
  },
  {
    icon: DollarSign,
    title: 'Know what you owe this week',
    body:
      'Live labor cost per job site, regular vs. overtime, payroll-ready totals. No spreadsheets on Sunday night.',
  },
  {
    icon: Scale,
    title: 'CA Labor Code, handled',
    body:
      'Missed meal breaks, rest breaks, overtime thresholds — flagged the moment they happen, with the §-citation attached.',
  },
];

export function Features() {
  return (
    <section className="bg-white border-y border-border-light">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex text-xs font-semibold tracking-wide uppercase text-primary bg-primary-light rounded-full px-3 py-1 mb-3">
            Launch Pack · Everything you need to show up online
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text">
            Three tools. One subscription. Bundled free.
          </h2>
          <p className="mt-3 text-text-muted max-w-xl mx-auto">
            Most field-service owners need a crew app, a website, and a Google listing. We ship all three together so you don't juggle vendors.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mb-14">
          {BUNDLE.map((f) => (
            <div key={f.title} className="rounded-xl border border-border p-6 relative">
              <span className="absolute top-4 right-4 text-[10px] font-bold tracking-wider uppercase bg-primary text-white rounded-full px-2.5 py-1">
                {f.price}
              </span>
              <div className="w-10 h-10 rounded-md bg-primary-light text-primary inline-flex items-center justify-center mb-4">
                <f.icon size={20} />
              </div>
              <h3 className="text-lg font-semibold text-text mb-1.5">{f.title}</h3>
              <p className="text-sm text-text-muted leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex text-xs font-semibold tracking-wide uppercase text-primary bg-primary-light rounded-full px-3 py-1 mb-3">
            Why crews use it
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-text">
            Built for the field, not the office.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-lg border border-border p-6">
              <div className="w-10 h-10 rounded-md bg-primary-light text-primary inline-flex items-center justify-center mb-4">
                <f.icon size={20} />
              </div>
              <h3 className="text-lg font-semibold text-text mb-1.5">{f.title}</h3>
              <p className="text-sm text-text-muted leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
