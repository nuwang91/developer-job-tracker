import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { use } from 'react'
import { loadStats } from '@/features/dashboard/stats'
import type { DashboardStats } from '@/features/dashboard/types'

type StatType = keyof DashboardStats

const getStatLabel = (statType: StatType): string => {
  switch (statType) {
    case 'appliedCount':
      return 'Applied count'
    case 'interviewCount':
      return 'Interview count'
    case 'offerCount':
      return 'Offer count'
    case 'pendingInterviews':
      return 'Pending interviews count'
    case 'rejectedCount':
      return 'Rejected count'
    case 'totalApplications':
      return 'Total applications'
    default: {
      const _exhaustive: never = statType
      return _exhaustive
    }
  }
}

export const StatsCards = () => {
  const stats = use(loadStats())
  return (
    <>
      {Object.keys(stats).map((key) => {
        return (
          <div key={key} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Card>
              <CardHeader>
                <CardDescription>{getStatLabel(key as StatType)}</CardDescription>
                <CardTitle className="text-3xl tabular-nums">{stats[key as StatType]}</CardTitle>
              </CardHeader>
            </Card>
          </div>
        )
      })}
    </>
  )
}
