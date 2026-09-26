import { Menu } from '@base-ui/react/menu';
import { Check } from '@signozhq/icons';
import type { ReactNode } from 'react';
import { cn } from '../../lib/utils.js';
import styles from '../dropdown.module.scss';

/**
 * The box a checkbox row draws in its trailing slot.
 *
 * Only the box of `Checkbox`, drawn here rather than imported: that one is a button with its own
 * label, value and focus stop, and the row already is all three.
 *
 * `keepMounted` keeps the empty box painted while unticked. The state only toggles the tick's
 * visibility, through `data-checked` in the stylesheet.
 *
 * @access private
 */
export function DropdownCheckboxControl(): ReactNode {
	return (
		<Menu.CheckboxItemIndicator
			keepMounted
			data-slot="dropdown-item-indicator"
			className={cn(styles['dropdown__item-control'], styles['dropdown__item-control--checkbox'])}
		>
			<Check className={styles['dropdown__item-control-check']} />
		</Menu.CheckboxItemIndicator>
	);
}

/**
 * The dial a radio row draws in its trailing slot.
 *
 * Only the dial of `RadioGroup`, for the same reason `DropdownCheckboxControl` is only the box.
 *
 * @access private
 */
export function DropdownRadioControl(): ReactNode {
	return (
		<Menu.RadioItemIndicator
			keepMounted
			data-slot="dropdown-item-indicator"
			className={cn(styles['dropdown__item-control'], styles['dropdown__item-control--radio'])}
		>
			<span className={styles['dropdown__item-control-dot']} />
		</Menu.RadioItemIndicator>
	);
}
