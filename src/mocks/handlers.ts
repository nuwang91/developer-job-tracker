import { http, HttpResponse, delay } from 'msw'
import type { JobApplication } from '@/features/jobs/types'
import { mockJobs } from '@/features/jobs/mockJobs'

// In-memory "database". Resets on page reload (that's fine for now).
let jobs: JobApplication[] = [...mockJobs]

// What the "backend" accepts. The server owns id, createdAt and interviews.
type CreateJobBody = Pick<JobApplication, 'company' | 'role' | 'status' | 'notes'>
type UpdateJobBody = Partial<CreateJobBody>
type ErrorBody = { message: string }

const notFound = () => HttpResponse.json<ErrorBody>({ message: 'Job not found' }, { status: 404 })

export const handlers = [
  http.get('/api/jobs', async () => {
    await delay(2000)
    // return HttpResponse.json({ message: 'Boom' }, { status: 500 })
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
]
