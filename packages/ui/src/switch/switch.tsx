import { Switch as SwitchPrimitive } from '@base-ui/react/switch';
import { forwardRef, type ReactElement, type RefAttributes, useId, useMemo } from 'react';
import { toCssLength } from '../lib/css-length.js';
import { cn, hasRenderableContent } from '../lib/utils.js';
import { useIsLabelTruncated } from '../lib/useIsLabelTruncated.js';
import { TooltipContent } from '../tooltip/subcomponents/tooltip-content.js';
import { TooltipProviderIfMissing } from '../tooltip/subcomponents/tooltip-provider.js';
import { TooltipRoot } from '../tooltip/subcomponents/tooltip-root.js';
import { TooltipStack } from '../tooltip/subcomponents/tooltip-stack.js';
import { TooltipTrigger } from '../tooltip/subcomponents/tooltip-trigger.js';
import {
	hasTooltipContent,
	type TooltipContentStackEntry,
} from '../tooltip/tooltip-content-stack-context.js';
import { useTooltipHandle } from '../tooltip/tooltip-handle.js';
import { SwitchTextOverflow, SwitchTextPlacement } from './constants.js';
import styles from './switch.module.scss';
import type { SwitchProps, ValidateSwitchProps } from './types.js';

const SwitchImpl = forwardRef<HTMLSpanElement, SwitchProps>(function Switch(
	{
		id,
		className,
		style,
		children,
		description,
		color,
		textPlacement,
		textOverflow = SwitchTextOverflow.Ellipsis,
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
		containerClassName,
		containerStyle,
		containerId,
		containerTestId,
		containerRef,
		...props
	},
	ref,
) {
	const labelId = useId();
	const descriptionId = useId();
	const tooltipContentId = useId();
	const tooltipHandle = useTooltipHandle();

	const isReadOnly = readOnly === true;

	// Base UI hands the change two arguments, the value and its event details. The extra argument
	// stops at this boundary so `onChange` keeps the one-argument shape every input in this
	// library shares.
	const onCheckedChange = useMemo(
		() =>
			onChange === undefined
				? undefined
				: (checked: boolean): void => {
						onChange(checked);
					},
		[onChange],
	);

	const hasDescription = typeof description === 'string' && description !== '';
	const hasLabel = hasRenderableContent(children);
	const hasText = hasLabel || hasDescription;
	const hasContainer =
		hasText ||
		containerClassName !== undefined ||
		containerStyle !== undefined ||
		containerId !== undefined ||
		containerTestId !== undefined ||
		containerRef != null;

	const hasOverflowTooltip = hasLabel && textOverflow === SwitchTextOverflow.Ellipsis;
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
		...(width == null ? {} : { '--switch-internal-width': toCssLength(width) }),
		...(maxWidth == null ? {} : { '--switch-internal-max-width': toCssLength(maxWidth) }),
	};

	const switchEl = (
		<SwitchPrimitive.Root
			ref={ref}
			id={id}
			data-slot="switch"
			data-color={color}
			className={cn(styles['switch'], className)}
			style={hasContainer ? style : { ...style, ...sizeStyle }}
			checked={value}
			defaultChecked={defaultValue}
			onCheckedChange={onCheckedChange}
			disabled={isReadOnly ? false : disabled}
			// Base UI parks a disabled switch at `tabindex="-1"`; staying focusable is what keeps
			// `disabledTooltip` reachable without a pointer. Spread rather than written plainly,
			// because an explicit `tabIndex={undefined}` would erase Base UI's own `0`.
			{...(!isReadOnly && disabled === true ? { tabIndex: 0 } : {})}
			readOnly={readOnly}
			required={required}
			name={name}
			aria-labelledby={hasLabel ? labelId : undefined}
			aria-describedby={hasDescription ? descriptionId : undefined}
			{...props}
			{...(testId === undefined ? {} : { 'data-testid': testId })}
		>
			<SwitchPrimitive.Thumb data-slot="switch-thumb" className={styles['switch__thumb']} />
		</SwitchPrimitive.Root>
	);

	const textEl = hasText ? (
		<span data-slot="switch-text" className={styles['switch__text']}>
			{hasLabel && (
				<span
					id={labelId}
					ref={labelRef}
					data-slot="switch-label"
					data-truncated={isLabelTruncated || undefined}
					className={styles['switch__label']}
				>
					{children}
				</span>
			)}
			{hasDescription && (
				<span
					id={descriptionId}
					data-slot="switch-description"
					className={styles['switch__description']}
				>
					{description}
				</span>
			)}
		</span>
	) : null;

	const controlEl = hasContainer ? (
		<label
			ref={containerRef}
			id={containerId}
			data-slot="switch-container"
			data-text-placement={textPlacement}
			data-text-overflow={textOverflow}
			className={cn(styles['switch-container'], containerClassName)}
			style={{ ...containerStyle, ...sizeStyle }}
			{...(containerTestId === undefined ? {} : { 'data-testid': containerTestId })}
		>
			{textPlacement === SwitchTextPlacement.Left ? (
				<>
					{textEl}
					{switchEl}
				</>
			) : (
				<>
					{switchEl}
					{textEl}
				</>
			)}
		</label>
	) : (
		switchEl
	);

	if (!hasTooltip) {
		return controlEl;
	}

	return (
		<TooltipProviderIfMissing>
			<TooltipTrigger
				handle={tooltipHandle}
				contentId={tooltipContent === null ? undefined : tooltipContentId}
			>
				{controlEl}
			</TooltipTrigger>
			{tooltipContent !== null && (
				<TooltipRoot handle={tooltipHandle}>
					<TooltipContent id={tooltipContentId} className={styles['switch__label-tooltip']}>
						{tooltipContent}
					</TooltipContent>
				</TooltipRoot>
			)}
		</TooltipProviderIfMissing>
	);
});

/**
 * Renders a toggle for one on/off setting (Base UI `Switch`), with an optional label and
 * description.
 *
 * A switch commits immediately: no save button, no confirmation. If the action needs confirming,
 * it isn't a switch. Keep the change optimistic with a rollback path, and report a failed commit
 * with a toast, not a silent revert.
 *
 * The switch is a `<span role="switch">` over a hidden checkbox input, and `required`, `disabled`
 * and `readOnly` are announced on it as `aria-required`, `aria-disabled` and `aria-readonly`.
 * Every `aria-*` and any `data-*` are forwarded to it.
 *
 * Visual values are `--switch-*` custom properties, defaults in the `css-tokens` region of
 * `./index.ts`. The track and knob are sized by `--switch-track-width`,
 * `--switch-track-height`, `--switch-thumb-size` and `--switch-thumb-inset`, and the knob's
 * travel is derived from all four, so any of them can change alone without breaking the geometry.
 *
 * ### Label and description
 *
 * `children` is the label. With it (or any `container*` prop) the switch renders inside a
 * `<label>` wrapper, so clicking the text toggles, and the label is the accessible name through
 * `aria-labelledby`. Without it the switch renders bare, with no wrapper at all: give it a name
 * with `aria-label`.
 *
 * `description` is a muted second line under the label, announced through `aria-describedby`.
 *
 * `children` that render nothing (`null`, `false` or an empty string) count as not passed: the
 * switch renders without a label, per the spec's empty-text behavior.
 *
 * `textPlacement="left"` is the settings row: text first, the row fills its container, and the
 * switch sits at the far edge. `textPlacement="right"` is the plain toggle row, sized to its
 * content.
 *
 * ```tsx
 * <Switch
 *   color="primary"
 *   textPlacement="left"
 *   description="Use the 24-hour convention while showing timestamps on the console."
 *   value={is24h}
 *   onChange={setIs24h}
 * >
 *   Display timestamp in 24-hour format
 * </Switch>
 * ```
 *
 * ### Disabled and read-only
 *
 * `disabled` blocks the switch, `readOnly` locks its value. Neither leaves the keyboard: both are
 * announced through `aria-disabled` and `aria-readonly` while the switch keeps its tab stop and
 * stays hoverable. That is what makes the two tooltips reachable.
 *
 * `readOnly` outranks `disabled`: while it is set the switch is not disabled at all, and
 * `readOnlyTooltip` is the reason shown. `disabledTooltip` is suppressed for that whole time.
 *
 * ### Truncation
 *
 * `textOverflow="ellipsis"` (the default) measures the label and re-measures on resize. While it
 * does not fit it carries `data-truncated` and shows the full text in a tooltip. `wrap` lets the
 * text take more lines, `hidden` clips it, and `visible` clips nothing. None of those three shows
 * a tooltip. The switch's own reason stacks above the truncated label, reason first.
 *
 * ### Asserting on it
 *
 * `testId` is `data-testid` on the switch itself and survives the tooltip trigger cloning the
 * element; `containerTestId` names the wrapper. Otherwise use the data attributes, never the
 * hashed class names.
 *
 * | root attribute | value |
 * |---|---|
 * | `data-slot` | `"switch"` |
 * | `data-color` | mirrors the prop |
 * | `data-checked` / `data-unchecked` | the current state |
 * | `data-disabled`, `data-readonly`, `data-required` | present while set |
 *
 * | wrapper attribute | value |
 * |---|---|
 * | `data-slot` | `"switch-container"` |
 * | `data-text-placement` | `right` or `left`, mirrors the prop |
 * | `data-text-overflow` | `ellipsis` (default), `wrap`, `visible` or `hidden` |
 *
 * | `data-slot` | rendered |
 * |---|---|
 * | `switch-thumb` | always, the knob |
 * | `switch-container` | the `<label>` wrapper, only with text or a `container*` prop |
 * | `switch-text` | the text column, only with a label or description |
 * | `switch-label` | only with a label, the measured element, `data-truncated` while it does not fit |
 * | `switch-description` | only with a `description` |
 *
 * @example
 * ```tsx
 * <Switch color="primary" textPlacement="right" value={isWrapped} onChange={setIsWrapped}>
 *   Wrap text
 * </Switch>
 * ```
 *
 * @example
 * ```tsx
 * // Bare switch: no label, no wrapper element, name it yourself
 * <Switch
 *   color="primary"
 *   textPlacement="right"
 *   aria-label="Pin the side nav"
 *   value={isPinned}
 *   onChange={setIsPinned}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Locked while the change is saving
 * <Switch
 *   color="primary"
 *   textPlacement="right"
 *   value={isEnforced}
 *   onChange={setIsEnforced}
 *   readOnly={isSaving}
 *   readOnlyTooltip="Saving your changes"
 * >
 *   Enforce SSO
 * </Switch>
 * ```
 */
export const Switch = SwitchImpl as <T extends SwitchProps>(
	props: T &
		ValidateSwitchProps<T> &
		// `T` is inferred from the call site, so `T extends SwitchProps` alone never runs excess
		// property checks. Every key outside the props is pinned to `never` instead.
		Record<Exclude<keyof T, keyof SwitchProps | keyof RefAttributes<HTMLSpanElement>>, never> &
		RefAttributes<HTMLSpanElement>,
) => ReactElement;
