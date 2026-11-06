import {
	forwardRef,
	Fragment,
	useEffect,
	type CSSProperties,
	type ReactElement,
	type RefAttributes,
} from 'react';
import { splitMarginProps, toMarginShorthand } from '../../lib/spacing.js';
import { partTestId, type RejectedProps } from '../../lib/utils.js';
import { KbdDisplay, KbdMode } from '../constants.js';
import styles from '../kbd.module.scss';
import type { KbdShortcutProps, ValidateKbdShortcutProps } from '../types.js';
import { useIsMac } from '../use-is-mac.js';
import { isKbdKey, orderKbdKeys } from '../utils.js';
import { KbdCap } from './kbd-cap.js';

const KbdShortcutImpl = forwardRef<HTMLElement, KbdShortcutProps>(function KbdShortcut(
	{
		keys,
		mode = KbdMode.Chord,
		disabled = false,
		pressed = false,
		display = KbdDisplay.Inline,
		testId,
		className: _className,
		style: _style,
		children: _children,
		...rest
	}: KbdShortcutProps & RejectedProps<'className' | 'style' | 'children'>,
	ref,
) {
	const [marginProps, props] = splitMarginProps(rest);
	const margin = display === KbdDisplay.Block ? toMarginShorthand(marginProps) : undefined;
	const isMac = useIsMac();
	const isSequence = mode === KbdMode.Sequence;
	const ordered = isSequence ? keys : orderKbdKeys(keys);
	const invalid = ordered.filter((key) => !isKbdKey(key));
	const isValid = ordered.length > 0 && invalid.length === 0;
	const invalidMessage = invalid.map((key) => JSON.stringify(key)).join(', ');

	useEffect(() => {
		if (invalidMessage !== '') {
			console.error(
				`Kbd.Shortcut: ${invalidMessage} is not a key, so the shortcut renders nothing. Use a named key such as "Escape" or "Mod", or one visible character.`,
			);
		}
	}, [invalidMessage]);

	if (!isValid) {
		return null;
	}

	return (
		<kbd
			{...props}
			ref={ref}
			data-slot="kbd-shortcut"
			data-mode={mode}
			data-display={display}
			data-disabled={disabled || undefined}
			data-testid={testId}
			className={styles['kbd-shortcut']}
			style={
				margin === undefined
					? undefined
					: ({ '--kbd-shortcut-internal-margin': margin } as CSSProperties)
			}
		>
			{ordered.map((key, index) => (
				// oxlint-disable-next-line react/no-array-index-key -- a key may repeat (`G G`), its place is its identity
				<Fragment key={index}>
					{index > 0 ? (
						<span className={styles['kbd__word']}>{isSequence ? ' then ' : ' '}</span>
					) : null}
					<KbdCap
						value={key}
						isMac={isMac}
						disabled={disabled}
						pressed={pressed}
						testId={partTestId(testId, `key-${index}`)}
					/>
				</Fragment>
			))}
		</kbd>
	);
});

/**
 * Renders a shortcut as one `kbd` element holding a `kbd` per key, the HTML pattern for a key
 * combination. Reached as `Kbd.Shortcut`, not imported on its own.
 *
 * Every `aria-*` and any `data-*` are forwarded to the outer `kbd` element.
 *
 * Visual values are `--kbd-*` custom properties, defaults in the `css-tokens` region of
 * [../index.ts](../index.ts).
 *
 * ### Chord and sequence
 *
 * `mode` sets how the keys sit and how they read. A chord is keys held together, `⌘ K`, and a
 * sequence is keys pressed one after the other, `G` then `D`, with a wider gap between them and
 * `then` in the spoken text. A chord draws its modifiers first; a sequence keeps the keys in the
 * order given, since the order is what the user types. Neither mode keeps any state.
 *
 * ### Pressing
 *
 * `pressed` draws every key of the shortcut as pressed at once. The shortcut never listens to the
 * keyboard, so the consumer sets `pressed`, for example while its own shortcut handler runs. A
 * disabled shortcut never shows as pressed.
 *
 * ### Accessibility
 *
 * A chord reads as its words joined by spaces (`Command K`), a sequence joins them with `then`
 * (`G then D`). The parent that already names the action marks the shortcut `aria-hidden` and
 * points `aria-describedby` at it.
 *
 * ### Asserting on it
 *
 * `testId` is the outer `data-testid`, and each key gets `{testId}-key-{index}` in drawn order.
 *
 * | root attribute | value |
 * |---|---|
 * | `data-slot` | `"kbd-shortcut"` |
 * | `data-mode` | mirrors `mode` |
 * | `data-display` | mirrors `display` |
 * | `data-disabled` | present only while `disabled` is `true` |
 *
 * Each key carries the attributes `Kbd` documents (`data-slot="kbd"`, `data-key`, `data-pressed`).
 *
 * @example
 * ```tsx
 * <Kbd.Shortcut keys={['Mod', 'K']} />
 * ```
 *
 * @example
 * ```tsx
 * // G, then D
 * <Kbd.Shortcut keys={['G', 'D']} mode="sequence" />
 * ```
 *
 * @example
 * ```tsx
 * // Drawn as pressed while the consumer's own handler runs
 * <Kbd.Shortcut keys={['Mod', 'K']} pressed={isOpening} />
 * ```
 */
export const KbdShortcut = KbdShortcutImpl as unknown as (<T extends KbdShortcutProps>(
	props: T &
		ValidateKbdShortcutProps<T> &
		Record<Exclude<keyof T, keyof KbdShortcutProps | keyof RefAttributes<HTMLElement>>, never> &
		RefAttributes<HTMLElement>,
) => ReactElement | null) & { displayName?: string };

KbdShortcut.displayName = 'Kbd.Shortcut';
