import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { CSSProperties, ReactElement, ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { Tabs } from '../tabs.js';
import type { TabsItemProps } from '../types.js';

/**
 * Real layout and a real `ResizeObserver`, so nothing here may import `mockLabelMeasurement`: it
 * redefines the `scrollWidth`/`clientWidth` prototype getters and swaps `ResizeObserver` for a
 * synchronous fake, which is exactly what these cases measure.
 */
const MANY_ITEMS: TabsItemProps[] = Array.from({ length: 12 }, (_, index) => ({
	key: `item-${index}`,
	label: `Tab number ${index}`,
	children: `Panel ${index}`,
}));

const FEW_ITEMS: TabsItemProps[] = MANY_ITEMS.slice(0, 2);

function renderInFrame(ui: ReactElement, { size }: { size: number }): ReturnType<typeof render> {
	return render(ui, {
		wrapper: ({ children }: { children: ReactNode }) => (
			<div style={{ width: size }}>{children}</div>
		),
	});
}

function viewport(): HTMLElement {
	const element = document.querySelector<HTMLElement>('[data-slot="tabs-list-viewport"]');

	if (!element) {
		throw new Error('no scroll viewport');
	}

	return element;
}

function scrollButton(direction: 'start' | 'end'): HTMLButtonElement | null {
	return document.querySelector<HTMLButtonElement>(
		`[data-slot="tabs-scroll-button"][data-direction="${direction}"]`,
	);
}

describe('Tabs overflow', () => {
	it('renders no arrows while every tab fits', async () => {
		renderInFrame(
			<Tabs variant="primary" orientation="horizontal" alignment="start" items={FEW_ITEMS} />,
			{ size: 800 },
		);

		await waitFor(() => {
			expect(viewport().scrollWidth).toBeGreaterThan(0);
		});

		expect(scrollButton('start')).toBeNull();
		expect(scrollButton('end')).toBeNull();
	});

	it('renders both arrows once the strip overflows, and disables the one that cannot move', async () => {
		renderInFrame(
			<Tabs variant="primary" orientation="horizontal" alignment="start" items={MANY_ITEMS} />,
			{ size: 320 },
		);

		await waitFor(() => {
			expect(scrollButton('end')).not.toBeNull();
		});

		expect(scrollButton('start')).toBeDisabled();
		expect(scrollButton('end')).toBeEnabled();
	});

	it('squashes no tab: the strip overflows and the viewport scrolls', async () => {
		renderInFrame(
			<Tabs variant="primary" orientation="horizontal" alignment="start" items={MANY_ITEMS} />,
			{ size: 320 },
		);

		await waitFor(() => {
			expect(scrollButton('end')).not.toBeNull();
		});

		expect(viewport().scrollWidth).toBeGreaterThan(viewport().clientWidth);
		expect(screen.getByRole('tab', { name: 'Tab number 0' })).not.toHaveAttribute('data-truncated');
	});

	it('keeps the arrows out of the tablist', async () => {
		renderInFrame(
			<Tabs variant="primary" orientation="horizontal" alignment="start" items={MANY_ITEMS} />,
			{ size: 320 },
		);

		await waitFor(() => {
			expect(scrollButton('end')).not.toBeNull();
		});

		const tablist = screen.getByRole('tablist');

		expect(tablist.querySelector('[data-slot="tabs-scroll-button"]')).toBeNull();
		expect(screen.getAllByRole('tab')).toHaveLength(12);
	});

	it('names the arrows after the direction they scroll', async () => {
		renderInFrame(
			<Tabs variant="primary" orientation="horizontal" alignment="start" items={MANY_ITEMS} />,
			{ size: 320 },
		);

		await waitFor(() => {
			expect(scrollButton('end')).not.toBeNull();
		});

		expect(screen.getByRole('button', { name: 'Scroll tabs left' })).toBe(scrollButton('start'));
		expect(screen.getByRole('button', { name: 'Scroll tabs right' })).toBe(scrollButton('end'));
	});

	it('derives a test id for each arrow from the bar', async () => {
		renderInFrame(
			<Tabs
				variant="primary"
				orientation="horizontal"
				alignment="start"
				items={MANY_ITEMS}
				testId="tabs"
			/>,
			{ size: 320 },
		);

		await waitFor(() => {
			expect(screen.queryByTestId('tabs-scroll-end')).not.toBeNull();
		});

		expect(screen.getByTestId('tabs-scroll-start')).toBe(scrollButton('start'));
	});

	it('scrolls towards the end on click, and flips which arrow is disabled', async () => {
		const user = userEvent.setup();
		renderInFrame(
			<Tabs variant="primary" orientation="horizontal" alignment="start" items={MANY_ITEMS} />,
			{ size: 320 },
		);

		await waitFor(() => {
			expect(scrollButton('end')).not.toBeNull();
		});

		await user.click(scrollButton('end')!);

		await waitFor(() => {
			expect(viewport().scrollLeft).toBeGreaterThan(0);
			expect(scrollButton('start')).toBeEnabled();
		});
	});

	it('disables the end arrow once the strip is fully scrolled', async () => {
		renderInFrame(
			<Tabs variant="primary" orientation="horizontal" alignment="start" items={MANY_ITEMS} />,
			{ size: 320 },
		);

		await waitFor(() => {
			expect(scrollButton('end')).not.toBeNull();
		});

		viewport().scrollTo({ left: viewport().scrollWidth, behavior: 'instant' });

		await waitFor(() => {
			expect(scrollButton('end')).toBeDisabled();
			expect(scrollButton('start')).toBeEnabled();
		});
	});

	// The bar's own content is what the strip gives way to, not the other way round.
	it('shrinks the strip rather than pushing the bar content out', async () => {
		renderInFrame(
			<Tabs
				variant="primary"
				orientation="horizontal"
				alignment="start"
				items={MANY_ITEMS}
				tabBarEndContent={<button type="button">Add view</button>}
			/>,
			{ size: 360 },
		);

		await waitFor(() => {
			expect(scrollButton('end')).not.toBeNull();
		});

		const wrapper = document
			.querySelector('[data-slot="tabs-list-wrapper"]')!
			.getBoundingClientRect();
		const extra = screen.getByRole('button', { name: 'Add view' }).getBoundingClientRect();

		expect(extra.right).toBeLessThanOrEqual(wrapper.right + 1);
		expect(extra.width).toBeGreaterThan(0);
		expect(viewport().scrollWidth).toBeGreaterThan(viewport().clientWidth);
	});

	// `getBoundingClientRect` cannot see a clip, so this checks the compensation instead: the
	// viewport's padding box reaches past the list by at least the indicator's own reach, and the
	// negative margin hands every one of those pixels back so the bar is the height it always was.
	it('does not clip the active indicator, and costs no height to avoid it', async () => {
		const { unmount } = render(
			<Tabs variant="primary" orientation="horizontal" alignment="start" items={FEW_ITEMS} />,
		);

		const plainHeight = document
			.querySelector('[data-slot="tabs-list-wrapper"]')!
			.getBoundingClientRect().height;
		unmount();

		renderInFrame(
			<Tabs variant="primary" orientation="horizontal" alignment="start" items={MANY_ITEMS} />,
			{ size: 320 },
		);

		await waitFor(() => {
			expect(scrollButton('end')).not.toBeNull();
		});

		const indicator = document
			.querySelector('[data-slot="tabs-active-slider"]')!
			.getBoundingClientRect();
		const port = viewport().getBoundingClientRect();
		const wrapperHeight = document
			.querySelector('[data-slot="tabs-list-wrapper"]')!
			.getBoundingClientRect().height;

		expect(indicator.bottom).toBeLessThanOrEqual(port.bottom + 1);
		expect(wrapperHeight).toBeCloseTo(plainHeight, 0);
	});

	it('scrolls a tab back into view when it becomes the active one', async () => {
		const { rerender } = renderInFrame(
			<Tabs
				variant="primary"
				orientation="horizontal"
				alignment="start"
				items={MANY_ITEMS}
				value="item-0"
			/>,
			{ size: 320 },
		);

		await waitFor(() => {
			expect(scrollButton('end')).not.toBeNull();
		});

		rerender(
			<Tabs
				variant="primary"
				orientation="horizontal"
				alignment="start"
				items={MANY_ITEMS}
				value="item-11"
			/>,
		);

		await waitFor(() => {
			const tab = screen.getByRole('tab', { name: 'Tab number 11' }).getBoundingClientRect();
			const port = viewport().getBoundingClientRect();

			expect(tab.right).toBeLessThanOrEqual(port.right + 1);
			expect(tab.left).toBeGreaterThanOrEqual(port.left - 1);
		});
	});

	it('keeps the focused tab in view while the arrow keys walk the strip', async () => {
		const user = userEvent.setup();
		renderInFrame(
			<Tabs variant="primary" orientation="horizontal" alignment="start" items={MANY_ITEMS} />,
			{ size: 320 },
		);

		await waitFor(() => {
			expect(scrollButton('end')).not.toBeNull();
		});

		await user.tab();
		await user.keyboard('{ArrowRight>8/}');

		await waitFor(() => {
			const focused = (document.activeElement as HTMLElement).getBoundingClientRect();
			const port = viewport().getBoundingClientRect();

			expect(focused.right).toBeLessThanOrEqual(port.right + 1);
			expect(focused.left).toBeGreaterThanOrEqual(port.left - 1);
		});
	});

	it('runs the secondary bar rule through the arrows', async () => {
		renderInFrame(
			// The rule resolves `--tabs-border`, which the theme owns and a test page does not load.
			// Without a value the whole border declaration is invalid and every element reports `0px`,
			// which would make the comparison below pass while proving nothing.
			<Tabs
				variant="secondary"
				orientation="horizontal"
				alignment="start"
				items={MANY_ITEMS}
				style={{ '--tabs-border': 'rgb(1, 2, 3)' } as CSSProperties}
			/>,
			{ size: 320 },
		);

		await waitFor(() => {
			expect(scrollButton('end')).not.toBeNull();
		});

		const arrow = getComputedStyle(scrollButton('start')!);
		const spacer = getComputedStyle(
			document.querySelector<HTMLElement>('[data-slot="tab-spacer-start"]')!,
		);

		expect(arrow.borderBottomWidth).toBe(spacer.borderBottomWidth);
		expect(arrow.borderBottomWidth).not.toBe('0px');
		expect(arrow.borderBottomColor).toBe(spacer.borderBottomColor);
	});
});
