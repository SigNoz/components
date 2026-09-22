import { Menu } from '@base-ui/react/menu';
import { Check } from '@signozhq/icons';
import type { ReactNode } from 'react';
import { useDropdownContext } from '../dropdown-context.js';
import styles from '../dropdown.module.scss';
import type { DropdownRadioGroupItemType, DropdownRadioItemType } from '../types.js';
import {
	DropdownRowBody,
	DropdownRowTooltip,
	type DropdownTooltipSide,
	useDropdownRow,
} from './dropdown-row.js';

type DropdownRadioItemProps = {
	item: DropdownRadioItemType;
	side: DropdownTooltipSide;
	groupDisabled: boolean;
};

function DropdownRadioItem({ item, side, groupDisabled }: DropdownRadioItemProps): ReactNode {
	const { label, value, testId, disabled, disabledTooltip, loading, loadingTooltip } = item;
	const [row, labelRef] = useDropdownRow({
		label,
		value,
		testId,
		// The group's own `disabled` blocks every option in it, whatever each one says.
		disabled: groupDisabled || disabled,
		disabledTooltip,
		loading,
		loadingTooltip,
	});

	return (
		<DropdownRowTooltip row={row} side={side}>
			<Menu.RadioItem
				value={value}
				data-slot="dropdown-radio-item"
				data-disabled={row.isDisabled || undefined}
				data-loading={row.isLoading || undefined}
				aria-disabled={row.isInert || undefined}
				className={styles['dropdown__item']}
				closeOnClick={false}
				{...(row.resolvedTestId === undefined ? {} : { 'data-testid': row.resolvedTestId })}
			>
				<DropdownRowBody
					row={row}
					labelRef={labelRef}
					prefix={
						<Menu.RadioItemIndicator
							keepMounted
							data-slot="dropdown-item-indicator"
							className={styles['dropdown__item-control']}
						>
							<Check />
						</Menu.RadioItemIndicator>
					}
					suffix={item.suffix}
				/>
			</Menu.RadioItem>
		</DropdownRowTooltip>
	);
}

/**
 * @access private
 */
export type DropdownRadioGroupProps = {
	item: DropdownRadioGroupItemType;
	side: DropdownTooltipSide;
};

/**
 * A set of options, of which one is picked. The group owns its radios.
 *
 * @access private
 */
export function DropdownRadioGroup({ item, side }: DropdownRadioGroupProps): ReactNode {
	const { testId: dropdownTestId, pendingValue } = useDropdownContext();
	const isGroupDisabled = item.disabled === true;
	const resolvedTestId =
		dropdownTestId === undefined ? undefined : `${dropdownTestId}-radio-group-${item.value}`;

	return (
		<Menu.RadioGroup
			data-slot="dropdown-radio-group"
			data-disabled={isGroupDisabled || undefined}
			className={styles['dropdown__group']}
			value={item.selectedValue}
			defaultValue={item.defaultSelectedValue}
			onValueChange={(value: unknown, eventDetails) => {
				// An async action holds the whole list, and a disabled group holds its own.
				if (isGroupDisabled || pendingValue !== null || typeof value !== 'string') {
					eventDetails.cancel();
					return;
				}

				item.onChange?.(value);
			}}
			{...(resolvedTestId === undefined ? {} : { 'data-testid': resolvedTestId })}
		>
			{item.items.map((option) => (
				<DropdownRadioItem
					key={option.value}
					item={option}
					side={side}
					groupDisabled={isGroupDisabled}
				/>
			))}
		</Menu.RadioGroup>
	);
}
