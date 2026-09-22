import { Menu } from '@base-ui/react/menu';
import type { MouseEvent, ReactNode } from 'react';
import { Kbd } from '../../kbd/kbd.js';
import { toast } from '../../sonner/sonner.js';
import { DROPDOWN_ACTION_ERROR_MESSAGE } from '../constants.js';
import { useDropdownContext } from '../dropdown-context.js';
import styles from '../dropdown.module.scss';
import type { DropdownActionItemType } from '../types.js';
import {
	DropdownRowBody,
	DropdownRowTooltip,
	type DropdownTooltipSide,
	useDropdownRow,
} from './dropdown-row.js';

function isPromise(value: unknown): value is Promise<boolean | void> {
	return typeof (value as Promise<unknown> | undefined)?.then === 'function';
}

function toErrorMessage(error: unknown): string {
	return error instanceof Error && error.message !== ''
		? error.message
		: DROPDOWN_ACTION_ERROR_MESSAGE;
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
	const { close, setPendingValue } = useDropdownContext();
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
	// That is the whole reason the menu holds an `actionsRef` internally.
	function handleClick(event: MouseEvent): void {
		if (row.isInert) {
			return;
		}

		if (item.onClick === undefined) {
			close();
			return;
		}

		const result = item.onClick(event);

		if (result === false) {
			return;
		}

		if (!isPromise(result)) {
			close();
			return;
		}

		setPendingValue(value);
		result.then(
			(resolved) => {
				setPendingValue(null);

				if (resolved !== false) {
					close();
				}
			},
			(error: unknown) => {
				setPendingValue(null);
				toast.error(toErrorMessage(error));
			},
		);
	}

	return (
		<DropdownRowTooltip row={row} side={side}>
			<Menu.Item
				data-slot="dropdown-item"
				data-destructive={item.destructive || undefined}
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
