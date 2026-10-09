import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { Slider } from '../slider.js';
import { getThumbInput, renderSlider } from './slider.test-utils.js';

describe('Slider accessibility', () => {
	it('is a native range input with its scale and value', async () => {
		await renderSlider(
			<Slider color="primary" defaultValue={30} min={10} max={90} aria-label="Volume" />,
		);

		const input = screen.getByRole('slider', { name: 'Volume' });
		expect(input).toHaveAttribute('min', '10');
		expect(input).toHaveAttribute('max', '90');
		expect(input).toHaveAttribute('aria-valuenow', '30');
		expect(input).toHaveAttribute('aria-valuetext', '30');
	});

	it('reads the value through formatValue', async () => {
		await renderSlider(
			<Slider
				color="primary"
				defaultValue={75}
				formatValue={() => '1,000 GB'}
				aria-label="Volume"
			/>,
		);

		expect(getThumbInput()).toHaveAttribute('aria-valuetext', '1,000 GB');
	});

	it('takes its name from aria-labelledby', async () => {
		await renderSlider(
			<>
				<span id="opacity-label">Fill opacity</span>
				<Slider
					color="primary"
					defaultValue={1}
					min={0}
					max={1}
					step={0.1}
					aria-labelledby="opacity-label"
				/>
			</>,
		);

		expect(screen.getByRole('slider', { name: 'Fill opacity' })).toBeInTheDocument();
	});

	it('forwards every other aria-* of a Slider to the thumb input', async () => {
		await renderSlider(
			<>
				<span id="hint">Applies to new panels</span>
				<Slider
					color="primary"
					defaultValue={1}
					aria-label="Volume"
					aria-describedby="hint"
					aria-invalid
					aria-errormessage="volume-error"
					testId="volume"
				/>
			</>,
		);
		const input = getThumbInput();

		expect(input).toHaveAccessibleDescription('Applies to new panels');
		expect(input).toHaveAttribute('aria-invalid', 'true');
		expect(input).toHaveAttribute('aria-errormessage', 'volume-error');
		expect(screen.getByTestId('volume')).not.toHaveAttribute('aria-invalid');
	});

	it('keeps its own value attributes over a caller value', async () => {
		await renderSlider(
			<Slider
				color="primary"
				defaultValue={30}
				aria-label="Volume"
				{...({ 'aria-valuenow': 99, 'aria-valuetext': 'stray', 'aria-readonly': true } as object)}
			/>,
		);

		expect(getThumbInput()).toHaveAttribute('aria-valuenow', '30');
		expect(getThumbInput()).toHaveAttribute('aria-valuetext', '30');
		expect(getThumbInput()).not.toHaveAttribute('aria-readonly');
	});

	it('names the group of a range, and its thumbs Minimum and Maximum', async () => {
		await renderSlider(
			<Slider.Range
				color="primary"
				defaultValue={[20, 80]}
				aria-label="Duration"
				aria-describedby="x"
			/>,
		);

		const group = screen.getByRole('group', { name: 'Duration' });
		expect(group).toHaveAttribute('aria-describedby', 'x');
		expect(screen.getByRole('slider', { name: 'Minimum' })).toHaveAttribute('aria-valuenow', '20');
		expect(screen.getByRole('slider', { name: 'Maximum' })).toHaveAttribute('aria-valuenow', '80');
	});

	it('hides the label row from screen readers, and makes no mark a tab stop', async () => {
		await renderSlider(
			<Slider
				color="primary"
				defaultValue={30}
				marks={{ 0: 'low', 100: 'high' }}
				aria-label="V"
				testId="v"
			/>,
		);

		const marks = screen.getByTestId('v').querySelector('[data-slot="slider-marks"]');
		expect(marks).toHaveAttribute('aria-hidden', 'true');
		expect(screen.queryByText('low', { ignore: '[aria-hidden] *' })).toBeNull();
		expect(screen.getByTestId('v').querySelectorAll('[tabindex]')).toHaveLength(0);
	});

	it('draws the focus ring on the thumb of the focused input', async () => {
		// The token stylesheet is not loaded in the tests, and the ring reads `--ring`.
		document.documentElement.style.setProperty('--ring', 'rgb(0, 0, 255)');
		await renderSlider(<Slider color="primary" defaultValue={30} aria-label="V" testId="v" />);

		await userEvent.tab();

		expect(getComputedStyle(screen.getByTestId('v-thumb-0')).outline).toBe(
			'rgb(0, 0, 255) solid 1px',
		);
		document.documentElement.style.removeProperty('--ring');
	});
});
