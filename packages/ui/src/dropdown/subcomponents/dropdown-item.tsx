import { Menu } from '@base-ui/react/menu';
import type { MouseEvent, ReactNode } from 'react';
import { Kbd } from '../../kbd/kbd.js';
import { useDropdownContext } from '../dropdown-context.js';
import styles from '../dropdown.module.scss';
import type { DropdownActionItemType } from '../types.js';
import {
	DropdownRowBody,
	DropdownRowTooltip,
	type DropdownTooltipSide,
	useDropdownRow,
} from './dropdown-row.js';

/**
 * @access private
 */
export type DropdownItemProps = {
	item: DropdownActionItemType;
	side: DropdownTooltipSide;
};

/**
 * One action row: its slots, its reasons, and the handler it runs before the menu closes.
 *
 * A component rather than a loop body because each row measures its own label and owns its own
 * tooltip, and hooks cannot run in a loop.
 *
 * @access private
 */
export function DropdownItem({ item, side }: DropdownItemProps): ReactNode {
	const { label, value, testId, disabled, disabledTooltip, loading, loadingTooltip } = item;
	const { close } = useDropdownContext();
	const [row, labelRef] = useDropdownRow({
		label,
		value,
		testId,
		disabled,
		disabledTooltip,
		loading,
		loadingTooltip,
	});

	// Every row renders with `closeOnClick={false}`, so an inert row never runs its handler nor
	// closes the menu.
	function handleClick(event: MouseEvent): void {
		if (row.isInert) {
			return;
		}

		item.onClick?.(event);
		close();
	}

	return (
		<DropdownRowTooltip row={row} side={side}>
			<Menu.Item
				data-slot="dropdown-item"
				data-danger={item.danger || undefined}
				data-disabled={row.isDisabled || undefined}
				data-loading={row.isLoading || undefined}
				aria-disabled={row.isInert || undefined}
				className={styles['dropdown__item']}
				closeOnClick={false}
				onClick={handleClick}
				{...(row.resolvedTestId === undefined ? {} : { 'data-testid': row.resolvedTestId })}
			>
				<DropdownRowBody
					row={row}
					labelRef={labelRef}
					prefix={item.prefix}
					suffix={item.shortcut === undefined ? item.suffix : <Kbd size="sm">{item.shortcut}</Kbd>}
				/>
			</Menu.Item>
		</DropdownRowTooltip>
	);
}
