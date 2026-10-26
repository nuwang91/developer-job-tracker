import { ChevronDownIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { useActionState, useState } from 'react'
import { ApiError } from '@/lib/ApiError'
import { createInterview } from '@/features/jobs/api'
import { Calendar } from '@/components/ui/calendar'
import { formatDate } from '@/lib/formatDate'
import { FormFooter } from '@/features/jobs/components/FormFooter'

type InterviewFormProps = { id: string; onCreated: () => void; onCancel: () => void }

type InterviewFormState =
  | {
      error: { type: 'server' | 'validation'; message: string }
    }
  | { error: null }

export const InterviewForm = ({ id, onCreated, onCancel }: InterviewFormProps) => {
  // We have to keep useState here because Calendar control is not a native html where it supports name attribute
  // Even 3rd party libraries may support this approach of useActionState, but in here Calendar do not support
  // Therefore we have introduced a hidden input
  const [calendarDate, setCalendarDate] = useState<Date>(() => new Date())
  // There is also isPending coming from useActionState, but we dont need in this situation -> const [state, formAction, isPending] = useActionState
  const [state, formAction] = useActionState(
    async (_prevState: InterviewFormState, formData: FormData): Promise<InterviewFormState> => {
      const dateString = formData.get('date')
      if (!dateString)
        return {
          error: {
            message: 'Date is required',
            type: 'validation',
          },
        }
      try {
        const date = new Date(dateString.toString())
        if (typeof dateString === 'string' && Number.isNaN(date.getTime())) {
          return {
            error: {
              type: 'validation',
              message: 'Invalid date',
            },
          }
        }
        await createInterview(id, { date: date.toISOString() })
        onCreated()
        return { error: null }
      } catch (e) {
        return {
          error: {
            message: e instanceof ApiError ? e.message : 'Something went wrong',
            type: 'server',
          },
        }
      }
    },
    { error: null },
  )

  return (
    <form className="grid gap-4" action={formAction} noValidate>
      <Field data-invalid={!!state.error && state.error.type === 'validation'}>
        <FieldLabel htmlFor="date-picker">Date</FieldLabel>
        {/* For useActionState work, we need the name attribute on input */}
        <input type="hidden" name="date" value={calendarDate.toISOString()} />
        <Popover>
          <PopoverTrigger
            render={
              <Button
                id="date-picker"
                variant={'outline'}
                data-empty={!calendarDate}
                className="w-53 justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
              >
                {calendarDate ? (
                  formatDate(calendarDate.toISOString(), 'short')
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
              selected={calendarDate}
              onSelect={(d) => d && setCalendarDate(d)}
              defaultMonth={calendarDate}
            />
          </PopoverContent>
        </Popover>
        {!!state.error && <FieldError errors={[{ message: state.error.message }]} />}
      </Field>
      {!!state.error && state.error.type === 'server' && (
        <p role="alert" className="text-sm text-destructive">
          {state.error?.message}
        </p>
      )}

      <FormFooter submitLabel="Save" onCancel={onCancel}></FormFooter>
    </form>
  )
}
