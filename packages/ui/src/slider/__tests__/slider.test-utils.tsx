import { render, screen } from '@testing-library/react';
import type { ReactElement } from 'react';
import { cdp } from 'vitest/browser';

type Point = { x: number; y: number };

/**
 * Renders the slider and waits for its thumbs: Base UI keeps a thumb hidden until it has measured
 * it, one microtask after the first layout, with `thumbAlignment="edge"`.
 */
export async function renderSlider(
	ui: ReactElement,
): Promise<{ rerender: (next: ReactElement) => void }> {
	const result = render(<div style={{ width: 300 }}>{ui}</div>);
	await screen.findAllByRole('slider');

	return { rerender: (next) => result.rerender(<div style={{ width: 300 }}>{next}</div>) };
}

/**
 * The `role="slider"` input of a thumb.
 */
export function getThumbInput(index = 0): HTMLInputElement {
	return screen.getAllByRole('slider')[index] as HTMLInputElement;
}

export function getCenter(element: Element): Point {
	const rect = element.getBoundingClientRect();
	return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

/**
 * The point on the control where a thumb centre sits at `fraction` of the scale, half a thumb in
 * from each end.
 */
export function getTrackPoint(testId: string, fraction: number): Point {
	const control = screen
		.getByTestId(testId)
		.querySelector<HTMLElement>('[data-slot="slider-control"]');

	if (!control) {
		throw new Error('no control');
	}

	const rect = control.getBoundingClientRect();
	const half = screen.getByTestId(`${testId}-thumb-0`).getBoundingClientRect().width / 2;

	return {
		x: rect.left + half + (rect.width - 2 * half) * fraction,
		y: rect.top + rect.height / 2,
	};
}

let isPressed = false;
let lastPoint: Point = { x: 0, y: 0 };

/**
 * A real mouse event through the Chrome DevTools Protocol, so Base UI gets pointer capture and
 * hit testing. The test runs in an iframe, so the point moves into the coordinates of the page.
 */
async function dispatch(
	type: 'mouseMoved' | 'mousePressed' | 'mouseReleased',
	point: Point,
): Promise<void> {
	const frame = window.frameElement?.getBoundingClientRect();
	const scale = frame ? frame.width / window.innerWidth : 1;

	if (type === 'mousePressed') {
		isPressed = true;
	} else if (type === 'mouseReleased') {
		isPressed = false;
	}

	lastPoint = point;

	await cdp().send('Input.dispatchMouseEvent', {
		type,
		x: (frame?.left ?? 0) + point.x * scale,
		y: (frame?.top ?? 0) + point.y * scale,
		button: 'left',
		buttons: isPressed ? 1 : 0,
		clickCount: 1,
	} as never);
}

export async function moveTo(point: Point): Promise<void> {
	await dispatch('mouseMoved', point);
}

export async function press(point: Point): Promise<void> {
	await dispatch('mouseMoved', point);
	await dispatch('mousePressed', point);
}

export async function release(point: Point = lastPoint): Promise<void> {
	await dispatch('mouseReleased', point);
}

export async function click(point: Point): Promise<void> {
	await press(point);
	await release(point);
}

/**
 * Moves the pointer off the slider, so a hover from an earlier test does not carry over.
 */
export async function resetPointer(): Promise<void> {
	if (isPressed) {
		await release();
	}

	await moveTo({ x: 0, y: window.innerHeight - 1 });
}

export async function pressTrack(testId: string, fraction: number): Promise<void> {
	await click(getTrackPoint(testId, fraction));
}

/**
 * A drag that starts on a thumb and moves to each of `fractions` in turn.
 */
export async function dragThumb(
	testId: string,
	index: number,
	fractions: number[],
	{ release: shouldRelease = true }: { release?: boolean } = {},
): Promise<void> {
	await press(getCenter(screen.getByTestId(`${testId}-thumb-${index}`)));

	for (const fraction of fractions) {
		await moveTo(getTrackPoint(testId, fraction));
	}

	if (shouldRelease) {
		await release();
	}
}
