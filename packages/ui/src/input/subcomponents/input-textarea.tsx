import { forwardRef } from 'react';
import { partTestId, type RejectedProps } from '../../lib/utils.js';
import styles from '../input.module.scss';
import type { InputTextAreaProps } from '../types.js';
import { getReasonTooltip, splitAttributes } from '../utils.js';
import { InputFrame } from './input-frame.js';

/**
 * A multi-line text field. Reached as `Input.TextArea`, not imported on its own.
 *
 * The frame grows with its rows instead of taking the fixed field height, and aligns the status
 * icon with the first line. There are no `prefix` and `suffix` slots: adornments belong to a
 * one-line field. Everything else is `Input`.
 *
 * `rows` is the native attribute and sets the starting height. The field resizes vertically by
 * hand; `--input-textarea-resize` turns that off.
 *
 * @example
 * ```tsx
 * <Input.TextArea rows={4} placeholder="Describe the incident..." />
 * ```
 */
export const InputTextArea = forwardRef<HTMLTextAreaElement, InputTextAreaProps>(
	function InputTextArea(
		{
			size,
			variant = 'default',
			status,
			noFocusRing = false,
			disabled = false,
			disabledTooltip,
			readOnly = false,
			readOnlyTooltip,
			width,
			maxWidth,
			testId,
			id,
			required,
			'aria-describedby': ariaDescribedBy,
			'aria-invalid': ariaInvalid,
			className: _className,
			style: _style,
			...props
		}: InputTextAreaProps & RejectedProps,
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

		return (
			<InputFrame
				size={resolvedSize}
				variant={variant}
				status={status}
				noFocusRing={noFocusRing}
				disabled={isDisabled}
				readOnly={readOnly}
				member="textarea"
				width={width}
				maxWidth={maxWidth}
				testId={testId}
				dataAttributes={data}
				prefix={null}
				suffix={null}
				reason={reason}
				hasReasonAnchor={hasReasonAnchor}
			>
				<textarea
					{...control}
					ref={ref}
					id={id}
					required={required}
					disabled={isDisabled}
					readOnly={readOnly}
					aria-describedby={ariaDescribedBy}
					aria-invalid={resolvedInvalid}
					className={styles['input__field']}
					data-slot="input-field"
					data-testid={partTestId(testId, 'field')}
				/>
			</InputFrame>
		);
	},
);

InputTextArea.displayName = 'Input.TextArea';
