import { forwardRef, type ReactElement } from 'react';
import type { RejectedProps } from '../../lib/utils.js';
import styles from '../skeleton.module.scss';
import type { SkeletonButtonProps, SkeletonExactProps } from '../types.js';
import { skeletonButtonWidthStyle } from '../utils.js';

/**
 * A placeholder at the size of a `Button`. Reached as `Skeleton.Button`, not imported on its own.
 * In a short flex row it shrinks like a `Button`, never below the width of its `size`.
 *
 * Forwards `ref`, `id` and any `data-*` prop to the placeholder, which renders
 * `aria-hidden="true"`.
 *
 * Visual values are `--skeleton-button-*` custom properties, defaults in the `css-tokens` region
 * of [../index.ts](../index.ts).
 *
 * ### Asserting on it
 *
 * | `data-*` | when |
 * |---|---|
 * | `data-size` | always, `sm` or `md` |
 * | `data-active` | present while `active` is `true` |
 *
 * | `data-slot` | rendered |
 * |---|---|
 * | `skeleton-button` | the placeholder, carries `testId` |
 *
 * @example
 * ```tsx
 * <Skeleton.Button size="sm" />
 * ```
 */
const SkeletonButtonImpl = forwardRef<HTMLDivElement, SkeletonButtonProps>(function SkeletonButton(
	{
		active = true,
		size,
		width,
		maxWidth,
		testId,
		children: _children,
		className: _className,
		style: _style,
		...props
	}: SkeletonButtonProps & RejectedProps,
	ref,
) {
	return (
		<div
			{...props}
			ref={ref}
			aria-hidden="true"
			data-slot="skeleton-button"
			data-size={size}
			data-active={active || undefined}
			className={styles['skeleton-button']}
			style={skeletonButtonWidthStyle({ width, maxWidth })}
			{...(testId === undefined ? {} : { 'data-testid': testId })}
		/>
	);
});
SkeletonButtonImpl.displayName = 'Skeleton.Button';

export const SkeletonButton = SkeletonButtonImpl as <T extends SkeletonButtonProps>(
	props: SkeletonExactProps<T, SkeletonButtonProps>,
) => ReactElement;
