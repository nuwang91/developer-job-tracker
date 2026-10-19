import type { ReactNode } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from '../../../components/ui/card'
import { StatusBadge } from './StatusBadge'
import { Trash2 } from 'lucide-react'
import type { JobApplication } from '../types'
import { Button } from '../../../components/ui/button'
import { formatDate } from '../../../lib/formatDate'

type JobCard = Omit<JobApplication, 'notes'> & {
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  footer?: ReactNode
}

export const JobCard = ({
  id,
  company,
  role,
  status,
  interviews,
  createdAt,
  footer,
  onDelete,
  onSelect,
}: JobCard) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{role}</CardTitle>
        <CardDescription>{company}</CardDescription>
        <CardAction>
          <StatusBadge status={status} />
        </CardAction>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Applied {formatDate(createdAt, 'short')} · {interviews.length} interviews
      </CardContent>
      <CardFooter className="justify-end gap-2">
        {footer}
        <Button
          variant="ghost"
          size="sm"
          aria-label={`View ${role} at ${company}`}
          onClick={() => onSelect(id)}
        >
          View
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Delete ${role} at ${company}`}
          onClick={() => onDelete(id)}
        >
          <Trash2 />
        </Button>
      </CardFooter>
    </Card>
  )
}
