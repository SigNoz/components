import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { RadioGroup, RadioGroupField } from '../index.js';
import type { RadioGroupItemType } from '../types.js';

const ITEMS: RadioGroupItemType[] = [
	{ label: '7 days', value: '7' },
	{ label: '30 days', value: '30' },
	{ label: '90 days', value: '90' },
];

function spyOnConsole() {
	return {
		error: vi.spyOn(console, 'error').mockImplementation(() => {}),
		warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
	};
}

function expectNoRadioChecked(): void {
	for (const radio of screen.getAllByRole('radio')) {
		expect(radio).not.toBeChecked();
	}
}

afterEach(() => {
	vi.restoreAllMocks();
});

describe('RadioGroup value rule', () => {
	it('starts at the default and keeps its own state while value is undefined', async () => {
		const user = userEvent.setup();
		const logged = spyOnConsole();
		const onChange = vi.fn();
		render(
			<RadioGroup
				color="primary"
				items={ITEMS}
				aria-label="Retention"
				defaultValue="90"
				onChange={onChange}
			/>,
		);

		expect(screen.getByRole('radio', { name: '90 days' })).toBeChecked();

		await user.click(screen.getByRole('radio', { name: '30 days' }));

		expect(onChange).toHaveBeenCalledWith('30');
		expect(screen.getByRole('radio', { name: '30 days' })).toBeChecked();
		expect(screen.getByRole('radio', { name: '90 days' })).not.toBeChecked();
		expect(logged.warn).not.toHaveBeenCalled();
		expect(logged.error).not.toHaveBeenCalled();
	});

	it('follows a value that arrives later and warns once', () => {
		const logged = spyOnConsole();
		const { rerender } = render(
			<RadioGroup color="primary" items={ITEMS} aria-label="Retention" value={undefined} />,
		);

		rerender(<RadioGroup color="primary" items={ITEMS} aria-label="Retention" value="30" />);

		expect(screen.getByRole('radio', { name: '30 days' })).toBeChecked();

		rerender(<RadioGroup color="primary" items={ITEMS} aria-label="Retention" value="90" />);

		expect(screen.getByRole('radio', { name: '90 days' })).toBeChecked();
		expect(logged.warn).toHaveBeenCalledTimes(1);
		expect(logged.warn).toHaveBeenCalledWith(expect.stringContaining('RadioGroup'));
		expect(logged.error).not.toHaveBeenCalled();
	});

	it('shows no radio checked once a value turns undefined, and stays controlled', async () => {
		const user = userEvent.setup();
		const logged = spyOnConsole();
		const onChange = vi.fn();
		const { rerender } = render(
			<RadioGroup
				color="primary"
				items={ITEMS}
				aria-label="Retention"
				value="30"
				onChange={onChange}
			/>,
		);

		rerender(
			<RadioGroup
				color="primary"
				items={ITEMS}
				aria-label="Retention"
				value={undefined}
				onChange={onChange}
			/>,
		);

		expectNoRadioChecked();

		await user.click(screen.getByRole('radio', { name: '90 days' }));

		expect(onChange).toHaveBeenCalledWith('90');
		expectNoRadioChecked();
		expect(logged.warn).not.toHaveBeenCalled();
		expect(logged.error).not.toHaveBeenCalled();
	});

	it('follows a form state that starts undefined, with one warning at the first pick', async () => {
		const user = userEvent.setup();
		const logged = spyOnConsole();

		function Controlled(): JSX.Element {
			const [value, setValue] = useState<string | undefined>(undefined);

			return (
				<RadioGroupField
					label="Retention"
					color="primary"
					items={ITEMS}
					name="retention"
					value={value}
					onChange={setValue}
					onBlur={() => {}}
				/>
			);
		}

		render(<Controlled />);

		await user.click(screen.getByRole('radio', { name: '30 days' }));
		await user.click(screen.getByRole('radio', { name: '90 days' }));

		expect(screen.getByRole('radio', { name: '90 days' })).toBeChecked();
		expect(logged.warn).toHaveBeenCalledTimes(1);
		expect(logged.error).not.toHaveBeenCalled();
	});
});
