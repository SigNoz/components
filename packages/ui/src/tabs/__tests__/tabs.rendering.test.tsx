import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TABS_EMPTY_LABEL } from '../constants.js';
import { Tabs } from '../tabs.js';
import type { TabsItemProps } from '../types.js';

const ITEMS: TabsItemProps[] = [
	{ key: 'overview', label: 'Overview', children: 'Overview content' },
	{ key: 'settings', label: 'Settings', children: 'Settings content' },
];

describe('Tabs rendering', () => {
	it('renders one tab per item, named by its label', () => {
		render(<Tabs variant="primary" orientation="horizontal" alignment="left" items={ITEMS} />);

		expect(screen.getAllByRole('tab')).toHaveLength(2);
		expect(screen.getByRole('tab', { name: 'Overview' })).toBeInTheDocument();
		expect(screen.getByRole('tab', { name: 'Settings' })).toBeInTheDocument();
	});

	it('groups the tabs under a tablist role', () => {
		render(<Tabs variant="primary" orientation="horizontal" alignment="left" items={ITEMS} />);

		expect(screen.getByRole('tablist')).toBeInTheDocument();
	});

	it('shows only the active item panel, under a tabpanel role', () => {
		render(
			<Tabs
				variant="primary"
				orientation="horizontal"
				alignment="left"
				items={ITEMS}
				defaultValue="overview"
			/>,
		);

		expect(screen.getByRole('tabpanel')).toHaveTextContent('Overview content');
	});

	it('mirrors variant, alignment and orientation as data attributes', () => {
		render(
			<Tabs
				variant="secondary"
				orientation="horizontal"
				alignment="center"
				items={ITEMS}
				testId="tabs"
			/>,
		);

		const root = screen.getByTestId('tabs');
		expect(root).toHaveAttribute('data-slot', 'tabs');
		expect(root).toHaveAttribute('data-orientation', 'horizontal');
		expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute(
			'data-variant',
			'secondary',
		);
		expect(document.querySelector('[data-slot="tabs-list-wrapper"]')).toHaveAttribute(
			'data-alignment',
			'center',
		);
	});

	it('stamps the item slots', () => {
		render(
			<Tabs
				variant="primary"
				orientation="horizontal"
				alignment="left"
				items={ITEMS}
				testId="tabs"
			/>,
		);

		expect(document.querySelectorAll('[data-slot="tabs-item"]')).toHaveLength(2);
		expect(document.querySelectorAll('[data-slot="tabs-label"]')).toHaveLength(2);
		expect(document.querySelectorAll('[data-slot="tabs-panel"]')).toHaveLength(1);
	});

	it('renders prefixIcon and suffixIcon around the label', () => {
		render(
			<Tabs
				variant="primary"
				orientation="horizontal"
				alignment="left"
				items={[
					{
						key: 'overview',
						label: 'Overview',
						children: 'Overview content',
						prefixIcon: <span data-testid="prefix" />,
						suffixIcon: <span data-testid="suffix" />,
					},
				]}
			/>,
		);

		const tab = screen.getByRole('tab', { name: 'Overview' });
		expect(tab).toContainElement(screen.getByTestId('prefix'));
		expect(tab).toContainElement(screen.getByTestId('suffix'));
	});

	it('replaces prefixIcon with a lock icon and hides suffixIcon while disabled', () => {
		render(
			<Tabs
				variant="primary"
				orientation="horizontal"
				alignment="left"
				items={[
					{
						key: 'overview',
						label: 'Overview',
						children: 'Overview content',
						prefixIcon: <span data-testid="prefix" />,
						suffixIcon: <span data-testid="suffix" />,
						disabled: true,
						disabledTooltip: 'Ask an admin',
					},
				]}
			/>,
		);

		const tab = screen.getByRole('tab', { name: 'Overview' });
		expect(tab).toContainElement(
			document.querySelector<SVGSVGElement>('[data-slot="tabs-lock-icon"]'),
		);
		expect(screen.queryByTestId('prefix')).not.toBeInTheDocument();
		expect(screen.queryByTestId('suffix')).not.toBeInTheDocument();
		expect(tab).toHaveAttribute('data-disabled');
	});

	it('falls back to the empty-label text when the label renders nothing', () => {
		render(
			<Tabs
				variant="primary"
				orientation="horizontal"
				alignment="left"
				items={[{ key: 'overview', label: '', children: 'Overview content' }]}
			/>,
		);

		expect(screen.getByText(TABS_EMPTY_LABEL)).toHaveAttribute('data-empty-label');
	});

	it('derives an item testId from the bar testId when the item has none of its own', () => {
		render(
			<Tabs
				variant="primary"
				orientation="horizontal"
				alignment="left"
				items={ITEMS}
				testId="my-tabs"
			/>,
		);

		expect(screen.getByTestId('my-tabs-item-overview')).toBe(
			screen.getByRole('tab', { name: 'Overview' }),
		);
		expect(screen.getByTestId('my-tabs-item-settings')).toBe(
			screen.getByRole('tab', { name: 'Settings' }),
		);
	});

	it('renders no item testId when the bar has none', () => {
		render(<Tabs variant="primary" orientation="horizontal" alignment="left" items={ITEMS} />);

		for (const tab of screen.getAllByRole('tab')) {
			expect(tab).not.toHaveAttribute('data-testid');
		}
	});

	it('removes the panel padding when noTabContentPadding is set', () => {
		render(
			<Tabs
				variant="primary"
				orientation="horizontal"
				alignment="left"
				items={ITEMS}
				noTabContentPadding
			/>,
		);

		expect(screen.getByRole('tabpanel')).toHaveAttribute('data-no-content-padding');
	});

	it('does not mark the panel when noTabContentPadding is left at its default', () => {
		render(<Tabs variant="primary" orientation="horizontal" alignment="left" items={ITEMS} />);

		expect(screen.getByRole('tabpanel')).not.toHaveAttribute('data-no-content-padding');
	});

	it('renders tabBarLeftContent and tabBarRightContent alongside the list', () => {
		render(
			<Tabs
				variant="primary"
				orientation="horizontal"
				alignment="left"
				items={ITEMS}
				tabBarLeftContent={<span data-testid="left" />}
				tabBarRightContent={<span data-testid="right" />}
			/>,
		);

		expect(screen.getByTestId('left')).toBeInTheDocument();
		expect(screen.getByTestId('right')).toBeInTheDocument();
	});

	it('forwards id, className, style, aria and data attributes to the root', () => {
		render(
			<Tabs
				variant="primary"
				orientation="horizontal"
				alignment="left"
				items={ITEMS}
				testId="tabs"
				id="views"
				className="custom"
				style={{ gap: '10px' }}
				aria-label="Views"
				data-analytics="views-tabs"
			/>,
		);

		const root = screen.getByTestId('tabs');
		expect(root).toHaveAttribute('id', 'views');
		expect(root).toHaveClass('custom');
		expect(root).toHaveStyle({ gap: '10px' });
		expect(root).toHaveAttribute('aria-label', 'Views');
		expect(root).toHaveAttribute('data-analytics', 'views-tabs');
	});
});
