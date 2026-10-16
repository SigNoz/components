import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Popover } from '../popover.js';

function renderHoverPopover(): ReturnType<typeof render> {
	return render(
		<Popover
			nativeButton
			openOnHover
			delay={0}
			side="top"
			align="center"
			testId="popover"
			trigger={<button type="button">Usage</button>}
		>
			<div>
				<p>Usage breakdown</p>
				<a href="https://example.com/docs">Open docs</a>
			</div>
		</Popover>,
	);
}

describe('Popover hover mode', () => {
	it('opens while the pointer rests on the trigger', async () => {
		const user = userEvent.setup();
		renderHoverPopover();

		await user.hover(screen.getByRole('button', { name: 'Usage' }));

		expect(await screen.findByRole('dialog')).toHaveTextContent('Usage breakdown');
	});

	it('stays interactive, so the pointer can reach a link inside it', async () => {
		const user = userEvent.setup();
		renderHoverPopover();
		await user.hover(screen.getByRole('button', { name: 'Usage' }));
		const popup = await screen.findByRole('dialog');

		// The whole point of a hover popover over a tooltip: the pointer can travel in.
		expect(getComputedStyle(popup).pointerEvents).not.toBe('none');
		expect(screen.getByRole('link', { name: 'Open docs' })).toBeVisible();
	});

	it('still opens on a press, which is the route a keyboard takes', async () => {
		const user = userEvent.setup();
		renderHoverPopover();

		await user.click(screen.getByRole('button', { name: 'Usage' }));

		expect(await screen.findByRole('dialog')).toBeInTheDocument();
	});

	it('closes again when the pointer leaves', async () => {
		const user = userEvent.setup();
		renderHoverPopover();
		const trigger = screen.getByRole('button', { name: 'Usage' });

		await user.hover(trigger);
		await screen.findByRole('dialog');

		await user.unhover(trigger);

		await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
	});

	it('does not open on hover without openOnHover', async () => {
		const user = userEvent.setup();
		render(
			<Popover
				nativeButton
				side="top"
				align="center"
				trigger={<button type="button">Click only</button>}
			>
				<p>Body</p>
			</Popover>,
		);

		await user.hover(screen.getByRole('button', { name: 'Click only' }));

		await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
	});
});
