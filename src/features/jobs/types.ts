// Keep the exact values and make the array readonly
export const APPLICATION_STATUSES = ['applied', 'interview', 'offer', 'rejected'] as const

// Get the TypeScript type of the array & Get the union of all element types
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number]

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
