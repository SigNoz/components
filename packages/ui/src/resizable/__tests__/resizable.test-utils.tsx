import { act, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { vi } from 'vitest';
import { Resizable } from '../resizable.js';
import type { ResizableItemType, ResizableProps, ResizableStorageType } from '../types.js';

export const TEST_ID = 'split';

export function makeItems(...values: string[]): ResizableItemType[] {
	return values.map((value) => ({ value, label: `${value} panel`, children: value }));
}

/**
 * Renders the component in a box of a known size, so the layout can be measured.
 */
export function renderResizable(
	props: Partial<ResizableProps>,
	{ width = 400, height = 200 }: { width?: number; height?: number } = {},
) {
	const { items = makeItems('first', 'second'), orientation = 'horizontal', ...rest } = props;

	return render(
		<Frame width={width} height={height}>
			<Resizable testId={TEST_ID} items={items} orientation={orientation} {...rest} />
		</Frame>,
	);
}

export function Frame({
	width,
	height,
	children,
}: {
	width: number;
	height: number;
	children: ReactNode;
}) {
	return (
		<div data-testid="frame" style={{ width, height }}>
			{children}
		</div>
	);
}

export function handle(value: string): HTMLElement {
	return screen.getByTestId(`${TEST_ID}-handle-${value}`);
}

export function panel(value: string): HTMLElement {
	return screen.getByTestId(`${TEST_ID}-panel-${value}`);
}

export function panelWidth(value: string): number {
	return panel(value).getBoundingClientRect().width;
}

export function panelHeight(value: string): number {
	return panel(value).getBoundingClientRect().height;
}

export function sizeOf(separator: HTMLElement): number {
	return Number(separator.getAttribute('aria-valuenow'));
}

function centerOf(element: HTMLElement) {
	const rect = element.getBoundingClientRect();

	return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

function pointer(type: string, target: EventTarget, x: number, y: number, buttons: number) {
	target.dispatchEvent(
		new PointerEvent(type, {
			bubbles: true,
			cancelable: true,
			composed: true,
			pointerType: 'mouse',
			button: 0,
			buttons,
			clientX: x,
			clientY: y,
		}),
	);
}

/**
 * Drags the handle by `dx`/`dy` pixels, the way `react-resizable-panels` reads a drag: a press on
 * the band around the line, moves on the document, a release.
 */
export function drag(separator: HTMLElement, dx: number, dy: number, { release = true } = {}) {
	const start = centerOf(separator);

	// The library captures the pointer on the first move, and a dispatched event has no live
	// pointer to capture, so the browser would throw.
	vi.spyOn(Element.prototype, 'setPointerCapture').mockImplementation(() => {});
	vi.spyOn(Element.prototype, 'releasePointerCapture').mockImplementation(() => {});

	act(() => {
		pointer('pointerdown', separator, start.x, start.y, 1);
	});
	act(() => {
		pointer('pointermove', document, start.x + dx / 2, start.y + dy / 2, 1);
	});
	act(() => {
		pointer('pointermove', document, start.x + dx, start.y + dy, 1);
	});

	if (release) {
		releasePointer();
	}
}

/**
 * Ends a drag. The library keeps the state of a drag at module level, so a test that leaves one
 * open makes the next test's pointer events continue it.
 */
export function releasePointer() {
	act(() => {
		pointer('pointerup', document, 0, 0, 0);
	});
}

export function hover(separator: HTMLElement, offset = 0) {
	const { x, y } = centerOf(separator);

	act(() => {
		pointer('pointermove', document, x + offset, y, 0);
	});
}

/**
 * Double-clicks `offset` pixels across the line, on whatever element is there, as a browser would.
 */
export function doubleClick(separator: HTMLElement, offset = 0) {
	const { x, y } = centerOf(separator);
	const target = document.elementFromPoint(x + offset, y) ?? separator;

	act(() => {
		target.dispatchEvent(
			new MouseEvent('dblclick', {
				bubbles: true,
				cancelable: true,
				clientX: x + offset,
				clientY: y,
			}),
		);
	});
}

export function memoryStorage(initial: Record<string, string> = {}) {
	const entries = new Map(Object.entries(initial));
	const storage: ResizableStorageType & { entries: Map<string, string> } = {
		entries,
		getItem: (key) => entries.get(key) ?? null,
		setItem: (key, value) => {
			entries.set(key, value);
		},
	};

	return storage;
}
