import { Button } from '@/components/ui/button'
import { useFormStatus } from 'react-dom'

type FormFooterProps = {
  onCancel: () => void
  submitLabel: string
}

export const FormFooter = ({ onCancel, submitLabel }: FormFooterProps) => {
  // Can access pending state when the component (i.e FormFooter) is within <form> tag inside component InterviewForm
  const { pending } = useFormStatus()

  return (
    <div className="flex justify-end gap-2">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit" disabled={pending}>
        {pending ? 'Saving…' : submitLabel}
      </Button>
    </div>
  )
}
