import * as SwitchPrimitive from '@radix-ui/react-switch';
import { LoaderCircle } from '@signozhq/icons';
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
	/**
	 * When true, shows a loading spinner in the thumb and prevents user interaction.
	 * @default false
	 */
	isLoading?: boolean;
};

const SwitchBase = React.forwardRef<React.ElementRef<typeof SwitchPrimitive.Root>, SwitchProps>(
	(
		{
			className,
			style,
			testId,
			value,
			onChange,
			defaultValue,
			color = 'robin',
			disabled,
			isLoading = false,
			...props
		},
		ref
	) => (
		<SwitchPrimitive.Root
			ref={ref}
			data-color={color}
			data-loading={isLoading ? '' : undefined}
			className={cn(styles['switch'], className)}
			data-testid={testId}
			style={style}
			checked={value}
			onCheckedChange={onChange}
			defaultChecked={defaultValue}
			disabled={disabled || isLoading}
			aria-busy={isLoading || undefined}
			{...props}
		>
			<SwitchPrimitive.Thumb className={styles['switch__thumb']}>
				{isLoading && (
					<LoaderCircle
						data-testid="switch-loading-icon"
						className={styles['switch__loading-icon']}
					/>
				)}
			</SwitchPrimitive.Thumb>
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
 *
 * @example
 * ```tsx
 * // Loading state — shows spinner and prevents interaction
 * <Switch isLoading>Saving…</Switch>
 * ```
 */
const SwitchWrapper = React.forwardRef<React.ElementRef<typeof SwitchPrimitive.Root>, SwitchProps>(
	(
		{
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
		},
		ref
	) => {
		const fallbackId = useId();
		const switchId = id || fallbackId;

		return (
			<div
				className={cn(styles['switch-wrapper'], containerClassName)}
				data-testid={containerTestId}
				id={containerId}
				style={containerStyle}
			>
				<SwitchBase
					ref={ref}
					id={switchId}
					testId={testId}
					className={className}
					style={style}
					{...props}
				/>
				{children && (
					<label htmlFor={switchId} className={styles['switch-label']}>
						{children}
					</label>
				)}
			</div>
		);
	}
);
SwitchWrapper.displayName = 'Switch';

export { SwitchWrapper as Switch };
