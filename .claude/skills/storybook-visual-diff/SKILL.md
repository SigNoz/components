---
name: storybook-visual-diff
description: Screenshot a set of @signozhq/ui Storybook stories, then pixel-diff two runs to see what a CSS or component change did, with the changes tinted over the new shot. Use when asked to take story screenshots, capture a visual baseline, compare before/after of a style change, or find which components a change affects.
---

# Storybook visual diff

Two scripts under `apps/docs/scripts`:

- `story-shots.mjs` — screenshots stories off a running Storybook dev server.
- `story-shots-diff.mjs` — pixel-diffs two runs and paints what moved.

Output goes to `apps/docs/.story-shots/` (gitignored), one directory per run.
Run both scripts from `apps/docs`.

## 0. Settle what is being compared, first

A diff is only worth taking when the two runs straddle something. Run twice over
the same tree and the answer is zero, or the noise floor: true, and useless.
So before starting a server, pin down four things. Whatever the prompt already
says, take it and do not ask again; ask only for what is genuinely missing, in
**one** `AskUserQuestion` call.

| To settle | Ask | Options |
| --- | --- | --- |
| Job | "What should this run produce?" | shoot only · baseline for a change you are about to make · compare against a change already in the working tree · compare this branch against another (`main` by default, or one the user names) · compare two configurations of the same story (`--args`, clock, width) · noise floor (same tree twice) |
| Scope | "Which stories?" | offer 2-3 concrete selections read off `index.json` (one component, a `--title` prefix, everything), never open-ended |
| Themes | "Which themes?" | dark · dark + light |
| Read-out | "How should the diff read?" | `green` (changed pixels over the after shot) · `green-parallel` (before \| after \| diff, side by side) · `red` · `red-parallel` · `none` (keep both runs, do not diff) |

Skip a row when the prompt answers it, and skip the whole call when the prompt
answers all of it ("shoot the badge stories in both themes" needs no question).
Skip Read-out too whenever the job is *shoot only*, and take `none` for what it
says: shoot both sides, report both paths, run no comparison. The index holds
509 stories, so a silent guess on scope burns a lot of wall clock on the wrong
ones.

The job decides which loop below to run:

| Job | Loop |
| --- | --- |
| **shoot only** | §1, §2, stop. Report the paths. No diff, no second run. |
| **baseline first** | the full loop, stopping after step 2 to hand the change back. The user makes it, then continue at step 4. |
| **change already in the tree** | the tree *is* the after state. `git stash` (or check out the base commit) to shoot the before, restore, shoot the after. Confirm the working tree is clean enough to stash before touching it, and restore it even if a capture fails. |
| **branch vs branch** | shoot the current branch, then `git switch <base>` in place (stash first if the tree is dirty), restart the dev server, shoot again, switch back and unstash. Restart matters: HMR does not survive a whole-branch swap cleanly. Get the tree back to where it started even if a capture fails. |
| **noise floor** | two runs, same tree, diff. The number is the harness's floor, not a finding. |
| **config vs config** | same tree, two runs that differ only in flags: `--args`, `--clock`, `--width`, `--theme`, `--motion`. Filenames stay identical, so the pairs line up and the caption names what changed. |

`packages/ui` is the source of the components; `apps/docs` only holds the
stories. A change to a component is a change to the dev server's own dependency
graph, and Vite picks it up over HMR, so a before/after in the same session
needs no restart.

## The loop

1. Capture the baseline **before touching anything**.
2. Capture it a second time and diff the two. That is the noise floor: anything
   it reports is what the harness cannot hold still, and no conclusion about the
   change may rest on those stories. Cheap on a handful of stories, so on a wide
   sweep run it over the two or three stories the change is aimed at instead of
   all of them.
3. Make the change.
4. Capture again into a third directory.
5. Diff, then read the tinted shot of the largest movers to judge the change.

## 1. One dev server, on a free port

`storybook dev` keys its Vite dep cache off the config dir, so two servers on the
same `-c` serve mismatched prebundles and every story dies with `Invalid hook
call`. Port 6006 is this repo's own default (`pnpm dev`) and is often already up
— reuse it rather than starting a second one, but check whose it is first, since
another repo's Storybook answers on 6006 too and its `index.json` indexes the
wrong stories:

```bash
for port in 6006 6007; do
  curl -s -m 2 "http://localhost:$port/index.json" | head -c 60 && echo "  <- $port"
done
```

Start one on a free port when nothing is up, from the app's own binary so no
package manager shim is in the way:

```bash
cd apps/docs
nohup ./node_modules/.bin/storybook dev -p 6007 --no-open --quiet \
  > "${TMPDIR:-/tmp}/storybook.log" 2>&1 &
```

It is ready when `curl -s localhost:6007/index.json` returns JSON whose
`entries` hold this repo's story ids (`primitive-components-…`,
`composed-components-…`).

## 2. Capture

Playwright is a devDependency of `apps/docs`, so nothing extra to install. It
launches Playwright's own chromium and falls back to an installed Chrome;
`CHROME_PATH=/path/to/chrome` points it at a specific binary.

Then pick the stories. `--list` prints the selection without shooting anything:

```bash
# every badge story, both themes
node scripts/story-shots.mjs .story-shots/baseline \
  --stories badge --theme dark,light

# a title prefix, one theme
node scripts/story-shots.mjs .story-shots/baseline \
  --title 'Composed Components/' --theme dark
```

| Flag | Meaning |
| --- | --- |
| `--stories <match>` | id or `Title/Name` substring, repeatable or comma-separated. Omit for every story. |
| `--title <prefix>` | only titles starting with the prefix (`Primitive Components/`, `Composed Components/`, `Design System/`, `Old Components/`) |
| `--name <match>` | only story names containing the match |
| `--theme dark,light` | `dark` or `light`, one pass per theme; omit for the preview's own default (dark) |
| `--args <k:v;k2:v2>` | arg overrides, Storybook's own `?args=` syntax, repeatable. A dotted value is dropped by Storybook itself |
| `--port` | dev server port, default 6006, or `$SB_PORT` |
| `--width <px>` | the only fixed dimension, default 1680 |
| `--height <px>` | shortest the viewport may be, default 1200 |
| `--max-height <px>` | tallest it may grow to, default 8000 |
| `--grow <what>` | `document` (default) grows the viewport until the page fits, `none` keeps `--height` and leaves the page its own scrollbar |
| `--settle <ms>` | wait after the page goes quiet, default 1500 |
| `--clock <iso\|live>` | wall clock the page reads, default `2026-06-15T12:00:00.000Z`; `live` unfreezes it |
| `--motion` | keep animations and transitions running (sets the `motion` global to `live`) |
| `--ignore <selector>` | hide matching elements, on top of `[data-shot-ignore]` and `[data-chromatic="ignore"]` |
| `--flat` | write `<out>/<id>.png`, no theme directory |
| `--no-caption` | leave the caption band off the shots |
| `--list` | print the matched stories and exit |

Files land at `<out>/<theme>/<story-id>.png`, next to a `shots.json` recording
what each shot is (id, title, name, theme, `ok`/`busy`, the caption's height in
rows) and how the run was configured (args, clock, width, height, grow, motion,
settle, ignore). Keep the flags identical between the two runs or the diff pairs
nothing.

Budget roughly 5s per shot on a warm server (6 shots in 33s), more on the first
visit to each story while Vite transforms its module. A whole-index sweep in one
theme is well over half an hour, so scope it.

Every shot carries the caption band described below, so a single screenshot says
what it is on its own. `--no-caption` leaves it off, and so does a machine
without ImageMagick (with a warning). The band never changes the shot's width
(long text wraps rather than widening the canvas) and its height is recorded, so
the diff crops it back off and never reports one caption against another. Two
runs whose captions are different heights still diff to zero. A story that never
held still for two identical frames is logged `busy` instead of `ok` — treat its
diff as suspect.

Dark alone is enough while iterating on the harness; add `light` for the run you
report, since most component work touches both.

## 3. Diff

```bash
node scripts/story-shots-diff.mjs .story-shots/baseline .story-shots/after .story-shots/diff
```

Prints `<changed pixels>  <theme>/<story>.png`, largest first, and writes one
image per pair. Needs ImageMagick for PNG encode/decode (7's `magick`, or 6's
`convert`/`identify`/`montage`); the comparison itself is in the script.

| Flag | Meaning |
| --- | --- |
| `--mode green` | default. The after shot with the changed pixels painted over it, exactly the pixels that changed. What Chromatic shows. |
| `--mode green-parallel` | `previous \| current \| diff` in one image, each tile labelled above it, on a gutter inverted from the theme. The diff tile is the `green` one, so the after shot stays readable underneath. |
| `--mode red` | the after shot faded to 10%, changed pixels in red. A pixelmatch-style diff, easiest to read when the change is a thin edge. |
| `--mode red-parallel` | the same three tiles, with the `red` diff. Best when the change is a thin edge that the unfaded shot would swallow. |
| `--threshold <0..1>` | how far a pixel must move to count. Default 0.063, Chromatic's `diffThreshold`. |
| `--include-aa` | count antialiasing changes too. Off by default, as in Chromatic. |
| `--tint <#rrggbb>` | override the mode's colour. |
| `--no-caption` | drop the caption band. |

A story only one run has — added, removed or renamed between the two — has
nothing to pair with. The side that does have it is written out, captioned
`missing previous` or `missing current`, and its whole area counts as changed so
it sorts to the top. In a `-parallel` mode the montage keeps its three tiles: the
run that has the shot shows it, and the run that does not, like the diff tile,
carries a `missing previous` / `missing current` label the same size in its
place. Nothing is compared, so nothing is tinted.

```
   2232720  dark/only-in-after.png  (missing previous)
   2016000  dark/primitive-components-badge--playground.png  (missing current)
       772  light/primitive-components-badge--playground.png
```

### The caption

Both scripts stamp a band on top of what they write: `story-shots.mjs` on each
shot, from the story and the run's own settings; `story-shots-diff.mjs` on each
diff, read out of the two runs' `shots.json`. It carries the story's
`Title/Name`, then its id, theme and `busy` flag, then the settings both runs
shared, each reading `key:value`. Whatever the two runs did **differently** goes
on the side it belongs to: under `previous` and `current` on the parallel tiles,
on two lines of the band otherwise. So a pair that differs only in `--args` says
so on its face, which is what makes several shots of one story tellable apart.

The shots' own bands are cropped off before comparing and before going into the
tiles, so nothing in the output is a diff of a caption. Type size follows the
image width, so it stays readable with the whole image viewed at fit-to-width;
the heading is set in an installed sans and the detail lines in a mono, falling
back to ImageMagick's default when neither is on the machine. Without a manifest
the band falls back to the file path, and a directory of captioned shots whose
`shots.json` is missing has nothing to crop by, so its captions do land in the
diff. Keep `shots.json` next to the shots.

### How the comparison works

Chromatic's own capture and diff run server-side — `chromatic-cli` uploads a
built Storybook and contains no capture or comparison code at all. What is public
is the parameter contract, and the numbers in it say what the comparison is:
`diffThreshold` defaults to `0.063` on a 0-1 scale, which is pixelmatch's
`threshold`, and `diffIncludeAntiAliasing` defaults to false, which is
pixelmatch's `includeAA: false`. So the script implements that comparison:

1. Both PNGs are read as raw RGBA through `magick … RGBA:-`.
2. Per pixel, the squared YIQ distance between the two colours (weights
   `0.5053 / 0.299 / 0.1957`), compared against `35215 * threshold²` — 35215 is
   the largest distance two 8-bit colours can have. Chroma is included, so a
   colour swap at equal brightness still counts.
3. A pixel over the threshold is dropped when it is only antialiasing: it is the
   darkest or lightest of its eight neighbours, and the other image has a pixel
   around there doing the same job. This is what keeps a subpixel glyph edge from
   reading as a change.
4. What survives is painted at full opacity, one output pixel per changed input
   pixel. No dilation, no blobs — a one-pixel shift shows as a one-pixel line.

A pair whose shots are different sizes is compared over the overlap, and every
row and column that exists in only one of them counts as changed.

## What makes a shot reproducible

Part of it is in the preview, so a Chromatic build shoots the same page:
`settleForCapture` (the preview's `afterEach`, which runs after `play`) parks the
animations through `html.sb-still` in `.storybook/preview.css` and snaps the
bottom-pinned lists. The script drives the rest:

- **Storybook's own render phase is the readiness signal.** It waits for
  `window.__STORYBOOK_PREVIEW__.storyRenders[].phase === 'finished'`, which is
  reached only after the loaders, the decorators and the story's `play` are done.
  A DOM check cannot see a `play` still running. (Storybook 10 spells the final
  phase `finished`, not `completed`.)
- **Network quiescence, not `networkidle`.** The Inter faces come off Google
  Fonts and story chunks are transformed on first visit, so the wait is "no
  request for 600ms", capped at 15s.
- **The clock is frozen** (`2026-06-15T12:00:00Z`) through Playwright's
  `context.clock.setFixedTime`, which pins what the page reads as the date and
  leaves the timers running. The calendar draws a `today` cell off it, so a live
  clock moves that cell on its own.
- **The theme is forced after the render.** There is no `theme` global in this
  preview: `ModeDecorator` sets `dark` on `<html>` on mount, so `--theme` toggles
  that class once the story has rendered. `--theme` takes `dark` or `light` and
  nothing else.
- **Animations are parked on their last frame** by `html.sb-still`, a
  zero-length single iteration with `forwards` fill, plus `prefers-reduced-
  motion`. The Motion toolbar item (`still` by default) turns it off. An infinite
  spinner is otherwise caught at a random angle, and the `transition` on `*` in
  `preview.css` would otherwise catch a colour mid-fade.
- **`document.fonts.ready`**, because text reflows when a face lands late.
- **Lists pinned to their bottom are snapped onto it**, once by the preview and
  again by the script after the page goes quiet. A virtualized list settles a few
  pixels short of the end depending on the order its items were measured in.
- **Two identical frames in a row**, because what a page is still waiting on is
  often not observable from outside it.
- **`[data-shot-ignore]`, `[data-chromatic="ignore"]` and `--ignore <selector>`**
  hide a region that cannot be held still; Chromatic excludes the same attribute
  from its comparison.
- **The width is the only fixed dimension.** Chromatic's `viewports` are widths;
  the height follows the page. `--grow document`, the default, grows the viewport
  in up to three rounds until the document fits, capped at `--max-height`. A
  story that sizes itself in `vh` grows its own content as the viewport grows, so
  no height ever fits it: the rounds stop, the story is shot at `--height` with
  its own scrollbar, and the log says
  `(viewport-sized content, stopped chasing Npx)`.

With all of that, two runs over the same tree diff to zero on every story tried
so far (badge and calendar, both themes). A story that comes back non-zero
against itself is a finding about the harness, not about the change: diff a
story against itself before believing its number, and reach for `--ignore` when
a region cannot be settled.

## Gotchas

- **Zero pixels is a real answer.** A story that does not use the variant a rule
  touches is unaffected by it; that is not a broken capture.
- **`--args` values must be real.** Storybook drops what the component does not
  understand and the story renders unchanged, which reads as a zero diff. Badge
  colours are `primary`, `danger` and friends — `color:destructive` silently
  does nothing. Check the story's `argTypes` before blaming the harness.
- **A dot in an `--args` value is dropped by Storybook itself**, so a value like
  `1.5` never arrives.
- **A fresh context per story** is what keeps the theme class, storage and
  anything a story writes to the document out of the next story, and it is most
  of the ~5s per shot.
- **Stories behind a hover, dropdown or dialog** only render what their `play`
  reaches. If a state is missing from the shot, the story needs the `play`, not
  the script.
- **`@signozhq/design-tokens` is linked through yalc.** A token change only
  reaches the shots after the usual yalc push and install, so a before/after
  across a token bump is a two-install job, not an HMR one.
- **Chromatic runs on this repo too** (`pnpm chromatic`, see `VISUAL_TESTING.md`).
  These scripts are the local, free version of the same question; they do not
  replace the accepted baselines Chromatic keeps.
