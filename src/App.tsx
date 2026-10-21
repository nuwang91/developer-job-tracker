import { JobCard } from '@/features/jobs/components/JobCard'
import { JobFilters } from '@/features/jobs/components/JobFilters'
import { useState } from 'react'
import {
  ALL,
  type StatusFilter,
  type JobApplication,
  STATUS_FILTER_OPTIONS,
} from '@/features/jobs/types'
import { Spinner } from '@/components/ui/spinner'
import { deleteJob } from '@/features/jobs/api'
import { ApiError } from '@/lib/ApiError'
import { toast, Toaster } from '@/components/ui/toast'
import { useJobs } from '@/features/jobs/hooks/useJobs'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/EmptyState'
import { ErrorState } from '@/components/ErrorState'
import { Button } from '@/components/ui/button'
import { AlertCircle, Briefcase, SearchX } from 'lucide-react'

function App() {
  const [status, setStatus] = useState<StatusFilter>(ALL)
  const [searchText, setSearchText] = useState('')
  const search = searchText.trim().toLowerCase()

  // A boolean you flip back and forth is the wrong tool for “do this again”. Use a counter you never reset
  const [reloadKey, setReloadKey] = useState(0)

  const { state, reload } = useJobs(reloadKey)

  const jobs: JobApplication[] = state.name === 'success' ? state.data : []
  const visibleJobs: JobApplication[] = jobs
    .filter((job) => {
      if (search === '') return true
      return job.company.toLowerCase().includes(search) || job.role.toLowerCase().includes(search)
    })
    .filter((job) => {
      if (status === ALL) return true
      return job.status === status
    })

  const selectJob = (id: string) => {
    console.log(`selected job: ` + id)
  }
  const onJobDelete = (id: string) => {
    deleteJob(id)
      .then(() => setReloadKey((c) => c + 1))
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
    setReloadKey((c) => c + 1)
  }

  const onClear = () => {
    setStatus(ALL)
    setSearchText('')
  }

  return (
    <>
      <main className="mx-auto max-w-3xl p-6">
        <JobFilters
          className="mb-4"
          statuses={STATUS_FILTER_OPTIONS}
          status={status}
          onStatusChange={setStatus}
          searchText={searchText}
          onSearchTextChange={setSearchText}
        ></JobFilters>
        {reload && (
          <div className="fixed inset-0 grid place-items-center">
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
            title="API Error"
            icon={<AlertCircle />}
            description={state.message}
            retry={onRetry}
          ></ErrorState>
        )}

        <ul className="grid gap-3">
          {state.name === 'loading' && (
            <li>
              <Skeleton className="h-32 w-full rounded-xl" />
            </li>
          )}

          {visibleJobs.map((job) => {
            return (
              <li key={job.id}>
                <JobCard
                  id={job.id}
                  company={job.company}
                  createdAt={job.createdAt}
                  interviews={job.interviews}
                  role={job.role}
                  status={job.status}
                  onSelect={selectJob}
                  onDelete={onJobDelete}
                ></JobCard>
              </li>
            )
          })}
        </ul>
      </main>

      <Toaster />
    </>
  )
}

export default App
