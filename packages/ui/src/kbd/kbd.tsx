import {
	forwardRef,
	useEffect,
	type CSSProperties,
	type ReactElement,
	type RefAttributes,
} from 'react';
import { splitMarginProps, toMarginShorthand } from '../lib/spacing.js';
import type { RejectedProps } from '../lib/utils.js';
import { KbdDisplay } from './constants.js';
import { KbdCap } from './subcomponents/kbd-cap.js';
import { KbdShortcut } from './subcomponents/kbd-shortcut.js';
import type { KbdProps, ValidateKbdProps } from './types.js';
import { useIsMac } from './use-is-mac.js';
import { isKbdKey } from './utils.js';

const KbdRoot = forwardRef<HTMLElement, KbdProps>(function Kbd(
	{
		value,
		display = KbdDisplay.Inline,
		pressed = false,
		className: _className,
		style: _style,
		children: _children,
		...rest
	}: KbdProps & RejectedProps<'className' | 'style' | 'children'>,
	ref,
) {
	const [marginProps, props] = splitMarginProps(rest);
	const margin = display === KbdDisplay.Block ? toMarginShorthand(marginProps) : undefined;
	const isMac = useIsMac();
	const isValid = isKbdKey(value);

	useEffect(() => {
		if (!isValid) {
			console.error(
				`Kbd: ${JSON.stringify(value)} is not a key, so the key renders nothing. Use a named key such as "Escape" or "Mod", or one visible character.`,
			);
		}
	}, [isValid, value]);

	if (!isValid) {
		return null;
	}

	return (
		<KbdCap
			{...props}
			ref={ref}
			value={value}
			pressed={pressed}
			isMac={isMac}
			display={display}
			style={
				margin === undefined ? undefined : ({ '--kbd-internal-margin': margin } as CSSProperties)
			}
		/>
	);
});

/**
 * Renders one key of a keyboard hint as a `kbd` element: a fixed square holding one glyph. Use
 * `Kbd.Shortcut` for more than one key.
 *
 * Every `aria-*` and any `data-*` are forwarded to the `kbd` element.
 *
 * Visual values are `--kbd-*` custom properties, defaults in the `css-tokens` region of
 * [./index.ts](./index.ts).
 *
 * ### Pressing
 *
 * `pressed` draws the key as pressed: the face moves down one pixel and takes the pressed
 * background. The key never listens to the keyboard, so the consumer sets `pressed`, for example
 * while its own shortcut handler runs. A disabled key never shows as pressed.
 *
 * ### Mouse
 *
 * The key has no hover, no click handler and no tab stop. A click on it is a click on its
 * parent. Inside a Button, a Command row or a Dropdown row it takes the parent's cursor; elsewhere
 * the cursor is the default arrow.
 *
 * ### Small screens and touch
 *
 * The key is not rendered below 640px or on a touch-only device. A sentence built around a key
 * loses a word there, so hide the whole hint line on those screens.
 *
 * ### Accessibility
 *
 * The glyph is `aria-hidden`, and the key reads as its word (`Command`, `Escape`, `Up arrow`).
 * When the parent already names the action, the parent marks the key `aria-hidden` and points
 * `aria-describedby` at it. The pressed state is visual only.
 *
 * ### Asserting on it
 *
 * `testId` is `data-testid`. Otherwise use the data attributes, never the hashed class names.
 *
 * | root attribute | value |
 * |---|---|
 * | `data-slot` | `"kbd"` |
 * | `data-key` | `value`, as given |
 * | `data-display` | mirrors `display` |
 * | `data-pressed` | present only while `pressed` is `true` and the key is not disabled |
 * | `data-disabled` | present only while `disabled` is `true` |
 *
 * @example
 * ```tsx
 * <Kbd value="Escape" />
 * ```
 *
 * @example
 * ```tsx
 * // A sentence with a key in it
 * <p>
 *   Press <Kbd value={pinKey} /> to pin the tooltip
 * </p>
 * ```
 *
 * @example
 * ```tsx
 * // Drawn as pressed while the consumer's own handler runs
 * <Kbd value="Escape" pressed={isClosing} />
 * ```
 */
export const Kbd = Object.assign(
	KbdRoot as unknown as <T extends KbdProps>(
		props: T &
			ValidateKbdProps<T> &
			// `T` is inferred from the call site, so `T extends KbdProps` alone never runs excess
			// property checks. Every key outside the props is pinned to `never` instead.
			Record<Exclude<keyof T, keyof KbdProps | keyof RefAttributes<HTMLElement>>, never> &
			RefAttributes<HTMLElement>,
	) => ReactElement | null,
	{ Shortcut: KbdShortcut, displayName: 'Kbd' },
);
