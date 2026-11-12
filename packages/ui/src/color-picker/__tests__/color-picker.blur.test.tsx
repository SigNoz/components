import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { FocusEvent, ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ColorPicker } from '../color-picker.js';
import { ColorPickerField } from '../presets/color-picker-field.js';
import { getHexField, getTrigger, MID_RED, openPicker } from './color-picker.test-utils.js';

/**
 * The blur is judged one task after the focus moved. A check that it was not called has to wait
 * past that task, or it passes before the call could happen.
 */
function settle(): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, 50));
}

function renderPicker(
	onBlur: (event: FocusEvent<HTMLElement>) => void,
	onTriggerBlur?: () => void,
): ReactElement {
	return (
		<div>
			<button type="button">Before</button>
			<ColorPicker
				nativeButton
				side="bottom"
				align="start"
				defaultValue={MID_RED}
				allowClear
				onBlur={onBlur}
			>
				<button type="button" onBlur={onTriggerBlur}>
					Color
				</button>
			</ColorPicker>
			<button type="button">After</button>
			<p>Outside text</p>
		</div>
	);
}

describe('ColorPicker onBlur', () => {
	it('stays quiet while the popup opens and closes, and fires once when Tab leaves', async () => {
		const onBlur = vi.fn();
		render(renderPicker(onBlur));

		await openPicker();
		await settle();

		expect(onBlur).not.toHaveBeenCalled();

		await userEvent.keyboard('{Escape}');
		await waitFor(() => {
			expect(screen.queryByRole('dialog')).toBeNull();
		});
		await waitFor(() => {
			expect(getTrigger()).toHaveFocus();
		});
		await settle();

		expect(onBlur).not.toHaveBeenCalled();

		await userEvent.tab();

		await waitFor(() => {
			expect(onBlur).toHaveBeenCalledTimes(1);
		});
		expect(onBlur.mock.calls[0]?.[0].currentTarget).toBe(getTrigger());
	});

	it('stays quiet while Tab moves through the popup', async () => {
		const onBlur = vi.fn();
		render(renderPicker(onBlur));

		await openPicker();
		await userEvent.tab();
		await userEvent.tab();

		expect(getHexField()).toHaveFocus();

		await userEvent.tab();
		await settle();

		expect(onBlur).not.toHaveBeenCalled();
	});

	it('stays quiet when the clear button hands the focus back to the trigger', async () => {
		const onBlur = vi.fn();
		render(renderPicker(onBlur));

		await openPicker();
		await userEvent.click(screen.getByRole('button', { name: 'Clear color' }));
		await waitFor(() => {
			expect(getTrigger()).toHaveFocus();
		});
		await settle();

		expect(onBlur).not.toHaveBeenCalled();
	});

	it('fires once on a press outside the open popup', async () => {
		const onBlur = vi.fn();
		render(renderPicker(onBlur));

		await openPicker();
		await userEvent.click(screen.getByText('Outside text'));

		await waitFor(() => {
			expect(onBlur).toHaveBeenCalledTimes(1);
		});
		await settle();

		expect(onBlur).toHaveBeenCalledTimes(1);
	});

	it('fires once when the focus leaves the closed trigger, and keeps the trigger own onBlur', async () => {
		const onBlur = vi.fn();
		const onTriggerBlur = vi.fn();
		render(renderPicker(onBlur, onTriggerBlur));

		getTrigger().focus();
		await userEvent.tab({ shift: true });

		expect(screen.getByRole('button', { name: 'Before' })).toHaveFocus();
		await waitFor(() => {
			expect(onBlur).toHaveBeenCalledTimes(1);
		});
		expect(onTriggerBlur).toHaveBeenCalledTimes(1);
	});
});

describe('ColorPickerField onBlur', () => {
	it('fires once when the focus leaves the picker, and takes a handler with no argument', async () => {
		const onBlur = vi.fn<() => void>();
		render(
			<div>
				<ColorPickerField label="Color" nativeButton side="bottom" align="start" onBlur={onBlur}>
					<button type="button">Pick</button>
				</ColorPickerField>
				<button type="button">After</button>
			</div>,
		);

		await openPicker();
		await userEvent.keyboard('{Escape}');
		await waitFor(() => {
			expect(getTrigger()).toHaveFocus();
		});
		await settle();

		expect(onBlur).not.toHaveBeenCalled();

		await userEvent.tab();

		await waitFor(() => {
			expect(onBlur).toHaveBeenCalledTimes(1);
		});
	});
});
