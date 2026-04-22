import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 pt-16 pb-20 md:pt-24 md:pb-28 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-primary-light text-primary-dark rounded-full px-3 py-1 text-xs font-semibold mb-5">
            <ShieldCheck size={14} /> CA Labor Code compliance built in
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-[1.08] text-text tracking-tight">
            The time clock your crew actually wants to use.
          </h1>
          <p className="mt-5 text-lg text-text-muted max-w-xl">
            Built for field-service teams in California. Clock in from any phone. Stay
            audit-clean without thinking about it.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/app">
              <Button size="lg">
                Try the crew demo <ArrowRight size={18} />
              </Button>
            </Link>
            <Link to="/reports">
              <Button size="lg" variant="secondary">
                See the owner report
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-xs text-text-light">
            Demo PIN for every crew member: <span className="tabular font-semibold text-text-muted">0000</span>
          </p>
        </div>

        <PhoneMock />
      </div>
    </section>
  );
}

function PhoneMock() {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="rounded-[2.5rem] border-[10px] border-navy-dark bg-navy-dark shadow-xl p-0 overflow-hidden aspect-[393/852] mx-auto">
        <div className="h-full w-full bg-bg flex flex-col">
          <div className="bg-white px-5 py-4 flex items-center justify-between border-b border-border-light">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-navy text-white text-xs font-semibold flex items-center justify-center">
                G
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold">Guadalajara</div>
                <div className="text-[11px] text-text-muted">Capataz</div>
              </div>
            </div>
            <span className="text-xs text-primary font-semibold">Trabajando</span>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center px-5">
            <div className="text-xs text-text-muted mb-1 uppercase tracking-wide">
              Piedmont HOA
            </div>
            <div className="tabular font-mono font-semibold text-5xl text-text">
              04:17:32
            </div>
            <div className="mt-3 inline-flex items-center gap-1.5 bg-success-light text-success rounded-full px-2.5 py-1 text-[11px] font-semibold">
              ✓ En el sitio
            </div>
          </div>

          <div className="p-5 space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <div className="h-11 rounded-md border border-border bg-white text-xs font-semibold text-text-muted flex items-center justify-center">
                Descanso 1
              </div>
              <div className="h-11 rounded-md bg-warning-light border border-warning text-warning text-xs font-semibold flex items-center justify-center">
                Almuerzo
              </div>
              <div className="h-11 rounded-md border border-border bg-white text-xs font-semibold text-text-muted flex items-center justify-center">
                Descanso 2
              </div>
            </div>
            <div className="h-12 rounded-md bg-danger text-white text-sm font-semibold flex items-center justify-center">
              Terminar turno
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
