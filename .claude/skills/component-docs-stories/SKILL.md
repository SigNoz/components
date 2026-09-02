---
name: component-docs-stories
description: Use when adding new UI components with subcomponents or presets, creating Storybook stories, or wiring MDX docs with Controls for design system components.
---

# Component Docs & Stories (Subcomponents + Presets)

## When to Use

- Add new component with **subcomponents** (Dialog, RadioGroup, Command)
- Add **presets/wrappers** from primitives (DialogWrapper, ConfirmDialog, AlertDialog)
- Wire MDX docs with **Controls** for each component/preset/subcomponent

Target: design-system / UI libraries using Storybook + MDX.

## High-Level Workflow

1. Pick reference component
2. Create per-component stories
3. Create per-preset stories (if any)
4. Wire MDX docs to stories
5. Visual QA in Storybook (light + dark)

## 1. Reference Components

Good examples in this repo:

**Root + subcomponents:**
- `radio-group.stories.tsx`, `radio-group-item.stories.tsx`, `radio-group-label.stories.tsx`, `radio-group.mdx`

**Dialog primitives + presets:**
- `dialog-primitive.stories.tsx`, `dialog-*.stories.tsx`
- `dialog-wrapper.stories.tsx`, `confirm-dialog.stories.tsx`, `alert-dialog.stories.tsx`
- `dialog.mdx`

When in doubt, mirror **dialog** structure.

## 2. Per-Component Stories

### File naming

- Root: `component-name-primitive.stories.tsx`
- Subcomponents: `component-name-subname.stories.tsx`

### Meta pattern

```ts
import { fn } from 'storybook/test';

const meta: Meta<typeof DialogContent> = {
  title: 'Primitive Components/Dialog/DialogContent',
  component: DialogContent,
  argTypes: { /* ... */ },
  parameters: {
    layout: 'fullscreen',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/<file>?node-id=<id>',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DialogContent>;
```

**Title groups** (from `apps/docs/.storybook/preview.tsx`):
- `Intro`, `Design System`, `Primitive Components`, `Composed Components`, `Old Components`
- Primitives: `Primitive Components/<Component>/<Subcomponent>`
- Presets: `Composed Components/<Preset>`
- Never invent new top-level groups
- Never put new components in `Old Components`

### argTypes

**Categories:** `Content`, `Appearance`, `Behavior`, `State`, `Accessibility`, `Events`, `Testing`, `Styling`

```ts
argTypes: {
  color: {
    control: 'select',
    options: ['primary', 'secondary', 'success'],
    description: 'Color scheme applied to the variant.',
    table: {
      category: 'Appearance',
      type: { summary: 'BadgeColor' },
      defaultValue: { summary: 'primary' },
    },
  },
  onClose: {
    action: 'onClose',
    control: false,
    table: { category: 'Events' },
  },
  testId: { control: 'text', table: { category: 'Testing' } },
}
```

Rules:
- `control: false` for callbacks and complex nodes
- Use `fn()` from `storybook/test` as arg for callbacks (logs interactions)
- `table.type.summary` = readable summary, not full TS type
- `defaultValue.summary` must match implementation AND `@default` JSDoc

### Stories to write

1. **Default/Playground** - controls story, realistic args, no hooks in `args`
2. **Per-state stories** - each variant, color, size, loading, disabled, invalid, with icon, truncated
3. **Subcomponent stories** - render inside realistic parent
4. **Interactive stories** - own state via `useState` in `render` or decorator

### Layout

Use shared classes from `apps/docs/index.css`:
- `story-container`, `story-section`, `story-grid`, `story-row`, `story-panel`, `icon-md`

No Tailwind classes. No ad-hoc inline `style` where shared class exists.

### Default story render

```ts
export const Default: Story = {
  args: {
    onClose: fn(),
    // sensible defaults
  },
  render: (args) => (
    <Dialog defaultOpen>
      <DialogTrigger asChild>
        <Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
          Open dialog
        </Button>
      </DialogTrigger>
      <DialogContent {...args}>
        {/* content */}
      </DialogContent>
    </Dialog>
  ),
};
```

Subcomponents: render inside realistic parent.

## 3. Per-Preset Stories

### File naming

- `dialog-wrapper.stories.tsx`
- `confirm-dialog.stories.tsx`
- `alert-dialog.stories.tsx`

### Meta pattern

```ts
const meta: Meta<typeof ConfirmDialog> = {
  title: 'Composed Components/ConfirmDialog',
  component: ConfirmDialog,
  argTypes: {
    open: { /* state */ },
    title: { /* content */ },
    confirmColor: { /* appearance */ },
    onConfirm: { action: 'onConfirm', control: false, table: { category: 'Events' } },
  },
  parameters: {
    layout: 'fullscreen',
    design: { type: 'figma', url: '...' },
  },
  tags: ['autodocs'],
};
```

### URL-based presets

Use decorator with `NuqsAdapter` + `useQueryState`. Keep `Default.args` hook-free.

## 4. MDX Docs

### Structure

```mdx
import { Meta, Controls, Primary } from '@storybook/addon-docs/blocks';
import * as ComponentStories from './component.stories';
import * as SubStories from './component-sub.stories';
import * as PresetStories from './preset.stories';

<Meta of={ComponentStories} />

# ComponentName

Short description, then real usage snippet.

<Primary />

## PresetName (Most Common)
[Usage snippet]
<Controls of={PresetStories.Default} />

## Primitive Composition
[Advanced usage snippet]

## SubcomponentName Props
<Controls of={SubStories.Default} />
```

### Ordering

1. High-level presets (what most users use)
2. Advanced presets (URL-based)
3. Primitive composition example
4. Primitive props per subcomponent

Each `<Controls>` must point at correct story module. Wrong reference = wrong props table.

## 5. Visual QA Checklist

Before PR:

- [ ] Compare against Figma frame side-by-side (not from memory)
- [ ] Check **light AND dark** themes
- [ ] Match sibling component sizing (`sm` = same height as Button/Input `sm`)
- [ ] Typography via `Typography` component or type-scale tokens
- [ ] Icons from `@signozhq/icons`, sized with tokens
- [ ] All states built: default, hover, focus-visible, active, disabled, loading, invalid, selected, empty, truncated
- [ ] Not duplicate of existing primitive/preset

Add `run-visual-testing` label to PR for Chromatic snapshots.

## 6. Verification Checklist

- [ ] Each primitive + subcomponent has story file + `Default` story
- [ ] Each preset has story file + `Default` story
- [ ] Figma frame linked in `parameters.design`
- [ ] MDX imports all `*Stories` modules
- [ ] Every `Controls` uses correct story (`<Controls of={XStories.Default} />`)
- [ ] argTypes descriptions match JSDoc on props
- [ ] `defaultValue.summary` matches implementation
- [ ] No duplicate/missing props in Controls tables
- [ ] Stories compile, type check
- [ ] Controls affect component in canvas
- [ ] MDX renders without errors
- [ ] Checked in light + dark themes
