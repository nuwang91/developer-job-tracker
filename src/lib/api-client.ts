import { ApiError } from './ApiError'

type HttpMethod = 'POST' | 'GET' | 'PATCH' | 'DELETE'
type Options = {
  path: string
  method?: HttpMethod
  payload?: unknown
  signal?: AbortSignal
  headers?: HeadersInit
}

const BASE_URL = import.meta.env.VITE_BASE_API_URL ?? '/api'

export const request = async <T>(options: Options): Promise<T> => {
  const { path, method = 'GET', payload, signal, headers } = options
  let response: Response

  try {
    response = await fetch(BASE_URL + path, {
      method,
      ...(payload ? { body: JSON.stringify(payload) } : {}),
      ...(signal && { signal }),
      ...(headers && { headers }),
    })
  } catch (e) {
    if (e instanceof Error && e.name === 'AbortError') {
      throw new ApiError({ message: 'Aborted', type: 'abort' })
    }
    throw new ApiError({ message: 'Network Error', type: 'network' })
  }

  if (!response.ok) {
    let message = `Request Failed ${response.statusText}`

    try {
      const errorResponse = response.json()
      if (
        typeof errorResponse === 'object' &&
        errorResponse != null &&
        'message' in errorResponse &&
        typeof errorResponse.message === 'string'
      ) {
        message = errorResponse.message
      }
    } catch (e) {
      // Parsing error on failed response
    }

    throw new ApiError({ message, status: response.status, type: 'http' })
  }

  if (response.status === 204) {
    return undefined as T
  }

  try {
    return response.json()
  } catch (e) {
    throw new ApiError({ message: 'Invalid JSON', type: 'parse' })
  }
}
