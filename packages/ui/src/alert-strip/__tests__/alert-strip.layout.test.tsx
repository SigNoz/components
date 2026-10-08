import { render, screen } from '@testing-library/react';
import type { CSSProperties } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';

import { AlertStrip } from '../alert-strip.js';

/**
 * The design tokens are not loaded here, so the values the strip reads are declared in the test,
 * with the numbers `@signozhq/design-tokens` ships. The colors are made up, to tell them apart.
 */
let tokens: HTMLStyleElement;

beforeEach(() => {
	tokens = document.createElement('style');
	tokens.textContent = `:root {
		--spacing-1: 2px;
		--spacing-2: 4px;
		--spacing-3: 6px;
		--spacing-4: 8px;
		--radius-1: 2px;
		--periscope-font-size-base: 13px;
		--periscope-font-size-small: 11px;
		--periscope-line-height-base: 20px;
		--periscope-font-weight-medium: 500;
		--alert-strip-warning-background: rgb(255, 205, 86);
		--alert-strip-warning-foreground: rgb(10, 12, 16);
		--alert-strip-button-background: rgb(18, 19, 23);
		--alert-strip-button-foreground: rgb(236, 238, 242);
	}`;
	document.head.append(tokens);
});

afterEach(() => {
	tokens.remove();
});

const LONG =
	'Your workspace is over its ingestion quota for this month, so new logs, traces and metrics are dropped until the quota resets.';

function part(slot: string): HTMLElement {
	return document.querySelector(`[data-slot="${slot}"]`) as HTMLElement;
}

const WHITE = 'rgb(255, 255, 255)';
const WARNING = 'rgb(255, 205, 86)';

/**
 * The colors the browser paints for the element, read from a screenshot, so the masked fill of the
 * region can be checked. `x` and `y` are CSS pixels from its top left corner.
 */
async function pixels(element: HTMLElement): Promise<(x: number, y: number) => string> {
	const image = new Image();
	image.src = `data:image/png;base64,${await page.screenshot({ element, save: false })}`;
	await image.decode();
	const canvas = document.createElement('canvas');
	canvas.width = image.width;
	canvas.height = image.height;
	const context = canvas.getContext('2d') as CanvasRenderingContext2D;
	context.drawImage(image, 0, 0);
	const scale = image.width / element.getBoundingClientRect().width;

	return (x, y) => {
		const [r, g, b] = context.getImageData(Math.floor(x * scale), Math.floor(y * scale), 1, 1).data;
		return `rgb(${r}, ${g}, ${b})`;
	};
}

describe('AlertStrip box', () => {
	it('is as wide as its parent and 32px tall on one line', () => {
		render(
			<div style={{ width: 1440 }}>
				<AlertStrip color="warning" side="bottom" testId="s">
					Short message.
					<AlertStrip.Button>Upgrade</AlertStrip.Button>
				</AlertStrip>
			</div>,
		);

		const rect = screen.getByTestId('s').getBoundingClientRect();
		expect(rect.width).toBe(1440);
		expect(rect.height).toBe(32);
	});

	it('centers the content region at 942px with the tapered ends', () => {
		render(
			<div style={{ width: 1440 }}>
				<AlertStrip.Closeable
					color="warning"
					side="bottom"
					testId="s"
					closed={false}
					onClose={() => {}}
				>
					Short message.
				</AlertStrip.Closeable>
			</div>,
		);

		const root = screen.getByTestId('s').getBoundingClientRect();
		const region = (
			screen.getByTestId('s').firstElementChild as HTMLElement
		).getBoundingClientRect();
		expect(region.width).toBe(942);
		expect(region.left - root.left).toBe((1440 - 942) / 2);
	});

	it('shrinks the region with a narrower parent', () => {
		render(
			<div style={{ width: 500 }}>
				<AlertStrip color="warning" side="bottom" testId="s">
					Short message.
				</AlertStrip>
			</div>,
		);

		const region = (
			screen.getByTestId('s').firstElementChild as HTMLElement
		).getBoundingClientRect();
		expect(region.width).toBe(500);
	});

	it('wraps long content and grows, without shrinking the close button', () => {
		render(
			<div style={{ width: 600 }}>
				<AlertStrip.Closeable
					color="warning"
					side="bottom"
					testId="s"
					closed={false}
					onClose={() => {}}
				>
					{LONG}
				</AlertStrip.Closeable>
			</div>,
		);

		const content = screen.getByTestId('s-content');
		expect(screen.getByTestId('s').getBoundingClientRect().height).toBeGreaterThan(32);
		expect(content.scrollWidth).toBeLessThanOrEqual(content.clientWidth);
		expect(screen.getByTestId('s-close').getBoundingClientRect().width).toBe(24);
	});

	it('keeps the suffix at the end, 8px off the message and before the close button', () => {
		render(
			<div style={{ width: 600 }}>
				<AlertStrip.Closeable
					color="warning"
					side="bottom"
					testId="s"
					closed={false}
					onClose={() => {}}
					prefix={<span style={{ display: 'block', width: 16, height: 16 }} />}
					suffix={<AlertStrip.Button>Raise the limit</AlertStrip.Button>}
				>
					{LONG}
				</AlertStrip.Closeable>
			</div>,
		);

		const prefix = screen.getByTestId('s-prefix').getBoundingClientRect();
		const content = screen.getByTestId('s-content').getBoundingClientRect();
		const suffix = screen.getByTestId('s-suffix').getBoundingClientRect();
		const close = screen.getByTestId('s-close').getBoundingClientRect();
		expect(screen.getByTestId('s').getBoundingClientRect().height).toBeGreaterThan(32);
		expect(prefix.width).toBe(16);
		expect(content.left - prefix.right).toBe(4);
		expect(suffix.left - content.right).toBe(8);
		expect(close.left - suffix.right).toBe(4);
		// The suffix never wraps, so its button stays on one line.
		expect(part('alert-strip-button').getBoundingClientRect().height).toBe(24);
	});

	it('breaks a word that cannot wrap', () => {
		render(
			<div style={{ width: 600 }}>
				<AlertStrip color="warning" side="bottom" testId="s">
					{'instrumentation'.repeat(12)}
				</AlertStrip>
			</div>,
		);

		const content = screen.getByTestId('s-content');
		expect(content.scrollWidth).toBeLessThanOrEqual(content.clientWidth);
	});

	it('stretches the slant over the height above the 8px bar', async () => {
		render(
			<div style={{ width: 600, background: WHITE }}>
				<AlertStrip color="warning" side="bottom" testId="s">
					{LONG}
				</AlertStrip>
			</div>,
		);

		const root = screen.getByTestId('s');
		const height = root.getBoundingClientRect().height;
		expect(height).toBeGreaterThan(32);
		const pixel = await pixels(root);
		// The corner of the end off the slant shows the page, the top of the slant is filled.
		expect(pixel(1, 1)).toBe(WHITE);
		expect(pixel(51, 1)).toBe(WARNING);
		// Just above the bar the slant still reaches the far side of the end, and the bar fills it all.
		expect(pixel(1, height - 12)).toBe(WHITE);
		expect(pixel(51, height - 12)).toBe(WARNING);
		expect(pixel(1, height - 3)).toBe(WARNING);
	});

	it.each(['bottom', 'top'] as const)('keeps the dots on the %s bar as the strip grows', (side) => {
		render(
			<div style={{ width: 300 }}>
				<AlertStrip color="warning" side={side} testId="s">
					{LONG}
				</AlertStrip>
			</div>,
		);

		const root = screen.getByTestId('s').getBoundingClientRect();
		expect(root.height).toBeGreaterThan(52);
		for (const dots of screen.getByTestId('s').querySelectorAll('svg')) {
			const rect = dots.getBoundingClientRect();
			expect(rect.height).toBe(18);
			// Their last row dips 1px into the 8px bar.
			expect(side === 'bottom' ? root.bottom - rect.bottom : rect.top - root.top).toBe(7);
		}
	});
});

describe('AlertStrip fill', () => {
	// The region is cut to 250px in a 300px parent, so it runs from 25 to 275 and the bar shows
	// beside it. The content wraps to several lines.
	it.each(['bottom', 'top'] as const)(
		'keeps the %s bar 8px thick under the ends as the strip grows',
		async (side) => {
			render(
				<div
					style={
						{
							width: 300,
							background: WHITE,
							'--alert-strip-region-flex': '0 1 250px',
						} as CSSProperties
					}
				>
					<AlertStrip color="warning" side={side} testId="s">
						{LONG}
					</AlertStrip>
				</div>,
			);

			const root = screen.getByTestId('s');
			const height = root.getBoundingClientRect().height;
			expect(height).toBeGreaterThan(72);
			const pixel = await pixels(root);
			// Rows are counted from the edge the bar runs along.
			const at = (x: number, row: number): string =>
				pixel(x, side === 'bottom' ? height - 1 - row : row);

			// Beside the region, and under the end before the foot of the slant.
			for (const x of [10, 30]) {
				expect(at(x, 7), `${x}`).toBe(WARNING);
				expect(at(x, 8), `${x}`).toBe(WHITE);
			}
		},
	);

	// The screenshot only holds the 414px viewport, so the region is cut to 300px. The parent is
	// 401px wide, so the region starts between two pixels, at 50.5: each end is 54px wide and the body
	// runs from 104.5 to 296.5.
	it.each(['bottom', 'top'] as const)(
		'paints a translucent fill once, with the bar along the %s edge',
		async (side) => {
			render(
				<div
					style={
						{
							width: 401,
							background: WHITE,
							'--alert-strip-region-flex': '0 1 300px',
							'--alert-strip-warning-background': 'rgba(0, 0, 255, 0.5)',
						} as CSSProperties
					}
				>
					<AlertStrip color="warning" side={side} testId="s">
						a
					</AlertStrip>
				</div>,
			);

			const root = screen.getByTestId('s');
			expect(root.getBoundingClientRect().height).toBe(32);
			const pixel = await pixels(root);
			// Rows are counted from the edge the bar runs along.
			const at = (x: number, row: number): string => pixel(x, side === 'bottom' ? 31 - row : row);

			const fill = at(200, 4);
			expect(fill).toBe('rgb(127, 127, 255)');
			const once: [x: number, row: number, where: string][] = [
				[20, 4, 'the bar beside the region'],
				[49, 4, 'the bar before the region'],
				[50, 4, 'the column where the bar meets the region'],
				[51, 4, 'the region at its start'],
				[66, 7, 'the slant reaching into the bar'],
				[105, 20, 'the slant reaching under the body'],
				[105, 7, 'the slant reaching under the body and into the bar'],
				[200, 28, 'the body off the bar'],
				[350, 4, 'the column where the region meets the bar'],
				[380, 4, 'the bar after the region'],
			];
			for (const [x, row, where] of once) {
				expect(at(x, row), where).toBe(fill);
			}
			// The slant rises off the bar, so the corner of the end away from it shows the page.
			expect(at(52, 30)).toBe(WHITE);
			expect(at(101, 30)).toBe(fill);
		},
	);
});

describe('AlertStrip paint', () => {
	it('fills the strip and colors the text from its color', () => {
		render(
			<AlertStrip color="warning" side="bottom" testId="s">
				a
			</AlertStrip>,
		);

		expect(getComputedStyle(part('alert-strip-content')).color).toBe('rgb(10, 12, 16)');
		// The region paints the fill under the tapered ends and the body.
		const region = screen.getByTestId('s').firstElementChild as HTMLElement;
		expect(getComputedStyle(region, '::before').backgroundColor).toBe(WARNING);
	});

	it('paints AlertStrip.Button with the strip button colors, on one line', () => {
		render(
			<div style={{ width: 400 }}>
				<AlertStrip color="warning" side="bottom">
					{LONG}
					<AlertStrip.Button>Raise the limit for this workspace</AlertStrip.Button>
				</AlertStrip>
			</div>,
		);

		const button = part('alert-strip-button');
		expect(getComputedStyle(button).backgroundColor).toBe('rgb(18, 19, 23)');
		expect(getComputedStyle(button).color).toBe('rgb(236, 238, 242)');
		expect(button.getBoundingClientRect().height).toBe(24);
	});

	it('paints AlertStrip.Button in the suffix with the strip button colors', () => {
		render(
			<AlertStrip
				color="warning"
				side="bottom"
				suffix={<AlertStrip.Button>Upgrade</AlertStrip.Button>}
			>
				a
			</AlertStrip>,
		);

		const button = part('alert-strip-button');
		expect(getComputedStyle(button).backgroundColor).toBe('rgb(18, 19, 23)');
		expect(getComputedStyle(button).color).toBe('rgb(236, 238, 242)');
		expect(getComputedStyle(button).marginInlineStart).toBe('0px');
	});

	it('paints the close button with the strip button colors', () => {
		render(
			<AlertStrip.Closeable color="warning" side="bottom" closed={false} onClose={() => {}}>
				a
			</AlertStrip.Closeable>,
		);

		const close = part('alert-strip-close');
		expect(getComputedStyle(close).backgroundColor).toBe('rgb(18, 19, 23)');
		expect(getComputedStyle(close).color).toBe('rgb(236, 238, 242)');
	});
});
