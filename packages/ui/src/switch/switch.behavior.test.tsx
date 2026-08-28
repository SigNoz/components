import { render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { activate } from '../__tests__/interactions.js';
import { Switch } from './index.js';

describe('Switch checked state', () => {
	it('is unchecked by default', () => {
		render(<Switch>Notifications</Switch>);
		expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
	});

	it('honours defaultValue', () => {
		render(<Switch defaultValue>Notifications</Switch>);
		expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
	});

	it('toggles and reports the new state', () => {
		const onChange = vi.fn();
		render(<Switch onChange={onChange}>Notifications</Switch>);

		activate(screen.getByRole('switch'));

		expect(onChange).toHaveBeenCalledWith(true);
		expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
	});

	it('reports false when switched off', () => {
		const onChange = vi.fn();
		render(
			<Switch defaultValue onChange={onChange}>
				Notifications
			</Switch>,
		);

		activate(screen.getByRole('switch'));

		expect(onChange).toHaveBeenCalledWith(false);
	});

	it('reports a plain boolean, not an event object', () => {
		const onChange = vi.fn();
		render(<Switch onChange={onChange}>Notifications</Switch>);

		activate(screen.getByRole('switch'));

		expect(onChange.mock.calls[0][0]).toBe(true);
	});
});

describe('Switch controlled vs uncontrolled', () => {
	it('stays pinned to the value prop when the parent ignores onChange', () => {
		const onChange = vi.fn();
		render(
			<Switch value={false} onChange={onChange}>
				Notifications
			</Switch>,
		);

		activate(screen.getByRole('switch'));

		expect(onChange).toHaveBeenCalledWith(true);
		expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
	});

	it('follows the value prop when the parent commits', () => {
		function Controlled() {
			const [value, setValue] = useState(false);
			return (
				<Switch value={value} onChange={setValue}>
					Notifications
				</Switch>
			);
		}
		render(<Controlled />);

		activate(screen.getByRole('switch'));

		expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
	});
});

describe('Switch labelling and form integration', () => {
	it('exposes the children as the switch accessible name', () => {
		render(<Switch>Notifications</Switch>);
		expect(screen.getByRole('switch')).toHaveAccessibleName('Notifications');
	});

	it('links the label to the form control it submits with', () => {
		const { container } = render(<Switch id="notifications">Notifications</Switch>);

		const input = container.querySelector('input[type="checkbox"]');
		expect(input).toHaveAttribute('id', 'notifications');
		expect(screen.getByText('Notifications')).toHaveAttribute('for', 'notifications');
	});

	it('submits under the given name', () => {
		const { container } = render(<Switch name="notifications" defaultValue />);

		expect(container.querySelector('input[type="checkbox"]')).toHaveAttribute(
			'name',
			'notifications',
		);
	});

	it('does not toggle when disabled', () => {
		const onChange = vi.fn();
		render(
			<Switch disabled onChange={onChange}>
				Notifications
			</Switch>,
		);

		activate(screen.getByRole('switch'));

		expect(onChange).not.toHaveBeenCalled();
		expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
	});
});

describe('Switch prop forwarding', () => {
	it('separates control props from container props', () => {
		render(
			<Switch
				testId="notif-switch"
				className="control-class"
				style={{ opacity: 0.5 }}
				containerTestId="notif-container"
				containerId="notif-container-id"
				containerClassName="container-class"
			>
				Notifications
			</Switch>,
		);

		const control = screen.getByTestId('notif-switch');
		const container = screen.getByTestId('notif-container');

		expect(control).toHaveClass('control-class');
		expect(control).toHaveStyle({ opacity: '0.5' });
		expect(container).toHaveAttribute('id', 'notif-container-id');
		expect(container).toHaveClass('container-class');
		expect(container).toContainElement(control);
	});

	it('exposes the color as a styling hook', () => {
		render(<Switch color="forest">Notifications</Switch>);
		expect(screen.getByRole('switch')).toHaveAttribute('data-color', 'forest');
	});
});
