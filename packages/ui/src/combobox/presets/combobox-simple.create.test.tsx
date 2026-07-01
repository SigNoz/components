import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ComboboxSimple } from './combobox-simple.js';
import { defaultItems, renderWithProviders, setupMocks } from './combobox-simple.test-utils.js';

setupMocks();

describe('ComboboxSimple allowCreate', () => {
	it('shows create option when typing new value', () => {
		renderWithProviders(
			<ComboboxSimple items={defaultItems} allowCreate multiple testId="combo" withPortal={false} />
		);

		fireEvent.click(screen.getByTestId('combo'));
		const input = screen.getByPlaceholderText('Select an option...');
		fireEvent.change(input, { target: { value: 'new-tag' } });

		expect(screen.getByText('Create "new-tag"')).toBeInTheDocument();
	});

	it('does not show create option for existing values', () => {
		renderWithProviders(
			<ComboboxSimple items={defaultItems} allowCreate multiple testId="combo" withPortal={false} />
		);

		fireEvent.click(screen.getByTestId('combo'));
		const input = screen.getByPlaceholderText('Select an option...');
		fireEvent.change(input, { target: { value: 'react' } });

		expect(screen.queryByText('Create "react"')).not.toBeInTheDocument();
	});

	it('creates new item when clicking create option', () => {
		const onChange = vi.fn();
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				allowCreate
				multiple
				onChange={onChange}
				testId="combo"
				withPortal={false}
			/>
		);

		fireEvent.click(screen.getByTestId('combo'));
		const input = screen.getByPlaceholderText('Select an option...');
		fireEvent.change(input, { target: { value: 'custom' } });
		fireEvent.click(screen.getByText('Create "custom"'));

		expect(onChange).toHaveBeenCalledWith(['custom']);
	});

	it('supports custom create option render', () => {
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				allowCreate={(inputVal) => <span>Add "{inputVal}" as tag</span>}
				multiple
				testId="combo"
				withPortal={false}
			/>
		);

		fireEvent.click(screen.getByTestId('combo'));
		const input = screen.getByPlaceholderText('Select an option...');
		fireEvent.change(input, { target: { value: 'mytag' } });

		expect(screen.getByText('Add "mytag" as tag')).toBeInTheDocument();
	});

	it('does not allow duplicate custom values', () => {
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				allowCreate
				multiple
				defaultValue={['existing']}
				testId="combo"
				withPortal={false}
			/>
		);

		fireEvent.click(screen.getByTestId('combo'));
		const input = screen.getByPlaceholderText('Select an option...');
		fireEvent.change(input, { target: { value: 'existing' } });

		expect(screen.queryByText('Create "existing"')).not.toBeInTheDocument();
	});

	it('shows custom values in Custom group', () => {
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				allowCreate
				multiple
				defaultValue={['custom-tag']}
				testId="combo"
				withPortal={false}
			/>
		);

		fireEvent.click(screen.getByTestId('combo'));
		expect(screen.getByText('Custom')).toBeInTheDocument();
		expect(screen.getByRole('option', { name: 'custom-tag' })).toBeInTheDocument();
	});

	it('shows create option in single-select mode', () => {
		renderWithProviders(
			<ComboboxSimple items={defaultItems} allowCreate testId="combo" withPortal={false} />
		);

		fireEvent.click(screen.getByTestId('combo'));
		const input = screen.getByPlaceholderText('Select an option...');
		fireEvent.change(input, { target: { value: 'new-value' } });

		expect(screen.getByText('Create "new-value"')).toBeInTheDocument();
	});

	it('creates and selects value in single-select mode', () => {
		const onChange = vi.fn();
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				allowCreate
				onChange={onChange}
				testId="combo"
				withPortal={false}
			/>
		);

		fireEvent.click(screen.getByTestId('combo'));
		const input = screen.getByPlaceholderText('Select an option...');
		fireEvent.change(input, { target: { value: 'custom-item' } });
		fireEvent.click(screen.getByText('Create "custom-item"'));

		expect(onChange).toHaveBeenCalledWith('custom-item');
		expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
	});

	it('displays custom value in trigger after creation in single-select', () => {
		renderWithProviders(
			<ComboboxSimple items={defaultItems} allowCreate testId="combo" withPortal={false} />
		);

		fireEvent.click(screen.getByTestId('combo'));
		const input = screen.getByPlaceholderText('Select an option...');
		fireEvent.change(input, { target: { value: 'my-custom' } });
		fireEvent.click(screen.getByText('Create "my-custom"'));

		expect(screen.getByTestId('combo')).toHaveTextContent('my-custom');
	});

	it('shows custom value in Custom group when reopened in single-select', () => {
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				allowCreate
				defaultValue="pre-existing-custom"
				testId="combo"
				withPortal={false}
			/>
		);

		fireEvent.click(screen.getByTestId('combo'));
		expect(screen.getByText('Custom')).toBeInTheDocument();
		expect(screen.getByRole('option', { name: 'pre-existing-custom' })).toBeInTheDocument();
	});
});
