import { useEffect, useState } from 'react'
import { ApiError } from '@/lib/ApiError'
import { getJobs } from '@/features/jobs/api'
import type { JobApplication } from '@/features/jobs/types'

export type JobsState =
  | {
      name: 'loading'
    }
  | { name: 'success'; data: JobApplication[] }
  | { name: 'refreshing'; data: JobApplication[] }
  | { name: 'error'; message: string }
  | { name: 'refreshing-error'; message: string }

export type JobResponse = { state: JobsState; reload: () => void }

export const useJobs = (): JobResponse => {
  const [state, setState] = useState<JobsState>({ name: 'loading' })
  const [reloadKey, setReloadKey] = useState(0)

  const reload = () => {
    setReloadKey((c) => c + 1)
    setState((prev) => {
      if (prev.name === 'success' || prev.name === 'refreshing') {
        return { name: 'refreshing', data: prev.data }
      } else {
        return { name: 'loading' }
      }
    })
  }

  useEffect(() => {
    const abortController = new AbortController()
    getJobs(abortController.signal)
      .then((jobs) => {
        setState({ name: 'success', data: jobs })
      })
      .catch((e) => {
        if (e instanceof ApiError) {
          if (e.info.type === 'abort') {
            // Cancelled requests should not bother the user
            console.log('Request Aborted ' + e.stack)
            return
          }
          setState((prev) => {
            if (prev.name === 'refreshing') {
              return { name: 'refreshing-error', message: e.message }
            }
            return { name: 'error', message: e.message }
          })
        }
        return { name: 'error', message: 'Other Error' }
      })

    return () => abortController.abort()
  }, [reloadKey])

  return { state, reload }
}
