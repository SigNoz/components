import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { ToastPositionType } from '../index.js';
import { toast } from '../toast.js';
import { Toaster } from '../toaster.js';
import { findToast, raise, slot, titles, toasts } from './toast.test-utils.js';

function limited(): number {
	return toasts().filter((item) => item.hasAttribute('data-limited')).length;
}

function edgesOf(element: HTMLElement, edges: string[]): Record<string, string> {
	const style = getComputedStyle(element);

	return Object.fromEntries(edges.map((edge) => [edge, style.getPropertyValue(edge)]));
}

function raiseFive(): void {
	raise(() => {
		for (const n of [1, 2, 3, 4, 5]) toast.info(`Toast ${n}`);
	});
}

describe('toast stack', () => {
	it('puts the newest first', async () => {
		render(<Toaster />);
		raise(() => {
			toast.info('first');
			toast.info('second');
		});
		await findToast('second');

		expect(titles()).toEqual(['second', 'first']);
	});

	describe('limit', () => {
		it('shows three toasts and holds the oldest back', async () => {
			render(<Toaster />);
			raiseFive();
			await findToast('Toast 5');

			expect(toasts()).toHaveLength(5);
			expect(limited()).toBe(2);
			expect(toasts().at(-1)).toHaveAttribute('data-limited');
			expect(toasts()[0]).not.toHaveAttribute('data-limited');
		});

		it('takes the limit of the Toaster', async () => {
			render(<Toaster limit={1} />);
			raiseFive();
			await findToast('Toast 5');

			expect(limited()).toBe(4);
		});

		it('shows a held-back toast once a visible one closes', async () => {
			render(<Toaster limit={1} />);
			raise(() => {
				toast.info('Old', { id: 'old' });
				toast.info('New', { id: 'new' });
			});
			const old = await findToast('Old');
			expect(old).toHaveAttribute('data-limited');

			raise(() => toast.dismiss('new'));

			await expect.poll(() => old.hasAttribute('data-limited')).toBe(false);
		});
	});

	describe('position', () => {
		it('stacks top-right by default', () => {
			render(<Toaster />);

			expect(slot('toaster')).toHaveAttribute('data-position', 'top-right');
		});

		// The default offset is a design token, which the tests do not load, so they set their own.
		it.each<[ToastPositionType, string[]]>([
			['top-left', ['top', 'left']],
			['top-right', ['top', 'right']],
			['bottom-left', ['bottom', 'left']],
			['bottom-right', ['bottom', 'right']],
			['top-center', ['top']],
			['bottom-center', ['bottom']],
		])('sits against the edges %s names', (position, edges) => {
			render(<Toaster position={position} offset={16} />);

			const viewport = slot('toaster') as HTMLElement;
			expect(viewport).toHaveAttribute('data-position', position);
			expect(edgesOf(viewport, edges)).toEqual(
				Object.fromEntries(edges.map((edge) => [edge, '16px'])),
			);
		});

		it('centres the stack for a centre position', () => {
			render(<Toaster position="top-center" />);

			const { left, width } = (slot('toaster') as HTMLElement).getBoundingClientRect();
			expect(left + width / 2).toBeCloseTo(window.innerWidth / 2, 0);
		});
	});

	describe('offset', () => {
		it('writes a number as px on the edges the stack sits against', () => {
			render(<Toaster position="bottom-left" offset={32} />);

			expect(edgesOf(slot('toaster') as HTMLElement, ['bottom', 'left'])).toEqual({
				bottom: '32px',
				left: '32px',
			});
		});

		it('takes a CSS length as it is', () => {
			render(<Toaster offset="3rem" />);

			const rem = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
			expect(getComputedStyle(slot('toaster') as HTMLElement).top).toBe(`${3 * rem}px`);
		});

		it('keeps the inline style of the caller next to it', () => {
			render(<Toaster offset={8} style={{ opacity: 0.99 }} />);

			const viewport = slot('toaster') as HTMLElement;
			expect(viewport).toHaveStyle({ opacity: '0.99' });
			expect(getComputedStyle(viewport).top).toBe('8px');
		});
	});
});
