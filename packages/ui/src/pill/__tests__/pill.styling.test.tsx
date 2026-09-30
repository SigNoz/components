import { render, screen } from '@testing-library/react';
import type { CSSProperties } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';

import { Pill } from '../pill.js';

/**
 * The tokens live in `@signozhq/design-tokens` and are not loaded here, so every length and colour
 * would otherwise compute to its initial value. Declaring them in the test keeps the subject on the
 * rules in `pill.module.scss`. One colour per slot, so a computed colour says which rule painted it.
 */
const DISMISS_ICON = 'rgb(3, 3, 3)';
const DISMISS_ICON_HOVER = 'rgb(4, 4, 4)';
const INVALID_LABEL = 'rgb(5, 5, 5)';
const INVALID_BACKGROUND = 'rgb(40, 40, 200)';
const INVALID_DISMISS_ICON = 'rgb(7, 7, 7)';
const INVALID_DISMISS_ICON_HOVER = 'rgb(8, 8, 8)';

let tokens: HTMLStyleElement;

/**
 * The real pointer stays where the last test left it, over whatever renders there next. Parking it
 * in a corner first means no test starts on a hover it did not ask for.
 */
async function parkPointer(): Promise<void> {
	const spot = document.createElement('div');
	spot.style.cssText = 'position: fixed; right: 0; bottom: 0; width: 4px; height: 4px;';
	document.body.append(spot);
	await userEvent.hover(spot);
	spot.remove();
}

beforeEach(async () => {
	await parkPointer();
	tokens = document.createElement('style');
	tokens.textContent = `:root {
		--spacing-4: 8px;
		--spacing-10: 20px;
		--line-height-18: 18px;
		--periscope-font-size-small: 11px;
		--pill-transition-duration: 0s;
		--pill-danger-background: rgb(200, 40, 40);
		--pill-danger-border: rgb(200, 40, 40);
		--pill-outlined-background: rgb(250, 250, 250);
		--pill-outlined-background-hover: rgb(240, 240, 240);
		--pill-outlined-border: rgb(220, 220, 220);
		--pill-rect-solid-background: rgb(1, 1, 1);
		--pill-rect-solid-background-hover: rgb(2, 2, 2);
		--pill-rect-solid-dismiss-icon: ${DISMISS_ICON};
		--pill-rect-solid-dismiss-icon-hover: ${DISMISS_ICON_HOVER};
		--pill-invalid-label: ${INVALID_LABEL};
		--pill-invalid-border: rgb(6, 6, 6);
		--pill-invalid-background: ${INVALID_BACKGROUND};
		--pill-invalid-dismiss-icon: ${INVALID_DISMISS_ICON};
		--pill-invalid-dismiss-icon-hover: ${INVALID_DISMISS_ICON_HOVER};
	}`;
	document.head.append(tokens);
});

afterEach(() => {
	tokens.remove();
});

function background(element: Element): string {
	return getComputedStyle(element).backgroundColor;
}

describe('Pill.Closeable invalid', () => {
	function renderInvalidChipAndDangerPill(): { chip: HTMLElement; danger: HTMLElement } {
		render(
			<>
				{/* A danger pill on the invalid colour tints it the way the chip should. */}
				<Pill
					variant="outlined"
					color="danger"
					style={{ '--pill-danger-background': INVALID_BACKGROUND } as CSSProperties}
				>
					danger
				</Pill>
				<Pill.Closeable onClose={vi.fn()} aria-invalid>
					env:prod
				</Pill.Closeable>
			</>,
		);

		return {
			chip: screen.getByRole('button', { name: 'env:prod' }),
			danger: screen.getByRole('button', { name: 'danger' }),
		};
	}

	it('tints the invalid background the way a hovered pill tints its colour', async () => {
		const { chip, danger } = renderInvalidChipAndDangerPill();

		const restingDanger = background(danger);
		await userEvent.hover(danger);
		const hoveredDanger = background(danger);
		// Guards the comparison below: without a real hover both would read the resting fill.
		expect(hoveredDanger).not.toBe(restingDanger);

		await userEvent.hover(chip);

		expect(background(chip)).toBe(hoveredDanger);
	});

	it('paints the close icon in the invalid dismiss icon colours', async () => {
		render(
			<Pill.Closeable onClose={vi.fn()} aria-invalid>
				env:prod
			</Pill.Closeable>,
		);

		const close = screen.getByRole('button', { name: 'Remove env:prod' });
		expect(getComputedStyle(close).color).toBe(INVALID_DISMISS_ICON);

		await userEvent.hover(close);

		expect(getComputedStyle(close).color).toBe(INVALID_DISMISS_ICON_HOVER);
	});

	it('takes the invalid overrides over the token defaults', () => {
		render(
			<Pill.Closeable
				onClose={vi.fn()}
				aria-invalid
				style={
					{
						'--pill-invalid-background-color': 'rgb(10, 10, 10)',
						'--pill-invalid-close-color': 'rgb(11, 11, 11)',
					} as CSSProperties
				}
			>
				env:prod
			</Pill.Closeable>,
		);

		expect(background(screen.getByRole('button', { name: 'env:prod' }))).toBe('rgb(10, 10, 10)');
		expect(getComputedStyle(screen.getByRole('button', { name: 'Remove env:prod' })).color).toBe(
			'rgb(11, 11, 11)',
		);
	});

	it('leaves a valid chip on the neutral fill and the dismiss icon colours', async () => {
		render(<Pill.Closeable onClose={vi.fn()}>env:prod</Pill.Closeable>);

		const close = screen.getByRole('button', { name: 'Remove env:prod' });
		expect(background(screen.getByRole('button', { name: 'env:prod' }))).toBe('rgb(1, 1, 1)');
		expect(getComputedStyle(close).color).toBe(DISMISS_ICON);

		await userEvent.hover(close);

		expect(getComputedStyle(close).color).toBe(DISMISS_ICON_HOVER);
	});
});

describe('Pill spacing tokens', () => {
	function endPadding(element: HTMLElement): string {
		return getComputedStyle(element).paddingInlineEnd;
	}

	it('insets the close button as far from the end as from the top, at any icon size', () => {
		render(
			<>
				<Pill.Closeable onClose={vi.fn()} testId="default">
					env:prod
				</Pill.Closeable>
				<Pill.Closeable
					onClose={vi.fn()}
					testId="large"
					style={{ '--pill-close-icon-size': '16px' } as CSSProperties}
				>
					env:prod
				</Pill.Closeable>
			</>,
		);

		// (20px height - icon) / 2, less the 1px border.
		expect(endPadding(screen.getByTestId('default'))).toBe('3px');
		expect(endPadding(screen.getByTestId('large'))).toBe('1px');
	});

	it('takes the close side padding, tracking and single-character padding from --pill-*', () => {
		render(
			<>
				<Pill.Closeable
					onClose={vi.fn()}
					testId="chip"
					style={{ '--pill-closeable-padding-inline-end': '6px' } as CSSProperties}
				>
					env:prod
				</Pill.Closeable>
				<Pill
					testId="one"
					style={
						{
							'--pill-letter-spacing': '2px',
							'--pill-single-char-padding-inline': '5px',
						} as CSSProperties
					}
				>
					5
				</Pill>
			</>,
		);

		const one = screen.getByTestId('one');

		expect(endPadding(screen.getByTestId('chip'))).toBe('6px');
		expect(getComputedStyle(one).letterSpacing).toBe('2px');
		expect(getComputedStyle(one).paddingInlineStart).toBe('5px');
	});
});
