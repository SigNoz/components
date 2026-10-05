import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import { Check, Plus } from '@signozhq/icons';
import { type ReactNode, useMemo } from 'react';
import { useIsLabelTruncated } from '../../lib/useIsLabelTruncated.js';
import { hasRenderableContent, partTestId } from '../../lib/utils.js';
import { TooltipAnchor } from '../../tooltip/subcomponents/tooltip-anchor.js';
import { TooltipStack } from '../../tooltip/subcomponents/tooltip-stack.js';
import {
	hasTooltipContent,
	type TooltipContentStackEntry,
} from '../../tooltip/tooltip-content-stack-context.js';
import { COMBOBOX_EMPTY_LABEL } from '../constants.js';
import styles from '../combobox.module.scss';
import type { ComboboxOptionEntry } from '../utils.js';

/**
 * @access private
 */
export type ComboboxRowProps = {
	entry: ComboboxOptionEntry;
	comboboxTestId: string | undefined;
	multiple: boolean;
	createLabel: ((query: string) => ReactNode) | undefined;
	/**
	 * The row's position among the rows the user can pick. Only the virtual list passes it: Base UI
	 * reads the index off the DOM otherwise.
	 */
	index?: number;
	/**
	 * How many rows the user can pick in the whole list, for the virtual list, where most of them
	 * are not mounted.
	 */
	setSize?: number;
};

type RowContent = {
	label: ReactNode;
	prefix: ReactNode;
	suffix: ReactNode;
	testId: string | undefined;
	disabled: boolean;
	disabledTooltip: ReactNode;
	selectable: boolean;
};

function describeRow(
	entry: ComboboxOptionEntry,
	comboboxTestId: string | undefined,
	createLabel: ((query: string) => ReactNode) | undefined,
): RowContent {
	switch (entry.kind) {
		case 'item':
			return {
				label: entry.item.label,
				prefix: entry.item.prefix,
				suffix: entry.item.suffix,
				testId: entry.item.testId ?? partTestId(comboboxTestId, `item-${entry.item.value}`),
				disabled: entry.item.disabled === true,
				disabledTooltip: entry.item.disabledTooltip,
				selectable: true,
			};
		case 'hint':
			return {
				label: entry.item.label,
				prefix: entry.item.prefix,
				suffix: undefined,
				testId: entry.item.testId ?? partTestId(comboboxTestId, `hint-${entry.item.value}`),
				disabled: false,
				disabledTooltip: undefined,
				selectable: false,
			};
		case 'create':
			return {
				label: createLabel ? createLabel(entry.query) : `Create "${entry.query}"`,
				prefix: <Plus />,
				suffix: undefined,
				testId: partTestId(comboboxTestId, 'create'),
				disabled: false,
				disabledTooltip: undefined,
				selectable: false,
			};
		case 'custom':
			return {
				label: entry.value,
				prefix: undefined,
				suffix: undefined,
				testId: partTestId(comboboxTestId, `custom-${entry.value}`),
				disabled: false,
				disabledTooltip: undefined,
				selectable: true,
			};
	}
}

/**
 * One row the user can pick: an `item`, a hint, the create row or a custom value.
 *
 * @access private
 */
export function ComboboxRow({
	entry,
	comboboxTestId,
	multiple,
	createLabel,
	index,
	setSize,
}: ComboboxRowProps): ReactNode {
	const row = describeRow(entry, comboboxTestId, createLabel);
	const isLabelEmpty = !hasRenderableContent(row.label);
	const label = isLabelEmpty ? COMBOBOX_EMPTY_LABEL : row.label;
	const [isLabelTruncated, labelRef] = useIsLabelTruncated(true);
	const hasDisabledTooltip = row.disabled && hasTooltipContent(row.disabledTooltip);

	const tooltipContent = useMemo(() => {
		const entries: TooltipContentStackEntry[] = [];

		if (hasDisabledTooltip) {
			entries.push({ id: 'disabled-tooltip', content: row.disabledTooltip });
		}

		if (isLabelTruncated) {
			entries.push({ id: 'label', content: label });
		}

		return entries.length === 0 ? null : <TooltipStack items={entries} />;
	}, [hasDisabledTooltip, row.disabledTooltip, isLabelTruncated, label]);

	return (
		<TooltipAnchor content={tooltipContent} contentProps={{ side: 'left' }}>
			<BaseCombobox.Item
				value={entry.value}
				index={index}
				disabled={row.disabled}
				aria-setsize={setSize}
				aria-posinset={setSize === undefined || index === undefined ? undefined : index + 1}
				data-slot="combobox-item"
				data-kind={entry.kind}
				aria-disabled={row.disabled || undefined}
				className={styles['combobox__item']}
				{...(row.testId === undefined ? {} : { 'data-testid': row.testId })}
			>
				{row.prefix !== undefined && (
					<span
						data-slot="combobox-item-prefix"
						data-testid={partTestId(row.testId, 'prefix')}
						className={styles['combobox__item-affix']}
					>
						{row.prefix}
					</span>
				)}
				<span
					ref={labelRef}
					data-slot="combobox-item-label"
					data-truncated={isLabelTruncated || undefined}
					data-empty-label={isLabelEmpty || undefined}
					className={styles['combobox__item-label']}
				>
					{label}
				</span>
				{row.suffix !== undefined && (
					<span
						data-slot="combobox-item-suffix"
						data-testid={partTestId(row.testId, 'suffix')}
						className={styles['combobox__item-affix']}
					>
						{row.suffix}
					</span>
				)}
				{row.selectable && (
					<span
						data-slot="combobox-item-indicator"
						aria-hidden
						className={
							multiple ? styles['combobox__item-control'] : styles['combobox__item-indicator']
						}
					>
						<Check
							className={
								multiple
									? styles['combobox__item-control-check']
									: styles['combobox__item-indicator-check']
							}
						/>
					</span>
				)}
			</BaseCombobox.Item>
		</TooltipAnchor>
	);
}
