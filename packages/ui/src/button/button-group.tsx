import type React from 'react';
import { forwardRef, useMemo } from 'react';
import { cn } from '../lib/utils.js';
import {
	type ButtonColorValue,
	ButtonGroupContext,
	type ButtonSizeValue,
	type ButtonVariantValue,
} from './button.js';
import styles from './button-group.module.scss';

export type ButtonGroupProps = {
	size?: ButtonSizeValue;
	variant?: ButtonVariantValue;
	color?: ButtonColorValue;
	testId?: string;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'color'>;

const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(
	({ size, variant, color, className, children, testId, ...props }, ref) => {
		const value = useMemo(() => ({ size, variant, color, inGroup: true }), [size, variant, color]);

		return (
			<ButtonGroupContext.Provider value={value}>
				{/* biome-ignore lint/a11y/useSemanticElements: <div role="group"> is the standard antd-compat ButtonGroup pattern; alternatives (fieldset/menu) carry unwanted semantics. */}
				<div
					ref={ref}
					role="group"
					data-testid={testId}
					data-size={size}
					data-variant={variant}
					data-color={color}
					className={cn(styles['button-group'], className)}
					{...props}
				>
					{children}
				</div>
			</ButtonGroupContext.Provider>
		);
	}
);
ButtonGroup.displayName = 'ButtonGroup';

export { ButtonGroup };
