import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Interview } from '@/features/jobs/types'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from '@/components/ui/empty'
import { Button } from '@/components/ui/button'
import { BriefcaseBusiness, Plus, Trash } from 'lucide-react'
import { formatDate } from '@/lib/formatDate'
import { CreateInterviewDialog } from '@/features/jobs/components/CreateInterviewDialog'
import { deleteInterview, updateInterview } from '@/features/jobs/api'
import { toast } from '@/components/ui/toast'
import { ApiError } from '@/lib/ApiError'
import { useOptimistic, useTransition } from 'react'

type JobInterviewsProps = {
  id: string
  interviews: Interview[]
  onChange: () => void
  onInterviewUpdated: (interview: Interview) => void
  onInterviewDelete: (interview: Interview) => void
}

type OptimisticChange = { type: 'updated'; interview: Interview } | { type: 'deleted'; id: string }

export const JobInterviews = ({
  id,
  interviews,
  onChange,
  onInterviewDelete,
  onInterviewUpdated,
}: JobInterviewsProps) => {
  const [optimisticInterviews, applyOptimisticInterviews] = useOptimistic(
    interviews, // the real state
    (current, change: OptimisticChange) => {
      switch (change.type) {
        case 'updated':
          return current.map((i) => (i.id === change.interview.id ? change.interview : i))
        case 'deleted':
          return current.filter((i) => i.id !== change.id)
        default: {
          const _exhaustive: never = change
          return _exhaustive
        }
      }
    },
  )

  const [isPending, startTransition] = useTransition()

  const onInterviewDoneChanges = async (checked: boolean, interview: Interview) => {
    startTransition(async () => {
      applyOptimisticInterviews({ type: 'updated', interview: { ...interview, done: checked } })
      try {
        const updated = await updateInterview(id, interview.id, { done: checked })
        startTransition(() => onInterviewUpdated(updated))
      } catch (e) {
        // no rollback needed: the optimistic value is dropped when the transition ends
        toast.add({
          type: 'error',
          title: "Couldn't update",
          description: e instanceof ApiError ? e.message : 'Something went wrong!',
          priority: 'high',
        })
      }
    })
  }

  const onInterviewDeleteClick = async (interview: Interview) => {
    startTransition(async () => {
      applyOptimisticInterviews({ type: 'deleted', id: interview.id })
      try {
        await deleteInterview(id, interview.id)
        toast.add({
          type: 'success',
          title: `Interview deleted successfully`,
          priority: 'high',
        })
        startTransition(() => onInterviewDelete(interview))
      } catch (e) {
        toast.add({
          type: 'error',
          title: "Couldn't delete",
          description: e instanceof ApiError ? e.message : 'Something went wrong!',
          priority: 'high',
        })
      }
    })
  }

  const onInterviewCreated = () => {
    toast.add({
      type: 'success',
      title: 'Interview Created Successfully',
      priority: 'high',
    })
    onChange()
  }

  const addInterview = () => {
    return (
      <CreateInterviewDialog
        id={id}
        trigger={
          <Button aria-label="Add interview" size="sm" variant="outline">
            <Plus className="mr-2 size-4" />
            Add interview
          </Button>
        }
        onCreated={onInterviewCreated}
      ></CreateInterviewDialog>
    )
  }

  return (
    <section className="mt-3">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold">
          Interviews
          <span className="ml-2 text-muted-foreground">({optimisticInterviews.length})</span>
        </h2>
        {addInterview()}
      </div>
      <Table>
        <TableCaption>A list of your interviews, with earliest date first.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Done</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {optimisticInterviews.length > 0 ? (
            optimisticInterviews
              .toSorted((a, b) => {
                return new Date(a.date).getTime() - new Date(b.date).getTime()
              })
              .map((i) => (
                <TableRow key={i.id}>
                  <TableCell>{formatDate(i.date, 'long')}</TableCell>
                  <TableCell>
                    <Checkbox
                      aria-label={`Interview on ${formatDate(i.date, 'long')} done`}
                      checked={i.done}
                      disabled={isPending}
                      onCheckedChange={(checked) => onInterviewDoneChanges(checked, i)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Delete interview on ${formatDate(i.date, 'long')}`}
                      disabled={isPending}
                      onClick={() => onInterviewDeleteClick(i)}
                    >
                      <Trash />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
          ) : (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={3} className="h-32 text-center text-muted-foreground">
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <BriefcaseBusiness />
                    </EmptyMedia>
                    <EmptyTitle>No interviews</EmptyTitle>
                    <EmptyDescription>No interviews yet</EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>{addInterview()}</EmptyContent>
                </Empty>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </section>
  )
}
