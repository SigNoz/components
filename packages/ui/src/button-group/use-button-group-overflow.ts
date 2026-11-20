import { type RefObject, useCallback, useLayoutEffect, useRef, useState } from 'react';
import { readPx } from '../lib/css-length.js';
import { countVisibleMembers } from './utils.js';

type OverflowState = {
	visibleCount: number;
	/**
	 * Every member side by side, with the prefix and the suffix, `undefined` until the first measure.
	 */
	fullWidth: number | undefined;
};

/**
 * Measures the members and reports how many fit in the group.
 *
 * Each member carries `data-overflow-join`, how the ellipsis would meet it, and the measure row
 * holds one probe per join, so the margin the ellipsis takes after any member is known before it
 * renders there. With a suffix, each member and the measured ellipsis also carry
 * `data-suffix-join`, how the suffix would meet them. The prefix and the suffix never collapse, so
 * their widths come off the room the members have.
 *
 * Collapsed members stay mounted out of the flow, so each is measured as it renders, spinner and
 * inherited typography included. The group writes `fullWidth` on its sizer, so it shrinks only with
 * its container and grows back with it.
 *
 * @access private
 */
export function useButtonGroupOverflow(
	itemCount: number,
	itemsKey: string,
): OverflowState & { rootRef: RefObject<HTMLDivElement | null> } {
	const [state, setState] = useState<OverflowState>({
		visibleCount: itemCount,
		fullWidth: undefined,
	});
	const rootRef = useRef<HTMLDivElement | null>(null);

	const measure = useCallback((): void => {
		const root = rootRef.current;
		const overflow = root?.querySelector<HTMLElement>(
			':scope > [data-slot="button-group-measure"] > [data-slot="button-group-measure-overflow"]',
		);

		if (!root || !overflow) {
			return;
		}

		// The margin of each join, read off the probes, since the stylesheet owns the values.
		const joinMargins = new Map<string | undefined, number>(
			Array.from(
				root.querySelectorAll<HTMLElement>(
					':scope > [data-slot="button-group-measure"] > [data-slot="button-group-measure-join"]',
				),
				(probe) => [probe.dataset['joinStart'], readPx(getComputedStyle(probe).marginInlineStart)],
			),
		);
		const members = Array.from(
			root.querySelectorAll<HTMLElement>(
				':scope > [data-slot="button-group-row"] > [data-slot="button-group-item"]:not([data-overflow])',
			),
		);
		const slotsWidth = Array.from(
			root.querySelectorAll<HTMLElement>(
				':scope > [data-slot="button-group-row"] > :is([data-slot="button-group-prefix"], [data-slot="button-group-suffix"])',
			),
		).reduce((sum, slot) => sum + slot.getBoundingClientRect().width, 0);
		const ends: number[] = [];
		const overflowMargins: number[] = [];
		const suffixMargins: number[] = [];

		// A member's own margin is the one of its join with the segment before it, collapsed or not.
		// The first member has one only after a prefix.
		for (const [index, member] of members.entries()) {
			const margin = readPx(getComputedStyle(member).marginInlineStart);
			ends.push((ends[index - 1] ?? 0) + margin + member.getBoundingClientRect().width);
			overflowMargins.push(joinMargins.get(member.dataset['overflowJoin']) ?? 0);
			suffixMargins.push(joinMargins.get(member.dataset['suffixJoin']) ?? 0);
		}

		// The row only gets the content box, so padding and border are not room.
		const style = getComputedStyle(root);
		const available =
			root.getBoundingClientRect().width -
			readPx(style.paddingLeft) -
			readPx(style.paddingRight) -
			readPx(style.borderLeftWidth) -
			readPx(style.borderRightWidth);

		const next: OverflowState = {
			visibleCount: countVisibleMembers(
				ends,
				overflow.getBoundingClientRect().width,
				overflowMargins,
				available - slotsWidth,
				suffixMargins,
				joinMargins.get(overflow.dataset['suffixJoin']) ?? 0,
			),
			fullWidth: (ends.at(-1) ?? 0) + (suffixMargins.at(-1) ?? 0) + slotsWidth,
		};

		setState((current) =>
			current.visibleCount === next.visibleCount && current.fullWidth === next.fullWidth
				? current
				: next,
		);
	}, []);

	// Observe each member and slot too: one that changes size moves the thresholds without the
	// group changing width.
	useLayoutEffect(() => {
		const root = rootRef.current;
		measure();

		if (!root || typeof ResizeObserver === 'undefined') {
			return;
		}

		const observer = new ResizeObserver(measure);
		observer.observe(root);

		for (const member of Array.from(
			root.querySelectorAll(
				'[data-slot="button-group-item"], [data-slot="button-group-measure-overflow"], [data-slot="button-group-prefix"], [data-slot="button-group-suffix"]',
			),
		)) {
			observer.observe(member);
		}

		return () => observer.disconnect();
	}, [itemsKey, measure]);

	return {
		visibleCount: Math.min(state.visibleCount, itemCount),
		fullWidth: state.fullWidth,
		rootRef,
	};
}
