import { getDashboardStats } from '@/features/dashboard/api'
import type { DashboardStats } from '@/features/dashboard/types'

let statsPromise: Promise<DashboardStats> | null = null
export const loadStats = () => (statsPromise ??= getDashboardStats())
export const resetStats = () => {
  statsPromise = null
}
