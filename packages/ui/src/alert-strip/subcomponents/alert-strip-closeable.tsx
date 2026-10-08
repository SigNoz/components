import { X } from '@signozhq/icons';
import { forwardRef, type RefObject } from 'react';
import { closeAndMoveFocus } from '../../lib/close-and-move-focus.js';
import { hasRenderableContent, partTestId } from '../../lib/utils.js';
import styles from '../alert-strip.module.scss';
import type { AlertStripProps } from '../types.js';
import { AlertStripFrame } from './alert-strip-frame.js';

export type AlertStripCloseableProps = AlertStripProps & {
	/**
	 * Whether the strip is closed. It renders nothing while `true`.
	 */
	closed: boolean;
	/**
	 * Runs when the user clicks the close button.
	 */
	onClose: () => void;
	/**
	 * The element that takes focus once `onClose` closes the strip, such as the main content or the
	 * next control in the flow. Without it, focus is not moved and falls to the page body with the
	 * close button.
	 *
	 * @note Focus that `onClose` moves is left where it was put.
	 *
	 * @note Only focus that was in the strip moves. A mouse click that does not focus the close
	 * button, as in Safari, moves none.
	 */
	finalFocus?: RefObject<HTMLElement | null>;
	/**
	 * The accessible name of the close button. Worth setting when several closeable strips sit on
	 * one page, so a screen reader user can tell their buttons apart, and to translate it.
	 *
	 * @default 'Dismiss'
	 */
	closeAriaLabel?: string;
};

/**
 * An `AlertStrip` with a close button at the end of the region, after the content and the
 * `suffix`. Reached as `AlertStrip.Closeable`, not imported on its own.
 *
 * It keeps no state: it renders nothing while `closed` is `true`, and the close button calls
 * `onClose`, where the consumer sets `closed`. Setting `closed` back to `false` shows it again. Use
 * `AlertStrip.CloseablePersisted` for one that stays hidden after a reload, which owns the state.
 *
 * ### Asserting on it
 *
 * | `data-slot` | rendered |
 * |---|---|
 * | `alert-strip` | the root, carries `testId` |
 * | `alert-strip-prefix` | the prefix, only when set |
 * | `alert-strip-content` | the content |
 * | `alert-strip-suffix` | the suffix, only when set |
 * | `alert-strip-close` | the close button |
 *
 * @example
 * ```tsx
 * const [closed, setClosed] = useState(false);
 *
 * <AlertStrip.Closeable color="warning" side="bottom" closed={closed} onClose={() => setClosed(true)}>
 *   Warning: your trial ends in 3 days.
 * </AlertStrip.Closeable>
 * ```
 */
export const AlertStripCloseable = forwardRef<HTMLDivElement, AlertStripCloseableProps>(
	function AlertStripCloseable(
		{ closed, onClose, finalFocus, closeAriaLabel = 'Dismiss', children, ...props },
		ref,
	) {
		const { testId } = props;

		if (closed || !hasRenderableContent(children)) {
			return null;
		}

		return (
			<AlertStripFrame
				{...props}
				ref={ref}
				trailing={
					<button
						type="button"
						data-slot="alert-strip-close"
						className={styles['alert-strip__close']}
						aria-label={closeAriaLabel}
						onClick={(event) =>
							closeAndMoveFocus(
								event.currentTarget.closest<HTMLElement>('[data-slot="alert-strip"]'),
								onClose,
								finalFocus,
							)
						}
						data-testid={partTestId(testId, 'close')}
					>
						<X aria-hidden="true" />
					</button>
				}
			>
				{children}
			</AlertStripFrame>
		);
	},
);
AlertStripCloseable.displayName = 'AlertStrip.Closeable';
