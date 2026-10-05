import { Select as BaseSelect } from '@base-ui/react/select';
import { ChevronDown } from '@signozhq/icons';
import { type AriaAttributes, forwardRef, type ReactNode, type Ref, useMemo } from 'react';
import { useIsLabelTruncated } from '../../lib/useIsLabelTruncated.js';
import { hasRenderableContent } from '../../lib/utils.js';
import { Spinner } from '../../spinner/spinner.js';
import { TooltipAnchor } from '../../tooltip/subcomponents/tooltip-anchor.js';
import { TooltipStack } from '../../tooltip/subcomponents/tooltip-stack.js';
import {
	hasTooltipContent,
	type TooltipContentStackEntry,
} from '../../tooltip/tooltip-content-stack-context.js';
import { SELECT_EMPTY_LABEL } from '../constants.js';
import styles from '../select.module.scss';
import type { SelectOptionItemType } from '../types.js';
import { SelectChips } from './select-chips.js';

/**
 * @access private
 */
export type SelectTriggerProps = {
	forwardedProps: AriaAttributes & { [key: `data-${string}`]: unknown };
	id: string | undefined;
	accessibleName: string | undefined;
	labelledBy: string | undefined;
	multiple: boolean;
	values: readonly string[];
	options: ReadonlyMap<string, SelectOptionItemType>;
	displayValue:
		| ((item: SelectOptionItemType | undefined) => ReactNode)
		| ((items: SelectOptionItemType[]) => ReactNode)
		| undefined;
	placeholder: string;
	maxDisplayedPills: number | undefined;
	disabled: boolean;
	disabledTooltip: ReactNode;
	readOnly: boolean;
	readOnlyTooltip: ReactNode;
	loading: boolean;
	testId: string | undefined;
	onRemove: (value: string) => void;
};

/**
 * The field: the selected row's prefix and value, or the chips, the trailing glyph, and the
 * tooltip that carries the disabled or read-only reason and the truncated value.
 *
 * @access private
 */
export const SelectTrigger = forwardRef<HTMLElement, SelectTriggerProps>(
	function SelectTrigger(props, ref) {
		const {
			forwardedProps,
			id,
			accessibleName,
			labelledBy,
			multiple,
			values,
			options,
			displayValue,
			placeholder,
			maxDisplayedPills,
			disabled,
			disabledTooltip,
			readOnly,
			readOnlyTooltip,
			loading,
			testId,
			onRemove,
		} = props;

		function resolveLabel(selected: string): ReactNode {
			const option = options.get(selected);

			if (option === undefined) {
				return selected;
			}

			const label = option.displayValue ?? option.label;

			return hasRenderableContent(label) ? label : SELECT_EMPTY_LABEL;
		}

		const selected = values[0];
		let custom: ReactNode;

		if (displayValue !== undefined) {
			custom = multiple
				? (displayValue as (items: SelectOptionItemType[]) => ReactNode)(
						values.flatMap((value) => options.get(value) ?? []),
					)
				: (displayValue as (item: SelectOptionItemType | undefined) => ReactNode)(
						selected === undefined ? undefined : options.get(selected),
					);
		}

		// Text replaces the chips, so it truncates and gets the tooltip like a single value.
		const showsText = !multiple || displayValue !== undefined;
		const text: ReactNode =
			displayValue !== undefined
				? custom
				: selected === undefined || multiple
					? undefined
					: resolveLabel(selected);
		const hasText = showsText && hasRenderableContent(text);
		// The `displayValue` prop decides the whole trigger, so it drops the row's prefix too.
		const prefix =
			multiple || displayValue !== undefined || selected === undefined
				? undefined
				: options.get(selected)?.prefix;

		const [isValueTruncated, valueRef] = useIsLabelTruncated(hasText);
		const hasDisabledTooltip = disabled && hasTooltipContent(disabledTooltip);
		const hasReadOnlyTooltip = !disabled && readOnly && hasTooltipContent(readOnlyTooltip);

		const tooltip = useMemo(() => {
			const stack: TooltipContentStackEntry[] = [];

			if (hasDisabledTooltip) {
				stack.push({ id: 'disabled-tooltip', content: disabledTooltip });
			}

			if (hasReadOnlyTooltip) {
				stack.push({ id: 'read-only-tooltip', content: readOnlyTooltip });
			}

			if (isValueTruncated) {
				stack.push({ id: 'value', content: text });
			}

			return stack.length === 0 ? null : <TooltipStack items={stack} />;
		}, [
			hasDisabledTooltip,
			disabledTooltip,
			hasReadOnlyTooltip,
			readOnlyTooltip,
			isValueTruncated,
			text,
		]);

		const content =
			!showsText && values.length > 0 ? (
				<SelectChips
					values={values}
					resolveLabel={resolveLabel}
					maxDisplayed={maxDisplayedPills}
					removable={!disabled && !readOnly}
					onRemove={onRemove}
					selectTestId={testId}
				/>
			) : (
				<span
					ref={valueRef}
					data-slot={hasText ? 'select-value' : 'select-placeholder'}
					className={hasText ? styles['select__value'] : styles['select__placeholder']}
				>
					{hasText ? text : placeholder}
				</span>
			);

		const trigger = (
			<BaseSelect.Trigger
				{...forwardedProps}
				ref={ref as Ref<HTMLButtonElement>}
				id={id}
				nativeButton={!multiple}
				{...(multiple ? { render: <div /> } : {})}
				data-slot="select-trigger"
				aria-label={accessibleName}
				aria-labelledby={labelledBy}
				aria-disabled={disabled || undefined}
				aria-readonly={readOnly || undefined}
				data-disabled={disabled || undefined}
				data-readonly={readOnly || undefined}
				className={styles['select__trigger']}
				{...(testId === undefined ? {} : { 'data-testid': testId })}
			>
				{prefix !== undefined && (
					<span
						data-slot="select-value-prefix"
						aria-hidden
						className={styles['select__value-prefix']}
					>
						{prefix}
					</span>
				)}
				{content}
				<span
					data-slot={loading ? 'select-spinner' : 'select-icon'}
					aria-hidden
					className={styles['select__icon']}
				>
					{loading ? <Spinner size={14} /> : <ChevronDown />}
				</span>
			</BaseSelect.Trigger>
		);

		if (disabledTooltip == null && readOnlyTooltip == null && !showsText) {
			return trigger;
		}

		// Wrapped whenever a reason or a value can show, not only while one does, so toggling
		// `disabled` does not remount the trigger and drop its focus.
		return <TooltipAnchor content={tooltip}>{trigger}</TooltipAnchor>;
	},
);
