import type { CSSProperties } from 'react';
import { toCssLength } from '../lib/css-length.js';

/**
 * Merges `width`/`maxWidth` into the caller's `style` as `--pill-internal-width` and
 * `--pill-internal-max-width`, so they compose with the tokens instead of overwriting
 * `style.width`. Numbers are written as `px`.
 *
 * Both `Pill` and `Pill.Closeable` need this rather than `BadgeRoot`'s own `width`/`maxWidth`
 * props: `pill.module.scss` points `--badge-width`/`--badge-max-width` at the `--pill-*` chain,
 * which shadows the `--badge-internal-*` properties `BadgeRoot` would otherwise write, so the
 * value only lands if it arrives under the `--pill-` prefix.
 *
 * @access private
 */
export function pillSizeStyle(
	style: CSSProperties | undefined,
	width: CSSProperties['width'],
	maxWidth: CSSProperties['maxWidth'],
): CSSProperties {
	return {
		...style,
		...(width != null && { '--pill-internal-width': toCssLength(width) }),
		...(maxWidth != null && { '--pill-internal-max-width': toCssLength(maxWidth) }),
	} as CSSProperties;
}
