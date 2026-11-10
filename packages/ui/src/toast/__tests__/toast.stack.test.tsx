import { render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import type { ToastOffset, ToastPositionType } from '../index.js';
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

const OFFSET_TOKENS = [
	'--toast-viewport-offset',
	'--toast-viewport-offset-top',
	'--toast-viewport-offset-right',
	'--toast-viewport-offset-bottom',
	'--toast-viewport-offset-left',
	'--strip',
];

// The viewport is portalled into `body`, so a token reaches it only from there.
function setTokens(tokens: Record<string, string>): void {
	for (const [name, value] of Object.entries(tokens)) {
		document.body.style.setProperty(name, value);
	}
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

	describe('offset per edge', () => {
		afterEach(() => {
			for (const name of OFFSET_TOKENS) document.body.style.removeProperty(name);
		});

		it('sets each edge the object names', () => {
			render(<Toaster position="bottom-right" offset={{ bottom: 48, right: 8 }} />);

			expect(edgesOf(slot('toaster') as HTMLElement, ['bottom', 'right'])).toEqual({
				bottom: '48px',
				right: '8px',
			});
		});

		it('takes a number as px and a string as a CSS length, per edge', () => {
			render(<Toaster position="top-left" offset={{ top: 12, left: '2rem' }} />);

			const rem = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
			expect(edgesOf(slot('toaster') as HTMLElement, ['top', 'left'])).toEqual({
				top: '12px',
				left: `${2 * rem}px`,
			});
		});

		it('resolves a variable from an ancestor of the viewport', () => {
			setTokens({ '--strip': '24px' });
			render(
				<Toaster position="bottom-right" offset={{ bottom: 'calc(var(--strip, 0px) + 2rem)' }} />,
			);

			const rem = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
			expect(getComputedStyle(slot('toaster') as HTMLElement).bottom).toBe(`${24 + 2 * rem}px`);
		});

		it('keeps 0 as an offset instead of falling back', () => {
			setTokens({ '--toast-viewport-offset': '20px' });
			render(<Toaster offset={{ top: 0 }} />);

			expect(edgesOf(slot('toaster') as HTMLElement, ['top', 'right'])).toEqual({
				top: '0px',
				right: '20px',
			});
		});

		it('leaves an edge the object omits on --toast-viewport-offset', () => {
			setTokens({ '--toast-viewport-offset': '20px' });
			render(<Toaster position="bottom-right" offset={{ bottom: 48 }} />);

			expect(edgesOf(slot('toaster') as HTMLElement, ['bottom', 'right'])).toEqual({
				bottom: '48px',
				right: '20px',
			});
		});

		it('skips an edge that is null or undefined, as an untyped caller can pass', () => {
			setTokens({ '--toast-viewport-offset': '20px' });
			render(
				<Toaster
					offset={{ top: null, right: undefined } as unknown as ToastOffset}
					position="top-right"
				/>,
			);

			expect(edgesOf(slot('toaster') as HTMLElement, ['top', 'right'])).toEqual({
				top: '20px',
				right: '20px',
			});
		});

		it('lets --toast-viewport-offset-<edge> beat the prop, whichever form it takes', () => {
			setTokens({ '--toast-viewport-offset-bottom': '5px' });
			const { rerender } = render(<Toaster position="bottom-right" offset={{ bottom: 48 }} />);
			const viewport = slot('toaster') as HTMLElement;
			expect(getComputedStyle(viewport).bottom).toBe('5px');

			rerender(<Toaster position="bottom-right" offset={48} />);
			expect(edgesOf(viewport, ['bottom', 'right'])).toEqual({ bottom: '5px', right: '48px' });
		});

		it('lets the prop of an edge beat --toast-viewport-offset', () => {
			setTokens({ '--toast-viewport-offset': '20px' });
			render(<Toaster position="top-right" offset={{ top: 48 }} />);

			expect(edgesOf(slot('toaster') as HTMLElement, ['top', 'right'])).toEqual({
				top: '48px',
				right: '20px',
			});
		});

		it('still lets --toast-viewport-offset beat a single value', () => {
			setTokens({ '--toast-viewport-offset': '20px' });
			render(<Toaster position="bottom-left" offset={48} />);

			expect(edgesOf(slot('toaster') as HTMLElement, ['bottom', 'left'])).toEqual({
				bottom: '20px',
				left: '20px',
			});
		});

		it('reads only top or bottom on a centre position', () => {
			setTokens({ '--toast-viewport-offset': '16px' });
			render(<Toaster position="top-center" offset={{ top: 8, left: 100 }} />);

			const viewport = slot('toaster') as HTMLElement;
			const { left, width } = viewport.getBoundingClientRect();
			expect(getComputedStyle(viewport).top).toBe('8px');
			expect(left + width / 2).toBeCloseTo(window.innerWidth / 2, 0);
		});

		describe('width', () => {
			it('stops the stack short of the window by the larger of left and right', () => {
				render(<Toaster offset={{ left: 10, right: 30, top: 8 }} />);

				expect(getComputedStyle(slot('toaster') as HTMLElement).maxInlineSize).toBe(
					`${window.innerWidth - 60}px`,
				);
			});

			it('keeps the cap of a single value', () => {
				render(<Toaster offset={12} />);

				expect(getComputedStyle(slot('toaster') as HTMLElement).maxInlineSize).toBe(
					`${window.innerWidth - 24}px`,
				);
			});

			it('keeps the cap when top or bottom is a keyword', () => {
				render(<Toaster offset={{ top: 'auto', left: 10, right: 10 }} />);

				expect(getComputedStyle(slot('toaster') as HTMLElement).maxInlineSize).toBe(
					`${window.innerWidth - 20}px`,
				);
			});
		});

		it('keeps the inline style of the caller next to it', () => {
			render(<Toaster offset={{ top: 8 }} style={{ opacity: 0.99 }} />);

			const viewport = slot('toaster') as HTMLElement;
			expect(viewport).toHaveStyle({ opacity: '0.99' });
			expect(getComputedStyle(viewport).top).toBe('8px');
		});
	});
});
