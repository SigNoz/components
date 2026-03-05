import { EyeIcon, EyeOffIcon } from 'lucide-react';
import * as React from 'react';
import { Button, ButtonSize, ButtonVariant } from '../button/index.js';
import { cn } from '../lib/utils.js';
import { InputComponent, type InputProps } from './input.js';
import styles from './input.module.css';

export interface InputPasswordProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
	theme?: InputProps['theme'];
}

const InputPassword = React.forwardRef<HTMLInputElement, InputPasswordProps>(
	({ className, theme = 'light', ...props }, ref) => {
		const [showPassword, setShowPassword] = React.useState(false);

		const togglePasswordVisibility = () => {
			setShowPassword((prev) => !prev);
		};

		return (
			<div className={styles['input-password-wrapper']}>
				<InputComponent
					type={showPassword ? 'text' : 'password'}
					className={cn('pr-10', className)}
					theme={theme}
					ref={ref}
					{...props}
				/>
				<Button
					type="button"
					variant={ButtonVariant.Ghost}
					size={ButtonSize.Icon}
					onClick={togglePasswordVisibility}
					data-theme={theme}
					className={cn(styles['input-password-button'])}
					aria-label={showPassword ? 'Hide password' : 'Show password'}
					tabIndex={-1}
					disabled={props.disabled}
				>
					{showPassword ? (
						<EyeOffIcon className="h-4 w-4" aria-hidden="true" strokeWidth={2} />
					) : (
						<EyeIcon className="h-4 w-4" aria-hidden="true" strokeWidth={2} />
					)}
				</Button>
			</div>
		);
	}
);
InputPassword.displayName = 'InputPassword';

export { InputPassword };
