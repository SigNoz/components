import type { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip';
import type { ReactElement, ReactNode, RefCallback } from 'react';
import { useId, useMemo } from 'react';
import { useIsLabelTruncated } from '../../lib/useIsLabelTruncated.js';
import { hasRenderableContent } from '../../lib/utils.js';
import { Spinner } from '../../spinner/spinner.js';
import { TooltipContent } from '../../tooltip/subcomponents/tooltip-content.js';
import { TooltipProviderIfMissing } from '../../tooltip/subcomponents/tooltip-provider.js';
import { TooltipRoot } from '../../tooltip/subcomponents/tooltip-root.js';
import { TooltipStack } from '../../tooltip/subcomponents/tooltip-stack.js';
import { TooltipTrigger } from '../../tooltip/subcomponents/tooltip-trigger.js';
import {
	hasTooltipContent,
	type TooltipContentStackEntry,
} from '../../tooltip/tooltip-content-stack-context.js';
import { useTooltipHandle } from '../../tooltip/tooltip-handle.js';
import { DROPDOWN_EMPTY_LABEL } from '../constants.js';
import { useDropdownContext } from '../dropdown-context.js';
import styles from '../dropdown.module.scss';

/**
 * Which side a row's tooltip opens against: away from the menu it belongs to, so it never covers
 * the rows around it.
 *
 * @access private
 */
export type DropdownTooltipSide = 'left' | 'right';

/**
 * @access private
 */
export type DropdownRowParams = {
	label: ReactNode;
	value: string;
	testId: string | undefined;
	disabled: boolean | undefined;
	disabledTooltip: ReactNode;
	loading: boolean | undefined;
	loadingTooltip: ReactNode;
};

/**
 * @access private
 */
export type DropdownRowState = {
	/**
	 * The label, or the `<No label>` fallback when it renders nothing.
	 */
	resolvedLabel: ReactNode;
	isLabelEmpty: boolean;
	isLabelOverflowing: boolean;
	resolvedTestId: string | undefined;
	/**
	 * True while the row says it is waiting, through its own `loading` or through an async
	 * `onClick` still in flight.
	 */
	isLoading: boolean;
	/**
	 * True only for the row whose async `onClick` is in flight.
	 */
	isPending: boolean;
	/**
	 * True while the row's own `disabled` applies, which `loading` outranks.
	 */
	isDisabled: boolean;
	/**
	 * True while the row cannot be picked, for any reason including another row's pending action.
	 */
	isInert: boolean;
	tooltipContent: ReactNode;
	tooltipContentId: string;
	tooltipHandle: ReturnType<typeof TooltipPrimitive.createHandle>;
};

/**
 * The state every kind of row shares, and the ref that measures its label: the label itself, its
 * reasons, and whether the row can be picked at all.
 *
 * A hook rather than a component because each kind renders a different Base UI part around the same
 * body.
 *
 * @access private
 */
export function useDropdownRow({
	label,
	value,
	testId,
	disabled,
	disabledTooltip,
	loading,
	loadingTooltip,
}: DropdownRowParams): [DropdownRowState, RefCallback<HTMLSpanElement>] {
	const { testId: dropdownTestId, pendingValue } = useDropdownContext();
	const tooltipContentId = useId();
	const tooltipHandle = useTooltipHandle();

	const isPending = pendingValue === value;
	// `loading` outranks `disabled`, the way it does on `Button`: while the row is waiting it is
	// not disabled at all, and its reason is what the row is waiting for.
	const isLoading = loading === true || isPending;
	const isDisabled = !isLoading && disabled === true;
	// An async action holds the whole list, so a row that is neither disabled nor loading still
	// cannot be picked while another one is in flight.
	const isInert = isLoading || isDisabled || pendingValue !== null;

	const isLabelEmpty = !hasRenderableContent(label);
	const resolvedLabel = isLabelEmpty ? DROPDOWN_EMPTY_LABEL : label;

	const resolvedTestId =
		testId ?? (dropdownTestId === undefined ? undefined : `${dropdownTestId}-item-${value}`);

	// Truncation is not something a call site chooses here: every label behaves the way `ellipsis`
	// does on `RadioGroup` and `ToggleGroup`, so the row pitch stays constant.
	const [isLabelOverflowing, labelRef] = useIsLabelTruncated(true);

	const hasLoadingTooltip = isLoading && hasTooltipContent(loadingTooltip);
	const hasDisabledTooltip = isDisabled && hasTooltipContent(disabledTooltip);

	// Most general first: why the row is waiting or blocked, then what the label says in full.
	const tooltipContent = useMemo(() => {
		const entries: TooltipContentStackEntry[] = [];

		if (hasLoadingTooltip) {
			entries.push({ id: 'loading-tooltip', content: loadingTooltip });
		}

		if (hasDisabledTooltip) {
			entries.push({ id: 'disabled-tooltip', content: disabledTooltip });
		}

		if (isLabelOverflowing) {
			entries.push({ id: 'label', content: resolvedLabel });
		}

		return entries.length === 0 ? null : <TooltipStack items={entries} />;
	}, [
		hasLoadingTooltip,
		loadingTooltip,
		hasDisabledTooltip,
		disabledTooltip,
		isLabelOverflowing,
		resolvedLabel,
	]);

	// The ref travels beside the state rather than inside it. An object holding a ref is a ref as
	// far as the React Compiler is concerned, and every read off it during render is then a bailout.
	return [
		{
			resolvedLabel,
			isLabelEmpty,
			isLabelOverflowing,
			resolvedTestId,
			isLoading,
			isPending,
			isDisabled,
			isInert,
			tooltipContent,
			tooltipContentId,
			tooltipHandle,
		},
		labelRef,
	];
}

/**
 * The trigger and popup a row's tooltip needs, wrapped around whatever Base UI part the row is.
 *
 * The trigger is always mounted, so the row never remounts when a tooltip appears.
 *
 * @access private
 */
export function DropdownRowTooltip({
	row,
	side,
	children,
}: {
	row: DropdownRowState;
	side: DropdownTooltipSide;
	children: ReactElement;
}): ReactNode {
	return (
		<TooltipProviderIfMissing>
			<TooltipTrigger
				handle={row.tooltipHandle}
				contentId={row.tooltipContent === null ? undefined : row.tooltipContentId}
			>
				{children}
			</TooltipTrigger>
			{row.tooltipContent !== null && (
				<TooltipRoot handle={row.tooltipHandle}>
					<TooltipContent id={row.tooltipContentId} side={side}>
						{row.tooltipContent}
					</TooltipContent>
				</TooltipRoot>
			)}
		</TooltipProviderIfMissing>
	);
}

/**
 * The three slots a row is made of: the leading one, the measured label, and the trailing one.
 *
 * @access private
 */
export function DropdownRowBody({
	row,
	labelRef,
	prefix,
	suffix,
}: {
	row: DropdownRowState;
	labelRef: RefCallback<HTMLSpanElement>;
	prefix?: ReactNode;
	suffix?: ReactNode;
}): ReactNode {
	return (
		<>
			{(row.isLoading || prefix !== undefined) && (
				<span data-slot="dropdown-item-prefix" className={styles['dropdown__item-affix']}>
					{row.isLoading ? <Spinner /> : prefix}
				</span>
			)}
			<span
				ref={labelRef}
				data-slot="dropdown-item-label"
				data-truncated={row.isLabelOverflowing || undefined}
				data-empty-label={row.isLabelEmpty || undefined}
				className={styles['dropdown__item-label']}
			>
				{row.resolvedLabel}
			</span>
			{suffix !== undefined && (
				<span data-slot="dropdown-item-suffix" className={styles['dropdown__item-affix']}>
					{suffix}
				</span>
			)}
		</>
	);
}
