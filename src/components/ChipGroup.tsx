import { Button } from '@/components/ui/button'

type ChipGroupProps<T> = {
  options: readonly T[]
  value: T
  ariaLabel: string
  onChange: (option: T) => void
  getLabel?: (option: T) => string
}

export const ChipGroup = <T extends string>({
  options,
  value,
  ariaLabel,
  onChange,
  getLabel,
}: ChipGroupProps<T>) => {
  return (
    <div role="group" aria-label={ariaLabel} className="flex flex-wrap gap-1">
      {options.map((option) => {
        const isActive = value === option
        return (
          <Button
            key={option}
            onClick={() => onChange(option)}
            size="sm"
            variant={isActive ? 'secondary' : 'ghost'}
            aria-pressed={isActive}
          >
            {getLabel ? getLabel(option) : option}
          </Button>
        )
      })}
    </div>
  )
}
