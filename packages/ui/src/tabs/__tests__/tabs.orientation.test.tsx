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
				orientation="horizontal"
				alignment="start"
				items={ITEMS}
				testId="tabs"
			/>,
		);

		expect(screen.getByTestId('tabs')).toHaveAttribute('data-orientation', 'horizontal');
		expect(screen.getByRole('tablist')).toHaveAttribute('data-orientation', 'horizontal');
		expect(screen.getByRole('tabpanel')).toHaveAttribute('data-orientation', 'horizontal');

		for (const tab of screen.getAllByRole('tab')) {
			expect(tab).toHaveAttribute('data-orientation', 'horizontal');
		}
	});

	// `horizontal` is the implicit default of a tablist, so writing it would be noise.
	it('leaves aria-orientation off the tablist', () => {
		render(<Tabs variant="primary" orientation="horizontal" alignment="start" items={ITEMS} />);

		expect(screen.getByRole('tablist')).not.toHaveAttribute('aria-orientation');
	});

	it('lays the tabs in a row rather than stacking them', () => {
		render(<Tabs variant="primary" orientation="horizontal" alignment="start" items={ITEMS} />);

		const first = screen.getByRole('tab', { name: 'Overview' }).getBoundingClientRect();
		const second = screen.getByRole('tab', { name: 'Settings' }).getBoundingClientRect();

		expect(second.left).toBeGreaterThanOrEqual(first.right - 1);
		expect(second.top).toBeCloseTo(first.top, 0);
	});

	it('puts the panel under the bar', () => {
		render(<Tabs variant="primary" orientation="horizontal" alignment="start" items={ITEMS} />);

		expect(rect('[data-slot="tabs-panel"]').top).toBeGreaterThanOrEqual(
			rect('[data-slot="tabs-list-wrapper"]').bottom - 1,
		);
	});

	it('moves focus with the arrow keys of its own axis', async () => {
		const user = userEvent.setup();
		render(<Tabs variant="primary" orientation="horizontal" alignment="start" items={ITEMS} />);

		await user.tab();
		expect(screen.getByRole('tab', { name: 'Overview' })).toHaveFocus();

		await user.keyboard('{ArrowDown}');
		expect(screen.getByRole('tab', { name: 'Overview' })).toHaveFocus();

		await user.keyboard('{ArrowRight}');
		expect(screen.getByRole('tab', { name: 'Settings' })).toHaveFocus();

		await user.keyboard('{ArrowLeft}');
		expect(screen.getByRole('tab', { name: 'Overview' })).toHaveFocus();
	});

	it('draws the active indicator under the tabs', () => {
		render(<Tabs variant="primary" orientation="horizontal" alignment="start" items={ITEMS} />);

		const indicator = rect('[data-slot="tabs-active-slider"]');
		const active = screen.getByRole('tab', { name: 'Overview' }).getBoundingClientRect();

		expect(indicator.width).toBeCloseTo(active.width, 0);
		expect(indicator.height).toBeLessThanOrEqual(4);
	});

	// The hover slider carried no size at all until it was given one: it was absolutely positioned
	// with neither a cross-axis inset nor a size, so it computed to zero and never painted.
	it('sizes the hover slider to the tab it tracks', async () => {
		const user = userEvent.setup();
		render(<Tabs variant="primary" orientation="horizontal" alignment="start" items={ITEMS} />);

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
		expect(sliderRect.width).toBeCloseTo(tabRect.width, 0);
	});

	it('keeps the hover slider out of the tablist roles', () => {
		render(<Tabs variant="primary" orientation="horizontal" alignment="start" items={ITEMS} />);

		expect(document.querySelector('[data-slot="tabs-hover-slider"]')).toHaveAttribute(
			'role',
			'presentation',
		);
	});

	// The hatching says "this side is blocked off", which is the tab's inline edges.
	it('keeps the disabled bands on the inline edges', () => {
		render(
			<Tabs
				variant="secondary"
				orientation="horizontal"
				alignment="start"
				items={[...ITEMS, { key: 'billing', label: 'Billing', disabled: true, children: 'B' }]}
			/>,
		);

		const disabled = screen.getByRole('tab', { name: 'Billing' });
		const band = getComputedStyle(disabled, '::before');

		// Against the padding box, which is what `inset-block: 0` resolves against.
		expect(Number.parseFloat(band.height)).toBeCloseTo(disabled.clientHeight, 0);
		expect(Number.parseFloat(band.width)).toBeLessThan(disabled.clientWidth);
		expect(band.left).toBe('0px');
	});

	it('collapses the shared edge of a secondary strip', () => {
		render(<Tabs variant="secondary" orientation="horizontal" alignment="start" items={ITEMS} />);

		const [first, last] = screen.getAllByRole('tab');

		expect(getComputedStyle(first).borderRightWidth).toBe('0px');
		expect(getComputedStyle(last).borderRightWidth).not.toBe('0px');
		expect(getComputedStyle(first).borderBottomWidth).not.toBe('0px');
	});
});
