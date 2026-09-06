import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Tooltip } from '../presets/tooltip.js';

function positioner(): Element | null {
	return screen.getByRole('tooltip').closest('[data-slot="tooltip-positioner"]');
}

describe('Tooltip positioning', () => {
	it('opens on top, centered, by default', () => {
		render(
			<Tooltip open title="Helpful information">
				<button type="button">Hover</button>
			</Tooltip>,
		);

		expect(positioner()).toHaveAttribute('data-side', 'top');
		expect(positioner()).toHaveAttribute('data-align', 'center');
	});

	it.each(['top', 'right', 'bottom', 'left'] as const)('opens against side="%s"', (side) => {
		render(
			<Tooltip open title="Helpful information" side={side}>
				<button type="button">Hover</button>
			</Tooltip>,
		);

		expect(positioner()).toHaveAttribute('data-side', side);
	});

	it.each(['start', 'center', 'end'] as const)('aligns to align="%s"', (align) => {
		render(
			<Tooltip open title="Helpful information" align={align}>
				<button type="button">Hover</button>
			</Tooltip>,
		);

		expect(positioner()).toHaveAttribute('data-align', align);
	});

	it('marks the positioner and the content as open', () => {
		render(
			<Tooltip open title="Helpful information">
				<button type="button">Hover</button>
			</Tooltip>,
		);

		expect(positioner()).toHaveAttribute('data-open');
		expect(screen.getByRole('tooltip')).toHaveAttribute('data-open');
	});
});
