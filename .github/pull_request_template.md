## What and why

<!-- What does this change, and which issue does it close? -->

Closes #

## Checklist

- [ ] Tests cover the change (`pnpm test`)
- [ ] A changeset describes it, if it changes the published package (`pnpm changeset`)
- [ ] Docs updated, if the API or the behavior changes
- [ ] Interactive markers or UI changes work with the keyboard and have accessible names

CI runs lint, types, tests on Node 22 and 24, package checks, bundle size, an axe audit of every docs page (WCAG 2.2 AAA) and Lighthouse. **Ready to merge** turns green when all of them pass. The maintainer gives the final approval.
