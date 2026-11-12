import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { SelectField } from '../presets/select-field.js';
import { Select } from '../select.js';
import { FRAMEWORKS } from './select.test-utils.js';

function submitted(): FormData {
	return new FormData(screen.getByTestId('form') as HTMLFormElement);
}

describe('Select name, one value', () => {
	it('submits the selected value under the name, and follows the picks', async () => {
		render(
			<form data-testid="form">
				<Select
					name="framework"
					aria-label="Framework"
					placeholder="Pick one"
					items={FRAMEWORKS}
					defaultValue="vue"
				/>
			</form>,
		);

		expect(submitted().getAll('framework')).toEqual(['vue']);

		await userEvent.click(screen.getByRole('combobox', { name: 'Framework' }));
		await userEvent.click(await screen.findByRole('option', { name: 'Angular' }));

		await waitFor(() => {
			expect(submitted().getAll('framework')).toEqual(['angular']);
		});
	});

	it('submits an empty string while nothing is selected', () => {
		render(
			<form data-testid="form">
				<Select name="framework" aria-label="Framework" placeholder="Pick one" items={FRAMEWORKS} />
			</form>,
		);

		expect(submitted().getAll('framework')).toEqual(['']);
	});

	it('follows a controlled value', () => {
		function Controlled({ value }: { value: string }) {
			return (
				<form data-testid="form">
					<Select
						name="framework"
						aria-label="Framework"
						placeholder="Pick one"
						items={FRAMEWORKS}
						value={value}
					/>
				</form>
			);
		}
		const { rerender } = render(<Controlled value="react" />);

		expect(submitted().getAll('framework')).toEqual(['react']);

		rerender(<Controlled value="svelte" />);

		expect(submitted().getAll('framework')).toEqual(['svelte']);
	});

	it('puts the name on the hidden input, not on the trigger', () => {
		render(
			<form data-testid="form">
				<Select
					name="framework"
					aria-label="Framework"
					placeholder="Pick one"
					items={FRAMEWORKS}
					defaultValue="vue"
				/>
			</form>,
		);

		expect(screen.getByRole('combobox', { name: 'Framework' })).not.toHaveAttribute('name');
		expect(document.querySelector('input[name="framework"]')).toHaveValue('vue');
	});

	it('submits nothing while disabled, and its value while read-only', () => {
		const { rerender } = render(
			<form data-testid="form">
				<Select
					name="framework"
					aria-label="Framework"
					placeholder="Pick one"
					items={FRAMEWORKS}
					defaultValue="vue"
					disabled
					disabledTooltip="Locked"
				/>
			</form>,
		);

		expect(submitted().has('framework')).toBe(false);

		rerender(
			<form data-testid="form">
				<Select
					name="framework"
					aria-label="Framework"
					placeholder="Pick one"
					items={FRAMEWORKS}
					defaultValue="vue"
					readOnly
					readOnlyTooltip="Fixed"
				/>
			</form>,
		);

		expect(submitted().getAll('framework')).toEqual(['vue']);
	});
});

describe('Select name, several values', () => {
	it('submits one entry per value, in the order they were picked', async () => {
		render(
			<form data-testid="form">
				<Select
					multiple
					name="frameworks"
					aria-label="Framework"
					placeholder="Pick some"
					items={FRAMEWORKS}
				/>
			</form>,
		);

		expect(submitted().has('frameworks')).toBe(false);

		await userEvent.click(screen.getByRole('combobox', { name: 'Framework' }));
		await userEvent.click(await screen.findByRole('option', { name: 'Vue' }));
		await userEvent.click(screen.getByRole('option', { name: 'React' }));

		await waitFor(() => {
			expect(submitted().getAll('frameworks')).toEqual(['vue', 'react']);
		});
	});

	it('follows a controlled value, and drops a value that is removed', async () => {
		function Controlled({ value }: { value: string[] }) {
			return (
				<form data-testid="form">
					<Select
						multiple
						name="frameworks"
						aria-label="Framework"
						placeholder="Pick some"
						items={FRAMEWORKS}
						value={value}
					/>
				</form>
			);
		}
		const { rerender } = render(<Controlled value={['react', 'svelte']} />);

		expect(submitted().getAll('frameworks')).toEqual(['react', 'svelte']);

		rerender(<Controlled value={['svelte']} />);

		expect(submitted().getAll('frameworks')).toEqual(['svelte']);
	});

	it('submits nothing while disabled', () => {
		function Controlled({ disabled }: { disabled: boolean }) {
			return (
				<form data-testid="form">
					<Select
						multiple
						name="frameworks"
						aria-label="Framework"
						placeholder="Pick some"
						items={FRAMEWORKS}
						defaultValue={['react']}
						{...(disabled ? { disabled: true, disabledTooltip: 'Locked' } : {})}
					/>
				</form>
			);
		}
		const { rerender } = render(<Controlled disabled={false} />);

		expect(submitted().getAll('frameworks')).toEqual(['react']);

		rerender(<Controlled disabled />);

		expect(submitted().has('frameworks')).toBe(false);
	});
});

describe('SelectField name', () => {
	it('hands the name to the select', async () => {
		render(
			<form data-testid="form">
				<SelectField name="framework" label="Framework" placeholder="Pick one" items={FRAMEWORKS} />
			</form>,
		);

		await userEvent.click(screen.getByRole('combobox', { name: 'Framework' }));
		await userEvent.click(await screen.findByRole('option', { name: 'Svelte' }));

		await waitFor(() => {
			expect(submitted().getAll('framework')).toEqual(['svelte']);
		});
	});

	it('submits the values of a multiple field', async () => {
		render(
			<form data-testid="form">
				<SelectField
					multiple
					name="frameworks"
					label="Framework"
					placeholder="Pick some"
					items={FRAMEWORKS}
				/>
			</form>,
		);

		await userEvent.click(screen.getByRole('combobox', { name: 'Framework' }));
		await userEvent.click(await screen.findByRole('option', { name: 'Angular' }));

		await waitFor(() => {
			expect(submitted().getAll('frameworks')).toEqual(['angular']);
		});
	});
});
