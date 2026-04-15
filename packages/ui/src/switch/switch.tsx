import * as SwitchPrimitive from '@radix-ui/react-switch';
import * as React from 'react';
import { useId } from 'react';
import { cn } from '../lib/utils.js';
import styles from './switch.module.scss';

type SwitchColor = 'robin' | 'forest' | 'amber' | 'sienna' | 'cherry' | 'sakura' | 'aqua';

export type SwitchProps = Pick<
	React.ComponentPropsWithoutRef<'button'>,
	'id' | 'className' | 'style' | 'children' | 'name'
> & {
	/**
	 * The testId associated with the switch.
	 */
	testId?: string;
	/**
	 * Additional CSS classes to apply to the switch wrapper.
	 */
	containerClassName?: string;
	/**
	 * Inline styles to apply to the switch wrapper.
	 */
	containerStyle?: React.CSSProperties;
	/**
	 * The id of the switch wrapper.
	 */
	containerId?: string;
	/**
	 * The testId associated with the switch wrapper.
	 */
	containerTestId?: string;
	/**
	 * The controlled checked state of the switch. Must be used in conjunction with onChange.
	 */
	value?: boolean;
	/**
	 * The initial checked state of the switch. Use when you do not need to control its state.
	 */
	defaultValue?: boolean;
	/**
	 * Whether the switch is disabled. When true, the user cannot interact with it.
	 */
	disabled?: boolean;
	/**
	 * When true, indicates that the user must toggle the switch before the owning form can be submitted.
	 */
	required?: boolean;
	/**
	 * Event handler called when the checked state of the switch changes.
	 */
	onChange?(checked: boolean): void;
	/**
	 * The color variant of the switch.
	 *
	 * @default 'robin'
	 */
	color?: SwitchColor;
};

const SwitchBase = React.forwardRef<React.ElementRef<typeof SwitchPrimitive.Root>, SwitchProps>(
	({ className, style, testId, value, onChange, defaultValue, color = 'robin', ...props }, ref) => (
		<SwitchPrimitive.Root
			ref={ref}
			data-color={color}
			className={cn(styles['switch'], className)}
			data-testid={testId}
			style={style}
			checked={value}
			onCheckedChange={onChange}
			defaultChecked={defaultValue}
			{...props}
		>
			<SwitchPrimitive.Thumb className={styles['switch__thumb']} />
		</SwitchPrimitive.Root>
	)
);
SwitchBase.displayName = SwitchPrimitive.Root.displayName;

/**
 * A toggle switch component for binary on/off or true/false selections.
 *
 * @example
 * ```tsx
 * // Basic usage with uncontrolled state
 * <Switch>Enable notifications</Switch>
 * ```
 *
 * @example
 * ```tsx
 * // With default checked state
 * <Switch defaultValue={true}>Dark mode</Switch>
 * ```
 *
 * @example
 * ```tsx
 * // Controlled usage with state
 * const [checked, setChecked] = React.useState(false);
 * <Switch value={checked} onChange={setChecked}>Controlled</Switch>
 * ```
 *
 * @example
 * ```tsx
 * // With custom color
 * <Switch color="forest">Success</Switch>
 * ```
 *
 * @example
 * ```tsx
 * // Disabled state
 * <Switch disabled>Maintenance mode</Switch>
 * ```
 */
const SwitchWrapper: React.FC<SwitchProps> = ({
	children,
	id,
	testId,
	className,
	style,
	containerClassName,
	containerStyle,
	containerId,
	containerTestId,
	...props
}) => {
	const fallbackId = useId();
	const switchId = id || fallbackId;

	return (
		<div
			className={cn(styles['switch-wrapper'], containerClassName)}
			data-testid={containerTestId}
			id={containerId}
			style={containerStyle}
		>
			<SwitchBase id={switchId} testId={testId} className={className} style={style} {...props} />
			{children && (
				<label htmlFor={switchId} className={styles['switch-label']}>
					{children}
				</label>
			)}
		</div>
	);
};

export { SwitchWrapper as Switch };
