import { useEffect, useEffectEvent, useState } from 'react'
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

type UseJobsOptions = { onRefreshError?: (message: string) => void }

export const useJobs = ({ onRefreshError }: UseJobsOptions): JobResponse => {
  const [state, setState] = useState<JobsState>({ name: 'loading' })
  const [reloadKey, setReloadKey] = useState(0)

  const reload = () => {
    setReloadKey((c) => c + 1)
    setState((prev) => {
      // Can delete multiple while on refreshing or in success
      if (prev.name === 'success' || prev.name === 'refreshing') {
        // Send previous data so that until we receive the actual response, we dont flicker the UI
        return { name: 'refreshing', data: prev.data }
      } else {
        return { name: 'loading' }
      }
    })
  }

  // An Effect Event: always sees the LATEST state and onRefreshError,
  // but isn't a dependency, so the Effect doesn't re-run when they change.
  const handleFailure = useEffectEvent((message: string) => {
    // An error happens while on refresh, then send the previous data with success
    if (state.name === 'refreshing') {
      // go back to 'success' with the data you still have,
      // then call onRefreshError (it's optional, so use ?.)

      setState({ name: 'success', data: state.data })
      if (onRefreshError) onRefreshError(message)
    } else {
      // blocking error (first load or retry failed)
      setState({ name: 'error', message: message })
    }
  })

  useEffect(() => {
    const abortController = new AbortController()
    getJobs(abortController.signal)
      .then((jobs) => {
        setState({ name: 'success', data: jobs })
      })
      .catch((e) => {
        if (e instanceof ApiError && e.info.type === 'abort') return
        handleFailure(e.message)
      })

    return () => abortController.abort()
  }, [reloadKey])

  return { state, reload }
}
