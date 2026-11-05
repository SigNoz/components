import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type CSSProperties, StrictMode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Breadcrumb } from '../breadcrumb.js';
import { BREADCRUMB_COLLAPSE_HYSTERESIS_PX, BreadcrumbShrink } from '../constants.js';
import type { BreadcrumbItemType } from '../types.js';
import {
	collapsedCrumbs,
	ellipsis,
	FIXED_LAYOUT,
	Frame,
	FULL_WIDTH,
	labelsOf,
	PINNED_PARTS,
	renderInFrame,
	settle,
	TRAIL,
	visibleCrumbs,
} from './breadcrumb.test-utils.js';

/**
 * The widths come from the stylesheet of {@link renderInFrame}: five 100px crumbs, 10px separators
 * and a 30px `...` crumb need 540px, then 470px, 360px and 250px with one, two and three crumbs
 * collapsed. A real browser lays them out and a real `ResizeObserver` reports every change.
 */
const ONE_COLLAPSED = 470;
const TWO_COLLAPSED = 360;
const THREE_COLLAPSED = 250;

function visibleTitles(): (string | null)[] {
	return labelsOf(visibleCrumbs());
}

function collapsedTitles(): (string | null)[] {
	return labelsOf(collapsedCrumbs());
}

describe('Breadcrumb collapse by width', () => {
	it('collapses nothing while the trail fits', () => {
		renderInFrame(<Breadcrumb items={TRAIL} testId="bc" />, FULL_WIDTH);

		expect(visibleCrumbs()).toHaveLength(5);
		expect(collapsedCrumbs()).toHaveLength(0);
		expect(ellipsis()).toBeNull();
		expect(screen.queryByTestId('bc-ellipsis')).not.toBeInTheDocument();
		expect(screen.queryByTestId('bc-ellipsis-separator')).not.toBeInTheDocument();
		expect(screen.getByTestId('bc')).not.toHaveAttribute('data-overflowing');
	});

	it('collapses nothing in a much wider box', () => {
		renderInFrame(<Breadcrumb items={TRAIL} />, 2000);

		expect(ellipsis()).toBeNull();
		expect(visibleCrumbs()).toHaveLength(5);
	});

	it('collapses the centre crumb first once the trail is a pixel too wide', () => {
		renderInFrame(<Breadcrumb items={TRAIL} testId="bc" />, FULL_WIDTH - 1);

		expect(visibleTitles()).toEqual(['Dashboards', 'Payments', 'Checkout', 'prod-east']);
		expect(collapsedTitles()).toEqual(['Services']);
		expect(ellipsis()).toHaveAccessibleName('Show 1 hidden item');
		expect(screen.getByTestId('bc')).toHaveAttribute('data-overflowing');
	});

	it.each<[number, number, string[], string[]]>([
		[ONE_COLLAPSED, 1, ['Dashboards', 'Payments', 'Checkout', 'prod-east'], ['Services']],
		[TWO_COLLAPSED, 2, ['Dashboards', 'Checkout', 'prod-east'], ['Payments', 'Services']],
		[THREE_COLLAPSED, 3, ['Dashboards', 'prod-east'], ['Payments', 'Services', 'Checkout']],
	])('collapses the fewest crumbs that fit in %ipx: %i', (width, count, visible, hidden) => {
		renderInFrame(<Breadcrumb items={TRAIL} />, width);

		expect(visibleTitles()).toEqual(visible);
		expect(new Set(collapsedTitles())).toEqual(new Set(hidden));
		expect(ellipsis()).toHaveAccessibleName(
			`Show ${count} hidden ${count === 1 ? 'item' : 'items'}`,
		);
	});

	it('never collapses the first or the last crumb, however narrow the box', () => {
		renderInFrame(<Breadcrumb items={TRAIL} testId="bc" />, 10);

		expect(visibleTitles()).toEqual(['Dashboards', 'prod-east']);
		expect(collapsedCrumbs()).toHaveLength(3);
		expect(screen.getByTestId('bc-item-0')).toBeInTheDocument();
		expect(screen.getByTestId('bc-item-4')).toBeInTheDocument();
	});

	it('marks the trail as shrinking once only the first and the last crumb are left', async () => {
		const { resize } = renderInFrame(<Breadcrumb items={TRAIL} testId="bc" />, TWO_COLLAPSED);
		expect(screen.getByTestId('bc')).not.toHaveAttribute('data-shrinking');

		await resize(THREE_COLLAPSED - 1);

		expect(screen.getByTestId('bc')).toHaveAttribute('data-shrinking');
	});

	it('shortens the crumbs left, the last one first, when even the first and the last do not fit', () => {
		renderInFrame(<Breadcrumb items={TRAIL} testId="bc" />, 120);

		const first = screen.getByTestId('bc-item-0').getBoundingClientRect().width;
		const last = screen.getByTestId('bc-item-4').getBoundingClientRect().width;

		expect(first).toBeGreaterThan(0);
		expect(last).toBeLessThan(100);
		expect(last).toBeLessThanOrEqual(first);
		expect(screen.getByTestId('bc').getBoundingClientRect().width).toBeLessThanOrEqual(120);
	});

	it('measures a crumb at the size of its label, though the layout has cut it shorter', async () => {
		// The pinned layout holds every crumb to 100px, so a long title is clipped from the start.
		const items: BreadcrumbItemType[] = [
			...TRAIL.slice(0, 4),
			{ title: 'checkout-service-production-east-1' },
		];
		const wide = renderInFrame(<Breadcrumb items={items} testId="bc" />, 2000);
		const label = screen
			.getByTestId('bc-item-4')
			.querySelector<HTMLElement>('[data-slot="breadcrumb-item-label"]');
		const natural = Math.min(
			label?.scrollWidth ?? 0,
			Number.parseFloat(getComputedStyle(label as HTMLElement).maxWidth),
		);
		wide.unmount();

		// A 100px crumb would leave room to spare, so the label has to be what is measured.
		expect(natural).toBeGreaterThan(120);

		// Four 100px crumbs, the label at its own size and four separators.
		const needed = 400 + natural + 40;
		const fits = renderInFrame(<Breadcrumb items={items} />, Math.ceil(needed) + 2);
		expect(ellipsis()).toBeNull();
		fits.unmount();

		renderInFrame(<Breadcrumb items={items} />, Math.floor(needed) - 20);
		expect(collapsedCrumbs()).toHaveLength(1);
	});

	it('keeps the whole trail on one line', () => {
		renderInFrame(<Breadcrumb items={TRAIL} testId="bc" />, 300);

		const tops = new Set(visibleCrumbs().map((crumb) => crumb.getBoundingClientRect().top));
		expect(tops.size).toBe(1);
	});

	it('stays inside its box', () => {
		for (const width of [540, 400, 300, 200, 150]) {
			const { unmount } = renderInFrame(<Breadcrumb items={TRAIL} testId="bc" />, width);
			const list = screen.getByRole('list');

			expect(list.scrollWidth).toBeLessThanOrEqual(list.clientWidth + 1);
			unmount();
		}
	});

	it('counts the gap of the list on both sides of every separator', async () => {
		// With a 5px gap, the full trail takes 5 * 100 + 4 * (10 + 2 * 5) = 580px.
		const { resize } = renderInFrame(<Breadcrumb items={TRAIL} testId="bc" />, 580, {
			'--breadcrumb-gap': '5px',
		});
		expect(ellipsis()).toBeNull();

		await resize(579);
		await waitFor(() => expect(collapsedCrumbs()).toHaveLength(1));
	});

	it('lists the collapsed crumbs in path order as links', async () => {
		const user = userEvent.setup();
		renderInFrame(<Breadcrumb items={TRAIL} testId="bc" />, THREE_COLLAPSED);

		await user.click(screen.getByTestId('bc-ellipsis'));

		const menu = await screen.findByRole('menu');
		const rows = within(menu).getAllByRole('menuitem');

		expect(rows.map((row) => row.textContent)).toEqual(['Payments', 'Services', 'Checkout']);
		expect(rows.map((row) => row.tagName)).toEqual(['A', 'A', 'A']);
		expect(rows.map((row) => row.getAttribute('href'))).toEqual([
			'/dashboards/payments',
			'/dashboards/payments/services',
			'/dashboards/payments/services/checkout',
		]);
		expect(rows.map((row) => row.getAttribute('data-testid'))).toEqual([
			'bc-item-1',
			'bc-item-2',
			'bc-item-3',
		]);
	});

	it('lists only the crumbs that are collapsed', async () => {
		const user = userEvent.setup();
		renderInFrame(<Breadcrumb items={TRAIL} testId="bc" />, FULL_WIDTH - 1);

		await user.click(screen.getByTestId('bc-ellipsis'));

		const menu = await screen.findByRole('menu');
		expect(
			within(menu)
				.getAllByRole('menuitem')
				.map((row) => row.textContent),
		).toEqual(['Services']);
	});

	it('puts the `...` crumb where the collapsed run starts, with a separator before it', () => {
		renderInFrame(<Breadcrumb items={TRAIL} testId="bc" />, THREE_COLLAPSED);

		const order = Array.from(screen.getByRole('list').children)
			.filter((child) => child.getAttribute('data-collapsed') !== 'true')
			.map((child) => child.getAttribute('data-testid') ?? child.getAttribute('data-slot'));

		expect(order).toEqual([
			'bc-item-0',
			'bc-ellipsis-separator',
			'breadcrumb-ellipsis',
			'bc-item-separator-4',
			'bc-item-4',
		]);
	});

	it('draws a separator only before a crumb that shows', () => {
		renderInFrame(<Breadcrumb items={TRAIL} testId="bc" />, TWO_COLLAPSED);

		expect(screen.queryByTestId('bc-item-separator-1')).not.toBeInTheDocument();
		expect(screen.queryByTestId('bc-item-separator-2')).not.toBeInTheDocument();
		expect(screen.getByTestId('bc-ellipsis-separator')).toBeInTheDocument();
		expect(screen.getByTestId('bc-item-separator-3')).toBeInTheDocument();
		expect(screen.getByTestId('bc-item-separator-4')).toBeInTheDocument();
	});

	it('draws the separator it is given before the `...` crumb as well', () => {
		renderInFrame(<Breadcrumb items={TRAIL} separator=">" testId="bc" />, THREE_COLLAPSED);

		expect(screen.getByTestId('bc-ellipsis-separator')).toHaveTextContent('>');
	});

	describe('as the box changes', () => {
		it('collapses more as the box shrinks, and brings the crumbs back as it grows', async () => {
			const { resize } = renderInFrame(<Breadcrumb items={TRAIL} testId="bc" />, FULL_WIDTH);
			expect(collapsedCrumbs()).toHaveLength(0);

			await resize(TWO_COLLAPSED);
			await waitFor(() => expect(collapsedCrumbs()).toHaveLength(2));

			await resize(THREE_COLLAPSED);
			await waitFor(() => expect(collapsedCrumbs()).toHaveLength(3));

			await resize(FULL_WIDTH + 100);
			await waitFor(() => expect(collapsedCrumbs()).toHaveLength(0));
			expect(ellipsis()).toBeNull();
			expect(screen.getByTestId('bc')).not.toHaveAttribute('data-overflowing');
		});

		it('asks for 4px more room before it brings a crumb back, so a boundary does not flicker', async () => {
			const { resize } = renderInFrame(<Breadcrumb items={TRAIL} />, THREE_COLLAPSED);
			expect(collapsedCrumbs()).toHaveLength(3);

			// Two collapsed needs 360px, and expanding needs 4px on top.
			await resize(TWO_COLLAPSED);
			expect(collapsedCrumbs()).toHaveLength(3);

			await resize(TWO_COLLAPSED + 3);
			expect(collapsedCrumbs()).toHaveLength(3);

			await resize(TWO_COLLAPSED + 4);
			await waitFor(() => expect(collapsedCrumbs()).toHaveLength(2));
		});

		it('does not ask for the extra room to collapse', async () => {
			const { resize } = renderInFrame(<Breadcrumb items={TRAIL} />, FULL_WIDTH);

			await resize(FULL_WIDTH - 1);
			await waitFor(() => expect(collapsedCrumbs()).toHaveLength(1));
		});

		describe('keeps the `...` crumb, with its focus and its menu, as more crumbs collapse', () => {
			// Five crumbs collapse the second one, then the second and the third, so the first collapsed
			// crumb moves from the third to the second. Six collapse the third and the fourth, then the
			// second as well. Both need 470px with the first collapse and 360px with the next.
			const SIX_TRAIL: BreadcrumbItemType[] = [
				...TRAIL.slice(0, 3),
				{ title: 'Cluster', href: '/dashboards/payments/services/cluster' },
				...TRAIL.slice(3),
			];
			// How many crumbs the first collapse of each trail hides.
			const TRAILS: [string, BreadcrumbItemType[], number][] = [
				['five', TRAIL, 1],
				['six', SIX_TRAIL, 2],
			];

			/** Every part in the flow, left to right, by where it shows. */
			function flowOrder(): (string | null)[] {
				const parts = [
					...visibleCrumbs(),
					document.querySelector<HTMLElement>('[data-slot="breadcrumb-ellipsis"]') as HTMLElement,
				];

				return labelsOf(
					parts.sort((a, b) => a.getBoundingClientRect().left - b.getBoundingClientRect().left),
				);
			}

			it.each(TRAILS)('with %s crumbs, as the box shrinks', async (_, items, hidden) => {
				const { resize } = renderInFrame(<Breadcrumb items={items} testId="bc" />, ONE_COLLAPSED);
				const trigger = ellipsis() as HTMLElement;
				trigger.focus();
				expect(trigger).toHaveFocus();
				expect(collapsedCrumbs()).toHaveLength(hidden);

				await resize(TWO_COLLAPSED);
				await waitFor(() => expect(collapsedCrumbs()).toHaveLength(hidden + 1));

				expect(trigger.isConnected).toBe(true);
				expect(ellipsis()).toBe(trigger);
				expect(document.activeElement).toBe(trigger);
				expect(flowOrder()).toEqual(['Dashboards', '...', 'Checkout', 'prod-east']);
			});

			it.each(TRAILS)('with %s crumbs, as the box grows', async (_, items, hidden) => {
				const { resize } = renderInFrame(<Breadcrumb items={items} testId="bc" />, TWO_COLLAPSED);
				const trigger = ellipsis() as HTMLElement;
				trigger.focus();
				expect(trigger).toHaveFocus();
				expect(collapsedCrumbs()).toHaveLength(hidden + 1);

				// Expanding needs the 4px of the hysteresis on top of the 470px.
				await resize(ONE_COLLAPSED + BREADCRUMB_COLLAPSE_HYSTERESIS_PX);
				await waitFor(() => expect(collapsedCrumbs()).toHaveLength(hidden));

				expect(trigger.isConnected).toBe(true);
				expect(ellipsis()).toBe(trigger);
				expect(document.activeElement).toBe(trigger);
				expect(flowOrder()).toEqual(['Dashboards', 'Payments', '...', 'Checkout', 'prod-east']);
			});

			it('keeps its menu open', async () => {
				const user = userEvent.setup();
				const { resize } = renderInFrame(<Breadcrumb items={TRAIL} testId="bc" />, ONE_COLLAPSED);

				await user.click(screen.getByTestId('bc-ellipsis'));
				await screen.findByRole('menu');

				await resize(TWO_COLLAPSED);
				await waitFor(() => expect(collapsedCrumbs()).toHaveLength(2));

				expect(screen.getByRole('menu')).toBeInTheDocument();
				expect(
					within(screen.getByRole('menu'))
						.getAllByRole('menuitem')
						.map((row) => row.textContent),
				).toEqual(['Payments', 'Services']);
			});
		});

		it('measures again when the items change', async () => {
			const three: BreadcrumbItemType[] = [
				{ title: 'A', href: '/a' },
				{ title: 'B', href: '/b' },
				{ title: 'C', href: '/c' },
			];
			// 3 crumbs and 2 separators take 320px, 4 crumbs 430px, and 4 with one collapsed 360px.
			const { rerender } = renderInFrame(<Breadcrumb items={three} testId="bc" />, 360);
			expect(ellipsis()).toBeNull();

			rerender(<Breadcrumb items={[...three, { title: 'D', href: '/d' }]} testId="bc" />);

			await waitFor(() => expect(collapsedCrumbs()).toHaveLength(1));
			expect(ellipsis()).toHaveAccessibleName('Show 1 hidden item');

			rerender(<Breadcrumb items={three} testId="bc" />);

			await waitFor(() => expect(collapsedCrumbs()).toHaveLength(0));
			expect(ellipsis()).toBeNull();
		});

		it('collapses a trail that arrives after the first render', async () => {
			const { rerender } = renderInFrame(
				<Breadcrumb items={TRAIL.slice(0, 2)} testId="bc" />,
				THREE_COLLAPSED,
			);
			expect(ellipsis()).toBeNull();

			rerender(<Breadcrumb items={TRAIL} testId="bc" />);

			await waitFor(() => expect(collapsedCrumbs()).toHaveLength(3));
		});

		it('keeps following the box for a trail that arrives after an empty one', async () => {
			const { rerender, resize } = renderInFrame(<Breadcrumb items={[]} />, THREE_COLLAPSED);

			rerender(<Breadcrumb items={TRAIL} testId="bc" />);

			await waitFor(() => expect(collapsedCrumbs()).toHaveLength(3));

			await resize(FULL_WIDTH + BREADCRUMB_COLLAPSE_HYSTERESIS_PX);

			await waitFor(() => expect(collapsedCrumbs()).toHaveLength(0));
		});
	});

	describe('observers', () => {
		afterEach(() => {
			vi.unstubAllGlobals();
		});

		it('re-measures when a crumb changes size, though the trail does not change width', async () => {
			const crumb = (title: string, width: number) => ({
				title: <span style={{ display: 'inline-block', width }}>{title}</span>,
				href: `/${title}`,
			});
			const trail = (first: number) => [
				crumb('a', first),
				crumb('b', 100),
				crumb('c', 100),
				crumb('d', 100),
				crumb('e', 100),
			];

			// Five 100px crumbs and four 10px separators fit the 540px box exactly.
			const { rerender } = render(
				<div data-testid="frame" style={{ width: 540 }}>
					<style>{PINNED_PARTS}</style>
					<Breadcrumb items={trail(100)} testId="bc" />
				</div>,
			);
			expect(ellipsis()).toBeNull();

			rerender(
				<div data-testid="frame" style={{ width: 540 }}>
					<style>{PINNED_PARTS}</style>
					<Breadcrumb items={trail(160)} testId="bc" />
				</div>,
			);

			await waitFor(() => expect(collapsedCrumbs()).toHaveLength(1));
		});

		it('stops observing when it unmounts', () => {
			const live = new Set<ResizeObserver>();
			vi.stubGlobal(
				'ResizeObserver',
				class extends ResizeObserver {
					override observe(target: Element, options?: ResizeObserverOptions): void {
						live.add(this);
						super.observe(target, options);
					}

					override disconnect(): void {
						live.delete(this);
						super.disconnect();
					}
				},
			);

			const { unmount } = renderInFrame(<Breadcrumb items={TRAIL} testId="bc" />, FULL_WIDTH);
			expect(live.size).toBeGreaterThan(0);

			unmount();

			expect(live.size).toBe(0);
		});

		it('does not observe at all while the trail cannot collapse', () => {
			const targets: Element[] = [];
			vi.stubGlobal(
				'ResizeObserver',
				class extends ResizeObserver {
					override observe(target: Element, options?: ResizeObserverOptions): void {
						targets.push(target);
						super.observe(target, options);
					}
				},
			);

			render(<Breadcrumb items={TRAIL} truncate={false} testId="bc" />);

			expect(targets.filter((target) => target.getAttribute('data-slot') === 'breadcrumb')).toEqual(
				[],
			);
		});

		it('collapses the same under StrictMode, which runs every effect twice', async () => {
			render(
				<StrictMode>
					<div data-testid="frame" style={{ width: 360 }}>
						<style>{FIXED_LAYOUT}</style>
						<Breadcrumb items={TRAIL} testId="bc" />
					</div>
				</StrictMode>,
			);

			await waitFor(() => expect(collapsedCrumbs()).toHaveLength(2));
			expect(ellipsis()).toHaveAccessibleName('Show 2 hidden items');
		});
	});

	describe('inside a flex row, where the trail is as wide as its content', () => {
		function renderInRow(width: number) {
			return render(
				<div data-testid="row" style={{ display: 'flex', width }}>
					<style>{FIXED_LAYOUT}</style>
					<span style={{ flex: '0 0 100px' }}>Title</span>
					<Breadcrumb items={TRAIL} testId="bc" />
				</div>,
			);
		}

		it('takes the whole trail and the hysteresis when the row has the room', async () => {
			renderInRow(700);
			await settle();

			expect(ellipsis()).toBeNull();
			expect(screen.getByTestId('bc').getBoundingClientRect().width).toBe(
				FULL_WIDTH + BREADCRUMB_COLLAPSE_HYSTERESIS_PX,
			);
		});

		it('shrinks with the room next to it', async () => {
			renderInRow(600);

			// 500px are left for the trail, which needs 540.
			await waitFor(() => expect(collapsedCrumbs()).toHaveLength(1));
			expect(screen.getByTestId('bc').getBoundingClientRect().width).toBeLessThanOrEqual(500);
		});

		// The trail holds itself at its full width plus the hysteresis, so a row that grows can give
		// it the room it asks for to bring the last crumb back.
		it('brings the crumb back when the row grows past what the trail needs', async () => {
			renderInRow(600);
			await waitFor(() => expect(collapsedCrumbs()).toHaveLength(1));

			screen.getByTestId('row').style.width = '800px';
			await settle();

			expect(collapsedCrumbs()).toHaveLength(0);
			expect(ellipsis()).toBeNull();
		});
	});

	describe('with a real layout and the font of the page', () => {
		it('collapses a long trail to fit a narrow box, and keeps the first and the last', async () => {
			render(
				<div style={{ width: 260 }}>
					<Breadcrumb
						testId="bc"
						items={[
							{ title: 'Dashboards', href: '/1' },
							{ title: 'Infrastructure monitoring', href: '/2' },
							{ title: 'Kubernetes clusters', href: '/3' },
							{ title: 'Production east', href: '/4' },
							{ title: 'checkout-service-prod' },
						]}
					/>
				</div>,
			);

			await waitFor(() => expect(ellipsis()).not.toBeNull());
			await settle();

			const nav = screen.getByTestId('bc');
			expect(nav.getBoundingClientRect().width).toBeLessThanOrEqual(260);
			expect(screen.getByTestId('bc-item-0')).toBeInTheDocument();
			expect(screen.getByTestId('bc-item-4')).toBeInTheDocument();
			expect(collapsedCrumbs().length).toBeGreaterThan(0);
		});

		// Shrinking both crumbs at once, however unevenly, cuts the first label by a fraction of a
		// pixel: enough for the browser to draw the ellipsis, too little for the tooltip.
		it('keeps the first crumb whole while the last one is enough to shorten', async () => {
			render(
				<div style={{ width: 260 }}>
					<Breadcrumb
						testId="bc"
						items={[
							{ title: 'Infrastructure', href: '/1' },
							{ title: 'Services', href: '/2' },
							{ title: 'Latency of checkout-service-prod-us-east-1b over the last day' },
						]}
					/>
				</div>,
			);

			await waitFor(() =>
				expect(screen.getByTestId('bc')).toHaveAttribute('data-shrinking', BreadcrumbShrink.End),
			);
			await settle();

			const label = (position: number) =>
				screen
					.getByTestId(`bc-item-${position}`)
					.querySelector<HTMLElement>('[data-slot="breadcrumb-item-label"]') as HTMLElement;
			const first = label(0).getBoundingClientRect().width;

			expect(first).toBeGreaterThanOrEqual(label(0).scrollWidth);
			expect(label(2).scrollWidth).toBeGreaterThan(label(2).clientWidth);
		});

		it('shortens the first crumb only once the last one sits at the floor', async () => {
			render(
				<div style={{ width: 120 }}>
					<Breadcrumb
						testId="bc"
						items={[
							{ title: 'Infrastructure monitoring', href: '/1' },
							{ title: 'checkout-service-prod-us-east-1b' },
						]}
					/>
				</div>,
			);

			await waitFor(() =>
				expect(screen.getByTestId('bc')).toHaveAttribute('data-shrinking', BreadcrumbShrink.Start),
			);
		});

		it('collapses nothing for a short trail in a wide box', async () => {
			render(
				<div style={{ width: 900 }}>
					<Breadcrumb items={TRAIL} testId="bc" />
				</div>,
			);

			await settle();
			expect(ellipsis()).toBeNull();
		});
	});

	describe('under a transform on an ancestor', () => {
		const LONG_LABEL_TRAIL: BreadcrumbItemType[] = [
			...TRAIL.slice(0, 4),
			{ title: 'checkout-service-production-east-1' },
		];
		const WIDTHS = Array.from({ length: 17 }, (_, step) => 240 + step * 20);

		/** Draws the trail in a box of `width` layout pixels at `scale`. */
		function renderScaled(items: BreadcrumbItemType[], width: number, scale: number) {
			return render(
				<div style={{ transform: `scale(${scale})`, transformOrigin: '0 0' }}>
					<Frame size={width}>
						<Breadcrumb items={items} testId="bc" />
					</Frame>
				</div>,
			);
		}

		/** How many crumbs collapse in each of `WIDTHS` at `scale`. */
		async function collapsedAcross(items: BreadcrumbItemType[], scale: number): Promise<number[]> {
			const counts: number[] = [];

			for (const width of WIDTHS) {
				const { unmount } = renderScaled(items, width, scale);
				await settle();
				counts.push(collapsedCrumbs().length);
				unmount();
			}

			return counts;
		}

		it.each([0.9, 0.5, 1.25])(
			'collapses the same crumbs at a scale of %f as at full size, whatever the width',
			async (scale) => {
				expect(await collapsedAcross(TRAIL, scale)).toEqual(await collapsedAcross(TRAIL, 1));
			},
		);

		// The pinned layout holds the last crumb to 100px, so its label is cut and measured again.
		it.each([0.9, 1.25])(
			'measures a shortened crumb at its label size at a scale of %f',
			async (scale) => {
				expect(await collapsedAcross(LONG_LABEL_TRAIL, scale)).toEqual(
					await collapsedAcross(LONG_LABEL_TRAIL, 1),
				);
			},
		);

		it('keeps the trail inside its box at a scale of 0.9', async () => {
			// The whole trail takes 540px, which a box of 500px does not have.
			renderScaled(TRAIL, 500, 0.9);
			await settle();

			const list = screen.getByRole('list');

			expect(collapsedCrumbs()).toHaveLength(1);
			expect(list.scrollWidth).toBeLessThanOrEqual(list.clientWidth);
		});
	});

	describe('while the trail fits, whatever the container', () => {
		const SHORT_TRAIL: BreadcrumbItemType[] = [{ title: 'Home', href: '/' }, { title: 'Settings' }];
		const LONG_END_TRAIL: BreadcrumbItemType[] = [
			{ title: 'Home', href: '/' },
			{ title: 'checkout-service-prod-east' },
		];

		function expectEveryCrumbWhole(nav: HTMLElement): void {
			const contents = nav.querySelectorAll<HTMLElement>('[data-slot="breadcrumb-item-content"]');

			expect(contents).toHaveLength(2);
			for (const content of contents) {
				const label = content.querySelector<HTMLElement>('[data-slot="breadcrumb-item-label"]');

				expect(label?.scrollWidth).toBeLessThanOrEqual(label?.clientWidth ?? 0);
				expect(content).not.toHaveAttribute('data-truncated');
			}
			expect(nav).not.toHaveAttribute('data-shrinking');
		}

		it('shortens no crumb of two in a flex row with the room to spare', async () => {
			render(
				<div style={{ display: 'flex', width: 800 }}>
					<Breadcrumb items={SHORT_TRAIL} testId="bc" />
				</div>,
			);
			await settle();

			const nav = screen.getByTestId('bc');
			const list = screen.getByRole('list');

			expectEveryCrumbWhole(nav);
			expect(list.scrollWidth).toBeLessThanOrEqual(list.clientWidth);
			expect(nav.getBoundingClientRect().width).toBeGreaterThan(
				screen.getByTestId('bc-item-1').getBoundingClientRect().right -
					nav.getBoundingClientRect().left -
					1,
			);
		});

		it('keeps a long last crumb whole in a block that has the room, though it is past half of it', async () => {
			// No label reaches its own cap, so the cap of the crumbs is the only thing that can cut it.
			const style = { '--breadcrumb-item-max-width': '60ch' } as CSSProperties;
			const wide = render(
				<div style={{ ...style, width: 1000 }}>
					<Breadcrumb items={LONG_END_TRAIL} testId="bc" />
				</div>,
			);
			await settle();
			const needed =
				screen.getByTestId('bc-item-1').getBoundingClientRect().right -
				screen.getByTestId('bc-item-0').getBoundingClientRect().left;
			wide.unmount();

			// Room for the whole trail with a little to spare, which half of it cannot give the last crumb.
			render(
				<div style={{ ...style, width: Math.ceil(needed) + 10 }}>
					<Breadcrumb items={LONG_END_TRAIL} testId="bc" />
				</div>,
			);
			await settle();

			const nav = screen.getByTestId('bc');
			expectEveryCrumbWhole(nav);
			expect(screen.getByTestId('bc-item-1').getBoundingClientRect().width).toBeGreaterThan(
				nav.getBoundingClientRect().width / 2,
			);
		});

		it('gives a lone crumb the whole trail, not half of it, and cuts its label at the edge', async () => {
			const style = { '--breadcrumb-item-max-width': '80ch' } as CSSProperties;
			render(
				<div style={{ ...style, width: 300 }}>
					<Breadcrumb
						items={[{ title: 'checkout-service-production-eu-west-1-canary-rollout' }]}
						testId="bc"
					/>
				</div>,
			);
			await settle();

			const nav = screen.getByTestId('bc');
			const crumb = screen.getByTestId('bc-item-0');
			expect(nav).not.toHaveAttribute('data-shrinking');
			expect(crumb.getBoundingClientRect().width).toBeGreaterThan(
				nav.getBoundingClientRect().width - 1,
			);
			expect(crumb.getBoundingClientRect().right).toBeLessThanOrEqual(
				nav.getBoundingClientRect().right + 1,
			);
			await waitFor(() =>
				expect(crumb.querySelector('[data-slot="breadcrumb-item-content"]')).toHaveAttribute(
					'data-truncated',
				),
			);
		});

		it('shortens the crumbs again once the box is too narrow, and stops when it grows back', async () => {
			const { resize } = renderInFrame(<Breadcrumb items={TRAIL.slice(0, 2)} testId="bc" />, 300);
			const nav = screen.getByTestId('bc');

			// Two 100px crumbs and a separator take 210px.
			expect(nav).not.toHaveAttribute('data-shrinking');

			await resize(150);
			await waitFor(() => expect(nav).toHaveAttribute('data-shrinking', BreadcrumbShrink.End));

			await resize(300);
			await waitFor(() => expect(nav).not.toHaveAttribute('data-shrinking'));
		});
	});
});

describe('Breadcrumb maxVisible', () => {
	function renderWith(maxVisible: number | undefined, items = TRAIL) {
		return render(<Breadcrumb items={items} maxVisible={maxVisible} testId="bc" />);
	}

	it('collapses nothing without it, however many crumbs there are', () => {
		renderWith(undefined);

		expect(ellipsis()).toBeNull();
		expect(visibleCrumbs()).toHaveLength(5);
	});

	it.each<[number, string[]]>([
		[5, []],
		[6, []],
		[99, []],
		[4, ['Services']],
		[3, ['Payments', 'Services']],
		[2, ['Payments', 'Services', 'Checkout']],
	])('with a maxVisible of %i collapses %j, whatever the width', (maxVisible, hidden) => {
		renderWith(maxVisible);

		expect(new Set(collapsedTitles())).toEqual(new Set(hidden));
		expect(visibleCrumbs()).toHaveLength(5 - hidden.length);
		expect(visibleTitles()[0]).toBe('Dashboards');
		expect(visibleTitles().at(-1)).toBe('prod-east');
	});

	it.each<[number, string[]]>([
		[5, ['C']],
		[4, ['C', 'D']],
		[3, ['B', 'C', 'D']],
		[2, ['B', 'C', 'D', 'E']],
	])(
		'collapses six crumbs from the centre outward with a maxVisible of %i: %j',
		(maxVisible, hidden) => {
			const six = ['A', 'B', 'C', 'D', 'E', 'F'].map((title) => ({ title, href: `/${title}` }));
			renderWith(maxVisible, six);

			expect(new Set(collapsedTitles())).toEqual(new Set(hidden));
		},
	);

	it.each([1, 0, -3])(
		'never shows fewer than the first and the last, so %i acts as 2',
		(maxVisible) => {
			renderWith(maxVisible);

			expect(visibleTitles()).toEqual(['Dashboards', 'prod-east']);
			expect(collapsedCrumbs()).toHaveLength(3);
		},
	);

	it('rounds a fraction down', () => {
		renderWith(3.9);

		expect(collapsedCrumbs()).toHaveLength(2);
	});

	it('says how many it hides', () => {
		const { rerender } = renderWith(4);
		expect(ellipsis()).toHaveAccessibleName('Show 1 hidden item');

		rerender(<Breadcrumb items={TRAIL} maxVisible={3} testId="bc" />);
		expect(ellipsis()).toHaveAccessibleName('Show 2 hidden items');
	});

	it('marks the trail as overflowing, and as shrinking once only two crumbs are left and do not fit', async () => {
		const { rerender, resize } = renderInFrame(
			<Breadcrumb items={TRAIL} maxVisible={4} testId="bc" />,
			500,
		);
		expect(screen.getByTestId('bc')).toHaveAttribute('data-overflowing');
		expect(screen.getByTestId('bc')).not.toHaveAttribute('data-shrinking');

		// The first crumb, the `...` crumb and the last one need 250px, and the box has 500px.
		rerender(<Breadcrumb items={TRAIL} maxVisible={2} testId="bc" />);
		expect(screen.getByTestId('bc')).not.toHaveAttribute('data-shrinking');

		await resize(200);
		await waitFor(() => expect(screen.getByTestId('bc')).toHaveAttribute('data-shrinking'));
	});

	it('follows the prop when it changes', () => {
		const { rerender } = renderWith(2);
		expect(collapsedCrumbs()).toHaveLength(3);

		rerender(<Breadcrumb items={TRAIL} maxVisible={4} testId="bc" />);
		expect(collapsedCrumbs()).toHaveLength(1);

		rerender(<Breadcrumb items={TRAIL} testId="bc" />);
		expect(collapsedCrumbs()).toHaveLength(0);
		expect(ellipsis()).toBeNull();
	});

	it('collapses the one crumb of a trail of three when it is 2', () => {
		renderWith(2, TRAIL.slice(0, 3));

		expect(collapsedTitles()).toEqual(['Payments']);
	});

	it('leaves a trail of two alone', () => {
		renderWith(2, TRAIL.slice(0, 2));

		expect(ellipsis()).toBeNull();
		expect(visibleCrumbs()).toHaveLength(2);
	});

	it('still collapses to the maxVisible in a box wide enough for every crumb', async () => {
		render(
			<div style={{ width: 2000 }}>
				<Breadcrumb items={TRAIL} maxVisible={3} testId="bc" />
			</div>,
		);

		await settle();
		expect(collapsedCrumbs()).toHaveLength(2);
	});

	it('numbers the crumbs after their place in items when a title is empty', async () => {
		const user = userEvent.setup();
		const items: BreadcrumbItemType[] = [
			{ title: 'A', href: '/a' },
			{ title: '', href: '/hidden' },
			{ title: 'B', href: '/b' },
			{ title: 'C', href: '/c' },
			{ title: 'D', href: '/d' },
			{ title: 'E', href: '/e' },
		];

		renderWith(3, items);

		// Five crumbs stay in the trail: A, B, C, D, E. Collapsing two takes C and then B.
		expect(visibleCrumbs().map((crumb) => crumb.getAttribute('data-testid'))).toEqual([
			'bc-item-0',
			'bc-item-4',
			'bc-item-5',
		]);

		await user.click(screen.getByTestId('bc-ellipsis'));

		const menu = await screen.findByRole('menu');
		expect(
			within(menu)
				.getAllByRole('menuitem')
				.map((row) => [row.textContent, row.getAttribute('data-testid')]),
		).toEqual([
			['B', 'bc-item-2'],
			['C', 'bc-item-3'],
		]);
	});
});

describe('Breadcrumb collapsed crumbs', () => {
	it('stay mounted out of the flow, hidden, inert and without a test id of their own', () => {
		render(<Breadcrumb items={TRAIL} maxVisible={3} testId="bc" />);

		const hidden = collapsedCrumbs();

		expect(hidden).toHaveLength(2);
		for (const crumb of hidden) {
			expect(crumb).toHaveAttribute('aria-hidden', 'true');
			expect(crumb).toHaveAttribute('inert');
			expect(crumb).not.toHaveAttribute('data-testid');
		}
		expect(hidden.map((crumb) => crumb.textContent)).toEqual(['Payments', 'Services']);
	});

	it('are left out of the accessibility tree and the tab order', async () => {
		const user = userEvent.setup();
		render(<Breadcrumb items={TRAIL} maxVisible={3} testId="bc" />);

		expect(screen.queryByRole('link', { name: 'Payments' })).not.toBeInTheDocument();
		expect(screen.queryByRole('link', { name: 'Services' })).not.toBeInTheDocument();
		expect(screen.getAllByRole('link').map((link) => link.textContent)).toEqual([
			'Dashboards',
			'Checkout',
		]);

		await user.tab();
		expect(screen.getByRole('link', { name: 'Dashboards' })).toHaveFocus();
		await user.tab();
		expect(screen.getByTestId('bc-ellipsis')).toHaveFocus();
		await user.tab();
		expect(screen.getByRole('link', { name: 'Checkout' })).toHaveFocus();
		await user.tab();
		expect(
			screen.getByTestId('bc-item-4').querySelector('[data-slot="breadcrumb-item-content"]'),
		).not.toHaveFocus();
	});

	it('hand their test id to the row of the menu', async () => {
		const user = userEvent.setup();
		render(<Breadcrumb items={TRAIL} maxVisible={3} testId="bc" />);

		expect(screen.queryByTestId('bc-item-1')).not.toBeInTheDocument();
		expect(screen.queryByTestId('bc-item-2')).not.toBeInTheDocument();

		await user.click(screen.getByTestId('bc-ellipsis'));
		await screen.findByRole('menu');

		expect(screen.getByTestId('bc-item-1')).toHaveTextContent('Payments');
		expect(screen.getByTestId('bc-item-1')).toHaveAttribute('role', 'menuitem');
		expect(screen.getByTestId('bc-item-2')).toHaveTextContent('Services');
	});

	// A collapsed crumb mounts no menu of its own, so `${testId}-item-${index}-menu` does not point
	// at an element nobody can reach.
	it('leave no test id inside, the menu of a collapsed crumb included', () => {
		render(
			<Breadcrumb
				items={[
					{ title: 'Home', href: '/home' },
					{ title: 'Services', menu: [{ title: 'Checkout', href: '/checkout' }] },
					{ title: 'Now' },
				]}
				maxVisible={2}
				testId="bc"
			/>,
		);

		const [hidden] = collapsedCrumbs();

		expect(hidden?.querySelector('[data-testid]:not(svg)')).toBeNull();
		expect(screen.queryByTestId('bc-item-1-menu')).not.toBeInTheDocument();
	});

	it('give the test id back to the crumb when it is no longer collapsed', () => {
		const { rerender } = render(<Breadcrumb items={TRAIL} maxVisible={3} testId="bc" />);
		expect(screen.queryByTestId('bc-item-1')).not.toBeInTheDocument();

		rerender(<Breadcrumb items={TRAIL} testId="bc" />);

		expect(screen.getByTestId('bc-item-1')).toHaveTextContent('Payments');
		expect(screen.getByTestId('bc-item-1')).not.toHaveAttribute('aria-hidden');
		expect(screen.getByTestId('bc-item-1')).not.toHaveAttribute('inert');
	});
});

describe('Breadcrumb collapsed crumbs and their tooltip', () => {
	// The labels overflow their 100px crumb for real, and the frame is wide enough that only
	// `maxVisible` collapses anything.
	const LONG_TRAIL = TRAIL.map((item) => ({ ...item, title: `${item.title}-production-east-1` }));
	const WIDE = 4000;

	function truncatedFlags(crumbs: HTMLElement[]): boolean[] {
		return crumbs.map(
			(crumb) =>
				crumb
					.querySelector('[data-slot="breadcrumb-item-content"]')
					?.hasAttribute('data-truncated') ?? false,
		);
	}

	it('are not measured, since nobody can hover them', async () => {
		renderInFrame(<Breadcrumb items={LONG_TRAIL} maxVisible={3} testId="bc" />, WIDE);

		await waitFor(() => expect(truncatedFlags(visibleCrumbs())).toEqual([true, true, true]));
		expect(collapsedCrumbs()).toHaveLength(2);
		expect(truncatedFlags(collapsedCrumbs())).toEqual([false, false]);
	});

	it('are measured again once they show, and stop when they collapse again', async () => {
		const { rerender } = renderInFrame(
			<Breadcrumb items={LONG_TRAIL} maxVisible={3} testId="bc" />,
			WIDE,
		);
		await settle();
		expect(truncatedFlags(collapsedCrumbs())).toEqual([false, false]);

		rerender(<Breadcrumb items={LONG_TRAIL} testId="bc" />);

		await waitFor(() =>
			expect(truncatedFlags(visibleCrumbs())).toEqual([true, true, true, true, true]),
		);
		expect(collapsedCrumbs()).toHaveLength(0);

		rerender(<Breadcrumb items={LONG_TRAIL} maxVisible={3} testId="bc" />);

		await waitFor(() => expect(collapsedCrumbs()).toHaveLength(2));
		expect(truncatedFlags(collapsedCrumbs())).toEqual([false, false]);
		expect(truncatedFlags(visibleCrumbs())).toEqual([true, true, true]);
	});
});

describe('Breadcrumb with truncate={false}', () => {
	it('never renders the `...` crumb, however narrow the box', async () => {
		renderInFrame(<Breadcrumb items={TRAIL} truncate={false} testId="bc" />, 100);
		await settle();

		expect(ellipsis()).toBeNull();
		expect(screen.queryByTestId('bc-ellipsis')).not.toBeInTheDocument();
		expect(screen.queryByTestId('bc-ellipsis-separator')).not.toBeInTheDocument();
		expect(collapsedCrumbs()).toHaveLength(0);
		expect(visibleCrumbs()).toHaveLength(5);
		expect(screen.getByTestId('bc')).not.toHaveAttribute('data-overflowing');
		expect(screen.getByTestId('bc')).not.toHaveAttribute('data-shrinking');
	});

	it('ignores maxVisible', () => {
		render(<Breadcrumb items={TRAIL} truncate={false} maxVisible={2} testId="bc" />);

		expect(ellipsis()).toBeNull();
		expect(visibleCrumbs()).toHaveLength(5);
	});

	it('wraps onto more lines instead', async () => {
		renderInFrame(<Breadcrumb items={TRAIL} truncate={false} testId="bc" />, 300);
		await settle();

		const tops = new Set(visibleCrumbs().map((crumb) => crumb.getBoundingClientRect().top));
		expect(tops.size).toBeGreaterThan(1);
	});

	it('stops collapsing when it is switched off', async () => {
		const { rerender } = render(
			<div style={{ width: 300 }}>
				<Breadcrumb items={TRAIL} testId="bc" maxVisible={3} />
			</div>,
		);
		expect(collapsedCrumbs()).toHaveLength(2);

		rerender(
			<div style={{ width: 300 }}>
				<Breadcrumb items={TRAIL} testId="bc" maxVisible={3} truncate={false} />
			</div>,
		);

		await waitFor(() => expect(collapsedCrumbs()).toHaveLength(0));
		expect(ellipsis()).toBeNull();
	});
});

describe('Breadcrumb trails that cannot collapse', () => {
	it.each([1, 2])('leaves a trail of %i crumbs whole, however narrow the box', async (count) => {
		renderInFrame(<Breadcrumb items={TRAIL.slice(0, count)} testId="bc" />, 20);
		await settle();

		expect(ellipsis()).toBeNull();
		expect(visibleCrumbs()).toHaveLength(count);
	});

	it('counts only the crumbs that show, so three with an empty title is a trail of two', async () => {
		renderInFrame(
			<Breadcrumb items={[TRAIL[0], { title: '' }, TRAIL[1]] as BreadcrumbItemType[]} />,
			20,
		);
		await settle();

		expect(ellipsis()).toBeNull();
	});
});
