import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, ChevronRight } from 'lucide-react';
import { useStore } from '../lib/store';
import { Avatar } from '../ui/Avatar';

export function SitePicker() {
  const { currentEmployeeId, employees, jobSites, clockIn, shift } = useStore();
  const navigate = useNavigate();
  const employee = employees.find((e) => e.id === currentEmployeeId) ?? null;

  useEffect(() => {
    if (!employee) {
      navigate('/app', { replace: true });
    } else if (shift) {
      // resume in-progress shift
      navigate('/app/clock', { replace: true });
    }
  }, [employee, shift, navigate]);

  if (!employee) return null;

  const onPick = (siteId: string) => {
    clockIn(siteId);
    navigate('/app/clock');
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col safe-top safe-bottom">
      <div className="bg-white border-b border-border-light">
        <div className="px-5 h-14 flex items-center gap-3">
          <Link
            to="/app"
            aria-label="Atrás"
            className="w-9 h-9 inline-flex items-center justify-center text-text-muted hover:text-text"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="flex items-center gap-2 min-w-0">
            <Avatar name={employee.name} size="sm" />
            <div className="leading-tight truncate">
              <div className="text-sm font-semibold text-text truncate">{employee.name}</div>
              <div className="text-[11px] text-text-muted">{employee.role}</div>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 px-5 py-6 max-w-md mx-auto w-full">
        <h1 className="text-2xl font-bold text-text">¿Dónde estás trabajando?</h1>
        <p className="text-sm text-text-muted mt-1">
          Elige el sitio de trabajo.
        </p>

        <ul className="mt-6 bg-white rounded-lg border border-border overflow-hidden">
          {jobSites.map((s, i) => (
            <li key={s.id}>
              <button
                onClick={() => onPick(s.id)}
                className={`w-full flex items-start gap-3 px-4 py-4 text-left hover:bg-bg active:bg-border-light transition ${
                  i > 0 ? 'border-t border-border-light' : ''
                }`}
              >
                <span className="mt-0.5 w-9 h-9 rounded-md bg-primary-light text-primary inline-flex items-center justify-center shrink-0">
                  <MapPin size={16} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-base font-semibold text-text">{s.name}</div>
                  <div className="text-xs text-text-muted">{s.client}</div>
                  <div className="text-xs text-text-light mt-0.5 truncate">{s.address}</div>
                </div>
                <ChevronRight size={20} className="text-text-light mt-2 shrink-0" />
              </button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
