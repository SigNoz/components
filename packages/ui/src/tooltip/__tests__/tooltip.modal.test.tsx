import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Drawer, DrawerContent, DrawerTitle } from '../../drawer/index.js';
import { Tooltip } from '../presets/tooltip.js';
import { TooltipProvider } from '../subcomponents/tooltip-provider.js';

const TITLE = 'Copy me';

function drawerPanel(): HTMLElement {
	return document.querySelector('[data-slot="drawer-content"]') as HTMLElement;
}

describe('Tooltip inside a modal', () => {
	// A modal drawer sets `pointer-events: none` on the body and traps focus in its panel, so
	// the popup goes into the panel. Outside it the pointer would fall through, and the tooltip
	// would close before the text can be selected.
	it('portals into the drawer and stays hoverable', async () => {
		const user = userEvent.setup();
		render(
			<Drawer open>
				{/* Focus would open the tooltip too, and keep it open whatever the pointer does. */}
				<DrawerContent onOpenAutoFocus={(event) => event.preventDefault()}>
					<DrawerTitle>Settings</DrawerTitle>
					<Tooltip title={TITLE}>
						<button type="button">Hover</button>
					</Tooltip>
				</DrawerContent>
			</Drawer>,
		);

		await user.hover(await screen.findByRole('button', { name: 'Hover' }));
		const popup = await screen.findByRole('tooltip');

		expect(getComputedStyle(document.body).pointerEvents).toBe('none');
		expect(drawerPanel().contains(popup)).toBe(true);

		// `user.hover` carries no coordinates, so the safe polygon Base UI keeps between the
		// trigger and the popup cannot be crossed with it. Hit-testing is what the pointer does.
		const { left, top, width, height } = popup.getBoundingClientRect();
		const hit = document.elementFromPoint(left + width / 2, top + height / 2);

		expect(popup.contains(hit)).toBe(true);
		expect(popup).toHaveTextContent(TITLE);
	});

	it('portals into the drawer when it is open from the first render', async () => {
		render(
			<Drawer open>
				<DrawerContent>
					<DrawerTitle>Settings</DrawerTitle>
					<Tooltip open title={TITLE}>
						<button type="button">Hover</button>
					</Tooltip>
				</DrawerContent>
			</Drawer>,
		);

		expect(drawerPanel().contains(await screen.findByRole('tooltip'))).toBe(true);
	});

	// The layer the popup goes into has no size, so a popup sized by what is left of its
	// containing block would wrap one word per line.
	it('lays the text out as wide as it would be outside the drawer', async () => {
		const title = 'A title long enough to wrap at every word';
		render(
			<>
				<Tooltip open title={title} testId="outside">
					<button type="button">Outside</button>
				</Tooltip>
				<Drawer open>
					<DrawerContent>
						<DrawerTitle>Settings</DrawerTitle>
						<Tooltip open title={title} testId="inside">
							<button type="button">Inside</button>
						</Tooltip>
					</DrawerContent>
				</Drawer>
			</>,
		);

		const inside = await screen.findByTestId('inside');
		const outside = document.querySelector('[data-testid="outside"]') as HTMLElement;

		expect(drawerPanel().contains(inside)).toBe(true);
		expect(inside.getBoundingClientRect().width).toBe(outside.getBoundingClientRect().width);
	});

	it('keeps the container of a provider above the drawer', async () => {
		const outside = document.createElement('div');
		document.body.append(outside);

		render(
			<TooltipProvider container={outside}>
				<Drawer open>
					<DrawerContent>
						<DrawerTitle>Settings</DrawerTitle>
						<Tooltip open title={TITLE}>
							<button type="button">Hover</button>
						</Tooltip>
					</DrawerContent>
				</Drawer>
			</TooltipProvider>,
		);

		// The drawer hides everything outside it from the accessibility tree, so no role query.
		await waitFor(() => expect(outside.querySelector('[role="tooltip"]')).not.toBeNull());
		outside.remove();
	});
});
