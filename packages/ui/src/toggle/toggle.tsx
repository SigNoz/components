import * as TogglePrimitive from '@radix-ui/react-toggle';
import * as React from 'react';

import { cn } from '../lib/utils.js';
import styles from './toggle.module.scss';

export const ToggleColorValue = {
	Primary: 'primary',
	Destructive: 'destructive',
	Warning: 'warning',
	Secondary: 'secondary',
	None: 'none',
} as const;

export type ToggleColor = (typeof ToggleColorValue)[keyof typeof ToggleColorValue];

export type ToggleProps = Pick<
	React.ComponentPropsWithoutRef<'button'>,
	'className' | 'id' | 'disabled' | 'aria-disabled' | 'onClick' | 'children'
> & {
	/**
	 * The controlled state of the toggle.
	 */
	value?: boolean;
	/**
	 * The state of the toggle when initially rendered. Use `defaultValue`
	 * if you do not need to control the state of the toggle.
	 * @default false
	 */
	defaultValue?: boolean;
	/**
	 * The callback that fires when the state of the toggle changes.
	 */
	onChange?(value: boolean): void;
	/**
	 * The size of the toggle.
	 * @default 'default'
	 */
	size?: 'default' | 'sm' | 'lg';
	/**
	 * The color variant of the toggle.
	 * @default 'secondary'
	 */
	color?: ToggleColor;
	/**
	 * The testId associated with the toggle.
	 */
	testId?: string;
};

/**
 * A two-state button that can be toggled on or off. For grouped toggles, use ToggleGroup with
 * ToggleGroupItem, or ToggleGroupSimple for an items-based API.
 *
 * @example Standalone toggle
 * ```tsx
 * <Toggle aria-label="Toggle bold" value={bold} onChange={setBold}>
 *   <Bold className="h-3 w-3" />
 * </Toggle>
 * ```
 */
export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
	(
		{
			className,
			size = 'default',
			color = 'secondary',
			testId,
			value,
			onChange,
			defaultValue,
			...props
		},
		ref
	) => (
		<TogglePrimitive.Root
			ref={ref}
			data-slot="toggle"
			data-testid={testId}
			data-size={size}
			data-color={color}
			pressed={value}
			onPressedChange={onChange}
			defaultPressed={defaultValue}
			className={cn(styles.toggle, className)}
			{...props}
		/>
	)
);
