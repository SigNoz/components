import { render, screen } from '@testing-library/react';
import type { CSSProperties, ReactElement } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Field } from '../../field/field.js';
import { ToggleGroup, ToggleGroupField } from '../index.js';
import type { ToggleGroupItemProps } from '../types.js';

const ITEMS: ToggleGroupItemProps[] = [
	{ value: 'list', label: 'List' },
	{ value: 'grid', label: 'Grid' },
];

const BAR = { type: 'single', variant: 'outlined', color: 'secondary', size: 'md' } as const;

const DESTRUCTIVE = 'rgb(255, 0, 0)';
const BORDER = 'rgb(10, 20, 30)';
const PRESSED = 'rgb(1, 2, 3)';

let tokens: HTMLStyleElement;

// The tokens live in `@signozhq/design-tokens` and are not loaded here, so each colour is declared:
// one per slot, so a computed colour says which rule painted it.
beforeEach(() => {
	tokens = document.createElement('style');
	tokens.textContent = `:root {
		--destructive: ${DESTRUCTIVE};
		--toggle-group-border: ${BORDER};
		--toggle-group-secondary-outlined-background-active: ${PRESSED};
	}`;
	document.head.append(tokens);
});

afterEach(() => {
	tokens.remove();
});

function borderOf(element: HTMLElement): string {
	return getComputedStyle(element).borderTopColor;
}

describe('ToggleGroup in a Field with an error', () => {
	it('paints the outline of the bar with the destructive color for an error, and for no other status', () => {
		function field(status: 'danger' | 'warning' | 'success' | undefined): ReactElement {
			const rest =
				status === 'danger'
					? { error: 'Pick one' }
					: status === undefined
						? {}
						: { status, message: 'Something to say' };

			return (
				<Field label="Layout" {...rest}>
					<ToggleGroup {...BAR} items={ITEMS} testId="bar" />
				</Field>
			);
		}

		const { rerender } = render(field('danger'));

		expect(screen.getByTestId('bar')).toHaveAttribute('data-invalid');
		expect(borderOf(screen.getByTestId('bar'))).toBe(DESTRUCTIVE);

		for (const status of [undefined, 'warning', 'success'] as const) {
			rerender(field(status));

			expect(screen.getByTestId('bar')).not.toHaveAttribute('data-invalid');
			expect(borderOf(screen.getByTestId('bar'))).toBe(BORDER);
		}

		rerender(field('danger'));

		expect(borderOf(screen.getByTestId('bar'))).toBe(DESTRUCTIVE);
	});

	it('sets no aria-invalid, which the group role does not allow', () => {
		render(
			<Field label="Layout" error="Pick one">
				<ToggleGroup {...BAR} items={ITEMS} testId="bar" />
			</Field>,
		);

		expect(screen.getByTestId('bar')).toHaveAttribute('data-invalid');
		expect(screen.getByTestId('bar')).not.toHaveAttribute('aria-invalid');
		expect(document.querySelector('[data-slot="toggle-group-list"]')).not.toHaveAttribute(
			'aria-invalid',
		);
	});

	it('keeps the pressed fill and the seams between the options', () => {
		render(
			<Field label="Layout" error="Pick one">
				<ToggleGroup {...BAR} items={ITEMS} defaultValue="list" testId="bar" />
			</Field>,
		);

		const list = screen.getByRole('button', { name: 'List' });
		const grid = screen.getByRole('button', { name: 'Grid' });

		expect(borderOf(screen.getByTestId('bar'))).toBe(DESTRUCTIVE);
		expect(list).toHaveAttribute('data-pressed');
		expect(getComputedStyle(list).backgroundColor).toBe(PRESSED);
		expect(getComputedStyle(grid).borderInlineStartColor).toBe(BORDER);
	});

	it('takes --toggle-group-invalid-border-color over the destructive color', () => {
		render(
			<div style={{ '--toggle-group-invalid-border-color': 'rgb(7, 8, 9)' } as CSSProperties}>
				<Field label="Layout" error="Pick one">
					<ToggleGroup {...BAR} items={ITEMS} testId="bar" />
				</Field>
			</div>,
		);

		expect(borderOf(screen.getByTestId('bar'))).toBe('rgb(7, 8, 9)');
	});

	it('paints the bar of a ToggleGroupField with an error, and not without one', () => {
		const { rerender } = render(
			<ToggleGroupField label="Layout" {...BAR} items={ITEMS} error="Pick one" testId="bar" />,
		);

		expect(borderOf(screen.getByTestId('bar'))).toBe(DESTRUCTIVE);

		rerender(<ToggleGroupField label="Layout" {...BAR} items={ITEMS} testId="bar" />);

		expect(borderOf(screen.getByTestId('bar'))).toBe(BORDER);
	});
});

describe('ToggleGroup in a Field.Group with an error', () => {
	it('paints the outline of a single bar, and not without an error', () => {
		function group(error: string | undefined): ReactElement {
			return (
				<Field.Group label="Layout" {...(error === undefined ? {} : { error })}>
					<ToggleGroup {...BAR} items={ITEMS} testId="bar" />
				</Field.Group>
			);
		}

		const { rerender } = render(group('Pick one'));

		expect(screen.getByTestId('bar')).toHaveAttribute('data-invalid');
		expect(borderOf(screen.getByTestId('bar'))).toBe(DESTRUCTIVE);

		rerender(group(undefined));

		expect(screen.getByTestId('bar')).not.toHaveAttribute('data-invalid');
		expect(borderOf(screen.getByTestId('bar'))).toBe(BORDER);
	});

	it('paints the outline of a multiple bar with options pressed', () => {
		render(
			<Field.Group label="Layout" error="Pick one">
				<ToggleGroup {...BAR} type="multiple" items={ITEMS} defaultValue={['list']} testId="bar" />
			</Field.Group>,
		);

		expect(borderOf(screen.getByTestId('bar'))).toBe(DESTRUCTIVE);
	});
});
