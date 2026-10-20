# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Claude's role in this repo

The developer writes the application code (components, types, mock API, data layer) by hand. Claude is used for configuration, tooling and docs. Don't write or refactor feature code unless explicitly asked. Point out bugs, but leave the fix to the developer unless they ask for it.

## Project state

React 19 + TypeScript 6 + Vite 8 front-end for tracking developer job applications. There is no real backend: in dev, an MSW service worker serves an in-memory REST API at `/api/jobs`. There is no routing, no global state library and no test runner yet.

- Done: job list (`App.tsx`) with company/role text search and status chip filter. It still reads `mockJobs` directly instead of the API.
- Done: MSW handlers for `GET/POST /api/jobs` and `GET/PATCH/DELETE /api/jobs/:id`.
- In progress (untracked): `src/lib/api-client.ts` (typed `fetch` wrapper `request<T>()` that throws `ApiError`), `src/lib/ApiError.ts` (discriminated `info`: `http` | `network` | `parse` | `abort`), and `src/features/jobs/api.ts` (empty).

Update this section as architecture lands.

## Commands

- `npm run dev`: Vite dev server with HMR. Also starts the MSW mock API.
- `npm run build`: type-check (`tsc -b`, project references), then production build to `dist/`
- `npm run lint`: ESLint over the whole repo
- `npm run preview`: serve the production build locally
- `npm run format` / `npm run format:check`: Prettier write / check. `.prettierrc.json` sets no semicolons, single quotes and width 100. `prettier-plugin-tailwindcss` sorts classes, including inside `cn()`/`cva()`. ESLint uses `eslint-config-prettier`, so it won't fight Prettier.
- `npm run commit`: interactive Conventional Commit prompt (commitizen via `@commitlint/cz-commitlint`)

There is no test runner configured yet.

## Commits

Commit messages must follow Conventional Commits (`type(scope): subject`, e.g. `feat(jobs): add job form`). A husky `commit-msg` hook runs commitlint (`commitlint.config.js`, extends `@commitlint/config-conventional`) and rejects non-conforming messages. Check a message without committing via `echo "feat: x" | npx commitlint`.

## Architecture

- Entry: `index.html` → `src/main.tsx` → `src/App.tsx`. In dev only, `main.tsx` dynamically imports `src/mocks/browser.ts` and awaits `worker.start()` before rendering, so `/api/*` is mocked from the first request.
- Organized by feature: `src/features/jobs/` holds `types.ts`, `mockJobs.ts` (seed data) and `components/` (`JobCard`, `JobFilters`, `StatusBadge`). Shared UI is in `src/components/` (`ChipGroup`), shadcn primitives are in `src/components/ui/`, and generic helpers are in `src/lib/` (`cn`, `formatDate` en-AU).
- Import from `src` with the `@/` alias (`vite.config.ts` + `tsconfig.app.json`).
- Domain types: `JobApplication { id, company, role, status, notes?, createdAt, interviews: Interview[] }`. Statuses are an `as const` array (`APPLICATION_STATUSES`), and `ApplicationStatus` / `StatusFilter` (which adds `'all'`) are derived from it. Adding a status touches `types.ts`, the `StatusInfo` record in `StatusBadge.tsx`, and the `--status-*` / `--color-status-*` tokens in `src/index.css`.
- Mock API (`src/mocks/handlers.ts`): module-level in-memory array that resets on reload, with simulated `delay()`. The server owns `id`, `createdAt` and `interviews`. Errors are `{ message }` with 404. `public/mockServiceWorker.js` is generated (`npx msw init public`), so don't edit it.
- Styling: Tailwind v4 via `@tailwindcss/vite` (no `tailwind.config`; theme lives in `src/index.css`). shadcn/ui uses the `base-nova` style on `@base-ui/react`, with lucide icons. Add primitives with `npx shadcn@latest add <name>`.

## TypeScript / lint conventions

- TypeScript uses project references: `tsconfig.app.json` covers `src/` (browser code), and `tsconfig.node.json` covers Node-side config like `vite.config.ts`.
- `tsconfig.app.json` turns on `verbatimModuleSyntax`, so use `import type` for type-only imports. `erasableSyntaxOnly` rules out `enum`, `namespace` and constructor parameter properties; prefer `as const` arrays + derived unions. `noUnusedLocals`/`noUnusedParameters` are on. `allowImportingTsExtensions` lets imports include `.tsx` extensions.
- ESLint (flat config) applies `typescript-eslint` recommended (not type-aware), `react-hooks` and `react-refresh` rules. `react-refresh` warns when a component file also exports non-components.
- Static files served at root live in `public/`; imported assets live in `src/assets/`.
