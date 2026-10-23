import { useParams } from 'react-router'
import { Skeleton } from '@/components/ui/skeleton'
import { useJob } from '@/features/jobs/hooks/useJob'
import { JobDetails } from '@/features/jobs/components/JobDetails'
import { AlertCircle } from 'lucide-react'
import { ErrorState } from '@/components/ErrorState'

export const JobDetailsPage = () => {
  const params = useParams()
  const id = params.id ?? ''
  const { job, reload } = useJob(id)

  return (
    <>
      {job.name === 'loading' && (
        <>
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="mt-6 h-40 w-full rounded-xl" />
        </>
      )}

      {job.name === 'error' && (
        <ErrorState
          title="Couldn’t load application"
          icon={<AlertCircle />}
          description={job.message}
          onRetry={reload}
        ></ErrorState>
      )}

      {job.name === 'success' && (
        <JobDetails key={job.data.id} job={job.data} reload={reload}></JobDetails>
      )}
    </>
  )
}
