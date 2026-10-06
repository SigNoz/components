import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Checkbox } from './checkbox/checkbox.js';
import { Input } from './input/input.js';
import { Switch } from './switch/switch.js';

describe('wrapper prop targeting regressions', () => {
	it('keeps Input control props on the input and exposes container props for adorned inputs', () => {
		render(
			<Input
				prefix={<span>@</span>}
				id="email-input"
				testId="email-input"
				className="input-class"
				style={{ width: '240px' }}
				containerId="email-input-container"
				containerTestId="email-input-container"
				containerClassName="input-container-class"
				containerStyle={{ paddingInline: '8px' }}
			/>,
		);

		const input = screen.getByRole('textbox');
		const container = screen.getByTestId('email-input-container');

		expect(input).toHaveAttribute('id', 'email-input');
		expect(input).toHaveAttribute('data-testid', 'email-input');
		expect(input).toHaveClass('input-class');
		// Not `toHaveStyle`: the adorned input is a flex item with `flex: 1`, so the
		// browser resolves its used width from the container, not from this declaration.
		expect(input.getAttribute('style')).toContain('width: 240px');
		expect(container).toHaveAttribute('id', 'email-input-container');
		expect(container).toHaveClass('input-container-class');
		expect(container).toHaveStyle({ paddingInline: '8px' });
	});

	it('keeps Switch control props on the switch root and exposes container props for the wrapper', () => {
		render(
			<Switch
				color="primary"
				textPlacement="right"
				id="notifications"
				testId="notifications-switch"
				containerId="notifications-container"
				containerTestId="notifications-container"
			>
				Notifications
			</Switch>,
		);

		const control = screen.getByRole('switch', { name: 'Notifications' });
		const container = screen.getByTestId('notifications-container');

		// Base UI puts `id` on the hidden input, the element a consumer `htmlFor` points at.
		expect(document.querySelector('input#notifications')).not.toBeNull();
		expect(control).toHaveAttribute('data-testid', 'notifications-switch');
		expect(container).toHaveAttribute('id', 'notifications-container');
	});

	it('keeps Checkbox control props on the checkbox root and exposes container props for the wrapper', () => {
		render(
			<Checkbox
				color="primary"
				id="tos"
				testId="tos-checkbox"
				containerId="tos-container"
				containerTestId="tos-container"
			>
				Accept the terms
			</Checkbox>,
		);

		const control = screen.getByRole('checkbox', { name: 'Accept the terms' });
		const container = screen.getByTestId('tos-container');

		// Base UI puts `id` on the hidden input, the element a consumer `htmlFor` points at.
		expect(document.querySelector('input#tos')).not.toBeNull();
		expect(control).toHaveAttribute('data-testid', 'tos-checkbox');
		expect(container).toHaveAttribute('id', 'tos-container');
	});
});
