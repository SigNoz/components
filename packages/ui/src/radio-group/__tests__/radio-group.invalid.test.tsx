import { render, screen } from '@testing-library/react';
import type { CSSProperties, ReactElement } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { Field } from '../../field/field.js';
import { RadioGroup, RadioGroupField } from '../index.js';
import type { RadioGroupItemType } from '../types.js';

const ITEMS: RadioGroupItemType[] = [
	{ label: 'Staging', value: 'staging' },
	{ label: 'Production', value: 'production' },
];

const DESTRUCTIVE = 'rgb(255, 0, 0)';
const BORDER = 'rgb(10, 20, 30)';
const BORDER_HOVER = 'rgb(40, 50, 60)';
const FILL = 'rgb(1, 2, 3)';

let tokens: HTMLStyleElement;

// The tokens live in `@signozhq/design-tokens` and are not loaded here, so each colour is declared:
// one per slot, so a computed colour says which rule painted it. The dial transitions its border, and
// a colour read right after a change would be a frame on the way to the new one, so the transition is
// off.
beforeEach(async () => {
	tokens = document.createElement('style');
	tokens.textContent = `:root {
		--destructive: ${DESTRUCTIVE};
		--radio-group-border: ${BORDER};
		--radio-group-primary-border-hover: ${BORDER_HOVER};
		--radio-group-primary-background: ${FILL};
		--radio-group-transition: none;
	}`;
	document.head.append(tokens);
	await parkPointer();
});

afterEach(() => {
	tokens.remove();
});

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

function dial(name: string): HTMLElement {
	return screen.getByRole('radio', { name });
}

function borderOf(element: HTMLElement): string {
	return getComputedStyle(element).borderTopColor;
}

describe('RadioGroup in a Field with an error', () => {
	it('paints the border of every dial with the destructive color for an error, and for no other status', () => {
		function field(status: 'danger' | 'warning' | 'success' | undefined): ReactElement {
			const rest =
				status === 'danger'
					? { error: 'Pick one' }
					: status === undefined
						? {}
						: { status, message: 'Something to say' };

			return (
				<Field label="Environment" {...rest}>
					<RadioGroup color="primary" items={ITEMS} />
				</Field>
			);
		}

		const { rerender } = render(field('danger'));

		expect(borderOf(dial('Staging'))).toBe(DESTRUCTIVE);
		expect(borderOf(dial('Production'))).toBe(DESTRUCTIVE);

		for (const status of [undefined, 'warning', 'success'] as const) {
			rerender(field(status));

			expect(borderOf(dial('Staging'))).toBe(BORDER);
			expect(borderOf(dial('Production'))).toBe(BORDER);
		}

		rerender(field('danger'));

		expect(borderOf(dial('Staging'))).toBe(DESTRUCTIVE);
	});

	it('paints a checked dial too, which keeps its fill', () => {
		render(
			<Field label="Environment" error="Pick one">
				<RadioGroup color="primary" items={ITEMS} defaultValue="staging" />
			</Field>,
		);

		expect(dial('Staging')).toHaveAttribute('data-checked');
		expect(borderOf(dial('Staging'))).toBe(DESTRUCTIVE);
		expect(getComputedStyle(dial('Staging')).backgroundColor).toBe(FILL);
		expect(borderOf(dial('Production'))).toBe(DESTRUCTIVE);
	});

	it('keeps the color while the pointer is over a dial, where a valid dial takes the hover color', async () => {
		render(
			<div>
				<Field label="Valid">
					<RadioGroup color="primary" items={[{ label: 'Valid dial', value: 'valid' }]} />
				</Field>
				<Field label="Invalid" error="Pick one">
					<RadioGroup color="primary" items={[{ label: 'Invalid dial', value: 'invalid' }]} />
				</Field>
			</div>,
		);

		await userEvent.hover(dial('Valid dial'));

		// Guards the comparison below: without a real hover both would read the resting color.
		expect(borderOf(dial('Valid dial'))).toBe(BORDER_HOVER);

		await userEvent.hover(dial('Invalid dial'));

		expect(borderOf(dial('Invalid dial'))).toBe(DESTRUCTIVE);
	});

	it('takes --radio-group-invalid-border-color over the destructive color', () => {
		render(
			<div style={{ '--radio-group-invalid-border-color': 'rgb(7, 8, 9)' } as CSSProperties}>
				<Field label="Environment" error="Pick one">
					<RadioGroup color="primary" items={ITEMS} />
				</Field>
			</div>,
		);

		expect(borderOf(dial('Staging'))).toBe('rgb(7, 8, 9)');
	});

	it('paints the dials of a RadioGroupField with an error, and not without one', () => {
		const { rerender } = render(
			<RadioGroupField color="primary" label="Environment" items={ITEMS} error="Pick one" />,
		);

		expect(borderOf(dial('Staging'))).toBe(DESTRUCTIVE);

		rerender(<RadioGroupField color="primary" label="Environment" items={ITEMS} />);

		expect(borderOf(dial('Staging'))).toBe(BORDER);
	});
});

describe('RadioGroup in a Field.Group with an error', () => {
	it('paints the dials', () => {
		render(
			<Field.Group label="Environment" error="Pick one">
				<RadioGroup color="primary" items={ITEMS} />
			</Field.Group>,
		);

		expect(borderOf(dial('Staging'))).toBe(DESTRUCTIVE);
		expect(borderOf(dial('Production'))).toBe(DESTRUCTIVE);
	});
});

describe('RadioGroup with an aria-invalid of its own', () => {
	it('paints the dials outside any field', () => {
		render(<RadioGroup color="primary" items={ITEMS} aria-label="Environment" aria-invalid />);

		expect(borderOf(dial('Staging'))).toBe(DESTRUCTIVE);
	});

	it('keeps an aria-invalid of false over the status of a Field.Group', () => {
		render(
			<Field.Group label="Environment" error="Pick one">
				<RadioGroup color="primary" items={[{ label: 'Painted', value: 'painted' }]} />
				<RadioGroup
					color="primary"
					items={[{ label: 'Valid', value: 'valid' }]}
					aria-invalid="false"
				/>
			</Field.Group>,
		);

		expect(borderOf(dial('Painted'))).toBe(DESTRUCTIVE);
		expect(borderOf(dial('Valid'))).toBe(BORDER);
	});
});
