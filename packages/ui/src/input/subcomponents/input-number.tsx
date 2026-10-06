import { NumberField as NumberFieldPrimitive } from '@base-ui/react/number-field';
import { ChevronDown, ChevronUp } from '@signozhq/icons';
import { forwardRef } from 'react';
import { partTestId, type RejectedProps } from '../../lib/utils.js';
import { TooltipAnchor } from '../../tooltip/subcomponents/tooltip-anchor.js';
import styles from '../input.module.scss';
import type { InputNumberProps } from '../types.js';
import { getReasonTooltip, splitAttributes } from '../utils.js';
import { getFrameAttributes, InputFrameSlots } from './input-frame.js';

/**
 * A numeric field (Base UI `NumberField`). Reached as `Input.Number`, not imported on its own.
 *
 * The value is a number, not a string: `onChange` reports the parsed value, `null` while the field
 * is empty. Typing, the step buttons, the arrow keys (`Shift` for `largeStep`, `Home` and `End`
 * for the range ends) and `format` parsing are Base UI's.
 *
 * Not a target for react-hook-form's `register()` spread, whose `onChange` carries the event, not
 * the value. Use a controlled `Controller` instead.
 *
 * The step buttons are out of the tab order, the way the arrows of a native `type="number"` are:
 * the keyboard already steps with the arrow keys.
 *
 * | `data-slot` | rendered | `data-testid` |
 * |---|---|---|
 * | `input-stepper` | with `controls`, holds the two buttons | none |
 * | `input-step-up` | with `controls`, disabled at `max` | `${testId}-step-up` |
 * | `input-step-down` | with `controls`, disabled at `min` | `${testId}-step-down` |
 *
 * @example
 * ```tsx
 * <Input.Number min={1} max={100} value={count} onChange={setCount} aria-label="Replica count" />
 * ```
 */
export const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(function InputNumber(
	{
		size,
		variant = 'default',
		status,
		prefix,
		suffix,
		noFocusRing = false,
		disabled = false,
		disabledTooltip,
		readOnly = false,
		readOnlyTooltip,
		width,
		maxWidth,
		testId,
		id,
		name,
		form,
		placeholder,
		required,
		autoFocus,
		tabIndex,
		value,
		defaultValue,
		onChange,
		onAfterChange,
		min,
		max,
		step,
		largeStep,
		snapOnStep,
		format,
		locale,
		controls = true,
		onBlur,
		onFocus,
		onKeyDown,
		'aria-describedby': ariaDescribedBy,
		'aria-invalid': ariaInvalid,
		className: _className,
		style: _style,
		...props
	}: InputNumberProps & RejectedProps,
	ref,
) {
	const resolvedSize = size ?? 'base';
	const resolvedInvalid = ariaInvalid ?? (status === 'danger' ? true : undefined);
	const { control, data } = splitAttributes(props);
	const isDisabled = disabled && !readOnly;
	const { reason, hasReasonAnchor } = getReasonTooltip({
		disabled,
		disabledTooltip,
		readOnly,
		readOnlyTooltip,
	});

	const numberField = (
		<NumberFieldPrimitive.Root
			className={styles['input__number-root']}
			id={id}
			value={value}
			defaultValue={defaultValue}
			onValueChange={onChange && ((next) => onChange(next))}
			onValueCommitted={onAfterChange && ((next) => onAfterChange(next))}
			min={min}
			max={max}
			step={step}
			largeStep={largeStep}
			snapOnStep={snapOnStep}
			format={format}
			locale={locale}
			required={required}
			disabled={isDisabled}
			readOnly={readOnly}
			name={name}
			form={form}
		>
			<NumberFieldPrimitive.Group
				{...getFrameAttributes({
					size: resolvedSize,
					variant,
					status: status,
					noFocusRing,
					disabled: isDisabled,
					readOnly,
					member: 'number',
					width,
					maxWidth,
					testId,
					dataAttributes: data,
				})}
			>
				<InputFrameSlots prefix={prefix} suffix={suffix} status={status} testId={testId}>
					<NumberFieldPrimitive.Input
						{...control}
						ref={ref}
						placeholder={placeholder}
						autoFocus={autoFocus}
						tabIndex={tabIndex}
						onBlur={onBlur}
						onFocus={onFocus}
						onKeyDown={onKeyDown}
						aria-describedby={ariaDescribedBy}
						aria-invalid={resolvedInvalid}
						className={styles['input__field']}
						data-slot="input-field"
						data-testid={partTestId(testId, 'field')}
					/>
				</InputFrameSlots>
				{controls && (
					<span className={styles['input__stepper']} data-slot="input-stepper">
						<NumberFieldPrimitive.Increment
							className={styles['input__step-button']}
							data-slot="input-step-up"
							data-testid={partTestId(testId, 'step-up')}
							tabIndex={-1}
						>
							<ChevronUp aria-hidden="true" />
						</NumberFieldPrimitive.Increment>
						<NumberFieldPrimitive.Decrement
							className={styles['input__step-button']}
							data-slot="input-step-down"
							data-testid={partTestId(testId, 'step-down')}
							tabIndex={-1}
						>
							<ChevronDown aria-hidden="true" />
						</NumberFieldPrimitive.Decrement>
					</span>
				)}
			</NumberFieldPrimitive.Group>
		</NumberFieldPrimitive.Root>
	);

	if (!hasReasonAnchor) {
		return numberField;
	}

	return <TooltipAnchor content={reason}>{numberField}</TooltipAnchor>;
});

InputNumber.displayName = 'Input.Number';
