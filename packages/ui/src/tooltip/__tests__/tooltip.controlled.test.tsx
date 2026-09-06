import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Tooltip } from '../presets/tooltip.js';
import { TooltipProvider } from '../subcomponents/tooltip-provider.js';

const TITLE = 'Helpful information';

describe('Tooltip open', () => {
	it('is open right away when open is true, without any hover', () => {
		render(
			<Tooltip open title={TITLE}>
				<button type="button">Hover</button>
			</Tooltip>,
		);

		expect(screen.getByRole('tooltip')).toHaveTextContent(TITLE);
	});

	it('stays closed on hover while open is false', async () => {
		const user = userEvent.setup();
		render(
			<Tooltip open={false} title={TITLE}>
				<button type="button">Hover</button>
			</Tooltip>,
		);

		await user.hover(screen.getByRole('button'));

		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
	});

	it('stays closed on focus while open is false', async () => {
		const user = userEvent.setup();
		render(
			<Tooltip open={false} title={TITLE}>
				<button type="button">Hover</button>
			</Tooltip>,
		);

		await user.tab();

		expect(screen.getByRole('button')).toHaveFocus();
		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
	});

	it('stays open when the pointer leaves', async () => {
		const user = userEvent.setup();
		render(
			<Tooltip open title={TITLE}>
				<button type="button">Hover</button>
			</Tooltip>,
		);
		const trigger = screen.getByRole('button');

		await user.hover(trigger);
		await user.unhover(trigger);

		expect(screen.getByRole('tooltip')).toBeInTheDocument();
	});

	it('follows the open prop', () => {
		const { rerender } = render(
			<Tooltip open={false} title={TITLE}>
				<button type="button">Hover</button>
			</Tooltip>,
		);
		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

		rerender(
			<Tooltip open title={TITLE}>
				<button type="button">Hover</button>
			</Tooltip>,
		);
		expect(screen.getByRole('tooltip')).toBeInTheDocument();

		rerender(
			<Tooltip open={false} title={TITLE}>
				<button type="button">Hover</button>
			</Tooltip>,
		);
		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
	});

	it('describes the trigger with the content', () => {
		render(
			<Tooltip open title={TITLE}>
				<button type="button">Hover</button>
			</Tooltip>,
		);

		const tooltip = screen.getByRole('tooltip');
		expect(screen.getByRole('button')).toHaveAttribute('aria-describedby', tooltip.id);
	});

	it('keeps the same trigger element as open flips', () => {
		const { rerender } = render(
			<Tooltip open={false} title={TITLE}>
				<button type="button">Hover</button>
			</Tooltip>,
		);
		const trigger = screen.getByRole('button');

		rerender(
			<Tooltip open title={TITLE}>
				<button type="button">Hover</button>
			</Tooltip>,
		);

		expect(screen.getByRole('button')).toBe(trigger);
	});

	// What a snapshot of every placement at once needs: Base UI closes the open tooltip of a
	// group as the next one opens, and one pointer can only sit on one trigger anyway.
	it('holds every tooltip of one provider open at the same time', () => {
		render(
			<TooltipProvider>
				<Tooltip open title="First">
					<button type="button">First</button>
				</Tooltip>
				<Tooltip open title="Second">
					<button type="button">Second</button>
				</Tooltip>
			</TooltipProvider>,
		);

		expect(screen.getAllByRole('tooltip')).toHaveLength(2);
	});
});
