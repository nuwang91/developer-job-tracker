import { useEffect, useState } from 'react'
import { getJob } from '@/features/jobs/api'
import type { JobApplication } from '@/features/jobs/types'
import { ApiError } from '@/lib/ApiError'

export type jobState =
  | {
      name: 'loading'
    }
  | { name: 'success'; data: JobApplication }
  | { name: 'refreshing'; data: JobApplication }
  | { name: 'error'; message: string }

export const useJob = (id: string) => {
  const [job, setJob] = useState<jobState>({ name: 'loading' })
  const [reloadKey, setReloadKey] = useState(0)

  const reload = () => {
    setReloadKey((k) => k + 1)
    setJob((prev) => {
      if (prev.name === 'success' || prev.name === 'refreshing') {
        return { name: 'refreshing', data: prev.data }
      }
      return { name: 'loading' }
    })
  }

  useEffect(() => {
    const abortController = new AbortController()
    getJob(id, abortController.signal)
      .then((job) => {
        setJob({ name: 'success', data: job })
      })
      .catch((e) => {
        if (e instanceof ApiError && e.info.type === 'abort') return
        setJob({
          name: 'error',
          message: e instanceof ApiError ? e.message : 'Something went Wrong!',
        })
      })

    return () => abortController.abort()
  }, [id, reloadKey])

  return { job, reload }
}
