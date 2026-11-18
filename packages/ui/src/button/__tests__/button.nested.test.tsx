import { render, screen } from '@testing-library/react';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { Kbd } from '../../kbd/index.js';
import { Button, ButtonColor, ButtonTextOverflow, ButtonVariant } from '../index.js';

const NEUTRAL_FOREGROUND = 'rgb(173, 180, 194)';
const LABEL = 'rgb(10, 20, 30)';

/**
 * A button inside another button is invalid HTML, and React says so on the console. These tests
 * nest one anyway, because a consumer can, and pin that the outer button's state never reaches the
 * inner one: the inner button must look the same as it does on its own.
 */
let tokens: HTMLStyleElement;
let consoleError: ReturnType<typeof vi.spyOn>;

beforeAll(() => {
	const forward = console.error.bind(console);
	consoleError = vi.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
		if (String(args[0]).includes('cannot be a descendant of')) {
			return;
		}

		forward(...args);
	});

	tokens = document.createElement('style');
	tokens.textContent = `:root {
		--spacing-1: 2px;
		--spacing-2: 4px;
		--spacing-3: 6px;
		--spacing-4: 8px;
		--spacing-6: 12px;
		--radius-1-5: 3px;
		--code-small-500-font-size: 11px;
		--code-small-500-line-height: 1;
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

afterAll(() => {
	tokens.remove();
	consoleError.mockRestore();
});

function inner(): HTMLElement {
	return screen.getByTestId('inner');
}

function part(root: HTMLElement, selector: string): HTMLElement {
	const element = root.querySelector<HTMLElement>(selector);

	if (!element) {
		throw new Error(`No ${selector} in the button`);
	}

	return element;
}

describe('Button nested in another Button', () => {
	it('does not take the outer width', () => {
		render(
			<>
				<Button
					size="md"
					width={400}
					maxWidth={400}
					textOverflow={ButtonTextOverflow.Hidden}
					suffix={
						<Button size="md" testId="inner">
							Inner
						</Button>
					}
				>
					Outer
				</Button>
				<Button size="md" testId="alone">
					Inner
				</Button>
			</>,
		);

		const { width, maxWidth } = getComputedStyle(inner());
		const alone = getComputedStyle(screen.getByTestId('alone'));

		expect(width).toBe(alone.width);
		expect(maxWidth).toBe(alone.maxWidth);
	});

	it('does not take the outer ellipsis', () => {
		render(
			<Button
				size="md"
				textOverflow={ButtonTextOverflow.Ellipsis}
				suffix={
					<Button size="md" textOverflow={ButtonTextOverflow.Hidden} testId="inner">
						Inner
					</Button>
				}
			>
				Outer
			</Button>,
		);

		expect(getComputedStyle(part(inner(), '[data-slot="button-label"]')).textOverflow).toBe('clip');
		expect(getComputedStyle(inner()).minWidth).toBe('auto');
	});

	it('keeps its own neutral key inside a colored solid button', () => {
		render(
			<Button
				size="md"
				variant={ButtonVariant.Solid}
				color={ButtonColor.Primary}
				suffix={
					<Button
						size="md"
						variant={ButtonVariant.Solid}
						color={ButtonColor.Secondary}
						suffix={<Kbd value="Enter" testId="key" />}
						testId="inner"
					>
						Inner
					</Button>
				}
			>
				Outer
			</Button>,
		);

		const face = screen.getByTestId('key').firstElementChild as HTMLElement;

		expect(getComputedStyle(face).color).toBe(NEUTRAL_FOREGROUND);
	});

	it('gives a colored solid inner button its own key color inside a secondary one', () => {
		render(
			<Button
				size="md"
				variant={ButtonVariant.Solid}
				color={ButtonColor.Secondary}
				suffix={
					<Button
						size="md"
						variant={ButtonVariant.Solid}
						color={ButtonColor.Primary}
						suffix={<Kbd value="Enter" testId="key" />}
						testId="inner"
					>
						Inner
					</Button>
				}
			>
				Outer
			</Button>,
		);

		const face = screen.getByTestId('key').firstElementChild as HTMLElement;

		expect(getComputedStyle(face).color).toBe(LABEL);
	});

	it('does not march its dashed border while only the outer button loads', () => {
		render(
			<Button
				size="md"
				variant={ButtonVariant.Dashed}
				loading
				suffix={
					<Button size="md" variant={ButtonVariant.Dashed} testId="inner">
						Inner
					</Button>
				}
			>
				Outer
			</Button>,
		);

		const rect = part(inner(), '[data-slot="button-dashed-border"] rect');

		expect(getComputedStyle(rect).animationPlayState).toBe('paused');
	});

	it('keeps its prefix visible while only the outer button loads', () => {
		render(
			<Button
				size="md"
				loading
				suffix={
					<Button size="md" prefix={<span>P</span>} testId="inner">
						Inner
					</Button>
				}
			>
				Outer
			</Button>,
		);

		expect(getComputedStyle(part(inner(), '[data-slot="button-prefix-slot"]')).opacity).toBe('1');
		expect(getComputedStyle(part(inner(), '[data-slot="button-prefix-loading"]')).opacity).toBe(
			'0',
		);
	});

	it('shows and turns its own spinner while the outer button is idle', () => {
		render(
			<Button
				size="md"
				suffix={
					<Button size="md" loading testId="inner">
						Inner
					</Button>
				}
			>
				Outer
			</Button>,
		);

		const wrapper = part(inner(), '[data-slot="button-prefix-wrapper"]');

		expect(getComputedStyle(wrapper).overflow).toBe('visible');
		expect(getComputedStyle(part(inner(), '[data-slot="spinner"]')).animationPlayState).toBe(
			'running',
		);
	});

	it.each([
		{ variant: ButtonVariant.Outlined, state: { disabled: true, disabledTooltip: undefined } },
		{ variant: ButtonVariant.Ghost, state: { loading: true } },
	] as const)('does not stack its label like the outer $variant button', ({ variant, state }) => {
		render(
			<Button
				size="md"
				variant={variant}
				color={ButtonColor.Secondary}
				{...state}
				suffix={
					<Button size="md" variant={ButtonVariant.Solid} testId="inner">
						Inner
					</Button>
				}
			>
				Outer
			</Button>,
		);

		expect(getComputedStyle(part(inner(), '[data-slot="button-label"]')).zIndex).toBe('auto');
	});
});
