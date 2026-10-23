import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/index.css'
import { RouterProvider } from 'react-router'
import { router } from '@/app/router.tsx'

// To make sure mock server is up before React renders the UI
async function enableMocking() {
  if (!import.meta.env.DEV) return
  const { worker } = await import('./mocks/browser')
  await worker.start()
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  )
})
