import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Popover } from '../popover.js';
import { openPopover, renderPopover } from './popover.test-utils.js';

describe('Popover focus', () => {
	it('moves focus to the first tabbable element on open', async () => {
		renderPopover(
			{},
			<div>
				<input aria-label="Name" />
				<button type="button">Save</button>
			</div>,
		);
		await openPopover();

		await waitFor(() => expect(screen.getByRole('textbox', { name: 'Name' })).toHaveFocus());
	});

	it('leaves focus on the trigger with initialFocus={false}', async () => {
		renderPopover({ initialFocus: false }, <input aria-label="Name" />);
		await openPopover();

		expect(screen.getByRole('textbox', { name: 'Name' })).not.toHaveFocus();
		expect(screen.getByRole('button', { name: 'Open' })).toHaveFocus();
	});

	it('pins the initial focus to a ref', async () => {
		const second = createRef<HTMLInputElement>();
		renderPopover(
			{ initialFocus: second },
			<div>
				<input aria-label="First" />
				<input aria-label="Second" ref={second} />
			</div>,
		);
		await openPopover();

		await waitFor(() => expect(screen.getByRole('textbox', { name: 'Second' })).toHaveFocus());
	});

	it('returns focus to a finalFocus ref on close', async () => {
		const user = userEvent.setup();
		const landing = createRef<HTMLButtonElement>();
		render(
			<>
				<button type="button" ref={landing}>
					Landing
				</button>
				<Popover
					nativeButton
					side="bottom"
					align="start"
					trigger={<button type="button">Open</button>}
					finalFocus={landing}
				>
					<p>Body</p>
				</Popover>
			</>,
		);
		await openPopover();

		await user.keyboard('{Escape}');

		await waitFor(() => expect(screen.getByRole('button', { name: 'Landing' })).toHaveFocus());
	});
});
