import type { JobApplication } from './types'

export const mockJobs: JobApplication[] = [
  {
    id: '1',
    company: 'GIC',
    role: 'Software Engineer',
    status: 'applied',
    interviews: [],
    createdAt: new Date('2026-01-03').toISOString(),
  },
  {
    id: '2',
    company: 'Google',
    role: 'Senior Software Engineer',
    status: 'interview',
    notes: 'Interview on 2026-05-15',
    interviews: [
      {
        id: crypto.randomUUID(),
        date: new Date('2026-05-15').toISOString(),
        done: false,
      },
      {
        id: crypto.randomUUID(),
        date: new Date('2026-05-20').toISOString(),
        done: false,
      },
    ],
    createdAt: new Date('2026-01-02').toISOString(),
  },
  {
    id: '3',
    company: 'Amazon',
    role: 'Backend Engineer',
    status: 'offer',
    interviews: [],
    createdAt: new Date('2026-01-03').toISOString(),
  },
  {
    id: '4',
    company: 'Facebook',
    role: 'Frontend Engineer',
    status: 'applied',
    interviews: [],
    createdAt: new Date('2026-01-04').toISOString(),
  },
  {
    id: '5',
    company: 'Microsoft',
    role: 'Full Stack Engineer',
    status: 'rejected',
    interviews: [],
    createdAt: new Date('2026-01-05').toISOString(),
  },
]
