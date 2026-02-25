# AGENTS.md

## Cursor Cloud specific instructions

This is a **Vite plugin library** (`vite-plugin-pinia-auto-store`) — not a deployed application. It auto-generates a type-safe `useStore()` helper from a directory of Pinia stores.

### Project structure

- Root (`/workspace`): The npm package source, tests, and build config
- `playground/`: A private Vue 3 app for manual testing of the plugin (has its own `pnpm-lock.yaml`)

### Key commands

All standard commands are in `package.json` scripts. Quick reference:

| Task | Command |
|------|---------|
| Lint | `pnpm lint` |
| Test | `pnpm test` |
| Build | `pnpm build` |
| Typecheck | `pnpm typecheck` |
| Dev server (playground) | `pnpm dev` (runs on `localhost:5173`) |
| Format | `pnpm format` |

### Non-obvious notes

- The playground imports the plugin directly from `../src/index.ts` (not from built dist), so building is **not** required before running `pnpm dev`.
- `pnpm install` at the root handles the root package. The playground has a separate lockfile and needs its own `pnpm install` run inside `playground/`.
- The build produces warnings about unresolved `node:fs` and `node:path` — these are expected (treated as external dependencies for the Vite plugin).
- Git hooks (`simple-git-hooks`) are set up automatically via `prepare` script during `pnpm install`. Pre-commit runs `pnpm lint:fix`.
- The `pnpm-workspace.yaml` only specifies `onlyBuiltDependencies: [esbuild]` — there is no explicit `packages` field; root and playground are managed independently.
