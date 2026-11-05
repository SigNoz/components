export function toCssLength(value: string | number): string {
	return typeof value === 'number' ? `${value}px` : value;
}

/**
 * A computed length as a number of pixels, `0` for what is not one, such as `normal` or `auto`.
 */
export function readPx(value: string): number {
	return Number.parseFloat(value) || 0;
}
