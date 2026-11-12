import { forwardRef, type ReactElement } from 'react';
import type { RejectedProps } from '../../lib/utils.js';
import styles from '../skeleton.module.scss';
import type { SkeletonInputProps, SkeletonExactProps } from '../types.js';
import { skeletonWidthStyle } from '../utils.js';

/**
 * A placeholder at the height of an `Input`. Reached as `Skeleton.Input`, not imported on its own.
 * Like `Input`, it fills its parent unless `width` says otherwise.
 *
 * Forwards `ref`, `id` and any `data-*` prop to the placeholder, which renders
 * `aria-hidden="true"`.
 *
 * Visual values are `--skeleton-input-*` custom properties, defaults in the `css-tokens` region
 * of [../index.ts](../index.ts).
 *
 * ### Asserting on it
 *
 * | `data-*` | when |
 * |---|---|
 * | `data-size` | always, `sm`, `md` or `lg` |
 * | `data-active` | present while `active` is `true` |
 *
 * | `data-slot` | rendered |
 * |---|---|
 * | `skeleton-input` | the placeholder, carries `testId` |
 *
 * @example
 * ```tsx
 * <Skeleton.Input size="md" />
 * ```
 */
const SkeletonInputImpl = forwardRef<HTMLDivElement, SkeletonInputProps>(function SkeletonInput(
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
	}: SkeletonInputProps & RejectedProps,
	ref,
) {
	return (
		<div
			{...props}
			ref={ref}
			aria-hidden="true"
			data-slot="skeleton-input"
			data-size={size}
			data-active={active || undefined}
			className={styles['skeleton-input']}
			style={skeletonWidthStyle({ width, maxWidth })}
			{...(testId === undefined ? {} : { 'data-testid': testId })}
		/>
	);
});
SkeletonInputImpl.displayName = 'Skeleton.Input';

export const SkeletonInput = SkeletonInputImpl as <T extends SkeletonInputProps>(
	props: SkeletonExactProps<T, SkeletonInputProps>,
) => ReactElement;
