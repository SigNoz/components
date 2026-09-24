import { Button as BaseUiButton } from '@base-ui/react/button';
import {
	cloneElement,
	forwardRef,
	isValidElement,
	type MouseEventHandler,
	type ReactElement,
	type RefAttributes,
	useMemo,
} from 'react';
import { cn, omitStyleProps } from '../lib/utils.js';
import { Spinner } from '../spinner/spinner.js';
import { TooltipAnchor } from '../tooltip/subcomponents/tooltip-anchor.js';
import { TooltipStack } from '../tooltip/subcomponents/tooltip-stack.js';
import {
	hasTooltipContent,
	type TooltipContentStackEntry,
} from '../tooltip/tooltip-content-stack-context.js';
import styles from './button.module.scss';
import { ButtonTextOverflow, ButtonVariant } from './constants.js';
import type { ButtonProps, ButtonStyleProps, ValidateButtonProps } from './types.js';
import { useIsLabelTruncated } from '../lib/useIsLabelTruncated.js';
import { toCssLength } from '../lib/css-length';

function ButtonPrefix({ prefix }: { prefix?: ReactElement }): ReactElement {
	const clonedElement = isValidElement<{ className?: string }>(prefix)
		? cloneElement(prefix, { className: cn(prefix.props.className, styles['button__prefix']) })
		: null;

	return (
		<span
			data-slot="button-prefix-wrapper"
			className={styles['button__prefix-wrapper']}
			data-empty={!prefix}
		>
			<span data-slot="button-prefix-slot" className={styles['button__prefix-slot']}>
				{clonedElement}
			</span>
			<span
				data-slot="button-prefix-loading"
				className={styles['button__loader-slot']}
				aria-hidden="true"
			>
				<Spinner />
			</span>
		</span>
	);
}

function ButtonDashedBorder(): ReactElement {
	return (
		<svg
			data-slot="button-dashed-border"
			className={styles['button__dash-border']}
			aria-hidden="true"
			focusable="false"
		>
			<rect width="100%" height="100%" />
		</svg>
	);
}

function ButtonSuffix({ suffix }: { suffix?: ReactElement | null }): ReactElement | null {
	if (!isValidElement<{ className?: string }>(suffix)) {
		return null;
	}

	const clonedElement = cloneElement(suffix, {
		className: cn(suffix.props.className, styles['button__suffix']),
	});

	return (
		<span data-slot="button-suffix-slot" className={styles['button__suffix-slot']}>
			{clonedElement}
		</span>
	);
}

const ButtonImpl = forwardRef<HTMLButtonElement, ButtonProps & ButtonStyleProps>(function Button(
	{
		className,
		variant,
		color,
		size,
		icon = undefined,
		prefix,
		suffix,
		disabled,
		disabledTooltip,
		loading = false,
		loadingTooltip,
		children,
		testId,
		onDoubleClick,
		width,
		maxWidth,
		textOverflow = ButtonTextOverflow.Ellipsis,
		style,
		...props
	},
	ref,
) {
	const hasOverflowTooltip = icon !== true && textOverflow === ButtonTextOverflow.Ellipsis;
	const [isLabelOverflowing, labelRef] = useIsLabelTruncated(hasOverflowTooltip);

	const hasDisabledTooltip = Boolean(disabled && !loading && hasTooltipContent(disabledTooltip));
	const hasLoadingTooltip = Boolean(loading && hasTooltipContent(loadingTooltip));

	const tooltipContent = useMemo(() => {
		const items: TooltipContentStackEntry[] = [];

		if (hasLoadingTooltip) {
			items.push({ id: 'loading-tooltip', content: loadingTooltip });
		}

		if (hasDisabledTooltip) {
			items.push({ id: 'disabled-tooltip', content: disabledTooltip });
		}

		if (isLabelOverflowing) {
			items.push({ id: 'label', content: children });
		}

		return items.length === 0 ? null : <TooltipStack items={items} />;
	}, [
		hasLoadingTooltip,
		loadingTooltip,
		hasDisabledTooltip,
		disabledTooltip,
		isLabelOverflowing,
		children,
	]);

	const hasTooltip = hasOverflowTooltip || disabledTooltip != null || loadingTooltip != null;

	// the only click event is not supported by default to disable by base-ui
	// https://github.com/mui/base-ui/blob/e8526f762853350691ee3a9bd7ead9d3d6e95bd3/packages/react/src/internals/use-button/useButton.ts#L104
	const onDoubleClickImpl: MouseEventHandler<HTMLButtonElement> | undefined = onDoubleClick
		? (event) => {
				if (disabled || loading) {
					return;
				}

				onDoubleClick(event);
			}
		: undefined;

	const buttonStyle = {
		...style,
		...(width != null && { '--button-internal-width': toCssLength(width) }),
		...(maxWidth != null && { '--button-internal-max-width': toCssLength(maxWidth) }),
	};

	const prefixEl = icon === true ? (children as ReactElement) : prefix;
	const childrenEl =
		icon === true ? null : (
			<span ref={labelRef} data-slot="button-label" className={styles['button__label']}>
				{children}
			</span>
		);
	const suffixEl = icon === true ? null : suffix;

	const buttonEl = (
		<BaseUiButton
			data-slot="button"
			data-color={color}
			data-variant={variant}
			data-size={size}
			data-icon={icon ?? false}
			data-text-overflow={textOverflow}
			data-truncated={isLabelOverflowing || undefined}
			className={cn(styles['button'], className)}
			disabled={disabled || loading}
			focusableWhenDisabled
			aria-busy={loading || undefined}
			ref={ref}
			onDoubleClick={onDoubleClickImpl}
			style={buttonStyle}
			{...props}
			{...(testId === undefined ? {} : { 'data-testid': testId })}
		>
			{variant === ButtonVariant.Dashed && <ButtonDashedBorder />}
			<ButtonPrefix prefix={prefixEl} />
			{childrenEl}
			<ButtonSuffix suffix={suffixEl} />
		</BaseUiButton>
	);

	if (!hasTooltip) {
		return buttonEl;
	}

	return (
		<TooltipAnchor
			content={tooltipContent}
			contentProps={{ className: styles['button__label-tooltip'] }}
		>
			{buttonEl}
		</TooltipAnchor>
	);
});

// The public button drops `className` and `style` at runtime too, so a value that gets past the
// types does not replace the button's own class. `InternalButton` keeps both.
const PublicButton = forwardRef<HTMLButtonElement, ButtonProps>(function Button(props, ref) {
	return <ButtonImpl ref={ref} {...omitStyleProps(props)} />;
});

/**
 * Renders a native `<button>` (Base UI `Button`).
 *
 * Every native `HTMLButtonElement` attribute in {@link ButtonProps}, all `aria-*` and any
 * `data-*` are forwarded.
 *
 * Visual values are `--button-*` custom properties, defaults in the `css-tokens` region of
 * [./index.ts](./index.ts).
 *
 * ### Icon mode
 *
 * `icon` puts `children` in the prefix slot. There is no label and no `suffix`.
 *
 * Nothing is left to read, so give it an `aria-label`.
 *
 * ### Disabled and loading
 *
 * Both set `aria-disabled`, never the native `disabled` attribute (Base UI
 * `focusableWhenDisabled`).
 *
 * So the button stays tabbable and hoverable, and its tooltip stays reachable.
 *
 * They swallow `onClick`, `onDoubleClick` and Enter/Space. Hover and focus events still fire.
 *
 * In tests `toBeDisabled()` fails. Assert `aria-disabled`.
 *
 * ### Loading
 *
 * Adds `aria-busy` and cross-fades the spinner over the prefix slot.
 *
 * Label and `suffix` stay visible.
 *
 * It suppresses `disabledTooltip`, even while `disabled` is true. `loadingTooltip` takes that
 * place, and only while loading.
 *
 * ### Truncation
 *
 * `textOverflow="ellipsis"` (the default) measures the label and re-measures on resize.
 *
 * While it does not fit: `data-truncated`, plus a tooltip with the full text. The visible text
 * is only clipped, so the accessible name is already the full label.
 *
 * `hidden` clips with no tooltip, `visible` clips nothing and lets the label paint outside its
 * box. Icon buttons have no label to measure.
 *
 * ### Its tooltips
 *
 * Three of them, and only one reason can apply at a time: `loadingTooltip` while loading,
 * `disabledTooltip` while disabled and idle, plus the truncated label.
 *
 * When both apply, one popup holds both: reason first, then the label, split by a
 * `tooltip-divider`.
 *
 * Inside a wrapping `<Tooltip>` the button adds its entries to that popup instead of opening a
 * second one.
 *
 * The trigger is always mounted, so the element never remounts when a tooltip appears. The
 * tooltip root and popup mount only while there is something to show.
 *
 * ### Width
 *
 * `width` and `maxWidth` are written as inline `--button-internal-width` and
 * `--button-internal-max-width`.
 *
 * So they compose with the tokens. Numbers are written as `px`.
 *
 * ### Asserting on it
 *
 * `testId` is `data-testid` and survives the tooltip trigger cloning the button. Otherwise use
 * the data attributes, never the hashed class names.
 *
 * | root attribute | value |
 * |---|---|
 * | `data-slot` | `"button"` |
 * | `data-variant`, `data-color`, `data-size` | mirrors the prop |
 * | `data-icon` | `"true"` in icon mode, else `"false"` |
 * | `data-text-overflow` | mirrors `textOverflow`, `ellipsis` by default |
 * | `data-truncated` | present only while the label does not fit |
 *
 * | `data-slot` | rendered |
 * |---|---|
 * | `button-prefix-wrapper` | always, `data-empty="true"` without a prefix or icon |
 * | `button-prefix-slot` | always, holds the cloned `prefix` (or the icon `children`) |
 * | `button-prefix-loading` | always, holds the `Spinner`, `aria-hidden`. The ring is paused while idle |
 * | `button-label` | except in icon mode, this is the measured element |
 * | `button-suffix-slot` | only when `suffix` is a valid element |
 * | `button-dashed-border` | only for `variant="dashed"` |
 *
 * @example
 * ```tsx
 * <Button size="md" variant="solid" color="danger" prefix={<Trash />} onClick={remove}>
 *   Delete
 * </Button>
 * ```
 *
 * @example
 * ```tsx
 * // Icon mode: children are the icon, so give it a name
 * <Button size="md" variant="outlined" color="secondary" icon aria-label="More actions">
 *   <Ellipsis />
 * </Button>
 * ```
 *
 * @example
 * ```tsx
 * // Truncates at 10rem and explains itself on hover, reason above the full label
 * <Button
 *   size="md"
 *   variant="ghost"
 *   color="secondary"
 *   maxWidth="10rem"
 *   disabled={!canEdit}
 *   disabledTooltip="You need write access to edit alerts"
 *   testId="edit-alert"
 * >
 *   Edit every alert rule in this workspace
 * </Button>
 * ```
 *
 * @example
 * ```tsx
 * // Says what it is waiting on while the request is in flight
 * <Button
 *   size="md"
 *   variant="solid"
 *   color="primary"
 *   loading={isSaving}
 *   loadingTooltip="Saving your changes"
 * >
 *   Save
 * </Button>
 * ```
 */
export const Button = PublicButton as <T extends ButtonProps>(
	props: T &
		ValidateButtonProps<T> &
		// `T` is inferred from the call site, so `T extends ButtonProps` alone never runs excess
		// property checks. Every key outside the props (a typo, a native attribute the button does
		// not forward on purpose) is pinned to `never` instead.
		Record<Exclude<keyof T, keyof ButtonProps | keyof RefAttributes<HTMLButtonElement>>, never> &
		RefAttributes<HTMLButtonElement>,
) => ReactElement;

/**
 * `Button` plus `className` and `style`, for the library's own components that build on it. Not
 * exported from the package.
 *
 * @access private
 */
export const InternalButton = ButtonImpl as <T extends ButtonProps & ButtonStyleProps>(
	props: T &
		ValidateButtonProps<T> &
		Record<
			Exclude<
				keyof T,
				keyof ButtonProps | keyof ButtonStyleProps | keyof RefAttributes<HTMLButtonElement>
			>,
			never
		> &
		RefAttributes<HTMLButtonElement>,
) => ReactElement;
