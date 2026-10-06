import { forwardRef } from 'react';
import { partTestId, type RejectedProps } from '../../lib/utils.js';
import styles from '../input.module.scss';
import type { InputProps } from '../types.js';
import { getReasonTooltip, splitAttributes, useFieldControl } from '../utils.js';
import { InputFrame, type InputMemberType } from './input-frame.js';

/**
 * @access private
 */
export type InputBaseProps = InputProps & {
	member?: InputMemberType;
};

/**
 * The plain `<input>` member: everything `Input` renders, and what `Input.Password` renders with
 * its own `type` and suffix.
 *
 * @access private
 */
export const InputBase = forwardRef<HTMLInputElement, InputBaseProps>(function InputBase(
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
		member,
		id,
		required,
		'aria-describedby': ariaDescribedBy,
		'aria-invalid': ariaInvalid,
		className: _className,
		style: _style,
		...props
	}: InputBaseProps & RejectedProps,
	ref,
) {
	const field = useFieldControl({ id, status, size, required, ariaDescribedBy, ariaInvalid });
	const { control, data } = splitAttributes(props);
	const isDisabled = disabled && !readOnly;
	const { reason, hasReasonAnchor } = getReasonTooltip({
		disabled,
		disabledTooltip,
		readOnly,
		readOnlyTooltip,
	});

	return (
		<InputFrame
			size={field.size}
			variant={variant}
			status={field.status}
			noFocusRing={noFocusRing}
			disabled={isDisabled}
			readOnly={readOnly}
			member={member}
			width={width}
			maxWidth={maxWidth}
			testId={testId}
			dataAttributes={data}
			prefix={prefix}
			suffix={suffix}
			reason={reason}
			hasReasonAnchor={hasReasonAnchor}
		>
			<input
				{...control}
				ref={ref}
				id={field.id}
				required={field.required}
				disabled={isDisabled}
				readOnly={readOnly}
				aria-describedby={field.ariaDescribedBy}
				aria-invalid={field.ariaInvalid}
				className={styles['input__field']}
				data-slot="input-field"
				data-testid={partTestId(testId, 'field')}
			/>
		</InputFrame>
	);
});
