# Changesets

Every pull request that changes the published package adds a changeset:

```bash
pnpm changeset
```

Pick the bump (patch, minor, major) and write one or two sentences for the changelog, from the user's point of view. The release workflow turns changesets into a "Version Packages" pull request; merging it publishes to npm.
