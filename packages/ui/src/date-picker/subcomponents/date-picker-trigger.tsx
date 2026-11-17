import { Popover as BasePopover } from '@base-ui/react/popover';
import { Calendar as CalendarIcon } from '@signozhq/icons';
import {
	type AriaAttributes,
	forwardRef,
	type KeyboardEvent,
	type ReactNode,
	useMemo,
} from 'react';
import { useIsLabelTruncated } from '../../lib/useIsLabelTruncated.js';
import { TooltipAnchor } from '../../tooltip/subcomponents/tooltip-anchor.js';
import { TooltipStack } from '../../tooltip/subcomponents/tooltip-stack.js';
import {
	hasTooltipContent,
	type TooltipContentStackEntry,
} from '../../tooltip/tooltip-content-stack-context.js';
import { DATE_PICKER_EMPTY_LABEL } from '../constants.js';
import styles from '../date-picker.module.scss';

/**
 * @access private
 */
export type DatePickerTriggerProps = {
	forwardedProps: AriaAttributes & { [key: `data-${string}`]: unknown };
	id: string | undefined;
	accessibleName: string | undefined;
	labelledBy: string | undefined;
	/**
	 * The formatted value, `undefined` without a value.
	 */
	text: string | undefined;
	placeholder: string;
	open: boolean;
	showTime: boolean;
	showTimezone: boolean;
	required: boolean;
	disabled: boolean;
	disabledTooltip: ReactNode;
	readOnly: boolean;
	readOnlyTooltip: ReactNode;
	testId: string | undefined;
	onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
};

/**
 * The field: the formatted value or the placeholder and the calendar icon, and the tooltip that
 * carries the read-only or disabled reason and the truncated value.
 *
 * @access private
 */
export const DatePickerTrigger = forwardRef<HTMLButtonElement, DatePickerTriggerProps>(
	function DatePickerTrigger(props, ref) {
		const {
			forwardedProps,
			id,
			accessibleName,
			labelledBy,
			text,
			placeholder,
			open,
			showTime,
			showTimezone,
			required,
			disabled,
			disabledTooltip,
			readOnly,
			readOnlyTooltip,
			testId,
			onKeyDown,
		} = props;

		const hasValue = text !== undefined;
		const isEmptyLabel = text === '';
		const shownText = isEmptyLabel ? DATE_PICKER_EMPTY_LABEL : text;
		// `readOnly` outranks `disabled`: with both, the date picker is only read-only.
		const isDisabled = disabled && !readOnly;

		const [isValueTruncated, valueRef] = useIsLabelTruncated(true);
		const hasReadOnlyTooltip = readOnly && hasTooltipContent(readOnlyTooltip);
		const hasDisabledTooltip = isDisabled && hasTooltipContent(disabledTooltip);
		const truncatedText = isValueTruncated ? (shownText ?? placeholder) : undefined;

		const tooltip = useMemo(() => {
			const stack: TooltipContentStackEntry[] = [];

			if (hasReadOnlyTooltip) {
				stack.push({ id: 'read-only-tooltip', content: readOnlyTooltip });
			}

			if (hasDisabledTooltip) {
				stack.push({ id: 'disabled-tooltip', content: disabledTooltip });
			}

			if (truncatedText !== undefined) {
				stack.push({ id: 'value', content: truncatedText });
			}

			return stack.length === 0 ? null : <TooltipStack items={stack} />;
		}, [hasReadOnlyTooltip, readOnlyTooltip, hasDisabledTooltip, disabledTooltip, truncatedText]);

		return (
			<TooltipAnchor content={tooltip}>
				<BasePopover.Trigger
					{...forwardedProps}
					ref={ref}
					id={id}
					type="button"
					// eslint-disable-next-line jsx-a11y/role-has-required-aria-props, jsx-a11y/prefer-tag-over-role -- Base UI writes `aria-expanded` and `aria-controls`, and the field is a button the way the Select trigger is.
					role="combobox"
					data-slot="date-picker-trigger"
					aria-label={accessibleName}
					aria-labelledby={labelledBy}
					aria-disabled={isDisabled || undefined}
					aria-readonly={readOnly || undefined}
					aria-required={required || undefined}
					data-disabled={isDisabled || undefined}
					data-readonly={readOnly || undefined}
					data-popup-open={open || undefined}
					data-show-time={showTime || undefined}
					data-show-timezone={showTimezone || undefined}
					data-empty={!hasValue || undefined}
					data-empty-label={isEmptyLabel || undefined}
					className={styles['date-picker__trigger']}
					onKeyDown={onKeyDown}
					{...(testId === undefined ? {} : { 'data-testid': testId })}
				>
					<span
						ref={valueRef}
						data-slot={hasValue ? 'date-picker-value' : 'date-picker-placeholder'}
						data-truncated={isValueTruncated || undefined}
						className={hasValue ? styles['date-picker__value'] : styles['date-picker__placeholder']}
					>
						{hasValue ? shownText : placeholder}
					</span>
					<span data-slot="date-picker-icon" aria-hidden className={styles['date-picker__icon']}>
						<CalendarIcon />
					</span>
				</BasePopover.Trigger>
			</TooltipAnchor>
		);
	},
);
