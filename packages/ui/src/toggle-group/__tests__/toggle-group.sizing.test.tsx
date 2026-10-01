import { render, screen, waitFor } from '@testing-library/react';
import type { CSSProperties, ReactElement, ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { ToggleGroup } from '../toggle-group.js';
import type { ToggleGroupItemProps } from '../types.js';

/**
 * Real layout, so nothing here may import `mockLabelMeasurement`.
 *
 * The package tokens are not loaded here, so the frame supplies the ones a size is built from. The
 * border colour is among them: a border whose colour is an undefined variable is dropped whole, and
 * the bar would measure without it.
 *
 * Nor is there a global `box-sizing` reset, which is the point: signoz-v3 has none, so every
 * border-box this component relies on has to be its own.
 */
const TOKENS = {
	'--spacing-2': '4px',
	'--spacing-3': '6px',
	'--spacing-6': '12px',
	'--spacing-12': '24px',
	'--spacing-16': '32px',
	'--toggle-group-border': 'rgb(1, 2, 3)',
	'--toggle-group-focus-ring': 'rgb(4, 5, 6)',
} as CSSProperties;

const ITEMS: ToggleGroupItemProps[] = [
	{ value: 'list', label: 'List' },
	{ value: 'grid', label: 'Grid' },
];

const MANY_ITEMS: ToggleGroupItemProps[] = Array.from({ length: 8 }, (_, index) => ({
	value: `item-${index}`,
	label: `Option ${index}`,
}));

function renderInFrame(ui: ReactElement, frame: CSSProperties = {}): ReturnType<typeof render> {
	return render(ui, {
		wrapper: ({ children }: { children: ReactNode }) => (
			<div style={{ ...TOKENS, ...frame }}>{children}</div>
		),
	});
}

function height(element: Element): number {
	return element.getBoundingClientRect().height;
}

describe('ToggleGroup sizing', () => {
	it('runs on a page with no global box-sizing reset', () => {
		const probe = document.createElement('div');
		document.body.append(probe);

		expect(getComputedStyle(probe).boxSizing).toBe('content-box');

		probe.remove();
	});

	it.each(['sm', 'md'] as const)('is 32px tall outside at %s, its border included', (size) => {
		renderInFrame(
			<ToggleGroup
				type="single"
				variant="outlined"
				color="secondary"
				size={size}
				testId="bar"
				items={ITEMS}
			/>,
		);

		const bar = screen.getByTestId('bar');

		expect(getComputedStyle(bar).borderTopWidth).toBe('1px');
		expect(height(bar)).toBe(32);
		expect(height(screen.getByTestId('bar-button-list'))).toBe(30);
	});

	it('takes a thicker bar border out of the buttons rather than adding it on', () => {
		renderInFrame(
			<ToggleGroup
				type="single"
				variant="outlined"
				color="secondary"
				size="md"
				testId="bar"
				items={ITEMS}
			/>,
			{ '--toggle-group-border-width': '2px' } as CSSProperties,
		);

		expect(height(screen.getByTestId('bar'))).toBe(32);
		expect(height(screen.getByTestId('bar-button-list'))).toBe(28);
	});

	it('keeps a button border-box, so padding a token adds back stays inside its height', () => {
		renderInFrame(
			<ToggleGroup
				type="single"
				variant="outlined"
				color="secondary"
				size="md"
				testId="bar"
				items={ITEMS}
			/>,
			{ '--toggle-group-button-padding-block': '10px' } as CSSProperties,
		);

		const button = screen.getByTestId('bar-button-list');

		expect(getComputedStyle(button).boxSizing).toBe('border-box');
		expect(getComputedStyle(button).paddingTop).toBe('10px');
		expect(height(button)).toBe(30);
		expect(height(screen.getByTestId('bar'))).toBe(32);
	});

	it('fills a parent to the pixel at width 100%, its border included', () => {
		renderInFrame(
			<ToggleGroup
				type="single"
				variant="outlined"
				color="secondary"
				size="md"
				width="100%"
				testId="bar"
				items={ITEMS}
			/>,
			{ width: 300 },
		);

		const bar = screen.getByTestId('bar');

		expect(getComputedStyle(bar).boxSizing).toBe('border-box');
		expect(bar.getBoundingClientRect().width).toBe(300);
	});

	it('keeps a scroll arrow 24px across, its padding and rule included', async () => {
		renderInFrame(
			<ToggleGroup
				type="single"
				variant="outlined"
				color="secondary"
				size="md"
				width="100%"
				items={MANY_ITEMS}
			/>,
			{ width: 260 },
		);

		await waitFor(() =>
			expect(
				document.querySelector('[data-slot="toggle-group-scroll-button"][data-direction="end"]'),
			).not.toBeNull(),
		);

		const end = document.querySelector<HTMLElement>(
			'[data-slot="toggle-group-scroll-button"][data-direction="end"]',
		) as HTMLElement;

		expect(getComputedStyle(end).boxSizing).toBe('border-box');
		expect(end.getBoundingClientRect().width).toBe(24);
		expect(height(end)).toBe(30);
	});

	it('keeps its height in a column flex parent short on space', () => {
		renderInFrame(
			<ToggleGroup
				type="single"
				variant="outlined"
				color="secondary"
				size="md"
				testId="bar"
				items={ITEMS}
			/>,
			{ display: 'flex', flexDirection: 'column', height: 8 },
		);

		expect(height(screen.getByTestId('bar'))).toBe(32);
	});
});
