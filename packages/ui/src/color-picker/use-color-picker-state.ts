import { useEffect, useRef, useState } from 'react';
import { useControlledValue } from '../lib/use-controlled-value.js';
import { useIsomorphicLayoutEffect } from '../lib/use-isomorphic-layout-effect.js';
import {
	type ColorPickerHsv,
	hexToHsv,
	hsvToHex,
	parseColorValue,
	parseHexInput,
} from './utils.js';

// `nullable` swaps the `undefined` of a clear for `null` in the component, so the state only ever
// reports `undefined`.
type ColorPickerChange = ((value: string | undefined) => void) | undefined;

/**
 * What the panel shows: the color it holds, and its hex, `undefined` while it shows no color. The
 * hex is kept next to the color, not derived from it, so a value read into the panel is compared
 * with the value as written.
 */
type PanelState = {
	hsv: ColorPickerHsv;
	hex: string | undefined;
};

/**
 * @access private
 */
export type UseColorPickerStateOptions = {
	value: string | null | undefined;
	defaultValue: string | undefined;
	isOpen: boolean;
	isReadOnly: boolean;
	onChange: ColorPickerChange;
	onAfterChange: ColorPickerChange;
};

/**
 * @access private
 */
export type ColorPickerState = {
	/** The color the picker holds, `#rrggbb`, or `undefined` for no color. */
	valueHex: string | undefined;
	panelHsv: ColorPickerHsv;
	/** The color the panel shows, the draft during a drag included. */
	panelHex: string | undefined;
	isDragging: boolean;
	/** The text typed in the hex field and not committed yet, `null` while it follows the panel. */
	hexText: string | null;
	setColor: (hsv: ColorPickerHsv) => void;
	clear: () => void;
	/**
	 * Starts a drag, and returns whether it did: `false` while read-only, and while another pointer
	 * already drags, which keeps a second finger from taking over the drag of the first.
	 */
	startDrag: () => boolean;
	/** Moves the drag to `change` applied to the color the panel holds at that moment. */
	moveDrag: (change: Partial<ColorPickerHsv>) => void;
	endDrag: () => void;
	editHex: (text: string) => void;
	commitHexText: (keepEditing: boolean) => void;
	dropHexText: () => void;
	/** Takes `defaultValue` back after the form resets, and drops a drag or a draft in progress. */
	reset: () => void;
};

function toPanel(hex: string | undefined, fallbackHue: number): PanelState {
	return {
		hsv: hex === undefined ? { h: fallbackHue, s: 0, v: 0 } : hexToHsv(hex, fallbackHue),
		hex,
	};
}

/**
 * The value, the color the panel holds, the drag and the hex field draft, and the callbacks each
 * of them fires.
 *
 * @access private
 */
export function useColorPickerState({
	value,
	defaultValue,
	isOpen,
	isReadOnly,
	onChange,
	onAfterChange,
}: UseColorPickerStateOptions): ColorPickerState {
	const [rawValue, setValue] = useControlledValue<string | undefined>({
		component: 'ColorPicker',
		value,
		defaultValue,
		empty: undefined,
	});
	const { hex: valueHex, isInvalid } = parseColorValue(rawValue);

	useEffect(() => {
		if (isInvalid) {
			console.warn(
				`ColorPicker: ${JSON.stringify(rawValue)} is not a hex color, so the picker holds no color. Pass "#rrggbb", "#rgb", or undefined for no color.`,
			);
		}
	}, [isInvalid, rawValue]);

	const [panel, setPanel] = useState<PanelState>(() => toPanel(valueHex, 0));
	const [isDragging, setIsDragging] = useState(false);
	const [hexText, setHexText] = useState<string | null>(null);

	// A drag that the popup closing ends, by an outside press or the trigger unmounting, ends
	// without `onAfterChange`, and so does one that `readOnly` turning on locks. A hex draft goes
	// with them: a close that `disabled` forces skips the handler that commits or drops it.
	const isLocked = !isOpen || isReadOnly;

	if (isDragging && isLocked) {
		setIsDragging(false);
	}

	if (hexText !== null && isLocked) {
		setHexText(null);
	}

	// The panel follows `value`, except during a drag, where it shows the draft and applies a
	// `value` that changed from outside after the release. A value with no hue keeps the hue the
	// panel holds.
	if (!isDragging && panel.hex !== valueHex) {
		setPanel(toPanel(valueHex, panel.hsv.h));
	}

	// Read by the animation frame and the drag release, which run after the render that scheduled
	// them, so a parent that swaps its handler mid-drag is still called with the latest one.
	const latest = useRef({ setValue, onChange, onAfterChange });

	useIsomorphicLayoutEffect(() => {
		latest.current = { setValue, onChange, onAfterChange };
	});

	// The panel and the value as the last change left them. A press on the area blurs the hex
	// field, which commits its draft, and the press then has to start from that color, not from the
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
	const hexDraft = useRef<string | null>(null);

	useEffect(() => {
		const current = drag.current;

		if (isLocked && current.isActive) {
			cancelAnimationFrame(current.frame);
			current.frame = 0;
			current.isActive = false;
			current.pending = null;
		}

		if (isLocked) {
			hexDraft.current = null;
		}
	}, [isLocked]);

	useEffect(() => {
		const current = drag.current;

		return () => cancelAnimationFrame(current.frame);
	}, []);

	function emitChange(next: string | undefined): void {
		live.current.valueHex = next;
		latest.current.setValue(next);

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
		panelHsv: panel.hsv,
		panelHex: panel.hex,
		isDragging,
		hexText,
		setColor(hsv) {
			stopDrag();
			commit({ hsv, hex: hsvToHex(hsv) });
		},
		clear() {
			showPanel(toPanel(undefined, live.current.panel.hsv.h));
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

			const hsv = { ...live.current.panel.hsv, ...change };
			const hex = hsvToHex(hsv);
			showPanel({ hsv, hex });
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
		editHex(text) {
			hexDraft.current = text;
			setHexText(text);
		},
		commitHexText(keepEditing) {
			const text = hexDraft.current;

			if (text === null || isReadOnly) {
				return;
			}

			const hex = parseHexInput(text);
			const current = live.current.panel;

			if (hex !== undefined) {
				commit(hex === current.hex ? current : { hsv: hexToHsv(hex, current.hsv.h), hex });
			}

			// A committed text is dropped, so the field follows the panel again, and a `value` that
			// changes later is not written back over by a blur. Text that is not a color stays to fix.
			const next = keepEditing && hex === undefined ? text : null;
			hexDraft.current = next;
			setHexText(next);
		},
		dropHexText() {
			hexDraft.current = null;
			setHexText(null);
		},
		reset() {
			const current = drag.current;
			cancelAnimationFrame(current.frame);
			current.frame = 0;
			current.isActive = false;
			current.pending = null;
			setIsDragging(false);
			hexDraft.current = null;
			setHexText(null);
			latest.current.setValue(defaultValue);
		},
	};
}
