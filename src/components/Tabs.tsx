import { ChipGroup } from '@/components/ChipGroup'

export type TabsProps<T> = {
  option: T
  onTabChange: (tab: T) => void
  options: readonly T[]
}

export const Tabs = <T extends string>({ option, options, onTabChange }: TabsProps<T>) => {
  return (
    <div className="mt-6">
      <ChipGroup
        options={options}
        ariaLabel="Job detail tabs"
        value={option}
        onChange={onTabChange}
      ></ChipGroup>
    </div>
  )
}
