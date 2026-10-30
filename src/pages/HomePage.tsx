import { Suspense, use } from 'react'
import { loadStats, resetStats } from '@/features/dashboard/stats'
import { StatsCards } from '@/features/dashboard/components/StatsCards'
import { ErrorBoundary } from 'react-error-boundary'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/ErrorState'

export const HomePage = () => {
  return (
    <ErrorBoundary
      FallbackComponent={() => (
        <ErrorState
          title="Error loading dashbord!"
          onRetry={() => {
            resetStats()
            use(loadStats())
          }}
        ></ErrorState>
      )}
      onReset={resetStats}
    >
      <Suspense fallback={<Skeleton className="h-32 w-full rounded-xl" />}>
        <StatsCards></StatsCards>
      </Suspense>
    </ErrorBoundary>
  )
}
