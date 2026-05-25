import * as React from 'react';
import { cn, type Simplify } from '../lib/utils.js';
import styles from './textarea.module.scss';

/** Height preset for the textarea. `small` = compact, `middle` = default, `large` = roomy. */
export type TextareaSize = 'small' | 'middle' | 'large';

/** Validation surface — paints a colored border and matching focus ring. */
export type TextareaStatus = 'error' | 'warning';

/**
 * Auto-grow config.
 * - `true` — grow with content, unbounded.
 * - `{ minRows, maxRows }` — clamp between row counts. When the content exceeds
 *   `maxRows`, the textarea scrolls internally.
 *
 * Implemented in pure CSS via a grid layout where a hidden `::after`
 * pseudo-element replicates the current value. The grid cell auto-sizes to the
 * larger of the two, so the textarea grows with content without any JS
 * measurement.
 */
export type TextareaAutoSize = boolean | { minRows?: number; maxRows?: number };

type BaseProps = {
	/** Height preset. Default: `'middle'`. */
	size?: TextareaSize;
	/** Validation status — paints an error or warning border. */
	status?: TextareaStatus;
	/** Auto-grow with content. See {@link TextareaAutoSize}. */
	autoSize?: TextareaAutoSize;
	/** Class applied to the outer wrapper (carries border, background, focus ring). */
	rootClassName?: string;
	/** Convenience alias for `data-testid` on the underlying `<textarea>`. Takes precedence over `data-testid`. */
	testId?: string;
	/** Standard `data-testid` passthrough on the underlying `<textarea>`. */
	'data-testid'?: string;
} & Pick<
	React.ComponentPropsWithoutRef<'textarea'>,
	| 'id'
	| 'name'
	| 'className'
	| 'style'
	| 'value'
	| 'defaultValue'
	| 'placeholder'
	| 'rows'
	| 'cols'
	| 'wrap'
	| 'disabled'
	| 'readOnly'
	| 'autoFocus'
	| 'autoComplete'
	| 'required'
	| 'maxLength'
	| 'minLength'
	| 'form'
	| 'tabIndex'
	| 'onChange'
	| 'onFocus'
	| 'onBlur'
	| 'onKeyDown'
	| 'onKeyUp'
	| 'onInput'
	| 'onPaste'
	| 'onSelect'
	| 'onClick'
> &
	React.AriaAttributes;

/** Props accepted by {@link Textarea}. */
export type TextareaProps = Simplify<BaseProps>;

const isAutoSizeObject = (
	value: TextareaAutoSize | undefined
): value is { minRows?: number; maxRows?: number } =>
	value !== undefined && typeof value === 'object';

/**
 * Multi-line text input with an AntD-compatible prop surface.
 *
 * Mirrors `Input` styling via shared tokens and exposes an `autoSize` mode
 * that grows the field with content between optional `minRows`/`maxRows`
 * bounds. Auto-grow is implemented purely in CSS using a grid + pseudo-element
 * "replicated value" trick — no JS measurement, no `scrollHeight` reads.
 *
 * Also exported as `Input.TextArea` for AntD drop-in compatibility.
 *
 * @example Fixed-row textarea
 * ```tsx
 * <Input.TextArea rows={4} placeholder="Write your feedback here..." />
 * ```
 *
 * @example Controlled with auto-grow
 * ```tsx
 * <Input.TextArea
 *   value={value}
 *   onChange={(e) => setValue(e.target.value)}
 *   autoSize={{ minRows: 1, maxRows: 6 }}
 * />
 * ```
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>((props, ref) => {
	const {
		size = 'middle',
		status,
		autoSize,
		rootClassName,
		className,
		testId,
		'data-testid': dataTestId,
		value,
		defaultValue,
		onChange,
		rows,
		disabled,
		readOnly,
		...rest
	} = props;

	// Track the current value so the `::after` mirror always reflects what the
	// user sees, in both controlled and uncontrolled modes.
	const [trackedValue, setTrackedValue] = React.useState<string>(() =>
		defaultValue !== undefined && defaultValue !== null ? String(defaultValue) : ''
	);

	const isControlled = value !== undefined;
	const replicated = isControlled
		? value === null || value === undefined
			? ''
			: String(value)
		: trackedValue;

	const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		if (!isControlled) setTrackedValue(event.target.value);
		onChange?.(event);
	};

	const autoSizeOn = autoSize !== undefined && autoSize !== false;
	const cfg = isAutoSizeObject(autoSize) ? autoSize : {};
	const minRows = cfg.minRows;
	const maxRows = cfg.maxRows;

	const wrapperVars: React.CSSProperties & Record<string, string | number> = {};
	if (maxRows !== undefined) wrapperVars['--textarea-max-rows'] = maxRows;

	// Native `rows` attribute drives the minimum height. When autoSize is on,
	// prefer explicit `minRows` (1 if unset) so the floor doesn't depend on the
	// browser default of 2.
	const resolvedRows = autoSizeOn ? (minRows ?? rows ?? 1) : rows;

	return (
		<div
			className={cn(styles['textarea-wrap'], rootClassName)}
			data-size={size}
			data-status={status}
			data-autosize={autoSizeOn || undefined}
			data-has-max={maxRows !== undefined || undefined}
			data-disabled={disabled || undefined}
			data-readonly={readOnly || undefined}
			data-replicated-value={autoSizeOn ? `${replicated} ` : undefined}
			style={wrapperVars}
		>
			<textarea
				ref={ref}
				className={cn(styles['textarea'], className)}
				data-testid={testId ?? dataTestId}
				value={value}
				defaultValue={defaultValue}
				onChange={handleChange}
				rows={resolvedRows}
				disabled={disabled}
				readOnly={readOnly}
				{...rest}
			/>
		</div>
	);
});
Textarea.displayName = 'Textarea';
