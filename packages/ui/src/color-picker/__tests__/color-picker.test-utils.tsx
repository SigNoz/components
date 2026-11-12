import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ReactElement, type ReactNode, useState } from 'react';
import { cdp } from 'vitest/browser';
import { setTokens } from '../../__tests__/test-utils.js';
import { ColorPicker } from '../index.js';

type Point = { x: number; y: number };

/**
 * `#804040` is hue 0, saturation 50% and brightness 50%, with no rounding on the way in, so a key
 * press moves each axis by exactly the step it should.
 */
export const MID_RED = '#804040';

/**
 * The design tokens are not loaded in unit tests, so the hue strip and the preview would measure 0
 * pixels high and take no press. Declares the spacing they read, with the numbers
 * `@signozhq/design-tokens` ships, for the current test only.
 */
export function declareSpacingTokens(): void {
	setTokens(`
		--spacing-2: 4px;
		--spacing-4: 8px;
		--spacing-6: 12px;
		--spacing-7: 14px;
		--spacing-12: 24px;
		--spacing-16: 32px;
	`);
}

export type ControlledPickerProps = {
	initial?: string | undefined;
	onChange?: (value: string | undefined) => void;
	onAfterChange?: (value: string | undefined) => void;
	allowClear?: boolean;
	footer?: (color: string) => ReactNode;
};

/**
 * The commit-only pattern both call sites use: `value` is controlled and only updated in
 * `onAfterChange`. The value the parent holds is printed in `testId="value"`.
 */
export function ControlledPicker({
	initial,
	onChange,
	onAfterChange,
	allowClear,
	footer,
}: ControlledPickerProps): ReactElement {
	const [value, setValue] = useState<string | undefined>(initial);

	return (
		<>
			<ColorPicker
				nativeButton
				side="bottom"
				align="start"
				testId="picker"
				value={value}
				allowClear={allowClear}
				footer={footer}
				onChange={onChange}
				onAfterChange={(next) => {
					onAfterChange?.(next);
					setValue(next);
				}}
			>
				<button type="button">Color</button>
			</ColorPicker>
			<output data-testid="value">{value ?? 'none'}</output>
			<button type="button">Outside</button>
		</>
	);
}

export function getTrigger(name = 'Color'): HTMLElement {
	return screen.getByRole('button', { name });
}

export function getSaturation(): HTMLInputElement {
	return screen.getByRole('slider', { name: 'Saturation' });
}

export function getBrightness(): HTMLInputElement {
	return screen.getByRole('slider', { name: 'Brightness' });
}

export function getHue(): HTMLInputElement {
	return screen.getByRole('slider', { name: 'Hue' });
}

export function getHexField(): HTMLInputElement {
	return screen.getByRole('textbox', { name: 'Hex color' });
}

/**
 * Opens the popup with a press on the trigger and waits for the area to take the focus, which is
 * the last thing the open does.
 */
export async function openPicker(name = 'Color'): Promise<HTMLElement> {
	await userEvent.click(getTrigger(name));
	const dialog = await screen.findByRole('dialog');
	await waitForFocus(getSaturation());

	return dialog;
}

async function waitForFocus(element: Element): Promise<void> {
	for (let attempt = 0; attempt < 50 && document.activeElement !== element; attempt += 1) {
		await nextFrame();
	}
}

export function nextFrame(): Promise<void> {
	return new Promise((resolve) => {
		requestAnimationFrame(() => resolve());
	});
}

export function getCenter(element: Element): Point {
	const rect = element.getBoundingClientRect();

	return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

/**
 * The point at `x` and `y`, fractions from the top left, of a part named by its testId.
 */
export function pointIn(testId: string, x: number, y = 0.5): Point {
	const rect = screen.getByTestId(testId).getBoundingClientRect();

	return { x: rect.left + rect.width * x, y: rect.top + rect.height * y };
}

let isPressed = false;
let lastPoint: Point = { x: 0, y: 0 };

/**
 * A real mouse event through the Chrome DevTools Protocol, so the browser does the hit testing and
 * the pointer capture. The test runs in an iframe, so the point moves into page coordinates.
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
 * Releases a press left over by a failed test and parks the mouse off the popup.
 */
export async function resetPointer(): Promise<void> {
	if (isPressed) {
		await release();
	}

	await moveTo({ x: 0, y: window.innerHeight - 1 });
}

const SYNTHETIC_POINTER_ID = 7;

/**
 * Pointer events fired synchronously, so several moves land inside one animation frame. Real
 * mouse events each wait for a round trip to the browser, and a frame can run between two of them.
 */
export const syntheticPointer = {
	down(element: Element, point: Point): void {
		fireEvent.pointerDown(element, {
			pointerId: SYNTHETIC_POINTER_ID,
			button: 0,
			buttons: 1,
			clientX: point.x,
			clientY: point.y,
		});
	},
	move(element: Element, point: Point): void {
		fireEvent.pointerMove(element, {
			pointerId: SYNTHETIC_POINTER_ID,
			buttons: 1,
			clientX: point.x,
			clientY: point.y,
		});
	},
	up(element: Element, point: Point): void {
		fireEvent.pointerUp(element, {
			pointerId: SYNTHETIC_POINTER_ID,
			button: 0,
			clientX: point.x,
			clientY: point.y,
		});
	},
};
