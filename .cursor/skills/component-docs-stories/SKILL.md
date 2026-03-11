---
name: component-docs-stories
description: Create and update Storybook stories and MDX docs for UI components that have subcomponents and presets. Use when adding new components, subcomponents, or presets to the design system, or when wiring MDX Controls so each piece has its own props table.
---

# Component Docs & Stories (Subcomponents + Presets)

## When to Use This Skill

Use this skill whenever you:

- Add a new component that has **subcomponents** (e.g. `Dialog`, `RadioGroup`, `Command`, etc.)
- Add **presets/wrappers** built from primitives (e.g. `DialogWrapper`, `ConfirmDialog`, `AlertDialog`)
- Need MDX docs with **Controls** wired so each component/preset/subcomponent shows **its own** props

Target projects: design-system / UI libraries using Storybook + MDX (like this repo).

---

## High-Level Workflow

1. **Pick a reference component**
2. **Create per-component stories**
3. **Create per-preset stories (if any)**
4. **Wire MDX docs to those stories**
5. **Verify controls and behavior in Storybook**

Follow the detailed steps below.

---

## 1. Pick a Reference Component

When working on a new component with subcomponents, first find a well-done example. In this repo:

- **Good reference for “root + subcomponents”**:
  - `radio-group.stories.tsx`
  - `radio-group-item.stories.tsx`
  - `radio-group-label.stories.tsx`
  - `radio-group.mdx`

- **Good reference for “dialog primitives + presets + external preset”**:
  - `dialog-primitive.stories.tsx`
  - `dialog-*.stories.tsx` (trigger, content, header, title, description, footer, close, overlay, portal)
  - `dialog-wrapper.stories.tsx`
  - `confirm-dialog.stories.tsx`
  - `confirm-dialog-url.stories.tsx`
  - `alert-dialog.stories.tsx`
  - `dialog.mdx`

When in doubt, mirror the **dialog** structure.

---

## 2. Create Per-Component Stories (Primitives & Subcomponents)

For a primitive component `X` and each subcomponent `X.Sub`:

### 2.1. Story file naming

- Root component:
  - `component-name-primitive.stories.tsx` (e.g. `dialog-primitive.stories.tsx`)
- Subcomponents:
  - `component-name-subname.stories.tsx`
    - e.g. `dialog-content.stories.tsx`, `dialog-title.stories.tsx`

### 2.2. Story meta pattern

In each story file:

- **Import** the component from `@signozhq/ui` (or project’s UI export).
- Define `Meta` bound directly to that symbol:

```ts
const meta: Meta<typeof DialogContent> = {
  title: 'Components/Dialog/DialogContent',
  component: DialogContent,
  argTypes: {
    // define only meaningful public props
  },
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DialogContent>;
```

Conventions:

- **Title**: `Components/<Component>/<Subcomponent>` where appropriate.
- **Layout**: usually `fullscreen` for modals / overlays / layout-heavy components.
- **Tags**: include `'autodocs'` to enable automatic docs.

### 2.3. ArgTypes guidelines

For each prop:

- Include:
  - `control`: `'text' | 'boolean' | 'select' | 'number' | false` (no control for callbacks / complex nodes)
  - `description`: short, clear
  - `table.category`: e.g. `'Content' | 'Appearance' | 'Behavior' | 'State' | 'Accessibility' | 'Events' | 'Testing' | 'Styling'`
  - `table.type.summary`: type summary string (not full TS)
  - `table.defaultValue.summary`: only when there is a real default

Patterns:

- **State props**: `open`, `value`, `defaultValue`, `required`, `disabled`.
- **Appearance/Layout**: `width`, `position`, `orientation`, `color`, `className`, `style`.
- **Content**: `children`, `title`, `trigger`, `footer`, `icon`.
- **Events**: `onOpenChange`, `onChange`, `onConfirm`, `onCancel`, etc. → `control: false`.
- **Testing**: `testId`.

### 2.4. Default story render

- Use a `Default` story for Controls.
- Render the component in **realistic composition** (especially for modals/overlays):

```ts
export const Default: Story = {
  args: {
    // set sensible defaults (match real-world usage)
  },
  render: (args) => (
    <Dialog defaultOpen>
      <DialogTrigger asChild>
        <Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
          Open dialog
        </Button>
      </DialogTrigger>
      <DialogContent {...args}>
        {/* header / title / description / footer as appropriate */}
      </DialogContent>
    </Dialog>
  ),
};
```

- For root components with `open` control:
  - Either:
    - use an internal `useState` that respects `args.open` if set; or
    - treat `open` as fully controlled and wire to an internal trigger.
- For subcomponents, always render them **inside** a realistic parent (e.g. `DialogContent` inside a `Dialog`, `RadioGroupItem` inside a `RadioGroup`).

---

## 3. Create Per-Preset Stories

For presets/wrappers (e.g. `DialogWrapper`, `ConfirmDialog`, `ConfirmDialogUrl`, external `AlertDialog`):

### 3.1. File naming

- `dialog-wrapper.stories.tsx`
- `confirm-dialog.stories.tsx`
- `confirm-dialog-url.stories.tsx`
- `alert-dialog.stories.tsx`

### 3.2. Meta/argTypes pattern

- Bind `Meta` to the preset itself and expose **preset-specific** props:

```ts
const meta: Meta<typeof ConfirmDialog> = {
  title: 'Components/Dialog/ConfirmDialog',
  component: ConfirmDialog,
  argTypes: {
    open: { /* state */ },
    title: { /* content */ },
    confirmText: { /* content */ },
    confirmColor: { /* appearance */ },
    disableOutsideClick: { /* behavior */ },
    width: { /* appearance */ },
    // callbacks: control: false
  },
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
};
```

- For wrappers that extend other props (like `AlertDialog` extending `DialogWrapperProps`):
  - Include wrapper-specific props (e.g. `checkboxLabel`, `checkboxChecked`, `checkboxColor`, `onCheckboxChange`) and any **important** inherited ones (`title`, `width`, `trigger`, `footer`, etc.)

### 3.3. Default story render

- Provide a realistic trigger + footer:

```ts
export const Default: Story = {
  args: {
    title: 'Delete this step',
    checkboxLabel: 'Do not ask me this again',
    checkboxChecked: true,
    width: 'narrow',
    children: 'Deleting this step would stop further analytics...',
  },
  render: (args) => {
    const [open, setOpen] = React.useState(false);
    const [checked, setChecked] = React.useState(args.checkboxChecked ?? false);

    return (
      <AlertDialog
        {...args}
        open={open}
        onOpenChange={setOpen}
        checkboxChecked={checked}
        onCheckboxChange={setChecked}
        trigger={/* button */}
        footer={/* buttons */}
      />
    );
  },
};
```

- For **URL-based** presets (like `ConfirmDialogUrl`):
  - Use a `decorator` with `NuqsAdapter` and `useQueryState` so Controls still work:
    - Keep `Default.args` simple (no hooks).
    - Put `useQueryState` + trigger wiring in the decorator or in a wrapped component used by the decorator.

---

## 4. Wire MDX Docs to Stories

For each main component, create/extend an `*.mdx` in `apps/docs/stories`:

1. **Imports**:

```mdx
import { Meta, Controls, Primary } from '@storybook/addon-docs/blocks';
import * as ComponentStories from './component.stories';
import * as SubcomponentStories from './component-sub.stories';
import * as PresetStories from './component-preset.stories';
```

2. **Meta**:

```mdx
<Meta of={ComponentStories} />
```

3. **Usage sections**:

- Provide short “How to use” sections with code snippets based on **real** usage (from stories or components’ JSDoc).
- Reuse patterns from `radio-group.mdx` and `dialog.mdx`.

4. **Controls sections**

- For the main/root component:

```mdx
## Component Props

<Controls of={ComponentStories.Default} />
```

- For each **subcomponent**:

```mdx
## SubcomponentName Props

<Controls of={SubcomponentStories.Default} />
```

- For each **preset**:

```mdx
## WrapperName Props

<Controls of={WrapperStories.Default} />
```

- Make sure each `Controls` references the correct story module and story export, **not** a generic story from another file.

5. **Ordering**

Recommended order in MDX:

1. High-level presets/wrappers (what most users use)
2. Advanced presets (URL-based, etc.)
3. Primitive composition example
4. Primitive props sections (per subcomponent)

This mirrors how `dialog.mdx` is structured.

---

## 5. Verification Checklist

Before considering docs/stories done:

- **Stories compile**:
  - Type checks pass.
  - No unused imports / lints.
- **Stories behave correctly**:
  - Controls actually affect the component in the canvas.
  - Modal/dialogs open/close correctly; state interactions make sense.
- **MDX docs**:
  - Renders without errors.
  - Each **Controls** section shows the correct props (check names, descriptions, default values).
  - Examples match current API (no stale prop names).

Quick mental checklist:

- [ ] Each primitive + subcomponent has its own story file and `Default` story.
- [ ] Each preset has its own story file and `Default` story.
- [ ] MDX imports all relevant `*Stories` modules.
- [ ] Every `Controls` uses the **right** story (`<Controls of={XStories.Default} />`).
- [ ] No obvious duplicate or missing props in Controls tables.

---

## Examples in This Repo

When implementing for new components, **copy patterns** from:

- `radio-group*.stories.tsx` + `radio-group.mdx`
- `dialog*.stories.tsx` (all primitive + preset + alert) + `dialog.mdx`

Adapt titles, argTypes, and composition to the new component, but keep the overall structure the same.
