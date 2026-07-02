import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { DropdownMenuSimple } from './index.js';

const menu = { items: [{ key: '1', label: 'Action 1' }] };

describe('DropdownMenuSimple disabled', () => {
	it('does not open when disabled', async () => {
		const user = userEvent.setup();
		render(
			<DropdownMenuSimple disabled menu={menu}>
				<button type="button">Open</button>
			</DropdownMenuSimple>
		);
		await user.click(screen.getByRole('button', { name: 'Open' }));
		expect(screen.queryByText('Action 1')).not.toBeInTheDocument();
	});

	it('marks the trigger aria-disabled without natively disabling it (keeps hover/tooltip alive)', () => {
		render(
			<DropdownMenuSimple disabled menu={menu}>
				<button type="button">Open</button>
			</DropdownMenuSimple>
		);
		const trigger = screen.getByRole('button', { name: 'Open' });
		expect(trigger).toHaveAttribute('aria-disabled', 'true');
		expect(trigger).not.toBeDisabled();
	});

	it('opens normally when not disabled', async () => {
		const user = userEvent.setup();
		render(
			<DropdownMenuSimple menu={menu}>
				<button type="button">Open</button>
			</DropdownMenuSimple>
		);
		await user.click(screen.getByRole('button', { name: 'Open' }));
		expect(await screen.findByText('Action 1')).toBeInTheDocument();
	});
});
