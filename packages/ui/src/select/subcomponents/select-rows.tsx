import { Select as BaseSelect } from '@base-ui/react/select';
import type { ReactNode } from 'react';
import { partTestId } from '../../lib/utils.js';
import { SelectItemKind } from '../constants.js';
import styles from '../select.module.scss';
import type { SelectGroupChildType, SelectGroupItemType, SelectItemType } from '../types.js';
import { SelectRow } from './select-row.js';

/**
 * @access private
 */
export type SelectRowsProps = {
	items: readonly SelectItemType[];
	selectTestId: string | undefined;
	multiple: boolean;
};

type RowProps = Omit<SelectRowsProps, 'items'>;

function SelectSeparator(): ReactNode {
	return (
		<BaseSelect.Separator data-slot="select-separator" className={styles['select__separator']} />
	);
}

function renderChild(child: SelectGroupChildType, rowProps: RowProps): ReactNode {
	return child.type === SelectItemKind.Separator ? (
		<SelectSeparator key={`separator:${child.value}`} />
	) : (
		<SelectRow key={`item:${child.value}`} item={child} {...rowProps} />
	);
}

function SelectGroup({ group, ...rowProps }: RowProps & { group: SelectGroupItemType }): ReactNode {
	return (
		<BaseSelect.Group
			data-slot="select-group"
			data-testid={group.testId ?? partTestId(rowProps.selectTestId, `group-${group.value}`)}
			className={styles['select__group']}
		>
			<BaseSelect.GroupLabel
				data-slot="select-group-label"
				className={styles['select__group-label']}
			>
				{group.label}
			</BaseSelect.GroupLabel>
			{group.items.map((child) => renderChild(child, rowProps))}
		</BaseSelect.Group>
	);
}

/**
 * The rows, groups and separators of the list.
 *
 * @access private
 */
export function SelectRows({ items, ...rowProps }: SelectRowsProps): ReactNode {
	return items.map((item) =>
		item.type === SelectItemKind.Group ? (
			<SelectGroup key={`group:${item.value}`} group={item} {...rowProps} />
		) : (
			renderChild(item, rowProps)
		),
	);
}
