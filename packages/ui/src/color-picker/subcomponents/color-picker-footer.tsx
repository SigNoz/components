import type { ReactElement, ReactNode } from 'react';
import { partTestId } from '../../lib/utils.js';
import styles from '../color-picker.module.scss';

/**
 * @access private
 */
export type ColorPickerFooterProps = {
	children: ReactNode;
	testId: string | undefined;
};

/**
 * The content of `footer`, under the hex field.
 *
 * @access private
 */
export function ColorPickerFooter({ children, testId }: ColorPickerFooterProps): ReactElement {
	return (
		<div
			data-slot="color-picker-footer"
			data-testid={partTestId(testId, 'footer')}
			className={styles['color-picker__footer']}
		>
			{children}
		</div>
	);
}
