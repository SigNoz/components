# CSS Remaining Components Audit Plan - 2026-03-05

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Complete CSS audit for the remaining 16 components identified in the audit report to ensure they have complete data-slot and data-color support with correct values from the original Tailwind implementation (test.css).

**Architecture:** Follow the same systematic approach as Tasks 1-6 from the main audit plan - review each component's CSS Modules against test.css, add missing data-slot/data-color patterns, and ensure proper theme support.

**Tech Stack:** 
- CSS Modules
- CSS Custom Properties (CSS Variables)
- data-slot and data-color attributes for theming
- Tailwind CSS (reference only - test.css)

---

## Priority Classification

### High Priority (Form & Interactive - 5 components)
Components most commonly used in forms and interactive UIs. These should be completed first.

1. **Input** - Core form component
2. **Switch** - Toggle control
3. **Radio Group** - Form selection
4. **Toggle Group** - Group toggle control  
5. **Tabs** - Navigation component

### Medium Priority (Navigation & Layout - 5 components)
Components used for navigation and content organization.

6. **Dropdown Menu** - Navigation/action menu
7. **Tooltip** - User guidance
8. **Table / Data Table** - Data display
9. **Drawer** - Modal drawer
10. **Pagination** - Navigation control

### Lower Priority (Specialized - 6 components)
Specialized components with narrower use cases.

11. **Date Picker** - Date selection
12. **Calendar** - Calendar display
13. **Command** - Command palette
14. **Toggle Group** - (duplicate from high priority)
15. **Pin List** - Specialized input
16. **Sonner** - Toast notifications
17. **Resizable** - Resizable panels

---

## Task 1: Audit Input Component

**Priority:** HIGH  
**Estimated Effort:** 2-3 hours  
**Complexity:** Medium (may have multiple variants and states)

**Files:**
- Review: `packages/ui/src/input/input.tsx`
- Review: `packages/ui/src/input/input.module.css`
- Review/Create: `packages/ui/src/input/index.css`
- Reference: Search test.css for `input` or `[data-slot="input"]`

**Steps:**

### Step 1: Review test.css for input data-slot patterns

Search test.css for input-related data attributes:
```bash
grep -n "data-slot.*input\|input.*data-slot" test.css
grep -n "data-color.*input\|input.*data-color" test.css
```

Extract all relevant CSS variables:
- `--input-background`
- `--input-border-color`
- `--input-foreground`
- `--input-placeholder-color`
- etc.

### Step 2: Check current implementation

Review current input.tsx for:
- Does it set data-slot attribute?
- Does it set data-color attribute?
- What variants does it support?

Review input.module.css for:
- Are colors hardcoded or using CSS variables?
- Which CSS variables are used?

### Step 3: Create/update index.css

If data-slot or data-color patterns exist in test.css:
- Create `packages/ui/src/input/index.css` if it doesn't exist
- Extract all data-slot and data-color blocks from test.css
- Include both light and dark mode variants

### Step 4: Update input.tsx

Add missing data attributes:
```typescript
<input
  data-slot="input"
  data-color={color}  // if color variants exist
  className={cn(styles['input'], className)}
  {...props}
/>
```

### Step 5: Update input.module.css

Replace any hardcoded colors with CSS variables from index.css.

### Step 6: Build and verify

```bash
pnpm build --filter=@signozhq/ui
```

### Step 7: Commit

```bash
git add packages/ui/src/input/
git commit -m "feat(input): add data-slot/data-color attributes for theme support"
```

---

## Task 2: Audit Switch Component

**Priority:** HIGH  
**Estimated Effort:** 1-2 hours  
**Complexity:** Low-Medium (similar to Checkbox)

**Files:**
- Review: `packages/ui/src/switch/switch.tsx`
- Review: `packages/ui/src/switch/switch.module.css`
- Review/Create: `packages/ui/src/switch/index.css`
- Reference: Search test.css for `switch` or `[data-slot="switch"]`

**Steps:**

### Step 1: Review test.css for switch data-color patterns

Search test.css for switch-related data-color blocks:
```bash
grep -n -A 3 "data-color.*switch\|switch.*data-color" test.css
```

Expected CSS variables:
- `--switch-checked-background`
- `--switch-thumb-background`
- Similar to checkbox pattern

### Step 2: Check if switch has index.css

```bash
ls -la packages/ui/src/switch/index.css
```

### Step 3: Create index.css with data-color styles

Follow the same pattern as Checkbox (Task 3 from main audit):
```css
[data-color="robin"] {
	--switch-checked-background: var(--bg-robin-500);
}

[data-color="forest"] {
	--switch-checked-background: var(--bg-forest-500);
}

/* ... repeat for all colors: robin, forest, amber, sienna, cherry, sakura, aqua */
```

### Step 4: Import index.css in switch.tsx

```typescript
import './index.css';
```

### Step 5: Update switch.module.css to use CSS variables

```css
.switch[data-state="checked"] {
  background-color: var(--switch-checked-background, var(--primary));
}
```

### Step 6: Add data-color prop to Switch component

```typescript
interface SwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
  color?: 'robin' | 'forest' | 'amber' | 'sienna' | 'cherry' | 'sakura' | 'aqua';
}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(({ className, color = 'robin', ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    data-color={color}
    className={cn(styles['switch'], className)}
    {...props}
  >
```

### Step 7: Build and verify

```bash
pnpm build --filter=@signozhq/ui
```

### Step 8: Commit

```bash
git add packages/ui/src/switch/
git commit -m "feat(switch): add data-color attribute for theme color support"
```

---

## Task 3: Audit Radio Group Component

**Priority:** HIGH  
**Estimated Effort:** 2 hours  
**Complexity:** Medium (group component with multiple children)

**Files:**
- Review: `packages/ui/src/radio-group/radio-group.tsx`
- Review: `packages/ui/src/radio-group/radio-group.module.css`
- Review/Create: `packages/ui/src/radio-group/index.css`
- Reference: Search test.css for `radio` or `[data-slot="radio"]`

**Steps:**

### Step 1: Review test.css for radio data-color patterns

Search for radio-related data attributes and CSS variables:
```bash
grep -n "data-color.*radio\|radio.*data-color" test.css
```

Expected CSS variables:
- `--radio-checked-background`
- `--radio-indicator-color`

### Step 2: Check current radio-group implementation

Review for:
- data-slot attributes
- data-color attributes
- Color variant support

### Step 3: Create index.css with data-color styles

Similar to Checkbox and Switch:
```css
[data-color="robin"] {
	--radio-checked-background: var(--bg-robin-500);
}

[data-color="forest"] {
	--radio-checked-background: var(--bg-forest-500);
}

/* ... repeat for all colors */
```

### Step 4: Update radio-group.tsx

Add data-color prop to RadioGroupItem:
```typescript
<RadioGroupPrimitive.Item
  ref={ref}
  data-color={color}
  className={cn(styles['radio'], className)}
  {...props}
>
```

### Step 5: Update radio-group.module.css

Replace hardcoded colors with CSS variables:
```css
.radio[data-state="checked"] {
  border-color: var(--radio-checked-background, var(--primary));
}

.radio-indicator {
  background-color: var(--radio-checked-background, var(--primary));
}
```

### Step 6: Build and verify

```bash
pnpm build --filter=@signozhq/ui
```

### Step 7: Commit

```bash
git add packages/ui/src/radio-group/
git commit -m "feat(radio-group): add data-color attribute for theme color support"
```

---

## Task 4: Audit Toggle Group Component

**Priority:** HIGH  
**Estimated Effort:** 2 hours  
**Complexity:** Medium (group component with toggle states)

**Files:**
- Review: `packages/ui/src/toggle-group/toggle-group.tsx`
- Review: `packages/ui/src/toggle-group/toggle-group.module.css`
- Review/Create: `packages/ui/src/toggle-group/index.css`
- Reference: Search test.css for `toggle` or `[data-slot="toggle"]`

**Steps:**

### Step 1: Review test.css for toggle patterns

```bash
grep -n "data-slot.*toggle\|toggle.*data-slot" test.css
grep -n "data-color.*toggle\|toggle.*data-color" test.css
```

### Step 2: Check if toggle-group has index.css

```bash
ls -la packages/ui/src/toggle-group/index.css
```

### Step 3: Extract toggle styles from test.css

Create index.css with data-slot and data-color patterns if they exist.

### Step 4: Update toggle-group.tsx

Add data attributes to ToggleGroupItem:
```typescript
<ToggleGroupPrimitive.Item
  ref={ref}
  data-slot="toggle-item"
  data-color={color}
  className={cn(styles['toggle-item'], className)}
  {...props}
/>
```

### Step 5: Update toggle-group.module.css

Replace hardcoded values with CSS variables.

### Step 6: Build and verify

```bash
pnpm build --filter=@signozhq/ui
```

### Step 7: Commit

```bash
git add packages/ui/src/toggle-group/
git commit -m "feat(toggle-group): add data-slot/data-color attributes for theme support"
```

---

## Task 5: Audit Tabs Component

**Priority:** HIGH  
**Estimated Effort:** 2-3 hours  
**Complexity:** Medium-High (multiple sub-components: TabsList, TabsTrigger, TabsContent)

**Files:**
- Review: `packages/ui/src/tabs/tabs.tsx`
- Review: `packages/ui/src/tabs/tabs.module.css`
- Review/Create: `packages/ui/src/tabs/index.css`
- Reference: Search test.css for `tabs` or `[data-slot="tabs"]`

**Steps:**

### Step 1: Review test.css for tabs patterns

Search for all tabs-related data-slot patterns:
```bash
grep -n "data-slot.*tabs\|tabs.*data-slot" test.css
```

Expected data-slots:
- `data-slot="tabs-list"`
- `data-slot="tabs-trigger"`
- `data-slot="tabs-content"`

### Step 2: Check current tabs implementation

Review tabs.tsx for:
- Which sub-components exist (TabsList, TabsTrigger, TabsContent)?
- Do they set data-slot attributes?

### Step 3: Create index.css with data-slot styles

Extract all tabs-related data-slot blocks from test.css:
```css
[data-slot="tabs-list"] {
	/* border, background, padding, etc. */
}

[data-slot="tabs-trigger"] {
	/* default state */
}

[data-slot="tabs-trigger"][data-state="active"] {
	/* active state */
}

[data-slot="tabs-content"] {
	/* content styling */
}
```

### Step 4: Update tabs.tsx

Add data-slot to each sub-component:
```typescript
// TabsList
<TabsPrimitive.List
  data-slot="tabs-list"
  className={cn(styles['tabs-list'], className)}
/>

// TabsTrigger
<TabsPrimitive.Trigger
  data-slot="tabs-trigger"
  className={cn(styles['tabs-trigger'], className)}
/>

// TabsContent
<TabsPrimitive.Content
  data-slot="tabs-content"
  className={cn(styles['tabs-content'], className)}
/>
```

### Step 5: Update tabs.module.css

Replace hardcoded styles with CSS variables from index.css.

### Step 6: Build and verify

```bash
pnpm build --filter=@signozhq/ui
```

### Step 7: Commit

```bash
git add packages/ui/src/tabs/
git commit -m "feat(tabs): add data-slot attributes for theme support"
```

---

## Task 6: Audit Dropdown Menu Component

**Priority:** MEDIUM  
**Estimated Effort:** 2-3 hours  
**Complexity:** Medium-High (multiple sub-components, similar to Dialog/Popover)

**Files:**
- Review: `packages/ui/src/dropdown-menu/dropdown-menu.tsx`
- Review: `packages/ui/src/dropdown-menu/dropdown-menu.module.css`
- Review/Create: `packages/ui/src/dropdown-menu/index.css`
- Reference: Search test.css for `dropdown` or `menu` or `[data-slot="dropdown"]`

**Steps:**

### Step 1: Review test.css for dropdown patterns

```bash
grep -n "data-slot.*dropdown\|dropdown.*data-slot" test.css
grep -n "data-slot.*menu\|menu.*data-slot" test.css
```

Expected data-slots:
- `data-slot="dropdown-content"`
- `data-slot="dropdown-item"`
- `data-slot="dropdown-separator"`

### Step 2: Check current dropdown-menu implementation

Review for existing data-slot attributes and sub-components.

### Step 3: Create index.css

Extract dropdown-related data-slot styles from test.css.

### Step 4: Update dropdown-menu.tsx

Add data-slot to all sub-components (Content, Item, Separator, etc.).

### Step 5: Update dropdown-menu.module.css

Replace hardcoded styles with CSS variables.

### Step 6: Build and verify

```bash
pnpm build --filter=@signozhq/ui
```

### Step 7: Commit

```bash
git add packages/ui/src/dropdown-menu/
git commit -m "feat(dropdown-menu): add data-slot attributes for theme support"
```

---

## Task 7: Audit Tooltip Component

**Priority:** MEDIUM  
**Estimated Effort:** 1-2 hours  
**Complexity:** Low-Medium (similar to Popover)

**Files:**
- Review: `packages/ui/src/tooltip/tooltip.tsx`
- Review: `packages/ui/src/tooltip/tooltip.module.css`
- Review/Create: `packages/ui/src/tooltip/index.css`
- Reference: Search test.css for `tooltip` or `[data-slot="tooltip"]`

**Steps:**

### Step 1: Review test.css for tooltip patterns

```bash
grep -n "data-slot.*tooltip\|tooltip.*data-slot" test.css
```

Expected data-slot:
- `data-slot="tooltip-content"`

### Step 2: Check if tooltip has index.css

Similar to Popover, tooltip should have data-slot support for theming.

### Step 3: Create index.css

Extract tooltip data-slot styles from test.css:
```css
[data-slot="tooltip-content"] {
	background-color: var(--bg-vanilla-900);
	color: var(--text-vanilla-100);
	border: 1px solid var(--border-vanilla-700);
	/* ... */
}

.dark [data-slot="tooltip-content"] {
	background-color: var(--bg-vanilla-800);
	/* ... */
}
```

### Step 4: Update tooltip.tsx

Add data-slot to TooltipContent:
```typescript
<TooltipPrimitive.Content
  data-slot="tooltip-content"
  className={cn(styles['tooltip-content'], className)}
  {...props}
/>
```

### Step 5: Update tooltip.module.css

Replace hardcoded colors with CSS variables.

### Step 6: Build and verify

```bash
pnpm build --filter=@signozhq/ui
```

### Step 7: Commit

```bash
git add packages/ui/src/tooltip/
git commit -m "feat(tooltip): add data-slot attribute for theme support"
```

---

## Task 8: Audit Table / Data Table Component

**Priority:** MEDIUM  
**Estimated Effort:** 3-4 hours  
**Complexity:** High (complex component with many sub-components)

**Files:**
- Review: `packages/ui/src/table/table.tsx` or `packages/ui/src/data-table/`
- Review: `packages/ui/src/table/table.module.css`
- Review/Create: `packages/ui/src/table/index.css`
- Reference: Search test.css for `table` or `[data-slot="table"]`

**Steps:**

### Step 1: Review test.css for table patterns

```bash
grep -n "data-slot.*table\|table.*data-slot" test.css
```

Expected data-slots:
- `data-slot="table"`
- `data-slot="table-header"`
- `data-slot="table-row"`
- `data-slot="table-cell"`

### Step 2: Identify all table sub-components

Review table.tsx for:
- Table, TableHeader, TableBody, TableRow, TableCell, etc.

### Step 3: Create index.css

Extract all table-related data-slot styles from test.css.

### Step 4: Update table.tsx

Add data-slot to each sub-component.

### Step 5: Update table.module.css

Replace hardcoded styles with CSS variables.

### Step 6: Build and verify

```bash
pnpm build --filter=@signozhq/ui
```

### Step 7: Commit

```bash
git add packages/ui/src/table/
git commit -m "feat(table): add data-slot attributes for theme support"
```

---

## Task 9: Audit Drawer Component

**Priority:** MEDIUM  
**Estimated Effort:** 2-3 hours  
**Complexity:** Medium (similar to Dialog)

**Files:**
- Review: `packages/ui/src/drawer/drawer.tsx`
- Review: `packages/ui/src/drawer/drawer.module.css`
- Review/Create: `packages/ui/src/drawer/index.css`
- Reference: Search test.css for `drawer` or `[data-slot="drawer"]`

**Steps:**

### Step 1: Review test.css for drawer patterns

```bash
grep -n "data-slot.*drawer\|drawer.*data-slot" test.css
```

Expected data-slots:
- `data-slot="drawer-overlay"`
- `data-slot="drawer-content"`

### Step 2: Check current drawer implementation

Review for similarities to Dialog component (which already has data-slot support).

### Step 3: Create index.css

Follow Dialog pattern for drawer data-slot styles.

### Step 4: Update drawer.tsx

Add data-slot to DrawerOverlay and DrawerContent:
```typescript
<DrawerPrimitive.Overlay data-slot="drawer-overlay" />
<DrawerPrimitive.Content data-slot="drawer-content" />
```

### Step 5: Update drawer.module.css

Replace hardcoded styles with CSS variables.

### Step 6: Build and verify

```bash
pnpm build --filter=@signozhq/ui
```

### Step 7: Commit

```bash
git add packages/ui/src/drawer/
git commit -m "feat(drawer): add data-slot attributes for theme support"
```

---

## Task 10: Audit Pagination Component

**Priority:** MEDIUM  
**Estimated Effort:** 1-2 hours  
**Complexity:** Low-Medium

**Files:**
- Review: `packages/ui/src/pagination/pagination.tsx`
- Review: `packages/ui/src/pagination/pagination.module.css`
- Review/Create: `packages/ui/src/pagination/index.css`
- Reference: Search test.css for `pagination` or `[data-slot="pagination"]`

**Steps:**

### Step 1: Review test.css for pagination patterns

```bash
grep -n "data-slot.*pagination\|pagination.*data-slot" test.css
```

### Step 2: Check current pagination implementation

Review sub-components and existing data attributes.

### Step 3: Create index.css if needed

Extract pagination data-slot styles from test.css.

### Step 4: Update pagination.tsx

Add data-slot to pagination sub-components.

### Step 5: Update pagination.module.css

Replace hardcoded styles with CSS variables.

### Step 6: Build and verify

```bash
pnpm build --filter=@signozhq/ui
```

### Step 7: Commit

```bash
git add packages/ui/src/pagination/
git commit -m "feat(pagination): add data-slot attributes for theme support"
```

---

## Task 11: Audit Date Picker Component

**Priority:** LOW  
**Estimated Effort:** 2-3 hours  
**Complexity:** Medium-High (may integrate with Calendar)

**Files:**
- Review: `packages/ui/src/date-picker/date-picker.tsx`
- Review: `packages/ui/src/date-picker/date-picker.module.css`
- Review/Create: `packages/ui/src/date-picker/index.css`
- Reference: Search test.css for `date-picker` or `picker`

**Steps:**

### Step 1: Review test.css for date-picker patterns

```bash
grep -n "data-slot.*date\|date.*data-slot" test.css
grep -n "data-slot.*picker\|picker.*data-slot" test.css
```

### Step 2: Check current date-picker implementation

Review for calendar integration and sub-components.

### Step 3: Create index.css

Extract date-picker data-slot styles from test.css.

### Step 4: Update date-picker.tsx

Add data-slot attributes.

### Step 5: Update date-picker.module.css

Replace hardcoded styles with CSS variables.

### Step 6: Build and verify

```bash
pnpm build --filter=@signozhq/ui
```

### Step 7: Commit

```bash
git add packages/ui/src/date-picker/
git commit -m "feat(date-picker): add data-slot attributes for theme support"
```

---

## Task 12: Audit Calendar Component

**Priority:** LOW  
**Estimated Effort:** 3-4 hours  
**Complexity:** High (complex date navigation)

**Files:**
- Review: `packages/ui/src/calendar/calendar.tsx`
- Review: `packages/ui/src/calendar/calendar.module.css`
- Review/Create: `packages/ui/src/calendar/index.css`
- Reference: Search test.css for `calendar` or `[data-slot="calendar"]`

**Steps:**

### Step 1: Review test.css for calendar patterns

```bash
grep -n "data-slot.*calendar\|calendar.*data-slot" test.css
```

Expected data-slots:
- `data-slot="calendar"`
- `data-slot="calendar-day"`
- `data-slot="calendar-month"`

### Step 2: Check current calendar implementation

Review calendar structure and sub-components.

### Step 3: Create index.css

Extract calendar data-slot styles from test.css.

### Step 4: Update calendar.tsx

Add data-slot to calendar sub-components.

### Step 5: Update calendar.module.css

Replace hardcoded styles with CSS variables.

### Step 6: Build and verify

```bash
pnpm build --filter=@signozhq/ui
```

### Step 7: Commit

```bash
git add packages/ui/src/calendar/
git commit -m "feat(calendar): add data-slot attributes for theme support"
```

---

## Task 13: Audit Command Component

**Priority:** LOW  
**Estimated Effort:** 2-3 hours  
**Complexity:** Medium (command palette with search)

**Files:**
- Review: `packages/ui/src/command/command.tsx`
- Review: `packages/ui/src/command/command.module.css`
- Review/Create: `packages/ui/src/command/index.css`
- Reference: Search test.css for `command` or `[data-slot="command"]`

**Steps:**

### Step 1: Review test.css for command patterns

```bash
grep -n "data-slot.*command\|command.*data-slot" test.css
```

### Step 2: Check current command implementation

Review command sub-components (Input, List, Item, etc.).

### Step 3: Create index.css

Extract command data-slot styles from test.css.

### Step 4: Update command.tsx

Add data-slot to command sub-components.

### Step 5: Update command.module.css

Replace hardcoded styles with CSS variables.

### Step 6: Build and verify

```bash
pnpm build --filter=@signozhq/ui
```

### Step 7: Commit

```bash
git add packages/ui/src/command/
git commit -m "feat(command): add data-slot attributes for theme support"
```

---

## Task 14: Audit Pin List Component

**Priority:** LOW  
**Estimated Effort:** 1-2 hours  
**Complexity:** Low

**Files:**
- Review: `packages/ui/src/pin-list/pin-list.tsx`
- Review: `packages/ui/src/pin-list/pin-list.module.css`
- Review/Create: `packages/ui/src/pin-list/index.css`
- Reference: Search test.css for `pin` or `[data-slot="pin"]`

**Steps:**

### Step 1: Review test.css for pin-list patterns

```bash
grep -n "data-slot.*pin\|pin.*data-slot" test.css
```

### Step 2: Check current pin-list implementation

Review component structure.

### Step 3: Create index.css if needed

Extract pin-list data-slot styles from test.css.

### Step 4: Update pin-list.tsx

Add data-slot attributes.

### Step 5: Update pin-list.module.css

Replace hardcoded styles with CSS variables.

### Step 6: Build and verify

```bash
pnpm build --filter=@signozhq/ui
```

### Step 7: Commit

```bash
git add packages/ui/src/pin-list/
git commit -m "feat(pin-list): add data-slot attributes for theme support"
```

---

## Task 15: Audit Sonner Component

**Priority:** LOW  
**Estimated Effort:** 2 hours  
**Complexity:** Medium (toast notifications)

**Files:**
- Review: `packages/ui/src/sonner/sonner.tsx`
- Review: `packages/ui/src/sonner/sonner.module.css`
- Review/Create: `packages/ui/src/sonner/index.css`
- Reference: Search test.css for `sonner` or `toast` or `[data-slot="toast"]`

**Steps:**

### Step 1: Review test.css for sonner/toast patterns

```bash
grep -n "data-slot.*sonner\|sonner.*data-slot" test.css
grep -n "data-slot.*toast\|toast.*data-slot" test.css
```

### Step 2: Check current sonner implementation

Review sonner/toast structure and variants.

### Step 3: Create index.css

Extract sonner/toast data-slot styles from test.css.

### Step 4: Update sonner.tsx

Add data-slot and data-color attributes for toast variants.

### Step 5: Update sonner.module.css

Replace hardcoded styles with CSS variables.

### Step 6: Build and verify

```bash
pnpm build --filter=@signozhq/ui
```

### Step 7: Commit

```bash
git add packages/ui/src/sonner/
git commit -m "feat(sonner): add data-slot attributes for theme support"
```

---

## Task 16: Audit Resizable Component

**Priority:** LOW  
**Estimated Effort:** 1-2 hours  
**Complexity:** Low-Medium

**Files:**
- Review: `packages/ui/src/resizable/resizable.tsx`
- Review: `packages/ui/src/resizable/resizable.module.css`
- Review/Create: `packages/ui/src/resizable/index.css`
- Reference: Search test.css for `resizable` or `[data-slot="resizable"]`

**Steps:**

### Step 1: Review test.css for resizable patterns

```bash
grep -n "data-slot.*resizable\|resizable.*data-slot" test.css
```

### Step 2: Check current resizable implementation

Review resizable sub-components (Panel, Handle, etc.).

### Step 3: Create index.css if needed

Extract resizable data-slot styles from test.css.

### Step 4: Update resizable.tsx

Add data-slot to resizable sub-components.

### Step 5: Update resizable.module.css

Replace hardcoded styles with CSS variables.

### Step 6: Build and verify

```bash
pnpm build --filter=@signozhq/ui
```

### Step 7: Commit

```bash
git add packages/ui/src/resizable/
git commit -m "feat(resizable): add data-slot attributes for theme support"
```

---

## Estimation Summary

### Effort Breakdown by Priority

**High Priority (5 components):**
- Input: 2-3 hours
- Switch: 1-2 hours
- Radio Group: 2 hours
- Toggle Group: 2 hours
- Tabs: 2-3 hours
- **Total: 9-12 hours**

**Medium Priority (5 components):**
- Dropdown Menu: 2-3 hours
- Tooltip: 1-2 hours
- Table: 3-4 hours
- Drawer: 2-3 hours
- Pagination: 1-2 hours
- **Total: 9-14 hours**

**Low Priority (6 components):**
- Date Picker: 2-3 hours
- Calendar: 3-4 hours
- Command: 2-3 hours
- Pin List: 1-2 hours
- Sonner: 2 hours
- Resizable: 1-2 hours
- **Total: 11-16 hours**

**Grand Total: 29-42 hours of estimated effort**

### Complexity Distribution

- **Low:** 3 components (Pin List, Tooltip, Pagination)
- **Low-Medium:** 4 components (Switch, Resizable, Toggle Group, Drawer)
- **Medium:** 5 components (Input, Radio Group, Command, Sonner, Dropdown Menu)
- **Medium-High:** 2 components (Tabs, Date Picker)
- **High:** 2 components (Table, Calendar)

---

## Patterns to Follow

All tasks should follow the established patterns from Tasks 1-6:

### 1. Data-Slot Pattern
```css
[data-slot="component-name"] {
  --component-background: var(--bg-color);
  --component-foreground: var(--text-color);
}
```

### 2. Data-Color Pattern
```css
[data-color="robin"] {
  --component-checked-background: var(--bg-robin-500);
}
```

### 3. Type-to-Color Mapping (for semantic variants)
```typescript
const TYPE_TO_COLOR: Record<Type, Color> = {
  info: 'robin',
  success: 'forest',
  warning: 'amber',
  error: 'cherry'
}
```

### 4. Component Structure
```typescript
interface ComponentProps {
  color?: 'robin' | 'forest' | 'amber' | 'sienna' | 'cherry' | 'sakura' | 'aqua';
}

const Component = React.forwardRef<HTMLElement, ComponentProps>(
  ({ className, color = 'robin', ...props }, ref) => (
    <Element
      ref={ref}
      data-slot="component-name"
      data-color={color}
      className={cn(styles['component'], className)}
      {...props}
    />
  )
);
```

### 5. CSS Variable Usage in Module CSS
```css
.component {
  background-color: var(--component-background, var(--fallback));
  color: var(--component-foreground, var(--fallback-text));
}
```

### 6. Light/Dark Mode Support
```css
[data-slot="component"] {
  /* light mode */
}

.dark [data-slot="component"] {
  /* dark mode */
}
```

---

## Verification Checklist

After completing each task, verify:

- [ ] Component builds without errors
- [ ] data-slot attribute is set where applicable
- [ ] data-color attribute is set where applicable
- [ ] index.css exists with proper data-slot/data-color blocks
- [ ] index.css is imported in component TSX
- [ ] Module CSS uses CSS variables (no hardcoded colors)
- [ ] Light and dark mode variants are present
- [ ] Component prop interface includes color prop (if applicable)
- [ ] Default color is set (typically 'robin')
- [ ] Commit message follows pattern
- [ ] Changes follow established patterns from Tasks 1-6

---

## Notes

- **Incremental Approach:** Complete high-priority components first for maximum impact
- **Pattern Consistency:** Strictly follow patterns from Tasks 1-6 for maintainability
- **test.css is Source of Truth:** All CSS variables and values should match test.css exactly
- **Preserve Existing Work:** Do not modify any padding or layout fixes from previous work
- **Color Space:** Use `oklab` for brand colors (robin, forest, etc.) and `srgb` for semantic colors
- **Fallback Values:** Always include fallback values in CSS variables
- **Documentation:** Update Storybook stories to showcase new theming capabilities

---

**Plan Created:** 2026-03-05  
**Total Components:** 16  
**Estimated Total Effort:** 29-42 hours  
**Priority Breakdown:**
- High: 5 components (9-12 hours)
- Medium: 5 components (9-14 hours)
- Low: 6 components (11-16 hours)

**Status:** Ready for execution
