import { request } from '@/lib/api-client'
import type { JobApplication, JobInput } from '@/features/jobs/types'

type JobUpdate = Partial<JobInput>

export const getJobs = (signal?: AbortSignal): Promise<JobApplication[]> => {
  return request({ path: '/jobs', signal })
}

export const getJob = (id: string, signal?: AbortSignal): Promise<JobApplication> => {
  return request({ path: `/jobs/${encodeURIComponent(id)}`, signal })
}

export const createJob = (payload: JobInput): Promise<JobApplication> => {
  return request({
    path: '/jobs',
    payload,
    method: 'POST',
  })
}

export const updateJob = (id: string, payload: JobUpdate): Promise<JobApplication> => {
  return request({
    path: `/jobs/${encodeURIComponent(id)}`,
    payload,
    method: 'PATCH',
  })
}

export const deleteJob = (id: string): Promise<void> => {
  return request({ path: `/jobs/${encodeURIComponent(id)}`, method: 'DELETE' })
}
