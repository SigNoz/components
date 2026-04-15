import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import * as React from 'react';
import { useId } from 'react';
import { cn } from '../lib/utils.js';
import styles from './radio-group.module.scss';

export type RadioColorProps =
	| 'robin'
	| 'forest'
	| 'amber'
	| 'sienna'
	| 'cherry'
	| 'sakura'
	| 'aqua';

export type RadioGroupProps = Pick<
	React.ComponentPropsWithoutRef<'div'>,
	'id' | 'className' | 'style' | 'children'
> & {
	/**
	 * The name of the group. Submitted with its owning form as part of a name/value pair.
	 */
	name?: string;
	/**
	 * When true, indicates that the user must check a radio item before the owning form can be submitted.
	 */
	required?: boolean;
	/**
	 * When true, prevents the user from interacting with radio items.
	 */
	disabled?: boolean;
	/**
	 * The reading direction of the radio group. If omitted, inherits globally from DirectionProvider or assumes LTR (left-to-right) reading mode.
	 */
	dir?: 'ltr' | 'rtl';
	/**
	 * The orientation of the component.
	 */
	orientation?: React.AriaAttributes['aria-orientation'];
	/**
	 * When true, keyboard navigation will loop from last item to first, and vice versa.
	 */
	loop?: boolean;
	/**
	 * The value of the radio item that should be checked when initially rendered. Use when you do not need to control the state of the radio items.
	 */
	defaultValue?: string;
	/**
	 * The controlled value of the radio item to check. Should be used in conjunction with onChange.
	 */
	value?: string | null;
	/**
	 * Event handler called when the value changes.
	 */
	onChange?: (value: string) => void;
	/**
	 * The testId associated with the radio group.
	 */
	testId?: string;
	/**
	 * The color of the radio group.
	 */
	color?: RadioColorProps;
};

export type RadioGroupItemProps = Pick<
	React.ComponentPropsWithoutRef<'button'>,
	'id' | 'className' | 'style' | 'children'
> & {
	/**
	 * The value given as data when submitted with a name.
	 */
	value: string;
	/**
	 * When true, indicates that the user must check the radio item before the owning form can be submitted.
	 */
	required?: boolean;
	/**
	 * When true, prevents the user from interacting with the radio item.
	 */
	disabled?: boolean;
	/**
	 * The testId associated with the radio item.
	 */
	testId?: string;
	/**
	 * Additional CSS classes to apply to the radio item wrapper.
	 */
	containerClassName?: string;
	/**
	 * Inline styles to apply to the radio item wrapper.
	 */
	containerStyle?: React.CSSProperties;
	/**
	 * The id of the radio item wrapper.
	 */
	containerId?: string;
	/**
	 * The testId associated with the radio item wrapper.
	 */
	containerTestId?: string;
	/**
	 * The callback invoked when the value state of the radio item changes.
	 */
	onCheck?(): void;
};

export type RadioGroupLabelProps = Pick<
	React.ComponentPropsWithoutRef<'label'>,
	'id' | 'className' | 'children' | 'htmlFor'
>;

/**
 * RadioGroup component for managing a group of radio button options.
 *
 * @example
 * ```tsx
 * // Basic usage with uncontrolled state
 * <RadioGroup defaultValue="option1">
 *   <RadioGroupItem value="option1">Option 1</RadioGroupItem>
 *   <RadioGroupItem value="option2">Option 2</RadioGroupItem>
 *   <RadioGroupItem value="option3">Option 3</RadioGroupItem>
 * </RadioGroup>
 * ```
 *
 * @example
 * ```tsx
 * // Controlled usage with state
 * const [value, setValue] = React.useState('option1');
 * <RadioGroup value={value} onChange={setValue}>
 *   <RadioGroupItem value="option1">Option 1</RadioGroupItem>
 *   <RadioGroupItem value="option2">Option 2</RadioGroupItem>
 * </RadioGroup>
 *```
 *
 * @example
 * ```tsx
 * // With custom color
 * <RadioGroup defaultValue="option1" color="forest">
 *   <RadioGroupItem value="option1">Option 1</RadioGroupItem>
 *   <RadioGroupItem value="option2">Option 2</RadioGroupItem>
 * </RadioGroup>
 * ```
 *
 * @example
 * ```tsx
 * // Disabled state
 * <RadioGroup defaultValue="option1" disabled>
 *   <RadioGroupItem value="option1">Option 1</RadioGroupItem>
 *   <RadioGroupItem value="option2">Option 2</RadioGroupItem>
 * </RadioGroup>
 * ```
 */
const RadioGroup = React.forwardRef<
	React.ElementRef<typeof RadioGroupPrimitive.Root>,
	RadioGroupProps
>(({ className, onChange, color = 'robin', testId, ...props }, ref) => {
	return (
		<RadioGroupPrimitive.Root
			className={cn(styles['radio-group'], className)}
			onValueChange={onChange}
			data-color={color}
			data-testid={testId}
			{...props}
			ref={ref}
		/>
	);
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
	React.ElementRef<typeof RadioGroupPrimitive.Item>,
	RadioGroupItemProps
>(
	(
		{
			className,
			style,
			children,
			testId,
			containerClassName,
			containerStyle,
			containerId,
			containerTestId,
			...props
		},
		ref
	) => {
		const fallbackId = useId();
		const radioId = props.id || fallbackId;

		if (children) {
			return (
				<div
					className={cn(styles['radio-group__item-wrapper'], containerClassName)}
					data-testid={containerTestId}
					id={containerId}
					style={containerStyle}
				>
					<RadioGroupPrimitive.Item
						ref={ref}
						className={cn(styles['radio-group__item'], className)}
						id={radioId}
						data-testid={testId}
						style={style}
						{...props}
					>
						<RadioGroupPrimitive.Indicator className={styles['radio-group__indicator']} />
					</RadioGroupPrimitive.Item>
					{children && (
						<RadioGroupLabel htmlFor={radioId} aria-disabled={props.disabled}>
							{children}
						</RadioGroupLabel>
					)}
				</div>
			);
		}

		return (
			<RadioGroupPrimitive.Item
				ref={ref}
				className={cn(styles['radio-group__item'], className)}
				data-testid={testId}
				style={style}
				{...props}
			>
				<RadioGroupPrimitive.Indicator className={styles['radio-group__indicator']} />
			</RadioGroupPrimitive.Item>
		);
	}
);
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

const RadioGroupLabel = React.forwardRef<HTMLLabelElement, RadioGroupLabelProps>(
	({ className, ...props }, ref) => {
		return <label ref={ref} className={cn(styles['radio-group__label'], className)} {...props} />;
	}
);
RadioGroupLabel.displayName = 'RadioGroupLabel';

export { RadioGroup, RadioGroupItem, RadioGroupLabel };
