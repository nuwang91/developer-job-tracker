import { JobCard } from './features/jobs/components/JobCard'
import { mockJobs } from './features/jobs/mockJobs'
import type { ApplicationStatus } from './features/jobs/types'

function App() {
  const selectJob = (id: string) => {
    console.log(`selected job: ` + id)
  }
  const deleteJob = (id: string) => {
    console.log(`deleted job: ` + id)
  }

  return (
    <>
      <main className="mx-auto max-w-3xl p-6">
        <ul className="grid gap-3">
          {mockJobs.map((job) => {
            return (
              <JobCard
                id={job.id}
                company={job.company}
                createdAt={job.createdAt}
                interviews={job.interviews}
                role={job.role}
                status={job.status as ApplicationStatus}
                key={job.id}
                onSelect={selectJob}
                onDelete={deleteJob}
              ></JobCard>
            )
          })}
        </ul>
      </main>
    </>
  )
}

export default App
