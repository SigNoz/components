import { forwardRef, type ReactNode } from 'react';
import { hasRenderableContent, partTestId } from '../../lib/utils.js';
import styles from '../callout.module.scss';
import type { CalloutProps } from '../types.js';
import { CalloutFrame } from './callout-frame.js';

export type CalloutActionProps = CalloutProps & {
	/**
	 * What the user can do about the message, such as a `Callout.Button` that refreshes the data.
	 * It sits on the right edge, centered on the first line of the description.
	 *
	 * @note It does not grow the callout, so keep it about one line tall: `Callout.Button` and a
	 * `Button` with `size="sm"` fit both sizes. One that renders nothing leaves a plain `Callout`.
	 */
	action: ReactNode;
};

/**
 * A `Callout` with an action on the right edge, in the same row as the first line of the
 * description, where `Callout.Closeable` has its close button. Reached as `Callout.Action`, not
 * imported on its own.
 *
 * The callout renders `action` as given and adds no handler, name or state to it, so the action
 * owns its click, its label and anything it shows while it runs.
 *
 * Like `Callout`, it renders nothing while `children` is empty.
 *
 * ### Asserting on it
 *
 * | `data-slot` | rendered |
 * |---|---|
 * | `callout` | the root, carries `testId` |
 * | `callout-icon` | the icon |
 * | `callout-description` | the description |
 * | `callout-action` | the box around `action` |
 *
 * @example
 * ```tsx
 * <Callout.Action
 *   color="warning"
 *   size="sm"
 *   icon={<SolidAlertTriangle />}
 *   action={<Callout.Button onClick={refetch}>Refresh</Callout.Button>}
 * >
 *   New data is available.
 * </Callout.Action>
 * ```
 */
export const CalloutAction = forwardRef<HTMLDivElement, CalloutActionProps>(function CalloutAction(
	{ action, children, ...props },
	ref,
) {
	const { testId } = props;

	if (!hasRenderableContent(children)) {
		return null;
	}

	return (
		<CalloutFrame
			{...props}
			ref={ref}
			trailing={
				hasRenderableContent(action) ? (
					<div
						data-slot="callout-action"
						className={styles['callout__action']}
						data-testid={partTestId(testId, 'action')}
					>
						{action}
					</div>
				) : undefined
			}
		>
			{children}
		</CalloutFrame>
	);
});
CalloutAction.displayName = 'Callout.Action';
