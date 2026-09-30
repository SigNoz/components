import { render, screen } from '@testing-library/react';
import type { CSSProperties } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { Badge } from './index.js';

/**
 * The design tokens are not loaded here, so the values the badge reads are declared in the test,
 * with the numbers `@signozhq/design-tokens` ships.
 */
let tokens: HTMLStyleElement;

beforeEach(() => {
	tokens = document.createElement('style');
	tokens.textContent = `:root {
		--spacing-2: 4px;
		--spacing-4: 8px;
		--spacing-10: 20px;
		--line-height-18: 18px;
		--periscope-font-size-small: 11px;
		--font-weight-medium: 500;
		--radius-round: 9999px;
	}`;
	document.head.append(tokens);
});

afterEach(() => {
	tokens.remove();
});

const Icon = () => <svg width="12" height="12" viewBox="0 0 12 12" />;

function badge(testId = 'badge'): HTMLElement {
	return screen.getByTestId(testId);
}

function label(root: HTMLElement): HTMLElement {
	return root.querySelector('[data-slot="badge-label"]') as HTMLElement;
}

describe('Badge box', () => {
	it('still takes --badge-padding and --badge-line-height from the call site', () => {
		render(
			<div style={{ '--badge-padding': '2px 6px', '--badge-line-height': '14px' } as CSSProperties}>
				<Badge variant="solid" color="primary" testId="badge">
					Staging
				</Badge>
			</div>,
		);

		const style = getComputedStyle(badge());

		expect(style.paddingBlock).toBe('2px');
		expect(style.paddingInline).toBe('6px');
		expect(style.lineHeight).toBe('14px');
	});
});

describe('Badge letter spacing', () => {
	it('takes --badge-letter-spacing from the call site', () => {
		render(
			<div style={{ '--badge-letter-spacing': '1px' } as CSSProperties}>
				<Badge variant="solid" color="primary" testId="badge">
					Firing
				</Badge>
			</div>,
		);

		expect(getComputedStyle(badge()).letterSpacing).toBe('1px');
	});
});

/** Distance from the icon to each outer edge of the badge, border included. */
function insets(root: HTMLElement): { top: number; bottom: number; start: number; end: number } {
	const outer = root.getBoundingClientRect();
	const icon = (root.querySelector('svg') as SVGSVGElement).getBoundingClientRect();

	return {
		top: icon.top - outer.top,
		bottom: outer.bottom - icon.bottom,
		start: icon.left - outer.left,
		end: outer.right - icon.right,
	};
}

describe('Badge icon inset', () => {
	it('follows --badge-height, so a taller badge keeps the inset equal', () => {
		render(
			<div style={{ '--badge-height': '24px' } as CSSProperties}>
				<Badge variant="solid" color="success" prefix={<Icon />} testId="badge">
					Online
				</Badge>
			</div>,
		);

		const { top, bottom, start } = insets(badge());

		expect(top).toBe(6);
		expect(bottom).toBe(6);
		expect(start).toBe(6);
	});

	it('takes --badge-affix-padding-inline from the call site', () => {
		render(
			<div style={{ '--badge-affix-padding-inline': '6px' } as CSSProperties}>
				<Badge variant="solid" color="success" prefix={<Icon />} testId="badge">
					Online
				</Badge>
			</div>,
		);

		expect(getComputedStyle(badge()).paddingInlineStart).toBe('6px');
	});
});

describe('Badge single character', () => {
	// The last three are one glyph each from several code points: a variation selector, a skin
	// tone, and an accent composed onto its letter.
	it.each(['5', 5, 0, 'A', '\u26A0\uFE0F', '\u{1F44D}\u{1F3FD}', 'e\u0301'])(
		'draws %j as a 20px circle',
		(children) => {
			render(
				<Badge variant="solid" color="danger" testId="badge">
					{children}
				</Badge>,
			);

			const root = badge();
			const outer = root.getBoundingClientRect();
			const inner = label(root).getBoundingClientRect();

			expect(root).toHaveAttribute('data-single-char');
			expect(getComputedStyle(root).paddingInline).toBe('0px');
			expect(outer.width).toBe(20);
			expect(outer.height).toBe(20);
			expect(Math.abs(inner.left + inner.width / 2 - (outer.left + outer.width / 2))).toBeLessThan(
				0.5,
			);
		},
	);

	it.each(['12', 'OK', 128])('keeps the side padding for %j', (children) => {
		render(
			<Badge variant="solid" color="danger" testId="badge">
				{children}
			</Badge>,
		);

		expect(badge()).not.toHaveAttribute('data-single-char');
		expect(getComputedStyle(badge()).paddingInline).toBe('8px');
	});

	it('does not count an element child, even with one character in it', () => {
		render(
			<Badge variant="solid" color="danger" testId="badge">
				<strong>5</strong>
			</Badge>,
		);

		expect(badge()).not.toHaveAttribute('data-single-char');
	});

	it.each(['prefix', 'suffix'] as const)('does not apply with a %s', (slot) => {
		render(
			<Badge variant="solid" color="danger" {...{ [slot]: <Icon /> }} testId="badge">
				5
			</Badge>,
		);

		expect(badge()).not.toHaveAttribute('data-single-char');
	});

	it('lets a wider width win over the circle', () => {
		render(
			<Badge variant="solid" color="danger" width={40} testId="badge">
				5
			</Badge>,
		);

		expect(badge().getBoundingClientRect().width).toBe(40);
	});

	it('follows --badge-height, so the circle scales with the badge', () => {
		render(
			<div style={{ '--badge-height': '24px' } as CSSProperties}>
				<Badge variant="solid" color="danger" testId="badge">
					5
				</Badge>
			</div>,
		);

		expect(badge().getBoundingClientRect().width).toBe(24);
	});
});
