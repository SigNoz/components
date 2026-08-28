import { render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { activate } from '../__tests__/interactions.js';
import { Checkbox } from './index.js';
import type { CheckedState } from './index.js';

describe('Checkbox checked state', () => {
	it('is unchecked by default', () => {
		render(<Checkbox>Enable alerts</Checkbox>);
		expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'false');
	});

	it('honours defaultValue', () => {
		render(<Checkbox defaultValue>Enable alerts</Checkbox>);
		expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true');
	});

	it('exposes the indeterminate state as aria-checked="mixed"', () => {
		render(<Checkbox value="indeterminate">Enable alerts</Checkbox>);
		expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'mixed');
	});

	it('toggles and reports the new state on activation', () => {
		const onChange = vi.fn();
		render(<Checkbox onChange={onChange}>Enable alerts</Checkbox>);

		activate(screen.getByRole('checkbox'));

		expect(onChange).toHaveBeenCalledWith(true);
		expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true');
	});

	it('reports false when toggled off', () => {
		const onChange = vi.fn();
		render(
			<Checkbox defaultValue onChange={onChange}>
				Enable alerts
			</Checkbox>,
		);

		activate(screen.getByRole('checkbox'));

		expect(onChange).toHaveBeenCalledWith(false);
	});
});

describe('Checkbox controlled vs uncontrolled', () => {
	it('stays pinned to the value prop when the parent ignores onChange', () => {
		const onChange = vi.fn();
		render(
			<Checkbox value={false} onChange={onChange}>
				Enable alerts
			</Checkbox>,
		);

		activate(screen.getByRole('checkbox'));

		expect(onChange).toHaveBeenCalledWith(true);
		expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'false');
	});

	it('follows the value prop when the parent commits', () => {
		function Controlled() {
			const [value, setValue] = useState<CheckedState>(false);
			return (
				<Checkbox value={value} onChange={setValue}>
					Enable alerts
				</Checkbox>
			);
		}
		render(<Controlled />);

		activate(screen.getByRole('checkbox'));

		expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true');
	});
});

describe('Checkbox label association', () => {
	it('links an auto-generated id to the label so the label toggles it', () => {
		render(<Checkbox>Enable alerts</Checkbox>);

		activate(screen.getByText('Enable alerts'));

		expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true');
	});

	it('uses a supplied id for the association', () => {
		// BREAKING (Base UI migration): `id` now lands on the hidden checkbox
		// input that carries the value into a form, not on the interactive root.
		const { container } = render(<Checkbox id="alerts">Enable alerts</Checkbox>);

		expect(container.querySelector('input[type="checkbox"]')).toHaveAttribute('id', 'alerts');
		expect(screen.getByText('Enable alerts')).toHaveAttribute('for', 'alerts');
	});

	it('renders no label element when there are no children', () => {
		render(<Checkbox testId="bare" />);
		expect(screen.getByTestId('bare').querySelector('label')).toBeNull();
	});
});

describe('Checkbox disabled and form integration', () => {
	it('does not toggle when disabled', () => {
		const onChange = vi.fn();
		render(
			<Checkbox disabled onChange={onChange}>
				Enable alerts
			</Checkbox>,
		);
		const checkbox = screen.getByRole('checkbox');

		// The interactive root is not a native control; it conveys the state with
		// aria-disabled while the hidden input carries `disabled`.
		expect(checkbox).toHaveAttribute('aria-disabled', 'true');
		activate(checkbox);

		expect(onChange).not.toHaveBeenCalled();
		expect(checkbox).toHaveAttribute('aria-checked', 'false');
	});

	it('marks a required checkbox for assistive tech', () => {
		render(<Checkbox required>Accept</Checkbox>);
		expect(screen.getByRole('checkbox')).toHaveAttribute('aria-required', 'true');
	});
});

describe('Checkbox prop forwarding', () => {
	it('puts testId and className on the wrapper, keeping the control inside it', () => {
		render(
			<Checkbox testId="alerts-checkbox" className="wrapper-class">
				Enable alerts
			</Checkbox>,
		);

		const wrapper = screen.getByTestId('alerts-checkbox');
		expect(wrapper).toHaveClass('wrapper-class');
		expect(wrapper).toContainElement(screen.getByRole('checkbox'));
	});

	it('maps semantic colors onto the palette token', () => {
		const { rerender } = render(<Checkbox color="error">A</Checkbox>);
		expect(screen.getByRole('checkbox')).toHaveAttribute('data-color', 'cherry');

		rerender(<Checkbox color="success">A</Checkbox>);
		expect(screen.getByRole('checkbox')).toHaveAttribute('data-color', 'forest');

		rerender(<Checkbox color="aqua">A</Checkbox>);
		expect(screen.getByRole('checkbox')).toHaveAttribute('data-color', 'aqua');
	});
});
