import type { JobInput } from '@/features/jobs/types'

export const validateJob = (values: JobInput): Partial<Record<keyof JobInput, string>> => {
  const errors: Partial<Record<keyof JobInput, string>> = {}

  if (!values.company.trim()) {
    errors.company = 'Company is required'
  }

  if (!values.role.trim()) {
    errors.role = 'Role is required'
  }

  if (values.company.length > 100) {
    errors.company = 'Company name should be within 100 characters'
  }

  if (values.role.length > 150) {
    errors.role = 'Role should be within 150 characters'
  }

  if (values.notes && values.notes.length > 2000) {
    errors.notes = 'Notes should be within 2000 characters'
  }

  if (!values.status.trim()) {
    errors.status = 'Status is required'
  }

  return errors
}
