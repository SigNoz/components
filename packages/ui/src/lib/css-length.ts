const UNITLESS_NUMBER = /^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i;

export function toCssLength(value: string | number): string {
	if (typeof value === 'number') {
		return `${value}px`;
	}
	const trimmed = value.trim();
	return UNITLESS_NUMBER.test(trimmed) ? `${Number(trimmed)}px` : value;
}

/**
 * `toCssLength` for any value, for a caller with no types: what is not a string or a number is
 * `undefined`.
 */
export function toOptionalCssLength(value: unknown): string | undefined {
	return typeof value === 'string' || typeof value === 'number' ? toCssLength(value) : undefined;
}

/**
 * A computed length as a number of pixels, `0` for what is not one, such as `normal` or `auto`.
 */
export function readPx(value: string): number {
	return Number.parseFloat(value) || 0;
}
