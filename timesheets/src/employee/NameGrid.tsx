import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useStore } from '../lib/store';
import { Avatar } from '../ui/Avatar';
import { BrandHeader } from '../ui/BrandHeader';
import { COMPANY } from '../seed';

export function NameGrid() {
  const { employees } = useStore();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg flex flex-col safe-top safe-bottom">
      <div className="bg-white border-b border-border-light">
        <div className="px-5 h-14 flex items-center">
          <BrandHeader
            right={
              <span className="text-xs text-text-muted font-medium">{COMPANY.name}</span>
            }
          />
        </div>
      </div>

      <main className="flex-1 px-5 py-6 max-w-md mx-auto w-full">
        <h1 className="text-2xl font-bold text-text">¿Quién entra?</h1>
        <p className="text-sm text-text-muted mt-1">Toca tu nombre para comenzar.</p>

        <ul className="mt-6 bg-white rounded-lg border border-border overflow-hidden">
          {employees.map((e, i) => (
            <li key={e.id}>
              <button
                onClick={() => navigate(`/app/pin/${e.id}`)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-bg active:bg-border-light transition ${
                  i > 0 ? 'border-t border-border-light' : ''
                }`}
              >
                <Avatar name={e.name} size="lg" />
                <div className="flex-1 min-w-0">
                  <div className="text-base font-semibold text-text truncate">{e.name}</div>
                  <div className="text-xs text-text-muted">{e.role}</div>
                </div>
                <ChevronRight size={20} className="text-text-light shrink-0" />
              </button>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-center text-xs text-text-light">
          PIN de demo para todos: <span className="tabular font-semibold text-text-muted">0000</span>
        </p>
      </main>
    </div>
  );
}
