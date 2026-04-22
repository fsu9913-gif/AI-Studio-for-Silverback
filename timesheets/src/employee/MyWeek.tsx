import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';
import { useStore } from '../lib/store';
import { WEEKLY_SHIFTS, JOB_SITES } from '../seed';
import { formatHours, formatMoney } from '../lib/time';

export function MyWeek() {
  const { currentEmployeeId, employees } = useStore();
  const navigate = useNavigate();
  const employee = employees.find((e) => e.id === currentEmployeeId) ?? null;

  useEffect(() => {
    if (!employee) navigate('/app', { replace: true });
  }, [employee, navigate]);
  if (!employee) return null;

  const myShifts = WEEKLY_SHIFTS.filter((s) => s.employeeId === employee.id);
  const totalHours = myShifts.reduce((acc, s) => acc + s.hours, 0);
  const regularHours = Math.min(totalHours, 40);
  const otHours = Math.max(totalHours - 40, 0);
  const earnings = regularHours * employee.hourlyRate + otHours * employee.hourlyRate * 1.5;

  return (
    <div className="min-h-screen bg-bg flex flex-col safe-top safe-bottom">
      <div className="bg-white border-b border-border-light">
        <div className="px-5 h-14 flex items-center gap-3">
          <Link
            to="/app/clock"
            aria-label="Atrás"
            className="w-9 h-9 inline-flex items-center justify-center text-text-muted hover:text-text"
          >
            <ArrowLeft size={18} />
          </Link>
          <span className="text-sm font-semibold text-text">Mis horas esta semana</span>
        </div>
      </div>

      <main className="flex-1 px-5 py-6 max-w-md mx-auto w-full">
        <div className="grid grid-cols-2 gap-3">
          <Stat label="Horas totales" value={formatHours(totalHours)} />
          <Stat label="Pago est." value={formatMoney(earnings)} />
          <Stat label="Regulares" value={formatHours(regularHours)} />
          <Stat label="Tiempo extra" value={formatHours(otHours)} />
        </div>

        <h2 className="mt-8 mb-3 text-sm font-semibold uppercase tracking-wide text-text-muted">
          Turnos recientes
        </h2>
        <ul className="bg-white rounded-lg border border-border overflow-hidden">
          {myShifts.length === 0 && (
            <li className="px-4 py-6 text-sm text-text-muted text-center">
              No hay turnos esta semana.
            </li>
          )}
          {myShifts.map((s, i) => {
            const site = JOB_SITES.find((j) => j.id === s.siteId);
            return (
              <li
                key={`${s.date}-${s.siteId}`}
                className={`px-4 py-3 flex items-center justify-between ${
                  i > 0 ? 'border-t border-border-light' : ''
                }`}
              >
                <div>
                  <div className="text-sm font-semibold text-text">{site?.name}</div>
                  <div className="text-xs text-text-muted">{formatDate(s.date)}</div>
                </div>
                <div className="tabular font-semibold text-text">{s.hours.toFixed(2)} hr</div>
              </li>
            );
          })}
        </ul>

        <p className="mt-6 text-center text-xs text-text-light">
          Datos de demo. La app real toma los datos de tu registro en vivo.
        </p>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white border border-border p-4">
      <div className="text-[11px] uppercase tracking-wide font-semibold text-text-muted">
        {label}
      </div>
      <div className="mt-1 text-xl font-bold tabular text-text">{value}</div>
    </div>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso + 'T12:00:00');
  return d.toLocaleDateString('es-MX', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}
