import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Checkbox } from './checkbox/checkbox.js';
import { Switch } from './switch/switch.js';

describe('wrapper prop targeting regressions', () => {
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
