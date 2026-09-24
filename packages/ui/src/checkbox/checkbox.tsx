import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox';
import { Check, Minus } from '@signozhq/icons';
import {
	type CSSProperties,
	forwardRef,
	type ReactElement,
	type RefAttributes,
	useId,
	useMemo,
	useState,
} from 'react';
import { toCssLength } from '../lib/css-length.js';
import { hasRenderableContent, omitStyleProps } from '../lib/utils.js';
import { useIsLabelTruncated } from '../lib/useIsLabelTruncated.js';
import { TooltipAnchor } from '../tooltip/subcomponents/tooltip-anchor.js';
import { TooltipStack } from '../tooltip/subcomponents/tooltip-stack.js';
import {
	hasTooltipContent,
	type TooltipContentStackEntry,
} from '../tooltip/tooltip-content-stack-context.js';
import { CheckboxTextOverflow } from './constants.js';
import styles from './checkbox.module.scss';
import type { CheckboxProps, ValidateCheckboxProps } from './types.js';

const CheckboxImpl = forwardRef<HTMLSpanElement, CheckboxProps>(function Checkbox(
	{
		id,
		children,
		tabIndex,
		color,
		textOverflow = CheckboxTextOverflow.Ellipsis,
		disabled,
		disabledTooltip,
		readOnly,
		readOnlyTooltip,
		name,
		required,
		value,
		defaultValue,
		onChange,
		testId,
		width,
		maxWidth,
		containerId,
		containerTestId,
		containerRef,
		...props
	},
	ref,
) {
	const labelId = useId();

	const isReadOnly = readOnly === true;

	// `'indeterminate'` is one more value of `value`, while Base UI splits it into a boolean prop
	// beside `checked`; the union is unpacked here. An uncontrolled checkbox needs one piece of
	// state for it: the dash shows until the first toggle, then the internal boolean takes over.
	const [uncontrolledIndeterminate, setUncontrolledIndeterminate] = useState(
		defaultValue === 'indeterminate',
	);
	const indeterminate = value === undefined ? uncontrolledIndeterminate : value === 'indeterminate';

	// Base UI hands the change two arguments, the value and its event details. The extra argument
	// stops at this boundary so `onChange` keeps the one-argument shape every input in this
	// library shares.
	const onCheckedChange = useMemo(
		() =>
			(checked: boolean): void => {
				setUncontrolledIndeterminate(false);
				onChange?.(checked);
			},
		[onChange],
	);

	const hasLabel = hasRenderableContent(children);
	const hasContainer =
		hasLabel || containerId !== undefined || containerTestId !== undefined || containerRef != null;

	const hasOverflowTooltip = hasLabel && textOverflow === CheckboxTextOverflow.Ellipsis;
	const [isLabelTruncated, labelRef] = useIsLabelTruncated(hasOverflowTooltip);

	const hasReadOnlyTooltip = isReadOnly && hasTooltipContent(readOnlyTooltip);
	const hasDisabledTooltip = !isReadOnly && Boolean(disabled) && hasTooltipContent(disabledTooltip);

	const tooltipContent = useMemo(() => {
		const entries: TooltipContentStackEntry[] = [];

		if (hasReadOnlyTooltip) {
			entries.push({ id: 'readonly-tooltip', content: readOnlyTooltip });
		} else if (hasDisabledTooltip) {
			entries.push({ id: 'disabled-tooltip', content: disabledTooltip });
		}

		if (isLabelTruncated) {
			entries.push({ id: 'label', content: children });
		}

		return entries.length === 0 ? null : <TooltipStack items={entries} />;
	}, [
		hasReadOnlyTooltip,
		readOnlyTooltip,
		hasDisabledTooltip,
		disabledTooltip,
		isLabelTruncated,
		children,
	]);

	// The trigger mounts from the props, not from whether there is content right now, so the
	// element never remounts and never drops focus when a reason appears or a label starts to fit.
	const hasTooltip = disabledTooltip != null || readOnlyTooltip != null || hasOverflowTooltip;

	const sizeStyle = {
		...(width == null ? {} : { '--checkbox-internal-width': toCssLength(width) }),
		...(maxWidth == null ? {} : { '--checkbox-internal-max-width': toCssLength(maxWidth) }),
	} as CSSProperties;

	const checkboxEl = (
		<CheckboxPrimitive.Root
			ref={ref}
			id={id}
			data-slot="checkbox"
			data-color={color}
			className={styles['checkbox']}
			style={hasContainer ? undefined : sizeStyle}
			checked={value === undefined ? undefined : value === true}
			defaultChecked={defaultValue === undefined ? undefined : defaultValue === true}
			onCheckedChange={onCheckedChange}
			indeterminate={indeterminate}
			disabled={isReadOnly ? false : disabled}
			// Base UI parks a disabled checkbox at `tabindex="-1"`; staying focusable is what keeps
			// `disabledTooltip` reachable without a pointer. Spread rather than written plainly,
			// because an explicit `tabIndex={undefined}` would erase Base UI's own `0`.
			{...(!isReadOnly && disabled === true
				? { tabIndex: tabIndex ?? 0 }
				: tabIndex === undefined
					? {}
					: { tabIndex })}
			readOnly={readOnly}
			required={required}
			name={name}
			aria-labelledby={hasLabel ? labelId : undefined}
			{...omitStyleProps(props)}
			{...(testId === undefined ? {} : { 'data-testid': testId })}
		>
			<span data-slot="checkbox-box" className={styles['checkbox__box']}>
				<CheckboxPrimitive.Indicator
					data-slot="checkbox-indicator"
					className={styles['checkbox__indicator']}
				>
					{indeterminate ? <Minus strokeWidth={3} /> : <Check strokeWidth={3} />}
				</CheckboxPrimitive.Indicator>
			</span>
		</CheckboxPrimitive.Root>
	);

	const controlEl = hasContainer ? (
		<label
			ref={containerRef}
			id={containerId}
			data-slot="checkbox-container"
			data-text-overflow={textOverflow}
			className={styles['checkbox-container']}
			style={sizeStyle}
			{...(containerTestId === undefined ? {} : { 'data-testid': containerTestId })}
		>
			{checkboxEl}
			{hasLabel && (
				<span
					id={labelId}
					ref={labelRef}
					data-slot="checkbox-label"
					data-truncated={isLabelTruncated || undefined}
					className={styles['checkbox__label']}
				>
					{children}
				</span>
			)}
		</label>
	) : (
		checkboxEl
	);

	if (!hasTooltip) {
		return controlEl;
	}

	return (
		<TooltipAnchor
			content={tooltipContent}
			contentProps={{ className: styles['checkbox__label-tooltip'] }}
		>
			{controlEl}
		</TooltipAnchor>
	);
});

/**
 * Renders a checkbox (Base UI `Checkbox`) for one independent yes/no choice, with a label.
 *
 * A checkbox collects a choice that something else commits, a form or an apply button. An
 * immediate action with a visible consequence is a `Switch`; exactly one choice out of several is
 * a `RadioGroup`.
 *
 * The checkbox is a `<span role="checkbox">` over a hidden checkbox input, and `required`,
 * `disabled` and `readOnly` are announced on it as `aria-required`, `aria-disabled` and
 * `aria-readonly`. Every `aria-*` and any `data-*` are forwarded to it.
 *
 * Visual values are `--checkbox-*` custom properties, defaults in the `css-tokens` region of
 * `./index.ts`. The 16px box carries a built-in 2px hit-area ring, so the pointer target is 20px
 * while the layout footprint stays 16px; the ring never paints any state, only the box does.
 *
 * ### Label
 *
 * `children` is the label. With it (or any `container*` prop) the checkbox renders inside a
 * `<label>` wrapper, so clicking the text toggles, and the label is the accessible name through
 * `aria-labelledby`. Without it the checkbox renders bare, with no wrapper at all: give it a name
 * with `aria-label`.
 *
 * `children` that render nothing (`null`, `false` or an empty string) count as not passed: the
 * checkbox renders without a label.
 *
 * ### Indeterminate
 *
 * `value="indeterminate"` shows the mixed state, a dash instead of the check mark, announced as
 * `aria-checked="mixed"`. Clicking a mixed checkbox reports `true` through `onChange`; deriving
 * `'indeterminate'` from a tree's children is the call site's job. An uncontrolled
 * `defaultValue="indeterminate"` shows the dash until the first toggle.
 *
 * ### Disabled and read-only
 *
 * `disabled` blocks the checkbox, `readOnly` locks its value. Neither leaves the keyboard: both
 * are announced through `aria-disabled` and `aria-readonly` while the checkbox keeps its tab stop
 * and stays hoverable. That is what makes the two tooltips reachable.
 *
 * `readOnly` outranks `disabled`: while it is set the checkbox is not disabled at all, and
 * `readOnlyTooltip` is the reason shown. `disabledTooltip` is suppressed for that whole time.
 *
 * ### Truncation
 *
 * `textOverflow="ellipsis"` (the default) measures the label and re-measures on resize. While it
 * does not fit it carries `data-truncated` and shows the full text in a tooltip. `wrap` lets the
 * text take more lines, `hidden` clips it, and `visible` clips nothing. None of those three shows
 * a tooltip. The checkbox's own reason stacks above the truncated label, reason first.
 *
 * ### In a form
 *
 * `name` makes the hidden input submit `"on"` while checked, like a native checkbox, and
 * `required` blocks submission until it is. `id` lands on that hidden input. Because the label
 * wraps the control, an antd `Form.Item` with `valuePropName` cannot inject state from outside:
 * pass `value` and `onChange` yourself.
 *
 * ### Asserting on it
 *
 * `testId` is `data-testid` on the checkbox itself and survives the tooltip trigger cloning the
 * element; `containerTestId` names the wrapper. Otherwise use the data attributes, never the
 * hashed class names.
 *
 * | root attribute | value |
 * |---|---|
 * | `data-slot` | `"checkbox"` |
 * | `data-color` | mirrors the prop |
 * | `data-checked` / `data-unchecked` | the current state, neither while `indeterminate` |
 * | `data-indeterminate` | present while `indeterminate` |
 * | `data-disabled`, `data-readonly`, `data-required` | present while set |
 *
 * | wrapper attribute | value |
 * |---|---|
 * | `data-slot` | `"checkbox-container"` |
 * | `data-text-overflow` | `ellipsis` (default), `wrap`, `visible` or `hidden` |
 *
 * | `data-slot` | rendered |
 * |---|---|
 * | `checkbox-box` | always, the 16px visual box |
 * | `checkbox-indicator` | while checked or indeterminate, holds the glyph |
 * | `checkbox-container` | the `<label>` wrapper, only with a label or a `container*` prop |
 * | `checkbox-label` | only with a label, the measured element, `data-truncated` while it does not fit |
 *
 * @example
 * ```tsx
 * <Checkbox color="primary" value={isWrapped} onChange={setIsWrapped}>
 *   Wrap text
 * </Checkbox>
 * ```
 *
 * @example
 * ```tsx
 * // Bare checkbox: no label, no wrapper element, name it yourself
 * <Checkbox color="primary" aria-label="Select row" value={isSelected} onChange={setIsSelected} />
 * ```
 *
 * @example
 * ```tsx
 * // Select-all over a partly selected list
 * <Checkbox
 *   color="primary"
 *   value={allSelected ? true : someSelected ? 'indeterminate' : false}
 *   onChange={setAllSelected}
 * >
 *   Select all
 * </Checkbox>
 * ```
 */
export const Checkbox = CheckboxImpl as <T extends CheckboxProps>(
	props: T &
		ValidateCheckboxProps<T> &
		// `T` is inferred from the call site, so `T extends CheckboxProps` alone never runs excess
		// property checks. Every key outside the props is pinned to `never` instead.
		Record<Exclude<keyof T, keyof CheckboxProps | keyof RefAttributes<HTMLSpanElement>>, never> &
		RefAttributes<HTMLSpanElement>,
) => ReactElement;
