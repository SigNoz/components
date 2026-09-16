# Moving a component library from jsdom to Vitest browser mode

Written after benchmarking `@signozhq/ui` (121 test files, 1036 tests) across
three CI runs in September 2026. Every number here came from a measurement, not
an estimate. The repo-specific details are called out so this can be reused
elsewhere.

## The headline

On a 4-core GitHub runner, browser mode with the Playwright provider ran the
suite **3.2x faster than jsdom** (29s against 93s). It also deleted a pile of
mocks and caught three tests that jsdom was passing incorrectly, one of which was
a real product bug.

## Benchmark the CI, not your laptop

This is the part that generalises best, and it is the part that nearly sent us
the wrong way.

| provider | 32-thread dev box | 4-core CI runner |
| --- | ---: | ---: |
| jsdom | 15s | 93s |
| playwright | 17s | 29s |

**The ranking inverts.** Locally jsdom looks faster, so a local measurement would
have argued against the migration that is 3.2x faster where it matters.

The cause is visible in Vitest's own summary line. jsdom constructs a DOM
environment per test file:

```
jsdom:   Duration 116.80s (... environment 124.23s, import 72.64s)
browser: Duration 189.06s (... environment 0ms,     import 137.45s)
```

On a 32-thread machine that per-file `environment` cost is absorbed by spare
cores. On 4 cores it is the run. Browser mode has no per-file environment cost at
all; it reuses one Chromium.

## Runner variance will fake a result if you let it

Consecutive runs of the *same* commit varied by up to **1.6x**:

| run | ui suite | docs suite |
| ---: | ---: | ---: |
| A | 116.8s | 189.1s |
| B | 191.4s | 281.7s |
| C | 189.0s | 278.1s |

Both suites scale by the same factor within a run, so this is machine speed, not
anything in the code. Comparing config X in one run against config Y in another
run proves nothing at this noise level.

**Time every configuration sequentially inside a single job.** A shell helper is
enough:

```bash
bench() {
  label="$1"; shift
  mode="$1"; shift
  start=$(date +%s)
  MY_TEST_MODE="$mode" "$@"
  status=$?
  end=$(date +%s)
  printf '%s\t%s\t%s\n' "$label" "$((end - start))" "$status" >> /tmp/bench.tsv
  echo "RESULT $label $((end - start))s exit=$status"
}
```

Drive it from an env var read by `vitest.config.ts`, so both paths run from
byte-identical test code:

```ts
const mode = process.env['MY_TEST_MODE'] ?? 'playwright';
export default mode === 'jsdom' ? jsdomConfig : browserConfig;
```

## Check what is actually on the critical path first

Switching the ui suite to browser mode changed the full CI time by nothing:

| config | full `pnpm test` |
| --- | ---: |
| jsdom | 230s |
| playwright | 229s |

`turbo run test` runs the ui and docs suites in parallel, the docs suite was
already browser mode, and it was always the slower of the two. The 64s saved on
ui was hidden behind it. Two concurrent Chromium fleets on 4 cores cost nothing
measurable, which is worth knowing on its own.

So: profile the job's step timings before optimising anything. On this repo the
test step was 195s of a 276s job; the other 81s was container init, install,
lint, build and type-check, and no amount of test tuning touches those.

## Provider choice

| provider | CI | verdict |
| --- | ---: | --- |
| playwright | 26-29s | use this |
| webdriverio | 52s | works, 2x slower |
| preview | fails | not usable in CI |

**playwright** is the default recommendation in Vitest's own docs because it
supports parallel execution.

**webdriverio** passed all 1036 tests but took twice as long. Two gotchas: it
names the browser `chrome`, not `chromium`, and in the Playwright container image
Chrome is under `/ms-playwright` rather than on `PATH`, so it needs an explicit
binary:

```ts
webdriverio({
  capabilities: {
    'goog:chromeOptions': {
      binary: process.env['CHROME_BIN'],
      args: ['--headless=new', '--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
    },
  },
})
```

**preview** cannot be used in CI. It refuses `headless: true` outright:

```
Error: You've enabled headless mode for "preview" provider but it doesn't support it.
Use "playwright" or "webdriverio" instead
```

Its docs say the window "will always be visible", so we gave it an `Xvfb` display
and connected Chrome by hand to the URL it prints. It then completed 11 of 121
files and died:

```
Error: Failed to connect to the browser session "..." within the timeout.
```

It has no automation driver, so it cannot open a browser per session and a single
manual connection cannot serve the rest. It also simulates events instead of
using the Chrome DevTools Protocol, so it is the least faithful option anyway.

## `isolate: false` is a trap

`browser.isolate: false` reuses the page between test files and directly attacks
`import`, which dominates the browser-mode run. It also broke **389 of 1036
tests** through shared DOM state. Measured, rejected. Do not ship it without
running the full suite.

## The migration itself

### 1. Split node-only tests into their own project

Tests that assert on files on disk cannot run in a browser: the bundler
externalizes `node:fs` and they fail with `Module "node:fs" has been
externalized for browser compatibility`. In this repo that was five suites
checking built output, `package.json` exports and tsc diagnostics.

```ts
const nodeOnlyTests = ['src/__tests__/*.test.ts', 'src/**/*.types.messages.test.ts'];

export default defineConfig({
  test: {
    projects: [
      {
        ...shared,
        test: {
          name: 'browser',
          include: ['src/**/*.test.{ts,tsx}'],
          exclude: nodeOnlyTests,
          setupFiles: ['./vitest.setup.ts'],
          globals: true,
          browser: {
            enabled: true,
            provider: playwright({}),
            headless: true,
            instances: [{ browser: 'chromium' }],
          },
        },
      },
      {
        ...shared,
        test: {
          name: 'node',
          environment: 'node',
          include: nodeOnlyTests,
          globals: true,
          typecheck: { enabled: true, include: ['src/**/*.test-d.{ts,tsx}'], tsconfig: './tsconfig.json' },
        },
      },
    ],
  },
});
```

### 2. Replace per-file jsdom shims with one guarded block

Seven files opened with some variant of this, which is dead weight in a browser
and fails outright because browsers have no `global`:

```ts
beforeAll(() => {
  global.ResizeObserver = class ResizeObserver { observe() {} unobserve() {} disconnect() {} };
  Element.prototype.scrollIntoView = vi.fn();
});
```

`ReferenceError: global is not defined` was the single most common failure. Move
them into the shared setup behind a feature check, so they install only where the
API is genuinely missing and browser mode exercises the real implementations:

```ts
if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class ResizeObserver { observe() {} unobserve() {} disconnect() {} };
}
if (typeof Element !== 'undefined' && typeof Element.prototype.scrollIntoView !== 'function') {
  Element.prototype.scrollIntoView = () => {};
}
```

This keeps both modes green off identical code, which is what makes the benchmark
honest. Watch for unused `beforeAll` / `vi` imports left behind; the linter will
find them.

### 3. Expect a small number of genuine behaviour differences

28 of 121 files failed on the first browser run, but 25 of those were the two
mechanical causes above. Only three were real, and every one was jsdom having
lied:

**Computed style is now real.** A test asserted
`toHaveStyle({ width: '240px' })` on an input carrying `style={{ width: '240px' }}`.
The browser reported `370.016px`, because the element is a flex item with
`flex: 1`, and `flex-basis: 0%` overrides `width`. jsdom loads no CSS, so it
never noticed. The test was about prop forwarding, so it now asserts the inline
style landed rather than what the browser computes from it.

**Animations exist.** A Radix tooltip asserted synchronous unmount after its
`open` prop flipped to `false`. Real browsers run the exit animation, so the node
outlives the flip. Wrap in `waitFor`.

**Layout-dependent logic actually runs.** An infinite-scroll test asserted
`onLoadMore` fires when a sentinel intersects. It passed under jsdom and failed
in the browser. The reason is worth spelling out: the sentinel only renders in
the virtualized body, the test never enabled virtualization, so the
`IntersectionObserver` was **never constructed at all**. Under jsdom every
element measures 0px, a scroll fallback fired `onLoadMore`, and the assertion
went green while the thing it names did not exist.

That last one is a real product bug the jsdom suite had been hiding: the effect
bails on `!sentinelRef.current` and its dependency array never changes when the
virtualizer later commits the sentinel row, so the observer is never armed.

The lesson generalises: **jsdom's zero-sized layout turns "did nothing" into
"passed"** for anything driven by `IntersectionObserver`, `ResizeObserver`,
scroll position or element geometry. Those are exactly the tests worth re-reading
after a migration, whether or not they turn red.

### 4. Housekeeping

Browser mode writes screenshots and attachments on failure. Ignore them:

```gitignore
**/__screenshots__
**/.vitest-attachments
**/.vitest
```

Put the provider package in `devDependencies`. For a published package it is a
test-only tool and has no business in `dependencies`.

## On upgrading Vitest at the same time

Don't. We measured 4.1.11 against 5.0.1 and the win was nil (29s vs 26s, inside
run noise), while the costs were real:

- Vitest 5 **broke jsdom mode**, three files failing with `The snapshot state for
  '...' is not found. Did you call 'SnapshotClient.setup()'?`. Browser mode was
  unaffected, since those files run in the node project there.
- A Storybook-driven docs app pinned to `@storybook/addon-vitest`, whose peer
  range was `vitest: ^3.0.0 || ^4.0.0`, could not move. Mixing v4 and v5 in one
  pnpm workspace then broke the docs type-check with two incompatible
  `UserConfig` types.

Land the mode change on the version you already run, and upgrade separately.

## Supply-chain settings will block you, correctly

If the repo sets pnpm guards, expect them to fire, and prefer the scoped escape
hatch over disabling the policy.

`trustPolicy: no-downgrade` refused webdriverio:

```
ERR_PNPM_TRUST_DOWNGRADE  High-risk trust downgrade for "@wdio/repl@9.16.2"
Earlier versions had provenance attestation, but this version has no trust evidence.
```

One package needed exempting, not the policy:

```yaml
trustPolicyExclude:
  - '@wdio/repl@9.16.2'
```

`minimumReleaseAge: 2880` refused a version published the day before, which is
the setting doing its job. `minimumReleaseAgeExclude` takes names, patterns and
pinned versions. Relaxing either is a decision for whoever owns the repo, not
something to route around quietly, and it should never ride along inside an
unrelated change.
