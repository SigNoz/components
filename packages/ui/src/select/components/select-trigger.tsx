import * as SelectPrimitive from '@radix-ui/react-select';
import { ChevronDown, X } from '@signozhq/icons';
import * as React from 'react';
import { cn } from '../../lib/utils.js';
import styles from '../select.module.scss';
import { useSelectContext } from './select-context.js';

export type SelectTriggerProps = {
	/** Additional CSS class names. */
	className?: string;
	/** Additional CSS class names for the Select Trigger Container. */
	containerClassname?: string;
	/** Inline styles for the element. */
	style?: React.CSSProperties;
	/** Unique identifier for the element. */
	id?: string;
	/** Test identifier for testing libraries. */
	testId?: string;
	/** Placeholder text when no value is selected. */
	placeholder?: React.ReactNode;
	/** Custom content to render inside the trigger. */
	children?: React.ReactNode;
	/** Custom render function for the selected value(s). */
	renderValue?: (values: string[]) => React.ReactNode;
	/**
	 * Resolves a value to its display label.
	 * Used in pills for multi-select and for single-select display.
	 * If not provided, the raw value is displayed.
	 */
	resolveLabel?: (value: string) => React.ReactNode;
	/**
	 * Maximum number of pills to display in multi-select mode.
	 * Overflow items are shown as "+N" badge.
	 * @default undefined (show all)
	 */
	maxDisplayedPills?: number;
	/** Whether the trigger is disabled. */
	disabled?: boolean;
	/** Accessible label for the trigger. */
	'aria-label'?: string;
	/** ID of the element that labels this trigger. */
	'aria-labelledby'?: string;
	/** ID of the element that describes this trigger. */
	'aria-describedby'?: string;
};

/**
 * Trigger button that opens the select dropdown.
 *
 * In single-select mode, displays the selected value or placeholder.
 * In multi-select mode, displays removable pills for each selected value.
 * Use `maxDisplayedPills` to limit visible pills and show overflow count.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <SelectTrigger placeholder="Select an option..." />
 *
 * // With custom render
 * <SelectTrigger renderValue={(values) => values.join(', ')} />
 *
 * // With test ID
 * <SelectTrigger testId="my-select-trigger" />
 * ```
 */
export const SelectTrigger = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Trigger>,
	SelectTriggerProps
>(
	(
		{
			className,
			containerClassname,
			style,
			id,
			testId,
			placeholder,
			children,
			renderValue,
			resolveLabel,
			maxDisplayedPills,
			...props
		},
		ref
	) => {
		const context = useSelectContext();
		const hasValue = context && context.value.length > 0;

		const renderContent = () => {
			if (children) {
				return children;
			}

			if (renderValue && context) {
				return renderValue(context.value);
			}

			if (context?.multiple && hasValue) {
				const values = context.value;
				const displayedValues =
					maxDisplayedPills !== undefined ? values.slice(0, maxDisplayedPills) : values;
				const overflowCount =
					maxDisplayedPills !== undefined ? Math.max(0, values.length - maxDisplayedPills) : 0;

				return (
					<span className={styles.select__pills}>
						{displayedValues.map((v) => (
							<span key={v} className={styles.select__pill}>
								<span className={cn(styles['select__pill-text'], className)}>
									{resolveLabel ? resolveLabel(v) : v}
								</span>
								<button
									type="button"
									className={styles['select__pill-remove']}
									onPointerDown={(e) => {
										e.preventDefault();
										e.stopPropagation();
										context.onRemove(v);
									}}
									aria-label={`Remove ${v}`}
								>
									<X />
								</button>
							</span>
						))}
						{overflowCount > 0 && (
							<span className={styles['select__pill-overflow']}>+{overflowCount}</span>
						)}
					</span>
				);
			}

			// Single-select: use resolveLabel if provided and has value, otherwise use Radix default
			if (resolveLabel && hasValue && context) {
				return <span className={className}>{resolveLabel(context.value[0])}</span>;
			}

			return <SelectPrimitive.Value className={className} placeholder={placeholder} />;
		};

		return (
			<SelectPrimitive.Trigger
				ref={ref}
				id={id}
				className={cn(styles.select__trigger, containerClassname)}
				style={style}
				data-slot="select-trigger"
				data-testid={testId}
				{...props}
			>
				<span className={styles['select__trigger-value']}>{renderContent()}</span>
				<SelectPrimitive.Icon asChild>
					<ChevronDown className={styles['select__trigger-icon']} />
				</SelectPrimitive.Icon>
			</SelectPrimitive.Trigger>
		);
	}
);
SelectTrigger.displayName = 'SelectTrigger';

export type SelectValueProps = {
	/** Additional CSS class names. */
	className?: string;
	/** Inline styles for the element. */
	style?: React.CSSProperties;
	/** Unique identifier for the element. */
	id?: string;
	/** Test identifier for testing libraries. */
	testId?: string;
	/** Placeholder text when no value is selected. */
	placeholder?: React.ReactNode;
	/** Content to render when controlled. */
	children?: React.ReactNode;
};

/**
 * Renders the selected value text in single-select mode.
 *
 * @example
 * ```tsx
 * <SelectTrigger>
 *   <SelectValue placeholder="Select..." />
 * </SelectTrigger>
 * ```
 */
export const SelectValue = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Value>,
	SelectValueProps
>(({ className, style, id, testId, ...props }, ref) => (
	<SelectPrimitive.Value
		ref={ref}
		id={id}
		className={className}
		style={style}
		data-slot="select-value"
		data-testid={testId}
		{...props}
	/>
));
SelectValue.displayName = 'SelectValue';

export type SelectIconProps = {
	/** Additional CSS class names. */
	className?: string;
	/** Inline styles for the element. */
	style?: React.CSSProperties;
	/** Unique identifier for the element. */
	id?: string;
	/** Test identifier for testing libraries. */
	testId?: string;
	/** Custom icon content. */
	children?: React.ReactNode;
	/** Whether to render as the child element. */
	asChild?: boolean;
};

/**
 * A small icon often displayed next to the value as a visual affordance for the fact it can be open.
 * By default renders ChevronDown. Use asChild to render your own icon.
 *
 * @example
 * ```tsx
 * // Default icon
 * <SelectIcon />
 *
 * // Custom icon
 * <SelectIcon asChild>
 *   <MyCustomIcon />
 * </SelectIcon>
 * ```
 */
export const SelectIcon = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Icon>,
	SelectIconProps
>(({ className, style, id, testId, ...props }, ref) => (
	<SelectPrimitive.Icon
		ref={ref}
		id={id}
		className={cn(styles['select__trigger-icon'], className)}
		style={style}
		data-slot="select-icon"
		data-testid={testId}
		{...props}
	/>
));
SelectIcon.displayName = 'SelectIcon';
