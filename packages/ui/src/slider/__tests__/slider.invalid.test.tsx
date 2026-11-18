import { render, screen } from '@testing-library/react';
import type { CSSProperties, ReactElement } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Field } from '../../field/field.js';
import { SliderField } from '../presets/slider-field.js';
import { Slider } from '../slider.js';
import { renderSlider } from './slider.test-utils.js';

const DESTRUCTIVE = 'rgb(255, 0, 0)';
const INDICATOR = 'rgb(1, 2, 3)';

let tokens: HTMLStyleElement;

// The tokens live in `@signozhq/design-tokens` and are not loaded here, so each colour is declared:
// one per slot, so a computed colour says which rule painted it.
beforeEach(() => {
	tokens = document.createElement('style');
	tokens.textContent = `:root {
		--destructive: ${DESTRUCTIVE};
		--slider-primary-indicator: ${INDICATOR};
	}`;
	document.head.append(tokens);
});

afterEach(() => {
	tokens.remove();
});

function thumbs(): HTMLElement[] {
	return Array.from(document.querySelectorAll<HTMLElement>('[data-slot="slider-thumb"]'));
}

function borderOf(element: HTMLElement): string {
	return getComputedStyle(element).borderTopColor;
}

describe('Slider in a Field with an error', () => {
	it('paints the border of the thumb with the destructive color for an error, and for no other status', async () => {
		function field(status: 'danger' | 'warning' | 'success' | undefined): ReactElement {
			const rest =
				status === 'danger'
					? { error: 'Too high' }
					: status === undefined
						? {}
						: { status, message: 'Something to say' };

			return (
				<div style={{ width: 300 }}>
					<Field label="Sampling" {...rest}>
						<Slider color="primary" defaultValue={40} />
					</Field>
				</div>
			);
		}

		const { rerender } = render(field('danger'));
		await screen.findAllByRole('slider');

		expect(thumbs().map(borderOf)).toEqual([DESTRUCTIVE]);

		for (const status of [undefined, 'warning', 'success'] as const) {
			rerender(field(status));

			expect(thumbs().map(borderOf)).toEqual([INDICATOR]);
		}

		rerender(field('danger'));

		expect(thumbs().map(borderOf)).toEqual([DESTRUCTIVE]);
	});

	it('keeps the fill of the bar, which the thumb border alone replaces', async () => {
		await renderSlider(
			<Field label="Sampling" error="Too high">
				<Slider color="primary" defaultValue={40} testId="rate" />
			</Field>,
		);

		expect(thumbs().map(borderOf)).toEqual([DESTRUCTIVE]);
		expect(getComputedStyle(screen.getByTestId('rate-indicator')).backgroundColor).toBe(INDICATOR);
	});

	it('paints both thumbs of a range', async () => {
		await renderSlider(
			<Field label="Duration" error="Too wide">
				<Slider.Range color="primary" defaultValue={[20, 60]} />
			</Field>,
		);

		expect(thumbs().map(borderOf)).toEqual([DESTRUCTIVE, DESTRUCTIVE]);
	});

	it('takes --slider-thumb-invalid-border-color over the destructive color', async () => {
		await renderSlider(
			<div style={{ '--slider-thumb-invalid-border-color': 'rgb(7, 8, 9)' } as CSSProperties}>
				<Field label="Sampling" error="Too high">
					<Slider color="primary" defaultValue={40} />
				</Field>
			</div>,
		);

		expect(thumbs().map(borderOf)).toEqual(['rgb(7, 8, 9)']);
	});

	it('paints the thumb of a SliderField with an error, and not without one', async () => {
		const { rerender } = await renderSlider(
			<SliderField color="primary" label="Sampling" error="Too high" defaultValue={40} />,
		);

		expect(thumbs().map(borderOf)).toEqual([DESTRUCTIVE]);

		rerender(<SliderField color="primary" label="Sampling" defaultValue={40} />);

		expect(thumbs().map(borderOf)).toEqual([INDICATOR]);
	});
});

describe('Slider.Range in a Field.Group with an error', () => {
	it('paints both thumbs, which the group marks aria-invalid, and not without an error', async () => {
		const { rerender } = await renderSlider(
			<Field.Group label="Duration" error="Too wide">
				<Slider.Range color="primary" defaultValue={[20, 60]} />
			</Field.Group>,
		);

		expect(thumbs().map(borderOf)).toEqual([DESTRUCTIVE, DESTRUCTIVE]);

		rerender(
			<Field.Group label="Duration">
				<Slider.Range color="primary" defaultValue={[20, 60]} />
			</Field.Group>,
		);

		expect(thumbs().map(borderOf)).toEqual([INDICATOR, INDICATOR]);
	});

	it('keeps the thumbs alone when an aria-invalid of its own says the range is valid', async () => {
		await renderSlider(
			<Field.Group label="Duration" error="Too wide">
				<Slider.Range color="primary" defaultValue={[20, 60]} testId="painted" />
				<Slider.Range color="primary" defaultValue={[20, 60]} aria-invalid="false" testId="valid" />
			</Field.Group>,
		);

		const [first, second] = ['painted', 'valid'].map((testId) =>
			Array.from(
				screen.getByTestId(testId).querySelectorAll<HTMLElement>('[data-slot="slider-thumb"]'),
			).map(borderOf),
		);

		expect(first).toEqual([DESTRUCTIVE, DESTRUCTIVE]);
		expect(second).toEqual([INDICATOR, INDICATOR]);
	});
});

describe('Slider with an aria-invalid of its own', () => {
	it('paints the thumb outside any field', async () => {
		await renderSlider(<Slider color="primary" aria-label="Sampling" aria-invalid />);

		expect(thumbs().map(borderOf)).toEqual([DESTRUCTIVE]);
	});
});
