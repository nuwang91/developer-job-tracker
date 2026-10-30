import { Suspense } from 'react'
import { resetStats } from '@/features/dashboard/stats'
import { StatsCards } from '@/features/dashboard/components/StatsCards'
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/ErrorState'
import { StatsGrid } from '@/features/dashboard/components/StatsGrid'

const ErrorFallBack = ({ error, resetErrorBoundary }: FallbackProps) => (
  <ErrorState
    title="Error loading dashboard!"
    description={error instanceof Error ? error.message : 'Something went wrong!'}
    onRetry={resetErrorBoundary}
  ></ErrorState>
)

export const HomePage = () => {
  return (
    <>
      <h1 className="mb-6 text-xl font-semibold">Dashboard</h1>
      <ErrorBoundary FallbackComponent={ErrorFallBack} onReset={resetStats}>
        <Suspense
          fallback={
            <StatsGrid>
              {Array.from({ length: 6 }, (_, i) => (
                <Skeleton key={i} className="h-23 rounded-xl" />
              ))}
            </StatsGrid>
          }
        >
          <StatsCards></StatsCards>
        </Suspense>
      </ErrorBoundary>
    </>
  )
}
