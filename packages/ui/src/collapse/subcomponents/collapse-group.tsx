import { Accordion } from '@base-ui/react/accordion';
import { forwardRef, useEffect, useMemo } from 'react';
import { uniqueByValue } from '../../lib/unique-by-value.js';
import { partTestId, type RejectedProps } from '../../lib/utils.js';
import styles from '../collapse.module.scss';
import { COLLAPSE_GROUP_MAX_REGIONS, CollapseTextOverflow } from '../constants.js';
import type { CollapseGroupProps } from '../types.js';
import { useCollapseState } from '../use-collapse-state.js';
import { orderGroupValue } from '../utils.js';
import { CollapseGroupItem } from './collapse-group-item.js';

const EMPTY_VALUE: readonly string[] = [];

/**
 * A list of sections that open and close on their own, built on the Base UI accordion with several
 * items open at once. Reached as `Collapse.Group`, not imported on its own.
 *
 * Every item has the header, the panel, the keys and the mounting rules of a `Collapse`. `variant`,
 * `size`, `keepMounted`, `noContentPadding`, `textOverflow` and `headingLevel` apply to every item.
 * `id`, `ref`, every `aria-*` and any `data-*` land on the root of the group, and the header
 * buttons are named by their titles.
 *
 * ### Layout
 *
 * The items stack in the order of `items`. `outlined` draws one box around the group with a
 * divider between items. `ghost` stacks them with no box.
 *
 * ### Accessibility
 *
 * The accordion pattern. Every header button is its own tab stop, in the order of `items`, and the
 * arrow keys do nothing. Past 6 items, the panels leave out `role="region"`, since many regions
 * crowd the landmark list.
 *
 * ### Asserting on it
 *
 * `testId` lands on the root of the group as `data-testid`, and each item is
 * `{testId}-item-{value}` unless it has a `testId` of its own. The parts of an item take the
 * `data-testid` and the `data-slot` of the same part of a `Collapse`, under the item's test ID.
 *
 * | `data-slot` | rendered |
 * |---|---|
 * | `collapse-group` | the root, carries `testId`, `data-variant`, `data-size` and `data-text-overflow` |
 * | `collapse-group-item` | each item, `data-expanded` only while open |
 *
 * @example
 * ```tsx
 * <Collapse.Group
 *   variant="outlined"
 *   size="sm"
 *   textOverflow="wrap"
 *   defaultValue={['what']}
 *   items={[
 *     { value: 'what', title: 'What is SigNoz?', children: <p>An observability platform.</p> },
 *     { value: 'cost', title: 'How much does it cost?', children: <p>See the pricing page.</p> },
 *   ]}
 * />
 * ```
 */
export const CollapseGroup = forwardRef<HTMLDivElement, CollapseGroupProps>(function CollapseGroup(
	{
		testId,
		variant,
		size,
		keepMounted = false,
		noContentPadding = false,
		textOverflow = CollapseTextOverflow.Ellipsis,
		headingLevel,
		items,
		value,
		defaultValue,
		onChange,
		className: _className,
		style: _style,
		...rest
	}: CollapseGroupProps & RejectedProps,
	ref,
) {
	const [openValues, setOpenValues] = useCollapseState<readonly string[]>({
		component: 'Collapse.Group',
		prop: 'value',
		value,
		defaultValue,
		empty: EMPTY_VALUE,
	});

	const uniqueItems = useMemo(() => uniqueByValue(items), [items]);

	const hasDuplicateValue = uniqueItems.length < items.length;

	useEffect(() => {
		if (hasDuplicateValue) {
			console.warn('Collapse.Group: two items share a `value`, so only the first of them renders.');
		}
	}, [hasDuplicateValue]);

	const itemValues = useMemo(() => uniqueItems.map((item) => item.value), [uniqueItems]);
	const isRegion = uniqueItems.length <= COLLAPSE_GROUP_MAX_REGIONS;

	return (
		<Accordion.Root
			{...rest}
			ref={ref}
			multiple
			value={[...openValues]}
			onValueChange={(next: string[]) => {
				const ordered = orderGroupValue(itemValues, next);

				setOpenValues(ordered);
				onChange?.(ordered);
			}}
			hiddenUntilFound={keepMounted}
			data-slot="collapse-group"
			data-testid={testId}
			data-variant={variant}
			data-size={size}
			data-text-overflow={textOverflow}
			className={styles['collapse-group']}
		>
			{uniqueItems.map((item) => (
				<CollapseGroupItem
					key={item.value}
					item={item}
					open={openValues.includes(item.value)}
					testId={item.testId ?? partTestId(testId, `item-${item.value}`)}
					keepMounted={keepMounted}
					noContentPadding={noContentPadding}
					textOverflow={textOverflow}
					headingLevel={headingLevel}
					isRegion={isRegion}
				/>
			))}
		</Accordion.Root>
	);
});
CollapseGroup.displayName = 'Collapse.Group';
