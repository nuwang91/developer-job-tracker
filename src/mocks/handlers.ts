import { http, HttpResponse, delay } from 'msw'
import type { Interview, JobApplication } from '@/features/jobs/types'
import { mockJobs } from '@/features/jobs/mockJobs'

// In-memory "database". Resets on page reload (that's fine for now).
let jobs: JobApplication[] = [...mockJobs]

// What the "backend" accepts. The server owns id, createdAt and interviews.
type CreateJobBody = Pick<JobApplication, 'company' | 'role' | 'status' | 'notes'>
type UpdateJobBody = Partial<CreateJobBody>
type CreateJobInterviewBody = Pick<Interview, 'date'>
type UpdateJobInterviewBody = Pick<Interview, 'done'>
type ErrorBody = { message: string }

const notFound = (message?: string) =>
  HttpResponse.json<ErrorBody>({ message: message ?? 'Job not found' }, { status: 404 })

export const handlers = [
  http.get('/api/jobs', async () => {
    await delay(2000)
    return HttpResponse.json({ message: 'Boom' }, { status: 500 })
    // return new HttpResponse('not json', { headers: { 'Content-Type': 'application/json' } })
    return HttpResponse.json(jobs)
  }),

  http.get<{ id: string }>('/api/jobs/:id', async ({ params }) => {
    await delay()
    const job = jobs.find((j) => j.id === params.id)
    return job ? HttpResponse.json(job) : notFound()
  }),

  http.post<never, CreateJobBody>('/api/jobs', async ({ request }) => {
    await delay()
    const body = await request.json()
    const job: JobApplication = {
      ...body,
      id: crypto.randomUUID(),
      interviews: [],
      createdAt: new Date().toISOString(),
    }
    jobs = [...jobs, job]
    return HttpResponse.json(job, { status: 201 })
  }),

  http.patch<{ id: string }, UpdateJobBody>('/api/jobs/:id', async ({ params, request }) => {
    await delay()
    const existing = jobs.find((j) => j.id === params.id)
    if (!existing) return notFound()
    const updated: JobApplication = { ...existing, ...(await request.json()), id: existing.id }
    jobs = jobs.map((j) => (j.id === updated.id ? updated : j))
    return HttpResponse.json(updated)
  }),

  http.delete<{ id: string }>('/api/jobs/:id', async ({ params }) => {
    await delay()
    if (!jobs.some((j) => j.id === params.id)) return notFound()
    jobs = jobs.filter((j) => j.id !== params.id)
    return new HttpResponse(null, { status: 204 })
  }),

  http.post<{ id: string }, CreateJobInterviewBody>(
    '/api/jobs/:id/interviews',
    async ({ params, request }) => {
      await delay()
      const existing = jobs.find((j) => j.id === params.id)
      if (!existing) return notFound()

      const body = await request.json()
      const interview: Interview = {
        ...body,
        id: crypto.randomUUID(),
        done: false,
      }
      const updatedJob: JobApplication = {
        ...existing,
        interviews: [...existing.interviews, interview],
      }
      jobs = jobs.map((j) => (j.id === updatedJob.id ? updatedJob : j))
      return HttpResponse.json(interview, { status: 201 })
    },
  ),

  http.patch<{ id: string; interviewId: string }, UpdateJobInterviewBody>(
    '/api/jobs/:id/interviews/:interviewId',
    async ({ params, request }) => {
      await delay()
      const existingJob = jobs.find((j) => j.id === params.id)
      if (!existingJob) return notFound()

      const existingInterview = existingJob.interviews.find((i) => i.id === params.interviewId)
      if (!existingInterview) return notFound('Interview not found')

      const updatedInterview: Interview = {
        ...existingInterview,
        ...(await request.json()),
        id: existingInterview.id,
      }
      const updatedJob: JobApplication = {
        ...existingJob,
        interviews: existingJob.interviews.map((i) =>
          i.id === updatedInterview.id ? updatedInterview : i,
        ),
      }
      jobs = jobs.map((j) => (j.id === updatedJob.id ? updatedJob : j))
      return HttpResponse.json(updatedInterview)
    },
  ),

  http.delete<{ id: string; interviewId: string }>(
    '/api/jobs/:id/interviews/:interviewId',
    async ({ params }) => {
      await delay()
      const existingJob = jobs.find((j) => j.id === params.id)
      if (!existingJob) return notFound()

      const existingInterview = existingJob.interviews.find((i) => i.id === params.interviewId)
      if (!existingInterview) return notFound('Interview not found')

      const updatedJob: JobApplication = {
        ...existingJob,
        interviews: existingJob.interviews.filter((i) => i.id !== existingInterview.id),
      }

      jobs = jobs.map((j) => (j.id === updatedJob.id ? updatedJob : j))
      return new HttpResponse(null, { status: 204 })
    },
  ),
]
