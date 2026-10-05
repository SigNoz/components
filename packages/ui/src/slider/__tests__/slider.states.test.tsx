import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Slider } from '../slider.js';
import {
	click,
	dragThumb,
	getCenter,
	getThumbInput,
	pressTrack,
	renderSlider,
	resetPointer,
} from './slider.test-utils.js';

const MARKS = { 0: 'low', 50: 'mid', 100: 'high' };

afterEach(async () => {
	await resetPointer();
});

describe('Slider disabled', () => {
	it('marks the root, disables the inputs and takes the thumbs out of the tab order', async () => {
		const user = userEvent.setup();
		await renderSlider(
			<>
				<button type="button">Before</button>
				<Slider
					color="primary"
					defaultValue={50}
					disabled
					disabledTooltip={undefined}
					testId="volume"
					aria-label="Volume"
				/>
				<button type="button">After</button>
			</>,
		);

		expect(screen.getByTestId('volume')).toHaveAttribute('data-disabled');
		expect(getThumbInput()).toBeDisabled();

		await user.click(screen.getByRole('button', { name: 'Before' }));
		await user.tab();

		expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
	});

	it('blocks the track, the drag and the marks', async () => {
		const onChange = vi.fn();
		const onAfterChange = vi.fn();
		await renderSlider(
			<Slider
				color="primary"
				defaultValue={50}
				marks={MARKS}
				disabled
				disabledTooltip={undefined}
				onChange={onChange}
				onAfterChange={onAfterChange}
				testId="volume"
				aria-label="Volume"
			/>,
		);

		await pressTrack('volume', 0.9);
		await dragThumb('volume', 0, [0.2]);
		await click(getCenter(screen.getByTestId('volume-mark-100')));

		expect(getThumbInput()).toHaveAttribute('aria-valuenow', '50');
		expect(onChange).not.toHaveBeenCalled();
		expect(onAfterChange).not.toHaveBeenCalled();
	});

	it('fades the whole slider, and shows not-allowed everywhere', async () => {
		await renderSlider(
			<Slider
				color="primary"
				defaultValue={50}
				marks={MARKS}
				disabled
				disabledTooltip={undefined}
				testId="volume"
				aria-label="V"
			/>,
		);

		expect(getComputedStyle(screen.getByTestId('volume')).opacity).toBe('0.6');
		expect(getComputedStyle(screen.getByTestId('volume-thumb-0')).cursor).toBe('not-allowed');
		expect(getComputedStyle(screen.getByTestId('volume-mark-50')).cursor).toBe('not-allowed');
	});
});

describe('Slider readOnly', () => {
	it('keeps the thumb focusable and announces it as read-only', async () => {
		const user = userEvent.setup();
		await renderSlider(
			<Slider
				color="primary"
				defaultValue={50}
				readOnly
				readOnlyTooltip={undefined}
				testId="volume"
				aria-label="Volume"
			/>,
		);

		await user.tab();

		expect(getThumbInput()).toHaveFocus();
		expect(getThumbInput()).not.toBeDisabled();
		expect(getThumbInput()).toHaveAttribute('aria-readonly', 'true');
		expect(screen.getByTestId('volume')).toHaveAttribute('data-readonly');
		expect(screen.getByTestId('volume')).not.toHaveAttribute('data-disabled');
	});

	it('drops the keys, the track, the drag and the marks, and calls nothing', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		const onAfterChange = vi.fn();
		await renderSlider(
			<Slider
				color="primary"
				defaultValue={50}
				marks={MARKS}
				readOnly
				readOnlyTooltip={undefined}
				onChange={onChange}
				onAfterChange={onAfterChange}
				testId="volume"
				aria-label="Volume"
			/>,
		);

		getThumbInput().focus();
		await user.keyboard('{ArrowRight}{PageUp}{End}{Home}');
		await pressTrack('volume', 0.9);
		await dragThumb('volume', 0, [0.2]);
		await click(getCenter(screen.getByTestId('volume-mark-100')));

		expect(getThumbInput()).toHaveAttribute('aria-valuenow', '50');
		expect(screen.getByTestId('volume')).not.toHaveAttribute('data-dragging');
		expect(onChange).not.toHaveBeenCalled();
		expect(onAfterChange).not.toHaveBeenCalled();
	});

	it('removes aria-readonly when readOnly turns off', async () => {
		const { rerender } = await renderSlider(
			<Slider
				color="primary"
				defaultValue={50}
				readOnly
				readOnlyTooltip={undefined}
				aria-label="V"
			/>,
		);

		rerender(<Slider color="primary" defaultValue={50} aria-label="V" />);

		expect(getThumbInput()).not.toHaveAttribute('aria-readonly');
	});

	it('fades less than disabled, and shows not-allowed everywhere', async () => {
		await renderSlider(
			<Slider
				color="primary"
				defaultValue={50}
				marks={MARKS}
				readOnly
				readOnlyTooltip={undefined}
				testId="volume"
				aria-label="V"
			/>,
		);

		expect(getComputedStyle(screen.getByTestId('volume')).opacity).toBe('0.8');
		expect(getComputedStyle(screen.getByTestId('volume')).cursor).toBe('not-allowed');
		expect(getComputedStyle(screen.getByTestId('volume-thumb-0')).cursor).toBe('not-allowed');
		expect(getComputedStyle(screen.getByTestId('volume-mark-50')).cursor).toBe('not-allowed');
	});

	it('outranks disabled: with both, the slider is only read-only', async () => {
		await renderSlider(
			<Slider
				color="primary"
				defaultValue={50}
				disabled
				disabledTooltip={undefined}
				readOnly
				readOnlyTooltip={undefined}
				testId="volume"
				aria-label="Volume"
			/>,
		);

		expect(screen.getByTestId('volume')).toHaveAttribute('data-readonly');
		expect(screen.getByTestId('volume')).not.toHaveAttribute('data-disabled');
		expect(getThumbInput()).not.toBeDisabled();
		expect(getThumbInput()).toHaveAttribute('aria-readonly', 'true');
	});

	it('locks Slider.Range the same way', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		await renderSlider(
			<Slider.Range
				color="primary"
				defaultValue={[20, 80]}
				readOnly
				readOnlyTooltip={undefined}
				onChange={onChange}
				aria-label="Duration"
			/>,
		);

		getThumbInput(1).focus();
		await user.keyboard('{ArrowLeft}');

		expect(getThumbInput(0)).toHaveAttribute('aria-readonly', 'true');
		expect(getThumbInput(1)).toHaveAttribute('aria-readonly', 'true');
		expect(getThumbInput(1)).toHaveAttribute('aria-valuenow', '80');
		expect(onChange).not.toHaveBeenCalled();
	});
});

describe('Slider forms', () => {
	function getFormData(): FormData {
		return new FormData(document.querySelector('form') as HTMLFormElement);
	}

	it('submits its value under name', async () => {
		await renderSlider(
			<form>
				<Slider color="primary" name="opacity" defaultValue={40} aria-label="Opacity" />
			</form>,
		);

		expect(getFormData().getAll('opacity')).toEqual(['40']);
	});

	it('submits both values of a range under one name, the lower bound first', async () => {
		await renderSlider(
			<form>
				<Slider.Range
					color="primary"
					name="duration"
					defaultValue={[20, 80]}
					aria-label="Duration"
				/>
			</form>,
		);

		expect(getFormData().getAll('duration')).toEqual(['20', '80']);
	});

	it('reaches a form outside it through form', async () => {
		await renderSlider(
			<>
				<form id="filters" />
				<Slider
					color="primary"
					name="opacity"
					form="filters"
					defaultValue={40}
					aria-label="Opacity"
				/>
			</>,
		);

		expect(getFormData().getAll('opacity')).toEqual(['40']);
	});

	it('is left out while disabled, and submitted while read-only', async () => {
		await renderSlider(
			<form>
				<Slider
					color="primary"
					name="disabled"
					defaultValue={10}
					disabled
					disabledTooltip={undefined}
					aria-label="Disabled"
				/>
				<Slider
					color="primary"
					name="locked"
					defaultValue={20}
					readOnly
					readOnlyTooltip={undefined}
					aria-label="Locked"
				/>
			</form>,
		);

		expect(getFormData().has('disabled')).toBe(false);
		expect(getFormData().getAll('locked')).toEqual(['20']);
	});

	it('takes required and never blocks the submit with it', async () => {
		await renderSlider(
			<form>
				<Slider color="primary" name="opacity" required aria-label="Opacity" />
			</form>,
		);

		expect((document.querySelector('form') as HTMLFormElement).checkValidity()).toBe(true);
	});
});
