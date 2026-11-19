import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import { Slider } from '../slider.js';
import { getThumbInput, renderSlider, resetPointer } from './slider.test-utils.js';

let warn: MockInstance<typeof console.warn>;

beforeEach(() => {
	warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(async () => {
	warn.mockRestore();
	await resetPointer();
});

describe('Slider value rule', () => {
	it('starts at defaultValue and keeps its own state while value is undefined', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		await renderSlider(
			<Slider color="primary" defaultValue={30} onChange={onChange} aria-label="Volume" />,
		);

		expect(getThumbInput()).toHaveAttribute('aria-valuenow', '30');

		getThumbInput().focus();
		await user.keyboard('{ArrowRight}');

		expect(onChange).toHaveBeenLastCalledWith(31);
		expect(getThumbInput()).toHaveAttribute('aria-valuenow', '31');
		expect(warn).not.toHaveBeenCalled();
	});

	it('follows a value that arrives after the first render, with one warning', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		const { rerender } = await renderSlider(
			<Slider color="primary" onChange={onChange} aria-label="Volume" />,
		);

		rerender(<Slider color="primary" value={70} onChange={onChange} aria-label="Volume" />);

		expect(getThumbInput()).toHaveAttribute('aria-valuenow', '70');
		expect(warn).toHaveBeenCalledTimes(1);
		expect(warn).toHaveBeenCalledWith(expect.stringContaining('Slider'));

		getThumbInput().focus();
		await user.keyboard('{ArrowRight}');

		expect(onChange).toHaveBeenLastCalledWith(71);
		expect(getThumbInput()).toHaveAttribute('aria-valuenow', '70');

		rerender(<Slider color="primary" value={20} onChange={onChange} aria-label="Volume" />);

		expect(getThumbInput()).toHaveAttribute('aria-valuenow', '20');
		expect(warn).toHaveBeenCalledTimes(1);
	});

	it('puts the thumb at min when a controlled value turns undefined, and stays controlled', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		const { rerender } = await renderSlider(
			<Slider color="primary" value={70} min={10} onChange={onChange} aria-label="Volume" />,
		);

		rerender(
			<Slider color="primary" value={undefined} min={10} onChange={onChange} aria-label="Volume" />,
		);

		expect(getThumbInput()).toHaveAttribute('aria-valuenow', '10');

		getThumbInput().focus();
		await user.keyboard('{ArrowRight}');

		expect(onChange).toHaveBeenLastCalledWith(11);
		expect(getThumbInput()).toHaveAttribute('aria-valuenow', '10');
		expect(warn).not.toHaveBeenCalled();
	});
});

describe('Slider.Range value rule', () => {
	it('starts at defaultValue and keeps its own state while value is undefined', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		await renderSlider(
			<Slider.Range
				color="primary"
				defaultValue={[20, 80]}
				onChange={onChange}
				aria-label="Duration"
			/>,
		);

		expect(getThumbInput(0)).toHaveAttribute('aria-valuenow', '20');
		expect(getThumbInput(1)).toHaveAttribute('aria-valuenow', '80');

		getThumbInput(0).focus();
		await user.keyboard('{ArrowRight}');

		expect(onChange).toHaveBeenLastCalledWith([21, 80]);
		expect(getThumbInput(0)).toHaveAttribute('aria-valuenow', '21');
		expect(warn).not.toHaveBeenCalled();
	});

	it('follows a value that arrives after the first render, with one warning', async () => {
		const onChange = vi.fn();
		const { rerender } = await renderSlider(
			<Slider.Range color="primary" onChange={onChange} aria-label="Duration" />,
		);

		rerender(
			<Slider.Range color="primary" value={[10, 90]} onChange={onChange} aria-label="Duration" />,
		);

		expect(getThumbInput(0)).toHaveAttribute('aria-valuenow', '10');
		expect(getThumbInput(1)).toHaveAttribute('aria-valuenow', '90');
		expect(warn).toHaveBeenCalledTimes(1);
		expect(warn).toHaveBeenCalledWith(expect.stringContaining('Slider.Range'));

		rerender(
			<Slider.Range color="primary" value={[30, 60]} onChange={onChange} aria-label="Duration" />,
		);

		expect(getThumbInput(0)).toHaveAttribute('aria-valuenow', '30');
		expect(getThumbInput(1)).toHaveAttribute('aria-valuenow', '60');
		expect(warn).toHaveBeenCalledTimes(1);
	});

	it('puts the thumbs at min and max when a controlled value turns undefined, and stays controlled', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		const { rerender } = await renderSlider(
			<Slider.Range color="primary" value={[30, 60]} onChange={onChange} aria-label="Duration" />,
		);

		rerender(
			<Slider.Range color="primary" value={undefined} onChange={onChange} aria-label="Duration" />,
		);

		expect(getThumbInput(0)).toHaveAttribute('aria-valuenow', '0');
		expect(getThumbInput(1)).toHaveAttribute('aria-valuenow', '100');

		getThumbInput(0).focus();
		await user.keyboard('{ArrowRight}');

		expect(onChange).toHaveBeenLastCalledWith([1, 100]);
		expect(getThumbInput(0)).toHaveAttribute('aria-valuenow', '0');
		expect(warn).not.toHaveBeenCalled();
	});
});
