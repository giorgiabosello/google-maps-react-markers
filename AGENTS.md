# AGENTS.md

Notes for anyone, human or agent, working on the 2.x line of `google-maps-react-markers`.

## Branches

- `v2` is the 2.x line. It gets bug fixes and features that do not break anything: no breaking changes, React 18 and 19 both supported, the same default export, also with `require()`.
- `main` is 3.x, the current major. It is a pnpm monorepo with Changesets and its own `AGENTS.md`.
- Pull requests for 2.x target `v2`. The maintainer reviews and merges them.

## Commands

Node.js from `.nvmrc`, Yarn 1.

```bash
yarn install
yarn lint        # ESLint on src
yarn type-check  # TypeScript
yarn tsup        # build dist (yarn build also links the package with yalc)
```

`dist/` is committed. After a change in `src/`, run `yarn tsup` and commit `dist/` too: CI fails when the build differs from it.

## Commits and pull request titles

[Conventional Commits](https://www.conventionalcommits.org/), with the emoji for the type after the colon: `fix(marker): 🐛 keep the drag on pointer release`. commitlint checks the format. On `v2` no hook adds the emoji, so write it yourself, with the same map as `main`:

| Type       | Emoji |
| ---------- | ----- |
| `feat`     | ✨    |
| `fix`      | 🐛    |
| `docs`     | 📝    |
| `style`    | 💄    |
| `refactor` | ♻️    |
| `perf`     | ⚡️   |
| `test`     | ✅    |
| `build`    | 📦    |
| `ci`       | 👷    |
| `chore`    | 🔧    |
| `revert`   | ⏪    |

`build(deps)` takes ⬆️.

## Releases

Every 2.x release has a section in `CHANGELOG.md`, with the conventional-changelog headings and their emoji, in this order. Leave out the empty ones.

```md
## 2.1.0

One or two sentences on what the release is.

### ✨ Features

### 🐛 Bug Fixes

### ⚠️ Behaviour Changes

### 🔧 Chores
```

`⚠️ Behaviour Changes` lists what works differently without being a breaking change, and what users should check. `💥 BREAKING CHANGES` never appears on 2.x: a breaking change goes to 3.x.

Steps:

1. Bump `version` in `package.json`, write the `CHANGELOG.md` section and rebuild `dist/`, in a `release/X.Y.Z` pull request to `v2`.
2. After the merge, publish from `v2`. `publishConfig.tag` is `latest-v2`, so `latest` stays on 3.x. Never publish a 2.x with the `latest` tag.
3. Create the GitHub release on the merge commit: tag and title `X.Y.Z` (no prefix), not marked as latest (`gh release create X.Y.Z --target <merge commit> --latest=false`). The body is the `CHANGELOG.md` section, after a short intro that says how to stay on 2.x (`npm install google-maps-react-markers@2`).
