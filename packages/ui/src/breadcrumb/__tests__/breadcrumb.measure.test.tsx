import { render, screen } from '@testing-library/react';
import type { CSSProperties } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Breadcrumb } from '../breadcrumb.js';
import { BREADCRUMB_COLLAPSE_HYSTERESIS_PX } from '../constants.js';
import type { BreadcrumbItemType } from '../types.js';
import {
	collapsedCrumbs,
	ellipsis,
	Frame,
	PINNED_PARTS,
	renderInFrame,
	settle,
	TRAIL,
} from './breadcrumb.test-utils.js';

/**
 * The whole trail the hook measured, in layout pixels: what it writes on the measuring row, less
 * the room it adds for the hysteresis.
 */
function measuredTrail(): number {
	const row = document.querySelector<HTMLElement>('[data-slot="breadcrumb-measure"]');

	return (
		Number.parseFloat(row?.style.getPropertyValue('--breadcrumb-internal-full-width') ?? '') -
		BREADCRUMB_COLLAPSE_HYSTERESIS_PX
	);
}

describe('Breadcrumb measure under a box of its own', () => {
	// The five crumbs of `TRAIL` need 540px, and 470px with one collapsed.
	const ROOMS = [
		['padding', '[data-slot="breadcrumb"] { box-sizing: content-box; padding: 0 16px; }'],
		[
			'border',
			'[data-slot="breadcrumb"] { box-sizing: content-box; border: 0 solid; border-inline-width: 16px; }',
		],
		[
			'padding and border',
			'[data-slot="breadcrumb"] { box-sizing: content-box; padding: 0 8px; border: 0 solid; border-inline-width: 8px; }',
		],
	] as const;

	it.each(ROOMS)(
		'reads the trail at its own size with %s on the <nav>, whatever the box model',
		async (_name, css) => {
			// 32px go to the box, so 560px leave 528px for a trail that needs 540px.
			render(
				<Frame size={560}>
					<style>{css}</style>
					<Breadcrumb items={TRAIL} />
				</Frame>,
			);
			await settle();

			expect(measuredTrail()).toBeCloseTo(540, 1);
			expect(collapsedCrumbs()).toHaveLength(1);
		},
	);

	it.each(ROOMS)(
		'keeps the whole trail with %s on the <nav> once the room is there',
		async (_name, css) => {
			render(
				<Frame size={572}>
					<style>{css}</style>
					<Breadcrumb items={TRAIL} />
				</Frame>,
			);
			await settle();

			expect(measuredTrail()).toBeCloseTo(540, 1);
			expect(collapsedCrumbs()).toHaveLength(0);
		},
	);

	it.each([0.8, 1.25])(
		'reads the trail at its own size with padding on the <nav> under a scale of %f',
		async (scale) => {
			render(
				<div style={{ transform: `scale(${scale})`, transformOrigin: '0 0' }}>
					<Frame size={560}>
						<style>{ROOMS[0][1]}</style>
						<Breadcrumb items={TRAIL} />
					</Frame>
				</div>,
			);
			await settle();

			expect(measuredTrail()).toBeCloseTo(540, 1);
			expect(collapsedCrumbs()).toHaveLength(1);
		},
	);

	it.each([0.8, 1.25])('reads the trail at its own size under a scale of %f', async (scale) => {
		render(
			<div style={{ transform: `scale(${scale})`, transformOrigin: '0 0' }}>
				<Frame size={560}>
					<Breadcrumb items={TRAIL} />
				</Frame>
			</div>,
		);
		await settle();

		expect(measuredTrail()).toBeCloseTo(540, 1);
		expect(collapsedCrumbs()).toHaveLength(0);
	});

	// `offsetWidth` is a whole number of pixels, as is the `clientWidth` the room is read from, so a
	// box of 470.4px is 470px for both and the rounding cancels out.
	it.each([
		[468.6, 2],
		[470.4, 1],
		[539.4, 1],
		[540.4, 0],
	])('collapses the same crumbs in a box of %fpx, at any scale', async (size, collapsed) => {
		for (const scale of [1, 0.9, 1.25]) {
			const { unmount } = render(
				<div style={{ transform: `scale(${scale})`, transformOrigin: '0 0' }}>
					<Frame size={size}>
						<Breadcrumb items={TRAIL} />
					</Frame>
				</div>,
			);
			await settle();

			expect(collapsedCrumbs()).toHaveLength(collapsed);
			unmount();
		}
	});
});

describe('Breadcrumb measure with a label cap that is a percentage', () => {
	const PLAIN: BreadcrumbItemType[] = [
		{ title: 'Home', href: '/' },
		{ title: 'checkout-service-production-east-1-canary' },
	];
	const WITH_PARTS: BreadcrumbItemType[] = [
		{ title: 'Home', href: '/', icon: <svg width="14" height="14" /> },
		{
			title: 'checkout-service-production-east-1-canary',
			icon: <svg width="14" height="14" />,
			menu: [{ title: 'Orders', href: '/orders' }],
		},
	];

	function renderTrail(
		items: BreadcrumbItemType[],
		width: number,
		cap: string,
	): ReturnType<typeof render> {
		const style = {
			width,
			'--spacing-1': '2px',
			'--spacing-2': '4px',
			'--breadcrumb-item-max-width': cap,
		} as CSSProperties;

		return render(
			<div style={style}>
				<style>{PINNED_PARTS}</style>
				<Breadcrumb items={items} testId="bc" />
			</div>,
		);
	}

	function drawnTrail(): number {
		return (
			screen.getByTestId('bc-item-1').getBoundingClientRect().right -
			screen.getByTestId('bc-item-0').getBoundingClientRect().left
		);
	}

	// A percentage of the content cuts the label to a share of the crumb, but the crumb takes the
	// width of the whole label: it does not depend on the cap while it sizes itself.
	describe.each([
		['a label alone', PLAIN],
		['an icon, a padding and a chevron around the label', WITH_PARTS],
	])('with %s', (_name, items) => {
		it.each(['50%', '30%', 'calc(50% + 4px)'])(
			'measures the trail at the width the layout gives it with a cap of %s',
			async (cap) => {
				const wide = renderTrail(items, 2000, cap);
				await settle();
				const natural = drawnTrail();
				wide.unmount();

				expect(natural).toBeGreaterThan(300);

				// At every width the trail reads the same, shortened or not. The last digit of a label
				// width is rounded, so a pixel is the most it moves.
				for (const width of [400, 300, 150]) {
					const { unmount } = renderTrail(items, width, cap);
					await settle();

					expect(Math.abs(measuredTrail() - natural)).toBeLessThanOrEqual(1);
					unmount();
				}
			},
		);
	});

	it('settles on one shrink state, and stays on it, in a box between the two sizes of the trail', async () => {
		renderTrail(PLAIN, 300, '50%');
		await settle();

		const nav = screen.getByTestId('bc');
		const seen = new Set<string | null>();

		for (let frame = 0; frame < 10; frame++) {
			await new Promise((resolve) => requestAnimationFrame(resolve));
			seen.add(nav.getAttribute('data-shrinking'));
		}

		expect(Array.from(seen)).toEqual(['end']);
	});
});

describe('Breadcrumb measure observer', () => {
	// What only the observer of the trail watches. A label has a second observer, which starts again
	// whenever its crumb collapses or expands.
	const TRAIL_PARTS =
		'[data-slot="breadcrumb"], [data-slot="breadcrumb-item"], [data-slot^="breadcrumb-measure-"]';

	afterEach(() => {
		vi.restoreAllMocks();
	});

	/**
	 * Watches the `ResizeObserver` of the trail, the one that observes the `<nav>`. The labels have
	 * observers of their own, so the calls are told apart by their target.
	 */
	function watchTrail() {
		const observe = vi.spyOn(ResizeObserver.prototype, 'observe');
		const disconnect = vi.spyOn(ResizeObserver.prototype, 'disconnect');
		const trails = new Set<unknown>();
		const observed = (selector: string): HTMLElement[] =>
			observe.mock.calls
				.map(([target]) => target as HTMLElement)
				.filter((target) => target.matches(selector));
		const remember = (): void => {
			for (const [call, [target]] of observe.mock.calls.entries()) {
				if ((target as HTMLElement).matches('[data-slot="breadcrumb"]')) {
					trails.add(observe.mock.contexts[call]);
				}
			}
		};

		return {
			observed,
			/** How many times the observer of the trail was built, since the last `reset`. */
			built: (): number => observed('[data-slot="breadcrumb"]').length,
			/** The observers of the trail that were disconnected since the last `reset`. */
			disconnected: (): unknown[] => {
				remember();

				return disconnect.mock.contexts.filter((context) => trails.has(context));
			},
			reset: (): void => {
				remember();
				observe.mockClear();
				disconnect.mockClear();
			},
		};
	}

	it.each([
		[4, 3],
		[3, 2],
		[2, undefined],
		[undefined, 3],
	])(
		'keeps the observer, and watches nothing again, when maxVisible goes from %s to %s',
		async (from, to) => {
			const trail = watchTrail();
			const { rerender } = renderInFrame(<Breadcrumb items={TRAIL} maxVisible={from} />, 2000);
			await settle();
			expect(trail.built()).toBe(1);

			trail.reset();
			rerender(<Breadcrumb items={TRAIL} maxVisible={to} />);
			await settle();

			expect(trail.disconnected()).toEqual([]);
			expect(trail.built()).toBe(0);
			expect(trail.observed(TRAIL_PARTS)).toEqual([]);
		},
	);

	it('watches only the crumb that mounts when a crumb is added', async () => {
		const trail = watchTrail();
		const { rerender } = renderInFrame(<Breadcrumb items={TRAIL} maxVisible={3} />, 2000);
		await settle();

		trail.reset();
		rerender(<Breadcrumb items={[...TRAIL, { title: 'extra' }]} maxVisible={3} />);
		await settle();

		expect(trail.disconnected()).toEqual([]);
		expect(trail.built()).toBe(0);
		expect(trail.observed('[data-slot="breadcrumb-item"]')).toHaveLength(1);
	});

	it('still collapses to the new maxVisible, and expands back to what fits, when it changes', async () => {
		// The trail needs 470px with one crumb collapsed, and expanding back from two takes the 4px of
		// hysteresis on top.
		const { rerender } = renderInFrame(<Breadcrumb items={TRAIL} />, 480);
		await settle();
		expect(collapsedCrumbs()).toHaveLength(1);

		rerender(<Breadcrumb items={TRAIL} maxVisible={3} />);
		await settle();
		expect(collapsedCrumbs()).toHaveLength(2);
		expect(ellipsis()).toHaveAccessibleName('Show 2 hidden items');

		rerender(<Breadcrumb items={TRAIL} />);
		await settle();
		expect(collapsedCrumbs()).toHaveLength(1);
		expect(ellipsis()).toHaveAccessibleName('Show 1 hidden item');
	});
});
