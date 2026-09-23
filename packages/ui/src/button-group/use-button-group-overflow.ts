import { type RefObject, useCallback, useLayoutEffect, useRef, useState } from 'react';
import { countVisibleMembers } from './utils.js';

function readPx(value: string): number {
	return Number.parseFloat(value) || 0;
}

type OverflowState = {
	visibleCount: number;
	/**
	 * Every member side by side, `undefined` until the first measure.
	 */
	fullWidth: number | undefined;
};

/**
 * Measures the members and reports how many fit in the group.
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

		const widths = Array.from(
			root.querySelectorAll<HTMLElement>(
				':scope > [data-slot="button-group-row"] > [data-slot="button-group-item"]:not([data-overflow])',
			),
			(member) => member.getBoundingClientRect().width,
		);
		// Every member but the first pulls back over its neighbour's border by this much.
		const overlap = readPx(getComputedStyle(overflow).marginInlineStart);
		const ends: number[] = [];

		for (const [index, width] of widths.entries()) {
			ends.push(index === 0 ? width : (ends[index - 1] ?? 0) + overlap + width);
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
				overlap,
				available,
			),
			fullWidth: ends.at(-1) ?? 0,
		};

		setState((current) =>
			current.visibleCount === next.visibleCount && current.fullWidth === next.fullWidth
				? current
				: next,
		);
	}, []);

	// Observe each member too: a member that changes size moves the thresholds without the group
	// changing width.
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
				'[data-slot="button-group-item"], [data-slot="button-group-measure-overflow"]',
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
