import type { ReactNode } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { StatusBadge } from '@/features/jobs/components/StatusBadge'
import { Trash2 } from 'lucide-react'
import type { JobApplication } from '@/features/jobs/types'
import { Button, buttonVariants } from '@/components/ui/button'
import { formatDate } from '@/lib/formatDate'
import { Link } from 'react-router'

type JobCardProps = Omit<JobApplication, 'notes'> & {
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
}: JobCardProps) => {
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
        Applied {formatDate(createdAt, 'short')} · {interviews.length} interview(s)
      </CardContent>
      <CardFooter className="justify-end gap-2">
        {footer}
        <Link to={`/jobs/${id}`} className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
          View
        </Link>
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
