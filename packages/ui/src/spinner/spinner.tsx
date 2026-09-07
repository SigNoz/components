import type { AriaAttributes, ComponentProps, CSSProperties, ReactElement } from 'react';
import { forwardRef } from 'react';
import { cn } from '../lib/utils.js';
import styles from './spinner.module.scss';

export interface SpinnerProps
	extends Pick<ComponentProps<'div'>, 'className' | 'id' | 'style' | 'role'>, AriaAttributes {
	/**
	 * Diameter of the ring, written to `--spinner-size`. A number is read as pixels.
	 * @default 12px
	 */
	size?: number | string;
	/**
	 * Test ID for the spinner.
	 */
	testId?: string;
}

/**
 * Renders a `<div>` drawn as a ring, rotating while work is in flight.
 *
 * Only the props in {@link SpinnerProps} are forwarded: `className`, `id`, `style`, `role` and
 * any `aria-*`. Other native `<div>` attributes are not.
 *
 * Visual values are `--spinner-*` custom properties, defaults in the `css-tokens` region of
 * [./index.ts](./index.ts). Both ring colours derive from `currentColor`, so it takes the
 * colour of whatever it sits in.
 *
 * ### Accessibility
 *
 * It carries no role and no text of its own, so it says nothing to a screen reader.
 *
 * The element whose state it describes announces it: `aria-busy` on a button, or `role="status"`
 * plus an `aria-label` here when the spinner stands alone.
 *
 * ### Indeterminate only
 *
 * The ring always rotates, saying work of unknown length is in flight. There is no determinate
 * mode. Use `Progress` when the share done is known.
 *
 * Mount it only while the work runs, or freeze it from the outside with
 * `animation-play-state: paused` when it has to stay in the layout (this is what `Button` does
 * with its idle spinner).
 *
 * ### Size
 *
 * `size` is written as an inline `--spinner-size`, so it composes with the tokens instead of
 * overwriting `style.width`. Numbers are written as `px`.
 *
 * Any `style` you pass is kept, and a `--spinner-size` in it wins over the prop.
 *
 * ### Reduced motion
 *
 * Under `prefers-reduced-motion` the rotation slows to `--spinner-reduced-motion-duration`
 * instead of stopping, because it is the only signal that anything is happening.
 *
 * ### Asserting on it
 *
 * `testId` is `data-testid`. Otherwise use the data attributes, never the hashed class names.
 * There is a single element, no sub-slots.
 *
 * | root attribute | value |
 * |---|---|
 * | `data-slot` | `"spinner"` |
 *
 * @example
 * ```tsx
 * <Spinner role="status" aria-label="Loading results" />
 * ```
 *
 * @example
 * ```tsx
 * // Bigger
 * <Spinner size={24} />
 * ```
 */
export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(function Spinner(
	{ className, size, style, testId, ...props },
	ref,
): ReactElement {
	return (
		<div
			ref={ref}
			data-slot="spinner"
			className={cn(styles.spinner, className)}
			style={
				size === undefined
					? style
					: ({
							'--spinner-size': typeof size === 'number' ? `${size}px` : size,
							...style,
						} as CSSProperties)
			}
			{...props}
			{...(testId === undefined ? {} : { 'data-testid': testId })}
		/>
	);
});
