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

type SpacingPropName =
	`${'margin' | 'padding'}${'' | 'X' | 'Y' | 'Top' | 'Right' | 'Bottom' | 'Left'}`;

/**
 * The margin and padding props as a component receives them, every value `unknown` until it is
 * read.
 *
 * @access private
 */
export type SpacingProps = Partial<Record<SpacingPropName, unknown>>;

const MARGIN_PROP_NAMES: ReadonlySet<string> = new Set(MarginPropNames);

const SPACING_STEPS: ReadonlySet<unknown> = new Set(SpacingStep);

/**
 * A step of the spacing scale as a CSS value: `0`, `var(--spacing-{step})`, or `auto`. Takes any
 * value, for a caller with no types, and what is not a step or `auto` is `undefined`.
 *
 * @access private
 */
export function toSpacingValue(value: unknown): string | undefined {
	if (value === 'auto') {
		return 'auto';
	}

	if (!SPACING_STEPS.has(value)) {
		return undefined;
	}

	return value === 0 ? '0' : `var(--spacing-${value})`;
}

/**
 * The `margin` or `padding` shorthand for the spacing props, or `undefined` when none is set. One
 * side wins over its axis (`marginX`, `marginY`), and the axis wins over the prop (`margin`).
 *
 * @access private
 */
export function toSpacingShorthand(
	props: SpacingProps,
	prop: 'margin' | 'padding',
): string | undefined {
	const all = props[prop];
	const x = props[`${prop}X`];
	const y = props[`${prop}Y`];
	const sides = [
		props[`${prop}Top`] ?? y ?? all,
		props[`${prop}Right`] ?? x ?? all,
		props[`${prop}Bottom`] ?? y ?? all,
		props[`${prop}Left`] ?? x ?? all,
	].map(toSpacingValue);

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
 * The `margin` shorthand for the margin props, or `undefined` when none is set.
 *
 * @access private
 */
export function toMarginShorthand(props: MarginProps): string | undefined {
	return toSpacingShorthand(props, 'margin');
}

/**
 * Splits the margin props from the other props, so they never reach the DOM.
 *
 * @access private
 */
export function splitMarginProps<Props extends object>(
	props: Props,
): [MarginProps, Omit<Props, MarginPropName>] {
	const [margin, rest] = splitProps(props, MARGIN_PROP_NAMES);

	return [margin, rest as Omit<Props, MarginPropName>];
}

/**
 * Splits the props named in `names` from the rest, for a component that turns its spacing props
 * into custom properties and spreads the rest onto its element.
 *
 * @access private
 */
export function splitProps(
	props: object,
	names: ReadonlySet<string>,
): [Record<string, unknown>, Record<string, unknown>] {
	const picked: Record<string, unknown> = {};
	const rest: Record<string, unknown> = {};

	for (const [key, value] of Object.entries(props)) {
		if (names.has(key)) {
			picked[key] = value;
		} else {
			rest[key] = value;
		}
	}

	return [picked, rest];
}
