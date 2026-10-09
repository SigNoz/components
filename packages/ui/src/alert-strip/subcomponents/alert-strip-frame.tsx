import { forwardRef, type ReactElement, type ReactNode } from 'react';
import { hasRenderableContent, partTestId, type RejectedProps } from '../../lib/utils.js';
import styles from '../alert-strip.module.scss';
import { ALERT_COLORS } from '../constants.js';
import type { AlertStripProps } from '../types.js';

/**
 * @access private
 */
export type AlertStripFrameProps = AlertStripProps &
	RejectedProps & {
		/**
		 * The close button of `AlertStrip.Closeable`, after the suffix at the end of the region.
		 */
		trailing?: ReactNode;
	};

/**
 * The dots of one tapered end of the region, drawn after Figma, on the slant next to the content.
 * The region paints the slant. The end after the content is the same drawing, mirrored.
 */
function AlertStripEnd(): ReactElement {
	return (
		<span className={styles['alert-strip__end']} aria-hidden="true">
			<svg className={styles['alert-strip__dots']} viewBox="31 7 18 18">
				<circle cx="47" cy="9" r="2" />
				<circle cx="40" cy="16" r="2" />
				<circle cx="47" cy="16" r="2" />
				<circle cx="33" cy="23" r="2" />
				<circle cx="40" cy="23" r="2" />
				<circle cx="47" cy="23" r="2" />
			</svg>
		</span>
	);
}

/**
 * Shared rendering for every strip: the root with its slots, the bar, the tapered region, the
 * content and the live region role. Reach it through `AlertStrip` and its sub-components.
 *
 * @access private
 */
export const AlertStripFrame = forwardRef<HTMLDivElement, AlertStripFrameProps>(
	function AlertStripFrame(
		{
			color,
			side,
			children,
			prefix,
			suffix,
			testId,
			trailing,
			className: _className,
			style: _style,
			...props
		},
		ref,
	) {
		return (
			<div
				{...props}
				ref={ref}
				data-slot="alert-strip"
				data-color={color}
				data-side={side}
				role={ALERT_COLORS.has(color) ? 'alert' : 'status'}
				className={styles['alert-strip']}
				{...(testId === undefined ? {} : { 'data-testid': testId })}
			>
				<div className={styles['alert-strip__region']}>
					<AlertStripEnd />
					<div className={styles['alert-strip__body']}>
						{hasRenderableContent(prefix) && (
							<div
								data-slot="alert-strip-prefix"
								className={styles['alert-strip__prefix']}
								data-testid={partTestId(testId, 'prefix')}
							>
								{prefix}
							</div>
						)}
						<div
							data-slot="alert-strip-content"
							className={styles['alert-strip__content']}
							data-testid={partTestId(testId, 'content')}
						>
							{children}
						</div>
						{hasRenderableContent(suffix) && (
							<div
								data-slot="alert-strip-suffix"
								className={styles['alert-strip__suffix']}
								data-testid={partTestId(testId, 'suffix')}
							>
								{suffix}
							</div>
						)}
						{trailing}
					</div>
					<AlertStripEnd />
				</div>
			</div>
		);
	},
);
