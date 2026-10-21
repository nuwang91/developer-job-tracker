import type { ReactNode } from 'react'

type EmptyStateProps = {
  title: string
  icon?: ReactNode
  description?: string
  action?: ReactNode
}

export const EmptyState = ({ title, action, description, icon }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed p-10 text-center">
      {icon}
      <p className="font-medium">{title}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
      <div className="mt-2">{action}</div>
    </div>
  )
}
