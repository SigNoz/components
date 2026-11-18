import { render, screen } from '@testing-library/react';
import type { CSSProperties, ReactElement } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { Field } from '../../field/field.js';
import { Checkbox, CheckboxField } from '../index.js';

const DESTRUCTIVE = 'rgb(255, 0, 0)';
const BORDER = 'rgb(10, 20, 30)';
const BORDER_HOVER = 'rgb(40, 50, 60)';
const FILL = 'rgb(1, 2, 3)';

let tokens: HTMLStyleElement;

// The tokens live in `@signozhq/design-tokens` and are not loaded here, so each colour is declared:
// one per slot, so a computed colour says which rule painted it. The box transitions its border, and
// a colour read right after a change would be a frame on the way to the new one, so the transition is
// off.
beforeEach(async () => {
	tokens = document.createElement('style');
	tokens.textContent = `:root {
		--destructive: ${DESTRUCTIVE};
		--checkbox-border: ${BORDER};
		--checkbox-primary-border-hover: ${BORDER_HOVER};
		--checkbox-primary-background: ${FILL};
		--checkbox-transition: none;
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

function boxOf(checkbox: HTMLElement): HTMLElement {
	const box = checkbox.querySelector<HTMLElement>('[data-slot="checkbox-box"]');
	if (box === null) {
		throw new Error('the checkbox rendered no box');
	}

	return box;
}

function borderOf(checkbox: HTMLElement): string {
	return getComputedStyle(boxOf(checkbox)).borderTopColor;
}

describe('Checkbox in a Field with an error', () => {
	it('paints the border of the box with the destructive color for an error, and for no other status', () => {
		function field(status: 'danger' | 'warning' | 'success' | undefined): ReactElement {
			const rest =
				status === 'danger'
					? { error: 'Required' }
					: status === undefined
						? {}
						: { status, message: 'Something to say' };

			return (
				<Field label="Alerts" {...rest}>
					<Checkbox color="primary" testId="checkbox">
						Send alerts
					</Checkbox>
				</Field>
			);
		}

		const { rerender } = render(field('danger'));

		expect(borderOf(screen.getByTestId('checkbox'))).toBe(DESTRUCTIVE);

		for (const status of [undefined, 'warning', 'success'] as const) {
			rerender(field(status));

			expect(borderOf(screen.getByTestId('checkbox'))).toBe(BORDER);
		}

		rerender(field('danger'));

		expect(borderOf(screen.getByTestId('checkbox'))).toBe(DESTRUCTIVE);
	});

	it('paints a checked box too, which keeps its fill and its check', () => {
		render(
			<Field label="Alerts" error="Required">
				<Checkbox color="primary" testId="checkbox" defaultValue>
					Send alerts
				</Checkbox>
			</Field>,
		);

		const checkbox = screen.getByTestId('checkbox');

		expect(checkbox).toHaveAttribute('data-checked');
		expect(borderOf(checkbox)).toBe(DESTRUCTIVE);
		expect(getComputedStyle(boxOf(checkbox)).backgroundColor).toBe(FILL);
		expect(checkbox.querySelector('[data-slot="checkbox-indicator"]')).toBeInTheDocument();
	});

	it('paints an indeterminate box', () => {
		render(
			<Field label="Alerts" error="Required">
				<Checkbox color="primary" testId="checkbox" value="indeterminate">
					Send alerts
				</Checkbox>
			</Field>,
		);

		expect(borderOf(screen.getByTestId('checkbox'))).toBe(DESTRUCTIVE);
	});

	it('keeps the color while the pointer is over the box, where a valid box takes the hover color', async () => {
		render(
			<div>
				<Field label="Valid">
					<Checkbox color="primary" testId="valid">
						Valid
					</Checkbox>
				</Field>
				<Field label="Invalid" error="Required">
					<Checkbox color="primary" testId="invalid">
						Invalid
					</Checkbox>
				</Field>
			</div>,
		);

		await userEvent.hover(boxOf(screen.getByTestId('valid')));

		// Guards the comparison below: without a real hover both would read the resting color.
		expect(borderOf(screen.getByTestId('valid'))).toBe(BORDER_HOVER);

		await userEvent.hover(boxOf(screen.getByTestId('invalid')));

		expect(borderOf(screen.getByTestId('invalid'))).toBe(DESTRUCTIVE);
	});

	it('takes --checkbox-invalid-border-color over the destructive color', () => {
		render(
			<div style={{ '--checkbox-invalid-border-color': 'rgb(7, 8, 9)' } as CSSProperties}>
				<Field label="Alerts" error="Required">
					<Checkbox color="primary" testId="checkbox">
						Send alerts
					</Checkbox>
				</Field>
			</div>,
		);

		expect(borderOf(screen.getByTestId('checkbox'))).toBe('rgb(7, 8, 9)');
	});

	it('paints the checkbox of a CheckboxField with an error, and not without one', () => {
		const { rerender } = render(
			<CheckboxField color="primary" label="I accept" error="Required" testId="terms" />,
		);

		expect(borderOf(screen.getByTestId('terms'))).toBe(DESTRUCTIVE);

		rerender(<CheckboxField color="primary" label="I accept" testId="terms" />);

		expect(borderOf(screen.getByTestId('terms'))).toBe(BORDER);
	});
});

describe('Checkbox in a Field.Group with an error', () => {
	it('paints every box of the list and marks each checkbox with data-invalid, and not with aria-invalid', () => {
		function group(error: string | undefined): ReactElement {
			return (
				<Field.Group label="Notify me by" {...(error === undefined ? {} : { error })}>
					<Checkbox color="primary" testId="email">
						Email
					</Checkbox>
					<Checkbox color="primary" testId="slack" defaultValue>
						Slack
					</Checkbox>
				</Field.Group>
			);
		}

		const { rerender } = render(group('Pick one'));

		for (const testId of ['email', 'slack']) {
			const checkbox = screen.getByTestId(testId);

			expect(checkbox).toHaveAttribute('data-invalid');
			expect(checkbox).not.toHaveAttribute('aria-invalid');
			expect(borderOf(checkbox)).toBe(DESTRUCTIVE);
		}

		rerender(group(undefined));

		for (const testId of ['email', 'slack']) {
			expect(screen.getByTestId(testId)).not.toHaveAttribute('data-invalid');
		}

		// A checked box takes the color of its fill for the border.
		expect(borderOf(screen.getByTestId('email'))).toBe(BORDER);
		expect(borderOf(screen.getByTestId('slack'))).toBe(FILL);
	});
});

describe('Checkbox with an aria-invalid of its own', () => {
	it('paints the border outside any field', () => {
		render(
			<Checkbox color="primary" testId="checkbox" aria-invalid>
				Send alerts
			</Checkbox>,
		);

		expect(borderOf(screen.getByTestId('checkbox'))).toBe(DESTRUCTIVE);
	});
});
