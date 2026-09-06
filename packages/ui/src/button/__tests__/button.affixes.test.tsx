import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from '../button.js';

describe('Button prefix', () => {
	it('clones the element into the prefix slot with the sizing class', () => {
		render(
			<Button size="md" variant="solid" color="primary" prefix={<span data-testid="prefix" />}>
				Label
			</Button>,
		);

		const prefix = screen.getByTestId('prefix');
		expect(document.querySelector('[data-slot="button-prefix-slot"]')).toContainElement(prefix);
		expect(prefix.className).not.toBe('');
	});

	it('keeps the class the caller put on the element', () => {
		render(
			<Button
				size="md"
				variant="solid"
				color="primary"
				prefix={<span data-testid="prefix" className="user-class" />}
			>
				Label
			</Button>,
		);

		const prefix = screen.getByTestId('prefix');
		expect(prefix).toHaveClass('user-class');
		expect(prefix.classList.length).toBe(2);
	});

	it('marks the wrapper empty when there is no prefix, so it can collapse', () => {
		render(
			<Button size="md" variant="solid" color="primary">
				Label
			</Button>,
		);

		expect(document.querySelector('[data-slot="button-prefix-wrapper"]')).toHaveAttribute(
			'data-empty',
			'true',
		);
	});

	it('marks the wrapper filled when a prefix is given', () => {
		render(
			<Button size="md" variant="solid" color="primary" prefix={<span data-testid="prefix" />}>
				Label
			</Button>,
		);

		expect(document.querySelector('[data-slot="button-prefix-wrapper"]')).toHaveAttribute(
			'data-empty',
			'false',
		);
	});

	it('keeps the wrapper mounted without a prefix, it also holds the spinner', () => {
		render(
			<Button size="md" variant="solid" color="primary">
				Label
			</Button>,
		);

		expect(document.querySelector('[data-slot="button-prefix-wrapper"]')).toBeInTheDocument();
		expect(document.querySelector('[data-slot="button-prefix-loading"]')).toBeInTheDocument();
	});

	it('drops the prefix when the prop is removed', () => {
		const { rerender } = render(
			<Button size="md" variant="solid" color="primary" prefix={<span data-testid="prefix" />}>
				Label
			</Button>,
		);
		expect(screen.getByTestId('prefix')).toBeInTheDocument();

		rerender(
			<Button size="md" variant="solid" color="primary">
				Label
			</Button>,
		);

		expect(screen.queryByTestId('prefix')).not.toBeInTheDocument();
	});
});

describe('Button suffix', () => {
	it('clones the element into the suffix slot with the sizing class', () => {
		render(
			<Button size="md" variant="solid" color="primary" suffix={<span data-testid="suffix" />}>
				Label
			</Button>,
		);

		const suffix = screen.getByTestId('suffix');
		expect(document.querySelector('[data-slot="button-suffix-slot"]')).toContainElement(suffix);
		expect(suffix.className).not.toBe('');
	});

	it('keeps the class the caller put on the element', () => {
		render(
			<Button
				size="md"
				variant="solid"
				color="primary"
				suffix={<span data-testid="suffix" className="user-class" />}
			>
				Label
			</Button>,
		);

		const suffix = screen.getByTestId('suffix');
		expect(suffix).toHaveClass('user-class');
		expect(suffix.classList.length).toBe(2);
	});

	it('renders no suffix slot at all without a suffix', () => {
		render(
			<Button size="md" variant="solid" color="primary">
				Label
			</Button>,
		);

		expect(document.querySelector('[data-slot="button-suffix-slot"]')).toBeNull();
	});

	it('keeps the affixes out of the accessible name', () => {
		render(
			<Button
				size="md"
				variant="solid"
				color="primary"
				prefix={<span data-testid="prefix" />}
				suffix={<span data-testid="suffix" />}
			>
				Create alert
			</Button>,
		);

		expect(screen.getByRole('button')).toHaveAccessibleName('Create alert');
	});

	it('orders the prefix, the label and the suffix in the DOM', () => {
		render(
			<Button
				size="md"
				variant="solid"
				color="primary"
				prefix={<span data-testid="prefix" />}
				suffix={<span data-testid="suffix" />}
			>
				Label
			</Button>,
		);

		// @ts-ignore
		const slots = [...screen.getByRole('button').children].map((child) =>
			child.getAttribute('data-slot'),
		);
		expect(slots).toEqual(['button-prefix-wrapper', 'button-label', 'button-suffix-slot']);
	});
});
