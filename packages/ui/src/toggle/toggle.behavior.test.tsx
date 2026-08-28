import { render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { activate } from '../__tests__/interactions.js';
import { Toggle } from './index.js';

describe('Toggle pressed state', () => {
	it('is unpressed by default', () => {
		render(<Toggle>Bold</Toggle>);
		expect(screen.getByRole('button', { name: 'Bold' })).toHaveAttribute('aria-pressed', 'false');
	});

	it('honours defaultValue', () => {
		render(<Toggle defaultValue>Bold</Toggle>);
		expect(screen.getByRole('button', { name: 'Bold' })).toHaveAttribute('aria-pressed', 'true');
	});

	it('toggles and reports the new state', () => {
		const onChange = vi.fn();
		render(<Toggle onChange={onChange}>Bold</Toggle>);

		activate(screen.getByRole('button', { name: 'Bold' }));

		expect(onChange).toHaveBeenCalledWith(true);
		expect(screen.getByRole('button', { name: 'Bold' })).toHaveAttribute('aria-pressed', 'true');
	});

	it('reports false when pressed again', () => {
		const onChange = vi.fn();
		render(
			<Toggle defaultValue onChange={onChange}>
				Bold
			</Toggle>,
		);

		activate(screen.getByRole('button', { name: 'Bold' }));

		expect(onChange).toHaveBeenCalledWith(false);
	});
});

describe('Toggle controlled vs uncontrolled', () => {
	it('stays pinned to the value prop when the parent ignores onChange', () => {
		const onChange = vi.fn();
		render(
			<Toggle value={false} onChange={onChange}>
				Bold
			</Toggle>,
		);

		activate(screen.getByRole('button', { name: 'Bold' }));

		expect(onChange).toHaveBeenCalledWith(true);
		expect(screen.getByRole('button', { name: 'Bold' })).toHaveAttribute('aria-pressed', 'false');
	});

	it('follows the value prop when the parent commits', () => {
		function Controlled() {
			const [value, setValue] = useState(false);
			return (
				<Toggle value={value} onChange={setValue}>
					Bold
				</Toggle>
			);
		}
		render(<Controlled />);

		activate(screen.getByRole('button', { name: 'Bold' }));

		expect(screen.getByRole('button', { name: 'Bold' })).toHaveAttribute('aria-pressed', 'true');
	});
});

describe('Toggle disabled', () => {
	it('does not change state when disabled', () => {
		const onChange = vi.fn();
		render(
			<Toggle disabled onChange={onChange}>
				Bold
			</Toggle>,
		);
		const button = screen.getByRole('button', { name: 'Bold' });

		expect(button).toBeDisabled();
		activate(button);

		expect(onChange).not.toHaveBeenCalled();
		expect(button).toHaveAttribute('aria-pressed', 'false');
	});
});

describe('Toggle prop forwarding', () => {
	it('exposes testId, size and color on the control', () => {
		render(
			<Toggle testId="bold-toggle" size="lg" color="destructive">
				Bold
			</Toggle>,
		);

		const button = screen.getByTestId('bold-toggle');
		expect(button).toHaveAttribute('data-size', 'lg');
		expect(button).toHaveAttribute('data-color', 'destructive');
		expect(button).toHaveAccessibleName('Bold');
	});

	it('still calls a caller-supplied onClick', () => {
		const onClick = vi.fn();
		render(<Toggle onClick={onClick}>Bold</Toggle>);

		activate(screen.getByRole('button', { name: 'Bold' }));

		expect(onClick).toHaveBeenCalledTimes(1);
	});
});
