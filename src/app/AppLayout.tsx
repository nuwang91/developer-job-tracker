import { cn } from '@/lib/utils'
import { NavLink, Outlet } from 'react-router'
import { Toaster } from '@/components/ui/toast'

export const AppLayout = () => {
  return (
    <>
      <header className="border-b">
        <nav className="mx-auto flex max-w-3xl items-center gap-4 p-4 text-sm">
          <NavLink
            className={({ isActive }) =>
              cn(
                'text-muted-foreground hover:text-foreground',
                isActive && 'font-medium text-foreground',
              )
            }
            to="/"
          >
            Home
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              cn(
                'text-muted-foreground hover:text-foreground',
                isActive && 'font-medium text-foreground',
              )
            }
            to="/jobs"
          >
            Jobs
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              cn(
                'text-muted-foreground hover:text-foreground',
                isActive && 'font-medium text-foreground',
              )
            }
            to="/about"
          >
            About
          </NavLink>
        </nav>
      </header>
      <main className="mx-auto max-w-3xl p-6">
        <Outlet />
      </main>
      <Toaster />
    </>
  )
}
