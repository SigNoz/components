import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Combobox } from '../combobox.js';
import { ComboboxField } from '../presets/combobox-field.js';
import { FRAMEWORKS, openCombobox } from './combobox.test-utils.js';

const SEARCH = { placeholder: 'Search' };

function trigger(): HTMLElement {
	return screen.getByRole('combobox', { name: 'Framework' });
}

function placeholder(): Element | null {
	return document.querySelector('[data-slot="combobox-placeholder"]');
}

function value(): Element | null {
	return document.querySelector('[data-slot="combobox-value"]');
}

function chips(): Element[] {
	return [...document.querySelectorAll('[data-slot="combobox-chip"]')];
}

afterEach(() => {
	vi.restoreAllMocks();
});

describe('Combobox nullable, single', () => {
	it('shows the placeholder for null, and a value once it arrives, with no React warning', () => {
		const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
		const { rerender } = render(
			<Combobox
				nullable
				placeholder="Select a framework..."
				searchInputProps={SEARCH}
				aria-label="Framework"
				items={FRAMEWORKS}
				value={null}
			/>,
		);

		expect(placeholder()).toHaveTextContent('Select a framework...');

		rerender(
			<Combobox
				nullable
				placeholder="Select a framework..."
				searchInputProps={SEARCH}
				aria-label="Framework"
				items={FRAMEWORKS}
				value="vue"
			/>,
		);

		expect(value()).toHaveTextContent('Vue');

		rerender(
			<Combobox
				nullable
				placeholder="Select a framework..."
				searchInputProps={SEARCH}
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
			<Combobox
				nullable
				placeholder="Select a framework..."
				searchInputProps={SEARCH}
				aria-label="Framework"
				items={FRAMEWORKS}
				value={null}
			/>,
		);

		expect(trigger()).not.toHaveAttribute('nullable');
	});

	it('submits an empty string under its name while the value is null', () => {
		render(
			<form data-testid="form">
				<Combobox
					nullable
					placeholder="Select a framework..."
					searchInputProps={SEARCH}
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

	it('reports null from the clear button, and the parent shows the placeholder', async () => {
		const onChange = vi.fn();

		function Harness() {
			const [framework, setFramework] = useState<string | null>('vue');

			return (
				<Combobox
					nullable
					placeholder="Select a framework..."
					searchInputProps={SEARCH}
					aria-label="Framework"
					items={FRAMEWORKS}
					value={framework}
					onChange={(next) => {
						onChange(next);
						setFramework(next);
					}}
					allowClear
					testId="cb"
				/>
			);
		}

		render(<Harness />);

		await userEvent.click(screen.getByTestId('cb-clear'));

		expect(onChange).toHaveBeenCalledExactlyOnceWith(null);
		expect(placeholder()).toHaveTextContent('Select a framework...');
	});

	it('reports null on Delete and on Backspace', async () => {
		const onChange = vi.fn();
		render(
			<Combobox
				nullable
				placeholder="Select a framework..."
				searchInputProps={SEARCH}
				aria-label="Framework"
				items={FRAMEWORKS}
				value="vue"
				onChange={onChange}
				allowClear
			/>,
		);
		trigger().focus();

		await userEvent.keyboard('{Delete}');
		await userEvent.keyboard('{Backspace}');

		expect(onChange).toHaveBeenCalledTimes(2);
		expect(onChange).toHaveBeenNthCalledWith(1, null);
		expect(onChange).toHaveBeenNthCalledWith(2, null);
	});

	it('still reports the picked value', async () => {
		const onChange = vi.fn();
		render(
			<Combobox
				nullable
				placeholder="Select a framework..."
				searchInputProps={SEARCH}
				aria-label="Framework"
				items={FRAMEWORKS}
				value={null}
				onChange={onChange}
			/>,
		);
		await openCombobox();

		await userEvent.click(screen.getByRole('option', { name: 'React' }));

		expect(onChange).toHaveBeenCalledExactlyOnceWith('react');
	});

	it('without nullable, a cleared value is still reported as undefined', async () => {
		const onChange = vi.fn();
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={SEARCH}
				aria-label="Framework"
				items={FRAMEWORKS}
				defaultValue="vue"
				onChange={onChange}
				allowClear
				testId="cb"
			/>,
		);

		await userEvent.click(screen.getByTestId('cb-clear'));

		expect(onChange).toHaveBeenCalledExactlyOnceWith(undefined);
	});
});

describe('Combobox nullable, multiple', () => {
	it('shows no chip for null, and chips once the values arrive, with no React warning', () => {
		const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
		const { rerender } = render(
			<Combobox
				multiple
				nullable
				placeholder="Select frameworks..."
				searchInputProps={SEARCH}
				aria-label="Framework"
				items={FRAMEWORKS}
				value={null}
			/>,
		);

		expect(chips()).toHaveLength(0);
		expect(placeholder()).toHaveTextContent('Select frameworks...');

		rerender(
			<Combobox
				multiple
				nullable
				placeholder="Select frameworks..."
				searchInputProps={SEARCH}
				aria-label="Framework"
				items={FRAMEWORKS}
				value={['vue', 'react']}
			/>,
		);

		expect(chips().map((chip) => chip.textContent)).toEqual(['Vue', 'React']);

		rerender(
			<Combobox
				multiple
				nullable
				placeholder="Select frameworks..."
				searchInputProps={SEARCH}
				aria-label="Framework"
				items={FRAMEWORKS}
				value={null}
			/>,
		);

		expect(chips()).toHaveLength(0);
		expect(error).not.toHaveBeenCalled();
	});

	it('goes from null to a pick, and back to [] when cleared, never to null', async () => {
		const reported: string[][] = [];

		function Harness() {
			const [frameworks, setFrameworks] = useState<string[] | null>(null);

			return (
				<Combobox
					multiple
					nullable
					placeholder="Select frameworks..."
					searchInputProps={SEARCH}
					aria-label="Framework"
					items={FRAMEWORKS}
					value={frameworks}
					onChange={(next) => {
						reported.push(next);
						setFrameworks(next);
					}}
					allowClear
					testId="cb"
				/>
			);
		}

		render(<Harness />);
		await openCombobox();

		await userEvent.click(screen.getByRole('option', { name: 'Angular' }));
		await userEvent.keyboard('{Escape}');
		await userEvent.click(await screen.findByTestId('cb-clear'));

		expect(reported).toEqual([['angular'], []]);
		await waitFor(() => {
			expect(placeholder()).toHaveTextContent('Select frameworks...');
		});
	});
});

describe('ComboboxField nullable', () => {
	function ControllerHarness({ onChange }: { onChange: (value: string | null) => void }) {
		const [framework, setFramework] = useState<string | null>(null);
		// The shape of the `field` a react-hook-form `Controller` hands over.
		const field = {
			value: framework,
			onChange: (next: string | null) => {
				onChange(next);
				setFramework(next);
			},
			onBlur: () => undefined,
			name: 'framework',
			ref: () => undefined,
		};

		return (
			<ComboboxField
				label="Framework"
				placeholder="Select a framework..."
				searchInputProps={SEARCH}
				items={FRAMEWORKS}
				allowClear
				testId="cb"
				nullable
				{...field}
			/>
		);
	}

	it('takes the field of a Controller whose value starts as null, and sets it back to null', async () => {
		const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
		const onChange = vi.fn();
		render(<ControllerHarness onChange={onChange} />);

		expect(placeholder()).toHaveTextContent('Select a framework...');

		await openCombobox();
		await userEvent.click(screen.getByRole('option', { name: 'Vue' }));

		await waitFor(() => {
			expect(value()).toHaveTextContent('Vue');
		});

		await userEvent.click(screen.getByTestId('cb-clear'));

		expect(onChange).toHaveBeenLastCalledWith(null);
		expect(placeholder()).toHaveTextContent('Select a framework...');
		expect(trigger()).not.toHaveAttribute('nullable');
		expect(error).not.toHaveBeenCalled();
	});
});
