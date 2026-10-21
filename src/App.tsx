import { JobCard } from '@/features/jobs/components/JobCard'
import { JobFilters } from '@/features/jobs/components/JobFilters'
import { useEffect, useState } from 'react'
import {
  ALL,
  type StatusFilter,
  type JobApplication,
  STATUS_FILTER_OPTIONS,
} from '@/features/jobs/types'
import { Spinner } from '@/components/ui/spinner'
import { getJobs, deleteJob } from '@/features/jobs/api'
import { ApiError } from '@/lib/ApiError'
import { toast, Toaster } from '@/components/ui/toast'

function App() {
  const [status, setStatus] = useState<StatusFilter>(ALL)
  const [searchText, setSearchText] = useState('')
  const [jobs, setJobs] = useState<JobApplication[]>([])
  const [loading, setLoading] = useState(true)
  // A boolean you flip back and forth is the wrong tool for “do this again”. Use a counter you never reset
  const [refetch, setRefetch] = useState(0)
  const search = searchText.trim().toLowerCase()

  useEffect(() => {
    const abortController = new AbortController()
    getJobs(abortController.signal)
      .then((jobs) => {
        setJobs(jobs)
        setLoading(false)
      })
      .catch((e) => {
        if (e instanceof ApiError) {
          if (e.info.type === 'abort') {
            // Cancelled requests should not bother the user
            console.log('Request Aborted ' + e.stack)
            return
          }
          setLoading(false)
          toast.add({
            type: 'error',
            description: e.message,
            priority: 'high',
          })
        }
      })

    return () => abortController.abort()
  }, [refetch])

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
      .then(() => setRefetch((c) => c + 1))
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

  return (
    <>
      {loading && (
        <div className="fixed inset-0 grid place-items-center">
          <Spinner className="size-8" />
        </div>
      )}
      {!loading && (
        <main className="mx-auto max-w-3xl p-6">
          <JobFilters
            className="mb-4"
            statuses={STATUS_FILTER_OPTIONS}
            status={status}
            onStatusChange={setStatus}
            searchText={searchText}
            onSearchTextChange={setSearchText}
          ></JobFilters>

          <ul className="grid gap-3">
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
      )}

      <Toaster />
    </>
  )
}

export default App
