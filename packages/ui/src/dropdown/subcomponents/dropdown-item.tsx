import { Menu } from '@base-ui/react/menu';
import type { MouseEvent, ReactNode } from 'react';
import { Kbd } from '../../kbd/kbd.js';
import { useDropdownContext } from '../dropdown-context.js';
import styles from '../dropdown.module.scss';
import type { DropdownActionItemType } from '../types.js';
import { reportDropdownActionError } from '../utils.js';
import {
	DropdownRowBody,
	DropdownRowTooltip,
	type DropdownTooltipSide,
	useDropdownRow,
} from './dropdown-row.js';

function isPromise(value: unknown): value is Promise<boolean | void> {
	return typeof (value as Promise<unknown> | undefined)?.then === 'function';
}

/**
 * @access private
 */
export type DropdownItemProps = {
	item: DropdownActionItemType;
	side: DropdownTooltipSide;
};

/**
 * One action row: its slots, its reasons, and the handler that decides whether the menu closes.
 *
 * A component rather than a loop body because each row measures its own label and owns its own
 * tooltip, and hooks cannot run in a loop.
 *
 * @access private
 */
export function DropdownItem({ item, side }: DropdownItemProps): ReactNode {
	const { label, value, testId, disabled, disabledTooltip, loading, loadingTooltip } = item;
	const { close, trackPendingAction } = useDropdownContext();
	const [row, labelRef] = useDropdownRow({
		label,
		value,
		testId,
		disabled,
		disabledTooltip,
		loading,
		loadingTooltip,
	});

	// Every row renders with `closeOnClick={false}`, so closing is this handler's decision alone.
	function handleClick(event: MouseEvent): void {
		if (row.isInert) {
			return;
		}

		if (item.onClick === undefined) {
			close();
			return;
		}

		let result: ReturnType<NonNullable<typeof item.onClick>>;

		// A handler that throws before it has a promise to reject fails the same way a rejection
		// does: the menu stays open and the toast says why.
		try {
			result = item.onClick(event);
		} catch (error) {
			reportDropdownActionError(error);
			return;
		}

		if (result === false) {
			return;
		}

		if (!isPromise(result)) {
			close();
			return;
		}

		trackPendingAction(row.rowKey, result);
	}

	return (
		<DropdownRowTooltip row={row} side={side}>
			<Menu.Item
				data-slot="dropdown-item"
				data-danger={item.danger || undefined}
				data-disabled={row.isDisabled || undefined}
				data-loading={row.isLoading || undefined}
				data-pending={row.isPending || undefined}
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
