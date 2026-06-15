# Visual Testing

This repo uses [Chromatic](https://www.chromatic.com/) to catch unintended visual
changes in components. Chromatic builds the Storybook in `apps/docs`, renders every
story into snapshots, and diffs them against an accepted baseline. When a snapshot
changes, the build is flagged for human review.

## TL;DR

- Visual tests do **not** run automatically on every PR.
- Add the **`run-visual-testing`** label to a PR to run Chromatic against it.
- Review the diffs in the Chromatic UI (link is posted on the PR check).
- On merge, a second workflow re-runs Chromatic and **auto-accepts** the merged
  changes as the new `main` baseline.

## How it works

There are two workflows plus a shared config. The split exists so PR builds compare
against `main`, and merged builds update the `main` baseline.

### 1. PR builds — `.github/workflows/chromatic-pr.yml`

Runs on pull requests targeting `main` (`opened`, `synchronize`, `reopened`,
`labeled`).

Key behaviour:

- **`skip` unless labeled.** The job is skipped unless the PR carries the
  `run-visual-testing` label:
  ```yaml
  skip: ${{ !contains(github.event.pull_request.labels.*.name, 'run-visual-testing') }}
  ```
  Adding the label (the `labeled` trigger) kicks off a build immediately. This is the
  main cost lever — no label, no snapshots.
- **`cancel-in-progress: true`.** Pushing new commits cancels the in-flight build so
  only the latest commit is snapshotted.
- **`onlyChanged: true`** (TurboSnap). Only stories affected by the changed files are
  snapshotted, instead of the whole Storybook.
- Checks out the PR **head SHA** so the diff reflects exactly what's in the PR.

The build appears as a check on the PR with a link to the Chromatic UI, where you
accept or deny each visual change.

### 2. Baseline update on merge — `.github/workflows/chromatic-main.yml`

Runs when a PR to `main` is **closed**, but only does work when:

```yaml
github.event.pull_request.merged == true &&
contains(github.event.pull_request.labels.*.name, 'run-visual-testing')
```

i.e. the PR was actually merged **and** it had the `run-visual-testing` label.

Key behaviour:

- Checks out the **merge commit SHA**.
- Forces the build to be treated as `main`:
  ```yaml
  branchName: main
  autoAcceptChanges: main
  ```
  This re-baselines `main`: the changes you reviewed and merged are auto-accepted as
  the new reference, so the next PR doesn't re-flag them.
- **`cancel-in-progress: false`** — baseline builds must not be cancelled.
- **`onlyChanged: true`** as well.

### Why two workflows?

- A PR build needs to diff against the current `main` baseline → run on the PR head.
- A merge build needs to *become* the new `main` baseline → run on the merge commit
  with `branchName: main` + `autoAcceptChanges: main`.

Doing both in one workflow would either re-baseline on every PR (changes never get
reviewed) or never update the baseline (every PR re-flags already-accepted changes).

## Configuration — `apps/docs/chromatic.config.json`

Shared by both workflows and the local `chromatic` script.

| Key | Purpose |
|-----|---------|
| `projectId` | Chromatic project this Storybook belongs to. |
| `storybookBaseDir` | Repo-relative root of the Storybook (`./apps/docs`) — anchors TurboSnap's change detection. |
| `storybookConfigDir` | Storybook config dir (`./apps/docs/.storybook`). |
| `storybookBuildDir` | Prebuilt static Storybook output (`./storybook-static`). |
| `onlyChanged` | Enables TurboSnap by default. |
| `zip` | Uploads the build as a zip (faster for large Storybooks). |
| `externals` | Non-source assets (fonts, css, favicons) that, when changed, should be handled by TurboSnap correctly rather than silently skipped. |

`projectToken` is **not** in this file — it comes from the `CHROMATIC_PROJECT_TOKEN`
repository secret (CI) or your environment (local).

## Component-level tests (separate from Chromatic)

Storybook also runs interaction/render tests via Vitest in a real browser
(Playwright/Chromium):

```bash
cd apps/docs
pnpm test-storybook   # vitest --project=storybook
```

These verify behaviour/rendering and run independently of Chromatic's pixel diffing.

## Typical workflow

1. Open a PR with component or story changes.
2. If the change is visual, add the **`run-visual-testing`** label → PR build runs.
3. Open the Chromatic link on the PR check; accept or deny each diff.
4. Get the PR reviewed and merge.
5. The merge build auto-accepts the merged changes as the new `main` baseline.

If a PR has no visual impact, leave the label off — no snapshots are spent.
