export type Role = 'Capataz' | 'Cuadrilla';

export type Employee = {
  id: string;
  name: string;
  role: Role;
  hourlyRate: number;
};

export type JobSite = {
  id: string;
  name: string;
  client: string;
  address: string;
};

export const COMPANY = {
  name: 'Orosco Landscaping',
  slug: 'orosco',
  tagline: 'Oakland, CA',
};

export const EMPLOYEES: Employee[] = [
  { id: 'e1', name: 'Guadalajara', role: 'Capataz',   hourlyRate: 32 },
  { id: 'e2', name: 'Monterrey',   role: 'Cuadrilla', hourlyRate: 24 },
  { id: 'e3', name: 'Puebla',      role: 'Cuadrilla', hourlyRate: 22 },
  { id: 'e4', name: 'Oaxaca',      role: 'Cuadrilla', hourlyRate: 22 },
  { id: 'e5', name: 'Mérida',      role: 'Cuadrilla', hourlyRate: 22 },
];

export const JOB_SITES: JobSite[] = [
  { id: 's1', name: 'Woodside Residence', client: 'Henderson',       address: '1421 Kings Mountain Rd, Woodside, CA' },
  { id: 's2', name: 'Piedmont HOA',        client: 'Piedmont Board',  address: '400 Highland Ave, Piedmont, CA' },
  { id: 's3', name: 'Claremont Hotel',     client: 'Fairmont Props',  address: '41 Tunnel Rd, Berkeley, CA' },
  { id: 's4', name: 'Montclair Estate',    client: 'Yamamoto',        address: '6232 Moraga Ave, Oakland, CA' },
];

// Pre-populated fake weekly hours (for "Mis horas esta semana" + owner reports)
export const WEEKLY_SHIFTS: Array<{
  employeeId: string;
  date: string;
  siteId: string;
  hours: number;
}> = [
  // Guadalajara — 42.5 hr (2.5 OT)
  { employeeId: 'e1', date: '2026-04-15', siteId: 's1', hours: 8.5 },
  { employeeId: 'e1', date: '2026-04-16', siteId: 's2', hours: 8.2 },
  { employeeId: 'e1', date: '2026-04-17', siteId: 's3', hours: 8.6 },
  { employeeId: 'e1', date: '2026-04-18', siteId: 's4', hours: 8.8 },
  { employeeId: 'e1', date: '2026-04-19', siteId: 's1', hours: 8.4 },

  // Monterrey — 41.2 hr (1.2 OT)
  { employeeId: 'e2', date: '2026-04-15', siteId: 's1', hours: 8.0 },
  { employeeId: 'e2', date: '2026-04-16', siteId: 's2', hours: 8.1 },
  { employeeId: 'e2', date: '2026-04-17', siteId: 's3', hours: 8.3 },
  { employeeId: 'e2', date: '2026-04-18', siteId: 's4', hours: 8.2 },
  { employeeId: 'e2', date: '2026-04-19', siteId: 's1', hours: 8.6 },

  // Puebla — 39.8 hr (no OT)
  { employeeId: 'e3', date: '2026-04-15', siteId: 's1', hours: 8.0 },
  { employeeId: 'e3', date: '2026-04-16', siteId: 's1', hours: 7.9 },
  { employeeId: 'e3', date: '2026-04-17', siteId: 's2', hours: 8.0 },
  { employeeId: 'e3', date: '2026-04-18', siteId: 's3', hours: 8.0 },
  { employeeId: 'e3', date: '2026-04-19', siteId: 's3', hours: 7.9 },

  // Oaxaca — 36.5 hr
  { employeeId: 'e4', date: '2026-04-15', siteId: 's2', hours: 7.5 },
  { employeeId: 'e4', date: '2026-04-16', siteId: 's2', hours: 7.2 },
  { employeeId: 'e4', date: '2026-04-17', siteId: 's4', hours: 7.4 },
  { employeeId: 'e4', date: '2026-04-18', siteId: 's4', hours: 7.2 },
  { employeeId: 'e4', date: '2026-04-19', siteId: 's1', hours: 7.2 },

  // Mérida — 32.0 hr (part-week)
  { employeeId: 'e5', date: '2026-04-16', siteId: 's3', hours: 8.0 },
  { employeeId: 'e5', date: '2026-04-17', siteId: 's3', hours: 8.0 },
  { employeeId: 'e5', date: '2026-04-18', siteId: 's4', hours: 8.0 },
  { employeeId: 'e5', date: '2026-04-19', siteId: 's4', hours: 8.0 },
];

// Demo compliance flags — mocked; production app generates these from shift data.
export type ComplianceFlag = {
  id: string;
  employeeId: string;
  siteId: string;
  date: string;
  code:
    | 'MEAL_MISSED'
    | 'MEAL_SHORT'
    | 'MEAL_LATE'
    | 'REST_MISSED'
    | 'OT_DAILY'
    | 'DT_DAILY';
  severity: 'high' | 'medium' | 'low';
  lawCite: string;
  message: string;
};

export const COMPLIANCE_FLAGS: ComplianceFlag[] = [
  {
    id: 'f1',
    employeeId: 'e1',
    siteId: 's4',
    date: '2026-04-18',
    code: 'OT_DAILY',
    severity: 'medium',
    lawCite: '§510',
    message: '0.80 hr at 1.5× (over 8-hr daily)',
  },
  {
    id: 'f2',
    employeeId: 'e2',
    siteId: 's3',
    date: '2026-04-17',
    code: 'MEAL_LATE',
    severity: 'medium',
    lawCite: '§512',
    message: 'Meal break started after 5th hour',
  },
  {
    id: 'f3',
    employeeId: 'e4',
    siteId: 's2',
    date: '2026-04-15',
    code: 'REST_MISSED',
    severity: 'low',
    lawCite: '§226.7',
    message: '1 rest break not recorded',
  },
  {
    id: 'f4',
    employeeId: 'e1',
    siteId: 's3',
    date: '2026-04-17',
    code: 'OT_DAILY',
    severity: 'medium',
    lawCite: '§510',
    message: '0.60 hr at 1.5×',
  },
  {
    id: 'f5',
    employeeId: 'e5',
    siteId: 's3',
    date: '2026-04-16',
    code: 'MEAL_SHORT',
    severity: 'high',
    lawCite: '§512',
    message: 'Meal break only 22 min (30 required)',
  },
];

// PIN for demo: everyone is 0000.
export const DEMO_PIN = '0000';
