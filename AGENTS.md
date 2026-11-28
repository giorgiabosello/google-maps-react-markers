# AGENTS.md

Notes for anyone, human or agent, working on `google-maps-react-markers`. Setup, commands and the pull request checklist are in [CONTRIBUTING.md](CONTRIBUTING.md): read it first.

## Branches

- `main` is 3.x, the current major, published with the `latest` tag.
- `v2` is the 2.x line: bug fixes and non-breaking features only, published with the `latest-v2` tag. It has its own tooling (Yarn, tsup, a committed `dist/`) and its own `AGENTS.md`. Pull requests for 2.x target `v2`.

## Commits and pull request titles

[Conventional Commits](https://www.conventionalcommits.org/), with the emoji for the type after the colon: `fix(marker): 🐛 keep the drag on pointer release`. The `prepare-commit-msg` hook adds the emoji (`scripts/commit-emoji.mjs`), so don't type it in commits. Pull request titles become the squash commit, and no hook runs on them: write the emoji yourself, with the same map (`feat` ✨, `fix` 🐛, `docs` 📝, `refactor` ♻️, `perf` ⚡️, `test` ✅, `build` 📦, `build(deps)` ⬆️, `ci` 👷, `chore` 🔧, a breaking change 💥).

## Releases

Releases go through Changesets, never by hand:

1. A pull request that changes the published package adds a changeset (`pnpm changeset`). Its text becomes the `CHANGELOG.md` entry and the GitHub release notes, so write it for users: what changed and what they need to do.
2. Merging into `main` opens a "Version Packages" pull request. `pnpm version-packages` runs `changeset version`, then `scripts/changelog-headings.mjs` renames the sections to `### 💥 BREAKING CHANGES`, `### ✨ Features` and `### 🐛 Bug Fixes`. Don't edit those headings by hand.
3. Merging "Version Packages" publishes to npm from GitHub Actions, with provenance, and creates the GitHub release, tagged `google-maps-react-markers@X.Y.Z` and titled `X.Y.Z`. Don't run `npm publish` locally.
