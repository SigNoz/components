import { X } from '@signozhq/icons';
import type { MouseEvent, PointerEvent, ReactNode } from 'react';
import { toSearchText } from '../../lib/search-text.js';
import { partTestId } from '../../lib/utils.js';
import { TooltipAnchor } from '../../tooltip/subcomponents/tooltip-anchor.js';
import { hasTooltipContent } from '../../tooltip/tooltip-content-stack-context.js';
import { TooltipTriggerBoundary } from '../../tooltip/tooltip-trigger-context.js';
import styles from '../combobox.module.scss';
import type { ComboboxOptionItemType } from '../types.js';

/**
 * @access private
 */
export type ComboboxChipsProps = {
	values: readonly string[];
	resolveLabel: (value: string) => ReactNode;
	maxDisplayed: number | undefined;
	options: ReadonlyMap<string, ComboboxOptionItemType>;
	/**
	 * False while the whole combobox is disabled or read-only, whose own reason the trigger shows.
	 */
	removable: boolean;
	onRemove: (value: string) => void;
	comboboxTestId: string | undefined;
};

// The chips sit inside the trigger, which opens the popup on press. A press on a remove button must
// stop at the button.
function stopPress(event: MouseEvent | PointerEvent): void {
	event.stopPropagation();
}

/**
 * The selected values of a multiple combobox, as chips inside the trigger.
 *
 * A remove button is not a focus stop, so the trigger stays the only one. From the keyboard, a
 * value is removed by unticking its row in the popup.
 *
 * A value whose row is `disabled` is locked: its chip has no remove button and shows the row's
 * `disabledTooltip` instead.
 *
 * @access private
 */
export function ComboboxChips({
	values,
	resolveLabel,
	maxDisplayed,
	options,
	removable,
	onRemove,
	comboboxTestId,
}: ComboboxChipsProps): ReactNode {
	const shown = maxDisplayed === undefined ? values : values.slice(0, Math.max(0, maxDisplayed));
	const hidden = values.slice(shown.length);

	return (
		<span data-slot="combobox-chips" className={styles['combobox__chips']}>
			{shown.map((value) => {
				const label = resolveLabel(value);
				const testId = partTestId(comboboxTestId, `chip-${value}`);
				const option = options.get(value);
				const isLocked = option?.disabled === true;

				const chip = (
					<span
						key={value}
						data-slot="combobox-chip"
						data-disabled={isLocked || undefined}
						className={styles['combobox__chip']}
						{...(testId === undefined ? {} : { 'data-testid': testId })}
					>
						<span className={styles['combobox__chip-label']}>{label}</span>
						{removable && !isLocked && (
							<button
								type="button"
								tabIndex={-1}
								data-slot="combobox-chip-remove"
								aria-label={`Remove ${toSearchText(label) || value}`}
								className={styles['combobox__chip-remove']}
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

				if (!removable || !isLocked || !hasTooltipContent(option.disabledTooltip)) {
					return chip;
				}

				// The trigger's own tooltip only has content while the combobox is disabled or
				// read-only, when no chip shows a reason, so the two never open on the same hover.
				return (
					<TooltipTriggerBoundary key={value}>
						<TooltipAnchor content={option.disabledTooltip}>{chip}</TooltipAnchor>
					</TooltipTriggerBoundary>
				);
			})}
			{hidden.length > 0 && (
				<TooltipAnchor
					content={hidden.map((value) => toSearchText(resolveLabel(value)) || value).join(', ')}
				>
					<span
						data-slot="combobox-chip-overflow"
						className={styles['combobox__chip']}
						data-testid={partTestId(comboboxTestId, 'chip-overflow')}
					>
						+{hidden.length}
					</span>
				</TooltipAnchor>
			)}
		</span>
	);
}
