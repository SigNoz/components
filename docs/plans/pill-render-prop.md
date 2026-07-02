# Plan: Add `pillRender` Prop for Migration from Antd Select

## Context

Signoz codebase has **282 files** using Antd Select with **10 usages** of `tagRender` prop. Need bridge to migrate to signoz-components SelectSimple/ComboboxSimple.

### Antd `tagRender` Signature
```tsx
type TagRenderProps = {
  label: React.ReactNode;
  value: string;
  closable: boolean;
  disabled: boolean;
  onClose: () => void;
};

tagRender?: (props: TagRenderProps) => React.ReactElement;
```

### Current Usage Patterns in Signoz

1. **Custom Badge styling** - Replace default tag with Badge component
2. **Complex tag component** - HavingFilterTag with custom close handlers
3. **Hide tags** - Return `<></>`, render pills separately
4. **Select All logic** - Complex rendering with truncation/tooltips

---

## Design

### New Type: `PillRenderProps`

```tsx
export type PillRenderProps = {
  /** Display content for pill (resolved label) */
  label: React.ReactNode;
  /** Raw value string */
  value: string;
  /** Whether pill can be removed */
  closable: boolean;
  /** Whether component is disabled */
  disabled: boolean;
  /** Call to remove this value from selection */
  onClose: () => void;
};

export type PillRenderFn = (props: PillRenderProps) => React.ReactElement;
```

### Prop Addition

Add to both presets:
- `SelectSimple`: `pillRender?: PillRenderFn`
- `ComboboxSimple`: `pillRender?: PillRenderFn`

When `pillRender` provided:
- Skip default `ComboboxPill` / select pill rendering
- Call `pillRender` for each selected value
- Still respect `maxDisplayedPills` for overflow badge

---

## Implementation

### Phase 1: Types & ComboboxSimple

**Files:**
1. `src/combobox/presets/combobox-simple/types.ts` - Add PillRenderProps type
2. `src/combobox/presets/combobox-simple/components/pills.tsx` - Accept pillRender
3. `src/combobox/presets/combobox-simple/combobox-simple.tsx` - Pass through

**Changes to `pills.tsx`:**
```tsx
export type ComboboxPillsProps = {
  values: string[];
  maxDisplayed?: number;
  resolveLabel: (value: string) => React.ReactNode;
  onRemove: (value: string) => void;
  disabled?: boolean;
  pillRender?: PillRenderFn;
};

export function ComboboxPills({
  values,
  maxDisplayed,
  resolveLabel,
  onRemove,
  disabled = false,
  pillRender,
}: ComboboxPillsProps): React.ReactElement | null {
  // ...existing overflow logic...

  return (
    <span data-slot="combobox-pills" style={...}>
      {displayedValues.map((v) => {
        const label = resolveLabel(v);
        
        if (pillRender) {
          return (
            <React.Fragment key={v}>
              {pillRender({
                label,
                value: v,
                closable: true,
                disabled,
                onClose: () => onRemove(v),
              })}
            </React.Fragment>
          );
        }
        
        return (
          <ComboboxPill key={v} value={v} onRemove={onRemove}>
            {label}
          </ComboboxPill>
        );
      })}
      {/* overflow badge unchanged */}
    </span>
  );
}
```

**Changes to `combobox-simple.tsx`:**
```tsx
export type ComboboxSimpleProps = {
  // ...existing props...
  /**
   * Custom render function for each pill in multi-select mode.
   * Use for migration from Antd Select's tagRender prop.
   */
  pillRender?: PillRenderFn;
};

// In component, pass to ComboboxPills:
<ComboboxPills
  values={selectedValues}
  maxDisplayed={maxDisplayedPills}
  resolveLabel={resolveLabel}
  onRemove={handleRemove}
  disabled={disabled}
  pillRender={pillRender}
/>
```

### Phase 2: SelectSimple

**Files:**
1. `src/select/components/select-trigger.tsx` - Accept pillRender
2. `src/select/presets/select-simple.tsx` - Pass through

**Changes to `select-trigger.tsx`:**
```tsx
export type SelectTriggerProps = {
  // ...existing props...
  /** Custom render function for each pill in multi-select mode. */
  pillRender?: PillRenderFn;
};

// In renderContent(), multi-select branch:
if (context?.multiple && hasValue) {
  const values = context.value;
  const displayedValues = maxDisplayedPills !== undefined 
    ? values.slice(0, maxDisplayedPills) 
    : values;
  const overflowCount = ...;

  return (
    <span className={styles.select__pills}>
      {displayedValues.map((v) => {
        const label = resolveLabel ? resolveLabel(v) : v;
        
        if (pillRender) {
          return (
            <React.Fragment key={v}>
              {pillRender({
                label,
                value: v,
                closable: true,
                disabled: !!props.disabled,
                onClose: () => context.onRemove(v),
              })}
            </React.Fragment>
          );
        }
        
        // Default pill rendering unchanged
        return (
          <span key={v} className={styles.select__pill}>
            ...
          </span>
        );
      })}
      {overflowCount > 0 && ...}
    </span>
  );
}
```

### Phase 3: Tests

**New test file:** `src/combobox/presets/combobox-simple/combobox-simple-pillrender.test.tsx`

```tsx
describe('ComboboxSimple pillRender', () => {
  it('renders custom pills when pillRender provided', () => {
    const pillRender = ({ label, onClose }) => (
      <span data-testid="custom-pill">
        {label}
        <button onClick={onClose}>x</button>
      </span>
    );
    
    render(
      <ComboboxSimple
        multiple
        items={items}
        value={['a', 'b']}
        pillRender={pillRender}
      />
    );
    
    expect(screen.getAllByTestId('custom-pill')).toHaveLength(2);
  });

  it('passes correct props to pillRender', () => {
    const pillRender = vi.fn(() => <span />);
    
    render(
      <ComboboxSimple
        multiple
        items={[{ value: 'test', label: 'Test Label' }]}
        value={['test']}
        pillRender={pillRender}
        disabled
      />
    );
    
    expect(pillRender).toHaveBeenCalledWith({
      label: 'Test Label',
      value: 'test',
      closable: true,
      disabled: true,
      onClose: expect.any(Function),
    });
  });

  it('respects maxDisplayedPills with pillRender', () => {
    const pillRender = ({ label }) => <span data-testid="pill">{label}</span>;
    
    render(
      <ComboboxSimple
        multiple
        items={items}
        value={['a', 'b', 'c', 'd']}
        pillRender={pillRender}
        maxDisplayedPills={2}
      />
    );
    
    expect(screen.getAllByTestId('pill')).toHaveLength(2);
    expect(screen.getByText('+2')).toBeInTheDocument();
  });
});
```

### Phase 4: Export Types

**File:** `src/combobox/presets/combobox-simple/index.ts`
```tsx
export type { PillRenderProps, PillRenderFn } from './types.js';
```

**File:** `src/index.ts`
```tsx
export type { PillRenderProps, PillRenderFn } from './combobox/presets/combobox-simple/index.js';
```

---

## Migration Examples

### Pattern 1: Custom Badge (TriggeredAlerts/Filter.tsx)

**Before (Antd):**
```tsx
<Select
  mode="multiple"
  tagRender={({ label, closable, onClose }) => (
    <Badge color="sakura" closable={closable} onClose={onClose}>
      {label}
    </Badge>
  )}
/>
```

**After (SignozComponents):**
```tsx
<ComboboxSimple
  multiple
  pillRender={({ label, closable, onClose }) => (
    <Badge color="sakura" closable={closable} onClose={onClose}>
      {label}
    </Badge>
  )}
/>
```

### Pattern 2: Hide Tags (PlannedDowntimeForm.tsx)

**Before (Antd):**
```tsx
<Select
  mode="multiple"
  tagRender={() => <></>}
/>
{/* Tags rendered separately below */}
```

**After (SignozComponents):**
```tsx
<ComboboxSimple
  multiple
  pillRender={() => <></>}
/>
{/* Tags rendered separately below */}
```

### Pattern 3: Complex Tag (HavingFilter.tsx)

**Before (Antd):**
```tsx
<Select
  mode="multiple"
  tagRender={({ label, value, closable, disabled, onClose }) => (
    <HavingFilterTag
      label={label}
      value={value}
      closable={closable}
      disabled={disabled}
      onClose={onClose}
    />
  )}
/>
```

**After (SignozComponents):**
```tsx
<ComboboxSimple
  multiple
  pillRender={({ label, value, closable, disabled, onClose }) => (
    <HavingFilterTag
      label={label}
      value={value}
      closable={closable}
      disabled={disabled}
      onClose={onClose}
    />
  )}
/>
```

---

## Checklist

- [x] Add `PillRenderProps` and `PillRenderFn` types to `types.ts`
- [x] Update `ComboboxPills` to accept and use `pillRender`
- [x] Update `ComboboxSimple` props and pass through
- [x] Update `SelectTrigger` to accept and use `pillRender`
- [x] Update `SelectSimple` props and pass through
- [x] Add tests for pillRender in ComboboxSimple
- [x] Add tests for pillRender in SelectSimple
- [x] Export types from package index
- [x] Update storybook examples
- [ ] Document in README

---

## Open Questions

1. **Should `closable` always be `true`?** Or derive from component state?
   - Recommendation: Always `true` in multi-select, let consumer decide rendering

2. **Overflow badge customization?** Current plan: keep default overflow badge even with custom pillRender
   - Could add separate `overflowRender` prop later if needed

3. **Single-select support?** Current plan: only for multi-select (`multiple` mode)
   - Single-select uses `displayValue` prop instead
