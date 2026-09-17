import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Tabs } from '../tabs.js';
import type { TabsItemProps } from '../types.js';

const ITEMS: TabsItemProps[] = [
	{ key: 'overview', label: 'Overview', children: 'Overview content' },
	{ key: 'settings', label: 'Settings', children: 'Settings content' },
];

const NAV_ITEMS: TabsItemProps[] = [
	{ key: 'overview', label: 'Overview', render: <a href="#overview" /> },
	{ key: 'logs', label: 'Logs', render: <a href="#logs" /> },
];

/**
 * The outgoing panel stays mounted (`inert`) for its exit transition, which jsdom never runs, so a
 * click can leave two `role="tabpanel"` elements in the DOM. The active one is the one that is not
 * `inert`.
 */
function getActivePanel(): Element | null {
	return document.querySelector('[data-slot="tabs-panel"]:not([inert])');
}

function ControlledTabs({ onChange }: { onChange: (key: string) => void }): JSX.Element {
	const [value, setValue] = useState('overview');

	return (
		<Tabs
			variant="primary"
			orientation="horizontal"
			alignment="start"
			items={ITEMS}
			value={value}
			onChange={(next) => {
				setValue(next);
				onChange(next);
			}}
		/>
	);
}

describe('Tabs interaction', () => {
	it('activates a tab on click and reports its key', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<Tabs
				variant="primary"
				orientation="horizontal"
				alignment="start"
				items={ITEMS}
				onChange={onChange}
			/>,
		);

		await user.click(screen.getByRole('tab', { name: 'Settings' }));

		expect(onChange).toHaveBeenCalledWith('settings');
		expect(screen.getByRole('tab', { name: 'Settings' })).toHaveAttribute('data-active');
		await waitFor(() => expect(getActivePanel()).toHaveTextContent('Settings content'));
	});

	it('moves focus with the arrow keys without activating the tab', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<Tabs
				variant="primary"
				orientation="horizontal"
				alignment="start"
				items={ITEMS}
				defaultValue="overview"
				onChange={onChange}
			/>,
		);

		await user.tab();
		expect(screen.getByRole('tab', { name: 'Overview' })).toHaveFocus();

		await user.keyboard('{ArrowRight}');

		expect(screen.getByRole('tab', { name: 'Settings' })).toHaveFocus();
		expect(onChange).not.toHaveBeenCalled();
		expect(getActivePanel()).toHaveTextContent('Overview content');
	});

	it('activates the focused tab on Enter', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<Tabs
				variant="primary"
				orientation="horizontal"
				alignment="start"
				items={ITEMS}
				defaultValue="overview"
				onChange={onChange}
			/>,
		);

		await user.tab();
		await user.keyboard('{ArrowRight}{Enter}');

		expect(onChange).toHaveBeenCalledWith('settings');
		await waitFor(() => expect(getActivePanel()).toHaveTextContent('Settings content'));
	});

	it('drives a controlled bar from its own state', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<ControlledTabs onChange={onChange} />);

		await user.click(screen.getByRole('tab', { name: 'Settings' }));

		expect(onChange).toHaveBeenCalledWith('settings');
		await waitFor(() => expect(getActivePanel()).toHaveTextContent('Settings content'));
	});

	it('never moves a controlled bar the consumer did not move', async () => {
		const user = userEvent.setup();
		render(
			<Tabs
				variant="primary"
				orientation="horizontal"
				alignment="start"
				items={ITEMS}
				value="overview"
				onChange={() => {}}
			/>,
		);

		await user.click(screen.getByRole('tab', { name: 'Settings' }));

		expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('data-active');
		expect(screen.getByRole('tab', { name: 'Settings' })).not.toHaveAttribute('data-active');
	});

	it('calls onChange with the key alone, not with Base UI event details', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<Tabs
				variant="primary"
				orientation="horizontal"
				alignment="start"
				items={ITEMS}
				onChange={onChange}
			/>,
		);

		await user.click(screen.getByRole('tab', { name: 'Settings' }));

		expect(onChange.mock.calls[0]).toEqual(['settings']);
	});

	it('starts on the first item when no defaultValue is given', () => {
		render(<Tabs variant="primary" orientation="horizontal" alignment="start" items={ITEMS} />);

		expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('data-active');
	});

	it('keeps a disabled tab in the arrow-key focus order, same as Button/RadioGroup', async () => {
		const user = userEvent.setup();
		render(
			<Tabs
				variant="primary"
				orientation="horizontal"
				alignment="start"
				defaultValue="overview"
				items={[
					{ key: 'overview', label: 'Overview', children: 'Overview content' },
					{
						key: 'billing',
						label: 'Billing',
						children: 'Billing content',
						disabled: true,
						disabledTooltip: 'Ask an admin',
					},
				]}
			/>,
		);

		await user.tab();
		await user.keyboard('{ArrowRight}');

		// Disabled tabs stay focusable (Base UI `focusableWhenDisabled`), the same guarantee Button
		// relies on for `disabledTooltip`, so the arrow key lands on it rather than skipping it.
		expect(screen.getByRole('tab', { name: 'Billing' })).toHaveFocus();
	});

	it('does not activate a disabled tab on click', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<Tabs
				variant="primary"
				orientation="horizontal"
				alignment="start"
				defaultValue="overview"
				onChange={onChange}
				items={[
					{ key: 'overview', label: 'Overview', children: 'Overview content' },
					{
						key: 'billing',
						label: 'Billing',
						children: 'Billing content',
						disabled: true,
						disabledTooltip: 'Ask an admin',
					},
				]}
			/>,
		);

		await user.click(screen.getByRole('tab', { name: 'Billing' }));

		expect(onChange).not.toHaveBeenCalled();
		expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('data-active');
	});

	it('does not activate a disabled tab on Enter once focused', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<Tabs
				variant="primary"
				orientation="horizontal"
				alignment="start"
				defaultValue="overview"
				onChange={onChange}
				items={[
					{ key: 'overview', label: 'Overview', children: 'Overview content' },
					{
						key: 'billing',
						label: 'Billing',
						children: 'Billing content',
						disabled: true,
						disabledTooltip: 'Ask an admin',
					},
				]}
			/>,
		);

		await user.tab();
		await user.keyboard('{ArrowRight}{Enter}');

		expect(onChange).not.toHaveBeenCalled();
		expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('data-active');
	});

	it('reports the key of a navigating tab that was clicked', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<Tabs
				variant="primary"
				orientation="horizontal"
				alignment="start"
				items={NAV_ITEMS}
				value="overview"
				onChange={onChange}
			/>,
		);

		await user.click(screen.getByRole('tab', { name: 'Logs' }));

		expect(onChange).toHaveBeenCalledWith('logs');
		expect(window.location.hash).toBe('#logs');
	});

	it('activates a navigating tab with Space, which an anchor does not do on its own', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<Tabs
				variant="primary"
				orientation="horizontal"
				alignment="start"
				items={NAV_ITEMS}
				value="overview"
				onChange={onChange}
			/>,
		);

		await user.tab();
		await user.keyboard('{ArrowRight}[Space]');

		expect(onChange).toHaveBeenCalledWith('logs');
	});

	it('does not follow a disabled navigating tab', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		window.location.hash = '#overview';
		render(
			<Tabs
				variant="primary"
				orientation="horizontal"
				alignment="start"
				value="overview"
				onChange={onChange}
				items={[
					{ key: 'overview', label: 'Overview', render: <a href="#overview" /> },
					{
						key: 'billing',
						label: 'Billing',
						render: <a href="#billing" />,
						disabled: true,
						disabledTooltip: 'Ask an admin',
					},
				]}
			/>,
		);

		await user.click(screen.getByRole('tab', { name: 'Billing' }));

		expect(onChange).not.toHaveBeenCalled();
		expect(window.location.hash).toBe('#overview');
	});
});
