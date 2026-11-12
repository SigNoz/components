import type { ReactElement } from 'react';
import { partTestId } from '../../lib/utils.js';
import styles from '../color-picker.module.scss';

/**
 * @access private
 */
export type ColorPickerPreviewProps = {
	isEmpty: boolean;
	testId: string | undefined;
};

/**
 * A block filled with the color the panel shows, or the empty pattern while there is none. Hidden
 * from screen readers, which read the color from the hex field and the value texts.
 *
 * @access private
 */
export function ColorPickerPreview({ isEmpty, testId }: ColorPickerPreviewProps): ReactElement {
	return (
		<div
			aria-hidden="true"
			data-slot="color-picker-preview"
			data-testid={partTestId(testId, 'preview')}
			data-empty={isEmpty || undefined}
			className={styles['color-picker__preview']}
		/>
	);
}
