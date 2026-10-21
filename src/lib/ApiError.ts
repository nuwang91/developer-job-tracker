export type ApiErrorInfo =
  | { type: 'http'; status: number; message: string }
  | { type: 'network' | 'parse' | 'abort'; message: string }

export class ApiError extends Error {
  readonly info: ApiErrorInfo
  constructor(info: ApiErrorInfo) {
    super(info.message)
    this.name = 'ApiError'
    this.info = info
  }
}
