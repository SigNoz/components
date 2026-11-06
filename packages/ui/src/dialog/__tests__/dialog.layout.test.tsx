import { screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import type { DialogWidthType } from '../types.js';
import { renderOpenDialog } from './dialog.test-utils.js';

/**
 * The design tokens are not loaded here, so the spacing the dialog reads is declared in the test
 * with the numbers `@signozhq/design-tokens` ships.
 */
let tokens: HTMLStyleElement;

const DEFAULT_VIEWPORT = { width: 414, height: 896 };

beforeEach(() => {
	tokens = document.createElement('style');
	tokens.textContent = `:root {
		--spacing-3: 6px;
		--spacing-4: 8px;
		--spacing-6: 12px;
		--spacing-8: 16px;
		--spacing-12: 24px;
		--radius-2: 4px;
		--paragraph-base-400-line-height: 20px;
	}`;
	document.head.append(tokens);
});

afterEach(async () => {
	tokens.remove();
	await page.viewport(DEFAULT_VIEWPORT.width, DEFAULT_VIEWPORT.height);
});

function rect(element: HTMLElement): DOMRect {
	return element.getBoundingClientRect();
}

describe('Dialog width', () => {
	it.each<[DialogWidthType, number]>([
		['narrow', 384],
		['base', 512],
		['wide', 672],
		['extra-wide', 820],
	])('is %s: at most %ipx wide, centered', async (width, pixels) => {
		await page.viewport(1280, 800);
		await renderOpenDialog({ width });
		const panel = rect(screen.getByRole('dialog'));

		expect(panel.width).toBeCloseTo(pixels, 0);
		expect(panel.left + panel.right).toBeCloseTo(window.innerWidth, 0);
	});

	it('is full: the viewport minus 16px on each side', async () => {
		await page.viewport(1280, 800);
		await renderOpenDialog({ width: 'full' });
		const panel = rect(screen.getByRole('dialog'));

		expect(panel.left).toBeCloseTo(16, 0);
		expect(window.innerWidth - panel.right).toBeCloseTo(16, 0);
	});

	it.each<DialogWidthType>(['narrow', 'base', 'wide', 'extra-wide', 'full'])(
		'shrinks %s before it overflows a narrow screen, keeping 16px from each edge',
		async (width) => {
			await page.viewport(320, 700);
			await renderOpenDialog({ width: width === 'narrow' ? 'wide' : width });
			const panel = rect(screen.getByRole('dialog'));

			expect(panel.left).toBeGreaterThanOrEqual(16 - 0.5);
			expect(window.innerWidth - panel.right).toBeGreaterThanOrEqual(16 - 0.5);
		},
	);
});

describe('Dialog overflow', () => {
	const TALL = <div style={{ height: '3000px' }}>Tall content</div>;

	it('never grows past the viewport height minus 16px on each side', async () => {
		await renderOpenDialog({ children: TALL, footerSuffix: <button type="button">Save</button> });
		const panel = rect(screen.getByRole('dialog'));

		expect(panel.top).toBeGreaterThanOrEqual(16 - 0.5);
		expect(panel.bottom).toBeLessThanOrEqual(window.innerHeight - 16 + 0.5);
		expect(panel.height).toBeLessThanOrEqual(window.innerHeight - 32 + 0.5);
	});

	it('scrolls the body, and keeps the header and the footer in place', async () => {
		await renderOpenDialog({ children: TALL, footerSuffix: <button type="button">Save</button> });
		const body = screen.getByTestId('dialog-body');
		const panel = rect(screen.getByRole('dialog'));
		const header = rect(screen.getByTestId('dialog-header'));
		const footer = rect(screen.getByTestId('dialog-footer'));

		expect(getComputedStyle(body).overflowY).toBe('auto');
		expect(body.scrollHeight).toBeGreaterThan(body.clientHeight);
		expect(header.top).toBeGreaterThanOrEqual(panel.top - 0.5);
		expect(footer.bottom).toBeLessThanOrEqual(panel.bottom + 0.5);

		body.scrollTop = 500;

		expect(rect(screen.getByTestId('dialog-header')).top).toBeCloseTo(header.top, 0);
		expect(rect(screen.getByTestId('dialog-footer')).top).toBeCloseTo(footer.top, 0);
		expect(body.scrollTop).toBe(500);
	});

	it('keeps the close button reachable on a body that scrolls', async () => {
		await renderOpenDialog({ children: TALL });
		const body = screen.getByTestId('dialog-body');

		body.scrollTop = 500;
		const close = rect(screen.getByRole('button', { name: 'Close' }));

		expect(close.top).toBeGreaterThanOrEqual(0);
		expect(close.bottom).toBeLessThanOrEqual(rect(screen.getByRole('dialog')).bottom);
	});

	it('does not scroll the body when the content fits', async () => {
		await renderOpenDialog({ children: <p>Short</p> });
		const body = screen.getByTestId('dialog-body');

		expect(body.scrollHeight).toBeLessThanOrEqual(body.clientHeight);
	});
});

describe('Dialog footer', () => {
	function footerButtons() {
		return (
			<>
				<button type="button">First</button>
				<button type="button">Last</button>
			</>
		);
	}

	it('stacks its buttons with the last one on top below 640px', async () => {
		await page.viewport(639, 800);
		await renderOpenDialog({ footerSuffix: footerButtons() });
		const first = rect(screen.getByRole('button', { name: 'First' }));
		const last = rect(screen.getByRole('button', { name: 'Last' }));

		expect(last.top).toBeLessThan(first.top);
		expect(last.left).toBeCloseTo(first.left, 0);
	});

	it('lays its buttons in a row at the end from 640px', async () => {
		await page.viewport(1280, 800);
		await renderOpenDialog({ footerSuffix: footerButtons() });
		const first = rect(screen.getByRole('button', { name: 'First' }));
		const last = rect(screen.getByRole('button', { name: 'Last' }));

		expect(first.top).toBeCloseTo(last.top, 0);
		expect(first.left).toBeLessThan(last.left);
		expect(rect(screen.getByTestId('dialog-footer')).right - last.right).toBeLessThan(40);
	});
});

describe('Dialog footerPrefix', () => {
	const PADDING = 16;

	function renderWithPrefix() {
		return renderOpenDialog({
			footerPrefix: (
				<button type="button" style={{ height: '16px' }}>
					Delete view
				</button>
			),
			footerSuffix: (
				<>
					<button type="button" style={{ height: '40px' }}>
						Cancel
					</button>
					<button type="button" style={{ height: '40px' }}>
						Save
					</button>
				</>
			),
		});
	}

	it('sits at the start of the row, apart from the buttons at the end, from 640px', async () => {
		await page.viewport(1280, 800);
		await renderWithPrefix();
		const footer = rect(screen.getByTestId('dialog-footer'));
		const prefix = rect(screen.getByTestId('dialog-footer-prefix'));
		const suffix = rect(screen.getByTestId('dialog-footer-suffix'));

		expect(prefix.left - footer.left).toBeCloseTo(PADDING, 0);
		expect(footer.right - suffix.right).toBeCloseTo(PADDING, 0);
		expect(prefix.right).toBeLessThan(suffix.left);
	});

	it('is centered on the buttons of the row from 640px', async () => {
		await page.viewport(1280, 800);
		await renderWithPrefix();
		const prefix = rect(screen.getByTestId('dialog-footer-prefix'));
		const suffix = rect(screen.getByTestId('dialog-footer-suffix'));

		expect(prefix.height).toBeLessThan(suffix.height);
		expect(prefix.top + prefix.height / 2).toBeCloseTo(suffix.top + suffix.height / 2, 0);
	});

	it('sits under the stacked buttons, as wide as they are, below 640px', async () => {
		await page.viewport(639, 800);
		await renderWithPrefix();
		const footer = rect(screen.getByTestId('dialog-footer'));
		const prefix = rect(screen.getByTestId('dialog-footer-prefix'));
		const suffix = rect(screen.getByTestId('dialog-footer-suffix'));
		const button = rect(screen.getByRole('button', { name: 'Delete view' }));

		expect(prefix.top).toBeGreaterThanOrEqual(suffix.bottom - 0.5);
		expect(prefix.left).toBeCloseTo(suffix.left, 0);
		expect(prefix.width).toBeCloseTo(suffix.width, 0);
		expect(prefix.width).toBeCloseTo(footer.width - PADDING * 2, 0);
		expect(button.width).toBeCloseTo(prefix.width, 0);
	});

	it('keeps the last button on top of the stack and the prefix last below 640px', async () => {
		await page.viewport(639, 800);
		await renderWithPrefix();
		const cancel = rect(screen.getByRole('button', { name: 'Cancel' }));
		const save = rect(screen.getByRole('button', { name: 'Save' }));
		const prefix = rect(screen.getByRole('button', { name: 'Delete view' }));

		expect(save.top).toBeLessThan(cancel.top);
		expect(cancel.top).toBeLessThan(prefix.top);
	});
});

describe('Dialog ellipsis', () => {
	const LONG_TITLE =
		'A title that is far longer than any panel is wide, which wraps onto lines and is never cut';

	it('wraps a long title instead of truncating it', async () => {
		await renderOpenDialog({ title: LONG_TITLE });
		const title = screen.getByTestId('dialog-title');
		const style = getComputedStyle(title);

		expect(style.textOverflow).not.toBe('ellipsis');
		expect(title.scrollWidth).toBeLessThanOrEqual(title.clientWidth + 1);
		expect(title.getBoundingClientRect().height).toBeGreaterThan(parseFloat(style.fontSize) * 1.5);
	});

	it('wraps a long description and a long unbroken word', async () => {
		await renderOpenDialog({ description: `${LONG_TITLE} ${'x'.repeat(120)}` });
		const description = screen.getByTestId('dialog-description');

		expect(description.scrollWidth).toBeLessThanOrEqual(description.clientWidth + 1);
		expect(rect(description).right).toBeLessThanOrEqual(rect(screen.getByRole('dialog')).right);
	});
});

describe('Dialog transition', () => {
	function transitionProperty(testId: string): string {
		return getComputedStyle(screen.getByTestId(testId)).transitionProperty;
	}

	it('fades the backdrop and fades and scales the panel by default', async () => {
		await renderOpenDialog();

		expect(transitionProperty('dialog-backdrop')).toBe('opacity');
		expect(transitionProperty('dialog')).toBe('opacity, transform');
	});

	it('moves the transition of the panel and of the backdrop apart', async () => {
		const overrides = document.createElement('style');
		overrides.textContent = `:root {
			--dialog-transition-property: transform;
			--dialog-backdrop-transition-property: background-color;
		}`;
		document.head.append(overrides);

		try {
			await renderOpenDialog();

			expect(transitionProperty('dialog')).toBe('transform');
			expect(transitionProperty('dialog-backdrop')).toBe('background-color');
		} finally {
			overrides.remove();
		}
	});

	it('keeps the backdrop on its own transition when only the panel one is set', async () => {
		const overrides = document.createElement('style');
		overrides.textContent = ':root { --dialog-transition-property: transform; }';
		document.head.append(overrides);

		try {
			await renderOpenDialog();

			expect(transitionProperty('dialog-backdrop')).toBe('opacity');
		} finally {
			overrides.remove();
		}
	});
});
