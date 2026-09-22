import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from '@signozhq/icons';
import type { ReactElement } from 'react';
import { cn } from '../../lib/utils.js';
import styles from '../calendar.module.scss';
import type { CalendarChevronProps } from '../types.js';

/**
 * The arrow icon inside a month button, and the marker at the end of a caption dropdown.
 *
 * react-day-picker asks for one of four orientations. `left` and `right` are the month arrows,
 * `down` is the dropdown marker, and `up` is only drawn by a custom component. With no orientation
 * it points left, as upstream's does.
 *
 * `size` is a fallback: the stylesheet sizes both kinds of chevron, and a CSS width beats the
 * attribute. `disabled` is dropped, because the arrow it describes already carries `aria-disabled`
 * and an `<svg>` has no such attribute.
 *
 * @access private
 */
export function CalendarChevron({
	className,
	orientation,
	size,
}: CalendarChevronProps): ReactElement {
	const iconProps = {
		className: cn(styles['calendar__chevron'], className),
		...(size === undefined ? {} : { width: size, height: size }),
	};

	if (orientation === 'right') {
		return <ChevronRight {...iconProps} />;
	}

	if (orientation === 'up') {
		return <ChevronUp {...iconProps} />;
	}

	if (orientation === 'down') {
		return <ChevronDown {...iconProps} />;
	}

	return <ChevronLeft {...iconProps} />;
}
