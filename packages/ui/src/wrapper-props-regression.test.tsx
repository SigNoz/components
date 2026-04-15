import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Badge } from './badge/badge.js';
import { Command, CommandInput } from './command/command.js';
import { Input } from './input/input.js';
import { RadioGroup, RadioGroupItem } from './radio-group/radio-group.js';
import { Switch } from './switch/switch.js';

describe('wrapper prop targeting regressions', () => {
	it('forwards style on Badge', () => {
		render(<Badge style={{ letterSpacing: '2px' }}>L</Badge>);
		expect(screen.getByText('L')).toHaveStyle({ letterSpacing: '2px' });
	});

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
			/>
		);

		const input = screen.getByRole('textbox');
		const container = screen.getByTestId('email-input-container');

		expect(input).toHaveAttribute('id', 'email-input');
		expect(input).toHaveAttribute('data-testid', 'email-input');
		expect(input).toHaveClass('input-class');
		expect(input).toHaveStyle({ width: '240px' });
		expect(container).toHaveAttribute('id', 'email-input-container');
		expect(container).toHaveClass('input-container-class');
		expect(container).toHaveStyle({ paddingInline: '8px' });
	});

	it('keeps Switch control props on the switch root and exposes container props for the wrapper', () => {
		render(
			<Switch
				id="notifications"
				testId="notifications-switch"
				className="switch-class"
				style={{ opacity: 0.5 }}
				containerId="notifications-container"
				containerTestId="notifications-container"
				containerClassName="switch-container-class"
				containerStyle={{ marginBlock: '12px' }}
			>
				Notifications
			</Switch>
		);

		const control = screen.getByRole('switch', { name: 'Notifications' });
		const container = screen.getByTestId('notifications-container');

		expect(control).toHaveAttribute('id', 'notifications');
		expect(control).toHaveAttribute('data-testid', 'notifications-switch');
		expect(control).toHaveClass('switch-class');
		expect(control).toHaveStyle({ opacity: '0.5' });
		expect(container).toHaveAttribute('id', 'notifications-container');
		expect(container).toHaveClass('switch-container-class');
		expect(container).toHaveStyle({ marginBlock: '12px' });
	});

	it('keeps CommandInput control props on the input and exposes container props for the wrapper', () => {
		render(
			<Command>
				<CommandInput
					placeholder="Search"
					id="command-input"
					testId="command-input"
					className="command-input-class"
					style={{ fontSize: '14px' }}
					containerId="command-input-container"
					containerTestId="command-input-container"
					containerClassName="command-input-container-class"
					containerStyle={{ paddingInline: '6px' }}
				/>
			</Command>
		);

		const input = screen.getByRole('combobox');
		const container = screen.getByTestId('command-input-container');

		expect(input).toHaveAttribute('id', 'command-input');
		expect(input).toHaveAttribute('data-testid', 'command-input');
		expect(input).toHaveClass('command-input-class');
		expect(input).toHaveStyle({ fontSize: '14px' });
		expect(container).toHaveAttribute('id', 'command-input-container');
		expect(container).toHaveClass('command-input-container-class');
		expect(container).toHaveStyle({ paddingInline: '6px' });
	});

	it('keeps RadioGroupItem control props on the radio item and exposes container props for the wrapper', () => {
		render(
			<RadioGroup value="a">
				<RadioGroupItem
					value="a"
					id="radio-a"
					testId="radio-a"
					className="radio-class"
					style={{ borderWidth: '2px' }}
					containerId="radio-a-container"
					containerTestId="radio-a-container"
					containerClassName="radio-container-class"
					containerStyle={{ gap: '10px' }}
				>
					Option A
				</RadioGroupItem>
			</RadioGroup>
		);

		const item = screen.getByRole('radio', { name: 'Option A' });
		const container = screen.getByTestId('radio-a-container');

		expect(item).toHaveAttribute('id', 'radio-a');
		expect(item).toHaveAttribute('data-testid', 'radio-a');
		expect(item).toHaveClass('radio-class');
		expect(item).toHaveStyle({ borderWidth: '2px' });
		expect(container).toHaveAttribute('id', 'radio-a-container');
		expect(container).toHaveClass('radio-container-class');
		expect(container).toHaveStyle({ gap: '10px' });
	});
});
