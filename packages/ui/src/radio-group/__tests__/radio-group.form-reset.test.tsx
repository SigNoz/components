import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { RadioGroup, RadioGroupField } from '../index.js';
import type { RadioGroupItemType } from '../types.js';

const ITEMS: RadioGroupItemType[] = [
	{ label: 'Staging', value: 'staging' },
	{ label: 'Production', value: 'production' },
];

function submitted(): Array<[string, FormDataEntryValue]> {
	return [...new FormData(screen.getByTestId('form') as HTMLFormElement).entries()];
}

describe('RadioGroup form reset', () => {
	it('brings an uncontrolled group back to defaultValue, without onChange', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<form data-testid="form">
				<RadioGroup
					color="primary"
					aria-label="Environment"
					name="environment"
					items={ITEMS}
					defaultValue="staging"
					onChange={onChange}
				/>
				<button type="reset">Reset</button>
			</form>,
		);

		await user.click(screen.getByRole('radio', { name: 'Production' }));

		expect(screen.getByRole('radio', { name: 'Production' })).toBeChecked();
		expect(submitted()).toEqual([['environment', 'production']]);

		onChange.mockClear();
		await user.click(screen.getByRole('button', { name: 'Reset' }));

		await waitFor(() => {
			expect(screen.getByRole('radio', { name: 'Staging' })).toBeChecked();
		});
		expect(screen.getByRole('radio', { name: 'Production' })).not.toBeChecked();
		expect(submitted()).toEqual([['environment', 'staging']]);
		expect(onChange).not.toHaveBeenCalled();
	});

	it('leaves no item checked for a group with no defaultValue', async () => {
		const user = userEvent.setup();
		render(
			<form data-testid="form">
				<RadioGroup color="primary" aria-label="Environment" name="environment" items={ITEMS} />
				<button type="reset">Reset</button>
			</form>,
		);

		await user.click(screen.getByRole('radio', { name: 'Production' }));
		await user.click(screen.getByRole('button', { name: 'Reset' }));

		await waitFor(() => {
			expect(screen.getByRole('radio', { name: 'Production' })).not.toBeChecked();
		});
		expect(screen.getByRole('radio', { name: 'Staging' })).not.toBeChecked();
		expect(submitted()).toEqual([]);
	});

	it('resets a group that mounted disabled and was enabled later', async () => {
		const user = userEvent.setup();
		const { rerender } = render(
			<form data-testid="form">
				<RadioGroup
					color="primary"
					aria-label="Environment"
					name="environment"
					items={ITEMS}
					defaultValue="staging"
					disabled
					disabledTooltip="Loading"
				/>
				<button type="reset">Reset</button>
			</form>,
		);

		rerender(
			<form data-testid="form">
				<RadioGroup
					color="primary"
					aria-label="Environment"
					name="environment"
					items={ITEMS}
					defaultValue="staging"
					disabledTooltip="Loading"
				/>
				<button type="reset">Reset</button>
			</form>,
		);

		await user.click(screen.getByRole('radio', { name: 'Production' }));
		await user.click(screen.getByRole('button', { name: 'Reset' }));

		await waitFor(() => {
			expect(screen.getByRole('radio', { name: 'Staging' })).toBeChecked();
		});
	});

	it('keeps a controlled value, which the form onReset owns', async () => {
		const user = userEvent.setup();
		render(
			<form data-testid="form">
				<RadioGroup
					color="primary"
					aria-label="Environment"
					items={ITEMS}
					value="production"
					onChange={() => undefined}
				/>
				<button type="reset">Reset</button>
			</form>,
		);

		await user.click(screen.getByRole('button', { name: 'Reset' }));
		await new Promise((resolve) => setTimeout(resolve));

		expect(screen.getByRole('radio', { name: 'Production' })).toBeChecked();
	});

	it('keeps the value when the form cancels the reset', async () => {
		const user = userEvent.setup();
		render(
			<form data-testid="form" onReset={(event) => event.preventDefault()}>
				<RadioGroup color="primary" aria-label="Environment" items={ITEMS} defaultValue="staging" />
				<button type="reset">Reset</button>
			</form>,
		);

		await user.click(screen.getByRole('radio', { name: 'Production' }));
		await user.click(screen.getByRole('button', { name: 'Reset' }));
		await new Promise((resolve) => setTimeout(resolve));

		expect(screen.getByRole('radio', { name: 'Production' })).toBeChecked();
	});

	it('still hands the radio to the ref of a field', async () => {
		const user = userEvent.setup();
		const ref = createRef<HTMLInputElement>();
		render(
			<form data-testid="form">
				<RadioGroupField
					label="Environment"
					color="primary"
					items={ITEMS}
					defaultValue="staging"
					ref={ref}
				/>
				<button type="reset">Reset</button>
			</form>,
		);

		await user.click(screen.getByRole('radio', { name: 'Production' }));
		await user.click(screen.getByRole('button', { name: 'Reset' }));

		await waitFor(() => {
			expect(screen.getByRole('radio', { name: 'Staging' })).toBeChecked();
		});

		ref.current?.focus();

		expect(screen.getByRole('radio', { name: 'Staging' })).toHaveFocus();
	});
});
