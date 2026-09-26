import { act } from '@testing-library/react';

/**
 * jsdom has no layout, so every element measures 0x0 and no label ever reads as
 * truncated. These fake the two properties the truncation check looks at, for
 * the label slot only, so the rest of the tree keeps its real (zero) sizes.
 */
let labelScrollWidth = 0;
let labelClientWidth = 0;

function isLabel(element: HTMLElement): boolean {
	return element.dataset.slot === 'button-label';
}

/** Callbacks of every live ResizeObserver, so a resize can be replayed by hand. */
const resizeCallbacks = new Set<ResizeObserverCallback>();

/** Label wider than its box: the text is cut off. */
export function truncate(): void {
	labelScrollWidth = 300;
	labelClientWidth = 100;
}

/** Sets the label measurements and replays them to every live observer. */
export function resize(scrollWidth: number, clientWidth: number): void {
	labelScrollWidth = scrollWidth;
	labelClientWidth = clientWidth;

	act(() => {
		for (const callback of resizeCallbacks) {
			callback([], {} as ResizeObserver);
		}
	});
}

/** Call from `beforeAll`: installs the label measurement and ResizeObserver fakes. */
export function mockLabelMeasurement(): void {
	const scrollWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollWidth');
	const clientWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientWidth');

	Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
		configurable: true,
		get(this: HTMLElement) {
			return isLabel(this) ? labelScrollWidth : (scrollWidth?.get?.call(this) ?? 0);
		},
	});
	Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
		configurable: true,
		get(this: HTMLElement) {
			return isLabel(this) ? labelClientWidth : (clientWidth?.get?.call(this) ?? 0);
		},
	});

	globalThis.ResizeObserver = class ResizeObserver {
		constructor(private readonly callback: ResizeObserverCallback) {}

		observe(): void {
			resizeCallbacks.add(this.callback);
			// A real ResizeObserver reports the initial size once observation starts,
			// on the next frame. Delivering it inline keeps the tests synchronous.
			this.callback([], this);
		}

		unobserve(): void {
			resizeCallbacks.delete(this.callback);
		}

		disconnect(): void {
			resizeCallbacks.delete(this.callback);
		}
	};
}

/** Call from `afterEach`: drops the measurements and observers of the last render. */
export function resetLabelMeasurement(): void {
	labelScrollWidth = 0;
	labelClientWidth = 0;
	resizeCallbacks.clear();
}

/**
 * The tooltip popup, but only while it is open. Base UI keeps a closed popup
 * mounted until its exit transition ends, and jsdom never runs one, so a closed
 * popup can linger in the DOM long after the tooltip is gone on screen.
 */
export function queryOpenTooltip(): HTMLElement | null {
	return document.querySelector('[data-slot="tooltip-content"][data-open]');
}
