import { Button } from '@/components/ui/button'

type ChipGroupProps<T> = {
  options: T[]
  value: T
  onChange: (option: T) => void
  getLabel?: (option: T) => string
}

export const ChipGroup = <T extends string>({
  options,
  value,
  onChange,
  getLabel,
}: ChipGroupProps<T>) => {
  return (
    <div role="group" aria-label="Filter by status" className="flex flex-wrap gap-1">
      {options.map((option, index) => {
        const isActive = (option: T): boolean => value === option
        return (
          <Button
            key={index}
            onClick={() => onChange(option)}
            size="sm"
            variant={isActive(option) ? 'secondary' : 'ghost'}
            aria-pressed={isActive(option)}
          >
            {getLabel ? getLabel(option) : String(option)}
          </Button>
        )
      })}
    </div>
  )
}
