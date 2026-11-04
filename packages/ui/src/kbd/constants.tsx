export const KbdMode = {
	Chord: 'chord',
	Sequence: 'sequence',
} as const;

export const KbdDisplay = {
	Inline: 'inline',
	Block: 'block',
} as const;

/**
 * The keys `Kbd` draws as a glyph, named as `KeyboardEvent.key` names them, plus `Mod` for the
 * platform modifier (`Meta` on macOS, `Control` elsewhere).
 */
export const KbdNamedKey = {
	Escape: 'Escape',
	Enter: 'Enter',
	Backspace: 'Backspace',
	Tab: 'Tab',
	Shift: 'Shift',
	Meta: 'Meta',
	Alt: 'Alt',
	Control: 'Control',
	Mod: 'Mod',
	ArrowUp: 'ArrowUp',
	ArrowDown: 'ArrowDown',
	ArrowLeft: 'ArrowLeft',
	ArrowRight: 'ArrowRight',
} as const;

/**
 * The modifiers `Kbd.Shortcut` moves to the front, in the order they are given.
 *
 * @access private
 */
export const KBD_MODIFIERS: ReadonlySet<string> = new Set([
	KbdNamedKey.Shift,
	KbdNamedKey.Meta,
	KbdNamedKey.Alt,
	KbdNamedKey.Control,
	KbdNamedKey.Mod,
]);
