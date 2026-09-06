import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from '../button.js';
import { ButtonColor, ButtonSize } from '../constants.js';
import type { VariantColorType } from '../types.js';

const VARIANTS = [
	{ variant: 'solid', color: 'primary' },
	{ variant: 'link', color: 'primary' },
	{ variant: 'outlined', color: 'secondary' },
	{ variant: 'ghost', color: 'secondary' },
	{ variant: 'dashed', color: 'secondary' },
] as const satisfies readonly VariantColorType[];

describe('Button style tokens', () => {
	it.each(VARIANTS)('exposes variant=$variant as data-variant', ({ variant, color }) => {
		render(
			// @ts-expect-error For some reason, it's complaining about disabled
			<Button size="md" variant={variant} color={color}>
				Label
			</Button>,
		);

		expect(screen.getByRole('button')).toHaveAttribute('data-variant', variant);
	});

	it.each(Object.values(ButtonSize))('exposes size=%s as data-size', (size) => {
		render(
			<Button size={size} variant="solid" color="primary">
				Label
			</Button>,
		);

		expect(screen.getByRole('button')).toHaveAttribute('data-size', size);
	});

	it.each(Object.values(ButtonColor))('exposes color=%s as data-color', (color) => {
		render(
			<Button size="md" variant="solid" color={color}>
				Label
			</Button>,
		);

		expect(screen.getByRole('button')).toHaveAttribute('data-color', color);
	});

	it('marks a non-icon button with data-icon="false"', () => {
		render(
			<Button size="md" variant="solid" color="primary">
				Label
			</Button>,
		);

		expect(screen.getByRole('button')).toHaveAttribute('data-icon', 'false');
	});
});

describe('Button dashed border', () => {
	it('draws the dashes as an svg overlay, so they can be animated', () => {
		const { container } = render(
			<Button variant="dashed" size="md" color="secondary">
				Add step
			</Button>,
		);

		const overlay = container.querySelector('[data-slot="button-dashed-border"]');
		expect(overlay?.tagName).toBe('svg');
		expect(overlay?.querySelector('rect')).toBeInTheDocument();
	});

	it('keeps the overlay out of the accessibility tree and out of the tab order', () => {
		const { container } = render(
			<Button variant="dashed" size="md" color="secondary">
				Add step
			</Button>,
		);

		const overlay = container.querySelector('[data-slot="button-dashed-border"]');
		expect(overlay).toHaveAttribute('aria-hidden', 'true');
		expect(overlay).toHaveAttribute('focusable', 'false');
		expect(screen.getByRole('button')).toHaveAccessibleName('Add step');
	});

	it.each(VARIANTS.filter(({ variant }) => variant !== 'dashed'))(
		'leaves variant=$variant without an overlay',
		({ variant, color }) => {
			const { container } = render(
				// @ts-expect-error For some reason, it's complaining about disabled
				<Button variant={variant} size="md" color={color}>
					Label
				</Button>,
			);

			expect(container.querySelector('[data-slot="button-dashed-border"]')).toBeNull();
		},
	);
});
