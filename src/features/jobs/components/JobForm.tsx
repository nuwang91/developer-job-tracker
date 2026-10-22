import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { APPLICATION_STATUSES, type JobInput } from '../types'
import { useState } from 'react'
import { validateJob } from '@/features/jobs/validateJob'
import { ChipGroup } from '@/components/ChipGroup'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ApiError } from '@/lib/ApiError'
import { DialogClose, DialogFooter } from '@/components/ui/dialog'

type JobFormProps = {
  initialValues: JobInput
  onSubmit: (values: JobInput) => Promise<void>
  submitLabel: string
  cancelLabel: string
}

export const JobForm = ({ initialValues, onSubmit, submitLabel, cancelLabel }: JobFormProps) => {
  const [formValues, setFormValues] = useState<JobInput>(initialValues)
  const [submitted, setSubmitted] = useState(false)
  const [pending, setPending] = useState(false)
  const [serverError, setServerError] = useState('')

  const onFormValueChange = (event: React.ChangeEvent<HTMLFormElement, Element>) => {
    setFormValues((prev) => {
      return { ...prev, [event.target.id]: event.target.value.trim() }
    })
  }

  const onSave = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitted(true)
    if (Object.keys(validateJob(formValues)).length !== 0) return
    setPending(true)
    try {
      await onSubmit(formValues)
    } catch (e) {
      setServerError(e instanceof ApiError ? e.message : 'Something went wrong!')
    } finally {
      setPending(false)
    }
  }

  const errors = validateJob(formValues)

  return (
    <form className="grid gap-4" noValidate onChange={onFormValueChange} onSubmit={onSave}>
      <Field data-invalid={submitted && !!errors.company}>
        <FieldLabel htmlFor="company">Company</FieldLabel>
        <Input
          id="company"
          type="text"
          placeholder="Company"
          aria-invalid={submitted && !!errors.company}
          value={formValues.company}
        />
        {submitted && errors.company != null && (
          <FieldError errors={[{ message: errors.company }]} />
        )}
      </Field>
      <Field data-invalid={submitted && !!errors.role}>
        <FieldLabel htmlFor="role">Role</FieldLabel>
        <Input
          id="role"
          type="text"
          placeholder="Role"
          aria-invalid={submitted && !!errors.role}
          value={formValues.role}
        />
        {submitted && errors.role != null && <FieldError errors={[{ message: errors.role }]} />}
      </Field>

      <ChipGroup
        options={APPLICATION_STATUSES}
        value={formValues.status}
        ariaLabel="Status on create"
        onChange={() => {}}
      ></ChipGroup>

      <Field data-invalid={submitted && !!errors.notes}>
        <FieldLabel htmlFor="notes">Notes</FieldLabel>
        <Textarea
          id="notes"
          placeholder="Notes"
          aria-invalid={submitted && !!errors.notes}
          value={formValues.notes}
        ></Textarea>
        {submitted && errors.notes != null && <FieldError errors={[{ message: errors.notes }]} />}
      </Field>

      <p role="alert" className="text-sm text-destructive">
        {serverError}
      </p>

      <DialogFooter>
        <DialogClose
          render={
            <Button type="button" variant="outline">
              {cancelLabel}
            </Button>
          }
        />
        <Button type="submit" disabled={pending}>
          {pending ? 'Saving…' : submitLabel}
        </Button>
      </DialogFooter>
    </form>
  )
}
