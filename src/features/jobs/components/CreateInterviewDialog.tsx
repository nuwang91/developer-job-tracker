import { useState, type ReactElement } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { InterviewForm } from './InterviewForm'

type CreateInterviewDialogProps = {
  trigger: ReactElement
  id: string
  onCreated: () => void
}

export const CreateInterviewDialog = ({ trigger, id, onCreated }: CreateInterviewDialogProps) => {
  const [open, setOpen] = useState(false)

  const onCreatedSuccess = () => {
    setOpen(false)
    onCreated()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger}></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add interview</DialogTitle>
          <DialogDescription>Past and Future dates are allowed</DialogDescription>
        </DialogHeader>
        <InterviewForm
          id={id}
          onCreated={onCreatedSuccess}
          onCancel={() => setOpen(false)}
        ></InterviewForm>
      </DialogContent>
    </Dialog>
  )
}
