import { Input } from '@/components/ui/input'
import { ChipGroup } from '@/components/ChipGroup'
import { type StatusFilter } from '@/features/jobs/types'

type JobFiltersProps = {
  searchText: string
  status: StatusFilter
  statuses: StatusFilter[]
  searchTextChange: React.Dispatch<React.SetStateAction<string>>
  statusChange: React.Dispatch<React.SetStateAction<StatusFilter>>
}

export const JobFilters = ({
  searchText,
  searchTextChange,
  status,
  statusChange,
  statuses,
}: JobFiltersProps) => {
  return (
    <>
      <Input value={searchText} onChange={(e) => searchTextChange(e.target.value)}></Input>
      <ChipGroup
        options={statuses}
        value={status}
        onChange={(option) => statusChange(option)}
      ></ChipGroup>
    </>
  )
}
