import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Popover } from '../popover.js';
import { openPopover, renderPopover } from './popover.test-utils.js';

describe('Popover positioning', () => {
	it('renders the side and align it was given as data attributes', async () => {
		// Room above and left of the trigger, so neither value is flipped away by the viewport edge.
		render(
			<div style={{ paddingBlockStart: 200, paddingInlineStart: 300 }}>
				<Popover nativeButton side="top" align="end" trigger={<button type="button">Open</button>}>
					<p>Body</p>
				</Popover>
			</div>,
		);
		const popup = await openPopover();

		expect(popup).toHaveAttribute('data-side', 'top');
		expect(popup).toHaveAttribute('data-align', 'end');
	});

	it('flips to the opposite side when the viewport leaves no room', async () => {
		renderPopover({ side: 'top', align: 'start' });
		const popup = await openPopover();

		expect(popup).toHaveAttribute('data-side', 'bottom');
	});

	it('positions against a virtual anchor while the trigger stays required', async () => {
		render(
			<Popover
				nativeButton
				side="bottom"
				align="start"
				open
				trigger={<button type="button">Open</button>}
				anchor={{
					getBoundingClientRect: () => DOMRect.fromRect({ x: 120, y: 80, width: 0, height: 0 }),
				}}
			>
				<p>Drilldown</p>
			</Popover>,
		);

		expect(await screen.findByRole('dialog')).toHaveTextContent('Drilldown');
		expect(document.querySelector('[data-slot="popover-trigger"]')).not.toBeNull();
	});

	it('positions against another element passed as anchor while the trigger stays the opener', async () => {
		const anchor = document.createElement('div');
		document.body.appendChild(anchor);
		renderPopover({ anchor });

		const popup = await openPopover();

		expect(popup).toBeInTheDocument();
		anchor.remove();
	});
});
