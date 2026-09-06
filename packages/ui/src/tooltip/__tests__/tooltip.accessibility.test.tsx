import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Tooltip } from '../presets/tooltip.js';
import { TooltipContent } from '../subcomponents/tooltip-content.js';
import { TooltipRoot } from '../subcomponents/tooltip-root.js';
import { TooltipTrigger } from '../subcomponents/tooltip-trigger.js';

const TITLE = 'Helpful information';

describe('Tooltip accessibility', () => {
	it('exposes the content with role="tooltip"', () => {
		render(
			<Tooltip open title={TITLE}>
				<button type="button">Hover</button>
			</Tooltip>,
		);

		expect(screen.getByRole('tooltip')).toHaveTextContent(TITLE);
	});

	it('describes the trigger with the content, even before it opens', async () => {
		const user = userEvent.setup();
		render(
			<Tooltip title={TITLE}>
				<button type="button">Hover</button>
			</Tooltip>,
		);
		const trigger = screen.getByRole('button');
		const describedBy = trigger.getAttribute('aria-describedby');
		expect(describedBy).toBeTruthy();

		await user.hover(trigger);

		expect(await screen.findByRole('tooltip')).toHaveAttribute('id', describedBy);
	});

	it('uses the id the caller set for both the content and aria-describedby', async () => {
		const user = userEvent.setup();
		render(
			<Tooltip title={TITLE} id="own-id">
				<button type="button">Hover</button>
			</Tooltip>,
		);
		const trigger = screen.getByRole('button');
		expect(trigger).toHaveAttribute('aria-describedby', 'own-id');

		await user.hover(trigger);

		expect(await screen.findByRole('tooltip')).toHaveAttribute('id', 'own-id');
	});

	it('gives two tooltips two different ids', () => {
		render(
			<>
				<Tooltip title="One">
					<button type="button">One</button>
				</Tooltip>
				<Tooltip title="Two">
					<button type="button">Two</button>
				</Tooltip>
			</>,
		);

		const [one, two] = screen.getAllByRole('button');
		expect(one).toHaveAttribute('aria-describedby');
		expect(one?.getAttribute('aria-describedby')).not.toBe(two?.getAttribute('aria-describedby'));
	});

	it('describes the trigger through the root when the content sits inside it', () => {
		render(
			<TooltipRoot open>
				<TooltipTrigger>Hover</TooltipTrigger>
				<TooltipContent>{TITLE}</TooltipContent>
			</TooltipRoot>,
		);

		const tooltip = screen.getByRole('tooltip');
		expect(tooltip.id).toBeTruthy();
		expect(screen.getByRole('button')).toHaveAttribute('aria-describedby', tooltip.id);
	});

	it('keeps an id the caller set on the content inside a root', () => {
		render(
			<TooltipRoot open>
				<TooltipTrigger>Hover</TooltipTrigger>
				<TooltipContent id="own-id">{TITLE}</TooltipContent>
			</TooltipRoot>,
		);

		expect(screen.getByRole('tooltip')).toHaveAttribute('id', 'own-id');
	});

	it('lets a trigger point at nothing with contentId={null}', () => {
		render(
			<TooltipRoot open>
				<TooltipTrigger contentId={null}>Hover</TooltipTrigger>
				<TooltipContent>{TITLE}</TooltipContent>
			</TooltipRoot>,
		);

		expect(screen.getByRole('button')).not.toHaveAttribute('aria-describedby');
	});

	it('lets a trigger point at a content id of its own', () => {
		render(
			<TooltipRoot open>
				<TooltipTrigger contentId="elsewhere">Hover</TooltipTrigger>
				<TooltipContent>{TITLE}</TooltipContent>
			</TooltipRoot>,
		);

		expect(screen.getByRole('button')).toHaveAttribute('aria-describedby', 'elsewhere');
	});

	it('keeps the accessible name of the trigger', () => {
		render(
			<Tooltip open title={TITLE}>
				<button type="button" aria-label="Delete">
					<span aria-hidden="true">x</span>
				</button>
			</Tooltip>,
		);

		expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
	});
});
