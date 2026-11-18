import { render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
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

	afterEach(() => {
		document.body.style.removeProperty('--drawer-viewport-padding');
	});

	it('moves the right stacks by the width the drawer covers', () => {
		render(<Page open />);

		const cover = `${panelWidth() + GAP}px`;
		expect(coverOf('top-right')).toBe(cover);
		expect(coverOf('bottom-right')).toBe(cover);
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

	afterEach(() => {
		document.body.style.removeProperty('--toast-viewport-transition-duration');
		document.body.style.removeProperty('--toast-viewport-inline-size');
		document.body.style.removeProperty('--toast-viewport-max-inline-size');
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

	it('keeps the offset alone with no cover', () => {
		render(<Toaster offset={8} />);

		expect(getComputedStyle(viewport('top-right')).right).toBe('8px');
	});
});
