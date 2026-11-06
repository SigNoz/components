import { forwardRef, type ReactElement } from 'react';
import { partTestId, type RejectedProps } from '../lib/utils.js';
import styles from './skeleton.module.scss';
import { SkeletonAvatar } from './subcomponents/skeleton-avatar.js';
import { SkeletonButton } from './subcomponents/skeleton-button.js';
import { SkeletonInput } from './subcomponents/skeleton-input.js';
import type { SkeletonExactProps, SkeletonProps } from './types.js';
import { skeletonLengthStyle, skeletonRows, skeletonWidthStyle } from './utils.js';

/**
 * A placeholder that keeps the shape of a block of text while it loads: a title bar and rows. It
 * is decorative, so it has no hover, no focus and no events. Render it in the loading branch of
 * your own check; it never wraps the real content.
 *
 * Forwards `ref`, `id` and any `data-*` prop to the root.
 *
 * Visual values are `--skeleton-*` custom properties, defaults in the `css-tokens` region of
 * [./index.ts](./index.ts).
 *
 * Every part renders `aria-hidden="true"`, so a screen reader does not read each bar. Mark the
 * region that is loading with `aria-busy="true"` and, when the wait needs to be announced, add one
 * status message for the region.
 *
 * ### Placeholders for controls
 *
 * `Skeleton.Input`, `Skeleton.Button` and `Skeleton.Avatar` stand for one control each, at the
 * height of that control, so swapping the placeholder for the control keeps the layout still. Put
 * a `Skeleton.Avatar` next to a `Skeleton` for a text block with an avatar.
 *
 * ### Asserting on it
 *
 * | `data-*` | when |
 * |---|---|
 * | `data-active` | present while `active` is `true` |
 *
 * | `data-slot` | rendered |
 * |---|---|
 * | `skeleton` | the root, carries `testId` |
 * | `skeleton-title` | the title bar, `${testId}-title` |
 * | `skeleton-paragraph` | the box around the rows, `${testId}-paragraph` |
 * | `skeleton-row` | each row, `${testId}-row-${index}` |
 *
 * @example
 * ```tsx
 * <Skeleton />
 * ```
 *
 * @example
 * ```tsx
 * <Skeleton title={false} paragraph={{ rows: 6, width: ['100%', '80%'] }} />
 * ```
 */
const SkeletonRoot = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
	{
		active = true,
		title = true,
		paragraph = true,
		width,
		maxWidth,
		testId,
		children: _children,
		className: _className,
		style: _style,
		...props
	}: SkeletonProps & RejectedProps,
	ref,
) {
	const titleWidth = title && title !== true ? title.width : undefined;
	const rows = paragraph ? skeletonRows(paragraph === true ? {} : paragraph) : [];

	return (
		<div
			{...props}
			ref={ref}
			aria-hidden="true"
			data-slot="skeleton"
			data-active={active || undefined}
			className={styles.skeleton}
			style={skeletonWidthStyle({ width, maxWidth })}
			{...(testId === undefined ? {} : { 'data-testid': testId })}
		>
			{Boolean(title) && (
				<div
					data-slot="skeleton-title"
					className={styles['skeleton__title']}
					style={skeletonLengthStyle({ '--skeleton-internal-title-width': titleWidth })}
					data-testid={partTestId(testId, 'title')}
				/>
			)}
			{rows.length > 0 && (
				<div
					data-slot="skeleton-paragraph"
					className={styles['skeleton__paragraph']}
					data-testid={partTestId(testId, 'paragraph')}
				>
					{rows.map((row) => (
						<div
							key={row.id}
							data-slot="skeleton-row"
							className={styles['skeleton__row']}
							style={skeletonLengthStyle({ '--skeleton-internal-row-width': row.width })}
							data-testid={partTestId(testId, row.id)}
						/>
					))}
				</div>
			)}
		</div>
	);
});

export const Skeleton = Object.assign(
	SkeletonRoot as <T extends SkeletonProps>(
		props: SkeletonExactProps<T, SkeletonProps>,
	) => ReactElement,
	{
		Input: SkeletonInput,
		Button: SkeletonButton,
		Avatar: SkeletonAvatar,
	},
);
