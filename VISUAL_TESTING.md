# Visual Testing

This repo uses [Chromatic](https://www.chromatic.com/) to catch unintended visual
changes in components. Chromatic builds the Storybook in `apps/docs`, renders every
story into snapshots, and diffs them against an accepted baseline. When a snapshot
changes, the build is flagged for human review.

## How to use it

Visual tests do **not** run on every PR — they're opt-in, so you only spend snapshots
when a change is actually visual.

1. Open a PR with component or story changes.
2. If the change is visual, add the **`run-visual-testing`** label. The build runs
   immediately.
3. Open the Chromatic link on the PR check and accept or deny each diff.
4. Pushed more visual changes? The label was removed after the last build (see below),
   so re-add it to run again.
5. Get the PR reviewed and merge. On merge, the accepted changes become the new `main`
   baseline automatically — you don't do anything extra.

If a PR has no visual impact, leave the label off.

### Why the label dance

`run-visual-testing` is a **one-shot** trigger. When a build succeeds, the PR workflow
swaps it for `update-visual-testing` and drops `run-visual-testing`. Two reasons:

- **One-shot keeps cost down.** Without removing it, every later push would re-snapshot.
  Re-adding the label is a deliberate "yes, test this again."
- **`update-visual-testing` is the merge signal.** It marks "a PR build passed at some
  point," and the merge workflow reads it to decide whether to re-baseline. You never
  add it by hand.

A failed build leaves `run-visual-testing` in place, so the next push retries and the PR
is never marked.

## Why two workflows

The split exists because a PR build and a merge build want opposite things from the same
snapshots:

- **PR build** (`.github/workflows/chromatic-pr.yml`) runs on the PR head and **diffs
  against** the current `main` baseline, so you can review what changed.
- **Merge build** (`.github/workflows/chromatic-main.yml`) runs on the merge commit and
  **becomes** the new `main` baseline (`branchName: main` + `autoAcceptChanges: main`),
  so the next PR doesn't re-flag changes you already accepted.

Doing both in one workflow would either re-baseline on every PR (changes never get
reviewed) or never update the baseline (every PR re-flags already-accepted changes).

The merge build only runs when the PR was actually **merged** and carries
`update-visual-testing` — a PR closed without merging, or one that never ran Chromatic,
is skipped.

Other behaviour worth knowing:

- **TurboSnap (`onlyChanged: true`)** — only stories affected by the changed files are
  snapshotted, not the whole Storybook.
- PR builds use **`cancel-in-progress: true`** so a new push cancels the in-flight build
  and only the latest commit is snapshotted. Merge builds use
  **`cancel-in-progress: false`** — baseline builds must not be cancelled.

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
| `externals` | Non-source assets (fonts, css, favicons) that, when changed, should invalidate TurboSnap rather than be silently skipped. |

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
