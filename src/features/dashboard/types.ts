export interface DashboardStats {
  totalApplications: number
  pendingInterviews: number
  appliedCount: number
  interviewCount: number
  offerCount: number
  rejectedCount: number
}

type StatType = keyof DashboardStats

export const STATS: { key: StatType; label: string }[] = [
  { key: 'appliedCount', label: 'Applied' },
  { key: 'interviewCount', label: 'Interview' },
  { key: 'offerCount', label: 'Offer' },
  { key: 'pendingInterviews', label: 'Upcoming interviews' },
  { key: 'rejectedCount', label: 'Rejected' },
  { key: 'totalApplications', label: 'Total applications' },
]
