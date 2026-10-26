import { useState, type ReactElement } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { Field, FieldError, FieldLabel } from '@/components/ui/field'

import { Button } from '@/components/ui/button'

import { ChevronDownIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { formatDate } from '@/lib/formatDate'
import { ApiError } from '@/lib/ApiError'
import { createInterview } from '@/features/jobs/api'

type CreateInterviewDialogProps = {
  trigger: ReactElement
  id: string
  onCreated: () => void
}

type InterviewForm = {
  date: Date
}

export const CreateInterviewDialog = ({ trigger, id, onCreated }: CreateInterviewDialogProps) => {
  const [open, setOpen] = useState(false)
  const [formValues, setFormValues] = useState<InterviewForm>({ date: new Date() })
  const [submitted, setSubmitted] = useState(false)
  const [pending, setPending] = useState(false)
  const [serverError, setServerError] = useState('')

  const errors: Partial<Record<keyof InterviewForm, string>> =
    formValues.date == null ? { date: 'Date is required' } : {}

  const onFieldChange = <K extends keyof InterviewForm>(key: K, value: InterviewForm[K]) => {
    setFormValues((prev) => ({ ...prev, [key]: value }))
  }

  const resetStates = () => {
    setFormValues({ date: new Date() })
    setSubmitted(false)
    setPending(false)
    setServerError('')
  }

  const onSave = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitted(true)
    setServerError('')
    if (Object.keys(errors).length !== 0) return
    setPending(true)
    try {
      await createInterview(id, { date: formValues.date.toISOString() })
      // setFormValues({ date: new Date() })
      setOpen(false)
      onCreated()
    } catch (e) {
      setServerError(e instanceof ApiError ? e.message : 'Something went wrong!')
    } finally {
      setPending(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(e) => {
        setOpen(e)
        if (e) resetStates()
      }}
    >
      <DialogTrigger render={trigger}></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add interview</DialogTitle>
          <DialogDescription>Past and Future dates are allowed</DialogDescription>
        </DialogHeader>
        <form className="grid gap-4" noValidate onSubmit={onSave}>
          <Field data-invalid={submitted && !!errors.date}>
            <FieldLabel htmlFor="date-picker">Date</FieldLabel>
            <Popover>
              <PopoverTrigger
                render={
                  <Button
                    id="date-picker"
                    variant={'outline'}
                    data-empty={!formValues.date}
                    className="w-53 justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
                  >
                    {formValues.date ? (
                      formatDate(formValues.date.toISOString(), 'short')
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <ChevronDownIcon data-icon="inline-end" />
                  </Button>
                }
              />
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formValues.date}
                  aria-invalid={submitted && !!errors.date}
                  onSelect={(date) => {
                    if (!date) return
                    onFieldChange('date', date)
                  }}
                  defaultMonth={formValues.date}
                />
              </PopoverContent>
            </Popover>
            {submitted && errors.date != null && <FieldError errors={[{ message: errors.date }]} />}
          </Field>
          <p role="alert" className="text-sm text-destructive">
            {serverError}
          </p>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? 'Saving…' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
