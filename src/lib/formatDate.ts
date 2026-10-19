export type DateDisplay = 'short' | 'long'

export const formatDate = (date: string, format: DateDisplay): string => {
  return format === 'long'
    ? new Date(date).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date(date).toLocaleDateString('en-AU')
}
