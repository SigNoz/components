import { render, screen } from '@testing-library/react';
import type { ReactElement } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { AlertStrip } from '../alert-strip.js';

/**
 * The design tokens are not loaded here, so the colors the strip reads are declared in the test.
 * They are made up, to tell them apart.
 */
let tokens: HTMLStyleElement;

beforeEach(() => {
	tokens = document.createElement('style');
	tokens.textContent = `:root {
		--alert-strip-warning-background: rgb(255, 205, 86);
		--alert-strip-warning-foreground: rgb(10, 12, 16);
	}`;
	document.head.append(tokens);
});

afterEach(() => {
	tokens.remove();
});

// `@signozhq/icons` is mocked in tests, so the icons are drawn here. The solid one has the markup of
// the `Solid*` icons: a white disc and a dark glyph written into the SVG.
function OutlineIcon({ size = 16 }: { size?: number }): ReactElement {
	return (
		<svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor">
			<path d="M8 2 14 14H2Z" />
		</svg>
	);
}

function SolidIcon(): ReactElement {
	return (
		<svg width={16} height={16} viewBox="0 0 16 16" fill="none">
			<g>
				<path
					d="M8 14.667A6.667 6.667 0 1 0 8 1.333a6.667 6.667 0 0 0 0 13.334Z"
					fill="#fff"
					stroke="#fff"
				/>
				<path d="m10 6-4 4M6 6l4 4" stroke="#121317" />
			</g>
		</svg>
	);
}

function prefixIcon(): SVGElement {
	return screen.getByTestId('s-prefix').querySelector('svg') as SVGElement;
}

describe('AlertStrip prefix icon', () => {
	it('sizes the icon at 12px and ignores the size passed on it', () => {
		render(
			<AlertStrip color="warning" side="bottom" testId="s" prefix={<OutlineIcon size={24} />}>
				a
			</AlertStrip>,
		);

		const rect = prefixIcon().getBoundingClientRect();
		expect(rect.width).toBe(12);
		expect(rect.height).toBe(12);
	});

	it('paints an outline icon in the text color of the strip', () => {
		render(
			<AlertStrip color="warning" side="bottom" testId="s" prefix={<OutlineIcon />}>
				a
			</AlertStrip>,
		);

		expect(getComputedStyle(prefixIcon()).color).toBe('rgb(10, 12, 16)');
	});

	it('paints the disc of a Solid icon in the text color and its glyph in the fill', () => {
		render(
			<AlertStrip color="warning" side="bottom" testId="s" prefix={<SolidIcon />}>
				a
			</AlertStrip>,
		);

		const disc = prefixIcon().querySelector('g [fill="#fff"]') as SVGElement;
		const glyph = prefixIcon().querySelector('[stroke="#121317"]') as SVGElement;
		expect(getComputedStyle(disc).fill).toBe('rgb(10, 12, 16)');
		expect(getComputedStyle(disc).stroke).toBe('rgb(10, 12, 16)');
		expect(getComputedStyle(glyph).stroke).toBe('rgb(255, 205, 86)');
	});
});
