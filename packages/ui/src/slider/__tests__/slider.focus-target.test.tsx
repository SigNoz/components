import { screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Field } from '../../field/field.js';
import { SliderField } from '../presets/slider-field.js';
import { Slider } from '../slider.js';
import { getThumbInput, renderSlider } from './slider.test-utils.js';

describe('SliderField ref', () => {
	it('focuses the thumb', async () => {
		const ref = createRef<HTMLInputElement>();
		await renderSlider(<SliderField label="Sampling rate" color="primary" ref={ref} />);

		ref.current?.focus();

		expect(getThumbInput()).toHaveFocus();
	});
});

describe('SliderField.Range ref', () => {
	it('focuses the first thumb', async () => {
		const ref = createRef<HTMLInputElement>();
		await renderSlider(<SliderField.Range label="Duration" color="primary" ref={ref} />);

		ref.current?.focus();

		expect(getThumbInput(0)).toHaveFocus();
		expect(getThumbInput(1)).not.toHaveFocus();
	});
});

describe('Slider ref', () => {
	it('stays the root div, alone and inside a Field', async () => {
		const alone = createRef<HTMLDivElement>();
		const inside = createRef<HTMLDivElement>();
		await renderSlider(
			<>
				<Slider color="primary" aria-label="Alone" testId="alone" ref={alone} />
				<Field label="Inside">
					<Slider color="primary" testId="inside" ref={inside} />
				</Field>
			</>,
		);

		expect(alone.current).toBe(screen.getByTestId('alone'));
		expect(inside.current).toBe(screen.getByTestId('inside'));
		expect(inside.current).toBeInstanceOf(HTMLDivElement);
	});

	it('stays the root div of Slider.Range, alone and inside a Field.Group', async () => {
		const alone = createRef<HTMLDivElement>();
		const inside = createRef<HTMLDivElement>();
		await renderSlider(
			<>
				<Slider.Range color="primary" aria-label="Alone" testId="alone" ref={alone} />
				<Field.Group label="Inside">
					<Slider.Range color="primary" testId="inside" ref={inside} />
				</Field.Group>
			</>,
		);

		expect(alone.current).toBe(screen.getByTestId('alone'));
		expect(inside.current).toBe(screen.getByTestId('inside'));
	});
});
