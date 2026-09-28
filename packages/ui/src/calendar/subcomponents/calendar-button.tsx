import { forwardRef } from 'react';
import { cn } from '../../lib/utils.js';
import styles from '../calendar.module.scss';
import type { CalendarButtonProps } from '../types.js';

/**
 * The square button the calendar's month arrows and date cells are both built from.
 *
 * It renders a native `<button>` and forwards everything it is given, so react-day-picker keeps
 * owning the click, the focus and the keyboard. Only the look is ours.
 *
 * Visual values are `--calendar-button-*` custom properties, defaults in the `css-tokens` region
 * of [../index.ts](../index.ts).
 *
 * @access private
 */
export const CalendarButton = forwardRef<HTMLButtonElement, CalendarButtonProps>(
	function CalendarButton({ className, variant, testId, ...props }, ref) {
		return (
			<button
				ref={ref}
				data-slot="calendar-button"
				data-variant={variant}
				className={cn(styles['calendar__button'], className)}
				{...props}
				type="button"
				{...(testId === undefined ? {} : { 'data-testid': testId })}
			/>
		);
	},
);
