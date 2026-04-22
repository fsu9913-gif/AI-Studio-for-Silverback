import { Check, Globe, MapPin, Clock } from 'lucide-react';
import { Button } from '../ui/Button';

const INCLUDED = [
  { Icon: Clock,  title: 'Time Sheets app',          desc: 'PIN clock-in, live labor cost, CA Labor Code compliance, payroll-ready CSV.' },
  { Icon: Globe,  title: 'One-page website',          desc: 'Branded site at silverbackai.agency/your-name. Bilingual. Live in 48 hours.' },
  { Icon: MapPin, title: 'Google Business Profile',   desc: 'We set up + verify your Google listing so you show up on Maps. Photos, hours, reviews.' },
];

export function PricingTable() {
  const alert = (msg: string) => () => window.alert(msg);

  return (
    <section id="pricing" className="bg-bg">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="text-center mb-10">
          <div className="inline-flex text-xs font-semibold tracking-wide uppercase text-primary bg-primary-light rounded-full px-3 py-1 mb-3">
            Launch Pack
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text">
            One price. App, website, and Google listing — all in.
          </h2>
          <p className="mt-3 text-text-muted max-w-2xl mx-auto">
            Most field-service owners don't need three vendors. They need to show up on Google,
            run their crew, and get paid. That's the whole offer.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-6 max-w-5xl mx-auto">
          {/* Price card */}
          <div className="rounded-2xl bg-white border-2 border-primary shadow-sm p-8 relative">
            <div className="absolute -top-3 left-8 bg-primary text-white text-[10px] font-bold tracking-wide uppercase rounded-full px-3 py-1">
              Launch offer
            </div>
            <div className="text-sm font-bold tracking-widest text-primary uppercase">First month</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-6xl font-extrabold tabular text-text">$299</span>
              <span className="text-sm text-text-muted">one-time</span>
            </div>
            <p className="mt-1 text-sm text-text-muted">
              Website live · Google listing verified · crew + job sites seeded · bilingual training.
            </p>

            <div className="my-6 border-t border-border-light" />

            <div className="text-sm font-bold tracking-widest text-text-muted uppercase">Then</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-5xl font-extrabold tabular text-text">$199</span>
              <span className="text-sm text-text-muted">/month</span>
            </div>
            <p className="mt-1 text-sm text-text-muted">
              Up to 10 crew members. Website and Google Business Profile stay free as long as you're subscribed.
            </p>

            <div className="mt-7">
              <Button
                full
                size="lg"
                variant="primary"
                onClick={alert('Booking coming soon. Email bryan@silverbackai.agency to get set up tonight.')}
              >
                Claim your Launch Pack
              </Button>
            </div>

            <p className="mt-4 text-xs text-text-light">
              No contract. Cancel any time — you keep your data; the site and Google Profile retire.
            </p>
          </div>

          {/* What's included */}
          <div className="rounded-2xl bg-white border border-border p-8">
            <h3 className="text-lg font-bold text-text">What's included</h3>
            <ul className="mt-5 space-y-5">
              {INCLUDED.map(({ Icon, title, desc }) => (
                <li key={title} className="flex gap-3">
                  <span className="w-10 h-10 rounded-lg bg-primary-light text-primary flex items-center justify-center shrink-0">
                    <Icon size={18} />
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-text flex items-center gap-2">
                      {title}
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wide uppercase bg-success-light text-success rounded-full px-2 py-0.5">
                        <Check size={10} strokeWidth={3} /> Included
                      </span>
                    </div>
                    <div className="mt-0.5 text-sm text-text-muted leading-relaxed">{desc}</div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-lg bg-primary-light border border-primary/20 p-4 text-xs text-primary-dark">
              <span className="font-bold">Rev-share option:</span> growing fast? We can swap the flat
              $199/mo for 5% of net-new revenue above your baseline (capped at $500/mo). You pay less
              when the phone's quiet, we both win when it's busy.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
