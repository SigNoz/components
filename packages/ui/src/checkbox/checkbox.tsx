import type { CheckedState } from '@radix-ui/react-checkbox';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check, Slash } from '@signozhq/icons';
import * as React from 'react';
import { cn } from '../lib/utils.js';
import styles from './checkbox.module.scss';

type CheckboxColor =
	| 'primary'
	| 'success'
	| 'warning'
	| 'error'
	| 'robin'
	| 'forest'
	| 'amber'
	| 'sienna'
	| 'cherry'
	| 'sakura'
	| 'aqua';

const colorMap: Record<string, string> = {
	success: 'forest',
	warning: 'amber',
	error: 'cherry',
	primary: 'robin',
};

interface CheckboxProps
	extends Pick<
		React.ComponentPropsWithoutRef<'button'>,
		'id' | 'disabled' | 'className' | 'children' | 'onClick'
	> {
	/**
	 * The name of the checkbox. Submitted with its owning form as part of a name/value pair.
	 */
	name?: string;
	/**
	 * The color of the checkbox.
	 * @default primary
	 */
	color?: CheckboxColor;
	/**
	 * The value given as data when submitted with a name.
	 */
	value?: CheckedState;
	/**
	 * The checked state of the checkbox when it is initially rendered. Use when you do not need to control its checked state.
	 * @default undefined
	 */
	defaultValue?: CheckedState;
	/**
	 * When true, indicates that the user must check the checkbox before the owning form can be submitted.
	 * @default false
	 */
	required?: boolean;
	/**
	 * The testId associated with the checkbox.
	 */
	testId?: string;

	/**
	 * The callback invoked when the value state of the checkbox changes.
	 * @param checked
	 */
	onChange?(checked: CheckedState): void;
}

const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
	({ className, color = 'primary', onChange, value, defaultValue, ...props }, ref) => (
		<CheckboxPrimitive.Root
			ref={ref}
			data-color={colorMap[color] || color}
			className={cn(styles.checkbox, className)}
			checked={value}
			defaultChecked={defaultValue}
			onCheckedChange={onChange}
			{...props}
		>
			<CheckboxPrimitive.Indicator className={styles['checkbox__indicator']}>
				<Slash className={cn(styles['checkbox__icon'], styles['checkbox__icon--slash'])} />
				<Check className={cn(styles['checkbox__icon'], styles['checkbox__icon--check'])} />
			</CheckboxPrimitive.Indicator>
		</CheckboxPrimitive.Root>
	)
);
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

const CheckboxWrapper: React.FC<CheckboxProps> = ({ children, testId, ...props }) => {
	return (
		<div className={styles['checkbox-wrapper']} data-testId={testId}>
			<Checkbox {...props} />
			{children && (
				<label htmlFor={props.id} className={styles['checkbox-wrapper__label']}>
					{children}
				</label>
			)}
		</div>
	);
};

export { CheckboxWrapper as Checkbox };
