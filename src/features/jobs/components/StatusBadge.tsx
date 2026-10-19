import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'
import type { ApplicationStatus } from '@/features/jobs/types'
import { Badge } from '@/components/ui/badge'

type StatusBagdeProps = Omit<ComponentProps<typeof Badge>, 'children'> & {
  status: ApplicationStatus
}

const StatusInfo: Record<ApplicationStatus, { label: string; className: string }> = {
  applied: {
    label: 'Applied',
    className: 'bg-status-applied/10 text-status-applied border-status-applied/20',
  },
  interview: {
    label: 'Interview',
    className: 'bg-status-interview/10 text-status-interview border-status-interview/20',
  },
  offer: {
    label: 'Offer',
    className: 'bg-status-offer/10 text-status-offer border-status-offer/20',
  },
  rejected: {
    label: 'Rejected',
    className: 'bg-status-rejected/10 text-status-rejected border-status-rejected/20',
  },
}

export const StatusBadge = ({ status, className, ...rest }: StatusBagdeProps) => {
  return (
    <Badge className={cn(StatusInfo[status].className, className)} {...rest}>
      {StatusInfo[status].label}
    </Badge>
  )
}
