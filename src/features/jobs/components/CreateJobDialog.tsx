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
      <DialogTrigger render={trigger}></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add application</DialogTitle>
          <DialogDescription>Track a new job application</DialogDescription>
        </DialogHeader>
        <JobForm
          initialValues={{ company: '', role: '', status: 'applied', notes: '' }}
          cancelLabel="Cancel"
          submitLabel="Add application"
          onSubmit={onSave}
          onCancel={() => {
            setOpen(false)
          }}
        ></JobForm>
      </DialogContent>
    </Dialog>
  )
}
