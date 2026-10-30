import { ChipGroup } from '@/components/ChipGroup'

type SectionSwitcherProps<T> = {
  option: T
  onTabChange: (tab: T) => void
  options: readonly T[]
  ariaLabel: string
  getLabel?: (option: T) => string
}

export const SectionSwitcher = <T extends string>({
  option,
  options,
  onTabChange,
  ariaLabel,
  getLabel,
}: SectionSwitcherProps<T>) => {
  return (
    <ChipGroup
      options={options}
      ariaLabel={ariaLabel}
      value={option}
      onChange={onTabChange}
      getLabel={getLabel}
    ></ChipGroup>
  )
}
