---
name: component-audit
description: Audit all @signozhq/ui components against COMPONENT_AUDIT_RUBRIC.md and generate a scored report.
---

# Component Audit

Audits all components in `packages/ui/src/` against the rubric in `COMPONENT_AUDIT_RUBRIC.md`.

## When to Use

- Periodic quality assessment of component library
- Prioritizing component improvement work
- Tracking progress on component standardization

## Prerequisites

Read these files before running:
- `COMPONENT_AUDIT_RUBRIC.md` - scoring criteria
- `COMPONENT_GUIDELINES.md` - the standard being scored

## Workflow

Use Workflow tool to parallelize component audits.

### 1. Discover Components

```bash
ls -d packages/ui/src/*/ | grep -v '__' | grep -v 'lib' | xargs -I{} basename {}
```

### 2. Run Parallel Audit

Use workflow with this structure:

```js
export const meta = {
  name: 'component-audit',
  description: 'Audit all UI components against rubric',
  phases: [
    { title: 'Audit', detail: 'Score each component on 6 dimensions' },
    { title: 'Report', detail: 'Generate markdown report' }
  ]
}

const SCORE_SCHEMA = {
  type: 'object',
  properties: {
    component: { type: 'string' },
    scores: {
      type: 'object',
      properties: {
        structure: { type: 'number', minimum: 0, maximum: 2 },
        css: { type: 'number', minimum: 0, maximum: 2 },
        props: { type: 'number', minimum: 0, maximum: 2 },
        docs: { type: 'number', minimum: 0, maximum: 2 },
        stories: { type: 'number', minimum: 0, maximum: 2 },
        tests: { type: 'number', minimum: 0, maximum: 2 }
      },
      required: ['structure', 'css', 'props', 'docs', 'stories', 'tests']
    },
    issues: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          dimension: { type: 'string' },
          score: { type: 'number' },
          issue: { type: 'string' },
          fix: { type: 'string' }
        }
      }
    }
  },
  required: ['component', 'scores', 'issues']
}

phase('Audit')

const components = args // array of component names passed in

const results = await parallel(components.map(name => () =>
  agent(`Audit component "${name}" against the rubric.

Location: packages/ui/src/${name}/

## Scoring Dimensions (0-2 each)

### 1. Structure & Exports
- 0: Logic in index.ts, flat file dump, or missing from lists
- 1: Correct layout but naming drift or helpers inlined
- 2: Kebab-case dir, clean index.ts, subcomponents/presets split, all lists sync

Check: index.ts exports, directory structure, naming conventions

### 2. CSS & Tokens
- 0: Hardcoded values, primitive colors, Tailwind remnants, global selectors
- 1: Tokenized but has literal fallbacks or class-based variants
- 2: Every value is --{component}-* var resolving to semantic token, no fallback

Check: *.module.scss, CSS custom properties, data-* variants

### 3. Props & Types
- 0: Upstream signatures hand-restated, unexported types, no forwardRef
- 1: Correct forwardRef/testId but some hand-written upstream types
- 2: All props declared with JSDoc, upstream types borrowed via OriginalProps['x']

Check: component.tsx, forwardRef usage, testId prop, type exports

### 4. Prop Documentation
- 0: No JSDoc
- 1: Partial JSDoc or @default tags disagree with implementation
- 2: Every public prop documented with constraints, @default matches implementation

Check: JSDoc comments on props

### 5. Stories & MDX
- 0: No story, wrong title group, or one story with no argTypes
- 1: Default story + some argTypes but no per-subcomponent stories or no MDX
- 2: Story per exported component, full argTypes, MDX with usage + Controls

Check: apps/docs/src/stories/ for *.stories.tsx and *.mdx files

### 6. Tests
- 0: None
- 1: Render smoke test only (forward-ref test)
- 2: Behavior test per interactive prop, forward-ref test, interaction stories

Check: *.test.tsx and *.forward-ref.test.tsx in component dir

Return structured scores and any issues found.`, 
    { label: name, phase: 'Audit', schema: SCORE_SCHEMA }
  )
))

phase('Report')

return results.filter(Boolean)
```

### 3. Pass Components to Workflow

```js
const components = [
  'alert-dialog', 'announcement-banner', 'avatar', 'badge', 'breadcrumb',
  'button', 'calendar', 'callout', 'checkbox', 'combobox', 'command',
  'date-picker', 'dialog', 'divider', 'drawer', 'dropdown-menu', 'input',
  'input-number', 'kbd', 'pagination', 'pin-list', 'popover', 'progress',
  'radio-group', 'resizable', 'select', 'skeleton', 'slider', 'sonner',
  'switch', 'table', 'tabs', 'text-ellipsis', 'toggle', 'toggle-group',
  'tooltip', 'typography'
]

Workflow({ script: '...', args: components })
```

## Report Generation

After workflow completes, generate `COMPONENT_AUDIT_RESULTS.md`:

### Structure

```markdown
# Component Audit Results

Audit performed against [COMPONENT_AUDIT_RUBRIC.md](./COMPONENT_AUDIT_RUBRIC.md). N components scored across 6 dimensions (0-2 each, max 12).

## Summary by Band

| Band | Meaning | Count |
|------|---------|-------|
| 11-12 | Reference quality | X |
| 8-10 | Solid, file issues for gaps | X |
| 5-7 | Needs work before recommending | X |
| 0-4 | Rework before recommending | X |

---

## Full Scores

### Band 11-12 (Reference Quality)

| Component | Total | Struct | CSS | Props | Docs | Stories | Tests |
|-----------|-------|--------|-----|-------|------|---------|-------|
| component | **12** | 2 | 2 | 2 | 2 | 2 | 2 |

[repeat for each band]

---

## Critical Issues (Priority Order)

Dimensions 2 (CSS) and 3 (Props) carry highest consumer-visible risk per rubric.

### HIGH Priority

#### 1. ComponentName (X/12) - Band Y

**Location:** `packages/ui/src/component/`

| Dimension | Score | Issue | Fix |
|-----------|-------|-------|-----|
| CSS | 0 | Issue description | How to fix |

[repeat per issue]

---

## Dimension-Specific Issues

### Dimension N: Name

| Component | Score | Issue |
|-----------|-------|-------|
| component | 0 | Issue description |

---

## Action Items by Priority

### P0: Critical (Fix before recommending)
- [ ] **component**: Action needed

### P1: High (Dimension 2 & 3 fixes)
- [ ] **component**: Action needed

### P2: Medium (Documentation gaps)
- [ ] **component**: Action needed

### P3: Low (Test coverage)
- [ ] **component**: Action needed

---

## Reference Components

| Component | Score | Why Reference |
|-----------|-------|---------------|
| **component** | 12/12 | Reason |

---

## Audit Metadata

- **Date:** YYYY-MM-DD
- **Components audited:** N
- **Rubric version:** COMPONENT_AUDIT_RUBRIC.md
- **Average score:** X.X/12
- **Weakest dimension:** Name (avg X.X/2)
- **Strongest dimension:** Name (avg X.X/2)
```

## Band Classification

| Total Score | Band | Action |
|-------------|------|--------|
| 11-12 | Reference quality | Use as examples for others |
| 8-10 | Solid | File issues for gaps, no blocker |
| 5-7 | Needs work | Prioritize dimensions 2 and 3 |
| 0-4 | Rework | Fix before recommending anywhere |

## Priority Weighting

Per rubric, dimensions 2 (CSS) and 3 (Props) carry most consumer-visible risk:
- CSS gap = consumers cannot theme component
- Props gap = breaks builds on dependency bump

## Checklist

- [ ] Read COMPONENT_AUDIT_RUBRIC.md
- [ ] Discover all component directories
- [ ] Run parallel audit workflow
- [ ] Collect structured results
- [ ] Group by band (11-12, 8-10, 5-7, 0-4)
- [ ] Sort within band by total score descending
- [ ] Extract critical issues (dimension 2 and 3 scores < 2)
- [ ] Build dimension-specific issue tables
- [ ] Create prioritized action items
- [ ] Identify reference components (score 12 or highest in key dimensions)
- [ ] Calculate metadata (averages, counts)
- [ ] Write COMPONENT_AUDIT_RESULTS.md
