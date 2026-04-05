# K-Drop v2

Vite + React + TypeScript project for `app/v2`.

## Scripts

- `pnpm run dev` — start the Vite dev server
- `pnpm run build` — type-check and create a production build
- `pnpm run test` — run Vitest once
- `pnpm run test:watch` — run Vitest in watch mode
- `pnpm run test:types` — run TypeScript project type-checking
- `pnpm run lint` — run ESLint
- `pnpm run format` — format files with Biome
- `pnpm run format:check` — check Biome formatting
- `pnpm run check:all` — run test, typecheck, lint, format checks, and build

## Tooling

- React 19
- TypeScript strict mode
- `@/*` path alias
- ESLint configuration based on `app/v1/.eslintrc.js`
- Biome formatter with `lineWidth: 150`
- Vitest test runner
- pnpm (enforced via `preinstall`)
