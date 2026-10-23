import { useEffect, useEffectEvent, useState } from 'react'
import { getJob } from '@/features/jobs/api'
import type { JobApplication } from '@/features/jobs/types'
import { ApiError } from '@/lib/ApiError'

export type JobState =
  | {
      name: 'loading'
    }
  | { name: 'success'; data: JobApplication }
  | { name: 'refreshing'; data: JobApplication }
  | { name: 'error'; message: string }

export type UseJobOptions = {
  id: string
  onRefreshError?: (message: string) => void
}

export const useJob = ({ id, onRefreshError }: UseJobOptions) => {
  const [state, setJob] = useState<JobState>({ name: 'loading' })
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

  const handleFailure = useEffectEvent((message: string) => {
    if (state.name === 'refreshing') {
      setJob({
        name: 'success',
        data: state.data,
      })
      if (onRefreshError) onRefreshError(message)
    } else {
      setJob({
        name: 'error',
        message,
      })
    }
  })

  useEffect(() => {
    const abortController = new AbortController()
    getJob(id, abortController.signal)
      .then((job) => {
        setJob({ name: 'success', data: job })
      })
      .catch((e) => {
        if (e instanceof ApiError && e.info.type === 'http' && e.info.status === 404) {
          handleFailure(e.message)
        }
      })

    return () => abortController.abort()
  }, [id, reloadKey])

  return { state, reload }
}
