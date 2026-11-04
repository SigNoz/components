import type { CSSProperties } from 'react';
import { toCssLength } from '../lib/css-length.js';
import { SKELETON_DEFAULT_ROWS } from './constants.js';
import type { SkeletonParagraphConfig, SkeletonRow, SkeletonWidthProps } from './types.js';

const CSS_KEYWORD = /^[a-z]+(?:-[a-z]+)*$/i;

/**
 * An inline style that sets only internal vars the stylesheet reads, each written as a CSS length.
 * A var whose value is `null` or `undefined` is left out.
 *
 * @access private
 */
export function skeletonLengthStyle(
	vars: Record<`--skeleton-internal-${string}`, string | number | null | undefined>,
): CSSProperties {
	const style: Record<string, string> = {};
	for (const [name, value] of Object.entries(vars)) {
		if (value != null) {
			style[name] = toCssLength(value);
		}
	}
	return style as CSSProperties;
}

/**
 * The inline style of a part that takes `width` and `maxWidth`: only the internal vars the
 * stylesheet reads, never `width` itself.
 *
 * @access private
 */
export function skeletonWidthStyle({ width, maxWidth }: SkeletonWidthProps): CSSProperties {
	return skeletonLengthStyle({
		'--skeleton-internal-width': width,
		'--skeleton-internal-max-width': maxWidth,
	});
}

/**
 * {@link skeletonWidthStyle} for `Skeleton.Button`, whose min width is a `min()` over its widths.
 * `min()` takes only lengths, so a keyword `maxWidth` such as `none` would drop that floor. The
 * floor is capped at 100% instead, as with no `maxWidth`.
 *
 * @access private
 */
export function skeletonButtonWidthStyle(props: SkeletonWidthProps): CSSProperties {
	return {
		...skeletonWidthStyle(props),
		...skeletonLengthStyle({
			'--skeleton-internal-min-width-cap': isCssKeyword(props.maxWidth) ? '100%' : undefined,
		}),
	};
}

function isCssKeyword(value: string | number | undefined): boolean {
	return typeof value === 'string' && CSS_KEYWORD.test(value.trim());
}

/**
 * The rows `paragraph` asks for.
 *
 * @access private
 */
export function skeletonRows(paragraph: SkeletonParagraphConfig): SkeletonRow[] {
	const { rows = SKELETON_DEFAULT_ROWS, width } = paragraph;
	const count = Number.isFinite(rows) ? Math.max(0, Math.trunc(rows)) : SKELETON_DEFAULT_ROWS;

	return Array.from({ length: count }, (_, index) => ({
		id: `row-${index}` as const,
		width: Array.isArray(width) ? width[index] : width,
	}));
}
