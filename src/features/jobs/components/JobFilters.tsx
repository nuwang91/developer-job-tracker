import { Input } from '@/components/ui/input'
import { ChipGroup } from '@/components/ChipGroup'
import { type StatusFilter } from '@/features/jobs/types'

type JobFiltersProps = {
  searchText: string
  status: StatusFilter
  statuses: readonly StatusFilter[]
  onSearchTextChange: (value: string) => void
  onStatusChange: (value: StatusFilter) => void
}

export const JobFilters = ({
  searchText,
  onSearchTextChange,
  status,
  onStatusChange,
  statuses,
}: JobFiltersProps) => {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
