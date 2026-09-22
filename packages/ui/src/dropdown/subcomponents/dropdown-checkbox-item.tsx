import { Menu } from '@base-ui/react/menu';
import { Check } from '@signozhq/icons';
import type { ReactNode } from 'react';
import styles from '../dropdown.module.scss';
import type { DropdownCheckboxItemType } from '../types.js';
import {
	DropdownRowBody,
	DropdownRowTooltip,
	type DropdownTooltipSide,
	useDropdownRow,
} from './dropdown-row.js';

/**
 * @access private
 */
export type DropdownCheckboxItemProps = {
	item: DropdownCheckboxItemType;
	side: DropdownTooltipSide;
};

/**
 * One row that toggles a setting.
 *
 * The checkbox takes the leading slot, which is why the kind has no `prefix`: a row carries at most
 * one selection control, and a call site cannot place a second one because it never places the
 * first.
 *
 * @access private
 */
export function DropdownCheckboxItem({ item, side }: DropdownCheckboxItemProps): ReactNode {
	const { label, value, testId, disabled, disabledTooltip, loading, loadingTooltip } = item;
	const [row, labelRef] = useDropdownRow({
		label,
		value,
		testId,
		disabled,
		disabledTooltip,
		loading,
		loadingTooltip,
	});

	return (
		<DropdownRowTooltip row={row} side={side}>
			<Menu.CheckboxItem
				data-slot="dropdown-checkbox-item"
				data-disabled={row.isDisabled || undefined}
				data-loading={row.isLoading || undefined}
				aria-disabled={row.isInert || undefined}
				className={styles['dropdown__item']}
				closeOnClick={false}
				checked={item.checked}
				defaultChecked={item.defaultChecked}
				onCheckedChange={(checked, eventDetails) => {
					if (row.isInert) {
						eventDetails.cancel();
						return;
					}

					item.onChange?.(checked);
				}}
				{...(row.resolvedTestId === undefined ? {} : { 'data-testid': row.resolvedTestId })}
			>
				<DropdownRowBody
					row={row}
					labelRef={labelRef}
					prefix={
						<Menu.CheckboxItemIndicator
							keepMounted
							data-slot="dropdown-item-indicator"
							className={styles['dropdown__item-control']}
						>
							<Check />
						</Menu.CheckboxItemIndicator>
					}
					suffix={item.suffix}
				/>
			</Menu.CheckboxItem>
		</DropdownRowTooltip>
	);
}
