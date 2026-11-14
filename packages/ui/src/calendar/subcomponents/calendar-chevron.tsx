import { ChevronDown, ChevronLeft, ChevronRight } from '@signozhq/icons';
import type { ReactElement } from 'react';
import styles from '../calendar.module.scss';

/**
 * The arrow icon inside a month button, and the marker at the end of a caption dropdown.
 *
 * `left` and `right` are the month arrows and `down` is the dropdown marker.
 *
 * `size` is a fallback: the stylesheet sizes both kinds of chevron, and a CSS width beats the
 * attribute.
 *
 * @access private
 */
export function CalendarChevron({
	orientation,
	size,
}: {
	orientation: 'left' | 'right' | 'down';
	size?: number;
}): ReactElement {
	const iconProps = {
		className: styles['calendar__chevron'],
		...(size === undefined ? {} : { width: size, height: size }),
	};

	if (orientation === 'right') {
		return <ChevronRight {...iconProps} />;
	}

	if (orientation === 'down') {
		return <ChevronDown {...iconProps} />;
	}

	return <ChevronLeft {...iconProps} />;
}
