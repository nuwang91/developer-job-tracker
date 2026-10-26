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

type JobInterviewsProps = {
  id: string
  interviews: Interview[]
  onCreated: () => void
  onUpdated: () => void
  onDeleted: () => void
}
export const JobInterviews = ({
  id,
  interviews,
  onCreated,
  onUpdated,
  onDeleted,
}: JobInterviewsProps) => {
  const onDoneChanges = async (checked: boolean, interviewId: string) => {
    try {
      const interview: Interview = await updateInterview(id, interviewId, { done: checked })
      toast.add({
        type: 'success',
        title: `Interview on (${formatDate(interview.date, 'short')}) updated successfully`,
        priority: 'high',
      })
      onUpdated()
    } catch (e) {
      toast.add({
        type: 'error',
        title: "Couldn't update",
        description: e instanceof ApiError ? e.message : 'Something went wrong!',
        priority: 'high',
      })
    }
  }

  const onInterviewDelete = async (interviewId: string) => {
    try {
      await deleteInterview(id, interviewId)
      toast.add({
        type: 'success',
        title: `Interview deleted successfully`,
        priority: 'high',
      })
      onDeleted()
    } catch (e) {
      toast.add({
        type: 'error',
        title: "Couldn't delete",
        description: e instanceof ApiError ? e.message : 'Something went wrong!',
        priority: 'high',
      })
    }
  }

  const onInterviewCreated = () => {
    toast.add({
      type: 'success',
      title: 'Interview Created Successfully',
      priority: 'high',
    })
    onCreated()
  }

  const CreateInterviewDialogContainer = () => {
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
        <h3 className="text-sm font-semibold">
          Interviews
          <span className="ml-2 text-muted-foreground">({interviews.length})</span>
        </h3>
        {CreateInterviewDialogContainer()}
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
                return new Date(b.date).getTime() - new Date(a.date).getTime()
              })
              .map((i) => (
                <TableRow key={i.id}>
                  <TableCell>{formatDate(i.date, 'long')}</TableCell>
                  <TableCell>
                    <Checkbox
                      aria-label="Mark as checked"
                      aria-checked={i.done}
                      defaultChecked={i.done}
                      onCheckedChange={(checked) => onDoneChanges(checked, i.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button aria-label="Delete Interview" onClick={() => onInterviewDelete(i.id)}>
                      <Trash />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
          ) : (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <BriefcaseBusiness />
                    </EmptyMedia>
                    <EmptyTitle>No data</EmptyTitle>
                    <EmptyDescription>No data found</EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>{CreateInterviewDialogContainer()}</EmptyContent>
                </Empty>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </section>
  )
}
