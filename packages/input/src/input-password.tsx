import * as React from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { type VariantProps } from 'class-variance-authority';
import { Button, ButtonVariant, ButtonSize } from '@signozhq/button';

import { cn } from './lib/utils';
import { InputComponent } from './input';
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
					className={cn(
						'absolute right-0 top-0 h-full w-auto px-3 z-10',
						'rounded-none shadow-none',
						'hover:opacity-70 transition-opacity',
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
				</Button>
			</div>
		);
	},
);
InputPassword.displayName = 'InputPassword';

export { InputPassword };
