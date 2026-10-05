import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DatePicker } from './date-picker.js';

describe('DatePicker timezone', () => {
	it('picks a timezone from inside the popover and keeps the popover open', async () => {
		const onTimezoneChange = vi.fn();
		const { container } = render(
			<DatePicker
				showTimezone
				timezone="UTC"
				onTimezoneChange={onTimezoneChange}
				testId="picker"
				timezones={[
					{ value: 'UTC', label: 'UTC' },
					{ value: 'Asia/Kolkata', label: 'India (IST)' },
				]}
			/>,
		);

		await userEvent.click(container.querySelector('button') as HTMLButtonElement);
		await userEvent.click(await screen.findByRole('combobox', { name: 'Timezone' }));
		await userEvent.click(await screen.findByRole('option', { name: 'India (IST)' }));

		await waitFor(() => {
			expect(screen.getByRole('combobox', { name: 'Timezone' })).toHaveTextContent('India (IST)');
		});
		expect(screen.queryByRole('listbox')).toBeNull();
		expect(screen.getByRole('combobox', { name: 'Timezone' })).toBeInTheDocument();
	});
});
