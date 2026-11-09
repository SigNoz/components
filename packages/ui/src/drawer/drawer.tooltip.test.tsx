import { render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { ForceOpenProvider } from '../testing/index.js';
import { Tooltip } from '../tooltip/presets/tooltip.js';
import { Drawer, DrawerContent, DrawerTitle } from './index.js';

// A tooltip portalled into `document.body` lands next to the drawer portal, outside the
// drawer's stacking context, and the drawer covers it whenever its z-index wins. Inside the
// drawer element it stacks with the drawer and stays visible.
describe('Drawer with a tooltip inside', () => {
	it('portals a nested tooltip into the drawer content', () => {
		render(
			<Drawer open>
				<DrawerContent aria-describedby={undefined}>
					<DrawerTitle>Title</DrawerTitle>
					<Tooltip title="Helpful information">
						<button type="button">Hover</button>
					</Tooltip>
				</DrawerContent>
			</Drawer>,
			{ wrapper: ForceOpenProvider },
		);

		expect(screen.getByRole('dialog')).toContainElement(screen.getByRole('tooltip'));
	});

	it('portals a nested tooltip into the drawer content when handed it as container', () => {
		function Content() {
			const [panel, setPanel] = useState<HTMLDivElement | null>(null);

			return (
				<DrawerContent ref={setPanel} aria-describedby={undefined}>
					<DrawerTitle>Title</DrawerTitle>
					<Tooltip container={panel} title="Helpful information">
						<button type="button">Hover</button>
					</Tooltip>
				</DrawerContent>
			);
		}

		render(
			<Drawer open>
				<Content />
			</Drawer>,
			{ wrapper: ForceOpenProvider },
		);

		expect(screen.getByRole('dialog')).toContainElement(screen.getByRole('tooltip'));
	});
});
