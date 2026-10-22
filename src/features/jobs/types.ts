// Keep the exact values and make the array readonly
export const APPLICATION_STATUSES = ['applied', 'interview', 'offer', 'rejected'] as const

export const ALL = 'all'

// Get the TypeScript type of the array & Get the union of all element types
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number]

export const STATUS_FILTER_OPTIONS = [ALL, ...APPLICATION_STATUSES] as const

// Union of all application statuses and the "all" option
export type StatusFilter = (typeof STATUS_FILTER_OPTIONS)[number]

export interface JobApplication {
  id: string
  company: string
  role: string
  status: ApplicationStatus
  notes?: string
  createdAt: string
  interviews: Interview[]
}

export interface Interview {
  id: string
  date: string
  done: boolean
}

export type JobInput = Pick<JobApplication, 'company' | 'role' | 'status' | 'notes'>
