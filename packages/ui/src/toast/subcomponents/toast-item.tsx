import { Toast as ToastPrimitive } from '@base-ui/react/toast';
import type { ReactNode } from 'react';
import { partTestId } from '../../lib/utils.js';
import { SWIPE_DIRECTION } from '../constants.js';
import { usePersistToasts } from '../persist-toasts.js';
import styles from '../toast.module.scss';
import type { ToastData, ToastPositionType } from '../types.js';
import { ToastIcon } from './toast-icon.js';

/**
 * @access private
 */
export type ToastItemProps = {
	toast: ToastPrimitive.Root.ToastObject<ToastData>;
	position: ToastPositionType;
	testId?: string;
};

/**
 * Base UI fills the title and the description from the toast object.
 *
 * @access private
 */
export function ToastItem({ toast, position, testId }: ToastItemProps): ReactNode {
	const action = toast.data?.action;
	const spread = usePersistToasts();

	return (
		<ToastPrimitive.Root
			toast={toast}
			swipeDirection={[...SWIPE_DIRECTION[position]]}
			className={styles['toast']}
			data-slot="toast"
			data-testid={testId}
		>
			<ToastPrimitive.Content
				className={styles['toast__content']}
				data-slot="toast-content"
				data-testid={partTestId(testId, 'content')}
			>
				<ToastIcon variant={toast.type} testId={partTestId(testId, 'icon')} />
				<div className={styles['toast__text']}>
					<ToastPrimitive.Title
						className={styles['toast__title']}
						data-slot="toast-title"
						data-testid={partTestId(testId, 'title')}
					/>
					<ToastPrimitive.Description
						className={styles['toast__description']}
						data-slot="toast-description"
						data-testid={partTestId(testId, 'description')}
					/>
				</div>
			</ToastPrimitive.Content>
			{action && (
				<ToastPrimitive.Close
					className={styles['toast__action']}
					data-slot="toast-action"
					data-testid={partTestId(testId, 'action')}
					// Base UI hides the button from assistive technology while the stack is collapsed. A
					// stack held spread shows it, so it exposes it too. Passed only then: an `undefined`
					// here would replace the value Base UI computes.
					{...(spread && { 'aria-hidden': false })}
					onClick={(event) => {
						action.onClick?.(event);
						// Base UI closes the toast after this handler. `preventDefault` is the DOM idiom for a
						// veto, so it is the way to keep the toast open.
						if (event.defaultPrevented) {
							event.preventBaseUIHandler();
						}
					}}
				>
					{action.label}
				</ToastPrimitive.Close>
			)}
		</ToastPrimitive.Root>
	);
}
