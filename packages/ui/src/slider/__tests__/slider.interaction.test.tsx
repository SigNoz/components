import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ReactElement, useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Slider } from '../slider.js';
import {
	click,
	dragThumb,
	getCenter,
	getThumbInput,
	pressTrack,
	release,
	renderSlider,
	resetPointer,
} from './slider.test-utils.js';

afterEach(async () => {
	await resetPointer();
});

describe('Slider keys', () => {
	it('moves one step per arrow, and calls each callback once per press', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		const onAfterChange = vi.fn();
		await renderSlider(
			<Slider
				color="primary"
				defaultValue={50}
				step={5}
				onChange={onChange}
				onAfterChange={onAfterChange}
				aria-label="Volume"
			/>,
		);

		getThumbInput().focus();
		await user.keyboard('{ArrowRight}');

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenLastCalledWith(55);
		expect(onAfterChange).toHaveBeenCalledTimes(1);
		expect(onAfterChange).toHaveBeenLastCalledWith(55);

		await user.keyboard('{ArrowUp}{ArrowLeft}{ArrowLeft}{ArrowDown}');

		expect(onChange).toHaveBeenCalledTimes(5);
		expect(onAfterChange).toHaveBeenCalledTimes(5);
		expect(getThumbInput()).toHaveAttribute('aria-valuenow', '45');
	});

	it('moves 10% of the scale on PageUp, PageDown and Shift with an arrow', async () => {
		const user = userEvent.setup();
		await renderSlider(
			<Slider
				color="primary"
				defaultValue={50000}
				min={0}
				max={100000}
				step={1}
				aria-label="Duration"
			/>,
		);

		getThumbInput().focus();
		await user.keyboard('{PageUp}');
		expect(getThumbInput()).toHaveAttribute('aria-valuenow', '60000');

		await user.keyboard('{Shift>}{ArrowLeft}{ArrowLeft}{/Shift}');
		expect(getThumbInput()).toHaveAttribute('aria-valuenow', '40000');

		await user.keyboard('{PageDown}');
		expect(getThumbInput()).toHaveAttribute('aria-valuenow', '30000');
	});

	it('rounds the large step to a multiple of step', async () => {
		const user = userEvent.setup();
		await renderSlider(
			<Slider
				color="primary"
				defaultValue={0}
				min={0}
				max={1}
				step={0.03}
				aria-label="Fill opacity"
			/>,
		);

		getThumbInput().focus();
		await user.keyboard('{PageUp}');

		expect(getThumbInput()).toHaveAttribute('aria-valuenow', '0.09');
	});

	it('keeps the large step at one step on a short scale', async () => {
		const user = userEvent.setup();
		await renderSlider(
			<Slider color="primary" defaultValue={2} min={0} max={5} step={1} aria-label="Rating" />,
		);

		getThumbInput().focus();
		await user.keyboard('{PageUp}');

		expect(getThumbInput()).toHaveAttribute('aria-valuenow', '3');
	});

	it('moves to min on Home and to max on End', async () => {
		const user = userEvent.setup();
		await renderSlider(
			<Slider color="primary" defaultValue={40} min={10} max={90} aria-label="Volume" />,
		);

		getThumbInput().focus();
		await user.keyboard('{End}');
		expect(getThumbInput()).toHaveAttribute('aria-valuenow', '90');

		await user.keyboard('{Home}');
		expect(getThumbInput()).toHaveAttribute('aria-valuenow', '10');
	});

	it('never moves a range thumb past the other one', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		await renderSlider(
			<Slider.Range
				color="primary"
				defaultValue={[40, 41]}
				onChange={onChange}
				aria-label="Duration"
			/>,
		);

		getThumbInput(0).focus();
		await user.keyboard('{ArrowRight}{ArrowRight}');

		expect(getThumbInput(0)).toHaveAttribute('aria-valuenow', '41');
		expect(getThumbInput(1)).toHaveAttribute('aria-valuenow', '41');
		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenLastCalledWith([41, 41]);

		await user.keyboard('{End}');
		expect(getThumbInput(0)).toHaveAttribute('aria-valuenow', '41');

		getThumbInput(1).focus();
		await user.keyboard('{Home}');
		expect(getThumbInput(1)).toHaveAttribute('aria-valuenow', '41');
	});
});

describe('Slider value', () => {
	it('starts at min without a value or a default', async () => {
		await renderSlider(<Slider color="primary" min={20} aria-label="Volume" />);

		expect(getThumbInput()).toHaveAttribute('aria-valuenow', '20');
	});

	it('starts a range at min and max without a value or a default', async () => {
		await renderSlider(<Slider.Range color="primary" min={20} max={80} aria-label="Duration" />);

		expect(getThumbInput(0)).toHaveAttribute('aria-valuenow', '20');
		expect(getThumbInput(1)).toHaveAttribute('aria-valuenow', '80');
	});

	it('follows a controlled value, and stays put when the parent keeps it', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		const { rerender } = await renderSlider(
			<Slider color="primary" value={30} onChange={onChange} aria-label="Volume" />,
		);

		getThumbInput().focus();
		await user.keyboard('{ArrowRight}');

		expect(onChange).toHaveBeenCalledWith(31);
		expect(getThumbInput()).toHaveAttribute('aria-valuenow', '30');

		rerender(<Slider color="primary" value={70} onChange={onChange} aria-label="Volume" />);

		expect(getThumbInput()).toHaveAttribute('aria-valuenow', '70');
	});

	it('updates a controlled range from onChange with a pair', async () => {
		const user = userEvent.setup();

		function Controlled(): ReactElement {
			const [value, setValue] = useState<[number, number]>([20, 80]);
			return (
				<Slider.Range color="primary" value={value} onChange={setValue} aria-label="Duration" />
			);
		}

		await renderSlider(<Controlled />);

		getThumbInput(1).focus();
		await user.keyboard('{ArrowLeft}');

		expect(getThumbInput(1)).toHaveAttribute('aria-valuenow', '79');
	});

	it.each([
		['NaN', Number.NaN, '0'],
		['Infinity', Number.POSITIVE_INFINITY, '0'],
		['below min', -20, '0'],
		['above max', 140, '100'],
	])(
		'renders a value %s at %s, with no onChange to correct it',
		async (_label, value, expected) => {
			const onChange = vi.fn();
			await renderSlider(
				<Slider color="primary" value={value} onChange={onChange} tooltip aria-label="Volume" />,
			);

			expect(getThumbInput()).toHaveAttribute('aria-valuenow', expected);
			expect(getThumbInput()).toHaveAttribute('aria-valuetext', expected);
			expect(onChange).not.toHaveBeenCalled();
		},
	);
});

describe('Slider pointer', () => {
	it('moves the thumb on a press on the track, and commits on release', async () => {
		const onChange = vi.fn();
		const onAfterChange = vi.fn();
		renderSlider(
			<Slider
				color="primary"
				defaultValue={0}
				onChange={onChange}
				onAfterChange={onAfterChange}
				testId="volume"
				aria-label="Volume"
			/>,
		);

		await pressTrack('volume', 0.75);

		expect(onChange).toHaveBeenLastCalledWith(75);
		expect(onAfterChange).toHaveBeenCalledTimes(1);
		expect(onAfterChange).toHaveBeenCalledWith(75);
	});

	it('reaches min and max with the thumb inside the track', async () => {
		renderSlider(<Slider color="primary" defaultValue={50} testId="volume" aria-label="Volume" />);

		await pressTrack('volume', 1);
		expect(getThumbInput()).toHaveAttribute('aria-valuenow', '100');

		const root = screen.getByTestId('volume').getBoundingClientRect();
		const thumb = screen.getByTestId('volume-thumb-0').getBoundingClientRect();
		expect(thumb.right).toBeCloseTo(root.right, 0);

		await pressTrack('volume', 0);
		expect(getThumbInput()).toHaveAttribute('aria-valuenow', '0');
		expect(screen.getByTestId('volume-thumb-0').getBoundingClientRect().left).toBeCloseTo(
			root.left,
			0,
		);
	});

	it('calls onChange while the thumb drags, and onAfterChange once on release', async () => {
		const onChange = vi.fn();
		const onAfterChange = vi.fn();
		renderSlider(
			<Slider
				color="primary"
				defaultValue={50}
				onChange={onChange}
				onAfterChange={onAfterChange}
				testId="volume"
				aria-label="Volume"
			/>,
		);

		await dragThumb('volume', 0, [0.6, 0.7, 0.8]);

		expect(onChange).toHaveBeenCalledWith(60);
		expect(onChange).toHaveBeenLastCalledWith(80);
		expect(onAfterChange).toHaveBeenCalledTimes(1);
		expect(onAfterChange).toHaveBeenCalledWith(80);
	});

	it('stops a range thumb at the other one, and never moves the other one', async () => {
		const onChange = vi.fn();
		renderSlider(
			<Slider.Range
				color="primary"
				defaultValue={[20, 60]}
				onChange={onChange}
				testId="duration"
				aria-label="Duration"
			/>,
		);

		await dragThumb('duration', 0, [0.4, 0.9]);

		expect(getThumbInput(0)).toHaveAttribute('aria-valuenow', '60');
		expect(getThumbInput(1)).toHaveAttribute('aria-valuenow', '60');
		for (const [value] of onChange.mock.calls) {
			expect(value[1]).toBe(60);
		}
	});

	it('moves the thumb on the side of a press when both hold the same value', async () => {
		await renderSlider(
			<Slider.Range color="primary" defaultValue={[50, 50]} testId="duration" aria-label="D" />,
		);

		await pressTrack('duration', 0.2);
		expect([getThumbInput(0).value, getThumbInput(1).value]).toEqual(['20', '50']);

		await dragThumb('duration', 0, [0.5]);
		await pressTrack('duration', 0.8);
		expect([getThumbInput(0).value, getThumbInput(1).value]).toEqual(['50', '80']);
	});

	it('drags two thumbs at the same value apart in either direction', async () => {
		await renderSlider(
			<Slider.Range color="primary" defaultValue={[50, 50]} testId="duration" aria-label="D" />,
		);

		await dragThumb('duration', 1, [0.3]);
		expect([getThumbInput(0).value, getThumbInput(1).value]).toEqual(['30', '50']);

		await dragThumb('duration', 0, [0.5, 0.9]);
		expect([getThumbInput(0).value, getThumbInput(1).value]).toEqual(['50', '50']);

		await dragThumb('duration', 0, [0.7]);
		expect([getThumbInput(0).value, getThumbInput(1).value]).toEqual(['50', '70']);
	});

	it('moves the closest range thumb on a press on the track', async () => {
		renderSlider(
			<Slider.Range
				color="primary"
				defaultValue={[20, 60]}
				testId="duration"
				aria-label="Duration"
			/>,
		);

		await pressTrack('duration', 0.7);

		expect(getThumbInput(0)).toHaveAttribute('aria-valuenow', '20');
		expect(getThumbInput(1)).toHaveAttribute('aria-valuenow', '70');
	});

	it('marks the root while a thumb drags', async () => {
		renderSlider(<Slider color="primary" defaultValue={50} testId="volume" aria-label="Volume" />);

		await dragThumb('volume', 0, [0.6, 0.7, 0.8, 0.9], { release: false });
		expect(screen.getByTestId('volume')).toHaveAttribute('data-dragging');

		await release();
		expect(screen.getByTestId('volume')).not.toHaveAttribute('data-dragging');
	});
});

describe('Slider marks', () => {
	const MARKS = { 0: '1 GB', 25: '10 GB', 50: '100 GB', 75: '1 TB', 100: '10 TB' };

	it('moves the thumb to the mark on a click on its label, with one call to each callback', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		const onAfterChange = vi.fn();
		renderSlider(
			<Slider
				color="primary"
				defaultValue={0}
				marks={MARKS}
				onChange={onChange}
				onAfterChange={onAfterChange}
				testId="volume"
				aria-label="Volume"
			/>,
		);

		await user.click(screen.getByTestId('volume-mark-75'));

		expect(getThumbInput()).toHaveAttribute('aria-valuenow', '75');
		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith(75);
		expect(onAfterChange).toHaveBeenCalledTimes(1);
		expect(onAfterChange).toHaveBeenCalledWith(75);
	});

	it('moves the thumb to the exact mark value on a click on its dot', async () => {
		const onChange = vi.fn();
		const onAfterChange = vi.fn();
		renderSlider(
			<Slider
				color="primary"
				defaultValue={0}
				marks={{ 33: 'third' }}
				onChange={onChange}
				onAfterChange={onAfterChange}
				testId="volume"
				aria-label="Volume"
			/>,
		);
		const dot = screen
			.getByTestId('volume')
			.querySelector<HTMLElement>('[data-slot="slider-mark-dot"]');

		await click(getCenter(dot as HTMLElement));

		expect(getThumbInput()).toHaveAttribute('aria-valuenow', '33');
		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onAfterChange).toHaveBeenCalledTimes(1);
	});

	it('calls nothing on a click on the mark the thumb already holds', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		await renderSlider(
			<Slider
				color="primary"
				defaultValue={50}
				marks={MARKS}
				onChange={onChange}
				testId="volume"
				aria-label="Volume"
			/>,
		);

		await user.click(screen.getByTestId('volume-mark-50'));

		expect(onChange).not.toHaveBeenCalled();
	});

	it('moves the closest range thumb to the mark', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		await renderSlider(
			<Slider.Range
				color="primary"
				defaultValue={[20, 60]}
				marks={MARKS}
				onChange={onChange}
				testId="duration"
				aria-label="Duration"
			/>,
		);

		await user.click(screen.getByTestId('duration-mark-25'));
		expect(onChange).toHaveBeenLastCalledWith([25, 60]);

		await user.click(screen.getByTestId('duration-mark-50'));
		expect(onChange).toHaveBeenLastCalledWith([25, 50]);
	});

	it('moves the range thumb on the side of the mark when both hold the same value', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		const { rerender } = await renderSlider(
			<Slider.Range
				color="primary"
				value={[50, 50]}
				marks={MARKS}
				onChange={onChange}
				testId="duration"
				aria-label="Duration"
			/>,
		);

		await user.click(screen.getByTestId('duration-mark-25'));
		expect(onChange).toHaveBeenLastCalledWith([25, 50]);

		rerender(
			<Slider.Range
				color="primary"
				value={[50, 50]}
				marks={MARKS}
				onChange={onChange}
				testId="duration"
				aria-label="Duration"
			/>,
		);

		await user.click(screen.getByTestId('duration-mark-75'));
		expect(onChange).toHaveBeenLastCalledWith([50, 75]);
	});

	it('marks the marks inside the fill as active', async () => {
		await renderSlider(
			<Slider.Range
				color="primary"
				defaultValue={[25, 75]}
				marks={MARKS}
				testId="duration"
				aria-label="Duration"
			/>,
		);

		const active = ['0', '25', '50', '75', '100'].map((value) =>
			screen.getByTestId(`duration-mark-${value}`).hasAttribute('data-active'),
		);
		expect(active).toEqual([false, true, true, true, false]);
	});

	it('marks the marks from min to the thumb as active on a single slider', async () => {
		await renderSlider(
			<Slider
				color="primary"
				defaultValue={50}
				marks={MARKS}
				testId="volume"
				aria-label="Volume"
			/>,
		);

		const dots = screen
			.getByTestId('volume')
			.querySelectorAll('[data-slot="slider-mark-dot"][data-active]');
		expect(dots).toHaveLength(3);
		expect(screen.getByTestId('volume-mark-75')).not.toHaveAttribute('data-active');
	});
});
