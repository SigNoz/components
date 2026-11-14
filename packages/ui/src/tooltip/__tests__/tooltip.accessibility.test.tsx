import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ForceOpenProvider } from '../../testing/index.js';
import { Tooltip } from '../presets/tooltip.js';
import { TooltipAnchor } from '../subcomponents/tooltip-anchor.js';

const TITLE = 'Helpful information';

describe('Tooltip accessibility', () => {
	it('exposes the content with role="tooltip"', async () => {
		render(
			<Tooltip title={TITLE}>
				<button type="button">Hover</button>
			</Tooltip>,
			{ wrapper: ForceOpenProvider },
		);

		expect(await screen.findByRole('tooltip')).toHaveTextContent(TITLE);
	});

	it('describes the trigger with the content while it is open, and not before', async () => {
		const user = userEvent.setup();
		render(
			<Tooltip title={TITLE}>
				<button type="button">Hover</button>
			</Tooltip>,
		);
		const trigger = screen.getByRole('button');
		expect(trigger).not.toHaveAttribute('aria-describedby');

		await user.hover(trigger);

		const tooltip = await screen.findByRole('tooltip');
		expect(tooltip.id).toBeTruthy();
		expect(trigger).toHaveAttribute('aria-describedby', tooltip.id);
	});

	it('stops describing the trigger once the content is gone', async () => {
		const user = userEvent.setup();
		render(
			<Tooltip title={TITLE}>
				<button type="button">Hover</button>
			</Tooltip>,
		);
		const trigger = screen.getByRole('button');

		await user.hover(trigger);
		await screen.findByRole('tooltip');
		await user.unhover(trigger);

		await waitFor(() => expect(trigger).not.toHaveAttribute('aria-describedby'));
	});

	it('joins the description the trigger element brings with the content', async () => {
		const user = userEvent.setup();
		render(
			<>
				<p id="delete-hint">Removes it for everyone</p>
				<Tooltip title={TITLE}>
					<button type="button" aria-describedby="delete-hint">
						Delete
					</button>
				</Tooltip>
			</>,
		);
		const trigger = screen.getByRole('button');
		expect(trigger).toHaveAttribute('aria-describedby', 'delete-hint');

		await user.hover(trigger);

		const tooltip = await screen.findByRole('tooltip');
		expect(trigger).toHaveAttribute('aria-describedby', `${tooltip.id} delete-hint`);
		expect(trigger).toHaveAccessibleDescription(`${TITLE} Removes it for everyone`);
	});

	it('keeps the id the trigger element brings, and opens from it', async () => {
		const user = userEvent.setup();
		render(
			<Tooltip title={TITLE}>
				<button type="button" id="delete-button">
					Delete
				</button>
			</Tooltip>,
		);
		const trigger = screen.getByRole('button');

		await user.hover(trigger);

		expect(await screen.findByRole('tooltip')).toHaveTextContent(TITLE);
		expect(trigger).toHaveAttribute('id', 'delete-button');
		expect(trigger).toHaveAttribute('data-popup-open');
	});

	it('uses the id the caller set for both the content and aria-describedby', async () => {
		const user = userEvent.setup();
		render(
			<Tooltip title={TITLE} id="own-id">
				<button type="button">Hover</button>
			</Tooltip>,
		);
		const trigger = screen.getByRole('button');

		await user.hover(trigger);

		expect(await screen.findByRole('tooltip')).toHaveAttribute('id', 'own-id');
		expect(trigger).toHaveAttribute('aria-describedby', 'own-id');
	});

	it('gives two tooltips two different ids', async () => {
		render(
			<>
				<Tooltip title="One">
					<button type="button">One</button>
				</Tooltip>
				<Tooltip title="Two">
					<button type="button">Two</button>
				</Tooltip>
			</>,
			{ wrapper: ForceOpenProvider },
		);

		await waitFor(() => expect(screen.getAllByRole('tooltip')).toHaveLength(2));
		const [one, two] = screen.getAllByRole('tooltip');
		const [oneTrigger, twoTrigger] = screen.getAllByRole('button');
		expect(one?.id).not.toBe(two?.id);
		expect(oneTrigger).toHaveAttribute('aria-describedby', one?.id);
		expect(twoTrigger).toHaveAttribute('aria-describedby', two?.id);
	});

	it('describes the trigger through the anchor when the content is forced open', async () => {
		render(
			<TooltipAnchor open content={TITLE}>
				Hover
			</TooltipAnchor>,
		);

		const tooltip = await screen.findByRole('tooltip');
		expect(tooltip.id).toBeTruthy();
		expect(screen.getByRole('button')).toHaveAttribute('aria-describedby', tooltip.id);
	});

	it('keeps an id the caller set on the content of an anchor', async () => {
		render(
			<TooltipAnchor open content={TITLE} contentProps={{ id: 'own-id' }}>
				Hover
			</TooltipAnchor>,
		);

		expect(await screen.findByRole('tooltip')).toHaveAttribute('id', 'own-id');
		expect(screen.getByRole('button')).toHaveAttribute('aria-describedby', 'own-id');
	});

	it('lets a trigger point at nothing with aria-describedby={undefined}', async () => {
		render(
			<TooltipAnchor open content={TITLE} aria-describedby={undefined}>
				Hover
			</TooltipAnchor>,
		);

		await screen.findByRole('tooltip');
		expect(screen.getByRole('button')).not.toHaveAttribute('aria-describedby');
	});

	it('lets a trigger point at a description of its own', async () => {
		render(
			<TooltipAnchor open content={TITLE} aria-describedby="elsewhere">
				Hover
			</TooltipAnchor>,
		);

		await screen.findByRole('tooltip');
		expect(screen.getByRole('button')).toHaveAttribute('aria-describedby', 'elsewhere');
	});

	it('keeps the accessible name of the trigger', async () => {
		render(
			<Tooltip title={TITLE}>
				<button type="button" aria-label="Delete">
					<span aria-hidden="true">x</span>
				</button>
			</Tooltip>,
			{ wrapper: ForceOpenProvider },
		);

		await screen.findByRole('tooltip');
		expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
	});
});
