import { useEffect, useState } from 'react'
import { ApiError } from '../../../lib/ApiError'
import { getJobs } from '../api'
import type { JobApplication } from '../types'

export type State =
  | {
      name: 'loading' | 'reload'
    }
  | { name: 'success'; data: JobApplication[] }
  | { name: 'error'; message: string }

export type Response = { state: State; reload: boolean }

export const useJobs = (reloadKey: number): Response => {
  const [response, setResponse] = useState<Response>({ state: { name: 'loading' }, reload: false })

  useEffect(() => {
    const abortController = new AbortController()
    getJobs(abortController.signal)
      .then((jobs) => {
        setResponse({ state: { name: 'success', data: jobs }, reload: reloadKey > 0 })
      })
      .catch((e) => {
        if (e instanceof ApiError) {
          if (e.info.type === 'abort') {
            // Cancelled requests should not bother the user
            console.log('Request Aborted ' + e.stack)
            return
          }
          setResponse({ state: { name: 'error', message: e.message }, reload: reloadKey > 0 })
        }
      })

    return () => abortController.abort()
  }, [reloadKey])

  return response
}
