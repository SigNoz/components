import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import { ChevronDown } from '@signozhq/icons';
import {
	type AriaAttributes,
	forwardRef,
	type KeyboardEvent,
	type ReactNode,
	type Ref,
	useMemo,
} from 'react';
import { useIsLabelTruncated } from '../../lib/useIsLabelTruncated.js';
import { hasRenderableContent } from '../../lib/utils.js';
import { Spinner } from '../../spinner/spinner.js';
import { TooltipAnchor } from '../../tooltip/subcomponents/tooltip-anchor.js';
import { TooltipStack } from '../../tooltip/subcomponents/tooltip-stack.js';
import {
	hasTooltipContent,
	type TooltipContentStackEntry,
} from '../../tooltip/tooltip-content-stack-context.js';
import { COMBOBOX_EMPTY_LABEL } from '../constants.js';
import styles from '../combobox.module.scss';
import type { ComboboxOptionItemType } from '../types.js';
import { ComboboxChips } from './combobox-chips.js';

/**
 * @access private
 */
export type ComboboxTriggerProps = {
	forwardedProps: AriaAttributes & { [key: `data-${string}`]: unknown };
	id: string | undefined;
	accessibleName: string | undefined;
	labelledBy: string | undefined;
	multiple: boolean;
	values: readonly string[];
	options: ReadonlyMap<string, ComboboxOptionItemType>;
	displayValue: ((item: ComboboxOptionItemType | undefined) => ReactNode) | undefined;
	placeholder: string;
	maxDisplayedPills: number | undefined;
	disabled: boolean;
	disabledTooltip: ReactNode;
	readOnly: boolean;
	readOnlyTooltip: ReactNode;
	loading: boolean;
	testId: string | undefined;
	onRemove: (value: string) => void;
	onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
};

/**
 * The field: the selected row's prefix and value, or the chips, the trailing glyph, and the
 * tooltip that carries the disabled or read-only reason and the truncated value.
 *
 * @access private
 */
export const ComboboxTrigger = forwardRef<HTMLElement, ComboboxTriggerProps>(
	function ComboboxTrigger(props, ref) {
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
			onKeyDown,
		} = props;

		function resolveLabel(selected: string): ReactNode {
			const option = options.get(selected);

			if (option === undefined) {
				return selected;
			}

			const label = option.displayValue ?? option.label;

			return hasRenderableContent(label) ? label : COMBOBOX_EMPTY_LABEL;
		}

		const selected = values[0];
		const singleContent: ReactNode = displayValue
			? displayValue(selected === undefined ? undefined : options.get(selected))
			: selected === undefined
				? undefined
				: resolveLabel(selected);
		const hasValue = multiple ? values.length > 0 : hasRenderableContent(singleContent);
		// The `displayValue` prop decides the whole trigger, so it drops the row's prefix too.
		const prefix =
			multiple || displayValue || selected === undefined
				? undefined
				: options.get(selected)?.prefix;

		const [isValueTruncated, valueRef] = useIsLabelTruncated(!multiple && hasValue);
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
				stack.push({ id: 'value', content: singleContent });
			}

			return stack.length === 0 ? null : <TooltipStack items={stack} />;
		}, [
			hasDisabledTooltip,
			disabledTooltip,
			hasReadOnlyTooltip,
			readOnlyTooltip,
			isValueTruncated,
			singleContent,
		]);

		const content = multiple ? (
			hasValue ? (
				<ComboboxChips
					values={values}
					resolveLabel={resolveLabel}
					maxDisplayed={maxDisplayedPills}
					removable={!disabled && !readOnly}
					onRemove={onRemove}
					comboboxTestId={testId}
				/>
			) : (
				<span data-slot="combobox-placeholder" className={styles['combobox__placeholder']}>
					{placeholder}
				</span>
			)
		) : (
			<span
				ref={valueRef}
				data-slot={hasValue ? 'combobox-value' : 'combobox-placeholder'}
				className={hasValue ? styles['combobox__value'] : styles['combobox__placeholder']}
			>
				{hasValue ? singleContent : placeholder}
			</span>
		);

		const trigger = (
			<BaseCombobox.Trigger
				{...forwardedProps}
				ref={ref as Ref<HTMLButtonElement>}
				id={id}
				nativeButton={!multiple}
				{...(multiple ? { render: <div /> } : {})}
				data-slot="combobox-trigger"
				aria-label={accessibleName}
				aria-labelledby={labelledBy}
				aria-disabled={disabled || undefined}
				aria-readonly={readOnly || undefined}
				data-disabled={disabled || undefined}
				data-readonly={readOnly || undefined}
				className={styles['combobox__trigger']}
				onKeyDown={onKeyDown}
				{...(testId === undefined ? {} : { 'data-testid': testId })}
			>
				{prefix !== undefined && (
					<span
						data-slot="combobox-value-prefix"
						aria-hidden
						className={styles['combobox__value-prefix']}
					>
						{prefix}
					</span>
				)}
				{content}
				<span
					data-slot={loading ? 'combobox-spinner' : 'combobox-icon'}
					aria-hidden
					className={styles['combobox__icon']}
				>
					{loading ? <Spinner size={14} /> : <ChevronDown />}
				</span>
			</BaseCombobox.Trigger>
		);

		if (disabledTooltip == null && readOnlyTooltip == null && multiple) {
			return trigger;
		}

		// Wrapped whenever a reason or a value can show, not only while one does, so toggling
		// `disabled` does not remount the trigger and drop its focus.
		return <TooltipAnchor content={tooltip}>{trigger}</TooltipAnchor>;
	},
);
