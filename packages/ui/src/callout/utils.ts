import type { CSSProperties } from 'react';
import { toCssLength } from '../lib/css-length.js';
import type { CalloutProps } from './types.js';

/**
 * Writes `width`, `maxWidth`, `height` and `maxHeight` as the `--callout-internal-*` properties
 * the tokens read, leaving out the ones that are not set. Numbers are written as `px`.
 *
 * @access private
 */
export function calloutSizeStyle({
	width,
	maxWidth,
	height,
	maxHeight,
}: Pick<CalloutProps, 'width' | 'maxWidth' | 'height' | 'maxHeight'>): CSSProperties {
	return {
		...(width != null && { '--callout-internal-width': toCssLength(width) }),
		...(maxWidth != null && {
			'--callout-internal-max-width': toCssLength(maxWidth),
		}),
		...(height != null && {
			'--callout-internal-height': toCssLength(height),
		}),
		...(maxHeight != null && {
			'--callout-internal-max-height': toCssLength(maxHeight),
		}),
	} as CSSProperties;
}
