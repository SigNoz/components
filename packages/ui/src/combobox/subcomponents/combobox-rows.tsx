import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import { type ReactNode, useEffect } from 'react';
import { partTestId } from '../../lib/utils.js';
import styles from '../combobox.module.scss';
import type { RenderedItemsReport } from '../use-rendered-items-report.js';
import {
	type ComboboxEntry,
	type ComboboxGroupEntry,
	flattenComboboxOptions,
	itemRowValues,
} from '../utils.js';
import { ComboboxRow } from './combobox-row.js';

/**
 * @access private
 */
export type ComboboxRowsProps = {
	entries: readonly ComboboxEntry[];
	comboboxTestId: string | undefined;
	multiple: boolean;
	createLabel: ((query: string) => ReactNode) | undefined;
};

/**
 * @access private
 */
export type ComboboxRowsRootProps = ComboboxRowsProps & {
	reportRenderedItems: RenderedItemsReport | undefined;
};

function ComboboxSeparator(): ReactNode {
	return (
		<BaseCombobox.Separator
			data-slot="combobox-separator"
			className={styles['combobox__separator']}
		/>
	);
}

function ComboboxGroup({
	entry,
	...rowProps
}: Omit<ComboboxRowsProps, 'entries'> & { entry: ComboboxGroupEntry }): ReactNode {
	return (
		<BaseCombobox.Group
			data-slot="combobox-group"
			data-testid={entry.testId ?? partTestId(rowProps.comboboxTestId, `group-${entry.value}`)}
			className={styles['combobox__group']}
		>
			<BaseCombobox.GroupLabel
				data-slot="combobox-group-label"
				className={styles['combobox__group-label']}
			>
				{entry.label}
			</BaseCombobox.GroupLabel>
			{entry.entries.map((child) =>
				child.kind === 'separator' ? (
					<ComboboxSeparator key={child.key} />
				) : (
					<ComboboxRow key={child.key} entry={child} {...rowProps} />
				),
			)}
		</BaseCombobox.Group>
	);
}

/**
 * The rows, groups and separators of a list that is not virtualized.
 *
 * @access private
 */
export function ComboboxRows({
	entries,
	reportRenderedItems,
	...rowProps
}: ComboboxRowsRootProps): ReactNode {
	// The values are worked out here rather than during render, so a combobox without
	// `onRenderedItemsChange` does not walk its rows again on every keystroke.
	useEffect(() => {
		reportRenderedItems?.(itemRowValues(flattenComboboxOptions(entries)));
	}, [entries, reportRenderedItems]);

	return entries.map((entry) => {
		if (entry.kind === 'separator') {
			return <ComboboxSeparator key={entry.key} />;
		}

		if (entry.kind === 'group') {
			return <ComboboxGroup key={entry.key} entry={entry} {...rowProps} />;
		}

		return <ComboboxRow key={entry.key} entry={entry} {...rowProps} />;
	});
}
