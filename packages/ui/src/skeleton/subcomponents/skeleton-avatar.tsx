import { forwardRef, type ReactElement } from 'react';
import type { RejectedProps } from '../../lib/utils.js';
import styles from '../skeleton.module.scss';
import type { SkeletonAvatarProps, SkeletonExactProps } from '../types.js';

/**
 * A placeholder at the size of an `Avatar`. Reached as `Skeleton.Avatar`, not imported on its own.
 * It keeps its size in a flex row and does not shrink.
 *
 * Forwards `ref`, `id` and any `data-*` prop to the placeholder, which renders
 * `aria-hidden="true"`.
 *
 * Visual values are `--skeleton-avatar-*` custom properties, defaults in the `css-tokens` region
 * of [../index.ts](../index.ts).
 *
 * ### Asserting on it
 *
 * | `data-*` | when |
 * |---|---|
 * | `data-size` | always, `sm` or `md` |
 * | `data-shape` | always, `circle` or `square` |
 * | `data-active` | present while `active` is `true` |
 *
 * | `data-slot` | rendered |
 * |---|---|
 * | `skeleton-avatar` | the placeholder, carries `testId` |
 *
 * @example
 * ```tsx
 * <Skeleton.Avatar size="md" shape="square" />
 * ```
 */
const SkeletonAvatarImpl = forwardRef<HTMLDivElement, SkeletonAvatarProps>(function SkeletonAvatar(
	{
		active = true,
		size,
		shape = 'circle',
		testId,
		children: _children,
		className: _className,
		style: _style,
		...props
	}: SkeletonAvatarProps & RejectedProps,
	ref,
) {
	return (
		<div
			{...props}
			ref={ref}
			aria-hidden="true"
			data-slot="skeleton-avatar"
			data-size={size}
			data-shape={shape}
			data-active={active || undefined}
			className={styles['skeleton-avatar']}
			{...(testId === undefined ? {} : { 'data-testid': testId })}
		/>
	);
});
SkeletonAvatarImpl.displayName = 'Skeleton.Avatar';

export const SkeletonAvatar = SkeletonAvatarImpl as <T extends SkeletonAvatarProps>(
	props: SkeletonExactProps<T, SkeletonAvatarProps>,
) => ReactElement;
