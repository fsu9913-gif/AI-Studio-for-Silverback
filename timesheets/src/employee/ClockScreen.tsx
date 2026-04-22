import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, LogOut, Coffee, UtensilsCrossed, CupSoda, ArrowRight } from 'lucide-react';
import { useStore, type BreakKind } from '../lib/store';
import { Avatar } from '../ui/Avatar';
import { Pill } from '../ui/Pill';
import { Button } from '../ui/Button';
import { formatDuration, formatMoney } from '../lib/time';

export function ClockScreen() {
  const store = useStore();
  const {
    currentEmployeeId,
    employees,
    jobSites,
    shift,
    signOut,
    clockOut,
    startBreak,
    endBreak,
    activeBreak,
    takenBreaks,
  } = store;
  const navigate = useNavigate();
  const employee = employees.find((e) => e.id === currentEmployeeId) ?? null;

  useEffect(() => {
    if (!employee) navigate('/app', { replace: true });
    else if (!shift) navigate('/app/sites', { replace: true });
  }, [employee, shift, navigate]);

  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!employee || !shift) return null;

  const site = jobSites.find((s) => s.id === shift.jobSiteId);
  const openBreak = activeBreak();
  const taken = takenBreaks();

  // Live elapsed since clock-in (total time on the clock, incl. breaks — demo simplification)
  const elapsedMs = now - shift.clockInAt;
  const earningsToday = (elapsedMs / 3_600_000) * employee.hourlyRate;

  const onSignOut = () => {
    if (window.confirm('¿Salir sin terminar turno? Tu turno seguirá corriendo.')) {
      signOut();
      navigate('/app');
    }
  };

  const onClockOut = () => {
    if (!window.confirm('¿Terminar turno por hoy?')) return;
    const msg = `Turno terminado. ${formatDuration(elapsedMs)} trabajadas · ${formatMoney(earningsToday)}`;
    clockOut();
    navigate('/app');
    window.setTimeout(() => window.alert(msg), 50);
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col safe-top safe-bottom">
      <div className="bg-white border-b border-border-light">
        <div className="px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <Avatar name={employee.name} size="sm" />
            <div className="leading-tight truncate">
              <div className="text-sm font-semibold text-text truncate">{employee.name}</div>
              <div className="text-[11px] text-text-muted">{employee.role}</div>
            </div>
          </div>
          <button
            onClick={onSignOut}
            className="text-xs font-semibold text-text-muted hover:text-danger inline-flex items-center gap-1"
          >
            <LogOut size={14} /> Salir
          </button>
        </div>
      </div>

      <main className="flex-1 px-5 py-6 max-w-md mx-auto w-full flex flex-col">
        <StatusCard
          status={openBreak ? statusForBreak(openBreak) : 'Trabajando'}
          elapsedMs={elapsedMs}
          siteName={site?.name ?? 'Sitio desconocido'}
          tone={openBreak ? 'warning' : 'primary'}
        />

        <div className="mt-4 flex items-center justify-between text-xs text-text-muted px-1">
          <span>Hoy hasta ahora</span>
          <span className="tabular font-semibold text-text">{formatMoney(earningsToday)}</span>
        </div>

        <div className="mt-6 flex-1 flex flex-col justify-end gap-3">
          {openBreak ? (
            <Button size="xl" variant="warning" full onClick={endBreak}>
              Terminar descanso · Volver al trabajo <ArrowRight size={18} />
            </Button>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-2">
                <BreakButton
                  kind="break1"
                  taken={taken.has('break1')}
                  onClick={() => startBreak('break1')}
                />
                <BreakButton
                  kind="lunch"
                  taken={taken.has('lunch')}
                  onClick={() => startBreak('lunch')}
                />
                <BreakButton
                  kind="break2"
                  taken={taken.has('break2')}
                  onClick={() => startBreak('break2')}
                />
              </div>

              <Button size="xl" variant="danger" full onClick={onClockOut}>
                Terminar turno
              </Button>
            </>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/app/week"
            className="text-xs font-semibold text-primary hover:text-primary-dark"
          >
            Mis horas esta semana →
          </Link>
        </div>
      </main>
    </div>
  );
}

function StatusCard({
  status,
  elapsedMs,
  siteName,
  tone,
}: {
  status: string;
  elapsedMs: number;
  siteName: string;
  tone: 'primary' | 'warning';
}) {
  return (
    <div className="rounded-lg bg-white border border-border p-6 text-center">
      <div className="text-[11px] uppercase tracking-wide font-semibold text-text-muted mb-1">
        Estado
      </div>
      <Pill tone={tone}>{status}</Pill>
      <div className="mt-5 tabular font-mono font-bold text-5xl text-text">
        {formatDuration(elapsedMs)}
      </div>
      <div className="mt-4 flex items-center justify-center gap-2 text-sm text-text-muted">
        <MapPin size={14} className="text-text-light" />
        <span className="font-medium text-text">{siteName}</span>
      </div>
      <div className="mt-2 inline-flex">
        <Pill tone="success">✓ En el sitio</Pill>
      </div>
    </div>
  );
}

function BreakButton({
  kind,
  taken,
  onClick,
}: {
  kind: BreakKind;
  taken: boolean;
  onClick: () => void;
}) {
  const { label, Icon } = BREAK_META[kind];
  const isLunch = kind === 'lunch';

  const base = 'h-20 rounded-md font-semibold text-xs flex flex-col items-center justify-center gap-1 transition';
  const active = isLunch
    ? 'bg-warning-light border border-warning text-warning hover:brightness-95 active:brightness-90'
    : 'bg-white border border-border text-text hover:bg-bg active:bg-border-light';
  const disabledCls = 'bg-border-light border border-border text-text-light cursor-not-allowed';

  return (
    <button
      disabled={taken}
      onClick={onClick}
      className={`${base} ${taken ? disabledCls : active}`}
      aria-label={taken ? `${label} ya tomado` : `Iniciar ${label.toLowerCase()}`}
    >
      <Icon size={18} />
      <span>{label}</span>
      {taken && <span className="text-[10px] font-medium opacity-80">Tomado</span>}
    </button>
  );
}

const BREAK_META: Record<BreakKind, { label: string; Icon: typeof Coffee }> = {
  break1: { label: 'Descanso 1', Icon: Coffee },
  lunch:  { label: 'Almuerzo',   Icon: UtensilsCrossed },
  break2: { label: 'Descanso 2', Icon: CupSoda },
};

function statusForBreak(k: BreakKind): string {
  return k === 'lunch' ? 'En almuerzo' : 'En descanso';
}
