import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Pill } from '../pill.js';
import { PillColor, PillVariant } from '../constants.js';

const COLORS = Object.values(PillColor);
const VARIANTS = Object.values(PillVariant);

describe('Pill style tokens', () => {
	it.each(VARIANTS)('exposes variant=%s as data-variant', (variant) => {
		render(
			<Pill variant={variant} color="primary">
				Label
			</Pill>,
		);

		expect(screen.getByRole('button')).toHaveAttribute('data-variant', variant);
	});

	it.each(COLORS)('exposes color=%s as data-color', (color) => {
		render(
			<Pill variant="outlined" color={color}>
				Label
			</Pill>,
		);

		expect(screen.getByRole('button')).toHaveAttribute('data-color', color);
	});

	it('mirrors the default textOverflow as data-text-overflow="ellipsis"', () => {
		render(
			<Pill variant="outlined" color="primary">
				Label
			</Pill>,
		);

		expect(screen.getByRole('button')).toHaveAttribute('data-text-overflow', 'ellipsis');
	});

	it.each(['hidden', 'visible'] as const)('mirrors textOverflow="%s"', (textOverflow) => {
		render(
			<Pill variant="outlined" color="primary" textOverflow={textOverflow}>
				Label
			</Pill>,
		);

		expect(screen.getByRole('button')).toHaveAttribute('data-text-overflow', textOverflow);
	});
});
