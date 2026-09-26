import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { queryOpenTooltip } from '../../__tests__/test-utils.js';
import { Dropdown } from '../index.js';
import type { DropdownItemType } from '../types.js';
import { openDropdown } from './dropdown.test-utils.js';

const ITEMS: DropdownItemType[] = [{ type: 'item', value: 'rename', label: 'Rename' }];

function DisabledDropdown({
	disabled,
	onOpenChange,
}: {
	disabled: boolean;
	onOpenChange?: (open: boolean) => void;
}) {
	return (
		<Dropdown
			nativeButton
			side="bottom"
			align="start"
			items={ITEMS}
			testId="menu"
			disabled={disabled}
			disabledTooltip="No edit access"
			onOpenChange={onOpenChange}
		>
			<button type="button">Actions</button>
		</Dropdown>
	);
}

describe('Dropdown disabled', () => {
	it('keeps the menu closed and marks the trigger without the native attribute', async () => {
		const onOpenChange = vi.fn();
		render(<DisabledDropdown disabled onOpenChange={onOpenChange} />);

		const trigger = screen.getByTestId('menu');
		expect(trigger).toHaveAttribute('aria-disabled', 'true');
		expect(trigger).toHaveAttribute('data-disabled');
		expect(trigger).not.toBeDisabled();

		await userEvent.click(trigger);
		trigger.focus();
		await userEvent.keyboard('{Enter}');

		expect(screen.queryByRole('menu')).toBeNull();
		expect(onOpenChange).not.toHaveBeenCalled();
	});

	it('shows the reason on the trigger', async () => {
		render(<DisabledDropdown disabled />);

		await userEvent.hover(screen.getByTestId('menu'));

		await waitFor(() => {
			expect(queryOpenTooltip()).toHaveTextContent('No edit access');
		});
	});

	it('shows no reason and opens normally while enabled', async () => {
		render(<DisabledDropdown disabled={false} />);

		const trigger = screen.getByTestId('menu');
		expect(trigger).not.toHaveAttribute('aria-disabled');

		await userEvent.hover(trigger);
		expect(queryOpenTooltip()).toBeNull();

		const menu = await openDropdown();
		// Neither prop reaches the popup through the rest spread.
		expect(menu).not.toHaveAttribute('disabled');
		expect(menu).not.toHaveAttribute('disabledtooltip');
	});

	it('closes an open menu when it turns disabled', async () => {
		const { rerender } = render(<DisabledDropdown disabled={false} />);
		await openDropdown();

		rerender(<DisabledDropdown disabled />);

		await waitFor(() => {
			expect(screen.queryByRole('menu')).toBeNull();
		});
	});
});
