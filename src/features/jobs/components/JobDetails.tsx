import { Link, useNavigate } from 'react-router'
import { Card, CardContent } from '@/components/ui/card'
import { StatusBadge } from '@/features/jobs/components/StatusBadge'
import { formatDate } from '@/lib/formatDate'
import type { JobApplication } from '@/features/jobs/types'
import { Pencil, Trash } from 'lucide-react'
import { EditJobDialog } from './EditJobDialog'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { deleteJob } from '@/features/jobs/api'
import { ApiError } from '@/lib/ApiError'

export type JobDetailsProps = {
  job: JobApplication
  reload: () => void
}
export const JobDetails = ({ job, reload }: JobDetailsProps) => {
  const navigate = useNavigate()
  const { company, createdAt, interviews, id, role, status, notes } = job
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

      <>
        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold">{role}</h1>
            <p className="text-muted-foreground">{company}</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={status} />
            <EditJobDialog
              trigger={
                <Button>
                  <Pencil /> Edit application
                </Button>
              }
              currentValues={{ id, company, status, role, notes }}
              onUpdateJob={onEditSuccess}
            ></EditJobDialog>
            <Button onClick={deleteApplication}>
              <Trash /> Delete application
            </Button>
          </div>
        </div>

        <Card className="mt-6">
          <CardContent>
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
              <dt className="text-muted-foreground">Applied</dt>
              <dd>{formatDate(createdAt, 'short')}</dd>
              <dt className="text-muted-foreground">Interviews</dt>
              <dd>{interviews.length}</dd>
              <dt className="text-muted-foreground">Notes</dt>
              <dd className="whitespace-pre-wrap">{notes || '—'}</dd>
            </dl>
          </CardContent>
        </Card>
      </>
    </>
  )
}
