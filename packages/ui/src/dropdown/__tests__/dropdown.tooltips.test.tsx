import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { queryOpenTooltip } from '../../__tests__/test-utils.js';
import { Button } from '../../button/index.js';
import { Dropdown } from '../index.js';
import type { DropdownItemType } from '../types.js';
import { openDropdown } from './dropdown.test-utils.js';

const LONG_LABEL = 'Rename this dashboard and every panel that points at it, across every folder';

function renderDropdown(items: DropdownItemType[], contentMaxWidth?: number) {
	return render(
		<Dropdown
			nativeButton
			side="bottom"
			align="start"
			items={items}
			testId="menu"
			contentMaxWidth={contentMaxWidth}
		>
			<button type="button">Actions</button>
		</Dropdown>,
	);
}

describe('Dropdown tooltips', () => {
	it('marks a label that does not fit and shows it in full', async () => {
		renderDropdown([{ type: 'item', value: 'rename', label: LONG_LABEL }], 200);
		await openDropdown();

		const row = screen.getByTestId('menu-item-rename');
		const label = row.querySelector('[data-slot="dropdown-item-label"]');

		await waitFor(() => {
			expect(label).toHaveAttribute('data-truncated', 'true');
		});

		await userEvent.hover(row);

		await waitFor(() => {
			expect(queryOpenTooltip()).toHaveTextContent(LONG_LABEL);
		});
	});

	it('leaves a label that fits unmarked and opens no tooltip', async () => {
		renderDropdown([{ type: 'item', value: 'rename', label: 'Rename' }]);
		await openDropdown();

		const row = screen.getByTestId('menu-item-rename');
		await userEvent.hover(row);

		expect(row.querySelector('[data-slot="dropdown-item-label"]')).not.toHaveAttribute(
			'data-truncated',
		);
		expect(queryOpenTooltip()).toBeNull();
	});

	it('shows why a row is disabled', async () => {
		renderDropdown([
			{
				type: 'item',
				value: 'rename',
				label: 'Rename',
				disabled: true,
				disabledTooltip: 'Ask an admin',
			},
		]);
		await openDropdown();

		await userEvent.hover(screen.getByTestId('menu-item-rename'));

		await waitFor(() => {
			expect(queryOpenTooltip()).toHaveTextContent('Ask an admin');
		});
	});

	it('shows the loading reason instead of the disabled one', async () => {
		renderDropdown([
			{
				type: 'item',
				value: 'rename',
				label: 'Rename',
				disabled: true,
				disabledTooltip: 'Ask an admin',
				loading: true,
				loadingTooltip: 'Saving your changes',
			},
		]);
		await openDropdown();

		await userEvent.hover(screen.getByTestId('menu-item-rename'));

		await waitFor(() => {
			expect(queryOpenTooltip()).toHaveTextContent('Saving your changes');
		});
		expect(queryOpenTooltip()).not.toHaveTextContent('Ask an admin');
	});

	it('stacks the reason above the full label, reason first', async () => {
		renderDropdown(
			[
				{
					type: 'item',
					value: 'rename',
					label: LONG_LABEL,
					disabled: true,
					disabledTooltip: 'Ask an admin',
				},
			],
			200,
		);
		await openDropdown();

		await userEvent.hover(screen.getByTestId('menu-item-rename'));

		await waitFor(() => {
			expect(document.querySelector('[data-slot="tooltip-stack"]')).not.toBeNull();
		});
		expect(queryOpenTooltip()?.textContent?.indexOf('Ask an admin')).toBe(0);
	});

	it('shows the reason on a disabled checkbox row too', async () => {
		renderDropdown([
			{
				type: 'checkbox',
				name: 'pinned',
				label: 'Pinned',
				disabled: true,
				disabledTooltip: 'Pinning is off for this workspace',
			},
		]);
		await openDropdown();

		await userEvent.hover(screen.getByTestId('menu-item-pinned'));

		await waitFor(() => {
			expect(queryOpenTooltip()).toHaveTextContent('Pinning is off for this workspace');
		});
	});
	it('shows the reason of a disabled radio group on its options', async () => {
		renderDropdown([
			{
				type: 'radio-group',
				name: 'sort',
				disabled: true,
				disabledTooltip: 'Upgrade to change sort',
				items: [{ label: 'By name', value: 'name' }],
			},
		]);
		await openDropdown();

		await userEvent.hover(screen.getByRole('menuitemradio', { name: 'By name' }));

		await waitFor(() => {
			expect(queryOpenTooltip()).toHaveTextContent('Upgrade to change sort');
		});
	});

	it('opens for a button in the label that has a reason of its own', async () => {
		renderDropdown([
			{
				type: 'item',
				value: 'rename',
				label: (
					<Button size="md" variant="ghost" color="secondary" loading loadingTooltip="Checking">
						Rename
					</Button>
				),
			},
		]);
		await openDropdown();

		await userEvent.hover(screen.getByTestId('menu-item-rename'));

		await waitFor(() => {
			expect(queryOpenTooltip()).toHaveTextContent('Checking');
		});
	});
});
