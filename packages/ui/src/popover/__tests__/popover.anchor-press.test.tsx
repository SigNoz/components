import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Popover } from '../popover.js';
import { usePopoverHandle } from '../use-popover-handle.js';

/**
 * The element a handle was shown at is neither the trigger nor the popup, so Base UI reports a
 * press on it as a press outside. For the field a typeahead belongs to that is the surface the
 * popup is for, and dismissing there would close it on the very press that opened it.
 */
function Suggestions({ onOpenChange }: { onOpenChange?: () => void } = {}): JSX.Element {
	const suggestions = usePopoverHandle();

	return (
		<div>
			<input aria-label="Query" onFocus={(event) => suggestions.showAt(event.currentTarget)} />
			<button type="button">Elsewhere</button>
			<Popover
				nativeButton
				side="bottom"
				align="start"
				handle={suggestions}
				initialFocus={false}
				aria-label="Variables"
				onOpenChange={onOpenChange}
			>
				<p>service.name</p>
			</Popover>
		</div>
	);
}

describe('Popover anchored to something that is not its trigger', () => {
	it('stays open when the press that opened it lands on the anchor', async () => {
		const user = userEvent.setup();
		render(<Suggestions />);

		await user.click(screen.getByRole('textbox', { name: 'Query' }));

		expect(await screen.findByRole('dialog')).toBeVisible();
	});

	it('stays open while the caret moves inside the anchor', async () => {
		const user = userEvent.setup();
		render(<Suggestions />);
		const field = screen.getByRole('textbox', { name: 'Query' });

		await user.click(field);
		await screen.findByRole('dialog');
		await user.type(field, 'latency');

		expect(screen.getByRole('dialog')).toBeVisible();
		expect(field).toHaveFocus();
	});

	it('still closes on a press that is genuinely outside', async () => {
		const user = userEvent.setup();
		render(<Suggestions />);

		await user.click(screen.getByRole('textbox', { name: 'Query' }));
		await screen.findByRole('dialog');
		await user.click(screen.getByRole('button', { name: 'Elsewhere' }));

		await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
	});

	it('still closes on Escape', async () => {
		const user = userEvent.setup();
		render(<Suggestions />);

		await user.click(screen.getByRole('textbox', { name: 'Query' }));
		await screen.findByRole('dialog');
		await user.keyboard('{Escape}');

		await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
	});

	it('reports the cancelled dismissal, so a call site can still see it', async () => {
		const onOpenChange = vi.fn();
		const user = userEvent.setup();
		render(<Suggestions onOpenChange={onOpenChange} />);

		await user.click(screen.getByRole('textbox', { name: 'Query' }));
		await screen.findByRole('dialog');

		const cancelled = onOpenChange.mock.calls.find(([open]) => open === false);
		expect(cancelled?.[1].isCanceled).toBe(true);
	});
});
