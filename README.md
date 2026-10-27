# Developer Job Tracker

A small React app for tracking job applications: company, role, status (`applied` → `interview` → `offer` / `rejected`), notes and interviews. It's a front-end-only project for now. In development, a mock REST API runs in the browser via [MSW](https://mswjs.io).

## AI usage

[Claude Code](https://claude.com/claude-code) was used only to set up project configuration and tooling: ESLint, Prettier, commitlint, husky, commitizen, TypeScript and Vite config. The application code (components, types, mock API and data layer) is written by hand. [`CLAUDE.md`](CLAUDE.md) gives Claude Code context about the repo.

## Features

- **Job list** (`/jobs`): search by company or role and filter by status. Filters are stored in the URL (`?q=…&status=…`), so a filtered view can be bookmarked or shared. The list shows loading, empty and error states, with a retry button.
- **Create a job:** dialog form with client-side validation. Company and role are required, with length limits on company, role and notes.
- **Job details** (`/jobs/:id`): view, edit and delete a job. A missing job shows a "not found" state.
- **Interviews:** each job has a table of interviews. You can add one with a date picker, mark it done or delete it.
- **Feedback:** toasts for create and error events, plus spinners and skeletons while requests are pending.

## Tech stack

| Area          | Choice                                                                                          |
| ------------- | ----------------------------------------------------------------------------------------------- |
| UI            | React 19 (form actions: `useActionState`, `useFormStatus`), TypeScript 6                        |
| Routing       | React Router 8 (`createBrowserRouter`, URL search params)                                       |
| Build / dev   | Vite 8 (`@vitejs/plugin-react`)                                                                 |
| Styling       | Tailwind CSS v4 (`@tailwindcss/vite`), `tw-animate-css`, Geist variable font                    |
| Components    | [shadcn/ui](https://ui.shadcn.com) (`base-nova` style on `@base-ui/react`), lucide icons        |
| Dates         | `date-fns`, `react-day-picker` (shadcn calendar)                                                |
| Variants      | `class-variance-authority` + `cn()`                                                             |
| Mock backend  | MSW 3 service worker (dev only)                                                                 |
| Quality gates | ESLint (flat config), Prettier, husky (lint-staged + commitlint), commitizen, GitHub Actions CI |

## Getting started

```bash
npm install      # also installs husky git hooks via the `prepare` script
npm run dev      # http://localhost:5173
```

In dev, `src/main.tsx` starts the MSW worker **before** rendering React, so `/api/*` requests are handled from the first render. The mock worker is not started in production builds.

### Environment variables

| Variable            | Default | Used by                                                 |
| ------------------- | ------- | ------------------------------------------------------- |
| `VITE_BASE_API_URL` | `/api`  | `src/lib/api-client.ts`, the prefix for every API call. |

It's set in `.env` and typed in `src/vite-env.d.ts`. If you point it at a real backend, update the MSW handler paths too, or turn MSW off.

## Scripts

| Command                | What it does                                                         |
| ---------------------- | -------------------------------------------------------------------- |
| `npm run dev`          | Vite dev server with HMR (+ MSW mock API)                            |
| `npm run build`        | Type-check with `tsc -b` (project references), then build to `dist/` |
| `npm run preview`      | Serve the production build locally                                   |
| `npm run lint`         | ESLint over the repo                                                 |
| `npm run format`       | Prettier write                                                       |
| `npm run format:check` | Prettier check (useful in CI)                                        |
| `npm run commit`       | Interactive Conventional Commit prompt                               |

There is no test runner yet.

## Project structure

```
src/
├── main.tsx                   # Entry: starts MSW (dev), renders <RouterProvider />
├── index.css                  # Tailwind v4 + shadcn theme tokens
├── vite-env.d.ts              # Typed import.meta.env
├── app/
│   ├── router.tsx             # Route table + basename from Vite's BASE_URL
│   └── AppLayout.tsx          # Header nav (NavLink) + <Outlet />
├── pages/                     # Route components: Home, Jobs, JobDetails, About, NotFound
├── components/
│   ├── ChipGroup.tsx          # Shared selectable chip group
│   ├── EmptyState.tsx         # Shared empty / error placeholders
│   ├── ErrorState.tsx
│   └── ui/                    # shadcn primitives (dialog, field, table, calendar, toast, …)
├── features/
│   └── jobs/
│       ├── types.ts           # JobApplication, Interview, input types, status unions
│       ├── api.ts             # Job + interview endpoints (built on lib/api-client)
│       ├── validateJob.ts     # Job form validation
│       ├── mockJobs.ts        # Seed data for MSW
│       ├── hooks/             # useJobs (list), useJob (single job + interviews)
│       └── components/        # JobCard, JobFilters, JobForm, JobDetails, JobInterviews,
│                              # Create/Edit dialogs, InterviewForm, FormFooter, StatusBadge
├── lib/
│   ├── api-client.ts          # Typed fetch wrapper: request<T>()
│   ├── ApiError.ts            # Error with discriminated `info`
│   ├── formatDate.ts          # en-AU date formatting (short / long)
│   └── utils.ts               # cn() helper
└── mocks/
    ├── browser.ts             # MSW worker setup
    └── handlers.ts            # In-memory /api/jobs REST handlers
public/
└── mockServiceWorker.js       # Generated by MSW — don't edit by hand
```

Code is organized **by feature** (`src/features/<feature>/`). Route-level components live in `src/pages/`, shared UI in `src/components/` and generic helpers in `src/lib/`. Import from `src` using the `@/` alias (configured in `vite.config.ts` and `tsconfig.app.json`).

## Routes

| Path        | Page             | Notes                                            |
| ----------- | ---------------- | ------------------------------------------------ |
| `/`         | `HomePage`       | Placeholder                                      |
| `/jobs`     | `JobsPage`       | List, filters (`?q=`, `?status=`), create dialog |
| `/jobs/:id` | `JobDetailsPage` | Job details, edit/delete, interviews             |
| `/about`    | `AboutPage`      | Placeholder                                      |
| `*`         | `NotFoundPage`   |                                                  |

The router's `basename` comes from `import.meta.env.BASE_URL`, so the same routes work at `/` in dev and at `/developer-job-tracker/` on GitHub Pages.

## Domain model

Defined in [`src/features/jobs/types.ts`](src/features/jobs/types.ts):

```ts
interface JobApplication {
  id: string
  company: string
  role: string
  status: 'applied' | 'interview' | 'offer' | 'rejected'
  notes?: string
  createdAt: string // ISO date
  interviews: Interview[]
}

interface Interview {
  id: string
  date: string
  done: boolean
}

type JobInput = Pick<JobApplication, 'company' | 'role' | 'status' | 'notes'>
type InterviewInput = Pick<Interview, 'date'>
type InterviewUpdate = Pick<Interview, 'done'>
```

Statuses come from the `APPLICATION_STATUSES` `as const` array, and the TypeScript unions are derived from it. `isValidStatus()` guards values read from the URL. To add a status, change that array, add its entry to the `StatusInfo` record in `StatusBadge.tsx` and add matching `--status-<name>` and `--color-status-<name>` tokens in `index.css`.

## Data layer

- **`request<T>()`** (`src/lib/api-client.ts`) prefixes `VITE_BASE_API_URL`, sends the payload as JSON and supports `AbortSignal`. It throws an `ApiError` whose `info.type` is one of the following:
  - `http`: non-2xx response. `status` and the server's `message` are included when present.
  - `network`: the request failed to send.
  - `parse`: the response wasn't valid JSON.
  - `abort`: the request was cancelled.
- **`src/features/jobs/api.ts`** has one function per endpoint: `getJobs`, `getJob`, `createJob`, `updateJob`, `deleteJob`, `createInterview`, `updateInterview`, `deleteInterview`.
- **Hooks:** `useJobs` and `useJob` handle loading, error and reload state, and abort in-flight requests on unmount. There's no global state library; each page fetches what it needs.
- **Forms:** `JobForm` uses controlled inputs with `validateJob`. `InterviewForm` uses React 19 form actions (`useActionState`), and `FormFooter` reads the pending state with `useFormStatus`.

## Mock API

`src/mocks/handlers.ts` implements an in-memory REST API seeded from `mockJobs`. State resets on page reload, and handlers add a simulated `delay()`. `GET /api/jobs` waits 2 seconds so loading states are visible, and it has commented-out error responses you can switch on to test error handling.

| Method   | Path                                    | Body                                | Response                        |
| -------- | --------------------------------------- | ----------------------------------- | ------------------------------- |
| `GET`    | `/api/jobs`                             | —                                   | `200` `JobApplication[]`        |
| `GET`    | `/api/jobs/:id`                         | —                                   | `200` job / `404`               |
| `POST`   | `/api/jobs`                             | `{ company, role, status, notes? }` | `201` created job               |
| `PATCH`  | `/api/jobs/:id`                         | partial of the above                | `200` updated job / `404`       |
| `DELETE` | `/api/jobs/:id`                         | —                                   | `204` / `404`                   |
| `POST`   | `/api/jobs/:id/interviews`              | `{ date }`                          | `201` created interview / `404` |
| `PATCH`  | `/api/jobs/:id/interviews/:interviewId` | `{ done }`                          | `200` updated interview / `404` |
| `DELETE` | `/api/jobs/:id/interviews/:interviewId` | —                                   | `204` / `404`                   |

The server owns `id`, `createdAt` and interview ids. Errors use the shape `{ message: string }` (`Job not found` / `Interview not found`).

If MSW is upgraded, regenerate the worker file with `npx msw init public`.

## Conventions

- **TypeScript:** `tsconfig.app.json` turns on `verbatimModuleSyntax`, so use `import type` for type-only imports. It also turns on `erasableSyntaxOnly`, which rules out `enum`, `namespace` and constructor parameter properties. Use `as const` arrays plus derived unions in their place. Unused locals and parameters are errors.
- **Imports:** use the `@/` alias rather than long relative paths.
- **Formatting:** Prettier with no semicolons, single quotes and print width 100. `prettier-plugin-tailwindcss` sorts class names, including inside `cn()` and `cva()`. ESLint extends `eslint-config-prettier`, so the two tools don't conflict.
- **Linting:** `typescript-eslint` recommended rules (not type-aware), `react-hooks` and `react-refresh`. `react-refresh` warns when a component file also exports non-components, so keep constants and types in separate modules.
- **UI components:** add shadcn primitives with `npx shadcn@latest add <component>`. They land in `src/components/ui/` (see `components.json`).
- **Dates:** format dates through `formatDate()` rather than calling `toLocaleDateString` directly.

## Commits

Commit messages must follow [Conventional Commits](https://www.conventionalcommits.org), e.g. `feat(jobs): add job form` or `fix(badge): correct colors`. A husky `commit-msg` hook runs commitlint and rejects messages that don't conform. A `pre-commit` hook runs lint-staged (ESLint on staged `.js/.jsx/.ts/.tsx` files) and blocks the commit on lint errors. The full type-check runs in CI instead (see below), so unfinished, unstaged files never block a commit.

```bash
npm run commit                          # guided prompt
echo "feat: x" | npx commitlint         # check a message without committing
```

## CI

[`ci.yml`](.github/workflows/ci.yml) runs on every pull request to `master`. It runs `npm run lint`, then `npm run format:check`, then `npm run build`, which type-checks with `tsc -b` and does a production build. Run the same three commands locally before opening a PR.

## Deployment

Each push to `master` deploys the app to GitHub Pages at <https://nuwang91.github.io/developer-job-tracker/> through the [`deploy.yml`](.github/workflows/deploy.yml) workflow, which runs `npm ci`, then `npm run build`, and publishes `dist/`. In the repo's **Settings → Pages**, the source must be set to **GitHub Actions**. "Deploy from a branch" serves the unbuilt `index.html` and shows a blank page.

- Production builds use `base: '/developer-job-tracker/'` (see `vite.config.ts`); the dev server stays at `/`.
- The workflow copies `index.html` to `404.html`, so GitHub Pages serves the app for any path and links like `/jobs/123` work after a reload.
- MSW runs only in dev, so the deployed site has no `/api` backend. Pages that fetch data (`/jobs`, `/jobs/:id`) show their error state there.

## Roadmap / current status

- [x] Job list with company/role search and status filter
- [x] MSW mock REST API for jobs and interviews
- [x] Typed `fetch` client with `ApiError` and a jobs API module
- [x] UI wired to the API, with loading, error and empty states
- [x] Create, edit and delete jobs
- [x] Routing (React Router) and a job detail view; filters kept in URL params
- [x] Interview CRUD, with the interview form on React 19 actions
- [x] GitHub Pages deployment through Actions
- [ ] Mock API on the deployed site (start MSW in production builds) or a real backend
- [ ] Home and About page content
- [ ] Test runner (e.g. Vitest + Testing Library, reusing the MSW handlers)

## Possible tooling upgrades

- **Type-aware linting:** in `eslint.config.js`, swap `tseslint.configs.recommended` for `recommendedTypeChecked` or `strictTypeChecked`, and set `parserOptions.project` to `['./tsconfig.node.json', './tsconfig.app.json']`.
- **React-specific lint rules:** [`eslint-plugin-react-x`](https://www.npmjs.com/package/eslint-plugin-react-x) and [`eslint-plugin-react-dom`](https://www.npmjs.com/package/eslint-plugin-react-dom).
- **React Compiler:** not enabled because it slows dev and build. See the [installation docs](https://react.dev/learn/react-compiler/installation).
