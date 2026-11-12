import { X } from '@signozhq/icons';
import type { ReactElement } from 'react';
import { partTestId } from '../../lib/utils.js';
import styles from '../color-picker.module.scss';
import { COLOR_PICKER_LABELS } from '../constants.js';

/**
 * @access private
 */
export type ColorPickerClearButtonProps = {
	onClear: () => void;
	testId: string | undefined;
};

/**
 * Takes the picker back to no color.
 *
 * @access private
 */
export function ColorPickerClearButton({
	onClear,
	testId,
}: ColorPickerClearButtonProps): ReactElement {
	return (
		<button
			type="button"
			aria-label={COLOR_PICKER_LABELS.clear}
			data-slot="color-picker-clear"
			data-testid={partTestId(testId, 'clear')}
			className={styles['color-picker__clear']}
			onClick={onClear}
		>
			<X aria-hidden="true" />
		</button>
	);
}
