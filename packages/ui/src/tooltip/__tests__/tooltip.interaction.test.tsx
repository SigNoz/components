import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Tooltip } from '../presets/tooltip.js';
import { TooltipProvider } from '../subcomponents/tooltip-provider.js';

const TITLE = 'Helpful information';

describe('Tooltip pointer', () => {
	it('opens on hover', async () => {
		const user = userEvent.setup();
		render(
			<Tooltip title={TITLE}>
				<button type="button">Hover</button>
			</Tooltip>,
		);

		await user.hover(screen.getByRole('button'));

		expect(await screen.findByRole('tooltip')).toHaveTextContent(TITLE);
	});

	it('closes again when the pointer leaves', async () => {
		const user = userEvent.setup();
		render(
			<Tooltip title={TITLE}>
				<button type="button">Hover</button>
			</Tooltip>,
		);
		const trigger = screen.getByRole('button');

		await user.hover(trigger);
		expect(await screen.findByRole('tooltip')).toBeInTheDocument();

		await user.unhover(trigger);

		await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
	});

	it('puts nothing in the DOM before the first hover', () => {
		render(
			<Tooltip title={TITLE}>
				<button type="button">Hover</button>
			</Tooltip>,
		);

		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
		expect(document.querySelector('[data-slot="tooltip-content"]')).toBeNull();
	});

	it('closes on Escape', async () => {
		const user = userEvent.setup();
		render(
			<Tooltip title={TITLE}>
				<button type="button">Hover</button>
			</Tooltip>,
		);

		await user.hover(screen.getByRole('button'));
		expect(await screen.findByRole('tooltip')).toBeInTheDocument();

		await user.keyboard('{Escape}');

		await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
	});
});

describe('Tooltip keyboard', () => {
	it('opens on focus', async () => {
		const user = userEvent.setup();
		render(
			<Tooltip title={TITLE}>
				<button type="button">Hover</button>
			</Tooltip>,
		);

		await user.tab();

		expect(screen.getByRole('button')).toHaveFocus();
		expect(await screen.findByRole('tooltip')).toHaveTextContent(TITLE);
	});

	it('closes again on blur', async () => {
		const user = userEvent.setup();
		render(
			<>
				<Tooltip title={TITLE}>
					<button type="button">Hover</button>
				</Tooltip>
				<input data-testid="input" />
			</>,
		);

		await user.tab();
		expect(await screen.findByRole('tooltip')).toBeInTheDocument();

		await user.tab();

		expect(screen.getByTestId('input')).toHaveFocus();
		await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
	});

	it('does not steal focus from the trigger when it opens', async () => {
		const user = userEvent.setup();
		render(
			<Tooltip title={TITLE}>
				<button type="button">Hover</button>
			</Tooltip>,
		);

		await user.tab();
		await screen.findByRole('tooltip');

		expect(screen.getByRole('button')).toHaveFocus();
	});
});

describe('Tooltip delay', () => {
	// Real timers: Base UI schedules the open through its own timeout helpers, and
	// faking the clock leaves `user.hover` waiting forever. A slow machine can only
	// make the timer fire later, never earlier, so the early check cannot flake.
	it('waits 300ms on hover by default, so a passing pointer never opens it', async () => {
		const user = userEvent.setup();
		render(
			<Tooltip title={TITLE}>
				<button type="button">Hover</button>
			</Tooltip>,
		);

		await user.hover(screen.getByRole('button'));
		await new Promise((resolve) => setTimeout(resolve, 100));
		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

		expect(await screen.findByRole('tooltip')).toBeInTheDocument();
	});

	it('opens at once with delay={0}', async () => {
		const user = userEvent.setup();
		render(
			<TooltipProvider delay={0}>
				<Tooltip title={TITLE}>
					<button type="button">Hover</button>
				</Tooltip>
			</TooltipProvider>,
		);

		await user.hover(screen.getByRole('button'));

		expect(screen.getByRole('tooltip')).toBeInTheDocument();
	});
});
