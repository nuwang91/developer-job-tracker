import { getJobs } from '@/features/jobs/api'
import type { DashboardStats } from '@/features/dashboard/types'

export const getDashboardStats = (): Promise<DashboardStats> => {
  return getJobs().then((jobs) => {
    const stats: DashboardStats = {
      totalApplications: jobs.length,
      offerCount: jobs.filter((job) => job.status === 'offer').length,
      interviewCount: jobs.filter((job) => job.status === 'interview').length,
      appliedCount: jobs.filter((job) => job.status === 'applied').length,
      rejectedCount: jobs.filter((job) => job.status === 'rejected').length,
      pendingInterviews: jobs
        .map((job) => job.interviews.filter((i) => !i.done).length)
        .reduce((sum, number) => {
          return sum + number
        }, 0),
    }

    return stats
  })
}
