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

## ER Test Factories

`functions/db/__tests__/test-helper.ts` provides a better-sqlite3 in-memory DB plus `@praha/drizzle-factory` based helpers for schema tests.

```ts
const db = createTestDb()
await setupBaseData(db)
await insertQuiz(db, { quizId: "q1" })
await insertQuizChoice(db, { quizChoiceId: "q1-c1", quizId: "q1", choiceOrder: 1, isCorrect: 1 })
```

When you need direct access to the underlying factories, use `getTestFactories(db)`:

```ts
const factories = getTestFactories(db)
await factories.userProfiles.create({ userId: "user-1", handle: "momo_fan", displayName: "モモ推し" })
```

Keep intentional constraint-violation cases as raw SQL in tests. Use factories and helper wrappers for valid setup data.
