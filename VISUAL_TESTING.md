# Visual Testing

This repo uses [Chromatic](https://www.chromatic.com/) to catch unintended visual
changes in components. Chromatic builds the Storybook in `apps/docs`, renders every
story into snapshots, and diffs them against an accepted baseline. When a snapshot
changes, the build is flagged for human review.

## When to use visual testing

Visual testing catches **unintended visual changes**. Not every PR needs it.

If the change is purely logic, tests, or backend wiring, skip the label. If it touches
styling, layout, or component appearance, add `run-visual-testing`. For minor tweaks
where you're unsure, lean toward testing. Quota is cheaper than shipping a regression.

**Dependency updates deserve visual testing.** Even patch bumps can introduce regressions
in rendering, fonts, or layout. When updating UI-related deps (React, Radix, Tailwind,
icon libraries, etc.), always add the label and review the diffs carefully.

### Visual vs behavioural testing

Chromatic catches pixel-level changes: layout shifts, colour tweaks, styling regressions.
It does **not** verify behaviour like click handlers, state transitions, or accessibility.

For behavioural coverage, use the Vitest + Storybook interaction tests (see
[Component-level tests](#component-level-tests-separate-from-chromatic) below). The two
complement each other; neither replaces the other.

## How to use it

Visual tests do **not** run on every PR. They're opt-in, so you only spend snapshots
when a change is actually visual.

1. Open a PR with component or story changes.
2. If the change is visual, add the **`run-visual-testing`** label. The build runs
   immediately.
3. Open the Chromatic link on the PR check and accept or deny each diff.
4. Pushed more visual changes? The label was removed after the last build (see
   [Why the label dance](#why-the-label-dance)), so re-add it to run again.
5. Get the PR reviewed and merge. On merge, the accepted changes become the new `main`
   baseline automatically. You don't do anything extra.

If a PR has no visual impact, leave the label off.

## Writing stories that snapshot well

### Use deterministic data

Snapshots must be identical across runs. Avoid anything that changes between renders:

```tsx
// Bad (flaky)
<Timestamp date={new Date()} />
<Avatar name={faker.person.name()} />

// Good (stable)
<Timestamp date={new Date('2024-01-15T10:00:00Z')} />
<Avatar name="Jane Doe" />
```

The same applies to random colours, shuffled lists, or anything pulling live data.

### Handle animations

Animations cause flaky snapshots because Chromatic might capture mid-transition frames.
Three options:

- **Disable globally**: add `chromatic: { disableAnimations: true }` in story parameters.
- **Wait for completion**: use the `play` function to wait until the animation settles.
- **Skip the story**: for pure animation demos, use `chromatic: { disable: true }` so
  they're excluded from visual diffing entirely.

### Use preview stories for visual testing

By default, visual testing is **disabled for all stories**. We enable it only on
hand-picked "preview" stories that combine multiple states into a single snapshot.

Why? With many stories, snapshotting each one exhausts the quota fast. A `Button` component
might have 10+ stories (variants, sizes, states). If each is snapshotted separately,
that's 10 snapshots. Instead, create one `Preview` story that renders all variants together.
One snapshot covers everything.

```tsx
// Individual stories for docs/playground (NOT snapshotted)
export const Primary: Story = { args: { variant: 'primary' } }
export const Secondary: Story = { args: { variant: 'secondary' } }
export const Disabled: Story = { args: { variant: 'primary', disabled: true } }

// Preview story for visual testing (snapshotted)
export const Preview: Story = {
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="primary" disabled>Disabled</Button>
      {/* All other variants... */}
    </div>
  ),
}
```

Opt-in per story with `chromatic: { disableSnapshot: false }`.

This approach:

- **Reduces billing**: N variants = 1 snapshot instead of N snapshots
- **Catches regressions**: all states in one diff, easy to spot inconsistencies
- **Keeps stories useful**: individual stories still exist for docs and playground

## Debugging failures

When a Chromatic build fails:

1. Click the Chromatic link in the PR checks.
2. Walk through each diff. Red is removed, green is added.
3. For each change, decide:
   - **Expected?** Accept it.
   - **Unexpected?** Investigate before accepting. Run Storybook locally and compare.
   - **Flaky?** (Same code, different output.) Fix the story. See causes below.

Be suspicious when a diff shows changes you didn't touch, multiple unrelated components
shifted, or layout moved globally. These usually point to font loading, a changed design
token, or a shared style leak.

### Common flakiness causes

- **`Date.now()` / `new Date()`**: timestamps differ between runs. Use fixed dates.
- **`Math.random()`**: random content changes. Use seeded random or static data.
- **Animations**: partial frames captured. Disable or wait for completion.
- **Async data fetching**: loading state captured. Mock data synchronously.
- **Font loading race**: text shifts before fonts load. Preload fonts or set
  `font-display: block`.
- **External images**: missing or changed. Use local assets or data URIs.
- **CSS hover transitions**: partial state captured. Add `chromatic: { delay: 300 }` to
  let the transition settle.

To investigate locally, run `cd apps/docs && pnpm storybook` and compare against the
Chromatic baseline screenshot.

## Baseline management

**Accepting a change declares it as truth.** Every future PR diffs against your acceptance,
so careless accepts propagate mistakes.

Before accepting:

- **Actually review the diff.** Don't batch-accept to make CI green.
- **Investigate unexpected changes.** If you didn't touch it, something else did.
- **Watch for global shifts.** A large number of unrelated diffs usually means a shared
  token, font, or style changed. Fix the root cause rather than accepting everything.

After merging, accepted changes become the new `main` baseline. There's no "un-accept".
Reverting would require reverting the PR itself.

### Habits to avoid

- Accepting changes you didn't make without understanding why they changed.
- Accepting during incidents just to unblock CI ("we'll fix it later").
- Accepting without opening the diff at all.

## Viewport and theme coverage

By default, stories are snapshotted in light theme at desktop width. If you need to
capture dark mode or mobile viewports, add `modes` to the story's Chromatic parameters:

```tsx
export const MyStory = {
  parameters: {
    chromatic: {
      modes: {
        light: { theme: 'light' },
        dark: { theme: 'dark' },
        mobile: { viewport: 'mobile1' },
      },
    },
  },
}
```

Each mode is a separate snapshot, so adding three modes triples the quota usage for that
story. Only add what you actually need to catch regressions.

## Component-level tests (separate from Chromatic)

Storybook also runs interaction/render tests via Vitest in a real browser
(Playwright/Chromium):

```bash
cd apps/docs
pnpm test-storybook   # vitest --project=storybook
```

These verify behaviour/rendering and run independently of Chromatic's pixel diffing.

---

## Background

This section explains the design decisions behind our visual testing setup. You don't
need to read this to use visual testing, but it helps if you're debugging workflow
issues or considering changes to the setup.

### Why Chromatic?

Chromatic was added around the 0.0.2 release. It offers a generous free tier of 35k
snapshots per month and handles baseline storage, diffing, and review UI out of the box.

We considered manual snapshot tools like BackstopJS, but storing and versioning baseline
images ourselves would add maintenance overhead. Chromatic abstracts that away.

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

### Why two workflows

The split exists because a PR build and a merge build want opposite things from the same
snapshots:

- **PR build** (`.github/workflows/chromatic-pr.yml`) runs on the PR head and **diffs
  against** the current `main` baseline, so you can review what changed.
- **Merge build** (`.github/workflows/chromatic-main.yml`) runs on the merge commit and
  **becomes** the new `main` baseline (`CHROMATIC_BRANCH: main` + `autoAcceptChanges:
  main`), so the next PR doesn't re-flag changes you already accepted.

Doing both in one workflow would either re-baseline on every PR (changes never get
reviewed) or never update the baseline (every PR re-flags already-accepted changes).

The merge build also sets `CHROMATIC_SHA` to the merge commit. Left alone, the action
reports the PR head instead, which a squash merge leaves unreachable from `main` — the
baseline is then filed under a commit later runs can't resolve, and TurboSnap silently
falls back to the oldest build with a reachable commit and re-snapshots everything.

The merge build only runs when the PR was actually **merged** and carries
`update-visual-testing`. A PR closed without merging, or one that never ran Chromatic,
is skipped.

Other behaviour worth knowing:

- **TurboSnap (`onlyChanged: true`)**: only stories affected by the changed files are
  snapshotted, not the whole Storybook.
- PR builds use **`cancel-in-progress: true`** so a new push cancels the in-flight build
  and only the latest commit is snapshotted. Merge builds use
  **`cancel-in-progress: false`** because baseline builds must not be cancelled.

## Configuration reference

Configuration lives in `apps/docs/chromatic.config.json`, shared by both workflows and
the local `chromatic` script.

| Key | Purpose |
|-----|---------|
| `projectId` | Chromatic project this Storybook belongs to. |
| `storybookBaseDir` | Repo-relative root of the Storybook (`./apps/docs`). Anchors TurboSnap's change detection. |
| `storybookConfigDir` | Storybook config dir (`./apps/docs/.storybook`). |
| `storybookBuildDir` | Prebuilt static Storybook output (`./storybook-static`). |
| `onlyChanged` | Enables TurboSnap by default. |
| `zip` | Uploads the build as a zip (faster for large Storybooks). |
| `externals` | Non-source assets (fonts, css, favicons) that, when changed, should invalidate TurboSnap rather than be silently skipped. |

`projectToken` is **not** in this file. It comes from the `CHROMATIC_PROJECT_TOKEN`
repository secret (CI) or your environment (local).
