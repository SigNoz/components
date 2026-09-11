import { forwardRef, type ForwardedRef } from 'react';
import { BadgeRoot } from '../badge/subcomponents/badge-root.js';
import { cn } from '../lib/utils.js';
import { PillCloseable } from './subcomponents/pill-closeable.js';
import styles from './pill.module.scss';
import { PillTextTransform } from './constants.js';
import type { PillProps } from './types.js';
import { pillSizeStyle } from './utils.js';

/**
 * Renders a native `<button>`, the interactive sibling of `Badge`. Composes `Badge`'s rendering
 * (label, truncation tooltip, colors) as a button, with its own styles layered on top.
 *
 * Every `aria-*` and any `data-*` are forwarded.
 *
 * Visual values are `--pill-*` custom properties, defaults in the `css-tokens` region of
 * [./index.ts](./index.ts). The per-color values come from the `--pill-*` semantic tokens, never
 * from `Badge`'s own `--badge-*` color tokens.
 *
 * ### Hover, focus and keyboard
 *
 * Being a real `<button>` gets hover, `:focus-visible` and Enter/Space activation for free, no
 * `role` or key handling to wire up.
 *
 * ### Disabled
 *
 * A plain native button attribute: the browser blocks clicks and keyboard activation, and drops
 * it from the tab order, for free. Styled with `--pill-disabled-opacity` (default `0.6`) and
 * `--pill-disabled-cursor`.
 *
 * ### Invalid
 *
 * `aria-invalid="true"` repaints the border and label with `--destructive`, over whatever
 * `color` picked.
 *
 * ### Case
 *
 * `textTransform` defaults to `none`, unlike `Badge`: a pill holds content the user picked or
 * typed, so it keeps its own case. `uppercase` is not offered.
 *
 * ### Truncation
 *
 * Same as `Badge`: `textOverflow="ellipsis"` (the default) measures the content and shows the
 * full text in a tooltip while it does not fit. `none` clips with no tooltip.
 *
 * ### Asserting on it
 *
 * `testId` is `data-testid`. Otherwise use the data attributes, never the hashed class names.
 *
 * | root attribute | value |
 * |---|---|
 * | `data-slot` | `"pill"` |
 * | `data-variant`, `data-color` | mirrors the prop |
 * | `data-truncated` | present only while the content does not fit |
 *
 * @example
 * ```tsx
 * <Pill variant="outlined" color="secondary" onClick={() => setFilter('env:prod')}>
 *   env:prod
 * </Pill>
 * ```
 */
const PillRoot = forwardRef<HTMLButtonElement, PillProps>(function Pill(
	{
		className,
		variant,
		color,
		textTransform = PillTextTransform.None,
		textOverflow,
		testId,
		width,
		maxWidth,
		style,
		onClick,
		children,
		...props
	},
	ref,
) {
	return (
		<BadgeRoot
			as="button"
			slot="pill"
			ref={ref as ForwardedRef<HTMLSpanElement | HTMLButtonElement>}
			variant={variant}
			color={color}
			textTransform={textTransform}
			textOverflow={textOverflow}
			testId={testId}
			style={pillSizeStyle(style, width, maxWidth)}
			onClick={onClick}
			className={cn(styles['pill'], className)}
			{...props}
		>
			{children}
		</BadgeRoot>
	);
});

export const Pill = Object.assign(PillRoot, { Closeable: PillCloseable });
