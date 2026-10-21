import { Button } from '@/components/ui/button'
import type { ReactNode } from 'react'

type ErrorStateProps = {
  title: string
  icon?: ReactNode
  description?: string
  onRetry: () => void
}

export const ErrorState = ({ title, description, icon, onRetry }: ErrorStateProps) => {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-destructive/40 p-10 text-center">
      {icon}
      <p className="font-medium text-destructive">{title}</p>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      <div className="mt-2">
        <Button onClick={onRetry} variant="outline" size="sm">
          Retry
        </Button>
      </div>
    </div>
  )
}
