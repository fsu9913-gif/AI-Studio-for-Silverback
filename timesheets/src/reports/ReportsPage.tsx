import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  ShieldCheck,
  AlertTriangle,
  Clock4,
  UtensilsCrossed,
} from 'lucide-react';
import { BrandHeader } from '../ui/BrandHeader';
import { Button } from '../ui/Button';
import { Pill } from '../ui/Pill';
import {
  EMPLOYEES,
  JOB_SITES,
  WEEKLY_SHIFTS,
  COMPLIANCE_FLAGS,
  COMPANY,
} from '../seed';
import { formatHours, formatMoney } from '../lib/time';

type Tone = 'success' | 'warning' | 'danger' | 'neutral' | 'primary';

const SEVERITY_TONE: Record<'high' | 'medium' | 'low', Tone> = {
  high: 'danger',
  medium: 'warning',
  low: 'neutral',
};

export function ReportsPage() {
  const rows = EMPLOYEES.map((e) => {
    const hours = WEEKLY_SHIFTS.filter((s) => s.employeeId === e.id).reduce(
      (a, s) => a + s.hours,
      0,
    );
    const regular = Math.min(hours, 40);
    const ot = Math.max(hours - 40, 0);
    const pay = regular * e.hourlyRate + ot * e.hourlyRate * 1.5;
    return { employee: e, hours, regular, ot, pay };
  });

  const totalHours = rows.reduce((a, r) => a + r.hours, 0);
  const totalPay = rows.reduce((a, r) => a + r.pay, 0);
  const totalOtHours = rows.reduce((a, r) => a + r.ot, 0);

  const flagsBySeverity = {
    high: COMPLIANCE_FLAGS.filter((f) => f.severity === 'high').length,
    medium: COMPLIANCE_FLAGS.filter((f) => f.severity === 'medium').length,
    low: COMPLIANCE_FLAGS.filter((f) => f.severity === 'low').length,
  };

  const mealIssues = COMPLIANCE_FLAGS.filter((f) =>
    f.code.startsWith('MEAL'),
  ).length;
  const otEvents = COMPLIANCE_FLAGS.filter(
    (f) => f.code === 'OT_DAILY' || f.code === 'DT_DAILY',
  ).length;

  const downloadCsv = () => {
    window.alert(
      'CSV export available in production. Ships with QuickBooks-compatible columns.',
    );
  };

  return (
    <div className="min-h-screen bg-bg">
      <div className="bg-white border-b border-border-light">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center">
          <BrandHeader
            right={
              <nav className="flex items-center gap-5 text-sm">
                <Link to="/" className="text-text-muted hover:text-text font-medium">
                  Home
                </Link>
                <Link
                  to="/app"
                  className="text-text-muted hover:text-text font-medium"
                >
                  Crew demo
                </Link>
                <span className="text-primary font-semibold">Reports</span>
              </nav>
            }
          />
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-center gap-3 mb-2">
          <Link
            to="/"
            aria-label="Back"
            className="w-9 h-9 inline-flex items-center justify-center text-text-muted hover:text-text"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-text">
              Weekly report
            </h1>
            <p className="text-sm text-text-muted">
              {COMPANY.name} · Pay period Apr 15 – Apr 21, 2026
            </p>
          </div>
        </div>

        {/* Payroll block */}
        <section className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2 rounded-lg bg-white border border-border p-6">
            <div className="text-[11px] uppercase tracking-wide font-semibold text-text-muted mb-1">
              What you owe this week
            </div>
            <div className="flex items-baseline gap-3">
              <div className="tabular font-extrabold text-4xl md:text-5xl text-text">
                {formatMoney(totalPay)}
              </div>
              <Pill tone="success">Payroll-ready</Pill>
            </div>
            <div className="mt-2 text-sm text-text-muted">
              {formatHours(totalHours)} total · {formatHours(totalOtHours)} overtime ·{' '}
              {EMPLOYEES.length} crew members
            </div>
          </div>

          <div className="rounded-lg bg-white border border-border p-6 flex flex-col">
            <div className="text-[11px] uppercase tracking-wide font-semibold text-text-muted mb-1">
              Export
            </div>
            <p className="text-sm text-text-muted flex-1">
              CSV works with QuickBooks, ADP, and Gusto. One click; columns match
              the payroll import template.
            </p>
            <Button size="lg" full onClick={downloadCsv} className="mt-4">
              <Download size={16} /> Export CSV
            </Button>
          </div>
        </section>

        {/* Payroll table */}
        <section className="mt-4 rounded-lg bg-white border border-border overflow-hidden">
          <div className="px-5 py-3 flex items-center justify-between border-b border-border-light">
            <h2 className="text-sm font-semibold text-text">Payroll breakdown</h2>
            <span className="text-xs text-text-muted">
              {rows.length} employees
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-wide text-text-muted bg-bg">
                  <th className="text-left font-semibold px-5 py-2.5">Employee</th>
                  <th className="text-left font-semibold px-5 py-2.5">Role</th>
                  <th className="text-right font-semibold px-5 py-2.5">Regular</th>
                  <th className="text-right font-semibold px-5 py-2.5">OT</th>
                  <th className="text-right font-semibold px-5 py-2.5">Rate</th>
                  <th className="text-right font-semibold px-5 py-2.5">Pay</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr
                    key={r.employee.id}
                    className="border-t border-border-light"
                  >
                    <td className="px-5 py-3 font-semibold text-text">
                      {r.employee.name}
                    </td>
                    <td className="px-5 py-3 text-text-muted">
                      {r.employee.role}
                    </td>
                    <td className="px-5 py-3 text-right tabular text-text">
                      {r.regular.toFixed(2)} hr
                    </td>
                    <td className="px-5 py-3 text-right tabular">
                      {r.ot > 0 ? (
                        <span className="text-warning font-semibold">
                          {r.ot.toFixed(2)} hr
                        </span>
                      ) : (
                        <span className="text-text-light">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right tabular text-text-muted">
                      ${r.employee.hourlyRate.toFixed(2)}
                    </td>
                    <td className="px-5 py-3 text-right tabular font-semibold text-text">
                      {formatMoney(r.pay)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-border bg-bg">
                  <td colSpan={2} className="px-5 py-3 font-semibold text-text">
                    Total
                  </td>
                  <td className="px-5 py-3 text-right tabular font-semibold">
                    {(totalHours - totalOtHours).toFixed(2)} hr
                  </td>
                  <td className="px-5 py-3 text-right tabular font-semibold text-warning">
                    {totalOtHours.toFixed(2)} hr
                  </td>
                  <td />
                  <td className="px-5 py-3 text-right tabular font-extrabold text-text">
                    {formatMoney(totalPay)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        {/* Compliance block */}
        <section className="mt-10">
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-xl font-bold text-text">CA Labor Code audit</h2>
            <Pill tone="success">
              <ShieldCheck size={12} /> Active
            </Pill>
          </div>

          <div className="rounded-lg bg-primary-light border border-primary/20 p-4 flex items-start gap-3">
            <ShieldCheck className="text-primary mt-0.5 shrink-0" size={18} />
            <div className="text-sm text-primary-dark">
              Tracking <span className="font-semibold">§512</span> meal breaks ·{' '}
              <span className="font-semibold">§226.7</span> rest breaks ·{' '}
              <span className="font-semibold">§510</span> daily overtime. Flags
              fire the moment a rule trips. Every flag ships with the exact
              Labor Code citation for your records.
            </div>
          </div>

          <div className="mt-4 grid md:grid-cols-3 gap-4">
            <ComplianceTile
              icon={AlertTriangle}
              label="High-severity flags"
              value={flagsBySeverity.high}
              tone="danger"
            />
            <ComplianceTile
              icon={UtensilsCrossed}
              label="Meal-break issues"
              value={mealIssues}
              tone="warning"
            />
            <ComplianceTile
              icon={Clock4}
              label="Overtime events"
              value={otEvents}
              tone="warning"
            />
          </div>

          <div className="mt-4 rounded-lg bg-white border border-border overflow-hidden">
            <div className="px-5 py-3 border-b border-border-light">
              <h3 className="text-sm font-semibold text-text">Recent flags</h3>
            </div>
            <ul>
              {COMPLIANCE_FLAGS.map((f, i) => {
                const e = EMPLOYEES.find((x) => x.id === f.employeeId);
                const s = JOB_SITES.find((x) => x.id === f.siteId);
                return (
                  <li
                    key={f.id}
                    className={`px-5 py-3.5 flex items-start gap-4 ${
                      i > 0 ? 'border-t border-border-light' : ''
                    }`}
                  >
                    <Pill tone={SEVERITY_TONE[f.severity]}>{f.lawCite}</Pill>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-text">
                        {f.message}
                      </div>
                      <div className="text-xs text-text-muted mt-0.5">
                        {e?.name} · {s?.name} · {formatDate(f.date)}
                      </div>
                    </div>
                    <span className="text-[11px] uppercase tracking-wide font-semibold text-text-light shrink-0">
                      {f.severity}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <p className="mt-10 text-center text-xs text-text-light">
          Demo report. Production pulls live data from your crew's clock-ins.
        </p>
      </main>
    </div>
  );
}

function ComplianceTile({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof ShieldCheck;
  label: string;
  value: number;
  tone: 'danger' | 'warning' | 'neutral';
}) {
  const bg =
    tone === 'danger'
      ? 'bg-danger-light text-danger'
      : tone === 'warning'
      ? 'bg-warning-light text-warning'
      : 'bg-border-light text-text-muted';
  return (
    <div className="rounded-lg bg-white border border-border p-5 flex items-center gap-4">
      <span className={`w-10 h-10 rounded-md inline-flex items-center justify-center ${bg}`}>
        <Icon size={20} />
      </span>
      <div>
        <div className="tabular font-extrabold text-2xl text-text">{value}</div>
        <div className="text-xs text-text-muted font-medium">{label}</div>
      </div>
    </div>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso + 'T12:00:00');
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}
