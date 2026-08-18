import type * as React from 'react';
import { TooltipSimple } from '../../../../tooltip/index.js';
import { ComboboxPill } from '../../../subcomponents/combobox-pill.js';
import styles from '../../../combobox.module.scss';

export type ComboboxPillsProps = {
	values: string[];
	maxDisplayed?: number;
	resolveLabel: (value: string) => React.ReactNode;
	onRemove: (value: string) => void;
};

export function ComboboxPills({
	values,
	maxDisplayed,
	resolveLabel,
	onRemove,
}: ComboboxPillsProps): React.ReactElement | null {
	if (values.length === 0) return null;

	const displayedValues = maxDisplayed !== undefined ? values.slice(0, maxDisplayed) : values;
	const overflowCount = maxDisplayed !== undefined ? Math.max(0, values.length - maxDisplayed) : 0;
	const hiddenValues = values.slice(maxDisplayed);

	return (
		<span data-slot="combobox-pills" className={styles.combobox__pills}>
			{displayedValues.map((v) => (
				<ComboboxPill key={v} value={v} onRemove={onRemove}>
					{resolveLabel(v)}
				</ComboboxPill>
			))}
			{overflowCount > 0 && (
				<TooltipSimple title={hiddenValues.map((v) => resolveLabel(v)).join(', ')}>
					<span data-slot="combobox-pill-overflow" className={styles['combobox__pill-overflow']}>
						+{overflowCount}
					</span>
				</TooltipSimple>
			)}
		</span>
	);
}
