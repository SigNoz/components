import * as React from 'react';
import styles from './tooltip.module.scss';

/**
 * The props a tooltip trigger reads from, and adds to, its child element.
 *
 * @access private
 */
export type TooltipTriggerChildProps = {
	id?: string;
	className?: string;
	'aria-describedby'?: string;
	'data-slot'?: string;
	onPointerEnter?: React.PointerEventHandler<HTMLElement>;
	onPointerMove?: React.PointerEventHandler<HTMLElement>;
	onPointerDown?: React.PointerEventHandler<HTMLElement>;
	onMouseEnter?: React.MouseEventHandler<HTMLElement>;
	onMouseMove?: React.MouseEventHandler<HTMLElement>;
	onMouseLeave?: React.MouseEventHandler<HTMLElement>;
	onFocus?: React.FocusEventHandler<HTMLElement>;
	onBlur?: React.FocusEventHandler<HTMLElement>;
};

/**
 * The child as the trigger element: an element as it is, anything else inside a `<button>`.
 *
 * @access private
 */
export function toTooltipTriggerElement(
	children: React.ReactNode,
): React.ReactElement<TooltipTriggerChildProps> {
	if (React.isValidElement<TooltipTriggerChildProps>(children)) {
		return children;
	}

	return (
		<button type="button" data-slot="tooltip-trigger" className={styles['tooltip__trigger']}>
			{children}
		</button>
	);
}
