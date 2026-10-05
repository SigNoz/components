import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import { useVirtualizer } from '@tanstack/react-virtual';
import { type MutableRefObject, type ReactNode, useImperativeHandle, useMemo } from 'react';
import { cn } from '../../lib/utils.js';
import { COMBOBOX_ESTIMATED_ROW_SIZE } from '../constants.js';
import styles from '../combobox.module.scss';
import type { ComboboxVirtualRow } from '../utils.js';
import { ComboboxRow } from './combobox-row.js';

/**
 * What the root calls to bring a row into view, by its index among the rows the user can pick.
 *
 * @access private
 */
export type ComboboxVirtualScroller = {
	scrollToOption: (optionIndex: number) => void;
};

/**
 * @access private
 */
export type ComboboxVirtualRowsProps = {
	rows: readonly ComboboxVirtualRow[];
	optionCount: number;
	scrollElement: HTMLDivElement | null;
	scrollerRef: MutableRefObject<ComboboxVirtualScroller | null>;
	comboboxTestId: string | undefined;
	multiple: boolean;
	createLabel: ((query: string) => ReactNode) | undefined;
};

/**
 * The rows of a virtualized list. Only the rows in view are mounted, each placed at its offset
 * inside a box as tall as the whole list.
 *
 * Base UI is told each row's index, since it cannot read the order off a DOM that holds a slice of
 * it.
 *
 * @access private
 */
export function ComboboxVirtualRows({
	rows,
	optionCount,
	scrollElement,
	scrollerRef,
	...rowProps
}: ComboboxVirtualRowsProps): ReactNode {
	// TanStack Virtual hands back one mutable instance whose methods change what they return on
	// every scroll, so React Compiler memoizing around it would render stale rows.
	'use no memo';

	// Both directions: a row's option index for Base UI, and an option's row for the scroller,
	// which runs on every highlight move.
	const { optionIndexes, rowIndexes } = useMemo(() => {
		const rowsOfOptions: number[] = [];
		const optionsOfRows = rows.map((row, rowIndex) => {
			if (row.kind === 'separator' || row.kind === 'group-label') {
				return -1;
			}

			rowsOfOptions.push(rowIndex);

			return rowsOfOptions.length - 1;
		});

		return { optionIndexes: optionsOfRows, rowIndexes: rowsOfOptions };
	}, [rows]);

	const virtualizer = useVirtualizer({
		count: rows.length,
		getScrollElement: () => scrollElement,
		estimateSize: () => COMBOBOX_ESTIMATED_ROW_SIZE,
		getItemKey: (index) => rows[index]?.key ?? index,
		overscan: 8,
	});

	useImperativeHandle(
		scrollerRef,
		() => ({
			scrollToOption: (optionIndex) => {
				const rowIndex = rowIndexes[optionIndex];

				if (rowIndex !== undefined) {
					virtualizer.scrollToIndex(rowIndex, { align: 'auto' });
				}
			},
		}),
		[rowIndexes, virtualizer],
	);

	return (
		<div
			data-slot="combobox-virtual-list"
			className={styles['combobox__virtual-list']}
			style={{ blockSize: virtualizer.getTotalSize() }}
		>
			{virtualizer.getVirtualItems().map((virtualRow) => {
				const row = rows[virtualRow.index];

				if (row === undefined) {
					return null;
				}

				const style = { transform: `translateY(${virtualRow.start}px)` };

				if (row.kind === 'separator') {
					return (
						<div
							key={virtualRow.key}
							ref={virtualizer.measureElement}
							data-index={virtualRow.index}
							className={styles['combobox__virtual-row']}
							style={style}
						>
							<BaseCombobox.Separator
								data-slot="combobox-separator"
								className={styles['combobox__separator']}
							/>
						</div>
					);
				}

				if (row.kind === 'group-label') {
					return (
						<div
							key={virtualRow.key}
							ref={virtualizer.measureElement}
							data-index={virtualRow.index}
							data-slot="combobox-group-label"
							className={cn(styles['combobox__virtual-row'], styles['combobox__group-label'])}
							style={style}
						>
							{row.label}
						</div>
					);
				}

				return (
					<div
						key={virtualRow.key}
						ref={virtualizer.measureElement}
						data-index={virtualRow.index}
						className={styles['combobox__virtual-row']}
						style={style}
					>
						<ComboboxRow
							entry={row}
							index={optionIndexes[virtualRow.index]}
							setSize={optionCount}
							{...rowProps}
						/>
					</div>
				);
			})}
		</div>
	);
}
