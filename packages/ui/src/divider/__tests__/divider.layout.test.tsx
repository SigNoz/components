import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Divider } from '../divider.js';

// The design tokens are not loaded here, so the steps the divider reads are declared in the test,
// with the numbers `@signozhq/design-tokens` ships.
let tokens: HTMLStyleElement;

beforeEach(() => {
	tokens = document.createElement('style');
	tokens.textContent = `:root {
		--spacing-4: 8px;
		--spacing-6: 12px;
		--font-size-sm: 14px;
		--divider-border: rgb(1, 2, 3);
	}`;
	document.head.append(tokens);
});

afterEach(() => {
	tokens.remove();
});

function line(element: HTMLElement, pseudo: '::before' | '::after'): CSSStyleDeclaration {
	return getComputedStyle(element, pseudo);
}

describe('Divider layout', () => {
	it('fills the width of its parent with a 1px line', () => {
		render(
			<div style={{ width: 320 }}>
				<Divider testId="divider" />
			</div>,
		);
		const rect = screen.getByTestId('divider').getBoundingClientRect();

		expect(rect.width).toBe(320);
		expect(rect.height).toBe(1);
		expect(line(screen.getByTestId('divider'), '::before').borderTopColor).toBe('rgb(1, 2, 3)');
	});

	it('does not shrink in a flex column', () => {
		render(
			<div style={{ display: 'flex', flexDirection: 'column', height: 20, width: 200 }}>
				<div style={{ height: 40, flexShrink: 1 }} />
				<Divider testId="divider" />
			</div>,
		);

		expect(screen.getByTestId('divider').getBoundingClientRect().height).toBe(1);
	});

	it('draws a dashed line on both sides of the label', () => {
		render(
			<Divider dashed testId="divider">
				OR
			</Divider>,
		);
		const divider = screen.getByTestId('divider');

		expect(line(divider, '::before').borderTopStyle).toBe('dashed');
		expect(line(divider, '::after').borderTopStyle).toBe('dashed');
	});

	it('draws one line without a label', () => {
		render(<Divider testId="divider" />);

		expect(line(screen.getByTestId('divider'), '::after').content).toBe('none');
	});

	it('keeps the label on one line and shrinks the lines first', () => {
		render(
			<div style={{ width: 120 }}>
				<Divider testId="divider">Or get started with these sample alerts</Divider>
			</div>,
		);
		const label = screen.getByTestId('divider-label');

		expect(getComputedStyle(label).whiteSpace).toBe('nowrap');
		expect(label.getBoundingClientRect().width).toBeGreaterThan(120);
		expect(label.getBoundingClientRect().height).toBeLessThan(30);
	});

	it('sizes a vertical divider from the font size and adds 8px on each side', () => {
		render(
			<span style={{ fontSize: 20 }}>
				Back
				<Divider orientation="vertical" testId="divider" />
				metric
			</span>,
		);
		const divider = screen.getByTestId('divider');
		const style = getComputedStyle(divider);

		expect(divider.getBoundingClientRect().height).toBeCloseTo(18, 0);
		expect(divider.getBoundingClientRect().width).toBe(1);
		expect(style.marginLeft).toBe('8px');
		expect(style.marginRight).toBe('8px');
	});

	it('centres a vertical divider in a flex row', () => {
		render(
			<div data-testid="row" style={{ display: 'flex', alignItems: 'center', height: 40 }}>
				<Divider orientation="vertical" height={16} spacing={0} testId="divider" />
			</div>,
		);
		const row = screen.getByTestId('row').getBoundingClientRect();

		expect(screen.getByTestId('divider').getBoundingClientRect().top - row.top).toBe(12);
	});

	it.each([
		['the default length', undefined],
		['a fixed height', 30],
	])('places a vertical divider in a line of text the same as before, with %s', (_, height) => {
		// The old divider: an inline-block centred with `vertical-align: middle`, then nudged up.
		const reference = {
			display: 'inline-block',
			position: 'relative',
			top: '-0.06em',
			height: height ?? '0.9em',
			verticalAlign: 'middle',
			borderLeft: '1px solid',
		} as const;
		render(
			<p style={{ fontSize: 20 }}>
				Back
				<Divider orientation="vertical" height={height} testId="divider" />
				metric
				<span data-testid="reference" style={reference} />
			</p>,
		);

		expect(screen.getByTestId('divider').getBoundingClientRect().top).toBeCloseTo(
			screen.getByTestId('reference').getBoundingClientRect().top,
			1,
		);
	});

	it('keeps its own spacing off a divider inside its label', () => {
		render(
			<Divider spacing={16} testId="outer">
				Step 1
				<Divider orientation="vertical" testId="inner" />
				Step 2
			</Divider>,
		);
		const inner = getComputedStyle(screen.getByTestId('inner'));

		expect(inner.marginLeft).toBe('8px');
		expect(inner.marginRight).toBe('8px');
	});

	it('draws a dashed vertical line', () => {
		render(<Divider orientation="vertical" dashed testId="divider" />);

		expect(getComputedStyle(screen.getByTestId('divider')).borderLeftStyle).toBe('dashed');
	});

	it('sets the length and the side space of a vertical divider from height and spacing', () => {
		render(<Divider orientation="vertical" height={16} spacing={0} testId="divider" />);
		const divider = screen.getByTestId('divider');
		const style = getComputedStyle(divider);

		expect(style.marginLeft).toBe('0px');
		expect(style.marginRight).toBe('0px');
		expect(divider.getBoundingClientRect().height).toBe(16);
	});

	it('caps the length of a vertical divider at maxHeight', () => {
		render(
			<div style={{ display: 'flex', height: 40 }}>
				<Divider orientation="vertical" height="100%" maxHeight={24} testId="divider" />
			</div>,
		);

		expect(screen.getByTestId('divider').getBoundingClientRect().height).toBe(24);
	});

	it('adds no space around a horizontal divider by default', () => {
		render(<Divider testId="divider" />);
		const style = getComputedStyle(screen.getByTestId('divider'));

		expect(style.marginTop).toBe('0px');
		expect(style.marginBottom).toBe('0px');
	});

	it('sets the space above and below a horizontal divider from spacing', () => {
		const { rerender } = render(<Divider spacing={16} testId="divider" />);
		let style = getComputedStyle(screen.getByTestId('divider'));

		expect(style.marginTop).toBe('16px');
		expect(style.marginBottom).toBe('16px');
		expect(style.marginLeft).toBe('0px');

		rerender(<Divider spacing="10px 16px" testId="divider" />);
		style = getComputedStyle(screen.getByTestId('divider'));

		expect(style.marginTop).toBe('10px');
		expect(style.marginBottom).toBe('16px');
	});

	it('sets the length of a horizontal divider from width, capped by maxWidth', () => {
		const { rerender } = render(
			<div style={{ width: 320 }}>
				<Divider width={120} testId="divider" />
			</div>,
		);

		expect(screen.getByTestId('divider').getBoundingClientRect().width).toBe(120);

		rerender(
			<div style={{ width: 320 }}>
				<Divider maxWidth="50%" testId="divider" />
			</div>,
		);

		expect(screen.getByTestId('divider').getBoundingClientRect().width).toBe(160);
	});
});
