import { render, screen } from '@testing-library/react';
import type { CSSProperties, ReactElement } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Field } from '../../field/field.js';
import { Switch, SwitchField } from '../index.js';

const DESTRUCTIVE = 'rgb(255, 0, 0)';
const RING = `${DESTRUCTIVE} 0px 0px 0px 1px inset`;

let tokens: HTMLStyleElement;

// The tokens live in `@signozhq/design-tokens` and are not loaded here.
beforeEach(() => {
	tokens = document.createElement('style');
	tokens.textContent = `:root { --destructive: ${DESTRUCTIVE}; }`;
	document.head.append(tokens);
});

afterEach(() => {
	tokens.remove();
});

/**
 * The track has no border, so the ring is an inset shadow: the computed value lists the color, the
 * offsets, the width and `inset`, in the order the browser serialises them.
 */
function ringOf(element: HTMLElement): string {
	return getComputedStyle(element).boxShadow;
}

describe('Switch in a Field with an error', () => {
	it('outlines the track with an inset destructive ring for an error, and for no other status', () => {
		function field(status: 'danger' | 'warning' | 'success' | undefined): ReactElement {
			const rest =
				status === 'danger'
					? { error: 'Required' }
					: status === undefined
						? {}
						: { status, message: 'Something to say' };

			return (
				<Field label="Alerts" {...rest}>
					<Switch color="primary" testId="switch" />
				</Field>
			);
		}

		const { rerender } = render(field('danger'));

		expect(ringOf(screen.getByTestId('switch'))).toBe(RING);

		for (const status of [undefined, 'warning', 'success'] as const) {
			rerender(field(status));

			expect(ringOf(screen.getByTestId('switch'))).toBe('none');
		}

		rerender(field('danger'));

		expect(ringOf(screen.getByTestId('switch'))).toBe(RING);
	});

	it('outlines a switch that is on too, which keeps its fill and its knob', () => {
		render(
			<Field label="Alerts" error="Required">
				<Switch color="primary" testId="switch" defaultValue />
			</Field>,
		);

		const track = screen.getByTestId('switch');

		expect(track).toHaveAttribute('data-checked');
		expect(ringOf(track)).toBe(RING);
		expect(track.querySelector('[data-slot="switch-thumb"]')).toBeInTheDocument();
	});

	it('takes the color and the width of the ring from its custom properties', () => {
		render(
			<div
				style={
					{
						'--switch-invalid-border-color': 'rgb(7, 8, 9)',
						'--switch-invalid-border-width': '2px',
					} as CSSProperties
				}
			>
				<Field label="Alerts" error="Required">
					<Switch color="primary" testId="switch" />
				</Field>
			</div>,
		);

		expect(ringOf(screen.getByTestId('switch'))).toBe('rgb(7, 8, 9) 0px 0px 0px 2px inset');
	});

	it('outlines the track of a SwitchField with an error, and not without one', () => {
		const { rerender } = render(
			<SwitchField color="primary" label="Alerts" error="Required" testId="alerts" />,
		);

		expect(ringOf(screen.getByTestId('alerts'))).toBe(RING);

		rerender(<SwitchField color="primary" label="Alerts" testId="alerts" />);

		expect(ringOf(screen.getByTestId('alerts'))).toBe('none');
	});
});

describe('Switch in a Field.Group with an error', () => {
	it('outlines every switch of the list and marks each with data-invalid, and not with aria-invalid', () => {
		function group(error: string | undefined): ReactElement {
			return (
				<Field.Group label="Notify me by" {...(error === undefined ? {} : { error })}>
					<Switch color="primary" testId="email">
						Email
					</Switch>
					<Switch color="primary" testId="slack" defaultValue>
						Slack
					</Switch>
				</Field.Group>
			);
		}

		const { rerender } = render(group('Pick one'));

		for (const testId of ['email', 'slack']) {
			const track = screen.getByTestId(testId);

			expect(track).toHaveAttribute('data-invalid');
			expect(track).not.toHaveAttribute('aria-invalid');
			expect(ringOf(track)).toBe(RING);
		}

		rerender(group(undefined));

		for (const testId of ['email', 'slack']) {
			expect(screen.getByTestId(testId)).not.toHaveAttribute('data-invalid');
			expect(ringOf(screen.getByTestId(testId))).toBe('none');
		}
	});
});

describe('Switch with an aria-invalid of its own', () => {
	it('outlines the track outside any field', () => {
		render(<Switch color="primary" testId="switch" aria-invalid />);

		expect(ringOf(screen.getByTestId('switch'))).toBe(RING);
	});
});
