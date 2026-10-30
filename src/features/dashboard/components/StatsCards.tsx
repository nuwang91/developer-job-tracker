import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { use } from 'react'
import { loadStats } from '@/features/dashboard/stats'
import { STATS } from '@/features/dashboard/types'
import { StatsGrid } from '@/features/dashboard/components/StatsGrid'

export const StatsCards = () => {
  const stats = use(loadStats())
  return (
    <StatsGrid>
      {STATS.map(({ key, label }) => {
        return (
          <Card key={key}>
            <CardHeader>
              <CardDescription>{label}</CardDescription>
              <CardTitle className="text-3xl tabular-nums">{stats[key]}</CardTitle>
            </CardHeader>
          </Card>
        )
      })}
    </StatsGrid>
  )
}
