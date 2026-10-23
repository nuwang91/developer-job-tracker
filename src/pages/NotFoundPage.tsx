import { Link } from 'react-router'
import { EmptyState } from '@/components/EmptyState'

export const NotFoundPage = () => {
  return (
    <EmptyState title="Page not found" action={<Link to={`/jobs`}>Go to Jobs</Link>}></EmptyState>
  )
}
