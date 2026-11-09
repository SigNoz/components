import { render, screen } from '@testing-library/react';
import type * as React from 'react';
import { describe, expect, it } from 'vitest';
import { ForceOpenProvider } from '../../testing/index.js';
import { Tooltip } from '../presets/tooltip.js';

/**
 * The popup is placed once the positioning library has measured it, and it flips to the other
 * side when the requested one has no room. The trigger sits in the middle of the viewport so every
 * side has room, which makes the requested placement the one that is kept.
 */
function Centered({ children }: { children: React.ReactNode }): React.ReactElement {
	return <div style={{ position: 'fixed', top: '50%', left: '50%' }}>{children}</div>;
}

async function positioner(): Promise<Element | null> {
	return (await screen.findByRole('tooltip')).closest('[data-slot="tooltip-positioner"]');
}

describe('Tooltip positioning', () => {
	it('opens on top, centered, by default', async () => {
		render(
			<Centered>
				<Tooltip title="Helpful information">
					<button type="button">Hover</button>
				</Tooltip>
			</Centered>,
			{ wrapper: ForceOpenProvider },
		);

		const placed = await positioner();

		expect(placed).toHaveAttribute('data-side', 'top');
		expect(placed).toHaveAttribute('data-align', 'center');
	});

	it.each(['top', 'right', 'bottom', 'left'] as const)('opens against side="%s"', async (side) => {
		render(
			<Centered>
				<Tooltip title="Helpful information" side={side}>
					<button type="button">Hover</button>
				</Tooltip>
			</Centered>,
			{ wrapper: ForceOpenProvider },
		);

		expect(await positioner()).toHaveAttribute('data-side', side);
	});

	it.each(['start', 'center', 'end'] as const)('aligns to align="%s"', async (align) => {
		render(
			<Centered>
				<Tooltip title="Helpful information" align={align}>
					<button type="button">Hover</button>
				</Tooltip>
			</Centered>,
			{ wrapper: ForceOpenProvider },
		);

		expect(await positioner()).toHaveAttribute('data-align', align);
	});

	it('marks the positioner and the content as open', async () => {
		render(
			<Centered>
				<Tooltip title="Helpful information">
					<button type="button">Hover</button>
				</Tooltip>
			</Centered>,
			{ wrapper: ForceOpenProvider },
		);

		expect(await positioner()).toHaveAttribute('data-open');
		expect(screen.getByRole('tooltip')).toHaveAttribute('data-open');
	});
});
