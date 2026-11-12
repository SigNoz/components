import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ColorPicker } from '../index.js';
import {
	ControlledPicker,
	click,
	getCenter,
	getBrightness,
	getHexField,
	getHue,
	getSaturation,
	getTrigger,
	MID_RED,
	moveTo,
	nextFrame,
	openPicker,
	pointIn,
	press,
	release,
	resetPointer,
	syntheticPointer,
	declareSpacingTokens,
} from './color-picker.test-utils.js';

beforeEach(() => {
	declareSpacingTokens();
});

afterEach(async () => {
	await resetPointer();
});

describe('ColorPicker open and close', () => {
	it('opens on a press on the trigger and closes on a second one', async () => {
		render(<ControlledPicker initial={MID_RED} />);

		const trigger = getTrigger();
		await openPicker();

		expect(trigger).toHaveAttribute('aria-expanded', 'true');
		expect(trigger).toHaveAttribute('data-popup-open');

		await userEvent.click(trigger);

		await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
		expect(trigger).toHaveAttribute('aria-expanded', 'false');
		expect(trigger).not.toHaveAttribute('data-popup-open');
	});

	it('moves the focus to the area when it opens', async () => {
		render(<ControlledPicker initial={MID_RED} />);

		await openPicker();

		expect(getSaturation()).toHaveFocus();
	});

	it('closes on a press outside and leaves the focus on what was pressed', async () => {
		render(<ControlledPicker initial={MID_RED} />);
		await openPicker();

		await userEvent.click(screen.getByRole('button', { name: 'Outside' }));

		await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
		expect(screen.getByRole('button', { name: 'Outside' })).toHaveFocus();
	});

	it('commits a valid hex text when a press outside closes it', async () => {
		const onAfterChange = vi.fn();
		render(<ControlledPicker initial={MID_RED} onAfterChange={onAfterChange} />);
		await openPicker();

		await userEvent.click(getHexField());
		await userEvent.clear(getHexField());
		await userEvent.type(getHexField(), '00ff00');
		await userEvent.click(screen.getByRole('button', { name: 'Outside' }));

		await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
		expect(onAfterChange).toHaveBeenCalledTimes(1);
		expect(onAfterChange).toHaveBeenCalledWith('#00ff00');
	});

	it('keeps an uncontrolled color across a close and a reopen', async () => {
		const onChange = vi.fn();
		render(
			<ColorPicker
				nativeButton
				side="bottom"
				align="start"
				defaultValue={MID_RED}
				onChange={onChange}
			>
				<button type="button">Color</button>
			</ColorPicker>,
		);
		await openPicker();

		await userEvent.keyboard('{End}');
		await userEvent.keyboard('{Escape}');
		await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
		await openPicker();

		expect(onChange).toHaveBeenCalledWith('#800000');
		expect(getHexField()).toHaveValue('800000');
	});
});

describe('ColorPicker press and drag', () => {
	it('sets the color under a press that does not move, with one call to each callback', async () => {
		const onChange = vi.fn();
		const onAfterChange = vi.fn();
		render(
			<ControlledPicker initial={MID_RED} onChange={onChange} onAfterChange={onAfterChange} />,
		);
		await openPicker();

		await click(pointIn('picker-area', 0.25, 0.25));

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onAfterChange).toHaveBeenCalledTimes(1);
		const [color] = onAfterChange.mock.calls[0];
		expect(color).toMatch(/^#[\da-f]{6}$/);
		expect(color).not.toBe(MID_RED);
		expect(onChange).toHaveBeenCalledWith(color);
		expect(screen.getByTestId('value')).toHaveTextContent(color);
	});

	it('starts a press on the area from a hex draft the press commits', async () => {
		const onAfterChange = vi.fn();
		render(<ControlledPicker initial={MID_RED} onAfterChange={onAfterChange} />);
		await openPicker();

		await userEvent.click(getHexField());
		await userEvent.clear(getHexField());
		await userEvent.type(getHexField(), '00ff00');
		await click(pointIn('picker-area', 0.9, 0.1));

		expect(onAfterChange).toHaveBeenCalledTimes(2);
		expect(onAfterChange).toHaveBeenNthCalledWith(1, '#00ff00');
		const [color] = onAfterChange.mock.calls[1];
		const [red, green] = [color.slice(1, 3), color.slice(3, 5)].map((byte: string) =>
			Number.parseInt(byte, 16),
		);
		expect(green).toBeGreaterThan(red);
	});

	it('starts a press on the hue strip from a hex draft the press commits', async () => {
		const onAfterChange = vi.fn();
		render(<ControlledPicker initial={MID_RED} onAfterChange={onAfterChange} />);
		await openPicker();

		await userEvent.click(getHexField());
		await userEvent.clear(getHexField());
		await userEvent.type(getHexField(), '00ff00');
		await click(pointIn('picker-hue', 0.5));

		expect(onAfterChange).toHaveBeenCalledTimes(2);
		expect(getSaturation()).toHaveValue('100');
		expect(getBrightness()).toHaveValue('100');
	});

	it('keeps a key change made while the pointer is still down, and calls nothing on the release', async () => {
		const onChange = vi.fn();
		const onAfterChange = vi.fn();
		render(
			<ControlledPicker initial={MID_RED} onChange={onChange} onAfterChange={onAfterChange} />,
		);
		await openPicker();
		const area = screen.getByTestId('picker-area');
		const point = pointIn('picker-area', 0.25, 0.25);

		syntheticPointer.down(area, point);
		await nextFrame();
		expect(onChange).toHaveBeenCalledTimes(1);

		await userEvent.keyboard('{ArrowUp}');
		syntheticPointer.up(area, point);
		await nextFrame();

		expect(onAfterChange).toHaveBeenCalledTimes(1);
		const keyColor = onChange.mock.lastCall?.[0];
		expect(onAfterChange).toHaveBeenCalledWith(keyColor);
		expect(screen.getByTestId('value')).toHaveTextContent(keyColor);
	});

	it('leaves a drag to the first pointer, and ignores a second one on the hue strip', async () => {
		const onChange = vi.fn();
		const onAfterChange = vi.fn();
		render(
			<ControlledPicker initial={MID_RED} onChange={onChange} onAfterChange={onAfterChange} />,
		);
		await openPicker();
		const area = screen.getByTestId('picker-area');
		const hue = screen.getByTestId('picker-hue');
		const hueBefore = getHue().value;

		syntheticPointer.down(area, pointIn('picker-area', 0.25, 0.25));
		await nextFrame();
		const secondTouch = pointIn('picker-hue', 0.7);
		fireEvent.pointerDown(hue, {
			pointerId: 8,
			button: 0,
			buttons: 1,
			clientX: secondTouch.x,
			clientY: secondTouch.y,
		});
		await nextFrame();

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(getHue()).toHaveValue(hueBefore);

		syntheticPointer.move(area, pointIn('picker-area', 0.75, 0.75));
		await nextFrame();
		syntheticPointer.up(area, pointIn('picker-area', 0.75, 0.75));

		expect(onChange).toHaveBeenCalledTimes(2);
		expect(onAfterChange).toHaveBeenCalledTimes(1);
	});

	it('sets the hue under a press on the hue strip', async () => {
		const onAfterChange = vi.fn();
		render(<ControlledPicker initial={MID_RED} onAfterChange={onAfterChange} />);
		await openPicker();

		await click(pointIn('picker-hue', 1 / 3));

		expect(Number(getHue().value)).toBeCloseTo(120, -1);
		expect(onAfterChange).toHaveBeenCalledTimes(1);
		expect(getHue()).toHaveFocus();
	});

	it('writes nothing for a press on the spot that already holds the color', async () => {
		const onChange = vi.fn();
		const onAfterChange = vi.fn();
		render(
			<ControlledPicker initial={MID_RED} onChange={onChange} onAfterChange={onAfterChange} />,
		);
		await openPicker();
		const spot = pointIn('picker-area', 0.3, 0.6);

		await click(spot);
		onChange.mockClear();
		onAfterChange.mockClear();
		await click(spot);

		expect(onChange).not.toHaveBeenCalled();
		expect(onAfterChange).not.toHaveBeenCalled();
	});

	it('writes nothing for a press on the hue strip of a grey, which has no hue in hex', async () => {
		const onChange = vi.fn();
		const onAfterChange = vi.fn();
		render(
			<ControlledPicker initial="#808080" onChange={onChange} onAfterChange={onAfterChange} />,
		);
		await openPicker();

		await click(pointIn('picker-hue', 0.5));

		expect(Number(getHue().value)).toBeGreaterThan(0);
		expect(onChange).not.toHaveBeenCalled();
		expect(onAfterChange).not.toHaveBeenCalled();
	});

	it('follows a drag, then calls onAfterChange once on the release with the last color', async () => {
		const onChange = vi.fn();
		const onAfterChange = vi.fn();
		render(
			<ControlledPicker initial={MID_RED} onChange={onChange} onAfterChange={onAfterChange} />,
		);
		await openPicker();

		await press(pointIn('picker-area', 0.5, 0.5));
		await nextFrame();
		await moveTo(pointIn('picker-area', 0.8, 0.3));
		await nextFrame();
		// Past the top right corner: the thumb stops at full saturation and brightness.
		await moveTo(pointIn('picker-area', 1.2, -0.2));
		await nextFrame();

		expect(onChange.mock.calls.length).toBeGreaterThan(1);
		expect(onAfterChange).not.toHaveBeenCalled();

		await release();

		expect(onAfterChange).toHaveBeenCalledTimes(1);
		expect(onAfterChange).toHaveBeenCalledWith('#ff0000');
		expect(onChange).toHaveBeenLastCalledWith('#ff0000');
	});

	it('calls onChange at most once per animation frame, with the last color of the frame', async () => {
		const onChange = vi.fn();
		const onAfterChange = vi.fn();
		render(
			<ControlledPicker initial={MID_RED} onChange={onChange} onAfterChange={onAfterChange} />,
		);
		await openPicker();
		const area = screen.getByTestId('picker-area');

		syntheticPointer.down(area, pointIn('picker-area', 0.5, 0.5));
		syntheticPointer.move(area, pointIn('picker-area', 0.2, 0.2));
		syntheticPointer.move(area, pointIn('picker-area', 0.6, 0.4));
		// Past the top left corner, which is white for any hue.
		syntheticPointer.move(area, pointIn('picker-area', -0.2, -0.2));

		expect(onChange).not.toHaveBeenCalled();

		await nextFrame();

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith('#ffffff');

		syntheticPointer.up(area, pointIn('picker-area', -0.2, -0.2));

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onAfterChange).toHaveBeenCalledTimes(1);
		expect(onAfterChange).toHaveBeenCalledWith('#ffffff');
	});

	it('flushes the color of the last frame on the release', async () => {
		const onChange = vi.fn();
		render(<ControlledPicker initial={MID_RED} onChange={onChange} />);
		await openPicker();
		const area = screen.getByTestId('picker-area');

		syntheticPointer.down(area, pointIn('picker-area', -0.2, -0.2));
		syntheticPointer.up(area, pointIn('picker-area', -0.2, -0.2));

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith('#ffffff');
	});

	it('calls no onAfterChange for a drag that ends on the color it started from', async () => {
		const onChange = vi.fn();
		const onAfterChange = vi.fn();
		render(
			<ControlledPicker initial={MID_RED} onChange={onChange} onAfterChange={onAfterChange} />,
		);
		await openPicker();
		const start = pointIn('picker-area', 0.4, 0.4);
		await click(start);
		onChange.mockClear();
		onAfterChange.mockClear();

		await press(start);
		await moveTo(pointIn('picker-area', 0.9, 0.9));
		await nextFrame();
		await moveTo(start);
		await nextFrame();
		await release();

		expect(onChange.mock.calls.length).toBeGreaterThan(0);
		expect(onAfterChange).not.toHaveBeenCalled();
	});

	it('captures the pointer, so a drag past the panel keeps the thumb at the edge and the popup open', async () => {
		const onAfterChange = vi.fn();
		const onCapture = vi.fn();
		render(<ControlledPicker initial={MID_RED} onAfterChange={onAfterChange} />);
		await openPicker();
		screen.getByTestId('picker-area').addEventListener('gotpointercapture', onCapture);

		const rect = screen.getByTestId('picker-area').getBoundingClientRect();
		await press(pointIn('picker-area', 0.5, 0.5));
		await moveTo({ x: rect.right + 80, y: rect.top - 80 });
		await release();

		expect(onCapture).toHaveBeenCalled();
		expect(onAfterChange).toHaveBeenCalledWith('#ff0000');
		expect(screen.getByRole('dialog')).toBeInTheDocument();
	});

	it('marks the popup while a thumb moves under the pointer', async () => {
		render(<ControlledPicker initial={MID_RED} />);
		const popup = await openPicker();

		await press(pointIn('picker-hue', 0.5));

		await waitFor(() => expect(popup).toHaveAttribute('data-dragging'));

		await release();

		await waitFor(() => expect(popup).not.toHaveAttribute('data-dragging'));
	});

	it('moves the focus to the saturation input on a press on the area, without a focus ring', async () => {
		render(<ControlledPicker initial={MID_RED} />);
		await click(getCenter(getTrigger()));
		await screen.findByRole('dialog');
		await click(pointIn('picker-hue', 0.5));
		expect(getHue()).toHaveFocus();

		await click(pointIn('picker-area', 0.5, 0.5));

		expect(getSaturation()).toHaveFocus();
		expect(getSaturation().matches(':focus-visible')).toBe(false);
	});
});

/**
 * Presses the middle of the area and drags past its top right corner, to full saturation and
 * brightness, `#ff0000` for hue 0. The pointer stays down.
 */
async function dragPast(): Promise<void> {
	await press(pointIn('picker-area', 0.5, 0.5));
	await moveTo(pointIn('picker-area', 1.2, -0.2));
	await nextFrame();
}

describe('ColorPicker controlled draft', () => {
	it('shows the draft during a drag, and the value the parent commits after the release', async () => {
		const onChange = vi.fn();
		render(
			<ControlledPicker
				initial={MID_RED}
				onChange={onChange}
				footer={(color) => `Footer ${color}`}
			/>,
		);
		await openPicker();

		await dragPast();

		expect(screen.getByTestId('value')).toHaveTextContent(MID_RED);
		expect(getHexField()).toHaveValue('ff0000');
		expect(screen.getByTestId('picker-footer')).toHaveTextContent('Footer #ff0000');
		expect(onChange).toHaveBeenCalledWith('#ff0000');

		await release();

		expect(screen.getByTestId('value')).toHaveTextContent('#ff0000');
		expect(getHexField()).toHaveValue('ff0000');
	});

	it('goes back to value after the release when the parent does not take the color', async () => {
		render(
			<ColorPicker nativeButton side="bottom" align="start" testId="picker" value={MID_RED}>
				<button type="button">Color</button>
			</ColorPicker>,
		);
		await openPicker();

		await dragPast();
		expect(getHexField()).toHaveValue('ff0000');

		await release();

		await waitFor(() => expect(getHexField()).toHaveValue('804040'));
	});

	it('applies a value that changed from outside during a drag after the release', async () => {
		const ui = (value: string) => (
			<ColorPicker nativeButton side="bottom" align="start" testId="picker" value={value}>
				<button type="button">Color</button>
			</ColorPicker>
		);
		const { rerender } = render(ui(MID_RED));
		await openPicker();

		await dragPast();
		rerender(ui('#00ff00'));

		expect(getHexField()).toHaveValue('ff0000');

		await release();

		await waitFor(() => expect(getHexField()).toHaveValue('00ff00'));
	});

	it('calls the handlers the parent passed last, when it swaps them during a drag', async () => {
		const first = vi.fn();
		const second = vi.fn();
		const ui = (onAfterChange: (value: string | undefined) => void) => (
			<ColorPicker
				nativeButton
				side="bottom"
				align="start"
				testId="picker"
				value={MID_RED}
				onAfterChange={onAfterChange}
			>
				<button type="button">Color</button>
			</ColorPicker>
		);
		const { rerender } = render(ui(first));
		await openPicker();

		await dragPast();
		rerender(ui(second));
		await release();

		expect(first).not.toHaveBeenCalled();
		expect(second).toHaveBeenCalledWith('#ff0000');
	});

	it('ends a drag without onAfterChange, and without a late onChange, when the picker unmounts', async () => {
		const onChange = vi.fn();
		const onAfterChange = vi.fn();
		const { unmount } = render(
			<ControlledPicker initial={MID_RED} onChange={onChange} onAfterChange={onAfterChange} />,
		);
		await openPicker();
		const area = screen.getByTestId('picker-area');

		syntheticPointer.down(area, pointIn('picker-area', -0.2, -0.2));
		unmount();
		await nextFrame();
		await nextFrame();

		expect(onChange).not.toHaveBeenCalled();
		expect(onAfterChange).not.toHaveBeenCalled();
	});
});

describe('ColorPicker clear', () => {
	it('clears from the panel, closes it and returns the focus to the trigger', async () => {
		const onChange = vi.fn();
		const onAfterChange = vi.fn();
		render(
			<ControlledPicker
				initial={MID_RED}
				allowClear
				onChange={onChange}
				onAfterChange={onAfterChange}
			/>,
		);
		await openPicker();

		await userEvent.click(screen.getByRole('button', { name: 'Clear color' }));

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith(undefined);
		expect(onAfterChange).toHaveBeenCalledTimes(1);
		expect(onAfterChange).toHaveBeenCalledWith(undefined);
		await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
		expect(getTrigger()).toHaveFocus();
		expect(screen.getByTestId('value')).toHaveTextContent('none');
	});

	it('shows no clear button without allowClear, or while there is no color', async () => {
		const { unmount } = render(<ControlledPicker initial={MID_RED} />);
		await openPicker();
		expect(screen.queryByRole('button', { name: 'Clear color' })).not.toBeInTheDocument();
		unmount();

		render(<ControlledPicker allowClear />);
		await openPicker();
		expect(screen.queryByRole('button', { name: 'Clear color' })).not.toBeInTheDocument();
	});

	it('opens a cleared picker at an empty field and sets a color on the first change', async () => {
		const onAfterChange = vi.fn();
		render(<ControlledPicker initial={MID_RED} allowClear onAfterChange={onAfterChange} />);
		await openPicker();
		await userEvent.click(screen.getByRole('button', { name: 'Clear color' }));
		await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());

		await openPicker();

		expect(getHexField()).toHaveValue('');
		expect(getBrightness()).toHaveValue('0');

		await userEvent.keyboard('{ArrowUp}');

		expect(onAfterChange).toHaveBeenLastCalledWith('#030303');
	});
});
