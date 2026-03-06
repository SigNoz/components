import './index.css';
import * as React from 'react';
import { cn } from '../lib/utils.js';
import styles from './input.module.css';
import { InputPassword } from './input-password.js';

type InputTheme = 'light' | 'dark';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	theme?: InputTheme;
}

const InputComponent = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, theme = 'light', ...props }, ref) => {
		return (
			<input
				type={type}
				data-theme={theme}
				className={cn(styles['input'], className)}
				ref={ref}
				{...props}
			/>
		);
	}
);
InputComponent.displayName = 'Input';

// Create compound component with proper typing
const Input = Object.assign(InputComponent, {
	Password: InputPassword,
}) as typeof InputComponent & {
	Password: typeof InputPassword;
};

export { Input, InputComponent, InputPassword };
export type { InputTheme };
