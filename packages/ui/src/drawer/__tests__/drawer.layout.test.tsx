import { Check, ChevronUp } from '@signozhq/icons';
import { screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cdp, page } from 'vitest/browser';
import { Button } from '../../button/index.js';
import type { DrawerTypeType, DrawerWidthType } from '../types.js';
import { drawerPanel, renderOpenDrawer } from './drawer.test-utils.js';

/**
 * The design tokens are not loaded here, so the spacing and the label text the drawer reads are
 * declared in the test with the numbers `@signozhq/design-tokens` ships.
 */
let tokens: HTMLStyleElement;

const DEFAULT_VIEWPORT = { width: 414, height: 896 };

beforeEach(() => {
	tokens = document.createElement('style');
	tokens.textContent = `:root {
		--spacing-2: 4px;
		--spacing-4: 8px;
		--spacing-5: 10px;
		--spacing-6: 12px;
		--spacing-8: 16px;
		--spacing-10: 20px;
		--radius-3: 6px;
		--label-base-400-font-size: 13px;
		--label-base-400-line-height: 1;
		--label-base-500-font-size: 13px;
		--label-base-500-line-height: 1;
		--paragraph-base-400-line-height: 20px;
	}`;
	document.head.append(tokens);
});

afterEach(async () => {
	tokens.remove();
	await page.viewport(DEFAULT_VIEWPORT.width, DEFAULT_VIEWPORT.height);
	await cdp().send('Emulation.setEmulatedMedia', {
		features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }],
	});
});

function rect(element: Element): DOMRect {
	return element.getBoundingClientRect();
}

const HEADER_BUTTON = (
	<Button variant="ghost" color="secondary" size="sm" icon aria-label="Previous">
		<ChevronUp />
	</Button>
);

const COPY_BUTTON = (
	<Button variant="ghost" color="secondary" size="sm" icon aria-label="Copy name">
		<Check />
	</Button>
);

describe('Drawer width', () => {
	it.each<[DrawerWidthType, number]>([
		['narrow', 384],
		['base', 512],
		['wide', 672],
		['extra-wide', 820],
		['entity', 880],
	])('is %s: at most %ipx wide, against the right edge', async (width, pixels) => {
		await page.viewport(1280, 800);
		await renderOpenDrawer({ width });
		const panel = drawerPanel();

		expect(getComputedStyle(panel).maxWidth).toBe(`${pixels}px`);
		expect(rect(panel).width).toBeCloseTo(pixels, 0);
		expect(window.innerWidth - rect(panel).right).toBeCloseTo(16, 0);
	});

	it.each<DrawerWidthType>(['narrow', 'base', 'wide', 'extra-wide', 'entity'])(
		'shrinks %s to the viewport minus 16px on each side on a narrow screen',
		async (width) => {
			await page.viewport(360, 700);
			await renderOpenDrawer({ width });
			const panel = rect(drawerPanel());

			expect(panel.left).toBeCloseTo(16, 0);
			expect(window.innerWidth - panel.right).toBeCloseTo(16, 0);
			expect(panel.width).toBeCloseTo(window.innerWidth - 32, 0);
		},
	);
});

describe('Drawer position', () => {
	it.each<DrawerTypeType>(['task', 'inspector'])(
		'insets a %s 16px from the top, the right and the bottom',
		async (type) => {
			await page.viewport(1280, 800);
			await renderOpenDrawer({ type, children: <p>Short</p> });
			const panel = rect(drawerPanel());

			expect(panel.top).toBeCloseTo(16, 0);
			expect(window.innerWidth - panel.right).toBeCloseTo(16, 0);
			expect(window.innerHeight - panel.bottom).toBeCloseTo(16, 0);
			expect(panel.height).toBeCloseTo(window.innerHeight - 32, 0);
		},
	);

	// A transformed panel is the containing block of every `position: fixed` element inside it,
	// such as a chart tooltip, which would then be placed against the panel.
	it.each<DrawerTypeType>(['task', 'inspector'])(
		'rests a %s with no transform, so fixed content inside it is placed against the viewport',
		async (type) => {
			await page.viewport(1280, 800);
			await renderOpenDrawer({
				type,
				children: <div data-testid="fixed" style={{ position: 'fixed', top: 0, left: 0 }} />,
			});
			const style = getComputedStyle(drawerPanel());

			expect(style.transform).toBe('none');
			expect(style.willChange).toBe('auto');
			expect(screen.getByTestId('fixed').getBoundingClientRect().left).toBe(0);
		},
	);
});

describe('Drawer overflow', () => {
	const TALL = <div style={{ height: '3000px' }}>Tall content</div>;

	it('never grows past the viewport height minus 16px on each side', async () => {
		await renderOpenDrawer({ children: TALL, footerSuffix: <button type="button">Save</button> });
		const panel = rect(drawerPanel());

		expect(panel.top).toBeGreaterThanOrEqual(16 - 0.5);
		expect(panel.bottom).toBeLessThanOrEqual(window.innerHeight - 16 + 0.5);
	});

	it('scrolls the body, and keeps the header and the footer in place', async () => {
		await renderOpenDrawer({ children: TALL, footerSuffix: <button type="button">Save</button> });
		const body = screen.getByTestId('drawer-body');
		const panel = rect(drawerPanel());
		const header = rect(screen.getByTestId('drawer-header'));
		const footer = rect(screen.getByTestId('drawer-footer'));

		expect(getComputedStyle(body).overflowY).toBe('auto');
		expect(body.scrollHeight).toBeGreaterThan(body.clientHeight);
		expect(header.top).toBeGreaterThanOrEqual(panel.top - 0.5);
		expect(footer.bottom).toBeLessThanOrEqual(panel.bottom + 0.5);

		body.scrollTop = 500;

		expect(body.scrollTop).toBe(500);
		expect(rect(screen.getByTestId('drawer-header')).top).toBeCloseTo(header.top, 0);
		expect(rect(screen.getByTestId('drawer-footer')).top).toBeCloseTo(footer.top, 0);
		expect(drawerPanel().scrollTop).toBe(0);
	});

	it('keeps the close button reachable on a body that scrolls', async () => {
		await renderOpenDrawer({ type: 'inspector', children: TALL });
		const body = screen.getByTestId('drawer-body');

		body.scrollTop = 500;
		const close = rect(screen.getByRole('button', { name: 'Close' }));

		expect(close.top).toBeGreaterThanOrEqual(rect(drawerPanel()).top);
		expect(close.bottom).toBeLessThanOrEqual(rect(screen.getByTestId('drawer-header')).bottom);
	});

	it('does not scroll the body when the content fits', async () => {
		await renderOpenDrawer({ children: <p>Short</p> });
		const body = screen.getByTestId('drawer-body');

		expect(body.scrollHeight).toBeLessThanOrEqual(body.clientHeight);
	});
});

describe('Drawer header', () => {
	it.each<DrawerTypeType>(['task', 'inspector'])(
		'is 48px tall on a %s without a description',
		async (type) => {
			await renderOpenDrawer({
				type,
				headerPrefix: HEADER_BUTTON,
				titlePrefix: <ChevronUp />,
				titleSuffix: COPY_BUTTON,
				headerSuffix: (
					<Button variant="ghost" color="secondary" size="sm">
						Edit
					</Button>
				),
			});

			expect(rect(screen.getByTestId('drawer-header')).height).toBeCloseTo(48, 0);
		},
	);

	it('is 56px tall on a task with a description', async () => {
		await renderOpenDrawer({
			headerPrefix: HEADER_BUTTON,
			headerSuffix: (
				<Button variant="ghost" color="secondary" size="sm">
					Edit
				</Button>
			),
			description: 'Changes apply to every dashboard',
		});

		expect(rect(screen.getByTestId('drawer-header')).height).toBeCloseTo(56, 0);
	});

	it('stays 48px tall for a description that renders nothing', async () => {
		await renderOpenDrawer({ description: '' });

		expect(rect(screen.getByTestId('drawer-header')).height).toBeCloseTo(48, 0);
	});

	it('puts the divider between the headerPrefix and the title', async () => {
		await renderOpenDrawer({ headerPrefix: HEADER_BUTTON });
		const prefix = screen.getByTestId('drawer-header-prefix');
		const divider = prefix.nextElementSibling as Element;

		expect(rect(divider).width).toBeCloseTo(1, 0);
		expect(rect(divider).height).toBeCloseTo(16, 0);
		expect(rect(divider).left).toBeGreaterThan(rect(prefix).right);
		expect(rect(screen.getByTestId('drawer-title')).left).toBeGreaterThan(rect(divider).right);
	});

	it('keeps the close button at the end of the header, after the headerSuffix', async () => {
		await renderOpenDrawer({
			headerSuffix: (
				<Button variant="ghost" color="secondary" size="sm">
					Edit
				</Button>
			),
		});
		const header = rect(screen.getByTestId('drawer-header'));
		const suffix = rect(screen.getByTestId('drawer-header-suffix'));
		const close = rect(screen.getByRole('button', { name: 'Close' }));

		expect(header.right - close.right).toBeCloseTo(16, 0);
		expect(suffix.right).toBeLessThanOrEqual(close.left);
	});
});

describe('Drawer ellipsis', () => {
	const LONG_TITLE =
		'A title that is far longer than any panel is wide, so it runs past the close button and the actions of the header';

	it('keeps a long title on one line, cut with an ellipsis', async () => {
		await renderOpenDrawer({ title: LONG_TITLE });
		const text = screen.getByTestId('drawer-title').querySelector('[data-slot="typography"]');

		expect(text).not.toBeNull();
		const style = getComputedStyle(text as Element);

		expect(style.textOverflow).toBe('ellipsis');
		expect(style.whiteSpace).toBe('nowrap');
		expect((text as Element).scrollWidth).toBeGreaterThan((text as Element).clientWidth);
		await waitFor(() => {
			expect(text).toHaveAttribute('data-truncated');
		});
	});

	it('does not grow the header or push the actions out for a long title', async () => {
		await renderOpenDrawer({
			title: LONG_TITLE,
			headerPrefix: HEADER_BUTTON,
			titleSuffix: COPY_BUTTON,
			headerSuffix: (
				<Button variant="ghost" color="secondary" size="sm">
					Edit
				</Button>
			),
		});
		const header = rect(screen.getByTestId('drawer-header'));
		const title = rect(screen.getByTestId('drawer-title'));
		const titleSuffix = rect(screen.getByTestId('drawer-title-suffix'));
		const headerSuffix = rect(screen.getByTestId('drawer-header-suffix'));
		const close = rect(screen.getByRole('button', { name: 'Close' }));

		expect(header.height).toBeCloseTo(48, 0);
		expect(title.right).toBeLessThanOrEqual(titleSuffix.left);
		expect(titleSuffix.right).toBeLessThanOrEqual(headerSuffix.left);
		expect(close.right).toBeLessThanOrEqual(header.right);
		expect(header.right - close.right).toBeCloseTo(16, 0);
	});

	it('wraps a long description and a long unbroken word inside the panel', async () => {
		await renderOpenDrawer({ description: `${LONG_TITLE} ${'x'.repeat(120)}` });
		const description = screen.getByTestId('drawer-description');

		expect(description.scrollWidth).toBeLessThanOrEqual(description.clientWidth + 1);
		expect(rect(description).right).toBeLessThanOrEqual(rect(drawerPanel()).right);
	});
});

describe('Drawer footer', () => {
	function footerButtons() {
		return (
			<>
				<button type="button">First</button>
				<button type="button">Last</button>
			</>
		);
	}

	it('is at least 56px tall', async () => {
		await renderOpenDrawer({
			footerSuffix: (
				<button type="button" style={{ height: '24px' }}>
					Save
				</button>
			),
		});

		expect(rect(screen.getByTestId('drawer-footer')).height).toBeCloseTo(56, 0);
	});

	it('stacks its buttons with the last one on top below 640px', async () => {
		await page.viewport(639, 800);
		await renderOpenDrawer({ footerSuffix: footerButtons() });
		const first = rect(screen.getByRole('button', { name: 'First' }));
		const last = rect(screen.getByRole('button', { name: 'Last' }));

		expect(last.top).toBeLessThan(first.top);
		expect(last.left).toBeCloseTo(first.left, 0);
	});

	it('lays its buttons in a row at the end from 640px', async () => {
		await page.viewport(1280, 800);
		await renderOpenDrawer({ footerSuffix: footerButtons() });
		const first = rect(screen.getByRole('button', { name: 'First' }));
		const last = rect(screen.getByRole('button', { name: 'Last' }));

		expect(first.top).toBeCloseTo(last.top, 0);
		expect(first.left).toBeLessThan(last.left);
		expect(rect(screen.getByTestId('drawer-footer')).right - last.right).toBeCloseTo(16, 0);
	});
});

describe('Drawer footerPrefix', () => {
	const PADDING = 16;

	function renderWithPrefix() {
		return renderOpenDrawer({
			footerPrefix: (
				<button type="button" style={{ height: '16px' }}>
					Delete member
				</button>
			),
			footerSuffix: (
				<>
					<button type="button" style={{ height: '32px' }}>
						Cancel
					</button>
					<button type="button" style={{ height: '32px' }}>
						Save
					</button>
				</>
			),
		});
	}

	it('sits at the start of the row, apart from the buttons at the end, from 640px', async () => {
		await page.viewport(1280, 800);
		await renderWithPrefix();
		const footer = rect(screen.getByTestId('drawer-footer'));
		const prefix = rect(screen.getByTestId('drawer-footer-prefix'));
		const suffix = rect(screen.getByTestId('drawer-footer-suffix'));

		expect(prefix.left - footer.left).toBeCloseTo(PADDING, 0);
		expect(footer.right - suffix.right).toBeCloseTo(PADDING, 0);
		expect(prefix.right).toBeLessThan(suffix.left);
	});

	it('is centered on the buttons of the row from 640px', async () => {
		await page.viewport(1280, 800);
		await renderWithPrefix();
		const prefix = rect(screen.getByTestId('drawer-footer-prefix'));
		const suffix = rect(screen.getByTestId('drawer-footer-suffix'));

		expect(prefix.height).toBeLessThan(suffix.height);
		expect(prefix.top + prefix.height / 2).toBeCloseTo(suffix.top + suffix.height / 2, 0);
	});

	it('sits under the stacked buttons, as wide as they are, below 640px', async () => {
		await page.viewport(639, 800);
		await renderWithPrefix();
		const footer = rect(screen.getByTestId('drawer-footer'));
		const prefix = rect(screen.getByTestId('drawer-footer-prefix'));
		const suffix = rect(screen.getByTestId('drawer-footer-suffix'));
		const button = rect(screen.getByRole('button', { name: 'Delete member' }));

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
		const prefix = rect(screen.getByRole('button', { name: 'Delete member' }));

		expect(save.top).toBeLessThan(cancel.top);
		expect(cancel.top).toBeLessThan(prefix.top);
	});
});

describe('Drawer transition', () => {
	function transitionOf(testId: string): { property: string; duration: string } {
		const style = getComputedStyle(screen.getByTestId(testId));

		return { property: style.transitionProperty, duration: style.transitionDuration };
	}

	it('slides the panel and fades the backdrop by default', async () => {
		await renderOpenDrawer();

		expect(transitionOf('drawer')).toEqual({ property: 'transform', duration: '0.24s' });
		expect(transitionOf('drawer-backdrop')).toEqual({ property: 'opacity', duration: '0.2s' });
	});

	it('moves the transition of the panel and of the backdrop apart', async () => {
		const overrides = document.createElement('style');
		overrides.textContent = `:root {
			--drawer-transition-property: opacity;
			--drawer-transition-duration: 300ms;
			--drawer-backdrop-transition-property: background-color;
		}`;
		document.head.append(overrides);

		try {
			await renderOpenDrawer();

			expect(transitionOf('drawer')).toEqual({ property: 'opacity', duration: '0.3s' });
			expect(transitionOf('drawer-backdrop').property).toBe('background-color');
		} finally {
			overrides.remove();
		}
	});

	it('keeps the backdrop on its own transition when only the panel one is set', async () => {
		const overrides = document.createElement('style');
		overrides.textContent = ':root { --drawer-transition-property: opacity; }';
		document.head.append(overrides);

		try {
			await renderOpenDrawer();

			expect(transitionOf('drawer-backdrop').property).toBe('opacity');
		} finally {
			overrides.remove();
		}
	});

	it('fades the panel where it rests under prefers-reduced-motion', async () => {
		await cdp().send('Emulation.setEmulatedMedia', {
			features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
		});
		await renderOpenDrawer();

		expect(transitionOf('drawer')).toEqual({ property: 'opacity', duration: '0.1s' });
		expect(transitionOf('drawer-backdrop')).toEqual({ property: 'opacity', duration: '0.1s' });
	});
});
