import { Toast as ToastPrimitive } from '@base-ui/react/toast';
import type { ReactNode } from 'react';
import { partTestId } from '../../lib/utils.js';
import type { ToastData, ToastPositionType } from '../types.js';
import { ToastItem } from './toast-item.js';

/**
 * @access private
 */
export type ToastListProps = {
	position: ToastPositionType;
	testId?: string;
};

/**
 * Every toast the manager holds, each with the `testId` it was raised with, else one derived from
 * the `testId` of the `Toaster`.
 *
 * @access private
 */
export function ToastList({ position, testId }: ToastListProps): ReactNode {
	const { toasts } = ToastPrimitive.useToastManager<ToastData>();

	return toasts.map((item) => (
		<ToastItem
			key={item.id}
			toast={item}
			position={position}
			testId={item.data?.testId ?? partTestId(testId, `toast-${item.id}`)}
		/>
	));
}
