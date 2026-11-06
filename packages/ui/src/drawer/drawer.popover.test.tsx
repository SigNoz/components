import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Popover } from '../popover/index.js';
import { ForceOpenProvider } from '../testing/index.js';
import { Tooltip } from '../tooltip/presets/tooltip.js';
import { Drawer, DrawerContent, DrawerTitle } from './index.js';

function zIndexOf(element: Element): number {
	return Number.parseInt(getComputedStyle(element).zIndex, 10);
}

// A popup portalled into `document.body` lands next to the drawer portal, outside the drawer's
// stacking context and outside its focus trap: the drawer covers it whenever its z-index wins,
// and pulls the focus straight back out of it. Inside the drawer element it stacks and traps
// with the drawer.
describe('Drawer with a popover inside', () => {
	function DrawerWithPopover({ children }: { children: React.ReactNode }): JSX.Element {
		return (
			<Drawer open>
				<DrawerContent aria-describedby={undefined}>
					<DrawerTitle>Title</DrawerTitle>
					<Popover
						nativeButton
						side="bottom"
						align="start"
						aria-label="Actions"
						trigger={<button type="button">Open</button>}
					>
						{children}
					</Popover>
				</DrawerContent>
			</Drawer>
		);
	}

	it('portals a nested popover into the drawer content', () => {
		render(<DrawerWithPopover>Body</DrawerWithPopover>, { wrapper: ForceOpenProvider });

		expect(screen.getByRole('dialog', { name: 'Title' })).toContainElement(
			screen.getByRole('dialog', { name: 'Actions' }),
		);
	});

	it('portals a tooltip opened inside that popover into the drawer content too', async () => {
		const user = userEvent.setup();
		render(
			<DrawerWithPopover>
				<Tooltip title="Copies the span id">
					<button type="button">Copy</button>
				</Tooltip>
			</DrawerWithPopover>,
		);

		await user.click(screen.getByRole('button', { name: 'Open' }));
		await user.hover(await screen.findByRole('button', { name: 'Copy' }));

		expect(screen.getByRole('dialog', { name: 'Title' })).toContainElement(
			await screen.findByRole('tooltip'),
		);
	});

	// Inside the panel every popup reads the panel as its layer, so the popover and the tooltip
	// both sit at one above it. Which of the two paints on top is then DOM order, and the
	// container keeps the popups in the order they opened.
	it('stacks the popover above the drawer, and paints the tooltip over the popover', async () => {
		const user = userEvent.setup();
		render(
			<DrawerWithPopover>
				<Tooltip title="Copies the span id">
					<button type="button">Copy</button>
				</Tooltip>
			</DrawerWithPopover>,
		);

		await user.click(screen.getByRole('button', { name: 'Open' }));
		await user.hover(await screen.findByRole('button', { name: 'Copy' }));
		await screen.findByRole('tooltip');

		const panel = screen.getByRole('dialog', { name: 'Title' });
		const popover = screen
			.getByRole('dialog', { name: 'Actions' })
			.closest('[data-slot="popover-positioner"]') as Element;
		const tooltip = screen
			.getByRole('tooltip')
			.closest('[data-slot="tooltip-positioner"]') as Element;

		expect(zIndexOf(popover)).toBeGreaterThan(zIndexOf(panel));
		expect(zIndexOf(tooltip)).toBeGreaterThanOrEqual(zIndexOf(popover));
		expect(popover.compareDocumentPosition(tooltip)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
	});
});
