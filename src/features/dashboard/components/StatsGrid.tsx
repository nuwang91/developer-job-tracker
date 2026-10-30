import type { ReactNode } from 'react'

export const StatsGrid = ({ children }: { children: ReactNode }) => (
  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{children}</div>
)
