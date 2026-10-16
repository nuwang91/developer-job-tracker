# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

This is a fresh React 19 + TypeScript + Vite 8 scaffold (the stock `create-vite` template) for a developer job tracker app. No app-specific code, routing, state management, or backend exists yet — `src/App.tsx` is still the template demo page. Update this file as real architecture is added.

## Commands

- `npm run dev` — start Vite dev server with HMR
- `npm run build` — type-check (`tsc -b`, project references) then production build to `dist/`
- `npm run lint` — ESLint over the whole repo
- `npm run preview` — serve the production build locally

- `npm run commit` — interactive Conventional Commit prompt (commitizen via `@commitlint/cz-commitlint`)

There is no test runner configured yet.

## Commits

Commit messages must follow Conventional Commits (`type(scope): subject`, e.g. `feat: add job list`). A husky `commit-msg` hook runs commitlint (`commitlint.config.js`, extends `@commitlint/config-conventional`) and rejects non-conforming messages. Check a message without committing via `echo "feat: x" | npx commitlint`.

## Structure and conventions

- Entry: `index.html` → `src/main.tsx` (mounts `<App />` in `StrictMode` into `#root`) → `src/App.tsx`.
- TypeScript uses project references: `tsconfig.app.json` covers `src/` (browser code), `tsconfig.node.json` covers Node-side config like `vite.config.ts`.
- `tsconfig.app.json` enables `verbatimModuleSyntax` (use `import type` for type-only imports), `erasableSyntaxOnly` (no `enum`, `namespace`, or constructor parameter properties), `noUnusedLocals`/`noUnusedParameters`, and `allowImportingTsExtensions` (imports may include `.tsx` extensions, as in `main.tsx`).
- ESLint (flat config) applies `typescript-eslint` recommended (not type-aware), `react-hooks`, and `react-refresh` rules — the latter warns when a component file also exports non-components.
- Static files served at root live in `public/`; imported assets live in `src/assets/`.
