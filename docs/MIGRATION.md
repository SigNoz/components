I'll write out the comprehensive implementation plan. Given the size, I'll present it in sections:

---

# Remove Tailwind CSS in Favor of CSS Modules - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Migrate the @signozhq/ui package from Tailwind CSS to CSS Modules while preserving all existing functionality, theming, and dark mode support.

**Architecture:**
- Replace Tailwind utility classes with BEM-style CSS Module classes
- Keep existing CSS custom properties (design tokens) for theming
- Replace CVA variants with CSS Module selectors using data attributes
- Create shared utilities module for common patterns (flex, spacing, etc.)
- Replace `cn()` (clsx + tailwind-merge) with plain `clsx`

**Tech Stack:** CSS Modules, clsx, PostCSS, Vite

---

## Phase 0: Infrastructure Setup

### Task 0.1: Create Shared Utilities CSS Module

**Files:**
- Create: `packages/ui/src/styles/utilities.module.css`
- Create: `packages/ui/src/styles/index.ts`

**Step 1: Create the shared utilities module**

```css
/* packages/ui/src/styles/utilities.module.css */

/* ==================== Layout ==================== */
.flex {
  display: flex;
}

.inline-flex {
  display: inline-flex;
}

.flex--col {
  flex-direction: column;
}

.flex--row {
  flex-direction: row;
}

.flex--wrap {
  flex-wrap: wrap;
}

.flex--1 {
  flex: 1;
}

.flex--shrink-0 {
  flex-shrink: 0;
}

.items--center {
  align-items: center;
}

.items--start {
  align-items: flex-start;
}

.items--end {
  align-items: flex-end;
}

.justify--center {
  justify-content: center;
}

.justify--start {
  justify-content: flex-start;
}

.justify--end {
  justify-content: flex-end;
}

.justify--between {
  justify-content: space-between;
}

/* ==================== Spacing - Gap ==================== */
.gap--0 { gap: 0; }
.gap--0-5 { gap: 0.125rem; }
.gap--1 { gap: 0.25rem; }
.gap--1-5 { gap: 0.375rem; }
.gap--2 { gap: 0.5rem; }
.gap--3 { gap: 0.75rem; }
.gap--4 { gap: 1rem; }
.gap--5 { gap: 1.25rem; }
.gap--6 { gap: 1.5rem; }
.gap--8 { gap: 2rem; }

/* ==================== Spacing - Padding ==================== */
.p--0 { padding: 0; }
.p--1 { padding: 0.25rem; }
.p--2 { padding: 0.5rem; }
.p--3 { padding: 0.75rem; }
.p--4 { padding: 1rem; }
.p--5 { padding: 1.25rem; }
.p--6 { padding: 1.5rem; }

.px--0 { padding-left: 0; padding-right: 0; }
.px--1 { padding-left: 0.25rem; padding-right: 0.25rem; }
.px--2 { padding-left: 0.5rem; padding-right: 0.5rem; }
.px--3 { padding-left: 0.75rem; padding-right: 0.75rem; }
.px--4 { padding-left: 1rem; padding-right: 1rem; }
.px--5 { padding-left: 1.25rem; padding-right: 1.25rem; }
.px--6 { padding-left: 1.5rem; padding-right: 1.5rem; }
.px--8 { padding-left: 2rem; padding-right: 2rem; }

.py--0 { padding-top: 0; padding-bottom: 0; }
.py--0-5 { padding-top: 0.125rem; padding-bottom: 0.125rem; }
.py--1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
.py--2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
.py--3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
.py--3-5 { padding-top: 0.875rem; padding-bottom: 0.875rem; }
.py--4 { padding-top: 1rem; padding-bottom: 1rem; }

.pt--0 { padding-top: 0; }
.pt--1 { padding-top: 0.25rem; }
.pt--2 { padding-top: 0.5rem; }
.pt--3 { padding-top: 0.75rem; }
.pt--4 { padding-top: 1rem; }

.pb--0 { padding-bottom: 0; }
.pb--1 { padding-bottom: 0.25rem; }
.pb--2 { padding-bottom: 0.5rem; }
.pb--3 { padding-bottom: 0.75rem; }
.pb--4 { padding-bottom: 1rem; }

.pl--2 { padding-left: 0.5rem; }
.pl--4 { padding-left: 1rem; }
.pl--8 { padding-left: 2rem; }

.pr--2 { padding-right: 0.5rem; }
.pr--4 { padding-right: 1rem; }

/* ==================== Spacing - Margin ==================== */
.m--0 { margin: 0; }
.m--auto { margin: auto; }

.mx--auto { margin-left: auto; margin-right: auto; }
.mx--2 { margin-left: 0.5rem; margin-right: 0.5rem; }

.my--0 { margin-top: 0; margin-bottom: 0; }
.my--1 { margin-top: 0.25rem; margin-bottom: 0.25rem; }
.my--2 { margin-top: 0.5rem; margin-bottom: 0.5rem; }

.mt--0 { margin-top: 0; }
.mt--1 { margin-top: 0.25rem; }
.mt--2 { margin-top: 0.5rem; }
.mt--4 { margin-top: 1rem; }

.mb--0 { margin-bottom: 0; }
.mb--1 { margin-bottom: 0.25rem; }
.mb--1-5 { margin-bottom: 0.375rem; }
.mb--2 { margin-bottom: 0.5rem; }

.ml--0 { margin-left: 0; }
.ml--1 { margin-left: 0.25rem; }
.ml--2 { margin-left: 0.5rem; }
.ml--auto { margin-left: auto; }

.mr--0 { margin-right: 0; }
.mr--1 { margin-right: 0.25rem; }
.mr--2 { margin-right: 0.5rem; }

/* ==================== Sizing ==================== */
.w--full { width: 100%; }
.w--auto { width: auto; }
.w--fit { width: fit-content; }
.w--4 { width: 1rem; }
.w--6 { width: 1.5rem; }
.w--8 { width: 2rem; }
.w--9 { width: 2.25rem; }
.w--48 { width: 3rem; }

.h--full { height: 100%; }
.h--auto { height: auto; }
.h--4 { height: 1rem; }
.h--6 { height: 1.5rem; }
.h--9 { height: 2.25rem; }

.min-w--0 { min-width: 0; }
.min-h--0 { min-height: 0; }

.max-w--full { max-width: 100%; }

.size--3 { width: 0.75rem; height: 0.75rem; }
.size--3-5 { width: 0.875rem; height: 0.875rem; }
.size--4 { width: 1rem; height: 1rem; }
.size--5 { width: 1.25rem; height: 1.25rem; }
.size--6 { width: 1.5rem; height: 1.5rem; }

/* ==================== Typography ==================== */
.text--xs { font-size: 0.75rem; line-height: 1rem; }
.text--sm { font-size: 0.875rem; line-height: 1.25rem; }
.text--base { font-size: 1rem; line-height: 1.5rem; }
.text--lg { font-size: 1.125rem; line-height: 1.75rem; }

.font--normal { font-weight: 400; }
.font--medium { font-weight: 500; }
.font--semibold { font-weight: 600; }

.leading--none { line-height: 1; }
.leading--tight { line-height: 1.25; }
.leading--normal { line-height: 1.5; }
.leading--5 { line-height: 1.25rem; }
.leading--6 { line-height: 1.5rem; }

.tracking--normal { letter-spacing: 0; }
.tracking--tight { letter-spacing: -0.025em; }
.tracking--wider { letter-spacing: 0.05em; }

.text--left { text-align: left; }
.text--center { text-align: center; }
.text--right { text-align: right; }

.whitespace--nowrap { white-space: nowrap; }
.whitespace--normal { white-space: normal; }

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.uppercase { text-transform: uppercase; }
.capitalize { text-transform: capitalize; }

.select--none { user-select: none; }

/* ==================== Colors (semantic) ==================== */
.text--foreground { color: var(--foreground); }
.text--muted { color: var(--muted-foreground); }
.text--primary { color: var(--primary); }
.text--destructive { color: var(--destructive); }
.text--white { color: white; }
.text--current { color: currentColor; }

.bg--background { background-color: var(--background); }
.bg--muted { background-color: var(--muted); }
.bg--transparent { background-color: transparent; }

/* ==================== Borders ==================== */
.border { border-width: 1px; border-style: solid; }
.border--0 { border-width: 0; }
.border--solid { border-style: solid; }
.border--dashed { border-style: dashed; }
.border--none { border-style: none; }

.border-t { border-top-width: 1px; }
.border-b { border-bottom-width: 1px; }
.border-l { border-left-width: 1px; }
.border-r { border-right-width: 1px; }

.border--transparent { border-color: transparent; }

.rounded--none { border-radius: 0; }
.rounded--xs { border-radius: 0.125rem; }
.rounded--sm { border-radius: calc(var(--radius) - 4px); }
.rounded--md { border-radius: calc(var(--radius) - 2px); }
.rounded--lg { border-radius: var(--radius); }
.rounded--xl { border-radius: calc(var(--radius) + 4px); }
.rounded--full { border-radius: 9999px; }

/* ==================== Positioning ==================== */
.relative { position: relative; }
.absolute { position: absolute; }
.fixed { position: fixed; }
.sticky { position: sticky; }

.inset--0 { inset: 0; }
.top--0 { top: 0; }
.right--0 { right: 0; }
.bottom--0 { bottom: 0; }
.left--0 { left: 0; }

.z--0 { z-index: 0; }
.z--10 { z-index: 10; }
.z--20 { z-index: 20; }
.z--50 { z-index: 50; }

/* ==================== Display & Visibility ==================== */
.hidden { display: none; }
.block { display: block; }
.inline { display: inline; }
.inline-block { display: inline-block; }
.grid { display: grid; }

.invisible { visibility: hidden; }
.visible { visibility: visible; }

.opacity--0 { opacity: 0; }
.opacity--50 { opacity: 0.5; }
.opacity--60 { opacity: 0.6; }
.opacity--70 { opacity: 0.7; }
.opacity--100 { opacity: 1; }

.overflow--hidden { overflow: hidden; }
.overflow--auto { overflow: auto; }
.overflow--scroll { overflow: scroll; }

/* ==================== Interactivity ==================== */
.cursor--default { cursor: default; }
.cursor--pointer { cursor: pointer; }
.cursor--wait { cursor: wait; }
.cursor--not-allowed { cursor: not-allowed; }
.cursor--grab { cursor: grab; }
.cursor--col-resize { cursor: col-resize; }

.pointer-events--none { pointer-events: none; }
.pointer-events--auto { pointer-events: auto; }

.touch--none { touch-action: none; }

/* ==================== Transitions & Animations ==================== */
.transition--colors {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.transition--all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.transition--transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

.transition--opacity {
  transition-property: opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

.duration--200 { transition-duration: 200ms; }

.animate--spin {
  animation: spin 1s linear infinite;
}

.animate--fast-spin {
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ==================== Focus & Ring ==================== */
.outline--none { outline: none; }

.focus-visible--ring:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}

.focus-visible--ring-1:focus-visible {
  box-shadow: 0 0 0 1px var(--ring);
}

/* ==================== Shadows ==================== */
.shadow--xs { box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); }
.shadow--sm { box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1); }
.shadow { box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1); }

/* ==================== Screen Reader ==================== */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* ==================== Transform ==================== */
.rotate--90 { transform: rotate(90deg); }
.rotate--180 { transform: rotate(180deg); }
.-translate-y--half { transform: translateY(-50%); }
.-translate-x--half { transform: translateX(-50%); }

/* ==================== Shrink ==================== */
.shrink--0 { flex-shrink: 0; }
```

**Step 2: Create the utilities index export**

```typescript
// packages/ui/src/styles/index.ts
import styles from './utilities.module.css';

export { styles as utilities };
export default styles;
```

**Step 3: Verify the CSS module is valid**

Run: `pnpm build`
Expected: Build completes without CSS parsing errors

**Step 4: Commit**

```bash
git add packages/ui/src/styles/
git commit -m "feat(ui): add shared CSS utilities module for Tailwind migration"
```

---

### Task 0.2: Update the cn() Utility to Use clsx Only

**Files:**
- Modify: `packages/ui/src/lib/utils.ts`

**Step 1: Write a test for the cn utility**

```typescript
// packages/ui/src/lib/utils.test.ts
import { describe, expect, it } from 'vitest';
import { cn } from './utils';

describe('cn utility', () => {
  it('should merge class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('should handle conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
  });

  it('should handle undefined and null', () => {
    expect(cn('foo', undefined, null, 'bar')).toBe('foo bar');
  });

  it('should handle arrays', () => {
    expect(cn(['foo', 'bar'])).toBe('foo bar');
  });

  it('should handle objects', () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz');
  });

  it('should handle empty input', () => {
    expect(cn()).toBe('');
  });
});
```

**Step 2: Run test to verify it fails (no test file exists)**

Run: `pnpm test:run -- src/lib/utils.test.ts`
Expected: Test file not found or tests pass if cn already works this way

**Step 3: Update the cn utility**

```typescript
// packages/ui/src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
```

**Step 4: Run tests to verify they pass**

Run: `pnpm test:run -- src/lib/utils.test.ts`
Expected: All tests pass

**Step 5: Commit**

```bash
git add packages/ui/src/lib/
git commit -m "refactor(ui): simplify cn() to use clsx only, removing tailwind-merge"
```

---

### Task 0.3: Create CSS Module Type Definitions

**Files:**
- Create: `packages/ui/src/types/css-modules.d.ts`

**Step 1: Create the type definition file**

```typescript
// packages/ui/src/types/css-modules.d.ts
declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
```

**Step 2: Verify TypeScript recognizes the types**

Run: `pnpm build`
Expected: No TypeScript errors related to CSS module imports

**Step 3: Commit**

```bash
git add packages/ui/src/types/
git commit -m "feat(ui): add CSS module type definitions"
```

---

## Phase 1: Simple Components (No CVA)

### Task 1.1: Migrate Tooltip Component

**Files:**
- Create: `packages/ui/src/tooltip/tooltip.module.css`
- Modify: `packages/ui/src/tooltip/tooltip.tsx`

**Step 1: Read the current tooltip component**

Current file: `packages/ui/src/tooltip/tooltip.tsx`

**Step 2: Create the CSS module**

```css
/* packages/ui/src/tooltip/tooltip.module.css */

.tooltip__trigger {
  cursor: pointer;
}

.tooltip__content {
  z-index: 50;
  overflow: hidden;
  border-radius: calc(var(--radius) - 2px);
  background-color: var(--bg-ink-400);
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  line-height: 1rem;
  color: var(--bg-vanilla-100);
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  animation: fade-in 150ms ease-out;
}

.tooltip__content--side-top {
  animation: slide-down-fade 150ms ease-out;
}

.tooltip__content--side-bottom {
  animation: slide-up-fade 150ms ease-out;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-down-fade {
  from {
    opacity: 0;
    transform: translateY(-2px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-up-fade {
  from {
    opacity: 0;
    transform: translateY(2px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Dark mode handled via CSS variables - no change needed */
```

**Step 3: Update the component**

```tsx
// packages/ui/src/tooltip/tooltip.tsx
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as React from 'react';
import { cn } from '../lib/utils.js';
import styles from './tooltip.module.css';

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return <TooltipPrimitive.Provider delayDuration={delayDuration} {...props} />;
}

function Tooltip({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root {...props} />
    </TooltipProvider>
  );
}

function TooltipTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return (
    <TooltipPrimitive.Trigger
      data-slot="tooltip-trigger"
      className={cn(styles['tooltip__trigger'], className)}
      {...props}
    />
  );
}

function TooltipContent({
  className,
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(styles['tooltip__content'], className)}
        {...props}
      />
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
```

**Step 4: Run tests**

Run: `pnpm test:run`
Expected: All existing tests pass

**Step 5: Build and verify**

Run: `pnpm build`
Expected: Build succeeds, CSS module is bundled

**Step 6: Commit**

```bash
git add packages/ui/src/tooltip/
git commit -m "refactor(tooltip): migrate from Tailwind to CSS modules"
```

---

### Task 1.2: Migrate Switch Component

**Files:**
- Rename: `packages/ui/src/switch/index.css` → keep for CSS variables
- Create: `packages/ui/src/switch/switch.module.css`
- Modify: `packages/ui/src/switch/switch.tsx`

**Step 1: Create the CSS module**

```css
/* packages/ui/src/switch/switch.module.css */

.switch {
  display: inline-flex;
  height: 1.25rem;
  width: 2.25rem;
  flex-shrink: 0;
  cursor: pointer;
  align-items: center;
  border-radius: 9999px;
  border: 2px solid transparent;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  transition: background-color 150ms ease-in-out;
  background-color: var(--bg-slate-400);
}

.switch:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--background), 0 0 0 4px var(--ring);
}

.switch:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.switch[data-state="checked"] {
  background-color: var(--switch-checked-background);
}

.switch__thumb {
  display: block;
  height: 1rem;
  width: 1rem;
  pointer-events: none;
  border-radius: 9999px;
  background-color: var(--bg-vanilla-100);
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  transition: transform 150ms ease-in-out;
}

.switch[data-state="checked"] .switch__thumb {
  transform: translateX(1rem);
}

.switch[data-state="unchecked"] .switch__thumb {
  transform: translateX(0);
}
```

**Step 2: Update the component**

```tsx
// packages/ui/src/switch/switch.tsx
import './index.css'; // Keep for CSS variable definitions

import * as SwitchPrimitive from '@radix-ui/react-switch';
import * as React from 'react';
import { cn } from '../lib/utils.js';
import styles from './switch.module.css';

type SwitchColor = 'robin' | 'forest' | 'amber' | 'sienna' | 'cherry' | 'sakura' | 'aqua';

interface SwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
  color?: SwitchColor;
}

const Switch = React.forwardRef<React.ElementRef<typeof SwitchPrimitive.Root>, SwitchProps>(
  ({ className, color = 'robin', ...props }, ref) => (
    <SwitchPrimitive.Root
      ref={ref}
      data-color={color}
      className={cn(styles['switch'], className)}
      {...props}
    >
      <SwitchPrimitive.Thumb className={styles['switch__thumb']} />
    </SwitchPrimitive.Root>
  )
);
Switch.displayName = SwitchPrimitive.Root.displayName;

export { Switch };
```

**Step 3: Run tests**

Run: `pnpm test:run`
Expected: All tests pass

**Step 4: Build and verify**

Run: `pnpm build`
Expected: Build succeeds

**Step 5: Commit**

```bash
git add packages/ui/src/switch/
git commit -m "refactor(switch): migrate from Tailwind to CSS modules"
```

---

### Task 1.3: Migrate Checkbox Component

**Files:**
- Keep: `packages/ui/src/checkbox/index.css` (CSS variables)
- Create: `packages/ui/src/checkbox/checkbox.module.css`
- Modify: `packages/ui/src/checkbox/checkbox.tsx`

**Step 1: Create the CSS module**

```css
/* packages/ui/src/checkbox/checkbox.module.css */

.checkbox {
  height: 1rem;
  width: 1rem;
  flex-shrink: 0;
  border-radius: calc(var(--radius) - 2px);
  border: 1px solid var(--border);
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  cursor: pointer;
  background-color: transparent;
}

.checkbox:focus-visible {
  outline: none;
  box-shadow: 0 0 0 1px var(--checkbox-checked-background);
}

.checkbox:hover {
  box-shadow: 0 0 0 1px var(--checkbox-checked-background);
  border-color: var(--checkbox-checked-background);
}

.checkbox:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.checkbox:disabled:hover {
  box-shadow: none;
  border-color: var(--border);
}

.checkbox[data-state="checked"] {
  background-color: var(--checkbox-checked-background);
  color: white;
  border-color: transparent;
}

.checkbox__indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  color: currentColor;
}

.checkbox__icon {
  height: 0.875rem;
  width: 0.875rem;
  color: white;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-wrapper__label {
  cursor: pointer;
  user-select: none;
}

.checkbox:disabled ~ .checkbox-wrapper__label {
  cursor: not-allowed;
  opacity: 0.7;
}
```

**Step 2: Update the component**

```tsx
// packages/ui/src/checkbox/checkbox.tsx
import './index.css';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';
import * as React from 'react';
import { cn } from '../lib/utils.js';
import styles from './checkbox.module.css';

type CheckboxColor = 'robin' | 'forest' | 'amber' | 'sienna' | 'cherry' | 'sakura' | 'aqua';

interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  color?: CheckboxColor;
}

const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  ({ className, color = 'robin', ...props }, ref) => (
    <CheckboxPrimitive.Root
      ref={ref}
      data-color={color}
      className={cn(styles['checkbox'], className)}
      {...props}
    >
      <CheckboxPrimitive.Indicator className={styles['checkbox__indicator']}>
        <CheckIcon className={styles['checkbox__icon']} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
);
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

const CheckboxWrapper: React.FC<{ labelName?: string | React.ReactNode } & CheckboxProps> = ({
  labelName,
  ...props
}) => {
  return (
    <div className={styles['checkbox-wrapper']}>
      <Checkbox {...props} />
      {labelName && (
        <label
          htmlFor={props.id}
          className={styles['checkbox-wrapper__label']}
        >
          {labelName}
        </label>
      )}
    </div>
  );
};

export { CheckboxWrapper as Checkbox };
```

**Step 3: Run tests and build**

Run: `pnpm test:run && pnpm build`
Expected: All pass

**Step 4: Commit**

```bash
git add packages/ui/src/checkbox/
git commit -m "refactor(checkbox): migrate from Tailwind to CSS modules"
```

---

### Task 1.4: Migrate Radio Group Component

**Files:**
- Keep: `packages/ui/src/radio-group/index.css`
- Create: `packages/ui/src/radio-group/radio-group.module.css`
- Modify: `packages/ui/src/radio-group/radio-group.tsx`

**Step 1: Create the CSS module**

```css
/* packages/ui/src/radio-group/radio-group.module.css */

.radio-group {
  display: grid;
  gap: 0.5rem;
}

.radio-group__item {
  display: flex;
  height: 1rem;
  width: 1rem;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  border: 1px solid var(--border);
  cursor: pointer;
  background-color: transparent;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

.radio-group__item:focus-visible {
  outline: none;
  box-shadow: 0 0 0 1px var(--radio-checked-background);
}

.radio-group__item:hover {
  border-color: var(--radio-checked-background);
}

.radio-group__item:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.radio-group__item[data-state="checked"] {
  border-color: var(--radio-checked-background);
}

.radio-group__indicator {
  display: flex;
  align-items: center;
  justify-content: center;
}

.radio-group__indicator-dot {
  height: 0.5rem;
  width: 0.5rem;
  border-radius: 9999px;
  background-color: var(--radio-checked-background);
}
```

**Step 2: Update the component**

```tsx
// packages/ui/src/radio-group/radio-group.tsx
import './index.css';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import * as React from 'react';
import { cn } from '../lib/utils.js';
import styles from './radio-group.module.css';

type RadioColor = 'robin' | 'forest' | 'amber' | 'sienna' | 'cherry' | 'sakura' | 'aqua';

interface RadioGroupProps extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {
  color?: RadioColor;
}

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(({ className, color = 'robin', ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      ref={ref}
      data-color={color}
      className={cn(styles['radio-group'], className)}
      {...props}
    />
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(styles['radio-group__item'], className)}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className={styles['radio-group__indicator']}>
        <span className={styles['radio-group__indicator-dot']} />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
```

**Step 3: Run tests and build**

Run: `pnpm test:run && pnpm build`
Expected: All pass

**Step 4: Commit**

```bash
git add packages/ui/src/radio-group/
git commit -m "refactor(radio-group): migrate from Tailwind to CSS modules"
```

---

### Task 1.5: Migrate Popover Component

**Files:**
- Keep: `packages/ui/src/popover/index.css`
- Create: `packages/ui/src/popover/popover.module.css`
- Modify: `packages/ui/src/popover/popover.tsx`

**Step 1: Create the CSS module**

```css
/* packages/ui/src/popover/popover.module.css */

.popover__trigger {
  cursor: pointer;
}

.popover__content {
  z-index: 50;
  width: 18rem;
  border-radius: calc(var(--radius) - 2px);
  border: 1px solid var(--popover-border);
  background-color: var(--popover-background);
  padding: 1rem;
  color: var(--popover-text);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  outline: none;
}

/* Animations */
.popover__content[data-state="open"] {
  animation: popover-in 150ms ease-out;
}

.popover__content[data-state="closed"] {
  animation: popover-out 150ms ease-in;
}

@keyframes popover-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes popover-out {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.95);
  }
}
```

**Step 2: Update the component**

```tsx
// packages/ui/src/popover/popover.tsx
import './index.css';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import * as React from 'react';
import { cn } from '../lib/utils.js';
import styles from './popover.module.css';

function Popover({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

function PopoverTrigger({
  className,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return (
    <PopoverPrimitive.Trigger
      data-slot="popover-trigger"
      className={cn(styles['popover__trigger'], className)}
      {...props}
    />
  );
}

function PopoverContent({
  className,
  align = 'center',
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(styles['popover__content'], className)}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

function PopoverAnchor({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />;
}

export { Popover, PopoverAnchor, PopoverContent, PopoverTrigger };
```

**Step 3: Run tests and build**

Run: `pnpm test:run && pnpm build`
Expected: All pass

**Step 4: Commit**

```bash
git add packages/ui/src/popover/
git commit -m "refactor(popover): migrate from Tailwind to CSS modules"
```

---

### Task 1.6: Migrate Drawer Component

**Files:**
- Keep: `packages/ui/src/drawer/index.css`
- Create: `packages/ui/src/drawer/drawer.module.css`
- Modify: `packages/ui/src/drawer/drawer.tsx`

**Step 1: Create the CSS module**

```css
/* packages/ui/src/drawer/drawer.module.css */

.drawer__overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  background-color: rgba(0, 0, 0, 0.8);
}

.drawer__content {
  position: fixed;
  inset-inline: 0;
  bottom: 0;
  z-index: 50;
  margin-top: 1.5rem;
  display: flex;
  height: auto;
  flex-direction: column;
  border-radius: 0.625rem 0.625rem 0 0;
  border: 1px solid var(--drawer-border);
  background-color: var(--background);
}

.drawer__handle {
  margin: 0 auto;
  margin-top: 1rem;
  height: 0.375rem;
  width: 6.25rem;
  border-radius: 9999px;
  background-color: var(--muted);
}

.drawer__header {
  display: grid;
  gap: 0.375rem;
  padding: 1rem;
  text-align: center;
}

@media (min-width: 640px) {
  .drawer__header {
    text-align: left;
  }
}

.drawer__footer {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: auto;
  padding: 1rem;
}

.drawer__title {
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1;
  letter-spacing: -0.025em;
}

.drawer__description {
  font-size: 0.875rem;
  color: var(--muted-foreground);
}
```

**Step 2: Update the component** (Read current file first, then update)

**Step 3: Run tests and build**

Run: `pnpm test:run && pnpm build`

**Step 4: Commit**

```bash
git add packages/ui/src/drawer/
git commit -m "refactor(drawer): migrate from Tailwind to CSS modules"
```

---

### Task 1.7: Migrate Resizable Component

**Files:**
- Keep: `packages/ui/src/resizable/index.css`
- Create: `packages/ui/src/resizable/resizable.module.css`
- Modify: `packages/ui/src/resizable/resizable.tsx`

**Step 1: Create the CSS module**

```css
/* packages/ui/src/resizable/resizable.module.css */

.resizable-group {
  display: flex;
  height: 100%;
  width: 100%;
}

.resizable-group[data-panel-group-direction="vertical"] {
  flex-direction: column;
}

.resizable-panel {
  /* Panel styles managed by react-resizable-panels */
}

.resizable-handle {
  position: relative;
  display: flex;
  width: 0.25rem;
  align-items: center;
  justify-content: center;
  background-color: var(--border);
  transition: background-color 150ms ease;
}

.resizable-handle::after {
  content: '';
  position: absolute;
  inset: 0;
  transform: translateX(-50%);
  width: 0.25rem;
}

.resizable-handle:focus-visible {
  outline: none;
  box-shadow: 0 0 0 1px var(--ring);
}

.resizable-handle[data-panel-group-direction="vertical"] {
  height: 0.25rem;
  width: 100%;
}

.resizable-handle[data-panel-group-direction="vertical"]::after {
  transform: translateY(-50%);
  height: 0.25rem;
  width: 100%;
  left: 0;
}

.resizable-handle__icon-wrapper {
  z-index: 10;
  display: flex;
  height: 1rem;
  width: 0.75rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.125rem;
  border: 1px solid var(--border);
  background-color: var(--border);
}

.resizable-handle__icon {
  height: 0.625rem;
  width: 0.625rem;
}
```

**Step 2: Update the component**

**Step 3: Run tests and build**

Run: `pnpm test:run && pnpm build`

**Step 4: Commit**

```bash
git add packages/ui/src/resizable/
git commit -m "refactor(resizable): migrate from Tailwind to CSS modules"
```

---

### Task 1.8: Migrate Sonner (Toast) Component

**Files:**
- Keep: `packages/ui/src/sonner/index.css`
- Create: `packages/ui/src/sonner/sonner.module.css`
- Modify: `packages/ui/src/sonner/sonner.tsx`

(Continue with similar pattern)

**Commit:**
```bash
git commit -m "refactor(sonner): migrate from Tailwind to CSS modules"
```

---

## Phase 2: Medium Complexity Components

### Task 2.1: Migrate Combobox Component

**Files:**
- Keep: `packages/ui/src/combobox/index.css`
- Create: `packages/ui/src/combobox/combobox.module.css`
- Modify: `packages/ui/src/combobox/combobox.tsx`

(Pattern continues with 14 className usages to convert)

**Commit:**
```bash
git commit -m "refactor(combobox): migrate from Tailwind to CSS modules"
```

---

### Task 2.2: Migrate Calendar Component

### Task 2.3: Migrate Pagination Component

### Task 2.4: Migrate Dialog Component

### Task 2.5: Migrate Command Component

### Task 2.6: Migrate Dropdown Menu Component

### Task 2.7: Migrate Date Picker Component

### Task 2.8: Migrate Pin List Component

(Each follows the same pattern - create CSS module, update component, test, commit)

---

## Phase 3: Components with CVA Variants

### Task 3.1: Migrate Callout Component (CVA)

**Files:**
- Keep: `packages/ui/src/callout/index.css`
- Create: `packages/ui/src/callout/callout.module.css`
- Modify: `packages/ui/src/callout/callout.tsx`
- Delete: CVA usage (replace with CSS data attributes)

**Step 1: Create the CSS module with variant support**

```css
/* packages/ui/src/callout/callout.module.css */

.callout {
  position: relative;
  display: flex;
  width: 100%;
  gap: 0.75rem;
  border-radius: calc(var(--radius) - 2px);
  border: 1px solid var(--callout-border-color);
  background-color: var(--callout-background);
}

/* Size variants via data attribute */
.callout[data-size="small"] {
  padding: 0.5rem 0.75rem;
}

.callout[data-size="medium"] {
  padding: 0.75rem 1rem;
}

.callout__icon {
  flex-shrink: 0;
  color: var(--callout-icon-color);
}

.callout__icon svg {
  width: 1rem;
  height: 1rem;
}

.callout__content {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  flex: 1;
  min-width: 0;
}

.callout__title {
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1.25rem;
  letter-spacing: -0.01em;
  color: var(--callout-title-color);
}

.callout__description {
  font-size: 0.8125rem;
  font-weight: 400;
  line-height: 1.25rem;
  color: var(--callout-description-color);
}
```

**Step 2: Update component to use data attributes instead of CVA**

```tsx
// packages/ui/src/callout/callout.tsx
import './index.css';
import * as React from 'react';
import { cn } from '../lib/utils.js';
import styles from './callout.module.css';

type CalloutType = 'info' | 'success' | 'warning' | 'error';
type CalloutSize = 'small' | 'medium';

interface CalloutProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: CalloutType;
  size?: CalloutSize;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
}

const Callout = React.forwardRef<HTMLDivElement, CalloutProps>(
  (
    {
      className,
      type = 'info',
      size = 'medium',
      icon,
      title,
      description,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        data-type={type}
        data-size={size}
        className={cn(styles['callout'], className)}
        {...props}
      >
        {icon && <div className={styles['callout__icon']}>{icon}</div>}
        <div className={styles['callout__content']}>
          {title && <div className={styles['callout__title']}>{title}</div>}
          {description && (
            <div className={styles['callout__description']}>{description}</div>
          )}
          {children}
        </div>
      </div>
    );
  }
);
Callout.displayName = 'Callout';

export { Callout };
export type { CalloutProps, CalloutType, CalloutSize };
```

**Step 3: Run tests and build**

Run: `pnpm test:run && pnpm build`

**Step 4: Commit**

```bash
git add packages/ui/src/callout/
git commit -m "refactor(callout): migrate from Tailwind/CVA to CSS modules with data attributes"
```

---

### Task 3.2: Migrate Input Component (CVA)

### Task 3.3: Migrate Toggle Group Component (CVA)

### Task 3.4: Migrate Badge Component (CVA)

### Task 3.5: Migrate Tabs Component (CVA)

### Task 3.6: Migrate Button Component (CVA)

(Each follows the pattern of replacing CVA with data attribute selectors in CSS modules)

---

## Phase 4: Complex Components

### Task 4.1: Migrate Table Component (75 classNames)

**Files:**
- Keep: `packages/ui/src/table/index.css`
- Create: `packages/ui/src/table/table.module.css`
- Create: `packages/ui/src/table/data-table.module.css`
- Modify: `packages/ui/src/table/table.tsx`
- Modify: `packages/ui/src/table/data-table.tsx`

This is the most complex component with 75+ className usages. Break into sub-tasks:

**Sub-task 4.1.1: Create table.module.css**
**Sub-task 4.1.2: Migrate table.tsx**
**Sub-task 4.1.3: Create data-table.module.css**
**Sub-task 4.1.4: Migrate data-table.tsx (first half)**
**Sub-task 4.1.5: Migrate data-table.tsx (second half)**

```css
/* packages/ui/src/table/table.module.css */

.table-wrapper {
  position: relative;
  width: 100%;
  overflow: auto;
}

.table {
  width: 100%;
  caption-side: bottom;
  font-size: 0.875rem;
}

.table__header {
  border-bottom: 1px solid var(--border);
}

.table__header--sticky {
  position: sticky;
  top: 0;
  z-index: 20;
  background-color: var(--background);
}

.table__body {
  /* tbody styles */
}

.table__body tr:last-child {
  border-bottom: 0;
}

.table__footer {
  border-top: 1px solid var(--border);
  background-color: var(--muted);
  font-weight: 500;
}

.table__row {
  border-bottom: 1px solid var(--border);
  transition: background-color 150ms ease;
}

.table__row:hover {
  background-color: var(--muted);
}

.table__row[data-state="selected"] {
  background-color: var(--muted);
}

.table__head {
  height: 2.5rem;
  padding: 0 0.5rem;
  text-align: left;
  vertical-align: middle;
  font-weight: 500;
  color: var(--muted-foreground);
}

.table__head[data-align="right"] {
  text-align: right;
}

.table__cell {
  padding: 0.5rem;
  vertical-align: middle;
}

.table__cell[data-align="right"] {
  text-align: right;
}

.table__caption {
  margin-top: 1rem;
  font-size: 0.875rem;
  color: var(--muted-foreground);
}
```

**Commit:**
```bash
git commit -m "refactor(table): migrate from Tailwind to CSS modules"
```

---

## Phase 5: Cleanup and Final Removal

### Task 5.1: Remove Tailwind Dependencies

**Files:**
- Modify: `packages/ui/package.json`

**Step 1: Update package.json**

Remove from dependencies:
- `tailwind-merge`
- `class-variance-authority` (if all CVA usage removed)

Remove from devDependencies:
- `tailwindcss`
- `@tailwindcss/postcss`
- `@signozhq/tailwind-config`

Remove from peerDependencies:
- `tailwindcss`
- `tailwindcss-animate`

**Step 2: Remove sideEffects entry for Tailwind**

Update sideEffects array to only include component CSS modules.

**Step 3: Reinstall dependencies**

Run: `pnpm install`

**Step 4: Build and test**

Run: `pnpm build && pnpm test:run`

**Step 5: Commit**

```bash
git add packages/ui/package.json pnpm-lock.yaml
git commit -m "chore(ui): remove Tailwind CSS dependencies"
```

---

### Task 5.2: Update PostCSS Configuration

**Files:**
- Modify or delete: `apps/docs/postcss.config.js` (if it references Tailwind)

**Step 1: Check if PostCSS still needs Tailwind plugin**

If the docs app uses Tailwind separately, keep it. If not, remove `@tailwindcss/postcss`.

**Step 2: Commit**

```bash
git commit -m "chore: update PostCSS configuration after Tailwind removal"
```

---

### Task 5.3: Update Documentation

**Files:**
- Modify: `packages/ui/README.md` (if exists)
- Modify: `CONTRIBUTING.md` (update CSS guidelines)

**Step 1: Document new CSS Module patterns**

Add section on:
- BEM naming convention used
- How to add new components with CSS modules
- Shared utilities usage
- Theme/CSS variable usage

**Step 2: Commit**

```bash
git commit -m "docs: update documentation for CSS modules migration"
```

---

### Task 5.4: Final Verification

**Step 1: Run full test suite**

Run: `pnpm test:run`
Expected: All tests pass

**Step 2: Run full build**

Run: `pnpm build`
Expected: Build succeeds with no Tailwind references

**Step 3: Verify bundle size**

Run: `du -sh packages/ui/dist/`
Expected: Bundle size should be similar or smaller

**Step 4: Visual regression testing (manual)**

- Run docs app: `pnpm dev --filter docs`
- Verify all components render correctly
- Check dark mode works
- Check all color variants work

**Step 5: Final commit**

```bash
git commit -m "chore(ui): complete Tailwind to CSS modules migration"
```

---

## Summary

**Total Tasks:** 35+ tasks across 5 phases
**Estimated Time:** 3-5 days of focused work
**Components to Migrate:** 23
**Files to Create:** ~25 CSS modules
**Files to Modify:** ~25 component files
**Dependencies to Remove:** 5

**Key Patterns:**
1. Keep existing `index.css` files for CSS variable definitions (theme)
2. Create new `*.module.css` files for component styles
3. Replace Tailwind classes with BEM-style CSS module classes
4. Replace CVA with data attribute selectors
5. Use shared utilities module for common patterns
6. Keep `cn()` utility but simplified to just `clsx`
