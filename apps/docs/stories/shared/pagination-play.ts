import type { within } from 'storybook/test';

export type Canvas = ReturnType<typeof within>;

/**
 * The text the position label shows, without the invisible copy that holds its width.
 */
export function positionOf(canvas: Canvas, testId: string): string {
	return (
		canvas.getByTestId(testId).querySelector(':scope > span:not([aria-hidden])')?.textContent ?? ''
	);
}

export function slotsOf(bar: HTMLElement): HTMLElement[] {
	return Array.from(
		bar.querySelectorAll<HTMLElement>(
			'[data-slot="pagination-page"], [data-slot="pagination-separator"]',
		),
	);
}

export function slotTexts(bar: HTMLElement): string[] {
	return slotsOf(bar).map((slot) =>
		slot.dataset.slot === 'pagination-separator' ? '-' : (slot.textContent ?? ''),
	);
}

export function widthOf(element: Element): number {
	return element.getBoundingClientRect().width;
}

/**
 * The distance from the left edge of the first control to the right edge of the last one, which
 * is the width of the page controls of a numbered bar.
 */
export function controlsWidthOf(bar: HTMLElement): number {
	const previous = bar.querySelector('[data-slot="pagination-previous"]');
	const next = bar.querySelector('[data-slot="pagination-next"]');

	if (previous === null || next === null) {
		throw new Error('The bar has no Previous or Next');
	}

	return next.getBoundingClientRect().right - previous.getBoundingClientRect().left;
}
