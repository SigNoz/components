import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ForceOpenProvider } from '../../testing/index.js';
import { Tooltip } from '../presets/tooltip.js';
import { TooltipProvider } from '../subcomponents/tooltip-provider.js';

const TITLE = 'Helpful information';

describe('Tooltip under ForceOpenProvider', () => {
	it('opens without any hover', async () => {
		render(
			<Tooltip title={TITLE}>
				<button type="button">Hover</button>
			</Tooltip>,
			{ wrapper: ForceOpenProvider },
		);

		expect(await screen.findByRole('tooltip')).toHaveTextContent(TITLE);
	});

	it('stays open when the pointer leaves', async () => {
		const user = userEvent.setup();
		render(
			<Tooltip title={TITLE}>
				<button type="button">Hover</button>
			</Tooltip>,
			{ wrapper: ForceOpenProvider },
		);
		const trigger = screen.getByRole('button');
		await screen.findByRole('tooltip');

		await user.hover(trigger);
		await user.unhover(trigger);

		expect(screen.getByRole('tooltip')).toBeInTheDocument();
	});

	it('describes the trigger with the content', async () => {
		render(
			<Tooltip title={TITLE}>
				<button type="button">Hover</button>
			</Tooltip>,
			{ wrapper: ForceOpenProvider },
		);

		const tooltip = await screen.findByRole('tooltip');
		expect(screen.getByRole('button')).toHaveAttribute('aria-describedby', tooltip.id);
	});

	// What a snapshot of every placement at once needs: Base UI closes the open tooltip of a
	// group as the next one opens, and one pointer can only sit on one trigger anyway.
	it('holds every tooltip of one provider open at the same time', async () => {
		render(
			<TooltipProvider>
				<Tooltip title="First">
					<button type="button">First</button>
				</Tooltip>
				<Tooltip title="Second">
					<button type="button">Second</button>
				</Tooltip>
			</TooltipProvider>,
			{ wrapper: ForceOpenProvider },
		);

		await waitFor(() => expect(screen.getAllByRole('tooltip')).toHaveLength(2));
	});

	it('leaves a tooltip outside the provider to hover and focus', async () => {
		render(
			<>
				<ForceOpenProvider>
					<Tooltip title="Held">
						<button type="button">Held</button>
					</Tooltip>
				</ForceOpenProvider>
				<Tooltip title="Free">
					<button type="button">Free</button>
				</Tooltip>
			</>,
		);

		expect(await screen.findByRole('tooltip')).toHaveTextContent('Held');
		expect(screen.getAllByRole('tooltip')).toHaveLength(1);
	});
});
