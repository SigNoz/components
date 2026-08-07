# Release

This repo uses [Release Please](https://github.com/googleapis/release-please) to help release a new version of the following packages:

- `@signozhq/ui`
- `@signozhq/tailwind-config`

Everything else in the workspace is private and never published: `@repo/eslint-config`, `@repo/typescript-config`, and the `docs` Storybook app.

All published packages share a single version, which is bumped in `Release PR`. The source of truth for the current version is `.release-please-manifest.json`. 

Never edit a `version` field in `package.json` by hand, Release Please writes those for you.

## How does a release work?

In a few simple steps, you need to:

- open a PR with your change
- the PR must follow the [Conventional Commits](#commit-messages) strategy
- you can merge those changes into main safely (this does not trigger a new release)
- a `Release PR` will be created with your change
- once you decide you have enough PRs for a release, you mark the `Release PR` as ready for review and merge it

> [!IMPORTANT]
> to be able to merge the `Release PR`, you need to be part of `web-core` team.

Take a look at [What's a Release PR](https://github.com/googleapis/release-please#whats-a-release-pr) to learn more about this process. You can also take a look at [why we only allow rebase/squash merge](https://github.com/googleapis/release-please#linear-git-commit-history-use-squash-merge).

## Commit messages

Commit messages are validated by `commitlint` using `@commitlint/config-conventional`. 

When PRs are squash merged, **the PR title becomes the commit message**, so the PR title needs has to be conventional.

If you rebase the PR, then you need to make each commit conventional.

These are the types configured in `release-please-config.json` and the changelog section each one lands in:

| Type               | Changelog section        |
| ------------------ | ------------------------ |
| `feat` / `feature` | Features                 |
| `fix`              | Bug Fixes                |
| `perf`             | Performance Improvements |
| `revert`           | Reverts                  |
| `docs`             | Documentation            |
| `style`            | Styles                   |
| `chore`            | Miscellaneous Chores     |
| `refactor`         | Code Refactoring         |
| `test`             | Tests                    |
| `build`            | Build System             |
| `ci`               | Continuous Integration   |

To flag a breaking change, add a `!` after the type/scope or a `BREAKING CHANGE:` footer:

```
feat(button)!: drop the `size="xs"` variant
```

```
feat(button): rename the `kind` prop to `variant`

BREAKING CHANGE: `kind` is no longer accepted, use `variant` instead.
```

## Versioning

The repo is still pre-1.0, and the config sets `bump-minor-pre-major` and `bump-patch-for-minor-pre-major`. That means the bumps are **not** what plain semver would give you:

| Commit             | Bump      | Example           |
| ------------------ | --------- | ----------------- |
| `fix:`             | patch     | `0.0.23 → 0.0.24` |
| `feat:`            | **patch** | `0.0.23 → 0.0.24` |
| breaking change    | **minor** | `0.0.23 → 0.1.0`  |

So a new feature does not get you a minor bump, and a breaking change does not get you a major one. This will change once the packages reach `1.0.0`.

## What happens after the `Release PR` is merged

Merging the `Release PR` is the step that actually ships. The [`Release`](./.github/workflows/release.yml) workflow runs on every push to `main` and, when Release Please reports that a release was created, it:

1. tags the commit as `vX.Y.Z` and creates the matching GitHub Release
2. builds the publishable packages with `pnpm turbo run build $PUBLISH_FILTERS`
3. publishes them with `pnpm -r publish --no-git-checks $PUBLISH_FILTERS`

Publishing uses npm provenance (`NPM_CONFIG_PROVENANCE: true`) and authenticates through npm trusted publishing via OIDC (`id-token: write`), there is no npm token stored in the workflow.

The workflow uses a `release` concurrency group with `cancel-in-progress: false`, so releases queue up instead of cancelling each other.

## Verifying a release

After the workflow finishes:

```sh
npm view @signozhq/ui version
npm view @signozhq/tailwind-config version
```

Both should match the version in `.release-please-manifest.json` and the `vX.Y.Z` git tag. The npm page should also show the provenance badge.

## Adding a new published package

A new public package needs **three** changes, or it will fail silently:

1. add it to `extra-files` in `release-please-config.json`, otherwise its `version` is never bumped
2. add a `--filter=<package-name>` for it to `PUBLISH_FILTERS` in [`.github/workflows/release.yml`](./.github/workflows/release.yml), otherwise it is never built or published
3. configure a trusted publisher for it on npm, otherwise the publish step has no way to authenticate

Also make sure the package is not marked `"private": true` and that it sets `"publishConfig": { "access": "public" }` — scoped packages default to restricted, and `pnpm publish` skips private packages.

The root `release` script mirrors the same list for local checks, keep the two in sync.

### Configuring trusted publishing

The workflow has no npm token, so every published package needs its own trusted publisher on npm. On npmjs.com, go to the package → **Settings** → **Trusted Publisher**, pick **GitHub Actions**, and fill in:

| Field             | Value                |
| ----------------- | -------------------- |
| Organization      | `SigNoz`             |
| Repository        | `components`         |
| Workflow filename | `release.yml`        |
| Environment       | leave empty          |

Leave the environment empty because the release job does not use a GitHub environment. If that ever changes, the trusted publisher config has to be updated to match, or publishing starts failing with an auth error.

> [!IMPORTANT]
> npm only lets you configure a trusted publisher on a package that already exists in the registry. For a brand new package name, the **first** publish has to be done manually by someone with publish rights on the `@signozhq` scope. Configure the trusted publisher right after that, and every later release goes through the workflow.

You need admin rights on the package (or on the `@signozhq` org) to change this setting.

## Pitfalls

A few things can leave the release process in a broken state.

### Closing the `Release PR` without merging it

Release Please tracks the open `Release PR` through its branch and its labels, so closing the PR is not enough. You also have to delete the `release-please--branches--main--components--design-system` branch, and sometimes remove the `autorelease: pending` label from the closed PR. Otherwise Release Please cannot tell whether it should open a new `Release PR` or update the existing one, and the next push to `main` leaves you with no `Release PR` at all.

> [!TIP]
> If you end up in this state, ask Claude to look at the leftover branch, labels, and tags and work out what needs to be cleaned up.

### The `Release` workflow failing

Prefer releasing forward over retrying the same version. Retrying the same tag means undoing everything the failed run created, the `Release PR`, its labels, and the `vX.Y.Z` tag, and it is easy to leave the `Release PR` in a state Release Please cannot recover from.

The simplest fix is to land an empty conventional commit on `main` and merge the `Release PR` it produces:

```sh
git commit --allow-empty -m "fix: retrigger release"
```

## Limitations

- There are no prereleases (`prerelease: false`) and no release channels, everything ships from `main`.
- There is no hotfix branch. To patch an old version you have to land the fix on `main` and release forward.
- The whole workspace is a single Release Please package (`.`), so packages cannot be versioned or released independently.
