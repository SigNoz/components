import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from '@signozhq/icons';
import type { ReactElement } from 'react';
import { TabsOrientation, TabsScrollDirection } from '../constants.js';
import styles from '../tabs.module.scss';
import type { TabsOrientationType, TabsScrollDirectionType, TabsVariantType } from '../types.js';

/**
 * @access private
 */
export type TabsScrollButtonProps = {
	/**
	 * Which end of the strip this button scrolls towards.
	 */
	direction: TabsScrollDirectionType;
	/**
	 * The bar's `orientation`, which picks the arrow and what the label calls the direction.
	 */
	orientation: TabsOrientationType;
	/**
	 * The bar's `variant`, so the button can carry the secondary bar rule.
	 */
	variant: TabsVariantType;
	/**
	 * True once the strip cannot travel any further this way.
	 */
	disabled: boolean;
	/**
	 * Move the strip one step.
	 */
	onScroll: () => void;
	/**
	 * The bar's own `testId`, used to name this button when the bar names itself.
	 */
	groupTestId: string | undefined;
};

const ICONS = {
	[TabsOrientation.Horizontal]: {
		[TabsScrollDirection.Start]: ChevronLeft,
		[TabsScrollDirection.End]: ChevronRight,
	},
	[TabsOrientation.Vertical]: {
		[TabsScrollDirection.Start]: ChevronUp,
		[TabsScrollDirection.End]: ChevronDown,
	},
} as const;

const LABELS = {
	[TabsOrientation.Horizontal]: {
		[TabsScrollDirection.Start]: 'Scroll tabs left',
		[TabsScrollDirection.End]: 'Scroll tabs right',
	},
	[TabsOrientation.Vertical]: {
		[TabsScrollDirection.Start]: 'Scroll tabs up',
		[TabsScrollDirection.End]: 'Scroll tabs down',
	},
} as const;

/**
 * One of the two arrows flanking an overflowing tab strip.
 *
 * A plain `<button>` rather than our own `Button`: this is bar chrome that has to match the strip's
 * box and carry the secondary variant's rule, and `Button` brings a padding, radius, border and
 * focus ring that would all have to be overridden back off.
 *
 * It stays focusable and named. The tablist's arrow keys already reach every tab, so the button is
 * redundant for most keyboard users, but a switch device or a magnifier has no arrow keys to send
 * and a labelled button is the only thing it can drive.
 *
 * It renders as a sibling of the viewport rather than inside `Tabs.List`, which keeps `role="tab"`
 * as the only role in the tablist, and it stretches on the cross axis so the secondary bar rule
 * runs through it without a break.
 *
 * @access private
 */
export function TabsScrollButton({
	direction,
	orientation,
	variant,
	disabled,
	onScroll,
	groupTestId,
}: TabsScrollButtonProps): ReactElement {
	const Icon = ICONS[orientation][direction];
	const testId = groupTestId === undefined ? undefined : `${groupTestId}-scroll-${direction}`;

	return (
		<button
			type="button"
			data-slot="tabs-scroll-button"
			data-direction={direction}
			data-variant={variant}
			className={styles['tabs__scroll-button']}
			disabled={disabled}
			aria-label={LABELS[orientation][direction]}
			onClick={onScroll}
			{...(testId === undefined ? {} : { 'data-testid': testId })}
		>
			<Icon aria-hidden="true" focusable="false" />
		</button>
	);
}
