import { X } from '@signozhq/icons';
import type { MouseEvent, PointerEvent, ReactNode } from 'react';
import { toSearchText } from '../../lib/search-text.js';
import { partTestId } from '../../lib/utils.js';
import { TooltipAnchor } from '../../tooltip/subcomponents/tooltip-anchor.js';
import styles from '../select.module.scss';

/**
 * @access private
 */
export type SelectChipsProps = {
	values: readonly string[];
	resolveLabel: (value: string) => ReactNode;
	maxDisplayed: number | undefined;
	removable: boolean;
	onRemove: (value: string) => void;
	selectTestId: string | undefined;
};

// The chips sit inside the trigger, which opens the popup on press. A press on a remove button must
// stop at the button.
function stopPress(event: MouseEvent | PointerEvent): void {
	event.stopPropagation();
}

/**
 * The selected values of a multiple select, as chips inside the trigger.
 *
 * A remove button is not a focus stop, so the trigger stays the only one. From the keyboard, a
 * value is removed by unticking its row in the popup.
 *
 * @access private
 */
export function SelectChips({
	values,
	resolveLabel,
	maxDisplayed,
	removable,
	onRemove,
	selectTestId,
}: SelectChipsProps): ReactNode {
	const shown = maxDisplayed === undefined ? values : values.slice(0, Math.max(0, maxDisplayed));
	const hidden = values.slice(shown.length);

	return (
		<span data-slot="select-chips" className={styles['select__chips']}>
			{shown.map((value) => {
				const label = resolveLabel(value);
				const testId = partTestId(selectTestId, `chip-${value}`);

				return (
					<span
						key={value}
						data-slot="select-chip"
						className={styles['select__chip']}
						{...(testId === undefined ? {} : { 'data-testid': testId })}
					>
						<span className={styles['select__chip-label']}>{label}</span>
						{removable && (
							<button
								type="button"
								tabIndex={-1}
								data-slot="select-chip-remove"
								aria-label={`Remove ${toSearchText(label) || value}`}
								className={styles['select__chip-remove']}
								onPointerDown={stopPress}
								onMouseDown={stopPress}
								onClick={(event) => {
									event.stopPropagation();
									onRemove(value);
								}}
								{...(testId === undefined ? {} : { 'data-testid': `${testId}-remove` })}
							>
								<X />
							</button>
						)}
					</span>
				);
			})}
			{hidden.length > 0 && (
				<TooltipAnchor
					content={hidden.map((value) => toSearchText(resolveLabel(value)) || value).join(', ')}
				>
					<span
						data-slot="select-chip-overflow"
						className={styles['select__chip']}
						data-testid={partTestId(selectTestId, 'chip-overflow')}
					>
						+{hidden.length}
					</span>
				</TooltipAnchor>
			)}
		</span>
	);
}
