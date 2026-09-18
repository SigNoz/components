import { ChevronLeft, ChevronRight } from '@signozhq/icons';
import type { ReactElement } from 'react';
import { ToggleGroupScrollDirection } from '../constants.js';
import styles from '../toggle-group.module.scss';
import type { ToggleGroupScrollDirectionType } from '../types.js';

/**
 * @access private
 */
export type ToggleGroupScrollButtonProps = {
	/**
	 * Which end of the strip this button scrolls towards.
	 */
	direction: ToggleGroupScrollDirectionType;
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
	[ToggleGroupScrollDirection.Start]: ChevronLeft,
	[ToggleGroupScrollDirection.End]: ChevronRight,
} as const;

// Left and right rather than start and end: the arrow points at a side of the screen, and RTL
// flips the icon (see `.toggle-group__scroll-button`) so each label still names the side it points
// at.
const LABELS = {
	[ToggleGroupScrollDirection.Start]: 'Scroll options left',
	[ToggleGroupScrollDirection.End]: 'Scroll options right',
} as const;

/**
 * One of the two arrows flanking an overflowing bar.
 *
 * A plain `<button>` rather than our own `Button`: this is bar chrome, and `Button` brings a
 * padding, radius, border and focus ring that would all have to be overridden back off.
 *
 * It stays focusable and named. The group's arrow keys already reach every option, but a switch
 * device has no arrow keys to send and a labelled button is the only thing it can drive.
 *
 * It renders as a sibling of the viewport rather than inside the group, which keeps the group's
 * children to the options alone.
 *
 * @access private
 */
export function ToggleGroupScrollButton({
	direction,
	disabled,
	onScroll,
	groupTestId,
}: ToggleGroupScrollButtonProps): ReactElement {
	const Icon = ICONS[direction];
	const testId = groupTestId === undefined ? undefined : `${groupTestId}-scroll-${direction}`;

	return (
		<button
			type="button"
			data-slot="toggle-group-scroll-button"
			data-direction={direction}
			className={styles['toggle-group__scroll-button']}
			disabled={disabled}
			aria-label={LABELS[direction]}
			onClick={onScroll}
			{...(testId === undefined ? {} : { 'data-testid': testId })}
		>
			<Icon aria-hidden="true" focusable="false" />
		</button>
	);
}
