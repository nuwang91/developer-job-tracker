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
import { useState } from 'react'

type JobInterviewsProps = {
  id: string
  interviews: Interview[]
  onChange: () => void
}
export const JobInterviews = ({ id, interviews, onChange }: JobInterviewsProps) => {
  const [pending, setPending] = useState(false)

  const onDoneChanges = async (checked: boolean, interviewId: string) => {
    setPending(true)
    try {
      await updateInterview(id, interviewId, { done: checked })
      onChange()
    } catch (e) {
      toast.add({
        type: 'error',
        title: "Couldn't update",
        description: e instanceof ApiError ? e.message : 'Something went wrong!',
        priority: 'high',
      })
    } finally {
      setPending(false)
    }
  }

  const onInterviewDelete = async (interviewId: string) => {
    setPending(true)
    try {
      await deleteInterview(id, interviewId)
      toast.add({
        type: 'success',
        title: `Interview deleted successfully`,
        priority: 'high',
      })
      onChange()
    } catch (e) {
      toast.add({
        type: 'error',
        title: "Couldn't delete",
        description: e instanceof ApiError ? e.message : 'Something went wrong!',
        priority: 'high',
      })
    } finally {
      setPending(false)
    }
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
          <span className="ml-2 text-muted-foreground">({interviews.length})</span>
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
          {interviews.length > 0 ? (
            interviews
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
                      disabled={pending}
                      onCheckedChange={(checked) => onDoneChanges(checked, i.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Delete interview on ${formatDate(i.date, 'long')}`}
                      disabled={pending}
                      onClick={() => onInterviewDelete(i.id)}
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
