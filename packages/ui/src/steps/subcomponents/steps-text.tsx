import { type ReactNode, useState } from 'react';
import { useIsLabelTruncated } from '../../lib/useIsLabelTruncated.js';
import { TooltipAnchor } from '../../tooltip/subcomponents/tooltip-anchor.js';

/**
 * @access private
 */
export type StepsTextProps = {
	text: string;
	slot: 'steps-label' | 'steps-description';
	className: string | undefined;
	testId: string | undefined;
};

/**
 * One line of a step, cut with `…` when it does not fit. While it is cut, a tooltip shows the full
 * text and the line is a tab stop, so the tooltip also opens from the keyboard. A line that stops
 * being cut while it has the focus stays a tab stop until it loses the focus: taking the tab stop
 * away from the focused element would drop the focus to the body.
 *
 * @access private
 */
export function StepsText({ text, slot, className, testId }: StepsTextProps): ReactNode {
	const [truncated, textRef] = useIsLabelTruncated(true);
	const [focused, setFocused] = useState(false);

	return (
		<TooltipAnchor content={truncated ? text : null}>
			<span
				ref={textRef}
				data-slot={slot}
				data-truncated={truncated || undefined}
				// oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex
				tabIndex={truncated || focused ? 0 : undefined}
				onFocus={() => setFocused(true)}
				onBlur={() => setFocused(false)}
				className={className}
				{...(testId === undefined ? {} : { 'data-testid': testId })}
			>
				{text}
			</span>
		</TooltipAnchor>
	);
}
