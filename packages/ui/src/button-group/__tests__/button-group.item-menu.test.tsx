import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { queryOpenTooltip } from '../../__tests__/test-utils.js';
import type { DropdownSubmenuChildType } from '../../dropdown/types.js';
import { ButtonGroup } from '../button-group.js';
import type { ButtonGroupItemType } from '../types.js';
import {
	BASE,
	MANY_ITEMS,
	noop,
	renderInFrame,
	TOKENS,
	visibleMembers,
} from './button-group.test-utils.js';

const GROUP_REASON = 'This dashboard is locked';
const ITEM_REASON = 'You cannot pick a section here';
const GROUP_BUSY = 'Saving the dashboard';
const ITEM_BUSY = 'Loading the sections';

function rows(onClick: () => void = noop): DropdownSubmenuChildType[] {
	return [
		{ type: 'item', value: 'overview', label: 'Overview', onClick },
		{ type: 'item', value: 'latency', label: 'Latency', onClick },
	];
}

/** The member that opens the menu, an icon member the way a split button draws it. */
function menuMember(
	menu: Partial<NonNullable<ButtonGroupItemType['menu']>> = {},
	extra: Partial<ButtonGroupItemType> = {},
): ButtonGroupItemType {
	return {
		value: 'section',
		icon: <svg />,
		'aria-label': 'Choose section',
		menu: { side: 'bottom', align: 'end', items: rows(), ...menu },
		...extra,
	} as ButtonGroupItemType;
}

function renderSplit(items: ButtonGroupItemType[] = [menuMember()]): void {
	render(<ButtonGroup {...BASE} items={items} testId="group" />);
}

function trigger(): HTMLElement {
	return screen.getByRole('button', { name: 'Choose section' });
}

function expectMenuClosed(): void {
	expect(screen.queryByRole('menu')).not.toBeInTheDocument();
	expect(trigger()).toHaveAttribute('aria-expanded', 'false');
}

describe('ButtonGroup item menu', () => {
	it('opens its rows when the member is clicked, and runs the row that is picked', async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();
		renderSplit([menuMember({ items: rows(onClick) })]);

		await user.click(trigger());

		const menu = await screen.findByRole('menu');
		expect(
			within(menu)
				.getAllByRole('menuitem')
				.map((row) => row.textContent),
		).toEqual(['Overview', 'Latency']);

		await user.click(within(menu).getByRole('menuitem', { name: 'Latency' }));

		expect(onClick).toHaveBeenCalledOnce();
		await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
	});

	it('opens from the keyboard, and hands focus back to the member when it closes', async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();
		renderSplit([menuMember({ items: rows(onClick) })]);

		await user.tab();
		expect(trigger()).toHaveFocus();
		await user.keyboard('{Enter}');

		const menu = await screen.findByRole('menu');
		await user.keyboard('{ArrowDown}{Enter}');

		expect(onClick).toHaveBeenCalledOnce();
		await waitFor(() => expect(menu).not.toBeInTheDocument());
		expect(trigger()).toHaveFocus();
	});

	it('opens with the space bar, and closes with Escape', async () => {
		const user = userEvent.setup();
		renderSplit();

		await user.tab();
		await user.keyboard(' ');
		await screen.findByRole('menu');

		await user.keyboard('{Escape}');

		await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
		expect(trigger()).toHaveFocus();
	});

	it('announces the popup and follows the open state on aria-expanded', async () => {
		const user = userEvent.setup();
		renderSplit();

		expect(trigger()).toHaveAttribute('aria-haspopup', 'menu');
		expect(trigger()).toHaveAttribute('aria-expanded', 'false');

		await user.click(trigger());
		await screen.findByRole('menu');
		expect(trigger()).toHaveAttribute('aria-expanded', 'true');

		await user.keyboard('{Escape}');
		await waitFor(() => expect(trigger()).toHaveAttribute('aria-expanded', 'false'));
	});

	it('leaves a member without a menu out of the popup semantics', () => {
		renderSplit([...MANY_ITEMS.slice(0, 1), menuMember()]);

		expect(screen.getByRole('button', { name: 'Option 0' })).not.toHaveAttribute('aria-haspopup');
	});

	it('is a member of the group: its pair, its position and the name testId gives it', () => {
		renderSplit([{ value: 'add', label: 'Add panel', onClick: noop }, menuMember()]);

		const member = screen.getByTestId('group-item-section');

		expect(member).toBe(trigger());
		expect(member).toHaveAttribute('data-slot', 'button-group-item');
		expect(member).toHaveAttribute('data-variant', 'outlined');
		expect(member).toHaveAttribute('data-position', 'end');
		expect(member).toHaveAttribute('data-join-start', 'shared');
		expect(screen.getByRole('button', { name: 'Add panel' })).toHaveAttribute(
			'data-join-end',
			'shared',
		);
	});

	it('takes the testId of its own over the one the group names it with', () => {
		renderSplit([menuMember({}, { testId: 'section-picker' })]);

		expect(screen.getByTestId('section-picker')).toBe(trigger());
		expect(screen.queryByTestId('group-item-section')).not.toBeInTheDocument();
	});

	it('opens from a member that has a text label too', async () => {
		const user = userEvent.setup();
		renderSplit([
			{
				value: 'section',
				label: 'Sections',
				menu: { side: 'bottom', align: 'start', items: rows() },
			},
		]);

		await user.click(screen.getByRole('button', { name: 'Sections' }));

		expect(await screen.findByRole('menuitem', { name: 'Overview' })).toBeInTheDocument();
	});

	it('writes the size caps on the popup', async () => {
		const user = userEvent.setup();
		renderSplit([menuMember({ contentMaxWidth: 360, contentMaxHeight: '20rem' })]);

		await user.click(trigger());

		const menu = await screen.findByRole('menu');
		expect(menu.style.getPropertyValue('--dropdown-internal-max-inline-size')).toBe('360px');
		expect(menu.style.getPropertyValue('--dropdown-internal-max-block-size')).toBe('20rem');
	});

	it('lets a sibling action member stay usable while the menu is open', async () => {
		const user = userEvent.setup();
		const add = vi.fn();
		renderSplit([{ value: 'add', label: 'Add panel', onClick: add }, menuMember()]);

		await user.click(screen.getByRole('button', { name: 'Add panel' }));

		expect(add).toHaveBeenCalledOnce();
		expect(screen.queryByRole('menu')).not.toBeInTheDocument();
	});

	it('blocks only the member that is disabled, not the menu member next to it', async () => {
		const user = userEvent.setup();
		const add = vi.fn();
		renderSplit([
			{
				value: 'add',
				label: 'Add panel',
				onClick: add,
				disabled: true,
				disabledTooltip: ITEM_REASON,
			},
			menuMember(),
		]);

		await user.click(screen.getByRole('button', { name: 'Add panel' }));
		expect(add).not.toHaveBeenCalled();

		await user.click(trigger());
		expect(await screen.findByRole('menu')).toBeInTheDocument();
	});

	it('opens again once the member is enabled', async () => {
		const user = userEvent.setup();
		const blocked = menuMember({}, { disabled: true, disabledTooltip: ITEM_REASON });
		const { rerender } = render(<ButtonGroup {...BASE} items={[blocked]} testId="group" />);

		await user.click(trigger());
		expectMenuClosed();

		rerender(<ButtonGroup {...BASE} items={[menuMember()]} testId="group" />);
		await user.click(trigger());

		expect(await screen.findByRole('menu')).toBeInTheDocument();
	});

	it('closes an open menu when the group turns loading', async () => {
		const user = userEvent.setup();
		const items = [menuMember()];
		const { rerender } = render(<ButtonGroup {...BASE} items={items} testId="group" />);

		await user.click(trigger());
		await screen.findByRole('menu');

		rerender(<ButtonGroup {...BASE} loading items={items} testId="group" />);

		await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
	});
});

describe('ButtonGroup item menu while blocked', () => {
	// The menu only refuses to open. The member keeps its own tooltip, so the reason shows once, on
	// the member, and the menu adds no second one.
	const BLOCKED: Array<[string, ReactElement, string]> = [
		[
			'the item is disabled',
			<ButtonGroup
				key="item-disabled"
				{...BASE}
				items={[menuMember({}, { disabled: true, disabledTooltip: ITEM_REASON })]}
				testId="group"
			/>,
			ITEM_REASON,
		],
		[
			'the group is disabled',
			<ButtonGroup
				key="group-disabled"
				{...BASE}
				disabled
				disabledTooltip={GROUP_REASON}
				items={[menuMember()]}
				testId="group"
			/>,
			GROUP_REASON,
		],
		[
			'the item is loading',
			<ButtonGroup
				key="item-loading"
				{...BASE}
				items={[menuMember({}, { loading: true, loadingTooltip: ITEM_BUSY })]}
				testId="group"
			/>,
			ITEM_BUSY,
		],
		[
			'the group is loading',
			<ButtonGroup
				key="group-loading"
				{...BASE}
				loading
				loadingTooltip={GROUP_BUSY}
				items={[menuMember()]}
				testId="group"
			/>,
			GROUP_BUSY,
		],
	];

	it.each(BLOCKED)('does not open on click while %s', async (_name, ui) => {
		const user = userEvent.setup();
		render(ui);

		await user.click(trigger());

		expectMenuClosed();
		expect(trigger()).toHaveAttribute('aria-disabled', 'true');
	});

	it.each(BLOCKED)('does not open from the keyboard while %s', async (_name, ui) => {
		const user = userEvent.setup();
		render(ui);

		await user.tab();
		expect(trigger()).toHaveFocus();
		await user.keyboard('{Enter}');
		await user.keyboard(' ');
		await user.keyboard('{ArrowDown}');

		expectMenuClosed();
	});

	it.each(BLOCKED)('still shows the reason on hover while %s', async (_name, ui, reason) => {
		const user = userEvent.setup();
		render(ui);

		await user.hover(trigger());

		await waitFor(() => expect(queryOpenTooltip()).toHaveTextContent(reason));
		expect(document.querySelectorAll('[data-slot="tooltip-content"][data-open]')).toHaveLength(1);
		expectMenuClosed();
	});

	it.each(BLOCKED)('still shows the reason on focus while %s', async (_name, ui, reason) => {
		const user = userEvent.setup();
		render(ui);

		await user.tab();

		await waitFor(() => expect(queryOpenTooltip()).toHaveTextContent(reason));
		expect(document.querySelectorAll('[data-slot="tooltip-content"][data-open]')).toHaveLength(1);
	});

	it('shows the group reason above the item reason, as any member does', async () => {
		const user = userEvent.setup();
		render(
			<ButtonGroup
				{...BASE}
				disabled
				disabledTooltip={GROUP_REASON}
				items={[menuMember({}, { disabled: true, disabledTooltip: ITEM_REASON })]}
				testId="group"
			/>,
		);

		await user.hover(trigger());

		await waitFor(() =>
			expect(queryOpenTooltip()?.textContent).toBe(`${GROUP_REASON}${ITEM_REASON}`),
		);
	});

	it('shows no tooltip for a menu member that is not blocked', async () => {
		const user = userEvent.setup();
		renderSplit();

		await user.hover(trigger());
		await user.unhover(trigger());

		expect(queryOpenTooltip()).toBeNull();
	});
});

describe('ButtonGroup item menu in the overflow menu', () => {
	/** Six members that never fit 300px, then the menu member, so it is always collapsed. */
	function renderCollapsed(
		menu: Partial<NonNullable<ButtonGroupItemType['menu']>> = {},
		extra: Partial<ButtonGroupItemType> = {},
	): void {
		renderInFrame(
			<ButtonGroup {...BASE} items={[...MANY_ITEMS, menuMember(menu, extra)]} testId="group" />,
			{ size: 300, style: TOKENS },
		);
	}

	async function openOverflow(user: ReturnType<typeof userEvent.setup>): Promise<HTMLElement> {
		await user.click(await screen.findByTestId('group-overflow'));

		return screen.findByRole('menu');
	}

	it('becomes a submenu row of the overflow menu, named after the member', async () => {
		const user = userEvent.setup();
		renderCollapsed();

		const menu = await openOverflow(user);

		const row = within(menu).getByRole('menuitem', { name: 'Choose section' });
		expect(row).toHaveAttribute('aria-haspopup', 'menu');
		expect(row).toHaveAttribute('data-testid', 'group-item-section');
		expect(visibleMembers().length).toBeLessThan(MANY_ITEMS.length);
	});

	it('opens the rows of the menu from that submenu row', async () => {
		const user = userEvent.setup();
		renderCollapsed();

		const menu = await openOverflow(user);
		await user.click(within(menu).getByTestId('group-item-section'));

		expect(await screen.findByRole('menuitem', { name: 'Latency' })).toBeInTheDocument();
		expect(screen.getByRole('menuitem', { name: 'Overview' })).toBeInTheDocument();
	});

	it('runs the row that is picked in that submenu, from the keyboard', async () => {
		// By keyboard because Base UI blocks pointer events on a submenu while the pointer leaves its
		// trigger row, and user-event then drops the click. Any Dropdown submenu does it when it opens
		// at the right edge of the page, which is where the overflow menu opens.
		const user = userEvent.setup();
		const onClick = vi.fn();
		renderCollapsed({ items: rows(onClick) });

		const menu = await openOverflow(user);
		const section = within(menu).getByTestId('group-item-section');

		// The member is the last row of the overflow menu, and the arrow keys wrap around to it.
		await user.keyboard('{ArrowDown}{ArrowUp}');
		await waitFor(() => expect(section).toHaveFocus());
		await user.keyboard('{ArrowRight}');

		const overview = await screen.findByRole('menuitem', { name: 'Overview' });
		await waitFor(() => expect(overview).toHaveFocus());
		await user.keyboard('{ArrowDown}');
		await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Latency' })).toHaveFocus());
		await user.keyboard('{Enter}');

		expect(onClick).toHaveBeenCalledOnce();
		await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
	});

	it('names the submenu row after the testId the member sets for itself', async () => {
		const user = userEvent.setup();
		renderCollapsed({}, { testId: 'section-picker' });

		const menu = await openOverflow(user);

		expect(within(menu).getByTestId('section-picker')).toHaveAccessibleName('Choose section');
		expect(within(menu).queryByTestId('group-item-section')).not.toBeInTheDocument();
	});

	it('labels the submenu row with the text of a member that has a label', async () => {
		const user = userEvent.setup();
		renderInFrame(
			<ButtonGroup
				{...BASE}
				testId="group"
				items={[
					...MANY_ITEMS,
					{
						value: 'section',
						label: 'Sections',
						menu: { side: 'bottom', align: 'end', items: rows() },
					},
				]}
			/>,
			{ size: 300, style: TOKENS },
		);

		const menu = await openOverflow(user);

		expect(within(menu).getByRole('menuitem', { name: 'Sections' })).toHaveAttribute(
			'aria-haspopup',
			'menu',
		);
	});

	it('keeps the member mounted while it is collapsed, so the group still measures it', async () => {
		const { rerender } = render(
			<div style={{ width: 1200, ...TOKENS }}>
				<ButtonGroup {...BASE} items={[...MANY_ITEMS, menuMember()]} testId="group" />
			</div>,
		);

		const member = screen.getByTestId('group-item-section');
		expect(member).not.toHaveAttribute('data-collapsed');

		rerender(
			<div style={{ width: 300, ...TOKENS }}>
				<ButtonGroup {...BASE} items={[...MANY_ITEMS, menuMember()]} testId="group" />
			</div>,
		);

		await screen.findByTestId('group-overflow');
		expect(member.isConnected).toBe(true);
		expect(member).toHaveAttribute('data-collapsed');
		expect(member).toHaveAttribute('aria-hidden', 'true');
		expect(member).toHaveAttribute('tabindex', '-1');

		rerender(
			<div style={{ width: 1200, ...TOKENS }}>
				<ButtonGroup {...BASE} items={[...MANY_ITEMS, menuMember()]} testId="group" />
			</div>,
		);

		await waitFor(() => expect(screen.queryByTestId('group-overflow')).not.toBeInTheDocument());
		expect(member.isConnected).toBe(true);
		expect(member).not.toHaveAttribute('data-collapsed');
	});

	it('leaves the testId to the submenu row while the member is collapsed', async () => {
		const user = userEvent.setup();
		renderCollapsed();

		const menu = await openOverflow(user);

		expect(screen.getAllByTestId('group-item-section')).toEqual([
			within(menu).getByTestId('group-item-section'),
		]);
	});

	it('shows a disabled member as a disabled submenu row that does not open', async () => {
		const user = userEvent.setup();
		renderCollapsed({}, { disabled: true, disabledTooltip: ITEM_REASON });

		const menu = await openOverflow(user);
		const row = within(menu).getByTestId('group-item-section');
		expect(row).toHaveAttribute('aria-disabled', 'true');

		await user.click(row);

		expect(screen.queryByRole('menuitem', { name: 'Overview' })).not.toBeInTheDocument();
	});

	it('shows the reason of a disabled member on its submenu row', async () => {
		const user = userEvent.setup();
		renderCollapsed({}, { disabled: true, disabledTooltip: ITEM_REASON });

		const menu = await openOverflow(user);
		await user.hover(within(menu).getByTestId('group-item-section'));

		await waitFor(() => expect(queryOpenTooltip()).toHaveTextContent(ITEM_REASON));
	});

	it('shows a loading member as a loading submenu row that does not open', async () => {
		const user = userEvent.setup();
		renderCollapsed({}, { loading: true, loadingTooltip: ITEM_BUSY });

		const menu = await openOverflow(user);
		const row = within(menu).getByTestId('group-item-section');
		expect(row).toHaveAttribute('data-loading', 'true');

		await user.click(row);

		expect(screen.queryByRole('menuitem', { name: 'Overview' })).not.toBeInTheDocument();
	});
});
