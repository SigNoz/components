const UNITLESS_NUMBER = /^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i;

export function toCssLength(value: string | number): string {
	if (typeof value === 'number') {
		return `${value}px`;
	}
	const trimmed = value.trim();
	return UNITLESS_NUMBER.test(trimmed) ? `${Number(trimmed)}px` : value;
}

/**
 * A computed length as a number of pixels, `0` for what is not one, such as `normal` or `auto`.
 */
export function readPx(value: string): number {
	return Number.parseFloat(value) || 0;
}
