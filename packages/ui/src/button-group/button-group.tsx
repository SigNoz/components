import { Ellipsis } from '@signozhq/icons';
import {
	type CSSProperties,
	forwardRef,
	type ReactElement,
	type RefAttributes,
	useMemo,
} from 'react';
import { toCssLength } from '../lib/css-length.js';
import { mergeRefs } from '../lib/merge-refs.js';
import { cn, omitStyleProps } from '../lib/utils.js';
import { TooltipProviderIfMissing } from '../tooltip/subcomponents/tooltip-provider.js';
import styles from './button-group.module.scss';
import {
	BUTTON_GROUP_ITEMS_KEY_SEPARATOR,
	ButtonGroupPosition,
	ButtonGroupTextOverflow,
} from './constants.js';
import { ButtonGroupItem } from './subcomponents/button-group-item.js';
import { ButtonGroupMemberContent } from './subcomponents/button-group-member-content.js';
import { ButtonGroupOverflow } from './subcomponents/button-group-overflow.js';
import type { ButtonGroupProps, ButtonGroupState, ValidateButtonGroupProps } from './types.js';
import { useButtonGroupOverflow } from './use-button-group-overflow.js';
import { getPosition, resolveItem } from './utils.js';

const ButtonGroupImpl = forwardRef<HTMLDivElement, ButtonGroupProps>(function ButtonGroup(
	{
		variant,
		color,
		size,
		items,
		disabled = false,
		disabledTooltip,
		loading = false,
		loadingTooltip,
		width,
		maxWidth,
		textOverflow = ButtonGroupTextOverflow.Ellipsis,
		testId,
		children: _children,
		...props
	},
	ref,
) {
	const group: ButtonGroupState = { testId, disabled, disabledTooltip, loading, loadingTooltip };
	const resolved = items.map((item) => resolveItem(item, group));
	const itemsKey = items.map((item) => item.value).join(BUTTON_GROUP_ITEMS_KEY_SEPARATOR);

	const { visibleCount, fullWidth, rootRef } = useButtonGroupOverflow(items.length, itemsKey);
	// `rootRef` is stable, so a new consumer ref reattaches the refs without restarting the observer.
	const mergedRef = useMemo(() => mergeRefs(ref, rootRef), [ref, rootRef]);

	const collapsed = resolved.slice(visibleCount);
	const hasOverflow = collapsed.length > 0;
	const segmentCount = visibleCount + (hasOverflow ? 1 : 0);

	const groupStyle = {
		...(width != null && { '--button-group-internal-width': toCssLength(width) }),
		...(maxWidth != null && { '--button-group-internal-max-width': toCssLength(maxWidth) }),
	} as CSSProperties;

	return (
		<div
			ref={mergedRef}
			// eslint-disable-next-line jsx-a11y/prefer-tag-over-role -- <div role="group"> is the standard group pattern, fieldset and friends carry form semantics a row of actions does not have.
			role="group"
			data-slot="button-group"
			data-variant={variant}
			data-color={color}
			data-size={size}
			data-text-overflow={textOverflow}
			data-disabled={disabled || undefined}
			data-loading={loading || undefined}
			data-overflowing={hasOverflow || undefined}
			className={styles['button-group']}
			style={groupStyle}
			{...omitStyleProps(props)}
			{...(testId === undefined ? {} : { 'data-testid': testId })}
		>
			<TooltipProviderIfMissing>
				<div data-slot="button-group-row" className={styles['button-group__row']}>
					{resolved.map((entry, index) => (
						<ButtonGroupItem
							key={entry.item.value}
							resolved={entry}
							position={getPosition(index, index < visibleCount ? segmentCount : resolved.length)}
							textOverflow={textOverflow}
							collapsed={index >= visibleCount}
						/>
					))}
					{hasOverflow && (
						<ButtonGroupOverflow
							collapsed={collapsed}
							group={group}
							textOverflow={textOverflow}
							position={getPosition(segmentCount - 1, segmentCount)}
						/>
					)}
				</div>
			</TooltipProviderIfMissing>
			{/* Keeps the group's intrinsic width at the full set, and measures the ellipsis before it
			    renders. */}
			<div
				aria-hidden="true"
				data-slot="button-group-measure"
				className={styles['button-group__measure']}
				style={fullWidth === undefined ? undefined : { inlineSize: fullWidth }}
			>
				<span
					data-slot="button-group-measure-overflow"
					data-position={ButtonGroupPosition.End}
					data-icon="true"
					className={cn(styles['button-group__item'], styles['button-group__measure-overflow'])}
				>
					<ButtonGroupMemberContent icon={<Ellipsis />} />
				</span>
			</div>
		</div>
	);
});

/**
 * A cluster of adjacent actions that reads as one control. Renders `<div role="group">` and one Base
 * UI `Button` per entry of `items`, sharing a single hairline between neighbours, with only the
 * outer corners rounded.
 *
 * Every member is an action: a group has no selected member. For a persistent view state with one
 * selected, use `ToggleGroup`.
 *
 * Visual values are `--button-group-*` custom properties, defaults in the `css-tokens` region of
 * [./index.ts](./index.ts). Colours come from the `--button-group-*` semantic tokens in
 * `@signozhq/design-tokens`.
 *
 * ### Overflow
 *
 * Capped at `maxWidth` (`100%` by default). Members that do not fit collapse from the end into a
 * `Dropdown` behind an ellipsis member, labelled `Show N more options`, right-aligned to it. The menu
 * lists exactly the collapsed members, label only. The ellipsis is never rendered when nothing is
 * collapsed.
 *
 * A collapsed member stays mounted, out of the flow and invisible, so the thresholds are read off
 * the members as they render, re-measured on resize and whenever a member changes size.
 *
 * ### Disabled and loading
 *
 * Both reach every member as `aria-disabled`, never the native `disabled` attribute, so members stay
 * tabbable and their tooltips stay reachable. `onClick` does not fire. Hover and focus events do.
 *
 * `loading` also adds `aria-busy` and cross-fades a spinner over each prefix. It suppresses every
 * disabled reason, the group's and the members' own.
 *
 * Tooltips stack most general first: the group's reason, the member's own reason, then the full
 * label while it is truncated.
 *
 * ### Asserting on it
 *
 * | attribute | on | value |
 * |---|---|---|
 * | `data-slot` | root | `"button-group"` |
 * | `data-variant`, `data-color`, `data-size`, `data-text-overflow` | root | mirrors the prop |
 * | `data-disabled`, `data-loading` | root | present while the prop is true |
 * | `data-overflowing` | root | present while at least one member is collapsed |
 * | `data-slot` | member | `"button-group-item"` |
 * | `data-position` | member | `only`, `start`, `middle` or `end` |
 * | `data-icon` | member | `"true"` for an icon member and the ellipsis |
 * | `data-truncated` | member | present only while the label does not fit |
 * | `data-overflow` | member | `"true"` on the ellipsis |
 *
 * With a `testId`, a member is `` `${testId}-item-${value}` `` whether it is visible or in the
 * overflow menu, and the ellipsis is `` `${testId}-overflow` ``.
 *
 * @example
 * ```tsx
 * <ButtonGroup
 *   variant="outlined"
 *   color="secondary"
 *   size="md"
 *   items={[
 *     { value: 'day', label: 'Day', onClick: () => setRange('day') },
 *     { value: 'week', label: 'Week', onClick: () => setRange('week') },
 *     { value: 'month', label: 'Month', onClick: () => setRange('month') },
 *   ]}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Icon members need an accessible name, links render the element you pass
 * <ButtonGroup
 *   variant="outlined"
 *   color="secondary"
 *   size="sm"
 *   items={[
 *     { value: 'previous', icon: <ChevronLeft />, ariaLabel: 'Previous page', onClick: previous },
 *     { value: 'next', icon: <ChevronRight />, ariaLabel: 'Next page', onClick: next },
 *     { value: 'docs', label: 'Docs', render: <a href="/docs" /> },
 *   ]}
 * />
 * ```
 */
export const ButtonGroup = ButtonGroupImpl as <T extends ButtonGroupProps>(
	props: T &
		ValidateButtonGroupProps<T> &
		Record<Exclude<keyof T, keyof ButtonGroupProps | keyof RefAttributes<HTMLDivElement>>, never> &
		RefAttributes<HTMLDivElement>,
) => ReactElement;
