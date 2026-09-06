import { render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { Tooltip } from '../tooltip/presets/tooltip.js';
import { Dialog, DialogContent, DialogTitle } from './index.js';

// A tooltip portalled into `document.body` lands next to the dialog portal, outside the
// dialog's stacking context, and the dialog covers it whenever its z-index wins. Inside the
// dialog element it stacks with the dialog and stays visible.
describe('Dialog with a tooltip inside', () => {
	// TODO: fix in the dialog rework. `DialogContent` should hand nested tooltips its own
	// element as the portal container (a `TooltipProvider container={...}` around `children`),
	// so a consumer never has to pass `container` by hand.
	it.fails('portals a nested tooltip into the dialog content', () => {
		render(
			<Dialog open>
				<DialogContent aria-describedby={undefined}>
					<DialogTitle>Title</DialogTitle>
					<Tooltip open title="Helpful information">
						<button type="button">Hover</button>
					</Tooltip>
				</DialogContent>
			</Dialog>,
		);

		expect(screen.getByRole('dialog')).toContainElement(screen.getByRole('tooltip'));
	});

	it('portals a nested tooltip into the dialog content when handed it as container', () => {
		function Content() {
			const [panel, setPanel] = useState<HTMLDivElement | null>(null);

			return (
				<DialogContent ref={setPanel} aria-describedby={undefined}>
					<DialogTitle>Title</DialogTitle>
					<Tooltip open container={panel} title="Helpful information">
						<button type="button">Hover</button>
					</Tooltip>
				</DialogContent>
			);
		}

		render(
			<Dialog open>
				<Content />
			</Dialog>,
		);

		expect(screen.getByRole('dialog')).toContainElement(screen.getByRole('tooltip'));
	});
});
