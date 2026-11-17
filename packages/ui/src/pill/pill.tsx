import { forwardRef, type ForwardedRef, type ReactElement, type RefAttributes } from 'react';
import { BadgeRoot } from '../badge/subcomponents/badge-root.js';
import type { RejectedProps } from '../lib/utils.js';
import { PillCloseable } from './subcomponents/pill-closeable.js';
import styles from './pill.module.scss';
import { PillTextTransform } from './constants.js';
import type { PillProps } from './types.js';
import { pillSizeStyle } from './utils.js';

const PillRoot = forwardRef<HTMLButtonElement, PillProps>(function Pill(
	{
		variant,
		color,
		textTransform = PillTextTransform.None,
		textOverflow,
		testId,
		width,
		maxWidth,
		onClick,
		children,
		className: _className,
		style: _style,
		...props
	}: PillProps & RejectedProps,
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
			style={pillSizeStyle(width, maxWidth)}
			onClick={onClick}
			className={styles['pill']}
			{...props}
		>
			{children}
		</BadgeRoot>
	);
});

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
 * `color` picked. The fill stays the one `color` gave it.
 *
 * ### Case
 *
 * `textTransform` defaults to `none`, unlike `Badge`: a pill holds content the user picked or
 * typed, so it keeps its own case. `uppercase` is not offered.
 *
 * ### Truncation
 *
 * Same as `Badge`: `textOverflow="ellipsis"` (the default) measures the content and shows the
 * full text in a tooltip while it does not fit. `hidden` clips with no tooltip.
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
export const Pill = Object.assign(
	PillRoot as unknown as <T extends PillProps>(
		props: T &
			// `T` is inferred from the call site, so `T extends PillProps` alone never runs excess
			// property checks, and a spread of props held in a variable would carry a `className`
			// through. Every key outside the props is pinned to `never` instead.
			Record<Exclude<keyof T, keyof PillProps | keyof RefAttributes<HTMLButtonElement>>, never> &
			RefAttributes<HTMLButtonElement>,
	) => ReactElement | null,
	{ Closeable: PillCloseable },
);
