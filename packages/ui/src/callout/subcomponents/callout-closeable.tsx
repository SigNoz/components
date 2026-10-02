import { X } from '@signozhq/icons';
import { forwardRef } from 'react';
import { hasRenderableContent, partTestId } from '../../lib/utils.js';
import styles from '../callout.module.scss';
import type { CalloutProps } from '../types.js';
import { closeAndMoveFocus } from '../utils.js';
import { CalloutFrame } from './callout-frame.js';

export type CalloutCloseableProps = CalloutProps & {
	/**
	 * Whether the callout is closed. It renders nothing while `true`. The callout keeps no state of
	 * its own, so `onClose` is where the consumer sets it.
	 */
	closed: boolean;
	/**
	 * Runs when the user clicks the close button. Set `closed` here to hide the callout. Focus it
	 * moves stays where it was put.
	 */
	onClose: () => void;
	/**
	 * The accessible name of the close button. Worth setting when several closeable callouts sit
	 * on one page, so a screen reader user can tell their buttons apart, and to translate it.
	 *
	 * @default 'Dismiss'
	 */
	closeAriaLabel?: string;
};

/**
 * A `Callout` with a close button on the right edge, in the same row as the first line of the
 * description. Reached as `Callout.Closeable`, not imported on its own.
 *
 * It keeps no state: it renders nothing while `closed` is `true`, and the close button calls
 * `onClose`, where the consumer sets `closed`. Setting `closed` back to `false` shows it again, so
 * a callout that holds a new message after a dismissal needs nothing more. Use
 * `Callout.CloseablePersisted` for one that stays hidden after a reload, which owns the state.
 *
 * When the close button had focus and `onClose` closes the callout, focus moves to the next
 * tabbable element after the callout, or to the last one before it when nothing follows. `onClose`
 * can move it somewhere else instead. A `closed` set later, after an `await`, leaves focus on the
 * page body.
 *
 * Like `Callout`, it renders nothing while `children` is empty. The close button is named
 * `Dismiss`, or `closeAriaLabel` when set.
 *
 * ### Asserting on it
 *
 * | `data-slot` | rendered |
 * |---|---|
 * | `callout` | the root, carries `testId` |
 * | `callout-icon` | the icon |
 * | `callout-description` | the description |
 * | `callout-close` | the close button |
 *
 * @example
 * ```tsx
 * const [closed, setClosed] = useState(false);
 *
 * <Callout.Closeable
 *   color="warning"
 *   size="sm"
 *   icon={<SolidAlertTriangle />}
 *   closed={closed}
 *   onClose={() => setClosed(true)}
 * >
 *   Your trial ends in 3 days.
 * </Callout.Closeable>
 * ```
 */
export const CalloutCloseable = forwardRef<HTMLDivElement, CalloutCloseableProps>(
	function CalloutCloseable(
		{ closed, onClose, closeAriaLabel = 'Dismiss', children, ...props },
		ref,
	) {
		const { testId } = props;

		if (closed || !hasRenderableContent(children)) {
			return null;
		}

		return (
			<CalloutFrame
				{...props}
				ref={ref}
				trailing={
					<button
						type="button"
						data-slot="callout-close"
						className={styles['callout__button']}
						aria-label={closeAriaLabel}
						onClick={(event) => closeAndMoveFocus(event.currentTarget, onClose)}
						data-testid={partTestId(testId, 'close')}
					>
						<X aria-hidden="true" />
					</button>
				}
			>
				{children}
			</CalloutFrame>
		);
	},
);
CalloutCloseable.displayName = 'Callout.Closeable';
