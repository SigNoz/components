import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Tabs } from '../tabs.js';
import type { TabsItemProps } from '../types.js';

const ITEMS: TabsItemProps[] = [
	{ key: 'overview', label: 'Overview', children: 'Overview content' },
	{ key: 'settings', label: 'Settings', children: 'Settings content' },
];

/**
 * Real layout, so nothing here may import `mockLabelMeasurement`: it redefines the `scrollWidth`
 * and `clientWidth` prototype getters for the whole file.
 */
function rect(selector: string): DOMRect {
	const element = document.querySelector(selector);

	if (!element) {
		throw new Error(`no element for ${selector}`);
	}

	return element.getBoundingClientRect();
}

describe('Tabs orientation', () => {
	it('stamps the orientation on every part', () => {
		render(
			<Tabs
				variant="primary"
				orientation="vertical"
				alignment="start"
				items={ITEMS}
				testId="tabs"
			/>,
		);

		expect(screen.getByTestId('tabs')).toHaveAttribute('data-orientation', 'vertical');
		expect(screen.getByRole('tablist')).toHaveAttribute('data-orientation', 'vertical');
		expect(screen.getByRole('tabpanel')).toHaveAttribute('data-orientation', 'vertical');

		for (const tab of screen.getAllByRole('tab')) {
			expect(tab).toHaveAttribute('data-orientation', 'vertical');
		}
	});

	it('exposes aria-orientation only while vertical', () => {
		const { unmount } = render(
			<Tabs variant="primary" orientation="vertical" alignment="start" items={ITEMS} />,
		);

		expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'vertical');
		unmount();

		render(<Tabs variant="primary" orientation="horizontal" alignment="start" items={ITEMS} />);

		expect(screen.getByRole('tablist')).not.toHaveAttribute('aria-orientation');
	});

	it('stacks the tabs instead of laying them in a row', () => {
		render(<Tabs variant="primary" orientation="vertical" alignment="start" items={ITEMS} />);

		const first = screen.getByRole('tab', { name: 'Overview' }).getBoundingClientRect();
		const second = screen.getByRole('tab', { name: 'Settings' }).getBoundingClientRect();

		expect(second.top).toBeGreaterThanOrEqual(first.bottom - 1);
		expect(second.left).toBeCloseTo(first.left, 0);
	});

	it('puts the panel beside the bar rather than under it', () => {
		render(<Tabs variant="primary" orientation="vertical" alignment="start" items={ITEMS} />);

		expect(rect('[data-slot="tabs-panel"]').left).toBeGreaterThanOrEqual(
			rect('[data-slot="tabs-list-wrapper"]').right - 1,
		);
	});

	it('moves focus with the arrow keys of its own axis', async () => {
		const user = userEvent.setup();
		render(<Tabs variant="primary" orientation="vertical" alignment="start" items={ITEMS} />);

		await user.tab();
		expect(screen.getByRole('tab', { name: 'Overview' })).toHaveFocus();

		await user.keyboard('{ArrowRight}');
		expect(screen.getByRole('tab', { name: 'Overview' })).toHaveFocus();

		await user.keyboard('{ArrowDown}');
		expect(screen.getByRole('tab', { name: 'Settings' })).toHaveFocus();

		await user.keyboard('{ArrowUp}');
		expect(screen.getByRole('tab', { name: 'Overview' })).toHaveFocus();
	});

	it('turns the active indicator into a rail down the bar', () => {
		render(<Tabs variant="primary" orientation="vertical" alignment="start" items={ITEMS} />);

		const indicator = rect('[data-slot="tabs-active-slider"]');
		const active = screen.getByRole('tab', { name: 'Overview' }).getBoundingClientRect();

		expect(indicator.height).toBeCloseTo(active.height, 0);
		expect(indicator.width).toBeLessThanOrEqual(4);
	});

	it('draws the active indicator under the tabs while horizontal', () => {
		render(<Tabs variant="primary" orientation="horizontal" alignment="start" items={ITEMS} />);

		const indicator = rect('[data-slot="tabs-active-slider"]');
		const active = screen.getByRole('tab', { name: 'Overview' }).getBoundingClientRect();

		expect(indicator.width).toBeCloseTo(active.width, 0);
		expect(indicator.height).toBeLessThanOrEqual(4);
	});

	// The hover slider carried no size at all until it was given one: it was absolutely positioned
	// with neither a cross-axis inset nor a size, so it computed to zero and never painted.
	it.each([
		['horizontal', 'width'],
		['vertical', 'height'],
	] as const)('sizes the hover slider on the %s axis', async (orientation, mainAxis) => {
		const user = userEvent.setup();
		render(<Tabs variant="primary" orientation={orientation} alignment="start" items={ITEMS} />);

		const slider = document.querySelector<HTMLElement>('[data-slot="tabs-hover-slider"]');
		expect(slider).not.toBeNull();
		expect(slider?.style.opacity).toBe('0');

		const tab = screen.getByRole('tab', { name: 'Settings' });
		await user.hover(tab);

		await waitFor(() => {
			expect(slider?.style.opacity).toBe('1');
		});

		const sliderRect = slider!.getBoundingClientRect();
		const tabRect = tab.getBoundingClientRect();

		expect(sliderRect.width).toBeGreaterThan(0);
		expect(sliderRect.height).toBeGreaterThan(0);
		expect(sliderRect[mainAxis]).toBeCloseTo(tabRect[mainAxis], 0);
	});

	it('keeps the hover slider out of the tablist roles', () => {
		render(<Tabs variant="primary" orientation="horizontal" alignment="start" items={ITEMS} />);

		expect(document.querySelector('[data-slot="tabs-hover-slider"]')).toHaveAttribute(
			'role',
			'presentation',
		);
	});

	it('collapses the shared edge of a stacked secondary strip', () => {
		render(<Tabs variant="secondary" orientation="vertical" alignment="start" items={ITEMS} />);

		const [first, last] = screen.getAllByRole('tab');

		expect(getComputedStyle(first).borderBottomWidth).toBe('0px');
		expect(getComputedStyle(last).borderBottomWidth).not.toBe('0px');
		expect(getComputedStyle(first).borderRightWidth).not.toBe('0px');
	});
});
