import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { userEvent as browserUserEvent } from 'vitest/browser';
import { queryOpenTooltip } from '../../__tests__/test-utils.js';
import { ForceOpenProvider } from '../../testing/index.js';
import { ColorPicker } from '../index.js';
import {
	click,
	declareSpacingTokens,
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
} from './color-picker.test-utils.js';

const DISABLED_REASON = 'Ask an admin for edit access';
const READ_ONLY_REASON = 'Set by the dashboard owner';

type StateProps = {
	disabled?: boolean;
	readOnly?: boolean;
	disabledTooltip?: string;
	readOnlyTooltip?: string;
	onChange?: (value: string | undefined) => void;
	onAfterChange?: (value: string | undefined) => void;
};

function StatePicker({
	disabled,
	readOnly,
	disabledTooltip = DISABLED_REASON,
	readOnlyTooltip = READ_ONLY_REASON,
	onChange,
	onAfterChange,
}: StateProps) {
	return (
		<>
			<button type="button">Before</button>
			<ColorPicker
				nativeButton
				side="bottom"
				align="start"
				testId="picker"
				value={MID_RED}
				allowClear
				onChange={onChange}
				onAfterChange={onAfterChange}
				disabled={disabled}
				disabledTooltip={disabledTooltip}
				readOnly={readOnly}
				readOnlyTooltip={readOnlyTooltip}
			>
				<button type="button">Color</button>
			</ColorPicker>
		</>
	);
}

beforeEach(() => {
	declareSpacingTokens();
});

afterEach(async () => {
	await resetPointer();
});

describe('ColorPicker disabled', () => {
	it('marks the trigger without the native attribute, and keeps it in the tab order', async () => {
		render(<StatePicker disabled />);
		const trigger = getTrigger();

		expect(trigger).toHaveAttribute('aria-disabled', 'true');
		expect(trigger).toHaveAttribute('data-disabled');
		expect(trigger).not.toBeDisabled();
		expect(trigger).not.toHaveAttribute('aria-readonly');

		await userEvent.click(screen.getByRole('button', { name: 'Before' }));
		await userEvent.tab();

		expect(trigger).toHaveFocus();
	});

	it('does not open on a press, Enter or Space', async () => {
		render(<StatePicker disabled />);
		const trigger = getTrigger();

		await userEvent.click(trigger);
		trigger.focus();
		await userEvent.keyboard('{Enter}');
		await userEvent.keyboard(' ');

		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
		expect(trigger).toHaveAttribute('aria-expanded', 'false');
	});

	it('does not clear on Delete or Backspace', async () => {
		const onChange = vi.fn();
		render(<StatePicker disabled onChange={onChange} />);
		getTrigger().focus();

		await userEvent.keyboard('{Delete}{Backspace}');

		expect(onChange).not.toHaveBeenCalled();
	});

	it('stays closed under ForceOpenProvider', () => {
		render(
			<ForceOpenProvider>
				<StatePicker disabled />
			</ForceOpenProvider>,
		);

		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	it('closes an open popup when it turns disabled', async () => {
		const { rerender } = render(<StatePicker />);
		await openPicker();

		rerender(<StatePicker disabled />);

		await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
	});

	it('does not block the pointer on the trigger', () => {
		render(<StatePicker disabled />);

		expect(getComputedStyle(getTrigger()).pointerEvents).not.toBe('none');
	});
});

describe('ColorPicker readOnly', () => {
	it('opens, and marks the trigger and the popup', async () => {
		render(<StatePicker readOnly />);
		const trigger = getTrigger();

		expect(trigger).toHaveAttribute('aria-readonly', 'true');
		expect(trigger).toHaveAttribute('data-readonly');
		expect(trigger).not.toHaveAttribute('aria-disabled');

		const popup = await openPicker();

		expect(popup).toHaveAttribute('data-readonly');
	});

	it('keeps the area and the hue strip focusable, and announces them as read-only', async () => {
		render(<StatePicker readOnly />);
		await openPicker();

		expect(getSaturation()).toHaveFocus();

		for (const input of [getSaturation(), getBrightness(), getHue()]) {
			expect(input).toHaveAttribute('aria-readonly', 'true');
			expect(input).not.toBeDisabled();
		}

		await userEvent.tab();
		expect(getHue()).toHaveFocus();
	});

	it('drops every key on the area and the hue strip', async () => {
		const onChange = vi.fn();
		const onAfterChange = vi.fn();
		render(<StatePicker readOnly onChange={onChange} onAfterChange={onAfterChange} />);
		await openPicker();

		await userEvent.keyboard('{ArrowRight}{ArrowUp}{PageUp}{Home}{End}{Shift>}{ArrowLeft}{/Shift}');
		expect(getSaturation()).toHaveValue('50');
		expect(getBrightness()).toHaveValue('50');

		await userEvent.tab();
		await userEvent.keyboard('{ArrowRight}{PageUp}{End}');
		expect(getHue()).toHaveValue('0');

		expect(onChange).not.toHaveBeenCalled();
		expect(onAfterChange).not.toHaveBeenCalled();
	});

	it('drops a press and a drag on the area and the hue strip', async () => {
		const onChange = vi.fn();
		const onAfterChange = vi.fn();
		render(<StatePicker readOnly onChange={onChange} onAfterChange={onAfterChange} />);
		const popup = await openPicker();

		await click(pointIn('picker-area', 0.1, 0.1));
		await click(pointIn('picker-hue', 0.7));
		await press(pointIn('picker-area', 0.5, 0.5));
		await moveTo(pointIn('picker-area', 0.9, 0.9));
		await nextFrame();
		expect(popup).not.toHaveAttribute('data-dragging');
		await release();

		expect(getHexField()).toHaveValue('804040');
		expect(onChange).not.toHaveBeenCalled();
		expect(onAfterChange).not.toHaveBeenCalled();
	});

	it('shows not-allowed over the area and the hue strip', async () => {
		render(<StatePicker readOnly />);
		await openPicker();

		expect(getComputedStyle(screen.getByTestId('picker-area')).cursor).toBe('not-allowed');
		expect(getComputedStyle(screen.getByTestId('picker-hue')).cursor).toBe('not-allowed');
	});

	it('makes the hex field a native read-only input whose text can be selected', async () => {
		const onChange = vi.fn();
		render(<StatePicker readOnly onChange={onChange} />);
		await openPicker();
		const hex = getHexField();

		expect(hex).toHaveAttribute('readonly');

		expect(getComputedStyle(hex).userSelect).not.toBe('none');

		await userEvent.type(hex, '00ff00{Enter}');

		expect(hex).toHaveValue('804040');
		expect(onChange).not.toHaveBeenCalled();
	});

	it('renders no clear button and ignores Delete and Backspace on the trigger', async () => {
		const onChange = vi.fn();
		render(<StatePicker readOnly onChange={onChange} />);
		getTrigger().focus();

		await userEvent.keyboard('{Delete}{Backspace}');
		await openPicker();

		expect(screen.queryByRole('button', { name: 'Clear color' })).not.toBeInTheDocument();
		expect(onChange).not.toHaveBeenCalled();
	});
});

describe('ColorPicker disabled and readOnly together', () => {
	it('is treated as readOnly only', async () => {
		const onChange = vi.fn();
		render(<StatePicker disabled readOnly onChange={onChange} />);
		const trigger = getTrigger();

		expect(trigger).toHaveAttribute('aria-readonly', 'true');
		expect(trigger).toHaveAttribute('data-readonly');
		expect(trigger).not.toHaveAttribute('aria-disabled');
		expect(trigger).not.toHaveAttribute('data-disabled');

		const popup = await openPicker();
		expect(popup).toHaveAttribute('data-readonly');

		await userEvent.keyboard('{ArrowRight}');
		expect(onChange).not.toHaveBeenCalled();
	});
});

describe('ColorPicker disabledTooltip and readOnlyTooltip', () => {
	it('shows disabledTooltip on hover over the trigger', async () => {
		render(<StatePicker disabled />);

		await userEvent.hover(getTrigger());

		await waitFor(() => expect(queryOpenTooltip()).toHaveTextContent(DISABLED_REASON));
	});

	it('shows disabledTooltip on keyboard focus', async () => {
		render(<StatePicker disabled />);
		screen.getByRole('button', { name: 'Before' }).focus();

		await browserUserEvent.tab();

		expect(getTrigger()).toHaveFocus();
		await waitFor(() => expect(queryOpenTooltip()).toHaveTextContent(DISABLED_REASON));
	});

	it('shows readOnlyTooltip on hover and on keyboard focus', async () => {
		render(<StatePicker readOnly />);

		await userEvent.hover(getTrigger());
		await waitFor(() => expect(queryOpenTooltip()).toHaveTextContent(READ_ONLY_REASON));

		await userEvent.unhover(getTrigger());
		await waitFor(() => expect(queryOpenTooltip()).toBeNull());

		screen.getByRole('button', { name: 'Before' }).focus();
		await browserUserEvent.tab();
		await waitFor(() => expect(queryOpenTooltip()).toHaveTextContent(READ_ONLY_REASON));
	});

	it('shows only readOnlyTooltip when both are set', async () => {
		render(<StatePicker disabled readOnly />);

		await userEvent.hover(getTrigger());

		await waitFor(() => expect(queryOpenTooltip()).toHaveTextContent(READ_ONLY_REASON));
		expect(queryOpenTooltip()).not.toHaveTextContent(DISABLED_REASON);
	});

	it('shows no tooltip while the reasons are passed but neither state is on', async () => {
		render(<StatePicker />);

		await userEvent.hover(getTrigger());

		await expect(
			waitFor(() => expect(queryOpenTooltip()).not.toBeNull(), { timeout: 400 }),
		).rejects.toThrow();
	});

	it('renders no tooltip for an empty reason', async () => {
		render(<StatePicker disabled disabledTooltip="" />);

		await userEvent.hover(getTrigger());

		await expect(
			waitFor(() => expect(queryOpenTooltip()).not.toBeNull(), { timeout: 400 }),
		).rejects.toThrow();
	});

	it('keeps the focus on the trigger when disabled turns on', async () => {
		const { rerender } = render(<StatePicker />);
		getTrigger().focus();

		rerender(<StatePicker disabled />);

		expect(getTrigger()).toHaveFocus();
	});
});

describe('ColorPicker readOnly turning on mid-edit', () => {
	it('ends a drag without another onChange, and without onAfterChange', async () => {
		const onChange = vi.fn();
		const onAfterChange = vi.fn();
		const { rerender } = render(<StatePicker onChange={onChange} onAfterChange={onAfterChange} />);
		const popup = await openPicker();
		const area = screen.getByTestId('picker-area');

		syntheticPointer.down(area, pointIn('picker-area', 0.25, 0.25));
		await nextFrame();
		expect(onChange).toHaveBeenCalledTimes(1);

		rerender(<StatePicker readOnly onChange={onChange} onAfterChange={onAfterChange} />);
		syntheticPointer.move(area, pointIn('picker-area', 0.75, 0.75));
		syntheticPointer.up(area, pointIn('picker-area', 0.75, 0.75));
		await nextFrame();
		await nextFrame();

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onAfterChange).not.toHaveBeenCalled();
		expect(popup).not.toHaveAttribute('data-dragging');
	});

	it('drops the hex draft without a commit', async () => {
		const onChange = vi.fn();
		const { rerender } = render(<StatePicker onChange={onChange} />);
		await openPicker();

		await userEvent.click(getHexField());
		await userEvent.clear(getHexField());
		await userEvent.type(getHexField(), '00ff00');
		rerender(<StatePicker readOnly onChange={onChange} />);
		await userEvent.click(screen.getByRole('button', { name: 'Before' }));

		expect(onChange).not.toHaveBeenCalled();
	});
});

describe('ColorPicker disabled turning on mid-edit', () => {
	it('drops the hex draft with the popup it closes', async () => {
		const onChange = vi.fn();
		const { rerender } = render(<StatePicker onChange={onChange} />);
		await openPicker();
		await userEvent.click(getHexField());
		await userEvent.clear(getHexField());
		await userEvent.type(getHexField(), '00ff00');

		rerender(<StatePicker disabled onChange={onChange} />);
		await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
		rerender(<StatePicker onChange={onChange} />);
		await openPicker();

		expect(getHexField()).toHaveValue('804040');

		await userEvent.keyboard('{Escape}');

		expect(onChange).not.toHaveBeenCalled();
	});
});
