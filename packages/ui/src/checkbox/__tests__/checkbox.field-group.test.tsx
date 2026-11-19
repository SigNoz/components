import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Field } from '../../field/field.js';
import { Checkbox } from '../index.js';

const CHANNELS = [
	{ value: 'email', label: 'Email' },
	{ value: 'slack', label: 'Slack' },
	{ value: 'pager', label: 'Pager' },
];

describe('Checkbox list in a Field.Group', () => {
	it('names the fieldset with the legend and each checkbox with its own label', () => {
		render(
			<Field.Group label="Notify me by" testId="channels">
				{CHANNELS.map((channel) => (
					<Checkbox key={channel.value} color="primary">
						{channel.label}
					</Checkbox>
				))}
			</Field.Group>,
		);

		expect(screen.getByRole('group', { name: 'Notify me by' }).tagName).toBe('FIELDSET');

		for (const channel of CHANNELS) {
			expect(screen.getByRole('checkbox', { name: channel.label })).toBeInTheDocument();
		}
	});

	it('gives every checkbox its own id, since the group has no Base UI field to share one', () => {
		render(
			<Field.Group label="Notify me by">
				{CHANNELS.map((channel) => (
					<Checkbox key={channel.value} color="primary">
						{channel.label}
					</Checkbox>
				))}
			</Field.Group>,
		);

		const checkboxIds = screen.getAllByRole('checkbox').map((checkbox) => checkbox.id);
		const inputIds = Array.from(document.querySelectorAll('input[type="checkbox"]'))
			.map((input) => input.id)
			.filter((id) => id !== '');

		expect(checkboxIds).toHaveLength(3);
		expect(checkboxIds.every((id) => id !== '')).toBe(true);
		expect(new Set(checkboxIds).size).toBe(3);
		expect(new Set(inputIds).size).toBe(inputIds.length);
	});

	it('keeps an id of its own on the checkbox that sets one', () => {
		render(
			<Field.Group label="Notify me by">
				<Checkbox color="primary" id="email-input">
					Email
				</Checkbox>
				<Checkbox color="primary">Slack</Checkbox>
			</Field.Group>,
		);

		expect(document.getElementById('email-input')).toHaveAttribute('type', 'checkbox');
		expect(screen.getByRole('checkbox', { name: 'Email' })).toBeInTheDocument();
	});

	it('toggles only the checkbox whose text is clicked', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<Field.Group label="Notify me by">
				{CHANNELS.map((channel) => (
					<Checkbox
						key={channel.value}
						color="primary"
						onChange={(checked) => onChange(channel.value, checked)}
					>
						{channel.label}
					</Checkbox>
				))}
			</Field.Group>,
		);

		await user.click(screen.getByText('Slack'));

		expect(onChange).toHaveBeenCalledExactlyOnceWith('slack', true);
		expect(screen.getByRole('checkbox', { name: 'Slack' })).toBeChecked();
		expect(screen.getByRole('checkbox', { name: 'Email' })).not.toBeChecked();
		expect(screen.getByRole('checkbox', { name: 'Pager' })).not.toBeChecked();
	});

	it('keeps each value in its own state, controlled', async () => {
		const user = userEvent.setup();

		function Channels() {
			const [selected, setSelected] = useState<string[]>(['email']);

			return (
				<Field.Group label="Notify me by">
					{CHANNELS.map((channel) => (
						<Checkbox
							key={channel.value}
							color="primary"
							value={selected.includes(channel.value)}
							onChange={(checked) =>
								setSelected((current) =>
									checked
										? [...current, channel.value]
										: current.filter((v) => v !== channel.value),
								)
							}
						>
							{channel.label}
						</Checkbox>
					))}
				</Field.Group>
			);
		}

		render(<Channels />);
		await user.click(screen.getByRole('checkbox', { name: 'Pager' }));
		await user.click(screen.getByRole('checkbox', { name: 'Email' }));

		expect(screen.getByRole('checkbox', { name: 'Email' })).not.toBeChecked();
		expect(screen.getByRole('checkbox', { name: 'Slack' })).not.toBeChecked();
		expect(screen.getByRole('checkbox', { name: 'Pager' })).toBeChecked();
	});

	it('puts the description and the message on the fieldset, and leaves the checkboxes alone', () => {
		render(
			<Field.Group label="Notify me by" error="Pick a channel" testId="channels">
				{CHANNELS.map((channel) => (
					<Checkbox key={channel.value} color="primary">
						{channel.label}
					</Checkbox>
				))}
			</Field.Group>,
		);

		const message = screen.getByTestId('channels-message');

		expect(screen.getByRole('group', { name: 'Notify me by' })).toHaveAttribute(
			'aria-describedby',
			message.id,
		);

		for (const channel of CHANNELS) {
			const checkbox = screen.getByRole('checkbox', { name: channel.label });

			expect(checkbox).not.toHaveAttribute('aria-describedby');
			expect(checkbox).not.toHaveAttribute('aria-invalid');
		}
	});
});
