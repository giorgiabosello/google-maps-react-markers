# Contributing

Thanks for helping! Bug reports with a reproduction, docs fixes and pull requests are all welcome.

## Setup

You need Node.js 24 (see `.nvmrc`) and pnpm, enabled through Corepack:

```bash
corepack enable
pnpm install
```

## Repository layout

| Path                                 | What it is                                      |
| ------------------------------------ | ----------------------------------------------- |
| `packages/google-maps-react-markers` | The library: `src/`, tests in `test/`           |
| `apps/docs`                          | The documentation site (Fumadocs on Next.js 16) |
| `examples/vite`                      | A Vite app in StrictMode, handy for benchmarks  |

## Everyday commands

```bash
pnpm docs:dev     # library in watch mode + docs site on http://localhost:3000
pnpm test         # unit, SSR and hydration tests (Vitest)
pnpm lint         # ESLint
pnpm typecheck    # TypeScript, every package
pnpm build        # build the library
pnpm check:package && pnpm size  # publint, are-the-types-wrong, size limit
```

### Accessibility and Lighthouse checks

CI audits the static export. To run the same checks locally (Google Chrome must be installed; set `CHROME_PATH` if it is not in the default place):

```bash
DOCS_BASE_PATH= NEXT_PUBLIC_GOOGLE_MAPS_API_KEY= pnpm docs:build
pnpm --filter docs a11y                              # axe-core, every page, dark and light, WCAG 2.2 AAA
(cd apps/docs && npx --yes @lhci/cli@0.16.1 autorun)  # Lighthouse
```

### Real maps locally

Without an API key the site works, but Google shows the maps in development mode (watermark and its own grey style). To see the real styles:

1. Map the local hostname once:

   ```bash
   echo "127.0.0.1 google-maps-react-markers.test" | sudo tee -a /etc/hosts
   ```

2. Create a separate key, restricted to the website `http://google-maps-react-markers.test:3000/*` and to the Maps JavaScript API only. Put it in a separate Google Cloud project with a low daily quota.
3. Copy `apps/docs/.env.example` to `apps/docs/.env.local` and set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`. Git ignores this file: never commit it, and never publish a build made on your machine.
4. Start the site on that host and open http://google-maps-react-markers.test:3000:

   ```bash
   pnpm build && pnpm --filter docs dev:host
   ```

Use `.test` rather than `.local`: on macOS `.local` goes through Bonjour and resolves slowly.

## Pull requests

- Add a test for bug fixes and new behavior (`packages/google-maps-react-markers/test`).
- Add a changeset if the published package changes: `pnpm changeset`.
- Use [Conventional Commits](https://www.conventionalcommits.org/) (`fix(marker): ...`, `feat: ...`): a commit hook checks it.
- Update the docs in `apps/docs/content/docs` when you change the API.
- Interactive markers and controls must work with the keyboard and have an accessible name.
- CI must be green: **Ready to merge** sums up lint, types, tests on Node 22 and 24, package checks, bundle size, the axe audit and Lighthouse. The maintainer reviews and approves every pull request.

## Releases

Merging changesets into `main` opens a "Version Packages" pull request. Merging that publishes to npm from GitHub Actions, with provenance.
