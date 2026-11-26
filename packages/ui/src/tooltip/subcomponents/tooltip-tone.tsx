import { forwardRef } from 'react';
import type { RejectedProps } from '../../lib/utils.js';
import { useRegisterTooltipTone } from '../tooltip-tone-context.js';
import styles from '../tooltip.module.scss';
import type { TooltipToneProps } from '../types.js';

/**
 * Wraps the content of a tooltip to give its popup a tone. Renders a `span` that adds no box, so
 * the content lays out as it would without it.
 *
 * It takes no prop of its own for this: it works in any prop that ends up in a tooltip popup,
 * such as the `title` of a `Tooltip` or the `disabledTooltip` of a `Button`.
 *
 * Visual values are `--tooltip-*` custom properties, defaults in the `css-tokens` region of
 * [../index.ts](../index.ts).
 *
 * ### The whole popup takes the tone
 *
 * The popup, not the wrapped text, changes: background, border and text colour. When tooltips
 * stack into one popup, a `TooltipTone` in any entry sets the tone of all of it. A tooltip
 * portalled into this popup keeps a tone of its own, in both directions. Outside a tooltip popup
 * it changes nothing.
 *
 * ### Accessibility
 *
 * The tone is visual only. Say what is wrong in the text itself, such as "You cannot delete this
 * rule", so a screen reader user gets the same message.
 *
 * ### Asserting on it
 *
 * Use the data attributes, never the hashed class names.
 *
 * | attribute | value |
 * |---|---|
 * | `data-slot` | `"tooltip-tone"` |
 * | `data-tone` | mirrors `tone`, here and on the `tooltip-content` popup |
 *
 * @example
 * ```tsx
 * <Button disabled disabledTooltip={<TooltipTone tone="danger">You cannot delete this rule</TooltipTone>}>
 *   Delete
 * </Button>
 * ```
 *
 * @example
 * ```tsx
 * // The title of a plain tooltip
 * <Tooltip title={<TooltipTone tone="danger">Permission denied</TooltipTone>}>
 *   <span>Billing</span>
 * </Tooltip>
 * ```
 */
export const TooltipTone = forwardRef<HTMLSpanElement, TooltipToneProps>(function TooltipTone(
	{ tone, children, className: _className, style: _style }: TooltipToneProps & RejectedProps,
	ref,
) {
	useRegisterTooltipTone(tone);

	return (
		<span ref={ref} data-slot="tooltip-tone" data-tone={tone} className={styles['tooltip__tone']}>
			{children}
		</span>
	);
});
