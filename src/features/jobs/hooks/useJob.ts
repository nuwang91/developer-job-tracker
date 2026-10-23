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
  | { name: 'error'; message: string; status?: number }

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

  const handleFailure = useEffectEvent((e: unknown) => {
    if (state.name === 'refreshing') {
      setJob({
        name: 'success',
        data: state.data,
      })
      if (onRefreshError && e instanceof ApiError) onRefreshError(e.message)
    } else {
      setJob({
        name: 'error',
        message: e instanceof ApiError ? e.message : 'Something went wrong!',
        status: e instanceof ApiError && e.info.type === 'http' ? e.info.status : undefined,
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
        if (e instanceof ApiError && e.info.type === 'abort') return
        handleFailure(e)
      })

    return () => abortController.abort()
  }, [id, reloadKey])

  return { state, reload }
}
