import { EyeIcon, EyeOffIcon } from 'lucide-react';
import * as React from 'react';
import { Button } from '../button/index.js';
import { cn, type Simplify } from '../lib/utils.js';
import styles from './input.module.scss';

type BaseInputProps = Pick<
	React.ComponentPropsWithoutRef<'input'>,
	| 'id'
	| 'className'
	| 'accept'
	| 'autoComplete'
	| 'autoCorrect'
	| 'autoFocus'
	| 'autoCapitalize'
	| 'autoSave'
	| 'disabled'
	| 'capture'
	| 'form'
	| 'formNoValidate'
	| 'max'
	| 'maxLength'
	| 'min'
	| 'minLength'
	| 'multiple'
	| 'name'
	| 'pattern'
	| 'placeholder'
	| 'readOnly'
	| 'required'
	| 'size'
	| 'step'
	| 'type'
	| 'value'
	| 'defaultValue'
	| 'enterKeyHint'
	| 'hidden'
	| 'lang'
	| 'tabIndex'
	| 'title'
	| 'translate'
	| 'inputMode'
	| 'onCopy'
	| 'onCopyCapture'
	| 'onCut'
	| 'onCutCapture'
	| 'onPaste'
	| 'onPasteCapture'
	| 'onFocus'
	| 'onFocusCapture'
	| 'onBlur'
	| 'onBlurCapture'
	| 'onChange'
	| 'onChangeCapture'
	| 'onBeforeInput'
	| 'onBeforeInputCapture'
	| 'onInput'
	| 'onInputCapture'
	| 'onReset'
	| 'onResetCapture'
	| 'onSubmit'
	| 'onSubmitCapture'
	| 'onInvalid'
	| 'onInvalidCapture'
	| 'onKeyDown'
	| 'onKeyDownCapture'
	| 'onKeyUp'
	| 'onKeyUpCapture'
	| 'onSelect'
	| 'onSelectCapture'
	| 'onClick'
	| 'onClickCapture'
> &
	React.AriaAttributes;

export type InputProps = Simplify<
	{
		prefix?: React.ReactNode;
		suffix?: React.ReactNode;
	} & BaseInputProps
>;

/**
 * Input component for text-based user input with optional prefix and suffix adornments.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Input placeholder="Enter text" />
 * ```
 *
 * @example
 * ```tsx
 * // With prefix and suffix
 * <Input
 *   prefix={<span className="text-xs text-vanilla-500">@</span>}
 *   suffix={<button type="button">Clear</button>}
 *   placeholder="username"
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Password input using the compound component
 * <Input.Password placeholder="Enter password" />
 * ```
 */
const InputComponent = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, prefix, suffix, ...props }, ref) => {
		const useWrapper = prefix !== undefined || suffix !== undefined;

		if (!useWrapper) {
			return <input type={type} className={cn(styles['input'], className)} ref={ref} {...props} />;
		}

		return (
			<div
				className={cn(styles['input-wrapper'], className)}
				data-has-suffix={!!suffix}
				data-has-prefix={!!prefix}
			>
				{prefix && <div className={styles['input-prefix']}>{prefix}</div>}
				<input type={type} className={styles['input-with-adornments']} ref={ref} {...props} />
				{suffix && <div className={styles['input-suffix']}>{suffix}</div>}
			</div>
		);
	}
);
InputComponent.displayName = 'Input';

export type InputPasswordProps = Omit<InputProps, 'type' | 'ref'>;

/**
 * InputPassword component for securely capturing password values with a built-in visibility toggle.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Input.Password placeholder="Enter password" />
 * ```
 *
 * @example
 * ```tsx
 * // Disabled password input
 * <Input.Password placeholder="Enter password" disabled />
 * ```
 *
 * @example
 * ```tsx
 * // Dark themed password input
 * <div className="bg-slate-900 p-4">
 *   <Input.Password placeholder="Enter password" theme="dark" />
 * </div>
 * ```
 */
const InputPassword = React.forwardRef<HTMLInputElement, InputPasswordProps>((props, ref) => {
	const [showPassword, setShowPassword] = React.useState(false);

	const togglePasswordVisibility = React.useCallback(() => {
		setShowPassword((prev) => !prev);
	}, []);

	return (
		<InputComponent
			{...props}
			type={showPassword ? 'text' : 'password'}
			ref={ref}
			suffix={
				<Button
					type="button"
					color="none"
					variant="link"
					size="icon"
					onClick={togglePasswordVisibility}
					aria-label={showPassword ? 'Hide password' : 'Show password'}
					tabIndex={-1}
					disabled={props.disabled}
					suffix={
						showPassword ? (
							<EyeOffIcon aria-hidden="true" strokeWidth={2} />
						) : (
							<EyeIcon aria-hidden="true" strokeWidth={2} />
						)
					}
				/>
			}
		/>
	);
});
InputPassword.displayName = 'InputPassword';

// Create compound component with proper typing
type InputWithPassword = typeof InputComponent & { Password: typeof InputPassword };
(InputComponent as InputWithPassword).Password = InputPassword;

export const Input = InputComponent as InputWithPassword;
