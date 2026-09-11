import { X } from '@signozhq/icons';
import { forwardRef, useId, type ForwardedRef, type KeyboardEvent, type MouseEvent } from 'react';
import { BadgeRoot } from '../../badge/subcomponents/badge-root.js';
import { cn } from '../../lib/utils.js';
import styles from '../pill.module.scss';
import { PillTextTransform } from '../constants.js';
import type { PillProps } from '../types.js';
import { pillSizeStyle } from '../utils.js';

/**
 * What `onClose` receives. The close icon is a `<button>`, but `Backspace`/`Delete` on the focused
 * body dismisses too, so the handler has to take either event.
 */
export type PillCloseEvent = MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLSpanElement>;

/**
 * What `Pill.Closeable`'s `onClick` receives. The body is a `<span role="button">`, and Enter or
 * Space on it activates as well as a click does.
 */
export type PillActivateEvent = MouseEvent<HTMLSpanElement> | KeyboardEvent<HTMLSpanElement>;

export type PillCloseableProps = Omit<PillProps, 'variant' | 'color' | 'onClick'> & {
	/**
	 * Called when the pill body is clicked, or activated with Enter or Space. Activating the
	 * close icon never fires it, and neither does anything while `disabled`.
	 */
	onClick?: (event: PillActivateEvent) => void;
	/**
	 * Called when the close icon is activated, or `Backspace`/`Delete` is pressed on the focused
	 * body. It never fires `onClick`, and clicking the pill body never fires this.
	 */
	onClose: (event: PillCloseEvent) => void;
	/**
	 * Accessible name for the close icon. Defaults to `Remove {children}` when `children` is a
	 * string, and to `Remove` otherwise, which is worth replacing when several chips sit
	 * together.
	 */
	closeAriaLabel?: string;
};

/**
 * A dismissible `Pill`: fixed neutral fill, no `variant`/`color` to pick. Reached as
 * `Pill.Closeable`, not imported on its own.
 *
 * Composes `Badge` (`as="span"`, `role="button"`) for the label and its truncation tooltip, same
 * as `Pill`. The close icon rides through `Badge`'s `suffix` slot, made focusable instead of the
 * usual decorative `aria-hidden`.
 *
 * ### Close vs click
 *
 * The close icon is its own control: activating it calls `onClose` and never `onClick`, and it
 * stops the click from reaching the body (now load-bearing, not just defensive: the close button
 * is a DOM descendant of the body, so a click on it would otherwise bubble into the body's own
 * `onClick`).
 *
 * ### Keyboard
 *
 * With the body focused: Enter and Space call `onClick`, `Backspace` and `Delete` call `onClose`,
 * so a chip is removable without tabbing to its close icon. Keydowns that bubble up from the close
 * button are ignored, it handles its own.
 *
 * ### Naming
 *
 * The body is named by its label through `aria-labelledby`, so the nested close button's own
 * `aria-label` never sweeps into it, whatever type `children` is. Override the close button's
 * name with `closeAriaLabel`.
 *
 * ### Disabled
 *
 * The body is a `<span role="button">`, not a real button: `disabled` sets `aria-disabled`, drops
 * it from the tab order (`tabIndex={-1}`), and blocks its click/keyboard handling by hand. The
 * close button is a real `<button>` and gets the native attribute instead.
 *
 * ### Asserting on it
 *
 * | `data-slot` | rendered |
 * |---|---|
 * | `pill` | the outer element, also the clickable body, carries `testId` |
 * | `pill-label` | the label, which names the body |
 * | `pill-close` | the close icon button |
 *
 * @example
 * ```tsx
 * <Pill.Closeable onClick={openFilter} onClose={() => removeFilter('env')}>
 *   env:prod
 * </Pill.Closeable>
 * ```
 */
export const PillCloseable = forwardRef<HTMLSpanElement, PillCloseableProps>(function PillCloseable(
	{
		className,
		textTransform = PillTextTransform.None,
		textOverflow,
		testId,
		width,
		maxWidth,
		style,
		onClick,
		onClose,
		closeAriaLabel,
		disabled,
		children,
		...props
	},
	ref,
) {
	const labelId = useId();
	const removeLabel =
		closeAriaLabel ?? (typeof children === 'string' ? `Remove ${children}` : 'Remove');
	// `disabled` is a real attribute on the close `<button>`, but the body is a `<span
	// role="button">`, which has no such attribute: gate its click/keyboard handling by hand.
	const bodyOnClick = disabled ? undefined : onClick;

	function handleKeyDown(event: KeyboardEvent<HTMLSpanElement>): void {
		// Ignore keydowns that bubbled up from the nested close button.
		if (event.target !== event.currentTarget) {
			return;
		}
		if (disabled) {
			return;
		}
		if (event.key === 'Backspace' || event.key === 'Delete') {
			event.preventDefault();
			onClose(event);
			return;
		}
		if (event.key !== 'Enter' && event.key !== ' ') {
			return;
		}
		event.preventDefault();
		bodyOnClick?.(event);
	}

	return (
		<BadgeRoot
			as="span"
			slot="pill"
			// eslint-disable-next-line jsx-a11y/prefer-tag-over-role -- a native <button> cannot contain the nested close <button>.
			role="button"
			tabIndex={disabled ? -1 : 0}
			labelId={labelId}
			aria-labelledby={labelId}
			aria-disabled={disabled || undefined}
			data-disabled={disabled || undefined}
			ref={ref as ForwardedRef<HTMLSpanElement | HTMLButtonElement>}
			textTransform={textTransform}
			textOverflow={textOverflow}
			testId={testId}
			style={pillSizeStyle(style, width, maxWidth)}
			onClick={bodyOnClick}
			onKeyDown={handleKeyDown}
			interactiveSuffix
			suffix={
				<button
					type="button"
					data-slot="pill-close"
					className={styles['pill__close']}
					aria-label={removeLabel}
					disabled={disabled}
					onClick={(event) => {
						event.stopPropagation();
						onClose(event);
					}}
				>
					<X aria-hidden="true" />
				</button>
			}
			className={cn(styles['pill'], styles['pill-closeable'], className)}
			{...props}
		>
			{children}
		</BadgeRoot>
	);
});
PillCloseable.displayName = 'Pill.Closeable';
