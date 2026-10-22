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
import type { JobInput } from '@/features/jobs/types'
import { createJob } from '@/features/jobs/api'

type CreateJobDialogProps = {
  trigger: ReactElement
  onCreated: () => void
}

export const CreateJobDialog = ({ trigger, onCreated }: CreateJobDialogProps) => {
  const [open, setOpen] = useState(false)
  const onSave = async (values: JobInput) => {
    await createJob(values)
    setOpen(false)
    onCreated()
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger}>Open</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Job</DialogTitle>
          <DialogDescription>Add your JOB</DialogDescription>
        </DialogHeader>
        <JobForm
          initialValues={{ company: '', role: '', status: 'applied' }}
          cancelLabel="Cancel"
          submitLabel="Save changes"
          onSubmit={onSave}
        ></JobForm>
      </DialogContent>
    </Dialog>
  )
}
