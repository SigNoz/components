import type { AriaAttributes, ComponentProps } from 'react';
import type { MarginPropName, MarginType } from '../lib/spacing.js';
import type { KbdDisplay, KbdMode, KbdNamedKey } from './constants.js';

export type KbdModeType = (typeof KbdMode)[keyof typeof KbdMode];
export type KbdDisplayType = (typeof KbdDisplay)[keyof typeof KbdDisplay];
export type KbdMarginType = MarginType;
export type KbdNamedKeyType = (typeof KbdNamedKey)[keyof typeof KbdNamedKey];

/**
 * One key, named as `KeyboardEvent.key` names it (`Escape`, `ArrowUp`), `Mod` for the platform
 * modifier, or one visible character: a letter, a digit or a symbol such as `/`, `?` or `+`.
 */
export type KbdKey = KbdNamedKeyType | (string & {});

/**
 * The type of a margin prop on a key that sits in a line of text, which no value matches.
 *
 * @access private
 */
export interface AKeyInALineHasNoMargin {
	'a key in a line of text takes its spacing from the text: set `display="block"` to give it a margin': never;
}

type KbdMarginProps = {
	/**
	 * The space around the key, as a step of the spacing scale. Each step is 2px, so `4` is 8px.
	 * `auto` takes the free space, such as to push the key to the end of a flex row.
	 *
	 * @note `marginX` and `marginY` win over `margin`, and `marginTop`, `marginRight`,
	 * `marginBottom` and `marginLeft` win over both: `margin={2} marginBottom={6}`.
	 *
	 * @default 0
	 */
	margin?: KbdMarginType;
	/**
	 * The space to the left and the right. Wins over `margin`.
	 */
	marginX?: KbdMarginType;
	/**
	 * The space above and below. Wins over `margin`.
	 */
	marginY?: KbdMarginType;
	/**
	 * The space above. Wins over `marginY` and `margin`.
	 */
	marginTop?: KbdMarginType;
	/**
	 * The space to the right. Wins over `marginX` and `margin`.
	 */
	marginRight?: KbdMarginType;
	/**
	 * The space below. Wins over `marginY` and `margin`.
	 */
	marginBottom?: KbdMarginType;
	/**
	 * The space to the left. Wins over `marginX` and `margin`.
	 */
	marginLeft?: KbdMarginType;
};

/**
 * `display` and the margin props, shared by `Kbd` and `Kbd.Shortcut`.
 *
 * @access private
 */
export type KbdLayoutProps = {
	/**
	 * How the key sits. `inline` keeps it in the line of text around it, centred on the text.
	 * `block` puts it on a line of its own, with no line box around it, and gives it the margin
	 * props.
	 *
	 * @note An inline key takes no margin: the text around it sets the spacing.
	 *
	 * @default 'inline'
	 */
	display?: KbdDisplayType;
} & KbdMarginProps;

/**
 * The props of one key, without `display` and the margin props.
 *
 * @access private
 */
export type KbdKeyProps = Pick<ComponentProps<'kbd'>, 'id'> & {
	/**
	 * Forwarded to the `kbd` element as `data-testid`.
	 */
	testId?: string;
	/**
	 * The key, named as `KeyboardEvent.key` names it, or `Mod` for `⌘` on macOS and `⌃` elsewhere.
	 * The key picks its glyph and its spoken word from this value.
	 *
	 * @note Anything else than a named key or one visible character renders nothing and logs an error.
	 * A word never goes in a key: `Escape` draws `⎋`, never `esc`.
	 */
	value: KbdKey;
	/**
	 * Draws the key at half opacity. A disabled key never shows as pressed, whatever `pressed`
	 * says. Set it when the action the key belongs to is disabled; the control that owns the
	 * action carries `aria-disabled`.
	 *
	 * @default false
	 */
	disabled?: boolean;
	/**
	 * Draws the key as pressed. The key never listens to the keyboard: the consumer sets this, for
	 * example while its own shortcut handler runs.
	 *
	 * @default false
	 */
	pressed?: boolean;
	/**
	 * Any `data-*` prop is accepted and forwarded to the `kbd` element.
	 */
	[key: `data-${string}`]: unknown;
} & AriaAttributes;

export type KbdProps = KbdKeyProps & KbdLayoutProps;

export type KbdShortcutProps = Pick<ComponentProps<'kbd'>, 'id'> & {
	/**
	 * Forwarded to the outer `kbd` element as `data-testid`. Each key gets `{testId}-key-{index}`,
	 * counted in the order the keys are drawn.
	 */
	testId?: string;
	/**
	 * The keys of the shortcut, each one a `value` as `Kbd` takes it. In a chord, modifiers are
	 * drawn first, in the order given, so `['K', 'Mod']` draws `⌘ K`. A sequence keeps the order
	 * given.
	 *
	 * @note An empty list renders nothing.
	 */
	keys: ReadonlyArray<KbdKey>;
	/**
	 * `chord` for keys held together (`⌘ K`), `sequence` for keys pressed one after the other
	 * (`G` then `D`). A sequence sits wider apart and reads with `then` between the keys.
	 *
	 * @default 'chord'
	 */
	mode?: KbdModeType;
	/**
	 * Disables every key of the shortcut. A disabled key never shows as pressed, whatever `pressed`
	 * says.
	 *
	 * @default false
	 */
	disabled?: boolean;
	/**
	 * Draws every key of the shortcut as pressed. The shortcut never listens to the keyboard: the
	 * consumer sets this, for example while its own shortcut handler runs.
	 *
	 * @default false
	 */
	pressed?: boolean;
	/**
	 * Any `data-*` prop is accepted and forwarded to the outer `kbd` element.
	 */
	[key: `data-${string}`]: unknown;
} & AriaAttributes &
	KbdLayoutProps;

interface TheTestIdPropIsCalledTestId {
	'`data-testid` is written as the `testId` prop': never;
}

interface AKeyHoldsOneCharacter {
	'a key is a named key such as `Escape` or `Mod`, or one character; split a word into keys with `Kbd.Shortcut`': never;
}

type IsKbdKey<K> = K extends string
	? string extends K
		? true
		: K extends ' '
			? false
			: K extends KbdNamedKeyType
				? true
				: K extends `${string}${infer Rest}`
					? Rest extends ''
						? true
						: false
					: false
	: true;

type ValidateKbdCommonProps<T> = (T extends { 'data-testid': unknown }
	? TheTestIdPropIsCalledTestId
	: unknown) &
	(Extract<keyof T, MarginPropName> extends never
		? unknown
		: 'display' extends keyof T
			? 'block' extends T['display' & keyof T]
				? unknown
				: AKeyInALineHasNoMargin
			: AKeyInALineHasNoMargin);

/**
 * The rules `Kbd` puts on its props beyond their types: `testId` instead of `data-testid`, a margin
 * only on a block key, and a `value` that is a named key or one character.
 *
 * @access private
 */
export type ValidateKbdProps<T> = ValidateKbdCommonProps<T> &
	(T extends { value: infer V }
		? false extends IsKbdKey<V>
			? AKeyHoldsOneCharacter
			: unknown
		: unknown);

/**
 * The rules `Kbd.Shortcut` puts on its props beyond their types: `testId` instead of `data-testid`,
 * a margin only on a block shortcut, and every key a named key or one character.
 *
 * @access private
 */
export type ValidateKbdShortcutProps<T> = ValidateKbdCommonProps<T> &
	(T extends { keys: ReadonlyArray<infer K> }
		? false extends IsKbdKey<K>
			? AKeyHoldsOneCharacter
			: unknown
		: unknown);
