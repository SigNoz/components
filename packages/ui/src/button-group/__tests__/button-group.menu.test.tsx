import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ButtonGroup } from '../button-group.js';
import type { ButtonGroupItemType, ButtonGroupVariantColorType } from '../types.js';
import {
	BASE,
	MANY_ITEMS,
	noop,
	renderInFrame,
	TOKENS,
	visibleMembers,
} from './button-group.test-utils.js';

/**
 * Real layout: the last members have to collapse for the menu to hold them. Six members never fit
 * 300px, so the last of them are always in the menu.
 */
async function openMenu(
	items: ButtonGroupItemType[],
	group: ButtonGroupVariantColorType = BASE,
): Promise<HTMLElement> {
	const user = userEvent.setup();

	renderInFrame(<ButtonGroup {...group} size="md" items={items} testId="group" />, {
		size: 300,
		style: TOKENS,
	});

	await user.click(await screen.findByTestId('group-overflow'));

	return screen.findByRole('menu');
}

describe('ButtonGroup overflow menu rows', () => {
	it('shows a collapsed danger member as a danger row, and the others as plain rows', async () => {
		const items = MANY_ITEMS.map((item, index) =>
			index === 4
				? ({ ...item, variant: 'solid', color: 'danger' } as ButtonGroupItemType)
				: index === 5
					? ({ ...item, variant: 'solid', color: 'highlight-danger' } as ButtonGroupItemType)
					: item,
		);

		const menu = await openMenu(items);
		expect(visibleMembers().length).toBeLessThan(4);

		expect(within(menu).getByTestId('group-item-item-4')).toHaveAttribute('data-danger', 'true');
		expect(within(menu).getByTestId('group-item-item-5')).toHaveAttribute('data-danger', 'true');
		expect(within(menu).getByTestId('group-item-item-3')).not.toHaveAttribute('data-danger');
	});

	it('shows every row as a danger row in a danger group', async () => {
		const menu = await openMenu(MANY_ITEMS, { variant: 'solid', color: 'danger' });

		const rows = within(menu).getAllByRole('menuitem');
		expect(rows.length).toBeGreaterThan(0);

		for (const row of rows) {
			expect(row).toHaveAttribute('data-danger', 'true');
		}
	});

	it('shows no danger row for any other color', async () => {
		const items = MANY_ITEMS.map(
			(item) => ({ ...item, variant: 'solid', color: 'warning' }) as ButtonGroupItemType,
		);
		const menu = await openMenu(items);

		for (const row of within(menu).getAllByRole('menuitem')) {
			expect(row).not.toHaveAttribute('data-danger');
		}
	});

	it('keeps a danger member that fits out of the menu, as a member in its own pair', async () => {
		const items = MANY_ITEMS.map((item, index) =>
			index === 0 ? ({ ...item, variant: 'solid', color: 'danger' } as ButtonGroupItemType) : item,
		);

		const menu = await openMenu(items);

		expect(within(menu).queryByText('Option 0')).not.toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Option 0' })).toHaveAttribute(
			'data-color',
			'danger',
		);
	});

	it('names the row of an icon member after its aria-label', async () => {
		const menu = await openMenu([
			...MANY_ITEMS,
			{ value: 'refresh', icon: <svg />, 'aria-label': 'Refresh', onClick: noop },
		]);

		expect(within(menu).getByRole('menuitem', { name: 'Refresh' })).toHaveAttribute(
			'data-testid',
			'group-item-refresh',
		);
	});

	it('renders the row of a link member as the element it is given', async () => {
		const menu = await openMenu([
			...MANY_ITEMS,
			{ value: 'docs', label: 'Docs', render: <a href="/docs" /> },
		]);

		const row = within(menu).getByRole('menuitem', { name: 'Docs' });
		expect(row.tagName).toBe('A');
		expect(row).toHaveAttribute('href', '/docs');
	});

	it('runs the onClick of a collapsed member that sets its own pair, and closes the menu', async () => {
		const user = userEvent.setup();
		let clicked = 0;
		const items = MANY_ITEMS.map((item, index) =>
			index === 5
				? ({
						...item,
						variant: 'solid',
						color: 'danger',
						onClick: () => {
							clicked += 1;
						},
					} as ButtonGroupItemType)
				: item,
		);

		const menu = await openMenu(items);
		await user.click(within(menu).getByTestId('group-item-item-5'));

		expect(clicked).toBe(1);
		expect(screen.queryByRole('menu')).not.toBeInTheDocument();
	});
});

describe('ButtonGroup collapsed member', () => {
	it('stays out of the accessibility tree and the tab order', async () => {
		renderInFrame(<ButtonGroup {...BASE} items={MANY_ITEMS} testId="group" />, {
			size: 300,
			style: TOKENS,
		});
		await screen.findByTestId('group-overflow');

		const collapsed = document.querySelectorAll('[data-slot="button-group-item"][data-collapsed]');
		expect(collapsed.length).toBeGreaterThan(0);

		for (const member of collapsed) {
			expect(member).toHaveAttribute('aria-hidden', 'true');
			expect(member).toHaveAttribute('tabindex', '-1');
		}
	});

	it('paints its label from data-label, so the text is in the DOM once', async () => {
		renderInFrame(<ButtonGroup {...BASE} items={MANY_ITEMS} testId="group" />, {
			size: 300,
			style: TOKENS,
		});
		await screen.findByTestId('group-overflow');

		const painted = document.querySelector<HTMLElement>(
			'[data-collapsed] [data-slot="button-group-item-label"][data-label]',
		);

		expect(painted).not.toBeNull();
		expect(painted?.textContent).toBe('');
		expect(getComputedStyle(painted as HTMLElement, '::before').content).toBe(
			`"${painted?.dataset['label']}"`,
		);
	});
});
