import * as React from 'react';
import { ComboboxCreateItem } from '../../../subcomponents/combobox-create-item.js';
import { ComboboxEmpty } from '../../../subcomponents/combobox-empty.js';
import { ComboboxGroup } from '../../../subcomponents/combobox-group.js';
import { ComboboxItem } from '../../../subcomponents/combobox-item.js';
import { ComboboxLoading } from '../../../subcomponents/combobox-loading.js';
import { ComboboxSeparator } from '../../../subcomponents/combobox-separator.js';
import type { RenderTree } from '../utils.js';
import { renderItem } from './item-renderer.js';

export type ComboboxListContentProps = {
	loading: boolean;
	loadingPlaceholder: React.ReactNode;
	tree: RenderTree;
	selectedValues: string[];
	allowCreate: boolean | ((inputValue: string) => React.ReactNode);
	emptyPlaceholder: string;
	handleSelect: (value: string) => void;
	handleCreate: (value: string) => void;
	handleInsert: (value: string) => void;
};

export function ComboboxListContent({
	loading,
	loadingPlaceholder,
	tree,
	selectedValues,
	allowCreate,
	emptyPlaceholder,
	handleSelect,
	handleCreate,
	handleInsert,
}: ComboboxListContentProps): React.ReactElement {
	if (loading) {
		return <ComboboxLoading>{loadingPlaceholder}</ComboboxLoading>;
	}

	const { customValues, groups, showCreate, createValue } = tree;

	return (
		<>
			{showCreate && (
				<ComboboxCreateItem
					inputValue={createValue}
					onSelect={() => handleCreate(createValue)}
					value={`__create__${createValue}`}
				>
					{typeof allowCreate === 'function' ? allowCreate(createValue) : `Create "${createValue}"`}
				</ComboboxCreateItem>
			)}
			{customValues.length > 0 && (
				<>
					{showCreate && <ComboboxSeparator alwaysRender />}
					<ComboboxGroup heading="Custom">
						{customValues.map((v) => (
							<ComboboxItem key={v} value={v} onSelect={handleSelect} isSelected={true}>
								{v}
							</ComboboxItem>
						))}
					</ComboboxGroup>
					{groups.length > 0 && <ComboboxSeparator alwaysRender />}
				</>
			)}
			{groups.map((group, i) => (
				<React.Fragment key={`__group-${i}`}>
					{i > 0 && <ComboboxSeparator alwaysRender />}
					{group.heading ? (
						<ComboboxGroup heading={group.heading}>
							{group.items.map((item) =>
								renderItem(item, selectedValues, handleSelect, handleInsert)
							)}
						</ComboboxGroup>
					) : (
						group.items.map((item) => renderItem(item, selectedValues, handleSelect, handleInsert))
					)}
				</React.Fragment>
			))}
			{!showCreate && customValues.length === 0 && groups.length === 0 && (
				<ComboboxEmpty>{emptyPlaceholder}</ComboboxEmpty>
			)}
		</>
	);
}
