import fs from 'fs';
import path from 'path';

const csvPath = path.resolve('../designs/Users.csv');
const raw = fs.readFileSync(csvPath, 'utf8');
const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

const dataLines = lines[0].toLowerCase().includes('login') ? lines.slice(1) : lines;

const users = dataLines.map((email, idx) => {
  const cleanEmail = email.trim();
  const [local, domain = ''] = cleanEmail.toLowerCase().split('@');
  const parts = local.split(/[._-]/);
  const firstName = parts[0] ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1) : '';
  const lastName = parts[1] ? parts[1].charAt(0).toUpperCase() + parts[1].slice(1) : '';
  const fullName = [firstName, lastName].filter(Boolean).join(' ') || local;

  let subsidiary = 'Transcorp Group HQ';
  if (domain.includes('power')) {
    subsidiary = 'Transcorp Power Plc';
  } else if (domain.includes('hotel')) {
    subsidiary = 'Transcorp Hotels Plc';
  }

  const initials = fullName
    .split(' ')
    .map(p => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'TR';

  return {
    id: 'TRC-' + String(idx + 1).padStart(3, '0'),
    fullName,
    email: cleanEmail,
    subsidiary,
    defaultRole: 'Learner',
    avatar: initials,
    department: subsidiary === 'Transcorp Power Plc' ? 'Generation & Plant Engineering' :
                subsidiary === 'Transcorp Hotels Plc' ? 'Guest Experience & Hospitality' : 'Strategy & Corporate Governance'
  };
});

const tsContent = `/* Auto-generated from designs/Users.csv - Transcorp Group Workforce */

export interface TranscorpLearner {
  id: string;
  fullName: string;
  email: string;
  subsidiary: string;
  defaultRole: 'Learner';
  avatar: string;
  department: string;
}

export const TRANSCORP_SUBSIDIARIES = [
  'ALL Transcorp Group (All Subsidiaries)',
  'Transcorp Power Plc',
  'Transcorp Hotels Plc',
  'Transcorp Group HQ',
  'Transafam Power Limited',
  'Ughelli Power Plc',
] as const;

export type TranscorpSubsidiary = typeof TRANSCORP_SUBSIDIARIES[number];

export const TRANSCORP_LEARNERS: TranscorpLearner[] = ${JSON.stringify(users, null, 2)};

export function searchLearners(query: string, subsidiaryFilter?: string): TranscorpLearner[] {
  const q = query.trim().toLowerCase();
  return TRANSCORP_LEARNERS.filter((l) => {
    const matchesQuery =
      !q ||
      l.fullName.toLowerCase().includes(q) ||
      l.email.toLowerCase().includes(q) ||
      l.id.toLowerCase().includes(q);
    const matchesSub =
      !subsidiaryFilter ||
      subsidiaryFilter.startsWith('ALL') ||
      l.subsidiary.toLowerCase().includes(subsidiaryFilter.toLowerCase());
    return matchesQuery && matchesSub;
  });
}

export function getLearnerByEmail(email: string): TranscorpLearner | undefined {
  return TRANSCORP_LEARNERS.find(
    (l) => l.email.toLowerCase() === email.trim().toLowerCase()
  );
}

export function getLearnerById(id: string): TranscorpLearner | undefined {
  return TRANSCORP_LEARNERS.find((l) => l.id === id);
}
`;

fs.mkdirSync('./src/data', { recursive: true });
fs.writeFileSync('./src/data/transcorpUsers.ts', tsContent, 'utf8');
console.log('Successfully wrote transcorpUsers.ts with', users.length, 'users!');
