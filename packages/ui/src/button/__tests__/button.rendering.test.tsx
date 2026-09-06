import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../button.js';

describe('Button rendering', () => {
	it('renders a native button that is named by its children', () => {
		render(
			<Button size="md" variant="solid" color="primary">
				Label
			</Button>,
		);

		const button = screen.getByRole('button', { name: 'Label' });
		expect(button.tagName).toBe('BUTTON');
	});

	it('defaults to type="button", so a button inside a form never submits by accident', () => {
		render(
			<Button size="md" variant="solid" color="primary">
				Label
			</Button>,
		);

		expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
	});

	it.each(['submit', 'reset', 'button'] as const)('honours type="%s"', (type) => {
		render(
			<Button size="md" variant="solid" color="primary" type={type}>
				Label
			</Button>,
		);

		expect(screen.getByRole('button')).toHaveAttribute('type', type);
	});

	it('exposes testId as data-testid', () => {
		render(
			<Button size="md" variant="solid" color="primary" testId="my-button">
				Label
			</Button>,
		);

		expect(screen.getByTestId('my-button').tagName).toBe('BUTTON');
	});

	it('leaves data-testid off when no testId is given', () => {
		render(
			<Button size="md" variant="solid" color="primary">
				Label
			</Button>,
		);

		expect(screen.getByRole('button')).not.toHaveAttribute('data-testid');
	});

	it('keeps the component class next to a custom className', () => {
		render(
			<Button size="md" variant="solid" color="primary" className="custom-class">
				Label
			</Button>,
		);

		const button = screen.getByRole('button');
		expect(button).toHaveClass('custom-class');
		expect(button.className.split(' ').length).toBeGreaterThan(1);
	});

	it('forwards id, tabIndex and aria attributes', () => {
		render(
			<Button
				size="md"
				variant="solid"
				color="primary"
				id="save"
				tabIndex={-1}
				aria-label="Toolbar action"
				aria-haspopup="menu"
			>
				Label
			</Button>,
		);

		const button = screen.getByRole('button', { name: 'Toolbar action' });
		expect(button).toHaveAttribute('id', 'save');
		expect(button).toHaveAttribute('tabindex', '-1');
		expect(button).toHaveAttribute('aria-haspopup', 'menu');
	});

	it('forwards arbitrary data-* attributes', () => {
		render(
			<Button size="md" variant="solid" color="primary" data-foo="bar" data-analytics-id="save">
				Label
			</Button>,
		);

		const button = screen.getByRole('button');
		expect(button).toHaveAttribute('data-foo', 'bar');
		expect(button).toHaveAttribute('data-analytics-id', 'save');
	});

	it('wraps the label in its own slot, so the affixes are not measured with it', () => {
		render(
			<Button size="md" variant="solid" color="primary" prefix={<span data-testid="prefix" />}>
				Label
			</Button>,
		);

		const label = document.querySelector('[data-slot="button-label"]');
		expect(label).toHaveTextContent('Label');
		expect(label?.querySelector('[data-testid="prefix"]')).toBeNull();
	});

	it('accepts a key without reading it as a prop, which React warns about', () => {
		const error = vi.spyOn(console, 'error').mockImplementation(() => {});

		render(
			<Button key="row-1" size="md" variant="solid" color="primary">
				Label
			</Button>,
		);

		expect(error).not.toHaveBeenCalled();
		error.mockRestore();
	});

	it('renders element children inside the label slot', () => {
		render(
			<Button size="md" variant="solid" color="primary">
				<strong data-testid="strong">Label</strong>
			</Button>,
		);

		expect(document.querySelector('[data-slot="button-label"]')).toContainElement(
			screen.getByTestId('strong'),
		);
	});
});

describe('Button width', () => {
	it('maps width to the width custom property', () => {
		render(
			<Button size="md" variant="solid" color="primary" width="10rem">
				Label
			</Button>,
		);

		expect(screen.getByRole('button').style.getPropertyValue('--button-internal-width')).toBe(
			'10rem',
		);
	});

	it('maps maxWidth to the max-width custom property', () => {
		render(
			<Button size="md" variant="solid" color="primary" maxWidth="20rem">
				Label
			</Button>,
		);

		expect(screen.getByRole('button').style.getPropertyValue('--button-internal-max-width')).toBe(
			'20rem',
		);
	});

	it('writes a number as px, custom properties get no unit from React', () => {
		render(
			<Button size="md" variant="solid" color="primary" width={200} maxWidth={320}>
				Label
			</Button>,
		);

		const { style } = screen.getByRole('button');
		expect(style.getPropertyValue('--button-internal-width')).toBe('200px');
		expect(style.getPropertyValue('--button-internal-max-width')).toBe('320px');
	});

	it('keeps a zero, which is a real length', () => {
		render(
			<Button size="md" variant="solid" color="primary" maxWidth={0}>
				Label
			</Button>,
		);

		expect(screen.getByRole('button').style.getPropertyValue('--button-internal-max-width')).toBe(
			'0px',
		);
	});

	it('leaves both custom properties unset by default, so the size tokens win', () => {
		render(
			<Button size="md" variant="solid" color="primary">
				Label
			</Button>,
		);

		const { style } = screen.getByRole('button');
		expect(style.getPropertyValue('--button-internal-width')).toBe('');
		expect(style.getPropertyValue('--button-internal-max-width')).toBe('');
	});

	it('keeps the caller style alongside the custom properties', () => {
		render(
			<Button
				size="md"
				variant="solid"
				color="primary"
				width="10rem"
				style={{ color: 'red', marginTop: '4px' }}
			>
				Label
			</Button>,
		);

		const button = screen.getByRole('button');
		expect(button).toHaveStyle({ color: 'rgb(255, 0, 0)', marginTop: '4px' });
		expect(button.style.getPropertyValue('--button-internal-width')).toBe('10rem');
	});
});
