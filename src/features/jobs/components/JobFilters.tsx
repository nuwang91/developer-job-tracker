import { Input } from '@/components/ui/input'
import { ChipGroup } from '@/components/ChipGroup'
import { type StatusFilter } from '@/features/jobs/types'
import { cn } from 'cn'

type JobFiltersProps = {
  searchText: string
  status: StatusFilter
  statuses: readonly StatusFilter[]
  className?: string
  onSearchTextChange: (value: string) => void
  onStatusChange: (value: StatusFilter) => void
}

export const JobFilters = ({
  searchText,
  onSearchTextChange,
  status,
  onStatusChange,
  statuses,
  className,
}: JobFiltersProps) => {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <Input
        value={searchText}
        onChange={(e) => onSearchTextChange(e.target.value)}
        aria-label="Search jobs"
        placeholder="Job Search"
      ></Input>
      <ChipGroup
        options={statuses}
        value={status}
        ariaLabel="Filter by status"
        onChange={(option) => onStatusChange(option)}
      ></ChipGroup>
    </div>
  )
}
