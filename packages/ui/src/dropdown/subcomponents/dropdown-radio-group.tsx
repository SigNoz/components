import { Menu } from '@base-ui/react/menu';
import type { ReactNode } from 'react';
import { DropdownScope, useDropdownContext, useDropdownRowKey } from '../dropdown-context.js';
import styles from '../dropdown.module.scss';
import type { DropdownRadioGroupItemType, DropdownRadioItemType } from '../types.js';
import { DropdownRadioControl } from './dropdown-control.js';
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
	groupDisabledTooltip: ReactNode;
};

function DropdownRadioItem({
	item,
	side,
	groupDisabled,
	groupDisabledTooltip,
}: DropdownRadioItemProps): ReactNode {
	const { label, value, testId, disabled, disabledTooltip, loading, loadingTooltip } = item;
	const [row, labelRef] = useDropdownRow({
		label,
		value,
		testId,
		// The group's own `disabled` blocks every option in it, whatever each one says, and its reason
		// is the one each option shows.
		disabled: groupDisabled || disabled,
		disabledTooltip: groupDisabled ? groupDisabledTooltip : disabledTooltip,
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
					prefix={item.prefix}
					suffix={<DropdownRadioControl />}
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
	const {
		testId: dropdownTestId,
		pendingRowKey,
		rememberedSelections,
		rememberSelection,
	} = useDropdownContext();
	const groupKey = useDropdownRowKey(item.name);
	const isGroupDisabled = item.disabled === true;
	const resolvedTestId =
		dropdownTestId === undefined ? undefined : `${dropdownTestId}-radio-group-${item.name}`;

	// Always controlled from here, for the reason `DropdownCheckboxItem` is. `null` rather than
	// `undefined` for no selection, so the part never flips between the two modes.
	const remembered = rememberedSelections[groupKey];
	const selectedValue =
		item.value ?? (typeof remembered === 'string' ? remembered : (item.defaultValue ?? null));

	return (
		<Menu.RadioGroup
			data-slot="dropdown-radio-group"
			data-disabled={isGroupDisabled || undefined}
			className={styles['dropdown__group']}
			value={selectedValue}
			onValueChange={(value: unknown, eventDetails) => {
				// The options are `aria-disabled` rather than disabled, so Base UI selects them
				// whatever they say. An inert option is refused here, and so is every option while
				// the group is disabled or an async action holds the list.
				const option = item.items.find((candidate) => candidate.value === value);

				if (
					isGroupDisabled ||
					pendingRowKey !== null ||
					typeof value !== 'string' ||
					option?.disabled === true ||
					option?.loading === true
				) {
					eventDetails.cancel();
					return;
				}

				if (item.value === undefined) {
					rememberSelection(groupKey, value);
				}

				item.onChange?.(value);
			}}
			{...(resolvedTestId === undefined ? {} : { 'data-testid': resolvedTestId })}
		>
			<DropdownScope value={item.name}>
				{item.items.map((option) => (
					<DropdownRadioItem
						key={option.value}
						item={option}
						side={side}
						groupDisabled={isGroupDisabled}
						groupDisabledTooltip={item.disabledTooltip}
					/>
				))}
			</DropdownScope>
		</Menu.RadioGroup>
	);
}
