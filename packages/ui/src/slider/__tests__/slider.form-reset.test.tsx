import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Slider } from '../slider.js';
import { getThumbInput, renderSlider } from './slider.test-utils.js';

function submitted(): Array<[string, FormDataEntryValue]> {
	return [...new FormData(screen.getByTestId('form') as HTMLFormElement).entries()];
}

describe('Slider form reset', () => {
	it('brings an uncontrolled slider back to defaultValue, without onChange', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		await renderSlider(
			<form data-testid="form">
				<Slider
					color="primary"
					aria-label="Volume"
					name="volume"
					defaultValue={30}
					onChange={onChange}
				/>
				<button type="reset">Reset</button>
			</form>,
		);

		getThumbInput().focus();
		await user.keyboard('{ArrowRight}{ArrowRight}');

		expect(getThumbInput()).toHaveAttribute('aria-valuenow', '32');
		expect(submitted()).toEqual([['volume', '32']]);

		onChange.mockClear();
		await user.click(screen.getByRole('button', { name: 'Reset' }));

		await waitFor(() => {
			expect(getThumbInput()).toHaveAttribute('aria-valuenow', '30');
		});
		expect(submitted()).toEqual([['volume', '30']]);
		expect(onChange).not.toHaveBeenCalled();
	});

	it('brings a slider with no defaultValue back to min', async () => {
		const user = userEvent.setup();
		await renderSlider(
			<form data-testid="form">
				<Slider color="primary" aria-label="Volume" name="volume" min={10} max={50} />
				<button type="reset">Reset</button>
			</form>,
		);

		getThumbInput().focus();
		await user.keyboard('{ArrowRight}');

		expect(getThumbInput()).toHaveAttribute('aria-valuenow', '11');

		await user.click(screen.getByRole('button', { name: 'Reset' }));

		await waitFor(() => {
			expect(getThumbInput()).toHaveAttribute('aria-valuenow', '10');
		});
		expect(submitted()).toEqual([['volume', '10']]);
	});

	it('brings both thumbs of a range back to defaultValue, without onChange', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		await renderSlider(
			<form data-testid="form">
				<Slider.Range
					color="primary"
					aria-label="Duration"
					name="duration"
					defaultValue={[20, 80]}
					onChange={onChange}
				/>
				<button type="reset">Reset</button>
			</form>,
		);

		getThumbInput(0).focus();
		await user.keyboard('{ArrowRight}');
		getThumbInput(1).focus();
		await user.keyboard('{ArrowLeft}{ArrowLeft}');

		expect(getThumbInput(0)).toHaveAttribute('aria-valuenow', '21');
		expect(getThumbInput(1)).toHaveAttribute('aria-valuenow', '78');
		expect(submitted()).toEqual([
			['duration', '21'],
			['duration', '78'],
		]);

		onChange.mockClear();
		await user.click(screen.getByRole('button', { name: 'Reset' }));

		await waitFor(() => {
			expect(getThumbInput(0)).toHaveAttribute('aria-valuenow', '20');
		});
		expect(getThumbInput(1)).toHaveAttribute('aria-valuenow', '80');
		expect(submitted()).toEqual([
			['duration', '20'],
			['duration', '80'],
		]);
		expect(onChange).not.toHaveBeenCalled();
	});

	it('resets a slider rendered outside the form through form', async () => {
		const user = userEvent.setup();
		await renderSlider(
			<>
				<form data-testid="form" id="settings">
					<button type="reset">Reset</button>
				</form>
				<Slider
					color="primary"
					aria-label="Volume"
					name="volume"
					form="settings"
					defaultValue={30}
				/>
			</>,
		);

		getThumbInput().focus();
		await user.keyboard('{ArrowRight}');

		expect(submitted()).toEqual([['volume', '31']]);

		await user.click(screen.getByRole('button', { name: 'Reset' }));

		await waitFor(() => {
			expect(getThumbInput()).toHaveAttribute('aria-valuenow', '30');
		});
		expect(submitted()).toEqual([['volume', '30']]);
	});

	it('keeps a controlled value, which the form onReset owns', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		await renderSlider(
			<form data-testid="form">
				<Slider color="primary" aria-label="Volume" name="volume" value={30} onChange={onChange} />
				<button type="reset">Reset</button>
			</form>,
		);

		getThumbInput().focus();
		await user.keyboard('{ArrowRight}');

		expect(onChange).toHaveBeenLastCalledWith(31);

		onChange.mockClear();
		await user.click(screen.getByRole('button', { name: 'Reset' }));
		await new Promise((resolve) => setTimeout(resolve));

		expect(getThumbInput()).toHaveAttribute('aria-valuenow', '30');
		expect(onChange).not.toHaveBeenCalled();
	});

	it('keeps the value when the form cancels the reset', async () => {
		const user = userEvent.setup();
		await renderSlider(
			<form data-testid="form" onReset={(event) => event.preventDefault()}>
				<Slider color="primary" aria-label="Volume" name="volume" defaultValue={30} />
				<button type="reset">Reset</button>
			</form>,
		);

		getThumbInput().focus();
		await user.keyboard('{ArrowRight}');
		await user.click(screen.getByRole('button', { name: 'Reset' }));
		await new Promise((resolve) => setTimeout(resolve));

		expect(getThumbInput()).toHaveAttribute('aria-valuenow', '31');
		expect(submitted()).toEqual([['volume', '31']]);
	});
});
