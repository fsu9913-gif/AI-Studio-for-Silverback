import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Employee, JobSite } from '../seed';
import { EMPLOYEES, JOB_SITES } from '../seed';

export type BreakKind = 'break1' | 'lunch' | 'break2';

export type ActiveShift = {
  employeeId: string;
  jobSiteId: string;
  clockInAt: number; // epoch ms
  breaks: Array<{ kind: BreakKind; startAt: number; endAt: number | null }>;
};

type StoreState = {
  currentEmployeeId: string | null;
  shift: ActiveShift | null;
};

type StoreApi = StoreState & {
  employees: Employee[];
  jobSites: JobSite[];
  signIn: (employeeId: string) => void;
  signOut: () => void;
  clockIn: (jobSiteId: string) => void;
  clockOut: () => void;
  startBreak: (kind: BreakKind) => void;
  endBreak: () => void;
  activeBreak: () => BreakKind | null;
  takenBreaks: () => Set<BreakKind>;
};

const StoreCtx = createContext<StoreApi | null>(null);

const LS_KEY = 'timesheets.demo.state.v1';

function loadState(): StoreState {
  if (typeof window === 'undefined') return { currentEmployeeId: null, shift: null };
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return { currentEmployeeId: null, shift: null };
    const parsed = JSON.parse(raw) as StoreState;
    return {
      currentEmployeeId: parsed.currentEmployeeId ?? null,
      shift: parsed.shift ?? null,
    };
  } catch {
    return { currentEmployeeId: null, shift: null };
  }
}

function saveState(s: StoreState) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(LS_KEY, JSON.stringify(s));
  } catch {
    // ignore quota errors in prototype
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StoreState>(() => loadState());

  useEffect(() => {
    saveState(state);
  }, [state]);

  const api = useMemo<StoreApi>(() => {
    const activeBreak = (): BreakKind | null => {
      if (!state.shift) return null;
      const open = state.shift.breaks.find((b) => b.endAt === null);
      return open ? open.kind : null;
    };

    const takenBreaks = (): Set<BreakKind> => {
      const set = new Set<BreakKind>();
      state.shift?.breaks.forEach((b) => set.add(b.kind));
      return set;
    };

    return {
      ...state,
      employees: EMPLOYEES,
      jobSites: JOB_SITES,
      signIn: (employeeId) =>
        setState({ currentEmployeeId: employeeId, shift: null }),
      signOut: () => setState({ currentEmployeeId: null, shift: null }),
      clockIn: (jobSiteId) =>
        setState((s) =>
          !s.currentEmployeeId
            ? s
            : {
                ...s,
                shift: {
                  employeeId: s.currentEmployeeId,
                  jobSiteId,
                  clockInAt: Date.now(),
                  breaks: [],
                },
              },
        ),
      clockOut: () => setState((s) => ({ ...s, shift: null })),
      startBreak: (kind) =>
        setState((s) => {
          if (!s.shift) return s;
          // prevent duplicate break kinds and concurrent breaks
          if (s.shift.breaks.some((b) => b.kind === kind)) return s;
          if (s.shift.breaks.some((b) => b.endAt === null)) return s;
          return {
            ...s,
            shift: {
              ...s.shift,
              breaks: [...s.shift.breaks, { kind, startAt: Date.now(), endAt: null }],
            },
          };
        }),
      endBreak: () =>
        setState((s) => {
          if (!s.shift) return s;
          return {
            ...s,
            shift: {
              ...s.shift,
              breaks: s.shift.breaks.map((b) =>
                b.endAt === null ? { ...b, endAt: Date.now() } : b,
              ),
            },
          };
        }),
      activeBreak,
      takenBreaks,
    };
  }, [state]);

  return React.createElement(StoreCtx.Provider, { value: api }, children);
}

export function useStore(): StoreApi {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
