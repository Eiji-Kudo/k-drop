# K-Drop v2

Vite + React + TypeScript project for `app/v2`.

## Scripts

- `npm run dev` — start the Vite dev server
- `npm run build` — type-check and create a production build
- `npm run test` — run Vitest once
- `npm run test:watch` — run Vitest in watch mode
- `npm run test:types` — run TypeScript project type-checking
- `npm run lint` — run ESLint
- `npm run format` — format files with Biome
- `npm run format:check` — check Biome formatting
- `npm run check:all` — run test, typecheck, lint, and format checks

## Tooling

- React 19
- TypeScript strict mode
- `@/*` path alias
- ESLint configuration based on `app/v1/.eslintrc.js`
- Biome formatter with `lineWidth: 150`
- Vitest test runner
