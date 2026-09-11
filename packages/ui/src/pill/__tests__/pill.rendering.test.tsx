import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Pill } from '../pill.js';
import { PillTextTransform } from '../constants.js';

describe('Pill rendering', () => {
	it('renders a native button that is named by its children', () => {
		render(
			<Pill variant="outlined" color="primary">
				env:prod
			</Pill>,
		);

		expect(screen.getByRole('button', { name: 'env:prod' }).tagName).toBe('BUTTON');
	});

	it('carries data-slot="pill" on the root', () => {
		render(
			<Pill variant="outlined" color="primary">
				env:prod
			</Pill>,
		);

		expect(screen.getByRole('button')).toHaveAttribute('data-slot', 'pill');
	});

	it('defaults to type="button", so a pill inside a form never submits by accident', () => {
		render(
			<Pill variant="outlined" color="primary">
				Filter
			</Pill>,
		);

		expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
	});

	it('exposes testId as data-testid', () => {
		render(
			<Pill variant="outlined" color="primary" testId="status-pill">
				Active
			</Pill>,
		);

		expect(screen.getByTestId('status-pill')).toBeInTheDocument();
	});

	it('leaves data-testid off when no testId is given', () => {
		render(
			<Pill variant="outlined" color="primary">
				Active
			</Pill>,
		);

		expect(screen.getByRole('button')).not.toHaveAttribute('data-testid');
	});

	it('mirrors variant and color as data attributes', () => {
		render(
			<Pill variant="outlined" color="danger">
				Error
			</Pill>,
		);

		const pill = screen.getByRole('button', { name: 'Error' });
		expect(pill).toHaveAttribute('data-variant', 'outlined');
		expect(pill).toHaveAttribute('data-color', 'danger');
	});

	it('defaults textTransform to none, unlike Badge', () => {
		render(
			<Pill variant="outlined" color="primary">
				Active
			</Pill>,
		);

		expect(screen.getByRole('button', { name: 'Active' })).toHaveAttribute(
			'data-text-transform',
			'none',
		);
	});

	it.each(Object.values(PillTextTransform))('mirrors textTransform="%s"', (textTransform) => {
		render(
			<Pill variant="outlined" color="primary" textTransform={textTransform}>
				Active
			</Pill>,
		);

		expect(screen.getByRole('button')).toHaveAttribute('data-text-transform', textTransform);
	});

	it('forwards id and aria attributes', () => {
		render(
			<Pill
				variant="outlined"
				color="primary"
				id="env-filter"
				aria-label="Filter by environment"
				aria-haspopup="menu"
			>
				Active
			</Pill>,
		);

		const pill = screen.getByRole('button', { name: 'Filter by environment' });
		expect(pill).toHaveAttribute('id', 'env-filter');
		expect(pill).toHaveAttribute('aria-haspopup', 'menu');
	});

	it('forwards arbitrary data-* attributes', () => {
		render(
			<Pill variant="outlined" color="primary" data-foo="bar" data-analytics-id="env-filter">
				Active
			</Pill>,
		);

		const pill = screen.getByRole('button');
		expect(pill).toHaveAttribute('data-foo', 'bar');
		expect(pill).toHaveAttribute('data-analytics-id', 'env-filter');
	});

	it('keeps the component class next to a custom className', () => {
		render(
			<Pill variant="outlined" color="primary" className="custom-class">
				Active
			</Pill>,
		);

		const pill = screen.getByRole('button');
		expect(pill).toHaveClass('custom-class');
		expect(pill.className.split(' ').length).toBeGreaterThan(1);
	});

	it('renders element children inside the label slot', () => {
		render(
			<Pill variant="outlined" color="primary">
				<strong data-testid="strong">Active</strong>
			</Pill>,
		);

		expect(document.querySelector('[data-slot="pill-label"]')).toContainElement(
			screen.getByTestId('strong'),
		);
	});

	it.each([null, undefined, false, ''] as const)('renders nothing for %s children', (children) => {
		const { container } = render(
			<Pill variant="outlined" color="primary">
				{children}
			</Pill>,
		);

		expect(container).toBeEmptyDOMElement();
	});

	it('accepts a key without reading it as a prop, which React warns about', () => {
		const error = vi.spyOn(console, 'error').mockImplementation(() => {});

		render(
			<Pill key="row-1" variant="outlined" color="primary">
				Active
			</Pill>,
		);

		expect(error).not.toHaveBeenCalled();
		error.mockRestore();
	});
});
