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
import { hasRenderableContent, type RejectedProps } from '../lib/utils.js';
import { TooltipProviderIfMissing } from '../tooltip/subcomponents/tooltip-provider.js';
import styles from './button-group.module.scss';
import {
	BUTTON_GROUP_ITEMS_KEY_SEPARATOR,
	ButtonGroupJoin,
	ButtonGroupPosition,
	ButtonGroupTextOverflow,
} from './constants.js';
import { ButtonGroupItem } from './subcomponents/button-group-item.js';
import { ButtonGroupMember } from './subcomponents/button-group-member.js';
import { ButtonGroupOverflow } from './subcomponents/button-group-overflow.js';
import type {
	ButtonGroupProps,
	ButtonGroupState,
	ButtonGroupVariantColorType,
	ValidateButtonGroupProps,
} from './types.js';
import { useButtonGroupOverflow } from './use-button-group-overflow.js';
import { getJoin, getMemberJoins, getPosition, resolveItem } from './utils.js';

const ButtonGroupImpl = forwardRef<HTMLDivElement, ButtonGroupProps>(function ButtonGroup(
	{
		variant,
		color,
		noLoadingEffect,
		size,
		items,
		prefix,
		suffix,
		disabled = false,
		disabledTooltip,
		loading = false,
		loadingTooltip,
		width,
		maxWidth,
		textOverflow = ButtonGroupTextOverflow.Ellipsis,
		testId,
		children: _children,
		className: _className,
		style: _style,
		...props
	}: ButtonGroupProps & RejectedProps,
	ref,
) {
	// Destructuring the union loses the pairing of `variant` and `color`, the props still had it.
	const look = {
		variant,
		color,
		...(noLoadingEffect === undefined ? {} : { noLoadingEffect }),
	} as ButtonGroupVariantColorType;
	const group: ButtonGroupState = {
		testId,
		look,
		size,
		textOverflow,
		disabled,
		disabledTooltip,
		loading,
		loadingTooltip,
	};
	const resolved = items.map((item) => resolveItem(item, group));
	const slots = { prefix: hasRenderableContent(prefix), suffix: hasRenderableContent(suffix) };
	// The slots are in the key so the group observes one as soon as it appears.
	const itemsKey = [
		variant,
		slots.prefix,
		slots.suffix,
		...resolved.map(
			(entry) => `${entry.item.value}${BUTTON_GROUP_ITEMS_KEY_SEPARATOR}${entry.look.variant}`,
		),
	].join(BUTTON_GROUP_ITEMS_KEY_SEPARATOR);

	const { visibleCount, fullWidth, rootRef } = useButtonGroupOverflow(items.length, itemsKey);
	// `rootRef` is stable, so a new consumer ref reattaches the refs without restarting the observer.
	const mergedRef = useMemo(() => mergeRefs(ref, rootRef), [ref, rootRef]);

	const collapsed = resolved.slice(visibleCount);
	const hasOverflow = collapsed.length > 0;
	const segmentCount = visibleCount + (hasOverflow ? 1 : 0);
	const joins = getMemberJoins(resolved, visibleCount, variant, slots);

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
			{...props}
			{...(testId === undefined ? {} : { 'data-testid': testId })}
		>
			<TooltipProviderIfMissing>
				<div data-slot="button-group-row" className={styles['button-group__row']}>
					{slots.prefix && (
						<div
							data-slot="button-group-prefix"
							data-join-end={joins.prefix}
							className={styles['button-group__prefix']}
							{...(testId === undefined ? {} : { 'data-testid': `${testId}-prefix` })}
						>
							{prefix}
						</div>
					)}
					{joins.members.map((member, index) => (
						<ButtonGroupItem
							key={member.resolved.item.value}
							resolved={member.resolved}
							size={size}
							position={getPosition(index, index < visibleCount ? segmentCount : resolved.length)}
							joinStart={member.start}
							joinEnd={member.end}
							overflowJoin={member.overflow}
							suffixJoin={member.suffix}
							textOverflow={member.resolved.item.textOverflow ?? textOverflow}
							collapsed={index >= visibleCount}
						/>
					))}
					{hasOverflow && (
						<ButtonGroupOverflow
							collapsed={collapsed}
							group={group}
							position={getPosition(segmentCount - 1, segmentCount)}
							joinStart={joins.overflow}
							joinEnd={joins.overflowEnd}
						/>
					)}
					{slots.suffix && (
						<div
							data-slot="button-group-suffix"
							data-join-start={joins.suffix}
							className={styles['button-group__suffix']}
							{...(testId === undefined ? {} : { 'data-testid': `${testId}-suffix` })}
						>
							{suffix}
						</div>
					)}
				</div>
			</TooltipProviderIfMissing>
			{/* Keeps the group's intrinsic width at the full set, and measures the ellipsis and the
			    margin of every join before they render. */}
			<div
				aria-hidden="true"
				data-slot="button-group-measure"
				className={styles['button-group__measure']}
				style={fullWidth === undefined ? undefined : { inlineSize: fullWidth }}
			>
				<span
					data-slot="button-group-measure-overflow"
					data-suffix-join={slots.suffix ? getJoin(variant, variant) : undefined}
					className={styles['button-group__measure-overflow']}
				>
					<ButtonGroupMember
						icon
						look={look}
						size={size}
						position={ButtonGroupPosition.End}
						joinStart={undefined}
						joinEnd={undefined}
						textOverflow={textOverflow}
						disabled={false}
						loading={false}
						tooltipEntries={[]}
						buttonProps={{ tabIndex: -1 }}
					>
						<Ellipsis />
					</ButtonGroupMember>
				</span>
				{Object.values(ButtonGroupJoin).map((join) => (
					<span
						key={join}
						data-slot="button-group-measure-join"
						data-join-start={join}
						className={styles['button-group__join-probe']}
					/>
				))}
			</div>
		</div>
	);
});

/**
 * A row of related actions. Renders `<div role="group">` and one `Button` per entry of `items`, in
 * the group's `variant` and `color` or in the pair an item sets for itself.
 *
 * Every member is an action: a group has no selected member. For a persistent view state with one
 * selected, use `ToggleGroup`.
 *
 * A member looks and behaves like the `Button` it is, so its look comes from the `--button-*`
 * custom properties. The layout values are `--button-group-*` custom properties, defaults in the
 * `css-tokens` region of [./index.ts](./index.ts).
 *
 * ### How members meet
 *
 * Decided per pair of neighbours from their two variants:
 *
 * - `outlined` or `dashed` next to `outlined` or `dashed`: one shared hairline, square corners.
 * - `solid` next to `solid`, `outlined` or `dashed`: a 1px seam, square corners.
 * - `ghost` next to anything but a `link`: 4px apart, each keeps its own corners.
 * - `link` next to anything: 8px apart, each keeps its own corners.
 *
 * ### Overflow
 *
 * Capped at `maxWidth` (`100%` by default). Members that do not fit collapse from the end into a
 * `Dropdown` behind an ellipsis member in the group's variant and colour, labelled
 * `Show N more options`, right-aligned to it. The menu lists exactly the collapsed members, label
 * only, a `danger` or `highlight-danger` member as a danger row. The ellipsis is never rendered when
 * nothing is collapsed.
 *
 * A collapsed member stays mounted, out of the flow and invisible, so the thresholds are read off
 * the members as they render, re-measured on resize and whenever a member changes size.
 *
 * ### Menus
 *
 * A member with `menu` opens a `Dropdown` of those rows instead of running a handler, the chevron
 * of a split button for instance. The menu does not open while the member is blocked, and a
 * collapsed member becomes a submenu row of the overflow menu.
 *
 * ### Prefix and suffix
 *
 * `prefix` and `suffix` put your own content inside the group, before the first member and after
 * the ellipsis, a select or an inline editor for instance. They never collapse: the members make
 * room for them. They meet their neighbour as a member in the group's `variant` would, so the
 * corners between them square off in an `outlined`, `dashed` or `solid` group, but the content's
 * own corners and border are yours to style. `disabled` and `loading` do not reach them.
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
 * | `data-variant`, `data-color` | member | the member's own pair, or the group's |
 * | `data-position` | member | `only`, `start`, `middle` or `end` |
 * | `data-join-start`, `data-join-end` | member | `shared`, `seam`, `gap` or `wide-gap`, absent at the ends of the row |
 * | `data-icon` | member | `"true"` for an icon member and the ellipsis |
 * | `data-truncated` | member | present only while the label does not fit |
 * | `data-overflow` | member | `"true"` on the ellipsis |
 * | `data-slot` | slot | `"button-group-prefix"` or `"button-group-suffix"` |
 * | `data-join-end`, `data-join-start` | prefix, suffix | how the slot meets the segment next to it |
 *
 * With a `testId`, a member is `` `${testId}-item-${value}` `` whether it is visible or in the
 * overflow menu, the ellipsis is `` `${testId}-overflow` ``, and the slots are
 * `` `${testId}-prefix` `` and `` `${testId}-suffix` ``.
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
 *     { value: 'previous', icon: <ChevronLeft />, 'aria-label': 'Previous page', onClick: previous },
 *     { value: 'next', icon: <ChevronRight />, 'aria-label': 'Next page', onClick: next },
 *     { value: 'docs', label: 'Docs', render: <a href="/docs" /> },
 *   ]}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // A member in its own pair, and every `Button` prop on an item
 * <ButtonGroup
 *   variant="outlined"
 *   color="secondary"
 *   size="md"
 *   items={[
 *     { value: 'edit', label: 'Edit', onClick: edit, onDoubleClick: editInline },
 *     { value: 'delete', label: 'Delete', variant: 'solid', color: 'danger', onClick: remove },
 *   ]}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // A split button: an action and a member that opens a menu
 * <ButtonGroup
 *   variant="solid"
 *   color="primary"
 *   size="md"
 *   items={[
 *     { value: 'add', label: 'Add panel', onClick: add },
 *     {
 *       value: 'section',
 *       icon: <ChevronUp />,
 *       'aria-label': 'Choose section',
 *       menu: { side: 'top', align: 'end', items: sectionRows },
 *     },
 *   ]}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Your own content at the end of the group
 * <ButtonGroup
 *   variant="outlined"
 *   color="secondary"
 *   size="sm"
 *   items={actions}
 *   suffix={<DataSourceSelect value={source} onChange={setSource} />}
 * />
 * ```
 */
export const ButtonGroup = ButtonGroupImpl as <T extends ButtonGroupProps>(
	props: T &
		ValidateButtonGroupProps<T> &
		Record<Exclude<keyof T, keyof ButtonGroupProps | keyof RefAttributes<HTMLDivElement>>, never> &
		RefAttributes<HTMLDivElement>,
) => ReactElement;
