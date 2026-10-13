import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ForceOpenProvider } from '../../testing/index.js';
import { Popover } from '../popover.js';

function positionerZIndex(): string {
	const positioner = screen.getByRole('dialog').closest('[data-slot="popover-positioner"]');

	return getComputedStyle(positioner as Element).zIndex;
}

function renderInLayer(layer?: { position: string; zIndex: number }) {
	const popover = (
		<Popover nativeButton side="bottom" align="start" trigger={<button type="button">Open</button>}>
			<p>Body</p>
		</Popover>
	);

	return render(layer ? <div style={layer}>{popover}</div> : popover, {
		wrapper: ForceOpenProvider,
	});
}

describe('Popover layer', () => {
	it('keeps the default z-index for a trigger outside any layer', () => {
		renderInLayer();

		expect(positionerZIndex()).toBe('50');
	});

	it('stacks just above the layer of a trigger inside a fixed overlay', () => {
		renderInLayer({ position: 'fixed', zIndex: 1000 });

		expect(positionerZIndex()).toBe('1001');
	});

	it('never goes below --popover-z-index', () => {
		renderInLayer({ position: 'relative', zIndex: 10 });

		expect(positionerZIndex()).toBe('50');
	});
});
