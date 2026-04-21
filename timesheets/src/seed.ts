export type Employee = {
  id: string;
  name: string;
  role: 'Owner' | 'Foreman' | 'Crew';
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
  { id: 'e1', name: 'Miguel Orosco',  role: 'Owner',   hourlyRate: 35 },
  { id: 'e2', name: 'Juan Ramirez',   role: 'Foreman', hourlyRate: 28 },
  { id: 'e3', name: 'Luis Hernandez', role: 'Crew',    hourlyRate: 22 },
  { id: 'e4', name: 'Carlos Mendez',  role: 'Crew',    hourlyRate: 22 },
];

export const JOB_SITES: JobSite[] = [
  { id: 's1', name: 'Woodside Residence', client: 'Henderson',       address: '1421 Kings Mountain Rd, Woodside, CA' },
  { id: 's2', name: 'Piedmont HOA',        client: 'Piedmont Board',  address: '400 Highland Ave, Piedmont, CA' },
  { id: 's3', name: 'Claremont Hotel',     client: 'Fairmont Props',  address: '41 Tunnel Rd, Berkeley, CA' },
  { id: 's4', name: 'Montclair Estate',    client: 'Yamamoto',        address: '6232 Moraga Ave, Oakland, CA' },
];

// Pre-populated fake weekly hours (for "My hours this week" polish screen)
export const WEEKLY_SHIFTS: Array<{
  employeeId: string;
  date: string; // ISO yyyy-mm-dd
  siteId: string;
  hours: number;
}> = [
  { employeeId: 'e1', date: '2026-04-15', siteId: 's1', hours: 8.1 },
  { employeeId: 'e1', date: '2026-04-16', siteId: 's2', hours: 7.8 },
  { employeeId: 'e1', date: '2026-04-17', siteId: 's3', hours: 8.4 },
  { employeeId: 'e1', date: '2026-04-18', siteId: 's4', hours: 6.2 },
  { employeeId: 'e2', date: '2026-04-15', siteId: 's1', hours: 8.0 },
  { employeeId: 'e2', date: '2026-04-16', siteId: 's2', hours: 8.0 },
  { employeeId: 'e3', date: '2026-04-15', siteId: 's1', hours: 8.2 },
  { employeeId: 'e4', date: '2026-04-15', siteId: 's1', hours: 7.9 },
];

// PIN for demo: everyone is 0000. Real app stores bcrypt hashes.
export const DEMO_PIN = '0000';
