import { forwardRef, type ReactNode } from 'react';
import { partTestId, type RejectedProps } from '../../lib/utils.js';
import styles from '../callout.module.scss';
import { ALERT_COLORS } from '../constants.js';
import type { CalloutProps } from '../types.js';
import { calloutSizeStyle } from '../utils.js';

/**
 * @access private
 */
export type CalloutFrameProps = CalloutProps &
	RejectedProps & {
		/**
		 * The title row of `Callout.Expandable`. A callout with a title row is not a live region, see
		 * `liveRole`.
		 */
		header?: ReactNode;
		/**
		 * The close button of `Callout.Closeable`, after the content on the right edge.
		 */
		trailing?: ReactNode;
		expanded?: boolean;
		/**
		 * The `id` of the description, which the title row points `aria-controls` at.
		 */
		descriptionId?: string;
		/**
		 * Hides the description while keeping it mounted, so `aria-controls` has a target.
		 */
		descriptionHidden?: boolean;
	};

/**
 * Shared rendering for every callout: the root with its slots, the icon, the description and the
 * live region role. Reach it through `Callout` and its sub-components.
 *
 * @access private
 */
export const CalloutFrame = forwardRef<HTMLDivElement, CalloutFrameProps>(function CalloutFrame(
	{
		color,
		size,
		icon,
		children,
		width,
		maxWidth,
		height,
		maxHeight,
		testId,
		header,
		trailing,
		expanded,
		descriptionId,
		descriptionHidden,
		className: _className,
		style: _style,
		...props
	},
	ref,
) {
	// A live region reads its whole content again on every change. Expanding `Callout.Expandable`
	// shows the description, which counts as a change, so the user who just pressed the title row
	// would hear the whole callout again, interrupted by `alert`. The user opens it on purpose, so
	// it gets no live role.
	const liveRole =
		header === undefined ? (ALERT_COLORS.has(color) ? 'alert' : 'status') : undefined;

	return (
		<div
			{...props}
			ref={ref}
			data-slot="callout"
			data-color={color}
			data-size={size}
			data-has-title={header !== undefined || undefined}
			data-expanded={expanded || undefined}
			role={liveRole}
			className={styles['callout']}
			style={calloutSizeStyle({ width, maxWidth, height, maxHeight })}
			{...(testId === undefined ? {} : { 'data-testid': testId })}
		>
			<span
				data-slot="callout-icon"
				className={styles['callout__icon']}
				aria-hidden="true"
				data-testid={partTestId(testId, 'icon')}
			>
				{icon}
			</span>
			<div className={styles['callout__content']}>
				{header}
				<div
					id={descriptionId}
					data-slot="callout-description"
					className={styles['callout__description']}
					hidden={descriptionHidden}
					data-testid={partTestId(testId, 'description')}
				>
					{children}
				</div>
			</div>
			{trailing}
		</div>
	);
});
