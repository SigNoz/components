import { ChevronLeft, ChevronRight } from '@signozhq/icons';
import type { ReactElement } from 'react';
import { TabsScrollDirection } from '../constants.js';
import styles from '../tabs.module.scss';
import type { TabsScrollDirectionType, TabsVariantType } from '../types.js';

/**
 * @access private
 */
export type TabsScrollButtonProps = {
	/**
	 * Which end of the strip this button scrolls towards.
	 */
	direction: TabsScrollDirectionType;
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
	[TabsScrollDirection.Start]: ChevronLeft,
	[TabsScrollDirection.End]: ChevronRight,
} as const;

// Left and right rather than start and end: the arrow points at a side of the screen, and RTL
// flips the icon (see `.tabs__scroll-button`) so each label still names the side it points at.
const LABELS = {
	[TabsScrollDirection.Start]: 'Scroll tabs left',
	[TabsScrollDirection.End]: 'Scroll tabs right',
} as const;

/**
 * One of the two arrows flanking an overflowing tab strip.
 *
 * A plain `<button>` rather than our own `Button`: this is bar chrome, and `Button` brings a
 * padding, radius, border and focus ring that would all have to be overridden back off.
 *
 * It stays focusable and named. The tablist's arrow keys already reach every tab, but a switch
 * device has no arrow keys to send and a labelled button is the only thing it can drive.
 *
 * It renders as a sibling of the viewport rather than inside `Tabs.List`, which keeps `role="tab"`
 * the only role in the tablist, and it stretches on the cross axis so the secondary bar rule runs
 * through it unbroken.
 *
 * @access private
 */
export function TabsScrollButton({
	direction,
	variant,
	disabled,
	onScroll,
	groupTestId,
}: TabsScrollButtonProps): ReactElement {
	const Icon = ICONS[direction];
	const testId = groupTestId === undefined ? undefined : `${groupTestId}-scroll-${direction}`;

	return (
		<button
			type="button"
			data-slot="tabs-scroll-button"
			data-direction={direction}
			data-variant={variant}
			className={styles['tabs__scroll-button']}
			disabled={disabled}
			aria-label={LABELS[direction]}
			onClick={onScroll}
			{...(testId === undefined ? {} : { 'data-testid': testId })}
		>
			<Icon aria-hidden="true" focusable="false" />
		</button>
	);
}
