import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { observeResize } from './observe-resize.js';

const observers: FakeResizeObserver[] = [];
// Stopped after each test, so a failing one cannot leave the shared observer to the next.
const stops: (() => void)[] = [];

class FakeResizeObserver {
	readonly targets = new Set<Element>();
	disconnected = false;

	constructor(private readonly callback: ResizeObserverCallback) {
		observers.push(this);
	}

	observe(target: Element): void {
		this.targets.add(target);
	}

	unobserve(target: Element): void {
		this.targets.delete(target);
	}

	disconnect(): void {
		this.targets.clear();
		this.disconnected = true;
	}

	resize(...targets: Element[]): void {
		this.callback(
			targets.map((target) => ({ target }) as ResizeObserverEntry),
			this as unknown as ResizeObserver,
		);
	}
}

function observe(element: Element, callback: () => void = () => {}): () => void {
	const stop = observeResize(element, callback);
	stops.push(stop);
	return stop;
}

beforeEach(() => {
	observers.length = 0;
	vi.stubGlobal('ResizeObserver', FakeResizeObserver);
});

afterEach(() => {
	for (const stop of stops.splice(0)) {
		stop();
	}
	vi.unstubAllGlobals();
});

describe('observeResize', () => {
	it('watches every element with one ResizeObserver', () => {
		const first = document.createElement('div');
		const second = document.createElement('div');
		observe(first);
		observe(first);
		observe(second);

		expect(observers).toHaveLength(1);
		expect(observers[0]?.targets).toEqual(new Set([first, second]));
	});

	it('calls only the callbacks of the element that resized', () => {
		const first = document.createElement('div');
		const second = document.createElement('div');
		const onFirst = vi.fn();
		const onSecond = vi.fn();
		observe(first, onFirst);
		observe(second, onSecond);

		observers[0]?.resize(first);

		expect(onFirst).toHaveBeenCalledTimes(1);
		expect(onSecond).not.toHaveBeenCalled();
	});

	it('calls a caller once for a batch that holds several of its elements', () => {
		const first = document.createElement('div');
		const second = document.createElement('div');
		const callback = vi.fn();
		observe(first, callback);
		observe(second, callback);

		observers[0]?.resize(first, second);

		expect(callback).toHaveBeenCalledTimes(1);
	});

	it('keeps watching an element while one caller is left, and drops the observer with the last', () => {
		const element = document.createElement('div');
		const kept = vi.fn();
		const stopDropped = observe(element);
		const stopKept = observe(element, kept);

		stopDropped();
		observers[0]?.resize(element);

		expect(kept).toHaveBeenCalledTimes(1);
		expect(observers[0]?.targets.has(element)).toBe(true);

		stopKept();

		expect(observers[0]?.disconnected).toBe(true);
		observe(element);
		expect(observers).toHaveLength(2);
	});
});
