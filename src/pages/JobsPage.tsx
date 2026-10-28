import { JobCard } from '@/features/jobs/components/JobCard'
import { JobFilters } from '@/features/jobs/components/JobFilters'
import {
  ALL,
  type JobApplication,
  STATUS_FILTER_OPTIONS,
  isValidStatus,
} from '@/features/jobs/types'
import { Spinner } from '@/components/ui/spinner'
import { deleteJob } from '@/features/jobs/api'
import { ApiError } from '@/lib/ApiError'
import { toast } from '@/components/ui/toast'
import { useJobs } from '@/features/jobs/hooks/useJobs'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/EmptyState'
import { ErrorState } from '@/components/ErrorState'
import { Button } from '@/components/ui/button'
import { AlertCircle, Briefcase, Plus, SearchX } from 'lucide-react'
import { CreateJobDialog } from '@/features/jobs/components/CreateJobDialog'
import { useSearchParams } from 'react-router'
import { useDeferredValue, ViewTransition } from 'react'
import { cn } from '@/lib/utils'

export function JobsPage() {
  const [searchParam, setSearchParam] = useSearchParams()

  const statusParam = searchParam.get('status')
  const status = isValidStatus(statusParam) ? statusParam : ALL
  const deferredStatus = useDeferredValue(status)
  const searchText = searchParam.get('q') ?? ''
  const deferredSearchText = useDeferredValue(searchText)
  const search = searchText.trim().toLowerCase()

  const isStale = search !== deferredSearchText || status !== deferredStatus

  const { state, reload } = useJobs({
    onRefreshError: (message) =>
      toast.add({
        type: 'error',
        title: "Couldn't refresh",
        description: message,
        priority: 'high',
      }),
  })

  const jobs: JobApplication[] =
    state.name === 'success' || state.name === 'refreshing' ? state.data : []
  const visibleJobs: JobApplication[] = jobs
    .filter((job) => {
      if (deferredSearchText === '') return true
      return (
        job.company.toLowerCase().includes(deferredSearchText) ||
        job.role.toLowerCase().includes(deferredSearchText)
      )
    })
    .filter((job) => {
      if (deferredStatus === ALL) return true
      return job.status === deferredStatus
    })

  const onJobDelete = (id: string) => {
    deleteJob(id)
      .then(() => reload())
      .catch((e) => {
        if (e instanceof ApiError) {
          toast.add({
            type: 'error',
            description: e.message,
            priority: 'high',
          })
        }
      })
  }

  const onRetry = () => {
    reload()
  }

  const onClear = () => {
    setSearchParam({}, { replace: true })
  }

  const onCreateSuccess = () => {
    toast.add({
      type: 'success',
      title: 'Job Created Successfully',
      priority: 'high',
    })
    reload()
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Applications</h1>
        <CreateJobDialog
          trigger={
            <Button>
              <Plus /> Add application
            </Button>
          }
          onCreated={onCreateSuccess}
        ></CreateJobDialog>
      </div>
      <JobFilters
        className="mb-4"
        statuses={STATUS_FILTER_OPTIONS}
        status={status}
        onStatusChange={(status) =>
          setSearchParam(
            (prev) => {
              const next = new URLSearchParams(prev)
              if (status === 'all') {
                next.delete('status')
                return next
              }
              next.set('status', status)
              return next
            },
            { replace: true, flushSync: true },
          )
        }
        searchText={searchText}
        onSearchTextChange={(value) =>
          setSearchParam(
            (prev) => {
              const next = new URLSearchParams(prev)
              if (value === '') {
                next.delete('q')
                return next
              }
              next.set('q', value)
              return next
            },
            { replace: true, flushSync: true },
          )
        }
      ></JobFilters>
      {state.name === 'refreshing' && (
        <div className="grid place-items-center">
          <Spinner className="size-4 text-muted-foreground" />
        </div>
      )}

      {jobs.length !== 0 && visibleJobs.length === 0 && (
        <EmptyState
          title="No matches"
          icon={<SearchX />}
          action={<Button onClick={onClear}>Clear filters</Button>}
        ></EmptyState>
      )}
      {state.name === 'success' && jobs.length === 0 && (
        <EmptyState title="No applications yet" icon={<Briefcase />}></EmptyState>
      )}
      {state.name === 'error' && (
        <ErrorState
          title="Couldn’t load applications"
          icon={<AlertCircle />}
          description={state.message}
          onRetry={onRetry}
        ></ErrorState>
      )}

      <ul className={cn('grid gap-3 transition-opacity', isStale && 'opacity-60')}>
        {state.name === 'loading' && (
          <>
            {[1, 2, 3].map((value) => (
              <li key={value}>
                <Skeleton className="h-32 w-full rounded-xl" />
              </li>
            ))}
          </>
        )}

        {visibleJobs.map((job) => {
          return (
            <ViewTransition key={job.id}>
              <li>
                <JobCard
                  id={job.id}
                  company={job.company}
                  createdAt={job.createdAt}
                  interviews={job.interviews}
                  role={job.role}
                  status={job.status}
                  onDelete={onJobDelete}
                ></JobCard>
              </li>
            </ViewTransition>
          )
        })}
      </ul>
    </>
  )
}
