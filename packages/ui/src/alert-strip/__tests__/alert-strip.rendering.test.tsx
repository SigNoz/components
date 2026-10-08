import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AlertStrip } from '../alert-strip.js';

describe('AlertStrip rendering', () => {
	it('renders the content in its slot', () => {
		render(
			<AlertStrip color="primary" side="bottom" testId="s">
				Heads up
			</AlertStrip>,
		);

		expect(screen.getByTestId('s')).toHaveAttribute('data-slot', 'alert-strip');
		expect(screen.getByTestId('s-content')).toHaveAttribute('data-slot', 'alert-strip-content');
		expect(screen.getByTestId('s-content')).toHaveTextContent('Heads up');
	});

	it('mirrors color and side as data attributes', () => {
		render(
			<AlertStrip color="warning" side="top" testId="s">
				a
			</AlertStrip>,
		);

		expect(screen.getByTestId('s')).toHaveAttribute('data-color', 'warning');
		expect(screen.getByTestId('s')).toHaveAttribute('data-side', 'top');
	});

	it('forwards aria and data attributes and the id', () => {
		render(
			<AlertStrip
				color="primary"
				side="bottom"
				id="x"
				aria-label="notice"
				data-foo="bar"
				testId="s"
			>
				a
			</AlertStrip>,
		);

		expect(screen.getByTestId('s')).toHaveAttribute('id', 'x');
		expect(screen.getByTestId('s')).toHaveAttribute('aria-label', 'notice');
		expect(screen.getByTestId('s')).toHaveAttribute('data-foo', 'bar');
	});

	it('hides the tapered ends from assistive tech', () => {
		render(
			<AlertStrip color="primary" side="bottom" testId="s">
				Heads up
			</AlertStrip>,
		);

		const hidden = screen.getByTestId('s').querySelectorAll('[aria-hidden="true"]');
		expect(hidden).toHaveLength(2);
		expect(screen.getByRole('status')).toHaveAccessibleName('');
		expect(screen.getByRole('status')).toHaveTextContent(/^Heads up$/);
	});

	it.each([null, undefined, '', false])('renders nothing for empty children %s', (children) => {
		const { container } = render(
			<AlertStrip color="primary" side="bottom">
				{children}
			</AlertStrip>,
		);

		expect(container).toBeEmptyDOMElement();
	});

	it('renders the prefix before the content and the suffix after it, in their slots', () => {
		render(
			<AlertStrip color="primary" side="bottom" testId="s" prefix="P" suffix="S">
				Heads up
			</AlertStrip>,
		);

		const prefix = screen.getByTestId('s-prefix');
		const suffix = screen.getByTestId('s-suffix');
		expect(prefix).toHaveAttribute('data-slot', 'alert-strip-prefix');
		expect(suffix).toHaveAttribute('data-slot', 'alert-strip-suffix');
		expect(prefix.nextElementSibling).toBe(screen.getByTestId('s-content'));
		expect(screen.getByTestId('s-content').nextElementSibling).toBe(suffix);
		expect(screen.getByRole('status')).toHaveTextContent(/^PHeads upS$/);
	});

	it.each([null, undefined, '', false])('renders no prefix or suffix slot for %s', (empty) => {
		render(
			<AlertStrip color="primary" side="bottom" testId="s" prefix={empty} suffix={empty}>
				Heads up
			</AlertStrip>,
		);

		expect(screen.queryByTestId('s-prefix')).not.toBeInTheDocument();
		expect(screen.queryByTestId('s-suffix')).not.toBeInTheDocument();
	});

	it('renders nothing for empty children, even with a prefix and a suffix', () => {
		const { container } = render(
			<AlertStrip
				color="primary"
				side="bottom"
				prefix="P"
				suffix={<AlertStrip.Button>Retry</AlertStrip.Button>}
			>
				{null}
			</AlertStrip>,
		);

		expect(container).toBeEmptyDOMElement();
	});

	it('has no close button', () => {
		render(
			<AlertStrip color="danger" side="bottom">
				a
			</AlertStrip>,
		);

		expect(screen.queryByRole('button')).not.toBeInTheDocument();
	});
});

describe('AlertStrip live region', () => {
	it.each(['danger', 'highlight-danger'] as const)('is an alert for %s', (color) => {
		render(
			<AlertStrip color={color} side="bottom">
				a
			</AlertStrip>,
		);

		expect(screen.getByRole('alert')).toBeInTheDocument();
	});

	it.each(['primary', 'secondary', 'success', 'warning', 'info', 'archive'] as const)(
		'is a status for %s',
		(color) => {
			render(
				<AlertStrip color={color} side="bottom">
					a
				</AlertStrip>,
			);

			expect(screen.getByRole('status')).toBeInTheDocument();
		},
	);

	it('covers the label of a link in the content and a button in the suffix', () => {
		render(
			<AlertStrip
				color="danger"
				side="bottom"
				suffix={<AlertStrip.Button>Retry</AlertStrip.Button>}
			>
				Payment failed. <AlertStrip.Link href="/billing">Pay the bill</AlertStrip.Link>
			</AlertStrip>,
		);

		const alert = screen.getByRole('alert');
		expect(alert).toContainElement(screen.getByRole('link', { name: 'Pay the bill' }));
		expect(alert).toContainElement(screen.getByRole('button', { name: 'Retry' }));
	});
});
