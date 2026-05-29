import * as React from 'react';
import { cn, type Simplify } from '../lib/utils.js';
import styles from './input-number.module.scss';
import {
	clamp,
	DEFAULT_STEP,
	formatForDisplay,
	isNumberLike,
	isOutOfRange,
	parseFromInput,
	resolveControls,
	roundToPrecision,
} from './utils.js';

/** The numeric value emitted by `onChange`. `null` represents an empty input. */
export type InputNumberValue = number | null;

/** Height preset for the control. `small` = 24px, `middle` = 32px, `large` = 40px. */
export type InputNumberSize = 'small' | 'middle' | 'large';

/** Visual treatment for the input wrapper. */
export type InputNumberVariant = 'outlined' | 'filled' | 'borderless' | 'underlined';

/** Validation surface — paints a colored border and matching focus ring. */
export type InputNumberStatus = 'error' | 'warning';

/**
 * Layout for the spinner controls when `controls` is enabled. `input` stacks
 * up/down vertically; `spinner` places them side-by-side.
 *
 * NOTE: `mode` is purely a layout hint. It does not enable the spinner buttons
 * on its own — set `controls` to render them.
 */
export type InputNumberMode = 'input' | 'spinner';

/**
 * Spinner controls config:
 * - `true` / `false` toggles the default up/down chevrons.
 * - Pass an object to override either icon (e.g. `{ upIcon: <PlusIcon /> }`).
 */
export type InputNumberControls =
	| boolean
	| { upIcon?: React.ReactNode; downIcon?: React.ReactNode };

/**
 * Imperative handle exposed via `ref`.
 *
 * @example
 * ```tsx
 * const ref = useRef<InputNumberRef>(null);
 * ref.current?.focus({ cursor: 'end' });
 * ```
 */
export type InputNumberRef = {
	/** Focus the underlying input. `cursor` positions the caret afterwards. */
	focus: (options?: { preventScroll?: boolean; cursor?: 'start' | 'end' | 'all' }) => void;
	/** Blur the underlying input. */
	blur: () => void;
	/** Reference to the underlying `<input>` element, or `null` before mount. */
	nativeElement: HTMLInputElement | null;
};

/** Metadata passed to `onStep` describing how a step was triggered. */
export type InputNumberStepInfo = {
	/** Signed delta applied to the previous value (e.g. `+1`, `-0.1`). */
	offset: number;
	/** Step direction. */
	type: 'up' | 'down';
	/** Source of the step: the spinner button, an arrow key, or the mouse wheel. */
	emitter: 'handler' | 'keydown' | 'wheel';
};

type BaseProps = {
	/** Controlled value. Use together with `onChange`. Pass `null` to clear. */
	value?: InputNumberValue;
	/** Initial value for uncontrolled usage. Ignored when `value` is provided. */
	defaultValue?: InputNumberValue;
	/** Fires whenever the parsed numeric value changes. Receives `null` for an empty input. */
	onChange?: (value: InputNumberValue) => void;

	/** Lower bound. Values below are clamped on step and on blur (when `changeOnBlur`). */
	min?: number;
	/** Upper bound. Values above are clamped on step and on blur (when `changeOnBlur`). */
	max?: number;
	/** Step delta for spinner buttons, arrow keys, and wheel. Strings are coerced. Default: `1`. */
	step?: number | string;
	/** Number of decimal places to round to. Also pads display with trailing zeros. */
	precision?: number;
	/** Render and parse decimals with this separator instead of `.` (e.g. `','` for de-DE). */
	decimalSeparator?: string;

	/**
	 * Custom display formatter. Called on every render and on every keystroke.
	 * The `info` argument lets you branch on whether the user is currently typing.
	 *
	 * Stabilize this reference with `useCallback` if it has dependencies — an
	 * inline arrow is fine but re-runs the formatter on every parent render.
	 *
	 * @example
	 * ```tsx
	 * formatter={(v) => `$ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
	 * ```
	 */
	formatter?: (value: number | string, info: { userTyping: boolean; input: string }) => string;
	/**
	 * Inverse of `formatter` — strips formatting characters before parsing as a number.
	 *
	 * @example
	 * ```tsx
	 * parser={(v) => v.replace(/\$\s?|(,*)/g, '')}
	 * ```
	 */
	parser?: (displayValue: string) => string;

	/** Inline content rendered inside the input border, before the value. Good for short labels or unit icons. */
	prefix?: React.ReactNode;
	/** Inline content rendered inside the input border, after the value. */
	suffix?: React.ReactNode;
	/** Bordered outer slot that merges with the input wrapper on the leading edge. Common for text labels (`"https://"`). */
	addonBefore?: React.ReactNode;
	/** Bordered outer slot on the trailing edge. Common for a unit `Select` (`MiB`/`GiB`/`TiB`). */
	addonAfter?: React.ReactNode;

	/** Show the spinner up/down controls. Pass an object to override the chevron icons. */
	controls?: InputNumberControls;
	/**
	 * Layout for the spinner controls. Default: `'input'` (stacked).
	 * Only takes effect when `controls` is enabled — `mode` does not turn the
	 * buttons on by itself.
	 */
	mode?: InputNumberMode;

	/** Visual treatment for the wrapper. Default: `'outlined'`. */
	variant?: InputNumberVariant;
	/** Height preset. Default: `'middle'`. */
	size?: InputNumberSize;
	/** Validation status — paints an error or warning border. */
	status?: InputNumberStatus;

	/** Clamp and round the value on blur. Default: `true`. */
	changeOnBlur?: boolean;
	/** Step the value when the mouse wheel scrolls over a focused input. Default: `false`. */
	changeOnWheel?: boolean;
	/** Allow ↑/↓ keys to step the value. Default: `true`. */
	keyboard?: boolean;

	/** Render the input as read-only — selectable but not editable. */
	readOnly?: boolean;
	/** Disable the input and all controls. */
	disabled?: boolean;
	/** Focus the input on mount. */
	autoFocus?: boolean;

	/** Placeholder text shown when the input is empty. */
	placeholder?: string;
	/** Class applied to the wrapper (the bordered input box). Mirrors AntD `InputNumber.className`. */
	className?: string;
	/** Class applied to the outermost element — the addon root when addons are set, otherwise the wrapper. */
	rootClassName?: string;
	/** Inline style applied to the outermost element. */
	style?: React.CSSProperties;
	/** `id` for the underlying `<input>`. Pair with a `<label htmlFor>` for accessibility. */
	id?: string;
	/** `name` for the underlying `<input>` — used by native form submission. */
	name?: string;
	/** Convenience alias for `data-testid` on the underlying `<input>`. Takes precedence over `data-testid` when both are set. */
	testId?: string;
	/** Standard `data-testid` passthrough. `testId` takes precedence if both are set. */
	'data-testid'?: string;

	/**
	 * Accessible label for the increment spinner button. Default: `'Increase value'`.
	 * Override for localization.
	 */
	incrementAriaLabel?: string;
	/**
	 * Accessible label for the decrement spinner button. Default: `'Decrease value'`.
	 * Override for localization.
	 */
	decrementAriaLabel?: string;

	/** Fires when the user presses Enter while the input is focused. */
	onPressEnter?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
	/** Fires after every step (spinner click, arrow key, or wheel) with the new value and step metadata. */
	onStep?: (value: number, info: InputNumberStepInfo) => void;
	/** Standard blur handler. Runs after the internal clamp/round-on-blur logic. */
	onBlur?: React.FocusEventHandler<HTMLInputElement>;
	/** Standard focus handler. */
	onFocus?: React.FocusEventHandler<HTMLInputElement>;
	/** Standard key-down handler. Runs before the built-in Enter/↑/↓ logic; call `event.preventDefault()` to suppress it. */
	onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
	/**
	 * Standard wheel handler. Always fires when the wheel is scrolled over the input.
	 * NOTE: React's synthetic wheel listener is passive — calling `preventDefault()`
	 * here is a no-op. To stop the page from scrolling while stepping, set
	 * `changeOnWheel` (which uses a non-passive native listener internally).
	 */
	onWheel?: React.WheelEventHandler<HTMLInputElement>;
	/**
	 * Accessible label for the input — required when no visible `<label>` is associated.
	 * The input has `role="spinbutton"`, which implies a steppable control. If you set
	 * both `keyboard={false}` and `controls={false}`, the value is not actually
	 * steppable through the input itself — consider whether `spinbutton` is still
	 * the right semantic, or set the label to make the read-only intent obvious.
	 */
	'aria-label'?: string;
};

/** Props accepted by {@link InputNumber}. */
export type InputNumberProps = Simplify<BaseProps>;

/**
 * Numeric input with a rich slot API and an Ant Design–compatible prop surface,
 * intended as a drop-in replacement for `antd`'s `InputNumber`.
 *
 * **Highlights**
 * - Inline `prefix` / `suffix` and bordered `addonBefore` / `addonAfter` slots.
 * - Optional spinner controls (`controls`) with stacked or side-by-side layouts (`mode`).
 * - `formatter` / `parser` pipeline for currency, percent, units, and locale formatting.
 * - `min` / `max` clamping (on step and on blur), `precision` rounding, `step`-based increments.
 * - Keyboard (↑/↓), mouse wheel (`changeOnWheel`), and Enter (`onPressEnter`) interaction.
 * - `variant` (`outlined` / `filled` / `borderless` / `underlined`), `size`, and `status` styling.
 * - Auto out-of-range warning when the value drifts outside `[min, max]`.
 * - Imperative `ref` with `focus` / `blur` / `nativeElement` (see {@link InputNumberRef}).
 *
 * **Controlled vs. uncontrolled**
 * Pass `value` + `onChange` for controlled mode, or `defaultValue` for uncontrolled.
 * `onChange` always receives a parsed `number` or `null` (never a string).
 *
 * @example Basic — controlled with bounds and a step
 * ```tsx
 * <InputNumber min={0} max={100} step={1} value={value} onChange={setValue} />
 * ```
 *
 * @example Addon with an embedded `Select` — borders merge into a single control
 * ```tsx
 * <InputNumber
 *   defaultValue={500}
 *   addonAfter={
 *     <Select defaultValue="GiB">
 *       <SelectTrigger><SelectValue /></SelectTrigger>
 *       <SelectContent>
 *         <SelectItem value="MiB">MiB</SelectItem>
 *         <SelectItem value="GiB">GiB</SelectItem>
 *         <SelectItem value="TiB">TiB</SelectItem>
 *       </SelectContent>
 *     </Select>
 *   }
 * />
 * ```
 *
 * @example Currency formatting via `formatter` / `parser`
 * ```tsx
 * <InputNumber
 *   value={amount}
 *   onChange={setAmount}
 *   formatter={(v) => `$ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
 *   parser={(v) => v.replace(/\$\s?|(,*)/g, '')}
 * />
 * ```
 *
 * @example Precision + step for decimal values
 * ```tsx
 * <InputNumber precision={2} step={0.01} value={ratio} onChange={setRatio} controls />
 * ```
 *
 * @example Validation surfaces
 * ```tsx
 * <InputNumber status="error" defaultValue={3} />
 * <InputNumber min={1} max={10} value={99} /> // auto-warning, out of range
 * ```
 *
 * @example Imperative focus
 * ```tsx
 * const ref = useRef<InputNumberRef>(null);
 * useEffect(() => { ref.current?.focus({ cursor: 'end' }); }, []);
 * return <InputNumber ref={ref} defaultValue={42} />;
 * ```
 *
 * @see {@link InputNumberProps} for the full prop list.
 */
export const InputNumber = React.forwardRef<InputNumberRef, InputNumberProps>((props, ref) => {
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
		'data-testid': dataTestId,

		incrementAriaLabel = 'Increase value',
		decrementAriaLabel = 'Decrease value',

		onPressEnter,
		onStep,
		onBlur,
		onFocus,
		onKeyDown,
		onWheel: onWheelProp,
		'aria-label': ariaLabel,
	} = props;

	const isControlled = valueProp !== undefined;
	const inputRef = React.useRef<HTMLInputElement | null>(null);
	const [internalValue, setInternalValue] = React.useState<InputNumberValue>(defaultValue ?? null);
	const value = isControlled ? (valueProp ?? null) : internalValue;

	// `rawInput` only holds the user's in-progress typing buffer while focused.
	// When the input is not focused, the displayed value is computed inline from
	// `value` — there is no state to drift out of sync with.
	const [rawInput, setRawInput] = React.useState<string>('');
	const [isFocused, setIsFocused] = React.useState(false);
	const isFocusedRef = React.useRef(false);

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

	const handleChange = React.useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const raw = event.target.value;
			setRawInput(raw);
			const parsed = parseFromInput(raw, decimalSeparator, parser);
			if (parsed === null) {
				emitChange(null);
				return;
			}
			emitChange(roundToPrecision(parsed, precision));
		},
		[decimalSeparator, parser, precision, emitChange]
	);

	const handleStep = React.useCallback(
		(offset: number, emitter: InputNumberStepInfo['emitter']) => {
			if (disabled || readOnly) return;
			const stepValue = typeof step === 'string' ? Number(step) : step;
			if (!isNumberLike(stepValue)) return;
			const base = isNumberLike(value) ? value : 0;
			const next = roundToPrecision(clamp(base + offset * stepValue, min, max), precision);
			emitChange(next);
			// In controlled mode, parents that ignore `onChange` will not update `value`.
			// While focused, `rawInput` reflects what we just computed so the user sees
			// the step take effect; if `value` never updates, the next blur reformat will
			// snap back to the parent's value. This is the expected controlled contract.
			if (isFocusedRef.current) {
				setRawInput(formatForDisplay(next, precision, decimalSeparator, formatter));
			}
			onStep?.(next, { offset: offset * stepValue, type: offset > 0 ? 'up' : 'down', emitter });
		},
		[
			disabled,
			readOnly,
			step,
			value,
			min,
			max,
			precision,
			decimalSeparator,
			formatter,
			emitChange,
			onStep,
		]
	);

	// Keep a ref to the latest step handler so the native wheel listener (below)
	// can call into current closure state without re-attaching on every render.
	const handleStepRef = React.useRef(handleStep);
	handleStepRef.current = handleStep;

	const handleKeyDown = React.useCallback(
		(event: React.KeyboardEvent<HTMLInputElement>) => {
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
		},
		[onKeyDown, onPressEnter, keyboard, handleStep]
	);

	// React attaches `wheel` listeners at the root as passive in modern versions,
	// so a synthetic `onWheel` handler cannot `preventDefault()` page scroll.
	// Attach a non-passive native listener directly on the input for the stepper.
	React.useEffect(() => {
		if (!changeOnWheel) return;
		const el = inputRef.current;
		if (!el) return;
		const handler = (event: WheelEvent) => {
			if (!isFocusedRef.current) return;
			event.preventDefault();
			handleStepRef.current(event.deltaY < 0 ? 1 : -1, 'wheel');
		};
		el.addEventListener('wheel', handler, { passive: false });
		return () => el.removeEventListener('wheel', handler);
	}, [changeOnWheel]);

	// Synthetic wheel handler just forwards to the user's callback. Stepping
	// happens in the native listener above so it can actually prevent default.
	const handleWheel = React.useCallback(
		(event: React.WheelEvent<HTMLInputElement>) => {
			onWheelProp?.(event);
		},
		[onWheelProp]
	);

	const handleFocus = React.useCallback(
		(event: React.FocusEvent<HTMLInputElement>) => {
			isFocusedRef.current = true;
			setIsFocused(true);
			// Seed the typing buffer from the currently displayed value so the first
			// keystroke does not wipe formatting in unexpected ways.
			setRawInput(formatForDisplay(value, precision, decimalSeparator, formatter));
			onFocus?.(event);
		},
		[value, precision, decimalSeparator, formatter, onFocus]
	);

	const handleBlur = React.useCallback(
		(event: React.FocusEvent<HTMLInputElement>) => {
			isFocusedRef.current = false;
			setIsFocused(false);
			if (changeOnBlur && isNumberLike(value)) {
				const clamped = clamp(value, min, max);
				if (clamped !== value) {
					emitChange(roundToPrecision(clamped, precision));
				}
			}
			onBlur?.(event);
		},
		[changeOnBlur, value, min, max, precision, emitChange, onBlur]
	);

	const controlsConfig = resolveControls(controls);
	const showControls = controlsConfig.enabled;
	const outOfRange = isOutOfRange(value, min, max);
	const hasAddon = addonBefore !== undefined || addonAfter !== undefined;

	const handleActionMouseDown = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
	}, []);

	const handleIncrement = React.useCallback(() => {
		handleStep(1, 'handler');
	}, [handleStep]);

	const handleDecrement = React.useCallback(() => {
		handleStep(-1, 'handler');
	}, [handleStep]);

	const inputDisplayValue = isFocused
		? rawInput
		: formatForDisplay(value, precision, decimalSeparator, formatter);

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
			className={styles['input-number-input']}
			value={inputDisplayValue}
			placeholder={placeholder}
			disabled={disabled}
			readOnly={readOnly}
			autoFocus={autoFocus}
			id={id}
			name={name}
			data-testid={testId ?? dataTestId}
			onChange={handleChange}
			onKeyDown={handleKeyDown}
			onWheel={handleWheel}
			onFocus={handleFocus}
			onBlur={handleBlur}
		/>
	);

	const inputWrapper = (
		<div
			className={cn(
				styles['input-number-wrapper'],
				className,
				!hasAddon ? rootClassName : undefined
			)}
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
						onMouseDown={handleActionMouseDown}
						onClick={handleIncrement}
						disabled={
							disabled || readOnly || (max !== undefined && isNumberLike(value) && value >= max)
						}
						aria-label={incrementAriaLabel}
					>
						{controlsConfig.upIcon}
					</button>
					<button
						type="button"
						tabIndex={-1}
						className={cn(styles['input-number-action'], styles['input-number-action-down'])}
						onMouseDown={handleActionMouseDown}
						onClick={handleDecrement}
						disabled={
							disabled || readOnly || (min !== undefined && isNumberLike(value) && value <= min)
						}
						aria-label={decrementAriaLabel}
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
			data-focused={isFocused || undefined}
			data-out-of-range={outOfRange || undefined}
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
});
InputNumber.displayName = 'InputNumber';
