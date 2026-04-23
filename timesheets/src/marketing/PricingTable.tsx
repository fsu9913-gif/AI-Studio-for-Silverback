import { Check, Plus } from 'lucide-react';
import { Button } from '../ui/Button';

const INCLUDED = [
  'PIN clock-in from any phone',
  'Live labor cost per job site',
  'Job-site geofencing + attribution',
  'CA Labor Code compliance alerts',
  'Payroll-ready CSV (QuickBooks / Gusto / ADP)',
  'Immutable audit trail',
  'Bilingual crew UI (EN / ES)',
  'Owner dashboard + reports',
];

export function PricingTable() {
  const alert = (msg: string) => () => window.alert(msg);

  return (
    <section id="pricing" className="bg-bg">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="text-center mb-10">
          <div className="inline-flex text-xs font-semibold tracking-wide uppercase text-primary bg-primary-light rounded-full px-3 py-1 mb-3">
            Pricing
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text">
            One plan. No seat math. No setup fee.
          </h2>
          <p className="mt-3 text-text-muted max-w-xl mx-auto">
            Flat monthly. Up to 10 crew members included. Scale up as you grow.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-6 max-w-5xl mx-auto">
          <div className="rounded-2xl bg-white border-2 border-primary shadow-sm p-8 relative">
            <div className="absolute -top-3 left-8 bg-primary text-white text-[10px] font-bold tracking-wide uppercase rounded-full px-3 py-1">
              Timeclock
            </div>
            <div className="text-sm font-bold tracking-widest text-primary uppercase">Monthly</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-6xl font-extrabold tabular text-text">$199</span>
              <span className="text-sm text-text-muted">/month</span>
            </div>
            <p className="mt-2 text-sm text-text-muted">
              Up to 10 crew members. Additional seats $15/mo each. No setup fee, no contract.
            </p>

            <div className="mt-7">
              <Button
                full
                size="lg"
                variant="primary"
                onClick={alert('Email bryan@silverbackai.agency to get set up.')}
              >
                Start Timeclock
              </Button>
            </div>

            <p className="mt-4 text-xs text-text-light">
              Cancel any time. Your data exports cleanly; no hostage-taking.
            </p>

            <div className="mt-6 rounded-lg bg-primary-light border border-primary/20 p-4 text-xs text-primary-dark">
              <div className="flex items-start gap-2">
                <Plus size={14} className="shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Bundle offer:</span> add Silverback's <span className="font-semibold">Site + Profile</span> (website + Google Business Profile) for free — we throw it in as long as you're a Timeclock subscriber. $299 one-time launch fee still applies for the site build.
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-border p-8">
            <h3 className="text-lg font-bold text-text">What's included</h3>
            <ul className="mt-5 space-y-3">
              {INCLUDED.map((i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-text">
                  <span className="mt-0.5 inline-flex w-5 h-5 rounded-full bg-primary-light text-primary items-center justify-center shrink-0">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  {i}
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-lg bg-bg border border-border-light p-4 text-xs text-text-muted leading-relaxed">
              <span className="font-bold text-text">Rev-share option:</span> trade the flat $199 for 5% of net-new revenue above your current baseline (capped $500/mo). Pays less when the phone's quiet; we both win when it's busy.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
