import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useIsLabelTruncated } from './useIsLabelTruncated.js';

const resizeObservers: FakeResizeObserver[] = [];
let mutationObservers = 0;

class FakeResizeObserver {
	readonly targets = new Set<Element>();

	constructor(private readonly callback: ResizeObserverCallback) {
		resizeObservers.push(this);
	}

	observe(target: Element): void {
		this.targets.add(target);
		this.callback([{ target } as ResizeObserverEntry], this as unknown as ResizeObserver);
	}

	unobserve(target: Element): void {
		this.targets.delete(target);
	}

	disconnect(): void {
		this.targets.clear();
	}

	resize(target: Element): void {
		act(() =>
			this.callback([{ target } as ResizeObserverEntry], this as unknown as ResizeObserver),
		);
	}
}

const RealMutationObserver = globalThis.MutationObserver;

class CountingMutationObserver extends RealMutationObserver {
	constructor(callback: MutationCallback) {
		super(callback);
		mutationObservers += 1;
	}
}

let cutAfter = 8;

function isCut(node: HTMLElement): boolean {
	return (node.textContent ?? '').length > cutAfter;
}

function Label({ text }: { text: string }) {
	const [truncated, ref] = useIsLabelTruncated(true, isCut);

	return (
		<span ref={ref} data-testid={text} data-truncated={truncated || undefined}>
			{text}
		</span>
	);
}

beforeEach(() => {
	resizeObservers.length = 0;
	mutationObservers = 0;
	cutAfter = 8;
	vi.stubGlobal('ResizeObserver', FakeResizeObserver);
	vi.stubGlobal('MutationObserver', CountingMutationObserver);
});

afterEach(() => {
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});

describe('useIsLabelTruncated', () => {
	it('watches every label with one ResizeObserver and one MutationObserver', () => {
		render(
			<>
				<Label text="one" />
				<Label text="two" />
				<Label text="three-is-long" />
			</>,
		);

		expect(resizeObservers).toHaveLength(1);
		expect(mutationObservers).toBe(1);
		expect(resizeObservers[0]?.targets.size).toBe(3);
		expect(screen.getByTestId('three-is-long')).toHaveAttribute('data-truncated');
		expect(screen.getByTestId('one')).not.toHaveAttribute('data-truncated');
	});

	it('measures only the label whose size changed', () => {
		render(
			<>
				<Label text="first-label" />
				<Label text="second-label" />
			</>,
		);

		cutAfter = 100;
		resizeObservers[0]?.resize(screen.getByTestId('first-label'));

		expect(screen.getByTestId('first-label')).not.toHaveAttribute('data-truncated');
		expect(screen.getByTestId('second-label')).toHaveAttribute('data-truncated');
	});

	it('measures a label again when its text changes', async () => {
		const { rerender } = render(<Label text="short" />);

		expect(screen.getByTestId('short')).not.toHaveAttribute('data-truncated');

		await act(async () => {
			rerender(<Label text="a much longer text" />);
		});

		expect(screen.getByTestId('a much longer text')).toHaveAttribute('data-truncated');
	});

	it('stops watching a label that unmounts and drops the observers with the last one', () => {
		const { rerender, unmount } = render(
			<>
				<Label text="kept" />
				<Label text="removed" />
			</>,
		);
		const removed = screen.getByTestId('removed');

		rerender(<Label text="kept" />);

		expect(resizeObservers[0]?.targets.has(removed)).toBe(false);
		expect(resizeObservers[0]?.targets.size).toBe(1);

		unmount();

		expect(resizeObservers[0]?.targets.size).toBe(0);

		render(<Label text="next" />);

		expect(resizeObservers).toHaveLength(2);
		expect(mutationObservers).toBe(2);
	});

	it('measures every label once when a font finishes loading, with one listener', () => {
		const fonts = new EventTarget();
		const addEventListener = vi.spyOn(fonts, 'addEventListener');
		vi.spyOn(document, 'fonts', 'get').mockReturnValue(fonts as FontFaceSet);

		render(
			<>
				<Label text="first-label" />
				<Label text="second-label" />
			</>,
		);

		expect(screen.getByTestId('first-label')).toHaveAttribute('data-truncated');

		cutAfter = 100;
		act(() => {
			fonts.dispatchEvent(new Event('loadingdone'));
		});

		expect(addEventListener).toHaveBeenCalledTimes(1);
		expect(screen.getByTestId('first-label')).not.toHaveAttribute('data-truncated');
		expect(screen.getByTestId('second-label')).not.toHaveAttribute('data-truncated');
	});
});
