import { useState, type ReactElement } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { JobForm } from '@/features/jobs/components/JobForm'
import type { JobApplication, JobInput } from '@/features/jobs/types'
import { updateJob } from '@/features/jobs/api'

type EditJobDialogProps = {
  trigger: ReactElement
  onUpdateJob: () => void
  currentValues: JobInput & Pick<JobApplication, 'id'>
}

export const EditJobDialog = ({ trigger, onUpdateJob, currentValues }: EditJobDialogProps) => {
  const [open, setOpen] = useState(false)
  const onSave = async (values: JobInput) => {
    await updateJob(currentValues.id, { ...values })
    setOpen(false)
    onUpdateJob()
  }
  const { company, role, status, notes } = currentValues
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger}></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update application</DialogTitle>
          <DialogDescription>Edit job application</DialogDescription>
        </DialogHeader>
        <JobForm
          initialValues={{ company, status, role, notes }}
          cancelLabel="Cancel"
          submitLabel="Update application"
          onSubmit={onSave}
          onCancel={() => {
            setOpen(false)
          }}
        ></JobForm>
      </DialogContent>
    </Dialog>
  )
}
