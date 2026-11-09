import { render, screen } from '@testing-library/react';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { Kbd } from '../../kbd/index.js';
import { Button, ButtonColor, ButtonVariant } from '../index.js';

const NEUTRAL_FOREGROUND = 'rgb(173, 180, 194)';
const NEUTRAL_BORDER = 'rgb(44, 48, 58)';
const NEUTRAL_BACKGROUND = 'rgb(35, 38, 46)';
const LABEL = 'rgb(10, 20, 30)';

const COLORED_SOLIDS = Object.values(ButtonColor).filter(
	(color) => color !== ButtonColor.Secondary,
);

/**
 * The design tokens are not loaded here, so the values the key and the button read are declared in
 * the test. The colors are made up, to tell the key's neutral look from the button's label color.
 */
let tokens: HTMLStyleElement;

beforeAll(async () => {
	await page.viewport(1280, 800);

	tokens = document.createElement('style');
	tokens.textContent = `:root {
		--spacing-1: 2px;
		--spacing-2: 4px;
		--spacing-3: 6px;
		--spacing-4: 8px;
		--spacing-6: 12px;
		--spacing-10: 20px;
		--radius-1-5: 3px;
		--code-small-500-font-size: 11px;
		--code-small-500-line-height: 1;
		--secondary-border: ${NEUTRAL_BORDER};
		--secondary-background: ${NEUTRAL_BACKGROUND};
		--secondary-background-hover: rgb(50, 54, 64);
		--secondary-foreground: ${NEUTRAL_FOREGROUND};
		--kbd-transition-duration: 0s;
		${Object.values(ButtonColor)
			.map(
				(color) =>
					`--button-${color}-background: rgb(200, 90, 40); --button-${color}-label: ${LABEL};`,
			)
			.join('\n')}
	}`;
	document.head.append(tokens);
});

afterAll(async () => {
	tokens.remove();
	await page.viewport(414, 896);
});

const SUFFIXES = Object.entries({
	'a key': <Kbd value="Enter" testId="suffix" />,
	'a shortcut': <Kbd.Shortcut keys={['Mod', 'K']} testId="suffix" />,
	'a plain element': <span data-testid="suffix" />,
});

function face(testId: string): HTMLElement {
	return screen.getByTestId(testId).firstElementChild as HTMLElement;
}

function expectAbove(suffix: HTMLElement, layer: CSSStyleDeclaration): void {
	const { position, zIndex } = getComputedStyle(suffix);

	expect(position).toBe('relative');
	expect(zIndex).not.toBe('auto');
	expect(Number(zIndex)).toBeGreaterThan(Number(layer.zIndex));
}

describe('Button with a Kbd suffix', () => {
	describe('a solid button with a color', () => {
		it.each(COLORED_SOLIDS)('gives the key its label color inside a solid %s button', (color) => {
			render(
				<Button
					size="md"
					variant={ButtonVariant.Solid}
					color={color}
					suffix={<Kbd value="Enter" testId="key" />}
				>
					Run
				</Button>,
			);

			const style = getComputedStyle(face('key'));

			expect(style.color).toBe(LABEL);
			expect(style.color).not.toBe(NEUTRAL_FOREGROUND);
			expect(style.borderTopColor).not.toBe(NEUTRAL_BORDER);
			expect(style.backgroundColor).not.toBe(NEUTRAL_BACKGROUND);
		});
	});

	describe('a button that keeps the neutral key', () => {
		it.each([
			{ variant: ButtonVariant.Solid, color: ButtonColor.Secondary },
			{ variant: ButtonVariant.Outlined, color: ButtonColor.Secondary },
			{ variant: ButtonVariant.Dashed, color: ButtonColor.Secondary },
			{ variant: ButtonVariant.Ghost, color: ButtonColor.Secondary },
			{ variant: ButtonVariant.Link, color: ButtonColor.Primary },
		] as const)('keeps the neutral look inside a $variant $color button', (props) => {
			render(
				<Button size="md" {...props} suffix={<Kbd value="Enter" testId="key" />}>
					Run
				</Button>,
			);

			const style = getComputedStyle(face('key'));

			expect(style.color).toBe(NEUTRAL_FOREGROUND);
			expect(style.borderTopColor).toBe(NEUTRAL_BORDER);
			expect(style.backgroundColor).toBe(NEUTRAL_BACKGROUND);
		});
	});

	describe.each(['sm', 'md'] as const)('in a disabled outlined %s button', (size) => {
		it.each(SUFFIXES)('stacks %s above both stripes', (_name, suffix) => {
			render(
				<Button
					size={size}
					variant={ButtonVariant.Outlined}
					color={ButtonColor.Secondary}
					disabled
					disabledTooltip={undefined}
					suffix={suffix}
				>
					Run
				</Button>,
			);

			const button = screen.getByRole('button');

			expectAbove(screen.getByTestId('suffix'), getComputedStyle(button, '::before'));
			expectAbove(screen.getByTestId('suffix'), getComputedStyle(button, '::after'));
		});
	});

	describe('in a ghost button that is loading', () => {
		it.each(SUFFIXES)('stacks %s above the glow', (_name, suffix) => {
			render(
				<Button
					size="md"
					variant={ButtonVariant.Ghost}
					color={ButtonColor.Secondary}
					loading
					suffix={suffix}
				>
					Run
				</Button>,
			);

			expectAbove(
				screen.getByTestId('suffix'),
				getComputedStyle(screen.getByRole('button'), '::before'),
			);
		});
	});
});
