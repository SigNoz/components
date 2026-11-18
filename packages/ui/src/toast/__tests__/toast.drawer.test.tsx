import { render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { Drawer } from '../../drawer/index.js';
import { useCoverRightEdge } from '../../lib/right-edge-cover.js';
import type { ToastPositionType } from '../index.js';
import { Toaster } from '../toaster.js';

const GAP = 16;

function viewport(position: ToastPositionType): HTMLElement {
	return document.querySelector(
		`[data-slot="toaster"][data-position="${position}"]`,
	) as HTMLElement;
}

function coverOf(position: ToastPositionType): string {
	return viewport(position).style.getPropertyValue('--toast-internal-right-edge-cover');
}

// A ResizeObserver reports a size on the next frame, its first report too. Waiting two frames lets
// every report of a change, and the first one of a new observation, arrive.
function nextFrames(): Promise<void> {
	return new Promise((resolve) =>
		requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
	);
}

function panelWidth(): number {
	const panel = document.querySelector('[data-slot="drawer-popup"]') as HTMLElement;
	return panel.getBoundingClientRect().width;
}

function Page({ open }: { open: boolean }) {
	return (
		<>
			<Toaster />
			<Drawer type="inspector" stack="overlay" title="Span" open={open} onClose={() => {}}>
				Details
			</Drawer>
		</>
	);
}

describe('toast beside an open drawer', () => {
	beforeEach(() => {
		document.body.style.setProperty('--drawer-viewport-padding', `${GAP}px`);
	});

	afterEach(async () => {
		document.body.style.removeProperty('--drawer-viewport-padding');
		document.body.style.removeProperty('--toast-viewport-transition-duration');
		// The default viewport of the browser tests.
		await page.viewport(414, 896);
	});

	it('moves the right stacks by the width the drawer covers', () => {
		render(<Page open />);

		const cover = `${panelWidth() + GAP}px`;
		expect(coverOf('top-right')).toBe(cover);
		expect(coverOf('bottom-right')).toBe(cover);
	});

	it('counts the distance from a container that holds the drawer to the window edge', () => {
		// The transform makes the box the containing block of the fixed drawer viewport.
		const box = document.createElement('div');
		box.style.cssText =
			'position: fixed; top: 0; right: 20px; width: 50%; height: 300px; transform: translateZ(0)';
		document.body.append(box);
		render(
			<>
				<Toaster />
				<Drawer
					type="inspector"
					stack="overlay"
					title="Span"
					open
					onClose={() => {}}
					container={box}
				>
					Details
				</Drawer>
			</>,
		);

		const outside = document.documentElement.clientWidth - box.getBoundingClientRect().right;
		expect(outside).toBeGreaterThan(0);
		expect(coverOf('top-right')).toBe(`${panelWidth() + (outside + GAP)}px`);
		box.remove();
	});

	it('reads the distance to the window edge again as the window resizes', async () => {
		await page.viewport(1280, 800);
		// Fixed to the left of the window, so a resize moves its right edge while the drawer inside
		// keeps its max width.
		const box = document.createElement('div');
		box.style.cssText =
			'position: fixed; top: 0; left: 0; width: 700px; height: 300px; transform: translateZ(0)';
		document.body.append(box);
		render(
			<>
				<Toaster />
				<Drawer
					type="inspector"
					stack="overlay"
					title="Span"
					open
					onClose={() => {}}
					container={box}
				>
					Details
				</Drawer>
			</>,
		);
		const width = panelWidth();
		const outside = (): number => document.documentElement.clientWidth - 700;
		expect(coverOf('top-right')).toBe(`${width + (outside() + GAP)}px`);

		await page.viewport(1100, 800);

		expect(outside()).toBeLessThan(1280 - 700);
		await expect.poll(() => coverOf('top-right')).toBe(`${width + (outside() + GAP)}px`);
		expect(panelWidth()).toBe(width);
		box.remove();
	});

	it('reads the distance to the window edge again as the container resizes', async () => {
		await page.viewport(1280, 800);
		const box = document.createElement('div');
		box.style.cssText =
			'position: fixed; top: 0; left: 0; width: 700px; height: 300px; transform: translateZ(0)';
		document.body.append(box);
		render(
			<>
				<Toaster />
				<Drawer
					type="inspector"
					stack="overlay"
					title="Span"
					open
					onClose={() => {}}
					container={box}
				>
					Details
				</Drawer>
			</>,
		);
		const width = panelWidth();

		box.style.width = '600px';

		const outside = document.documentElement.clientWidth - 600;
		await expect.poll(() => coverOf('top-right')).toBe(`${width + (outside + GAP)}px`);
		expect(panelWidth()).toBe(width);
		box.remove();
	});

	it('places a stack that shares a container with the drawer beside it', async () => {
		await page.viewport(1280, 800);
		document.body.style.setProperty('--toast-viewport-transition-duration', '0s');
		// 40px from the window edge, which the drawer counts and the stack, placed in the same box,
		// must not count again.
		const box = document.createElement('div');
		box.style.cssText =
			'position: fixed; top: 0; right: 40px; width: 1000px; height: 300px; transform: translateZ(0)';
		document.body.append(box);
		render(
			<>
				<Toaster offset={8} container={box} />
				<Drawer
					type="inspector"
					stack="overlay"
					title="Span"
					open
					onClose={() => {}}
					container={box}
				>
					Details
				</Drawer>
			</>,
		);

		const right = Number.parseFloat(getComputedStyle(viewport('top-right')).right);
		expect(right).toBeCloseTo(8 + panelWidth() + GAP, 1);
		box.remove();
	});

	it('keeps a stack beside the drawer as the container they share resizes', async () => {
		await page.viewport(1280, 800);
		document.body.style.setProperty('--toast-viewport-transition-duration', '0s');
		// Fixed to the left of the window, so growing it moves its right edge closer to the window's.
		const box = document.createElement('div');
		box.style.cssText =
			'position: fixed; top: 0; left: 0; width: 1000px; height: 300px; transform: translateZ(0)';
		document.body.append(box);
		render(
			<>
				<Toaster offset={8} container={box} />
				<Drawer
					type="inspector"
					stack="overlay"
					title="Span"
					open
					onClose={() => {}}
					container={box}
				>
					Details
				</Drawer>
			</>,
		);
		const right = (): number => Number.parseFloat(getComputedStyle(viewport('top-right')).right);
		await nextFrames();
		expect(right()).toBeCloseTo(8 + panelWidth() + GAP, 1);

		box.style.width = '1100px';
		await nextFrames();

		// The drawer reports a cover 100px narrower, and the stack's box ends 100px closer to the
		// window edge, so the stack keeps its place.
		expect(right()).toBeCloseTo(8 + panelWidth() + GAP, 1);
		box.remove();
	});

	it('moves the right stacks back as soon as the drawer starts closing', () => {
		const { rerender } = render(<Page open />);
		rerender(<Page open={false} />);

		expect(coverOf('top-right')).toBe('');
		expect(coverOf('bottom-right')).toBe('');
	});

	it('leaves the right stacks alone while no drawer is open', () => {
		render(<Page open={false} />);

		expect(coverOf('top-right')).toBe('');
	});
});

function Cover({ width }: { width: number }): null {
	useCoverRightEdge(width);
	return null;
}

describe('toast stack beside a covered right edge', () => {
	// No transition, so the computed place is the final one. A narrow toast, so it fits beside a
	// cover in the test window.
	beforeEach(() => {
		document.body.style.setProperty('--toast-viewport-transition-duration', '0s');
		document.body.style.setProperty('--toast-viewport-inline-size', '100px');
	});

	afterEach(async () => {
		document.body.style.removeProperty('--toast-viewport-transition-duration');
		document.body.style.removeProperty('--toast-viewport-inline-size');
		document.body.style.removeProperty('--toast-viewport-max-inline-size');
		await page.viewport(414, 896);
	});

	it('sits one offset left of the cover', () => {
		render(
			<>
				<Toaster offset={8} />
				<Cover width={200} />
			</>,
		);

		expect(getComputedStyle(viewport('top-right')).right).toBe('208px');
		expect(getComputedStyle(viewport('bottom-right')).right).toBe('208px');
	});

	it('leaves the left and center stacks where they are', () => {
		const { rerender } = render(<Toaster offset={8} />);
		const before = (['top-left', 'top-center', 'bottom-left', 'bottom-center'] as const).map(
			(position) => viewport(position).getBoundingClientRect().left,
		);

		rerender(
			<>
				<Toaster offset={8} />
				<Cover width={200} />
			</>,
		);

		const after = (['top-left', 'top-center', 'bottom-left', 'bottom-center'] as const).map(
			(position) => viewport(position).getBoundingClientRect().left,
		);
		expect(after).toEqual(before);
	});

	it('stops one offset from the left edge where it does not fit beside the cover', () => {
		render(
			<>
				<Toaster offset={8} />
				<Cover width={window.innerWidth} />
			</>,
		);

		const containingWidth = document.documentElement.clientWidth;
		expect(getComputedStyle(viewport('top-right')).right).toBe(`${containingWidth - 100 - 8}px`);
	});

	it('fits beside the cover by the width a max size caps the toast at', () => {
		document.body.style.setProperty('--toast-viewport-max-inline-size', '60px');
		const containingWidth = document.documentElement.clientWidth;
		// Room for the 60px the toast renders at, with 10px to spare, but not for its 100px.
		render(
			<>
				<Toaster offset={8} />
				<Cover width={containingWidth - 8 - 60 - 8 - 10} />
			</>,
		);

		expect(viewport('top-right').getBoundingClientRect().width).toBe(60);
		expect(getComputedStyle(viewport('top-right')).right).toBe(
			`${containingWidth - 60 - 8 - 10}px`,
		);
	});

	it('keeps its place with a keyword max size', () => {
		document.body.style.setProperty('--toast-viewport-max-inline-size', 'none');
		const { rerender } = render(<Toaster offset={8} />);

		expect(getComputedStyle(viewport('top-right')).right).toBe('8px');

		rerender(
			<>
				<Toaster offset={8} />
				<Cover width={200} />
			</>,
		);
		expect(getComputedStyle(viewport('top-right')).right).toBe('208px');
	});

	it('counts the cover from the edge of the container the stack is placed in', async () => {
		await page.viewport(1280, 800);
		const box = document.createElement('div');
		box.style.cssText =
			'position: fixed; top: 0; right: 40px; width: 600px; height: 300px; transform: translateZ(0)';
		document.body.append(box);
		const inset = document.documentElement.clientWidth - box.getBoundingClientRect().right;
		render(
			<>
				<Toaster offset={8} container={box} />
				<Cover width={inset + 200} />
			</>,
		);

		expect(getComputedStyle(viewport('top-right')).right).toBe('208px');
		box.remove();
	});

	it('reads the distance from its container to the window edge again as the window resizes', async () => {
		await page.viewport(1280, 800);
		// Fixed to the left of the window, so a resize moves its right edge.
		const box = document.createElement('div');
		box.style.cssText =
			'position: fixed; top: 0; left: 0; width: 600px; height: 300px; transform: translateZ(0)';
		document.body.append(box);
		// Ends 200px inside the box once the window is 1100px wide.
		const cover = 1100 - 600 + 200;
		render(
			<>
				<Toaster offset={8} container={box} />
				<Cover width={cover} />
			</>,
		);

		await page.viewport(1100, 800);

		const inset = document.documentElement.clientWidth - 600;
		await expect
			.poll(() => getComputedStyle(viewport('top-right')).right)
			.toBe(`${cover - inset + 8}px`);
		box.remove();
	});

	it('reads the distance from its container to the window edge again as the container resizes', async () => {
		await page.viewport(1280, 800);
		const box = document.createElement('div');
		box.style.cssText =
			'position: fixed; top: 0; left: 0; width: 600px; height: 300px; transform: translateZ(0)';
		document.body.append(box);
		const root = document.documentElement;
		// Ends 200px inside the box once it is 700px wide.
		const cover = root.clientWidth - 700 + 200;
		render(
			<>
				<Toaster offset={8} container={box} />
				<Cover width={cover} />
			</>,
		);
		await nextFrames();

		box.style.width = '700px';

		await expect
			.poll(() => getComputedStyle(viewport('top-right')).right)
			.toBe(`${cover - (root.clientWidth - 700) + 8}px`);
		box.remove();
	});

	it('keeps the offset alone with no cover', () => {
		render(<Toaster offset={8} />);

		expect(getComputedStyle(viewport('top-right')).right).toBe('8px');
	});
});
