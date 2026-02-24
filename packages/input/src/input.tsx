import type { VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { InputPassword } from './input-password.jsx';
import { inputVariants } from './input-variants.js';
import { cn } from './lib/utils.js';

export interface InputProps
	extends
		React.InputHTMLAttributes<HTMLInputElement>,
		VariantProps<typeof inputVariants> {}

const InputComponent = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, theme, ...props }, ref) => {
		return (
			<input
				type={type}
				className={cn(inputVariants({ theme, className }))}
				ref={ref}
				{...props}
			/>
		);
	},
);
InputComponent.displayName = 'Input';

// Create compound component with proper typing
const Input = Object.assign(InputComponent, {
	Password: InputPassword,
}) as typeof InputComponent & {
	Password: typeof InputPassword;
};

export { Input, InputComponent, inputVariants, InputPassword };
