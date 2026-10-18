import type { ComponentProps } from 'react'
import { Badge } from './ui/badge'
import type { ApplicationStatus } from '../features/jobs/types'
import { cn } from 'cn'

type StatusBagdeProps = Omit<ComponentProps<typeof Badge>, 'children'> & {
  status: ApplicationStatus
}

const StatusLabels: Record<ApplicationStatus, string> = {
  applied: 'Applied',
  interview: 'Interview',
  offer: 'Offer',
  rejected: 'Rejected',
}

export const StatusBadge = ({ status, className, ...rest }: StatusBagdeProps) => {
  return (
    <>
      <Badge
        className={cn(
          status === 'applied' && 'bg-status-applied',
          status === 'interview' && 'bg-status-interview',
          status === 'offer' && 'bg-status-offer',
          status === 'rejected' && 'bg-status-rejected',
          className,
        )}
        {...rest}
      >
        {StatusLabels[status]}
      </Badge>
    </>
  )
}
