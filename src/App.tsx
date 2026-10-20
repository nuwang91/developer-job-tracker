import { JobCard } from '@/features/jobs/components/JobCard'
import { mockJobs } from '@/features/jobs/mockJobs'
import { JobFilters } from '@/features/jobs/components/JobFilters'
import { useState } from 'react'
import {
  ALL,
  type StatusFilter,
  type JobApplication,
  STATUS_FILTER_OPTIONS,
} from '@/features/jobs/types'

function App() {
  const [status, setStatus] = useState<StatusFilter>(ALL)
  const [searchText, setSearchText] = useState('')
  const search = searchText.trim().toLowerCase()

  const visibleJobs: JobApplication[] = mockJobs
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
  const deleteJob = (id: string) => {
    console.log(`deleted job: ` + id)
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <JobFilters
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
