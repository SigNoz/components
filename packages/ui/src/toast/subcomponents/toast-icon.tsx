import { SolidAlertCircle, SolidCheckCircle2, SolidInfoCircle } from '@signozhq/icons';
import type { ReactNode } from 'react';
import { Spinner } from '../../spinner/index.js';
import { ToastVariant } from '../constants.js';
import styles from '../toast.module.scss';

/**
 * @access private
 */
export type ToastIconProps = {
	/**
	 * The `type` of the toast. Anything unknown gets the info icon.
	 */
	variant: string | undefined;
	testId?: string;
};

// Warning and danger share a glyph, as in the design. The colour tells them apart.
const ICONS: Record<string, ReactNode> = {
	[ToastVariant.Success]: <SolidCheckCircle2 />,
	[ToastVariant.Info]: <SolidInfoCircle />,
	[ToastVariant.Warning]: <SolidAlertCircle />,
	[ToastVariant.Danger]: <SolidAlertCircle />,
	[ToastVariant.Loading]: <Spinner />,
};

/**
 * Decorative: the title says what the icon shows, so it is hidden from assistive technology.
 *
 * @access private
 */
export function ToastIcon({ variant, testId }: ToastIconProps): ReactNode {
	return (
		<span
			className={styles['toast__icon']}
			data-slot="toast-icon"
			data-testid={testId}
			aria-hidden="true"
		>
			{ICONS[variant ?? ToastVariant.Info] ?? ICONS[ToastVariant.Info]}
		</span>
	);
}
