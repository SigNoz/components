import type * as React from 'react';
import { TooltipSimple } from '../../../../tooltip/index.js';
import { ComboboxPill } from '../../../subcomponents/combobox-pill.js';

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
		<span
			data-slot="combobox-pills"
			style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', alignItems: 'center' }}
		>
			{displayedValues.map((v) => (
				<ComboboxPill key={v} value={v} onRemove={onRemove}>
					{resolveLabel(v)}
				</ComboboxPill>
			))}
			{overflowCount > 0 && (
				<TooltipSimple title={hiddenValues.map((v) => resolveLabel(v)).join(', ')}>
					<span
						data-slot="combobox-pill-overflow"
						style={{
							display: 'inline-flex',
							alignItems: 'center',
							justifyContent: 'center',
							height: '1.25rem',
							padding: '0 0.5rem',
							borderRadius: '2px',
							backgroundColor: 'var(--muted)',
							color: 'var(--muted-foreground)',
							fontSize: '0.75rem',
							fontWeight: 500,
							cursor: 'default',
						}}
					>
						+{overflowCount}
					</span>
				</TooltipSimple>
			)}
		</span>
	);
}
