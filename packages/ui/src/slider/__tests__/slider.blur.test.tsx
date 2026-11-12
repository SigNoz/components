import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SliderField } from '../presets/slider-field.js';
import { Slider } from '../slider.js';
import { getThumbInput, renderSlider } from './slider.test-utils.js';

describe('Slider onBlur', () => {
	it('is called once when the focus leaves the slider', async () => {
		const user = userEvent.setup();
		const onBlur = vi.fn();
		await renderSlider(
			<>
				<Slider color="primary" defaultValue={50} aria-label="Volume" onBlur={onBlur} />
				<button type="button">Next</button>
			</>,
		);

		await user.tab();

		expect(getThumbInput()).toHaveFocus();
		expect(onBlur).not.toHaveBeenCalled();

		await user.tab();

		expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus();
		expect(onBlur).toHaveBeenCalledTimes(1);
	});

	it('is accepted by SliderField', async () => {
		const user = userEvent.setup();
		const onBlur = vi.fn();
		await renderSlider(
			<>
				<SliderField label="Volume" color="primary" defaultValue={50} onBlur={onBlur} />
				<button type="button">Next</button>
			</>,
		);

		await user.tab();
		await user.tab();

		expect(onBlur).toHaveBeenCalledTimes(1);
	});
});

describe('Slider.Range onBlur', () => {
	it('is called once when the focus leaves the range, and not while it moves between the thumbs', async () => {
		const user = userEvent.setup();
		const onBlur = vi.fn();
		await renderSlider(
			<>
				<Slider.Range
					color="primary"
					defaultValue={[20, 80]}
					aria-label="Duration"
					onBlur={onBlur}
				/>
				<button type="button">Next</button>
			</>,
		);

		await user.tab();
		await user.tab();

		expect(getThumbInput(1)).toHaveFocus();
		expect(onBlur).not.toHaveBeenCalled();

		await user.tab();

		expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus();
		expect(onBlur).toHaveBeenCalledTimes(1);
	});

	it('is accepted by SliderField.Range', async () => {
		const user = userEvent.setup();
		const onBlur = vi.fn();
		await renderSlider(
			<>
				<SliderField.Range
					label="Duration"
					color="primary"
					defaultValue={[20, 80]}
					onBlur={onBlur}
				/>
				<button type="button">Next</button>
			</>,
		);

		await user.tab();
		await user.tab();
		await user.tab();

		expect(onBlur).toHaveBeenCalledTimes(1);
	});
});
