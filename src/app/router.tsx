import { createBrowserRouter } from 'react-router'
import { AppLayout } from '@/app/AppLayout'
import { AboutPage } from '@/pages/AboutPage'
import { JobDetailsPage } from '@/pages/JobDetailsPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { HomePage } from '@/pages/HomePage'
import { JobsPage } from '@/pages/JobsPage'

// Vite's BASE_URL is '/developer-job-tracker/' in builds and '/' in dev
const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <AppLayout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: 'jobs', element: <JobsPage /> },
        { path: 'jobs/:id', element: <JobDetailsPage /> }, // placeholder until 4.6b
        { path: 'about', element: <AboutPage /> },
        { path: '*', element: <NotFoundPage /> },
      ],
    },
  ],
  { basename },
)
