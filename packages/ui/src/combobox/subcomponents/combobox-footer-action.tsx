import type { ReactNode } from 'react';
import { partTestId } from '../../lib/utils.js';
import styles from '../combobox.module.scss';
import type { ComboboxFooterActionType } from '../types.js';

/**
 * The action row pinned under the list. A plain button, outside the listbox: it is not a value, so
 * it takes no `role="option"`, and `Tab` from the search row reaches it.
 *
 * @access private
 */
export function ComboboxFooterAction({
	action,
	comboboxTestId,
	onPress,
}: {
	action: ComboboxFooterActionType;
	comboboxTestId: string | undefined;
	onPress: () => void;
}): ReactNode {
	const testId = action.testId ?? partTestId(comboboxTestId, 'footer-action');

	return (
		<div data-slot="combobox-footer" className={styles['combobox__footer']}>
			<button
				type="button"
				data-slot="combobox-footer-action"
				className={styles['combobox__item']}
				onClick={() => {
					action.onClick();
					onPress();
				}}
				{...(testId === undefined ? {} : { 'data-testid': testId })}
			>
				{action.prefix !== undefined && (
					<span
						data-slot="combobox-footer-action-prefix"
						className={styles['combobox__item-affix']}
					>
						{action.prefix}
					</span>
				)}
				<span data-slot="combobox-footer-action-label" className={styles['combobox__item-label']}>
					{action.label}
				</span>
			</button>
		</div>
	);
}
