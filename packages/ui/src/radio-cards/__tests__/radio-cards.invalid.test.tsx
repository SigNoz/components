import { render, screen } from '@testing-library/react';
import type { CSSProperties, ReactElement } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Field } from '../../field/field.js';
import { RadioCards, RadioCardsField } from '../index.js';
import { installTokens, ITEMS } from './radio-cards.test-utils.js';

const DESTRUCTIVE = 'rgb(255, 0, 0)';
const BORDER = 'rgb(10, 20, 30)';
const CHECKED_BORDER = 'rgb(40, 50, 60)';
const CHECKED_BACKGROUND = 'rgb(1, 2, 3)';

installTokens();

let colors: HTMLStyleElement;

// The tokens live in `@signozhq/design-tokens` and are not loaded here, so each colour is declared:
// one per slot, so a computed colour says which rule painted it. The card transitions its border, and
// a colour read right after a change would be a frame on the way to the new one, so the transition is
// off.
beforeEach(() => {
	colors = document.createElement('style');
	colors.textContent = `:root {
		--destructive: ${DESTRUCTIVE};
		--radio-cards-border: ${BORDER};
		--radio-cards-checked-border: ${CHECKED_BORDER};
		--radio-cards-checked-background: ${CHECKED_BACKGROUND};
		--radio-cards-item-transition-duration: 0s;
	}`;
	document.head.append(colors);
});

afterEach(() => {
	colors.remove();
});

function card(name: string, role: 'radio' | 'checkbox' = 'radio'): HTMLElement {
	return screen.getByRole(role, { name });
}

function borderOf(element: HTMLElement): string {
	return getComputedStyle(element).borderTopColor;
}

describe('RadioCards in a Field with an error', () => {
	it('paints the border of every card with the destructive color for an error, and for no other status', () => {
		function field(status: 'danger' | 'warning' | 'success' | undefined): ReactElement {
			const rest =
				status === 'danger'
					? { error: 'Pick one' }
					: status === undefined
						? {}
						: { status, message: 'Something to say' };

			return (
				<Field label="Signal" {...rest}>
					<RadioCards items={ITEMS} />
				</Field>
			);
		}

		const { rerender } = render(field('danger'));

		for (const name of ['Logs', 'Traces', 'Metrics']) {
			expect(borderOf(card(name))).toBe(DESTRUCTIVE);
		}

		for (const status of [undefined, 'warning', 'success'] as const) {
			rerender(field(status));

			expect(borderOf(card('Logs'))).toBe(BORDER);
		}

		rerender(field('danger'));

		expect(borderOf(card('Logs'))).toBe(DESTRUCTIVE);
	});

	it('paints a checked card too, which keeps its fill', () => {
		render(
			<Field label="Signal" error="Pick one">
				<RadioCards items={ITEMS} defaultValue="traces" />
			</Field>,
		);

		expect(card('Traces')).toHaveAttribute('data-checked');
		expect(borderOf(card('Traces'))).toBe(DESTRUCTIVE);
		expect(getComputedStyle(card('Traces')).backgroundColor).toBe(CHECKED_BACKGROUND);
	});

	it('takes --radio-cards-invalid-border-color over the destructive color', () => {
		render(
			<div style={{ '--radio-cards-invalid-border-color': 'rgb(7, 8, 9)' } as CSSProperties}>
				<Field label="Signal" error="Pick one">
					<RadioCards items={ITEMS} />
				</Field>
			</div>,
		);

		expect(borderOf(card('Logs'))).toBe('rgb(7, 8, 9)');
	});

	it('paints the cards of a RadioCardsField with an error, and not without one', () => {
		const { rerender } = render(<RadioCardsField label="Signal" items={ITEMS} error="Pick one" />);

		expect(borderOf(card('Logs'))).toBe(DESTRUCTIVE);

		rerender(<RadioCardsField label="Signal" items={ITEMS} />);

		expect(borderOf(card('Logs'))).toBe(BORDER);
	});
});

describe('RadioCards with an aria-invalid of its own', () => {
	it('paints the cards outside any field', () => {
		render(<RadioCards items={ITEMS} aria-label="Signal" aria-invalid />);

		expect(borderOf(card('Logs'))).toBe(DESTRUCTIVE);
	});

	it('keeps an aria-invalid of false over the status of a Field.Group', () => {
		render(
			<Field.Group label="Signal" error="Pick one">
				<RadioCards items={[{ label: 'Painted', value: 'painted' }]} />
				<RadioCards items={[{ label: 'Valid', value: 'valid' }]} aria-invalid="false" />
			</Field.Group>,
		);

		expect(borderOf(card('Painted'))).toBe(DESTRUCTIVE);
		expect(borderOf(card('Valid'))).toBe(BORDER);
	});
});

describe('RadioCards.Multiple in a Field.Group with an error', () => {
	it('paints every card, and marks the group with data-invalid and not with aria-invalid', () => {
		function group(error: string | undefined): ReactElement {
			return (
				<Field.Group label="Signal" {...(error === undefined ? {} : { error })}>
					<RadioCards.Multiple items={ITEMS} testId="signal" defaultValue={['traces']} />
				</Field.Group>
			);
		}

		const { rerender } = render(group('Pick one'));
		const root = screen.getByTestId('signal');

		expect(root).toHaveAttribute('data-invalid');
		expect(root).not.toHaveAttribute('aria-invalid');
		expect(borderOf(card('Logs', 'checkbox'))).toBe(DESTRUCTIVE);
		expect(borderOf(card('Traces', 'checkbox'))).toBe(DESTRUCTIVE);
		expect(getComputedStyle(card('Traces', 'checkbox')).backgroundColor).toBe(CHECKED_BACKGROUND);

		rerender(group(undefined));

		expect(screen.getByTestId('signal')).not.toHaveAttribute('data-invalid');
		expect(borderOf(card('Logs', 'checkbox'))).toBe(BORDER);
	});
});

describe('RadioCards.Multiple in a Field with an error', () => {
	it('paints every card for an error, and for no other status', () => {
		function field(status: 'danger' | 'warning'): ReactElement {
			const rest =
				status === 'danger' ? { error: 'Pick one' } : { status, message: 'Something to say' };

			return (
				<Field label="Signal" {...rest}>
					<RadioCards.Multiple items={ITEMS} testId="signal" />
				</Field>
			);
		}

		const { rerender } = render(field('danger'));

		expect(screen.getByTestId('signal')).toHaveAttribute('data-invalid');
		expect(borderOf(card('Logs', 'checkbox'))).toBe(DESTRUCTIVE);
		expect(borderOf(card('Metrics', 'checkbox'))).toBe(DESTRUCTIVE);

		rerender(field('warning'));

		expect(borderOf(card('Logs', 'checkbox'))).toBe(BORDER);
	});
});
