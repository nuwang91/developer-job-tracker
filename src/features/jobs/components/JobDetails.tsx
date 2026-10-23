import { Link, useNavigate } from 'react-router'
import { Card, CardContent } from '@/components/ui/card'
import { StatusBadge } from '@/features/jobs/components/StatusBadge'
import { formatDate } from '@/lib/formatDate'
import { AlertCircle, Pencil, Trash } from 'lucide-react'
import { EditJobDialog } from './EditJobDialog'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { deleteJob } from '@/features/jobs/api'
import { ApiError } from '@/lib/ApiError'
import { useJob } from '@/features/jobs/hooks/useJob'
import { ErrorState } from '@/components/ErrorState'
import { Skeleton } from '@/components/ui/skeleton'

export type JobDetailsProps = {
  id: string
}
export const JobDetails = ({ id }: JobDetailsProps) => {
  const { state, reload } = useJob({
    id,
    onRefreshError: (message) =>
      toast.add({
        type: 'error',
        title: "Couldn't refresh",
        description: message,
        priority: 'high',
      }),
  })
  const navigate = useNavigate()
  const onEditSuccess = () => {
    toast.add({
      type: 'success',
      title: 'Job Updated Successfully',
      priority: 'high',
    })
    reload()
  }

  const deleteApplication = () => {
    deleteJob(id)
      .then(() => {
        toast.add({
          type: 'success',
          title: 'Job deleted Successfully',
          priority: 'high',
        })
        navigate('/jobs', { replace: true })
      })
      .catch((e) => {
        const message = e instanceof ApiError ? e.message : 'Something went wrong!'
        toast.add({
          type: 'error',
          title: 'Job deletion unsuccessfull',
          description: message,
          priority: 'high',
        })
      })
  }

  return (
    <>
      <Link to="/jobs" className="text-sm text-muted-foreground hover:text-foreground">
        ← All applications
      </Link>

      {state.name === 'loading' && (
        <>
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="mt-6 h-40 w-full rounded-xl" />
        </>
      )}

      {state.name === 'error' && (
        <ErrorState
          title="Couldn’t load application"
          icon={<AlertCircle />}
          description={state.message}
        ></ErrorState>
      )}

      {(state.name === 'success' || state.name === 'refreshing') && (
        <>
          <div className="mt-4 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold">{state.data.role}</h1>
              <p className="text-muted-foreground">{state.data.company}</p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={state.data.status} />
              <EditJobDialog
                trigger={
                  <Button variant="outline">
                    <Pencil /> Edit application
                  </Button>
                }
                currentValues={{
                  id: state.data.id,
                  company: state.data.company,
                  status: state.data.status,
                  role: state.data.role,
                  ...(state.data.notes && { notes: state.data.notes }),
                }}
                onUpdateJob={onEditSuccess}
              ></EditJobDialog>
              <Button variant="destructive" onClick={deleteApplication}>
                <Trash /> Delete application
              </Button>
            </div>
          </div>

          <Card className="mt-6">
            <CardContent>
              <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
                <dt className="text-muted-foreground">Applied</dt>
                <dd>{formatDate(state.data.createdAt, 'short')}</dd>
                <dt className="text-muted-foreground">Interviews</dt>
                <dd>{state.data.interviews.length}</dd>
                <dt className="text-muted-foreground">Notes</dt>
                <dd className="whitespace-pre-wrap">{state.data.notes || '—'}</dd>
              </dl>
            </CardContent>
          </Card>
        </>
      )}
    </>
  )
}
