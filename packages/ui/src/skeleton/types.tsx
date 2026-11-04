import type { ComponentProps, CSSProperties, RefAttributes } from 'react';
import type { SkeletonAvatarShape, SkeletonSize } from './constants.js';

export type SkeletonSizeType = (typeof SkeletonSize)[keyof typeof SkeletonSize];

export type SkeletonAvatarShapeType =
	(typeof SkeletonAvatarShape)[keyof typeof SkeletonAvatarShape];

/**
 * The props every skeleton part takes.
 *
 * @access private
 */
export type SkeletonBaseProps = Pick<ComponentProps<'div'>, 'id'> & {
	/**
	 * Plays the shimmer. Set it to `false` for a still fill, on a placeholder that does not stand for
	 * data being loaded.
	 *
	 * @note With `prefers-reduced-motion: reduce` the shimmer does not play and the skeleton shows
	 * the static fill.
	 *
	 * @default true
	 */
	active?: boolean;
	/**
	 * Not accepted: the skeleton never wraps the real content. Render it in its own loading branch.
	 */
	children?: never;
	/**
	 * Any `data-*` prop is accepted and forwarded to the root.
	 */
	[key: `data-${string}`]: unknown;
};

/**
 * `width` and `maxWidth`, for the parts that take a free width.
 *
 * @access private
 */
export type SkeletonWidthProps = {
	/**
	 * The width of the skeleton. Without it the skeleton fills its parent. Numbers are written as
	 * `px`.
	 */
	width?: CSSProperties['width'];
	/**
	 * The max-width of the skeleton. Numbers are written as `px`.
	 *
	 * @default '100%'
	 */
	maxWidth?: CSSProperties['maxWidth'];
};

/**
 * The props a skeleton part takes at the call site: `P`, the ref, and no other key. `T` is inferred
 * from the call site, so `T extends P` alone never runs the excess property check, and an object
 * spread with a `className` in it would compile. Every key outside `P` is pinned to `never`.
 *
 * @access private
 */
export type SkeletonExactProps<T, P> = T &
	Record<Exclude<keyof T, keyof P | keyof RefAttributes<HTMLDivElement>>, never> &
	RefAttributes<HTMLDivElement>;

export type SkeletonTitleConfig = {
	/**
	 * The width of the title bar. Numbers are written as `px`.
	 *
	 * @default '38%'
	 */
	width?: string | number;
};

export type SkeletonParagraphConfig = {
	/**
	 * How many rows to draw. `0` draws none and keeps the title.
	 *
	 * @default 3
	 */
	rows?: number;
	/**
	 * The width of the rows: one value for every row, or one value per row. A row with no value in
	 * the array is `100%` wide. Numbers are written as `px`.
	 *
	 * @default '100%'
	 */
	width?: string | number | Array<string | number>;
};

/**
 * One row of `Skeleton`: its place, which is also its key and its `testId` suffix, and its width,
 * `undefined` where the row keeps the default.
 *
 * @access private
 */
export type SkeletonRow = { id: `row-${number}`; width: string | number | undefined };

export type SkeletonProps = SkeletonBaseProps &
	SkeletonWidthProps & {
		/**
		 * Shows the title bar above the rows, or sets its width. `false` hides it.
		 *
		 * @default true
		 */
		title?: boolean | SkeletonTitleConfig;
		/**
		 * Shows the rows, or sets how many rows and their width. `false` hides them.
		 *
		 * @note With `title={false}` too, the skeleton is an empty box with no height. Do not render
		 * the skeleton at all instead.
		 *
		 * @default true
		 */
		paragraph?: boolean | SkeletonParagraphConfig;
		/**
		 * Forwarded to the root as `data-testid`. The parts take it as a prefix:
		 * `${testId}-title`, `${testId}-paragraph` and `${testId}-row-${index}`.
		 */
		testId?: string;
	};

export type SkeletonInputProps = SkeletonBaseProps &
	SkeletonWidthProps & {
		/**
		 * The height of the placeholder: `sm` is 24px, `md` is 32px, the height of an `Input` at its
		 * default size.
		 */
		size: SkeletonSizeType;
		/**
		 * Forwarded to the placeholder as `data-testid`.
		 */
		testId?: string;
	};

export type SkeletonButtonProps = SkeletonBaseProps & {
	/**
	 * The height of the placeholder: `sm` is 24px, `md` is 32px, the same heights as `Button`.
	 * Without `width`, it also sets the width: 48px at `sm`, 64px at `md`.
	 */
	size: SkeletonSizeType;
	/**
	 * The width of the placeholder. Without it the width follows `size`. `'100%'` fills the parent.
	 * Numbers are written as `px`.
	 */
	width?: CSSProperties['width'];
	/**
	 * The max-width of the placeholder. Numbers are written as `px`.
	 *
	 * @default '100%'
	 */
	maxWidth?: CSSProperties['maxWidth'];
	/**
	 * Forwarded to the placeholder as `data-testid`.
	 */
	testId?: string;
};

export type SkeletonAvatarProps = SkeletonBaseProps & {
	/**
	 * The size of the placeholder: `sm` is 24px, `md` is 32px, the same sizes as `Avatar` at `sm`
	 * and `md`.
	 */
	size: SkeletonSizeType;
	/**
	 * The shape of the placeholder. Same union as `Avatar`.
	 *
	 * @default 'circle'
	 */
	shape?: SkeletonAvatarShapeType;
	/**
	 * Forwarded to the placeholder as `data-testid`.
	 */
	testId?: string;
};
