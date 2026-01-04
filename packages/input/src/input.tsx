import './index.css';
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

import { cn } from './lib/utils';

const inputVariants = cva(
	'flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50',
	{
		variants: {
			theme: {
				light:
					'border-input text-foreground file:text-foreground focus-visible:ring-ring',
				dark:
					'border-input-dark bg-background-dark text-primary-foreground-dark file:text-foreground-dark placeholder:text-muted-foreground-dark focus-visible:ring-ring-dark',
			},
		},
		defaultVariants: {
			theme: 'light',
		},
	},
);

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement>,
		VariantProps<typeof inputVariants> {
	/**
	 * Enable password visibility toggle for password inputs
	 * @default true
	 */
	showPasswordToggle?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, theme, showPasswordToggle = true, ...props }, ref) => {
		const [showPassword, setShowPassword] = React.useState(false);
		const isPasswordInput = type === 'password';
		const shouldShowToggle = isPasswordInput && showPasswordToggle;

		const togglePasswordVisibility = () => {
			setShowPassword((prev) => !prev);
		};

		// Determine the actual input type based on showPassword state
		const inputType = isPasswordInput && showPassword ? 'text' : type;

		if (shouldShowToggle) {
			return (
				<div className="relative w-full">
					<input
						type={inputType}
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
							theme === 'dark'
								? 'text-muted-foreground-dark'
								: 'text-muted-foreground',
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
		}

		return (
			<input
				type={inputType}
				className={cn(inputVariants({ theme, className }))}
				ref={ref}
				{...props}
			/>
		);
	},
);
Input.displayName = 'Input';

export { Input, inputVariants };
