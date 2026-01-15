import * as React from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { type VariantProps } from 'class-variance-authority';

import { cn } from './lib/utils';
import { inputVariants } from './input-variants';

export interface InputPasswordProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>,
		VariantProps<typeof inputVariants> {}

const InputPassword = React.forwardRef<HTMLInputElement, InputPasswordProps>(
	({ className, theme, ...props }, ref) => {
		const [showPassword, setShowPassword] = React.useState(false);

		const togglePasswordVisibility = () => {
			setShowPassword((prev) => !prev);
		};

		return (
			<div className="relative w-full">
				<input
					type={showPassword ? 'text' : 'password'}
					className={cn(inputVariants({ theme, className }), 'pr-10')}
					ref={ref}
					{...props}
				/>
				<button
					type="button"
					onClick={togglePasswordVisibility}
					className={cn(
						'absolute right-0 top-0 h-full px-3 flex items-center justify-center z-10',
						'cursor-pointer hover:opacity-70 transition-opacity',
						'focus:outline-hidden focus:ring-0',
						'disabled:opacity-50 disabled:cursor-not-allowed',
						theme === 'dark' ? 'text-muted-foreground-dark' : 'text-muted-foreground',
					)}
					aria-label={showPassword ? 'Hide password' : 'Show password'}
					tabIndex={-1}
					disabled={props.disabled}
				>
					{showPassword ? (
						<EyeOffIcon className="h-4 w-4" aria-hidden="true" strokeWidth={2} />
					) : (
						<EyeIcon className="h-4 w-4" aria-hidden="true" strokeWidth={2} />
					)}
				</button>
			</div>
		);
	},
);
InputPassword.displayName = 'InputPassword';

export { InputPassword };
