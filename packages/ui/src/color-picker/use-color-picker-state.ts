import { useEffect, useRef, useState } from 'react';
import { useIsomorphicLayoutEffect } from '../lib/use-isomorphic-layout-effect.js';
import {
	COLOR_PICKER_CHANNEL_MAX,
	COLOR_PICKER_EMPTY_COLOR,
	COLOR_PICKER_PERCENT_MAX,
} from './constants.js';
import type { ColorPickerProps } from './types.js';
import {
	type ColorPickerHsva,
	hexToHsva,
	hexToRgb,
	hsvaToHex,
	parseColorValue,
	parseHexInput,
	parseIntegerInput,
	percentToAlphaDigits,
	rgbToHex,
	toAlphaDigits,
	withAlphaDigits,
} from './utils.js';

type ColorPickerChange = ColorPickerProps['onChange'];

/**
 * What the panel shows: the color it holds, and its hex, `undefined` while it shows no color. The
 * hex is kept next to the color, not derived from it, so a value read into the panel is compared
 * with the value as written.
 */
type PanelState = {
	hsva: ColorPickerHsva;
	hex: string | undefined;
};

/**
 * A text field of the panel: the hex, a red, green or blue channel, or the alpha.
 *
 * @access private
 */
export type ColorPickerTextField = 'hex' | 'r' | 'g' | 'b' | 'a';

/**
 * The text typed in one field of the panel and not committed yet.
 *
 * @access private
 */
export type ColorPickerDraft = {
	field: ColorPickerTextField;
	text: string;
};

/**
 * @access private
 */
export type UseColorPickerStateOptions = {
	isControlled: boolean;
	value: string | undefined;
	defaultValue: string | undefined;
	isOpen: boolean;
	isReadOnly: boolean;
	isOpaque: boolean;
	onChange: ColorPickerChange;
	onAfterChange: ColorPickerChange;
};

/**
 * @access private
 */
export type ColorPickerState = {
	/** The color the picker holds, `#rrggbb` or `#rrggbbaa`, or `undefined` for no color. */
	valueHex: string | undefined;
	panelHsva: ColorPickerHsva;
	/** The color the panel shows, the draft during a drag included. */
	panelHex: string | undefined;
	isDragging: boolean;
	/** The text typed in a field and not committed yet, `null` while every field follows the panel. */
	draft: ColorPickerDraft | null;
	setColor: (hsva: ColorPickerHsva) => void;
	clear: () => void;
	/**
	 * Starts a drag, and returns whether it did: `false` while read-only, and while another pointer
	 * already drags, which keeps a second finger from taking over the drag of the first.
	 */
	startDrag: () => boolean;
	/** Moves the drag to `change` applied to the color the panel holds at that moment. */
	moveDrag: (change: Partial<ColorPickerHsva>) => void;
	endDrag: () => void;
	editText: (field: ColorPickerTextField, text: string) => void;
	commitDraft: (keepEditing: boolean) => void;
	dropDraft: () => void;
	/** Takes `defaultValue` back after the form resets, and drops a drag or a draft in progress. */
	reset: () => void;
};

function toPanel(hex: string | undefined, fallbackHue: number): PanelState {
	return {
		hsva:
			hex === undefined
				? { h: fallbackHue, s: 0, v: 0, a: COLOR_PICKER_PERCENT_MAX }
				: hexToHsva(hex, fallbackHue),
		hex,
	};
}

/**
 * The hex a committed draft writes over the panel color `current`, or `undefined` for text that is
 * not a value of its field. A field writes only its own part: the hex field keeps the alpha unless
 * the text has one, and a channel or the alpha keeps the rest of the color.
 */
function readDraft(
	{ field, text }: ColorPickerDraft,
	current: string | undefined,
	isOpaque: boolean,
): string | undefined {
	const base = current ?? COLOR_PICKER_EMPTY_COLOR;

	if (field === 'hex') {
		const parsed = parseHexInput(text, isOpaque);

		if (parsed === undefined) {
			return undefined;
		}

		return parsed.hasAlpha ? parsed.hex : withAlphaDigits(parsed.hex, toAlphaDigits(base));
	}

	if (field === 'a') {
		// The alpha field is gone once `opaque` turns on, and a draft typed before has nothing to set.
		if (isOpaque) {
			return undefined;
		}

		const percent = parseIntegerInput(text, COLOR_PICKER_PERCENT_MAX);

		return percent === undefined ? undefined : withAlphaDigits(base, percentToAlphaDigits(percent));
	}

	const channel = parseIntegerInput(text, COLOR_PICKER_CHANNEL_MAX);

	if (channel === undefined) {
		return undefined;
	}

	return withAlphaDigits(rgbToHex({ ...hexToRgb(base), [field]: channel }), toAlphaDigits(base));
}

/**
 * The value, the color the panel holds, the drag and the hex field draft, and the callbacks each
 * of them fires.
 *
 * @access private
 */
export function useColorPickerState({
	isControlled,
	value,
	defaultValue,
	isOpen,
	isReadOnly,
	isOpaque,
	onChange,
	onAfterChange,
}: UseColorPickerStateOptions): ColorPickerState {
	const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
	const rawValue = isControlled ? value : uncontrolledValue;
	const { hex: valueHex, isInvalid } = parseColorValue(rawValue, isOpaque);

	useEffect(() => {
		if (isInvalid) {
			console.warn(
				`ColorPicker: ${JSON.stringify(rawValue)} is not a hex color, so the picker holds no color. Pass "#rrggbb", "#rrggbbaa", "#rgb", or undefined for no color.`,
			);
		}
	}, [isInvalid, rawValue]);

	const [panel, setPanel] = useState<PanelState>(() => toPanel(valueHex, 0));
	const [isDragging, setIsDragging] = useState(false);
	const [draft, setDraft] = useState<ColorPickerDraft | null>(null);

	// A drag that the popup closing ends, by an outside press or the trigger unmounting, ends
	// without `onAfterChange`, and so does one that `readOnly` turning on locks. A field draft goes
	// with them: a close that `disabled` forces skips the handler that commits or drops it.
	const isLocked = !isOpen || isReadOnly;

	if (isDragging && isLocked) {
		setIsDragging(false);
	}

	if (draft !== null && isLocked) {
		setDraft(null);
	}

	// The panel follows `value`, except during a drag, where it shows the draft and applies a
	// `value` that changed from outside after the release. A value with no hue keeps the hue the
	// panel holds.
	if (!isDragging && panel.hex !== valueHex) {
		setPanel(toPanel(valueHex, panel.hsva.h));
	}

	// Read by the animation frame and the drag release, which run after the render that scheduled
	// them, so a parent that swaps its handler mid-drag is still called with the latest one.
	const latest = useRef({ isControlled, onChange, onAfterChange });

	useIsomorphicLayoutEffect(() => {
		latest.current = { isControlled, onChange, onAfterChange };
	});

	// The panel and the value as the last change left them. A press on the area blurs a field,
	// which commits its draft, and the press then has to start from that color, not from the
	// one of the render that bound the handler.
	const live = useRef({ panel, valueHex });

	useIsomorphicLayoutEffect(() => {
		live.current = { panel, valueHex };
	});

	function showPanel(next: PanelState): void {
		live.current.panel = next;
		setPanel(next);
	}

	const drag = useRef({
		isActive: false,
		frame: 0,
		pending: null as string | null,
		emitted: undefined as string | undefined,
		pressed: undefined as string | undefined,
	});
	const liveDraft = useRef<ColorPickerDraft | null>(null);

	useEffect(() => {
		const current = drag.current;

		if (isLocked && current.isActive) {
			cancelAnimationFrame(current.frame);
			current.frame = 0;
			current.isActive = false;
			current.pending = null;
		}

		if (isLocked) {
			liveDraft.current = null;
		}
	}, [isLocked]);

	useEffect(() => {
		const current = drag.current;

		return () => cancelAnimationFrame(current.frame);
	}, []);

	function emitChange(next: string | undefined): void {
		live.current.valueHex = next;

		if (!latest.current.isControlled) {
			setUncontrolledValue(next);
		}

		latest.current.onChange?.(next);
	}

	function commit(next: PanelState): void {
		const previousHex = live.current.valueHex;
		showPanel(next);

		if (next.hex !== previousHex) {
			emitChange(next.hex);
			onAfterChange?.(next.hex);
		}
	}

	function flushDrag(): void {
		const current = drag.current;

		cancelAnimationFrame(current.frame);
		current.frame = 0;

		if (current.pending !== null && current.pending !== current.emitted) {
			current.emitted = current.pending;
			emitChange(current.pending);
		}

		current.pending = null;
	}

	// Ends a drag with the color of its last frame and without `onAfterChange`, for a change from
	// the keyboard while the pointer is still down: that change calls `onAfterChange` itself, and
	// the release after it would otherwise report the color of the drag over it.
	function stopDrag(): void {
		const current = drag.current;

		if (!current.isActive) {
			return;
		}

		flushDrag();
		current.isActive = false;
		setIsDragging(false);
	}

	return {
		valueHex,
		panelHsva: panel.hsva,
		panelHex: panel.hex,
		isDragging,
		draft,
		setColor(hsva) {
			stopDrag();
			commit({ hsva, hex: hsvaToHex(hsva) });
		},
		clear() {
			showPanel(toPanel(undefined, live.current.panel.hsva.h));
			emitChange(undefined);
			onAfterChange?.(undefined);
		},
		startDrag() {
			if (isReadOnly || drag.current.isActive) {
				return false;
			}

			// Mutated, not replaced: the unmount cleanup holds this object and cancels its frame.
			Object.assign(drag.current, {
				isActive: true,
				frame: 0,
				pending: null,
				emitted: live.current.valueHex,
				pressed: live.current.valueHex,
			});
			setIsDragging(true);

			return true;
		},
		moveDrag(change) {
			const current = drag.current;

			if (!current.isActive) {
				return;
			}

			const hsva = { ...live.current.panel.hsva, ...change };
			const hex = hsvaToHex(hsva);
			showPanel({ hsva, hex });
			current.pending = hex;

			if (current.frame === 0) {
				current.frame = requestAnimationFrame(flushDrag);
			}
		},
		endDrag() {
			const current = drag.current;

			if (!current.isActive) {
				return;
			}

			flushDrag();
			current.isActive = false;
			setIsDragging(false);

			if (current.emitted !== current.pressed) {
				latest.current.onAfterChange?.(current.emitted);
			}
		},
		editText(field, text) {
			const next = { field, text };
			liveDraft.current = next;
			setDraft(next);
		},
		commitDraft(keepEditing) {
			const current = liveDraft.current;

			if (current === null || isReadOnly) {
				return;
			}

			const panelNow = live.current.panel;
			const hex = readDraft(current, panelNow.hex, isOpaque);

			if (hex !== undefined) {
				commit(hex === panelNow.hex ? panelNow : { hsva: hexToHsva(hex, panelNow.hsva.h), hex });
			}

			// A committed text is dropped, so the field follows the panel again, and a `value` that
			// changes later is not written back over by a blur. Text that is not a value stays to fix.
			const next = keepEditing && hex === undefined ? current : null;
			liveDraft.current = next;
			setDraft(next);
		},
		dropDraft() {
			liveDraft.current = null;
			setDraft(null);
		},
		reset() {
			const current = drag.current;
			cancelAnimationFrame(current.frame);
			current.frame = 0;
			current.isActive = false;
			current.pending = null;
			setIsDragging(false);
			liveDraft.current = null;
			setDraft(null);

			if (!latest.current.isControlled) {
				setUncontrolledValue(defaultValue);
			}
		},
	};
}
