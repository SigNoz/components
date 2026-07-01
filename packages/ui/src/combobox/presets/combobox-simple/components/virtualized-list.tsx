import { useVirtualizer } from '@tanstack/react-virtual';
import * as React from 'react';
import styles from '../../../combobox.module.scss';
import { ComboboxCreateItem } from '../../../subcomponents/combobox-create-item.js';
import { ComboboxEmpty } from '../../../subcomponents/combobox-empty.js';
import { ComboboxItem } from '../../../subcomponents/combobox-item.js';
import { ComboboxSeparator } from '../../../subcomponents/combobox-separator.js';
import type { VirtualizedRowData } from '../types.js';
import { renderItemContent } from './item-renderer.js';

export type VirtualizedListProps = {
	rows: VirtualizedRowData[];
	height: number;
	estimatedItemHeight: number;
	selectedValues: string[];
	emptyPlaceholder: string;
	showCreateOption: boolean;
	allowCreate: boolean | ((inputValue: string) => React.ReactNode);
	handleSelect: (value: string) => void;
	handleCreate: (value: string) => void;
	handleInsert: (value: string) => void;
};

export function VirtualizedList({
	rows,
	height,
	estimatedItemHeight,
	selectedValues,
	emptyPlaceholder,
	showCreateOption,
	allowCreate,
	handleSelect,
	handleCreate,
	handleInsert,
}: VirtualizedListProps): React.ReactElement {
	const scrollContainerRef = React.useRef<HTMLDivElement>(null);

	const virtualizer = useVirtualizer({
		count: rows.length,
		getScrollElement: () => scrollContainerRef.current,
		estimateSize: () => estimatedItemHeight,
		overscan: 5,
	});

	const virtualRows = virtualizer.getVirtualItems();

	const isEmpty = rows.length === 0;

	// Rows is the same as virtualRows
	if (isEmpty && !showCreateOption) {
		return <ComboboxEmpty>{emptyPlaceholder}</ComboboxEmpty>;
	}

	return (
		<div
			ref={scrollContainerRef}
			data-slot="combobox-virtual-scroll"
			className={styles['combobox__virtual-scroll']}
			style={{ height }}
		>
			<div
				data-slot="combobox-virtual-list"
				className={styles['combobox__virtual-list']}
				style={{ height: virtualizer.getTotalSize() }}
			>
				<div
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						width: '100%',
						transform: `translateY(${virtualRows[0]?.start ?? 0}px)`,
					}}
				>
					{virtualRows.map((virtualRow) => {
						const row = rows[virtualRow.index];

						if (row.type === 'separator') {
							return (
								<div
									key={virtualRow.key}
									data-index={virtualRow.index}
									ref={virtualizer.measureElement}
								>
									<ComboboxSeparator alwaysRender />
								</div>
							);
						}

						if (row.type === 'group-heading') {
							return (
								<div
									key={virtualRow.key}
									data-index={virtualRow.index}
									ref={virtualizer.measureElement}
									data-slot="combobox-virtual-heading"
									className={styles['combobox__virtual-heading']}
								>
									{row.heading}
								</div>
							);
						}

						if (row.type === 'custom') {
							return (
								<div
									key={virtualRow.key}
									data-index={virtualRow.index}
									ref={virtualizer.measureElement}
								>
									<ComboboxItem value={row.value} onSelect={handleSelect} isSelected={true}>
										{row.value}
									</ComboboxItem>
								</div>
							);
						}

						if (row.type === 'create') {
							return (
								<div
									key={virtualRow.key}
									data-index={virtualRow.index}
									ref={virtualizer.measureElement}
								>
									<ComboboxCreateItem
										inputValue={row.value}
										onSelect={() => handleCreate(row.value)}
										value={`__create__${row.value}`}
									>
										{typeof allowCreate === 'function'
											? allowCreate(row.value)
											: `Create "${row.value}"`}
									</ComboboxCreateItem>
								</div>
							);
						}

						return (
							<div
								key={virtualRow.key}
								data-index={virtualRow.index}
								ref={virtualizer.measureElement}
							>
								{renderItemContent(row.item, selectedValues, handleSelect, handleInsert)}
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
