import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ForceOpenProvider } from '../../testing/index.js';
import { Tooltip } from '../presets/tooltip.js';

async function positionerZIndex(): Promise<string> {
	const positioner = (await screen.findByRole('tooltip')).closest(
		'[data-slot="tooltip-positioner"]',
	);

	return getComputedStyle(positioner as Element).zIndex;
}

describe('Tooltip layer', () => {
	it('keeps the default z-index for a trigger outside any layer', async () => {
		render(
			<Tooltip title="Page">
				<button type="button">Hover</button>
			</Tooltip>,
			{ wrapper: ForceOpenProvider },
		);

		expect(await positionerZIndex()).toBe('50');
	});

	it('stacks just above the layer of a trigger inside a fixed overlay', async () => {
		render(
			<div style={{ position: 'fixed', zIndex: 1000 }}>
				<div style={{ position: 'relative', zIndex: 5 }}>
					<Tooltip title="Drawer">
						<button type="button">Hover</button>
					</Tooltip>
				</div>
			</div>,
			{ wrapper: ForceOpenProvider },
		);

		expect(await positionerZIndex()).toBe('1001');
	});

	it('never goes below --tooltip-z-index', async () => {
		render(
			<div style={{ position: 'relative', zIndex: 10 }}>
				<Tooltip title="Sticky header">
					<button type="button">Hover</button>
				</Tooltip>
			</div>,
			{ wrapper: ForceOpenProvider },
		);

		expect(await positionerZIndex()).toBe('50');
	});

	it('stays under an overlay that covers a trigger outside it', async () => {
		render(
			<>
				<Tooltip title="Behind">
					<button type="button">Hover</button>
				</Tooltip>
				<div style={{ position: 'fixed', inset: 0, zIndex: 1000 }} />
			</>,
			{ wrapper: ForceOpenProvider },
		);

		expect(Number(await positionerZIndex())).toBeLessThan(1000);
	});
});
