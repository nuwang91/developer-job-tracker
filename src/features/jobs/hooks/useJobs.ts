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

export type JobResponse = { state: JobsState; reload: () => void }

export const useJobs = (): JobResponse => {
  const [state, setState] = useState<JobsState>({ name: 'loading' })
  // A boolean you flip back and forth is the wrong tool for “do this again”. Use a counter you never reset
  const [reloadKey, setReloadKey] = useState(0)

  const reload = () => {
    setReloadKey((c) => c + 1)
    if (state.name === 'success') {
      setState({ name: 'refreshing', data: state.data })
    } else {
      setState({ name: 'loading' })
    }
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
          setState({ name: 'error', message: e.message })
        }
      })

    return () => abortController.abort()
  }, [reloadKey])

  return { state, reload }
}
