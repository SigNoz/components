import { ChevronDown, ChevronUp } from '@signozhq/icons';
import * as React from 'react';
import { cn, type Simplify } from '../lib/utils.js';
import styles from './input-number.module.scss';

export type InputNumberValue = number | null;

export type InputNumberSize = 'small' | 'middle' | 'large';
export type InputNumberVariant = 'outlined' | 'filled' | 'borderless' | 'underlined';
export type InputNumberStatus = 'error' | 'warning';
export type InputNumberMode = 'input' | 'spinner';

export type InputNumberControls =
	| boolean
	| { upIcon?: React.ReactNode; downIcon?: React.ReactNode };

export type InputNumberRef = {
	focus: (options?: {
		preventScroll?: boolean;
		cursor?: 'start' | 'end' | 'all';
	}) => void;
	blur: () => void;
	nativeElement: HTMLInputElement | null;
};

export type InputNumberStepInfo = {
	offset: number;
	type: 'up' | 'down';
	emitter: 'handler' | 'keydown' | 'wheel';
};

type BaseProps = {
	value?: InputNumberValue;
	defaultValue?: InputNumberValue;
	onChange?: (value: InputNumberValue) => void;

	min?: number;
	max?: number;
	step?: number | string;
	precision?: number;
	decimalSeparator?: string;

	formatter?: (
		value: number | string,
		info: { userTyping: boolean; input: string }
	) => string;
	parser?: (displayValue: string) => string;

	prefix?: React.ReactNode;
	suffix?: React.ReactNode;
	addonBefore?: React.ReactNode;
	addonAfter?: React.ReactNode;

	controls?: InputNumberControls;
	mode?: InputNumberMode;

	variant?: InputNumberVariant;
	size?: InputNumberSize;
	status?: InputNumberStatus;

	changeOnBlur?: boolean;
	changeOnWheel?: boolean;
	keyboard?: boolean;

	readOnly?: boolean;
	disabled?: boolean;
	autoFocus?: boolean;

	placeholder?: string;
	className?: string;
	rootClassName?: string;
	style?: React.CSSProperties;
	id?: string;
	name?: string;
	testId?: string;

	onPressEnter?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
	onStep?: (value: number, info: InputNumberStepInfo) => void;
	onBlur?: React.FocusEventHandler<HTMLInputElement>;
	onFocus?: React.FocusEventHandler<HTMLInputElement>;
	onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
	'aria-label'?: string;
};

export type InputNumberProps = Simplify<BaseProps>;

const DEFAULT_STEP = 1;

const isNumberLike = (value: unknown): value is number =>
	typeof value === 'number' && !Number.isNaN(value);

const clamp = (value: number, min: number | undefined, max: number | undefined): number => {
	let next = value;
	if (max !== undefined && next > max) next = max;
	if (min !== undefined && next < min) next = min;
	return next;
};

const isOutOfRange = (
	value: InputNumberValue,
	min: number | undefined,
	max: number | undefined
): boolean => {
	if (!isNumberLike(value)) return false;
	if (max !== undefined && value > max) return true;
	if (min !== undefined && value < min) return true;
	return false;
};

const roundToPrecision = (value: number, precision: number | undefined): number => {
	if (precision === undefined) return value;
	const factor = 10 ** precision;
	return Math.round(value * factor) / factor;
};

const formatForDisplay = (
	value: InputNumberValue,
	precision: number | undefined,
	decimalSeparator: string | undefined,
	formatter: InputNumberProps['formatter']
): string => {
	if (value === null || value === undefined) return '';
	let display: string =
		precision !== undefined ? value.toFixed(precision) : String(value);
	if (decimalSeparator) {
		display = display.replace('.', decimalSeparator);
	}
	if (formatter) {
		display = formatter(value, { userTyping: false, input: display });
	}
	return display;
};

const parseFromInput = (
	raw: string,
	decimalSeparator: string | undefined,
	parser: InputNumberProps['parser']
): InputNumberValue => {
	let work = raw;
	if (parser) work = parser(work);
	if (decimalSeparator) work = work.replaceAll(decimalSeparator, '.');
	if (work === '' || work === '-' || work === '.') return null;
	const parsed = Number(work);
	return Number.isNaN(parsed) ? null : parsed;
};

const resolveControls = (
	controls: InputNumberControls | undefined
): { enabled: boolean; upIcon: React.ReactNode; downIcon: React.ReactNode } => {
	if (controls === false) {
		return { enabled: false, upIcon: null, downIcon: null };
	}
	if (controls && typeof controls === 'object') {
		return {
			enabled: true,
			upIcon: controls.upIcon ?? <ChevronUp aria-hidden="true" />,
			downIcon: controls.downIcon ?? <ChevronDown aria-hidden="true" />,
		};
	}
	return {
		enabled: controls === true,
		upIcon: <ChevronUp aria-hidden="true" />,
		downIcon: <ChevronDown aria-hidden="true" />,
	};
};

/**
 * InputNumber — numeric input with prefix/suffix, addonBefore/addonAfter, optional spinner controls,
 * formatter/parser pipeline, and variants/sizes/status. Mirrors Ant Design's `InputNumber` API to make
 * migration straightforward.
 *
 * @example
 * ```tsx
 * <InputNumber min={0} max={100} step={1} value={value} onChange={setValue} />
 * ```
 *
 * @example
 * ```tsx
 * // Addon with a Select inside — borders join into a single control.
 * <InputNumber
 *   addonAfter={
 *     <Select defaultValue="GiB">
 *       <Select.Option value="GiB">GiB</Select.Option>
 *       <Select.Option value="TiB">TiB</Select.Option>
 *     </Select>
 *   }
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Formatter / parser for currency formatting.
 * <InputNumber
 *   formatter={(v) => `$ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
 *   parser={(v) => v.replace(/\$\s?|(,*)/g, '')}
 * />
 * ```
 */
export const InputNumber = React.forwardRef<InputNumberRef, InputNumberProps>(
	(props, ref) => {
		const {
			value: valueProp,
			defaultValue,
			onChange,

			min,
			max,
			step = DEFAULT_STEP,
			precision,
			decimalSeparator,

			formatter,
			parser,

			prefix,
			suffix,
			addonBefore,
			addonAfter,

			controls,
			mode = 'input',

			variant = 'outlined',
			size = 'middle',
			status,

			changeOnBlur = true,
			changeOnWheel,
			keyboard = true,

			readOnly,
			disabled,
			autoFocus,

			placeholder,
			className,
			rootClassName,
			style,
			id,
			name,
			testId,

			onPressEnter,
			onStep,
			onBlur,
			onFocus,
			onKeyDown,
			'aria-label': ariaLabel,
		} = props;

		const isControlled = valueProp !== undefined;
		const inputRef = React.useRef<HTMLInputElement | null>(null);
		const [internalValue, setInternalValue] = React.useState<InputNumberValue>(
			defaultValue ?? null
		);
		const value = isControlled ? (valueProp ?? null) : internalValue;

		const [displayValue, setDisplayValue] = React.useState<string>(() =>
			formatForDisplay(value, precision, decimalSeparator, formatter)
		);
		const [isFocused, setIsFocused] = React.useState(false);

		React.useEffect(() => {
			if (!isFocused) {
				setDisplayValue(formatForDisplay(value, precision, decimalSeparator, formatter));
			}
		}, [value, precision, decimalSeparator, formatter, isFocused]);

		React.useImperativeHandle(
			ref,
			() => ({
				focus: (options) => {
					if (!inputRef.current) return;
					inputRef.current.focus({ preventScroll: options?.preventScroll });
					const cursor = options?.cursor;
					if (cursor === 'start') {
						inputRef.current.setSelectionRange(0, 0);
					} else if (cursor === 'end') {
						const length = inputRef.current.value.length;
						inputRef.current.setSelectionRange(length, length);
					} else if (cursor === 'all') {
						inputRef.current.select();
					}
				},
				blur: () => inputRef.current?.blur(),
				get nativeElement() {
					return inputRef.current;
				},
			}),
			[]
		);

		const emitChange = React.useCallback(
			(next: InputNumberValue) => {
				if (!isControlled) setInternalValue(next);
				onChange?.(next);
			},
			[isControlled, onChange]
		);

		const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
			const raw = event.target.value;
			setDisplayValue(raw);
			const parsed = parseFromInput(raw, decimalSeparator, parser);
			if (parsed === null) {
				emitChange(null);
				return;
			}
			emitChange(roundToPrecision(parsed, precision));
		};

		const handleStep = (offset: number, emitter: InputNumberStepInfo['emitter']) => {
			if (disabled || readOnly) return;
			const stepValue = typeof step === 'string' ? Number(step) : step;
			if (!isNumberLike(stepValue)) return;
			const base = isNumberLike(value) ? value : 0;
			const next = roundToPrecision(
				clamp(base + offset * stepValue, min, max),
				precision
			);
			emitChange(next);
			setDisplayValue(formatForDisplay(next, precision, decimalSeparator, formatter));
			onStep?.(next, { offset: offset * stepValue, type: offset > 0 ? 'up' : 'down', emitter });
		};

		const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
			onKeyDown?.(event);
			if (event.defaultPrevented) return;
			if (event.key === 'Enter') {
				onPressEnter?.(event);
				return;
			}
			if (!keyboard) return;
			if (event.key === 'ArrowUp') {
				event.preventDefault();
				handleStep(1, 'keydown');
			} else if (event.key === 'ArrowDown') {
				event.preventDefault();
				handleStep(-1, 'keydown');
			}
		};

		const handleWheel = (event: React.WheelEvent<HTMLInputElement>) => {
			if (!changeOnWheel || !isFocused) return;
			event.preventDefault();
			handleStep(event.deltaY < 0 ? 1 : -1, 'wheel');
		};

		const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
			setIsFocused(true);
			onFocus?.(event);
		};

		const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
			setIsFocused(false);
			if (changeOnBlur && isNumberLike(value)) {
				const clamped = clamp(value, min, max);
				if (clamped !== value) {
					const next = roundToPrecision(clamped, precision);
					emitChange(next);
					setDisplayValue(formatForDisplay(next, precision, decimalSeparator, formatter));
				} else {
					setDisplayValue(formatForDisplay(value, precision, decimalSeparator, formatter));
				}
			} else {
				setDisplayValue(formatForDisplay(value, precision, decimalSeparator, formatter));
			}
			onBlur?.(event);
		};

		const controlsConfig = resolveControls(controls);
		const showControls = controlsConfig.enabled || mode === 'spinner';
		const outOfRange = isOutOfRange(value, min, max);
		const hasAddon = addonBefore !== undefined || addonAfter !== undefined;

		const inputElement = (
			<input
				ref={inputRef}
				type="text"
				inputMode="decimal"
				role="spinbutton"
				autoComplete="off"
				aria-valuemin={min}
				aria-valuemax={max}
				aria-valuenow={isNumberLike(value) ? value : undefined}
				aria-label={ariaLabel}
				className={cn(styles['input-number-input'], className)}
				value={
					isFocused
						? displayValue
						: formatForDisplay(value, precision, decimalSeparator, formatter)
				}
				placeholder={placeholder}
				disabled={disabled}
				readOnly={readOnly}
				autoFocus={autoFocus}
				id={id}
				name={name}
				data-testid={testId}
				onChange={handleChange}
				onKeyDown={handleKeyDown}
				onWheel={handleWheel}
				onFocus={handleFocus}
				onBlur={handleBlur}
			/>
		);

		const inputWrapper = (
			<div
				className={cn(styles['input-number-wrapper'], !hasAddon ? rootClassName : undefined)}
				data-variant={variant}
				data-size={size}
				data-status={status}
				data-disabled={disabled || undefined}
				data-readonly={readOnly || undefined}
				data-focused={isFocused || undefined}
				data-has-prefix={prefix !== undefined || undefined}
				data-has-suffix={suffix !== undefined || undefined}
				data-has-controls={showControls || undefined}
				data-out-of-range={outOfRange || undefined}
				style={!hasAddon ? style : undefined}
			>
				{prefix !== undefined && <span className={styles['input-number-prefix']}>{prefix}</span>}
				{inputElement}
				{suffix !== undefined && <span className={styles['input-number-suffix']}>{suffix}</span>}
				{showControls && (
					<span className={styles['input-number-actions']} data-mode={mode}>
						<button
							type="button"
							tabIndex={-1}
							className={cn(styles['input-number-action'], styles['input-number-action-up'])}
							onMouseDown={(e) => e.preventDefault()}
							onClick={() => handleStep(1, 'handler')}
							disabled={disabled || readOnly || (max !== undefined && isNumberLike(value) && value >= max)}
							aria-label="Increase value"
						>
							{controlsConfig.upIcon}
						</button>
						<button
							type="button"
							tabIndex={-1}
							className={cn(styles['input-number-action'], styles['input-number-action-down'])}
							onMouseDown={(e) => e.preventDefault()}
							onClick={() => handleStep(-1, 'handler')}
							disabled={disabled || readOnly || (min !== undefined && isNumberLike(value) && value <= min)}
							aria-label="Decrease value"
						>
							{controlsConfig.downIcon}
						</button>
					</span>
				)}
			</div>
		);

		if (!hasAddon) {
			return inputWrapper;
		}

		return (
			<div
				className={cn(styles['input-number-root'], rootClassName)}
				data-variant={variant}
				data-size={size}
				data-status={status}
				data-disabled={disabled || undefined}
				style={style}
			>
				{addonBefore !== undefined && (
					<span className={styles['input-number-addon']} data-position="before">
						{addonBefore}
					</span>
				)}
				{inputWrapper}
				{addonAfter !== undefined && (
					<span className={styles['input-number-addon']} data-position="after">
						{addonAfter}
					</span>
				)}
			</div>
		);
	}
);
InputNumber.displayName = 'InputNumber';
