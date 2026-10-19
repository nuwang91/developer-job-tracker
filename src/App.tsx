import { JobCard } from '@/features/jobs/components/JobCard'
import { mockJobs } from '@/features/jobs/mockJobs'
import { JobFilters } from './features/jobs/components/JobFilters'
import { useState } from 'react'
import {
  APPLICATION_STATUSES,
  ALL,
  type StatusFilter,
  type JobApplication,
} from './features/jobs/types'

function App() {
  const [status, setStatus] = useState<StatusFilter>(ALL)
  const [searchText, setSearchText] = useState('')
  const statuses: StatusFilter[] = [ALL, ...APPLICATION_STATUSES]

  const filteredJobs: JobApplication[] = mockJobs.filter((job) => {
    const search = searchText.trim().toLowerCase()
    if (search === '') return true
    return (
      job.company.trim().toLowerCase().includes(search) ||
      job.role.trim().toLowerCase().includes(search)
    )
  })

  const statusFilter = filteredJobs.filter((job) => {
    if (status === ALL) return true
    return job.status === status
  })

  const selectJob = (id: string) => {
    console.log(`selected job: ` + id)
  }
  const deleteJob = (id: string) => {
    console.log(`deleted job: ` + id)
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <JobFilters
          statuses={statuses}
          status={status}
          statusChange={setStatus}
          searchText={searchText}
          searchTextChange={setSearchText}
        ></JobFilters>
      </div>
      <ul className="grid gap-3">
        {statusFilter.map((job) => {
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
                onDelete={deleteJob}
              ></JobCard>
            </li>
          )
        })}
      </ul>
    </main>
  )
}

export default App
