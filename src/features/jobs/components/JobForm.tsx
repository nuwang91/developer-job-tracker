import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { APPLICATION_STATUSES, type JobInput } from '../types'
import { useState } from 'react'
import { validateJob } from '@/features/jobs/validateJob'
import { ChipGroup } from '@/components/ChipGroup'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ApiError } from '@/lib/ApiError'

type JobFormProps = {
  initialValues: JobInput
  onSubmit: (values: JobInput) => Promise<void>
  submitLabel: string
  cancelLabel: string
  onCancel: () => void
}

export const JobForm = ({
  initialValues,
  onSubmit,
  submitLabel,
  cancelLabel,
  onCancel,
}: JobFormProps) => {
  const [formValues, setFormValues] = useState<JobInput>(initialValues)
  const [submitted, setSubmitted] = useState(false)
  const [pending, setPending] = useState(false)
  const [serverError, setServerError] = useState('')

  const errors = validateJob(formValues)

  const onSave = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitted(true)
    if (Object.keys(errors).length !== 0) return
    setPending(true)
    try {
      await onSubmit({
        ...formValues,
        company: formValues.company.trim(),
        role: formValues.role.trim(),
      })
    } catch (e) {
      setServerError(e instanceof ApiError ? e.message : 'Something went wrong!')
    } finally {
      setPending(false)
    }
  }

  const onFieldChange = <T extends string>(key: string, value: T) => {
    setFormValues((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <form className="grid gap-4" noValidate onSubmit={onSave}>
      <Field data-invalid={submitted && !!errors.company}>
        <FieldLabel htmlFor="company">Company</FieldLabel>
        <Input
          id="company"
          type="text"
          placeholder="Company"
          aria-invalid={submitted && !!errors.company}
          value={formValues.company}
          onChange={(e) => onFieldChange(e.target.id, e.target.value)}
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
          onChange={(e) => onFieldChange(e.target.id, e.target.value)}
        />
        {submitted && errors.role != null && <FieldError errors={[{ message: errors.role }]} />}
      </Field>

      <Field>
        <FieldLabel>Status</FieldLabel>
        <ChipGroup
          options={APPLICATION_STATUSES}
          value={formValues.status}
          ariaLabel="Status"
          onChange={(e) => onFieldChange('status', e)}
        ></ChipGroup>
      </Field>

      <Field data-invalid={submitted && !!errors.notes}>
        <FieldLabel htmlFor="notes">Notes</FieldLabel>
        <Textarea
          id="notes"
          placeholder="Notes"
          aria-invalid={submitted && !!errors.notes}
          value={formValues.notes}
          onChange={(e) => onFieldChange(e.target.id, e.target.value)}
        ></Textarea>
        {submitted && errors.notes != null && <FieldError errors={[{ message: errors.notes }]} />}
      </Field>

      <p role="alert" className="text-sm text-destructive">
        {serverError}
      </p>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? 'Saving…' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
