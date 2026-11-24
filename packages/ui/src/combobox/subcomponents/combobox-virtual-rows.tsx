import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import { useVirtualizer } from '@tanstack/react-virtual';
import {
	type MutableRefObject,
	type ReactNode,
	useEffect,
	useImperativeHandle,
	useMemo,
} from 'react';
import { cn } from '../../lib/utils.js';
import { COMBOBOX_ESTIMATED_ROW_SIZE } from '../constants.js';
import styles from '../combobox.module.scss';
import type { RenderedItemsReport } from '../use-rendered-items-report.js';
import { type ComboboxVirtualRow, itemRowValues } from '../utils.js';
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
	reportRenderedItems: RenderedItemsReport | undefined;
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
	reportRenderedItems,
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

	// oxlint-disable-next-line react/incompatible-library -- the compiler leaves this component unmemoized, and it reads the virtualizer fresh on every render, so nothing goes stale
	const virtualizer = useVirtualizer({
		count: rows.length,
		getScrollElement: () => scrollElement,
		estimateSize: () => COMBOBOX_ESTIMATED_ROW_SIZE,
		getItemKey: (index) => rows[index]?.key ?? index,
		overscan: 8,
	});

	const virtualRows = virtualizer.getVirtualItems();

	const values = itemRowValues(virtualRows.map((virtualRow) => rows[virtualRow.index]));
	// The first render of an open runs before the viewport is measured, and the virtualizer hands
	// back no rows at all until it is. That empty slice is not what anyone sees.
	const measured = virtualRows.length > 0 || rows.length === 0;
	// While a scroll runs, the slice moves on every frame, and an open with a highlighted row far
	// down the list renders the top rows, then scrolls. Reporting waits for the virtualizer to stop
	// scrolling, and for a frame with no further commit, so each of those slices is not checked.
	const settled = measured && !virtualizer.isScrolling;

	// No dependency list: the slice is a new array on every scroll frame, and every commit has to
	// cancel the frame the one before it asked for.
	useEffect(() => {
		if (!settled || reportRenderedItems === undefined) {
			return undefined;
		}

		const frame = requestAnimationFrame(() => reportRenderedItems(values));

		return () => cancelAnimationFrame(frame);
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
			{virtualRows.map((virtualRow) => {
				const row = rows[virtualRow.index];

				if (row === undefined) {
					return null;
				}

				const style = { transform: `translateY(${virtualRow.start}px)` };
				// No row follows the last one, so it drops the gap its padding stands for.
				const isLast = virtualRow.index === rows.length - 1 || undefined;

				if (row.kind === 'separator') {
					return (
						<div
							key={virtualRow.key}
							ref={virtualizer.measureElement}
							data-index={virtualRow.index}
							data-last={isLast}
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
							data-last={isLast}
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
						data-last={isLast}
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
