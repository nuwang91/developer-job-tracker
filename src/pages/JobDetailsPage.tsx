import { useParams } from 'react-router'
import { JobDetails } from '@/features/jobs/components/JobDetails'

export const JobDetailsPage = () => {
  const params = useParams()
  const id = params.id ?? ''

  return <JobDetails key={id} id={id}></JobDetails>
}
