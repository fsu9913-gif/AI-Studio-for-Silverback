import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Delete } from 'lucide-react';
import { useStore } from '../lib/store';
import { Avatar } from '../ui/Avatar';
import { DEMO_PIN } from '../seed';

export function PinPad() {
  const { employeeId } = useParams();
  const { employees, signIn } = useStore();
  const navigate = useNavigate();
  const employee = employees.find((e) => e.id === employeeId);

  const [digits, setDigits] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [shaking, setShaking] = useState(false);

  useEffect(() => {
    if (!employee) navigate('/app', { replace: true });
  }, [employee, navigate]);

  useEffect(() => {
    if (digits.length === 4) {
      if (digits === DEMO_PIN) {
        signIn(employee!.id);
        navigate('/app/sites');
      } else {
        setError('Intenta de nuevo');
        setShaking(true);
        setTimeout(() => {
          setDigits('');
          setShaking(false);
        }, 550);
      }
    } else if (error) {
      setError(null);
    }
  }, [digits, employee, error, navigate, signIn]);

  if (!employee) return null;

  const onDigit = (d: string) => {
    if (digits.length >= 4) return;
    try {
      navigator.vibrate?.(5);
    } catch {
      /* noop */
    }
    setDigits((p) => p + d);
  };
  const onDelete = () => setDigits((p) => p.slice(0, -1));

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
          <span className="text-sm font-semibold text-text">Ingresa tu PIN</span>
        </div>
      </div>

      <main className="flex-1 flex flex-col items-center justify-between px-5 py-8 max-w-md mx-auto w-full">
        <div className="flex flex-col items-center gap-3">
          <Avatar name={employee.name} size="xl" />
          <div className="text-center">
            <div className="text-lg font-semibold text-text">{employee.name}</div>
            <div className="text-xs text-text-muted">{employee.role}</div>
          </div>
        </div>

        <div className={`flex gap-4 my-6 ${shaking ? 'shake' : ''}`}>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full border-2 ${
                digits.length > i
                  ? error
                    ? 'bg-danger border-danger'
                    : 'bg-primary border-primary'
                  : 'border-border'
              }`}
            />
          ))}
        </div>

        <div className="min-h-[20px] text-sm font-semibold">
          {error ? <span className="text-danger">{error}</span> : <span>&nbsp;</span>}
        </div>

        <div className="w-full max-w-xs mt-4 grid grid-cols-3 gap-3">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
            <KeypadButton key={d} onClick={() => onDigit(d)}>
              {d}
            </KeypadButton>
          ))}
          <div />
          <KeypadButton onClick={() => onDigit('0')}>0</KeypadButton>
          <KeypadButton onClick={onDelete} aria-label="Borrar último dígito">
            <Delete size={22} />
          </KeypadButton>
        </div>
      </main>
    </div>
  );
}

function KeypadButton({
  children,
  onClick,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      onClick={onClick}
      {...rest}
      className="h-16 rounded-md bg-white border border-border text-2xl font-semibold tabular text-text hover:bg-bg active:bg-border-light active:scale-[0.98] transition"
    >
      {children}
    </button>
  );
}
