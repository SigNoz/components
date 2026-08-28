import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox';
import { Check, Slash } from '@signozhq/icons';
import * as React from 'react';
import { cn } from '../lib/utils.js';
import styles from './checkbox.module.scss';

/**
 * The checked state of a checkbox: on, off, or a mixed/partial state.
 *
 * Kept as a union (rather than Base UI's separate `checked` + `indeterminate`
 * props) so the public API of this component does not change.
 */
export type CheckedState = boolean | 'indeterminate';

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

export const CheckboxColors: Record<Capitalize<CheckboxColor>, CheckboxColor> = {
	Primary: 'primary',
	Success: 'success',
	Warning: 'warning',
	Error: 'error',
	Robin: 'robin',
	Forest: 'forest',
	Amber: 'amber',
	Sienna: 'sienna',
	Cherry: 'cherry',
	Sakura: 'sakura',
	Aqua: 'aqua',
};

export interface CheckboxProps extends Pick<
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

const Checkbox = React.forwardRef<HTMLElement, CheckboxProps>(
	({ className, color = 'primary', onChange, value, defaultValue, ...props }, ref) => {
		// Base UI splits our `CheckedState` union into a boolean `checked` plus a
		// separate `indeterminate` flag. `indeterminate` is not a "default" prop
		// there, so the uncontrolled case needs local state to clear on the first
		// interaction the way the union used to.
		const isControlled = value !== undefined;
		const [uncontrolledIndeterminate, setUncontrolledIndeterminate] = React.useState(
			defaultValue === 'indeterminate',
		);

		const indeterminate = isControlled ? value === 'indeterminate' : uncontrolledIndeterminate;

		return (
			<CheckboxPrimitive.Root
				ref={ref}
				data-color={colorMap[color] || color}
				className={cn(styles.checkbox, className)}
				checked={isControlled ? (value === 'indeterminate' ? false : value) : undefined}
				defaultChecked={
					isControlled ? undefined : defaultValue === 'indeterminate' ? false : defaultValue
				}
				indeterminate={indeterminate}
				onCheckedChange={(checked: boolean) => {
					if (!isControlled) {
						setUncontrolledIndeterminate(false);
					}
					onChange?.(checked);
				}}
				{...(props as Record<string, unknown>)}
			>
				<CheckboxPrimitive.Indicator className={styles['checkbox__indicator']}>
					<Slash className={cn(styles['checkbox__icon'], styles['checkbox__icon--slash'])} />
					<Check className={cn(styles['checkbox__icon'], styles['checkbox__icon--check'])} />
				</CheckboxPrimitive.Indicator>
			</CheckboxPrimitive.Root>
		);
	},
);
Checkbox.displayName = 'Checkbox';

const CheckboxWrapper = React.forwardRef<HTMLElement, CheckboxProps>(
	({ id, children, testId, className, ...props }, ref) => {
		const fallbackId = React.useId();

		return (
			<div className={cn(styles['checkbox-wrapper'], className)} data-testid={testId}>
				<Checkbox ref={ref} id={id || fallbackId} {...props} />
				{children && (
					<label htmlFor={id || fallbackId} className={styles['checkbox-wrapper__label']}>
						{children}
					</label>
				)}
			</div>
		);
	},
);
CheckboxWrapper.displayName = 'Checkbox';

export { CheckboxWrapper as Checkbox };
