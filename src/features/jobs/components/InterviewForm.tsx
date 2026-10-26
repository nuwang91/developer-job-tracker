import { ChevronDownIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { useActionState, useState } from 'react'
import { ApiError } from '@/lib/ApiError'
import { createInterview } from '@/features/jobs/api'
import { Calendar } from '@/components/ui/calendar'
import { formatDate } from '@/lib/formatDate'

type InterviewFormProps = { id: string; onCreated: () => void; onCancel: () => void }

type InterviewFormState =
  | {
      error: { type: 'server'; message: string }
    }
  | {
      error: {
        type: 'other'
        message: string
      }
    }
  | { error: null }

export const InterviewForm = ({ id, onCreated, onCancel }: InterviewFormProps) => {
  const [submitted, setSubmitted] = useState(false)
  // We have to keep useState here because Calendar control is not a native html where it supports name attribute
  // Even 3rd party libraries may support this approach of useActionState, but in here Calendar do not support
  // Therefore we have introduced a hidden input
  const [calendarDate, setCalendarDate] = useState<Date>(() => new Date())
  const [state, formAction, isPending] = useActionState(
    async (prevState: InterviewFormState, formData: FormData): Promise<InterviewFormState> => {
      const dateString = formData.get('date')
      setSubmitted(true)
      if (!dateString)
        return {
          error: {
            message: 'Date is required',
            type: 'other',
          },
        }
      try {
        const date = new Date(dateString.toString())
        if (Number.isNaN(date.getTime())) {
          return {
            error: {
              type: 'other',
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
      <Field data-invalid={submitted && !!state.error}>
        <FieldLabel htmlFor="date-picker">Date</FieldLabel>
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
              aria-invalid={submitted && !!state.error}
              defaultMonth={calendarDate}
            />
          </PopoverContent>
        </Popover>
        {submitted && !!state.error && <FieldError errors={[{ message: state.error.message }]} />}
      </Field>
      {!!state.error && state.error.type === 'server' && (
        <p role="alert" className="text-sm text-destructive">
          {state.error?.message}
        </p>
      )}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving…' : 'Save'}
        </Button>
      </div>
    </form>
  )
}
