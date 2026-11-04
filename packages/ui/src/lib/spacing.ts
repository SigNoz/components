/**
 * The steps of the spacing scale a margin prop takes. Each step is 2px, and step `n` reads
 * `--spacing-n`.
 */
export const SpacingStep = [
	0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 16, 20, 24, 32, 40, 48, 56, 64,
] as const;

export type SpacingStepType = (typeof SpacingStep)[number];

/**
 * A margin: a step of the spacing scale, or `auto` to take the free space.
 */
export type MarginType = SpacingStepType | 'auto';

/**
 * The names of the margin props, from the widest to the narrowest.
 *
 * @access private
 */
export const MarginPropNames = [
	'margin',
	'marginX',
	'marginY',
	'marginTop',
	'marginRight',
	'marginBottom',
	'marginLeft',
] as const;

/**
 * @access private
 */
export type MarginPropName = (typeof MarginPropNames)[number];

/**
 * The margin props as a component receives them. A prop the component's types forbid arrives as
 * its rule type, so every value is `unknown` until it is read.
 *
 * @access private
 */
export type MarginProps = Partial<Record<MarginPropName, unknown>>;

const MARGIN_PROP_NAMES: ReadonlySet<string> = new Set(MarginPropNames);

function toSpacing(value: unknown): string | undefined {
	if (value === 'auto') {
		return 'auto';
	}

	if (typeof value !== 'number') {
		return undefined;
	}

	return value === 0 ? '0' : `var(--spacing-${value})`;
}

/**
 * The `margin` shorthand for the margin props, or `undefined` when none is set. One side wins over
 * its axis (`marginX`, `marginY`), and the axis wins over `margin`.
 *
 * @access private
 */
export function toMarginShorthand(props: MarginProps): string | undefined {
	const sides = [
		props.marginTop ?? props.marginY ?? props.margin,
		props.marginRight ?? props.marginX ?? props.margin,
		props.marginBottom ?? props.marginY ?? props.margin,
		props.marginLeft ?? props.marginX ?? props.margin,
	].map(toSpacing);

	if (sides.every((side) => side === undefined)) {
		return undefined;
	}

	const [top = '0', right = '0', bottom = '0', left = '0'] = sides;

	if (right !== left) {
		return `${top} ${right} ${bottom} ${left}`;
	}

	if (top !== bottom) {
		return `${top} ${right} ${bottom}`;
	}

	return top === right ? top : `${top} ${right}`;
}

/**
 * Splits the margin props from the other props, so they never reach the DOM.
 *
 * @access private
 */
export function splitMarginProps<Props extends object>(
	props: Props,
): [MarginProps, Omit<Props, MarginPropName>] {
	const margin: Record<string, unknown> = {};
	const rest: Record<string, unknown> = {};

	for (const [key, value] of Object.entries(props)) {
		if (MARGIN_PROP_NAMES.has(key)) {
			margin[key] = value;
		} else {
			rest[key] = value;
		}
	}

	return [margin, rest as Omit<Props, MarginPropName>];
}
