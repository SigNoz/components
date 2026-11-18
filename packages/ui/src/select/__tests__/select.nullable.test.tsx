import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SelectField } from '../presets/select-field.js';
import { Select } from '../select.js';
import { FRAMEWORKS, openSelect } from './select.test-utils.js';

function placeholder(): Element | null {
	return document.querySelector('[data-slot="select-placeholder"]');
}

function value(): Element | null {
	return document.querySelector('[data-slot="select-value"]');
}

function chips(): Element[] {
	return [...document.querySelectorAll('[data-slot="select-chip"]')];
}

afterEach(() => {
	vi.restoreAllMocks();
});

describe('Select nullable, single', () => {
	it('shows the placeholder for null, and a value once it arrives, with no React warning', () => {
		const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
		const { rerender } = render(
			<Select
				nullable
				placeholder="Select a framework..."
				aria-label="Framework"
				items={FRAMEWORKS}
				value={null}
			/>,
		);

		expect(placeholder()).toHaveTextContent('Select a framework...');

		rerender(
			<Select
				nullable
				placeholder="Select a framework..."
				aria-label="Framework"
				items={FRAMEWORKS}
				value="vue"
			/>,
		);

		expect(value()).toHaveTextContent('Vue');

		rerender(
			<Select
				nullable
				placeholder="Select a framework..."
				aria-label="Framework"
				items={FRAMEWORKS}
				value={null}
			/>,
		);

		expect(placeholder()).toHaveTextContent('Select a framework...');
		expect(error).not.toHaveBeenCalled();
	});

	it('does not write nullable onto the trigger', () => {
		render(
			<Select
				nullable
				placeholder="Select a framework..."
				aria-label="Framework"
				items={FRAMEWORKS}
				value={null}
			/>,
		);

		expect(screen.getByRole('combobox', { name: 'Framework' })).not.toHaveAttribute('nullable');
	});

	it('submits an empty string under its name while the value is null', () => {
		render(
			<form data-testid="form">
				<Select
					nullable
					placeholder="Select a framework..."
					aria-label="Framework"
					items={FRAMEWORKS}
					name="framework"
					value={null}
				/>
			</form>,
		);

		const data = new FormData(screen.getByTestId('form') as HTMLFormElement);

		expect(data.getAll('framework')).toEqual(['']);
	});

	it('keeps reporting the picked row, so a useState<string | null> setter fits', async () => {
		function Harness() {
			const [framework, setFramework] = useState<string | null>(null);

			return (
				<Select
					nullable
					placeholder="Select a framework..."
					aria-label="Framework"
					items={FRAMEWORKS}
					value={framework}
					onChange={setFramework}
				/>
			);
		}

		render(<Harness />);
		const listbox = await openSelect();

		await userEvent.click(within(listbox).getByRole('option', { name: 'Svelte' }));

		await waitFor(() => {
			expect(value()).toHaveTextContent('Svelte');
		});
	});
});

describe('Select nullable, multiple', () => {
	it('shows no chip for null, and chips once the values arrive, with no React warning', () => {
		const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
		const { rerender } = render(
			<Select
				multiple
				nullable
				placeholder="Select frameworks..."
				aria-label="Framework"
				items={FRAMEWORKS}
				value={null}
			/>,
		);

		expect(chips()).toHaveLength(0);
		expect(placeholder()).toHaveTextContent('Select frameworks...');

		rerender(
			<Select
				multiple
				nullable
				placeholder="Select frameworks..."
				aria-label="Framework"
				items={FRAMEWORKS}
				value={['vue', 'react']}
			/>,
		);

		expect(chips().map((chip) => chip.textContent)).toEqual(['Vue', 'React']);

		rerender(
			<Select
				multiple
				nullable
				placeholder="Select frameworks..."
				aria-label="Framework"
				items={FRAMEWORKS}
				value={null}
			/>,
		);

		expect(chips()).toHaveLength(0);
		expect(error).not.toHaveBeenCalled();
	});

	it('goes from null to a pick and back to [] once the last chip is removed, never to null', async () => {
		const reported: string[][] = [];

		function Harness() {
			const [frameworks, setFrameworks] = useState<string[] | null>(null);

			return (
				<Select
					multiple
					nullable
					placeholder="Select frameworks..."
					aria-label="Framework"
					items={FRAMEWORKS}
					value={frameworks}
					onChange={(next) => {
						reported.push(next);
						setFrameworks(next);
					}}
					testId="fw"
				/>
			);
		}

		render(<Harness />);
		const listbox = await openSelect();

		await userEvent.click(within(listbox).getByRole('option', { name: 'Angular' }));
		await userEvent.click(await screen.findByTestId('fw-chip-angular-remove'));

		expect(reported).toEqual([['angular'], []]);
		expect(placeholder()).toHaveTextContent('Select frameworks...');
	});

	it('picks into a null value', async () => {
		const onChange = vi.fn();
		render(
			<Select
				multiple
				nullable
				placeholder="Select frameworks..."
				aria-label="Framework"
				items={FRAMEWORKS}
				value={null}
				onChange={onChange}
			/>,
		);
		const listbox = await openSelect();

		await userEvent.click(within(listbox).getByRole('option', { name: 'Angular' }));

		expect(onChange).toHaveBeenCalledExactlyOnceWith(['angular']);
	});
});

describe('SelectField nullable', () => {
	function ControllerHarness() {
		const [framework, setFramework] = useState<string | null>(null);
		// The shape of the `field` a react-hook-form `Controller` hands over.
		const field = {
			value: framework,
			onChange: setFramework,
			onBlur: () => undefined,
			name: 'framework',
			ref: () => undefined,
		};

		return (
			<SelectField
				label="Framework"
				placeholder="Select a framework..."
				items={FRAMEWORKS}
				nullable
				{...field}
			/>
		);
	}

	it('takes the field of a Controller whose value starts as null', async () => {
		const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
		render(<ControllerHarness />);

		expect(placeholder()).toHaveTextContent('Select a framework...');

		const listbox = await openSelect();
		await userEvent.click(within(listbox).getByRole('option', { name: 'Vue' }));

		await waitFor(() => {
			expect(value()).toHaveTextContent('Vue');
		});
		expect(screen.getByRole('combobox', { name: 'Framework' })).not.toHaveAttribute('nullable');
		expect(error).not.toHaveBeenCalled();
	});
});
