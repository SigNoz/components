import { Slot } from '@radix-ui/react-slot';
import { LoaderCircle } from '@signozhq/icons';
import type React from 'react';
import { cloneElement, createContext, forwardRef, useContext } from 'react';
import { cn } from '../lib/utils.js';
import styles from './button.module.scss';

export const ButtonVariant = {
	Solid: 'solid',
	Outlined: 'outlined',
	Dashed: 'dashed',
	Ghost: 'ghost',
	Link: 'link',
	Action: 'action',
} as const;

export const ButtonSize = {
	SM: 'sm',
	MD: 'md',
	Icon: 'icon',
} as const;

export const ButtonBackground = {
	Ink500: 'ink-500',
	Ink400: 'ink-400',
	Vanilla100: 'vanilla-100',
	Vanilla200: 'vanilla-200',
} as const;

export const ButtonColor = {
	Primary: 'primary',
	Destructive: 'destructive',
	Warning: 'warning',
	Secondary: 'secondary',
	None: 'none',
} as const;

export type ButtonVariantValue = (typeof ButtonVariant)[keyof typeof ButtonVariant];
export type ButtonSizeValue = (typeof ButtonSize)[keyof typeof ButtonSize];
export type ButtonBackgroundValue = (typeof ButtonBackground)[keyof typeof ButtonBackground];
export type ButtonColorValue = (typeof ButtonColor)[keyof typeof ButtonColor] | (string & {});

/**
 * Context used by `ButtonGroup` to propagate `size`, `variant`, and `color` to
 * descendant `Button`s. Children may still override any of these locally.
 */
export interface ButtonGroupContextValue {
	size?: ButtonSizeValue;
	variant?: ButtonVariantValue;
	color?: ButtonColorValue;
	inGroup: boolean;
}

export const ButtonGroupContext = createContext<ButtonGroupContextValue | null>(null);

/**
 * Helper function to generate button class names for use in other components
 * This replaces the old CVA-based buttonVariants function
 */
export function buttonVariants({
	variant = 'outlined',
	size = 'md',
	className,
}: {
	variant?: ButtonVariantValue;
	size?: ButtonSizeValue;
	className?: string;
} = {}) {
	return cn(styles['button'], className);
}

export type ButtonProps = {
	/**
	 * Visual style of the button.
	 * @default 'solid'
	 */
	variant?: ButtonVariantValue;
	/**
	 * Height + padding token. `'icon'` produces a square button suitable for a single icon child.
	 * @default 'md'
	 */
	size?: ButtonSizeValue;
	/**
	 * When `true`, render as the immediate child element (via Radix `Slot`) instead of a native
	 * `<button>`. Useful for turning a `Button` into a link. `loading`, `prefix`, and `suffix`
	 * are not supported in this mode.
	 * @default false
	 */
	asChild?: boolean;
	/**
	 * Color scheme applied to the variant. Maps to the button's `data-color` attribute and the
	 * matching CSS custom properties.
	 * @default 'primary'
	 */
	color?: ButtonColorValue;
	/**
	 * Element rendered before the button label. Sized + class-injected automatically when no
	 * `size` prop is set on the element.
	 */
	prefix?: React.ReactElement;
	/**
	 * Element rendered after the button label. Sized + class-injected automatically when no
	 * `size` prop is set on the element.
	 */
	suffix?: React.ReactElement;
	/**
	 * When `true`, replaces `prefix` (and hides `suffix`) with a spinner and disables the button.
	 * @default false
	 */
	loading?: boolean;
	/**
	 * Background context for `variant="action"`. Only meaningful when `variant` is `"action"`.
	 */
	background?: ButtonBackgroundValue;
	/**
	 * Forwarded to the rendered element as `data-testid`.
	 */
	testId?: string;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'prefix' | 'color'>;

/**
 * Versatile button that maps to a native `<button>` (or any child via `asChild`).
 * Supports color/variant/size tokens, prefix/suffix slots, loading state, and forwards
 * every native `HTMLButtonElement` attribute + event handler.
 *
 * When nested inside `ButtonGroup`, `size`, `variant`, and `color` defaults are
 * inherited from the group; per-button props still win.
 *
 * @example
 * ```tsx
 * // Default — solid primary
 * <Button onClick={save}>Save</Button>
 * ```
 *
 * @example
 * ```tsx
 * // Outlined secondary with a leading icon
 * <Button variant="outlined" color="secondary" prefix={<Plus />}>
 *   Create alert
 * </Button>
 * ```
 *
 * @example
 * ```tsx
 * // Destructive ghost with a trailing icon
 * <Button variant="ghost" color="destructive" suffix={<Trash />}>
 *   Delete
 * </Button>
 * ```
 *
 * @example
 * ```tsx
 * // Icon-only square button
 * <Button size="icon" variant="outlined" color="secondary" aria-label="More">
 *   <Ellipsis />
 * </Button>
 * ```
 *
 * @example
 * ```tsx
 * // Loading state — disables the button and replaces the prefix with a spinner
 * <Button loading prefix={<Plus />}>Saving…</Button>
 * ```
 *
 * @example
 * ```tsx
 * // `asChild` — render as a link with button styling
 * <Button asChild variant="link" color="primary">
 *   <a href="/docs">Read the docs</a>
 * </Button>
 * ```
 *
 * @example
 * ```tsx
 * // Native HTML submit button inside a form
 * <form onSubmit={onSubmit}>
 *   <Button type="submit">Submit</Button>
 * </form>
 * ```
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			variant,
			color,
			size,
			prefix,
			suffix,
			asChild = false,
			disabled,
			loading = false,
			background,
			children,
			testId,
			...props
		},
		ref
	) => {
		const Comp = asChild ? Slot : 'button';
		const group = useContext(ButtonGroupContext);

		variant ??= group?.variant ?? ButtonVariant.Solid;
		size ??= group?.size ?? ButtonSize.MD;
		color ??= group?.color ?? ButtonColor.Primary;

		const iconSizes: Record<ButtonSizeValue, number> = {
			[ButtonSize.SM]: 12,
			[ButtonSize.MD]: 14,
			[ButtonSize.Icon]: 16,
		};

		if (asChild) {
			if (loading || prefix || suffix) {
				console.warn('Loading, prefix, and suffix are not supported when using asChild');
			}

			return (
				<Comp
					data-testid={testId}
					data-color={color}
					data-variant={variant}
					data-size={size}
					data-background={variant === ButtonVariant.Action ? background : undefined}
					className={cn(
						styles['button'],
						'font-inter',
						loading && styles['button--loading'],
						className
					)}
					disabled={disabled || loading}
					ref={ref}
					{...props}
				>
					{children}
				</Comp>
			);
		}

		return (
			<Comp
				data-testid={testId}
				data-color={color}
				data-variant={variant}
				data-size={size}
				data-background={variant === ButtonVariant.Action ? background : undefined}
				className={cn(styles['button'], loading && styles['button--loading'], className)}
				disabled={disabled || loading}
				ref={ref}
				{...props}
			>
				{loading ? (
					<LoaderCircle size={iconSizes[size]} className="animate-fast-spin" />
				) : (
					(prefix &&
						cloneElement(prefix, {
							...(!prefix.props.size && {
								size: iconSizes[size],
								className: styles['button__prefix'],
							}),
						})) ||
					null
				)}
				{children}
				{(!loading &&
					suffix &&
					cloneElement(suffix, {
						...(!suffix.props.size && {
							size: iconSizes[size],
							className: styles['button__suffix'],
						}),
					})) ||
					null}
			</Comp>
		);
	}
);
Button.displayName = 'Button';

export { Button };
