import { Menu } from '@base-ui/react/menu';
import type { ReactNode } from 'react';
import { useDropdownContext } from '../dropdown-context.js';
import styles from '../dropdown.module.scss';
import type { DropdownCheckboxItemType } from '../types.js';
import { DropdownCheckboxControl } from './dropdown-control.js';
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
 * The checkbox takes the trailing slot, which is why the kind has no `suffix`: a row carries at most
 * one selection control, and a call site cannot place a second one because it never places the
 * first.
 *
 * @access private
 */
export function DropdownCheckboxItem({ item, side }: DropdownCheckboxItemProps): ReactNode {
	const { label, name, testId, disabled, disabledTooltip, loading, loadingTooltip } = item;
	const { rememberedSelections, rememberSelection } = useDropdownContext();
	const [row, labelRef] = useDropdownRow({
		label,
		value: name,
		testId,
		disabled,
		disabledTooltip,
		loading,
		loadingTooltip,
	});

	// Always controlled from here: an uncontrolled row's state lives on the menu, which outlives the
	// popup and the row alike.
	const remembered = rememberedSelections[row.rowKey];
	const checked =
		item.value ?? (typeof remembered === 'boolean' ? remembered : (item.defaultValue ?? false));

	return (
		<DropdownRowTooltip row={row} side={side}>
			<Menu.CheckboxItem
				data-slot="dropdown-checkbox-item"
				data-disabled={row.isDisabled || undefined}
				data-loading={row.isLoading || undefined}
				aria-disabled={row.isInert || undefined}
				className={styles['dropdown__item']}
				closeOnClick={false}
				checked={checked}
				onCheckedChange={(nextChecked, eventDetails) => {
					if (row.isInert) {
						eventDetails.cancel();
						return;
					}

					if (item.value === undefined) {
						rememberSelection(row.rowKey, nextChecked);
					}

					item.onChange?.(nextChecked);
				}}
				{...(row.resolvedTestId === undefined ? {} : { 'data-testid': row.resolvedTestId })}
			>
				<DropdownRowBody
					row={row}
					labelRef={labelRef}
					prefix={item.prefix}
					suffix={<DropdownCheckboxControl />}
				/>
			</Menu.CheckboxItem>
		</DropdownRowTooltip>
	);
}
