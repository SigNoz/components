import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ComboboxSimple } from './combobox-simple.js';
import { defaultItems, renderWithProviders, setupMocks } from './combobox-simple.test-utils.js';

setupMocks();

describe('ComboboxSimple filtering', () => {
	it('filters items with fuzzy matching', () => {
		renderWithProviders(<ComboboxSimple items={defaultItems} testId="combo" withPortal={false} />);

		fireEvent.click(screen.getByTestId('combo'));
		const input = screen.getByPlaceholderText('Select an option...');

		fireEvent.change(input, { target: { value: 'rct' } });

		expect(screen.getByRole('option', { name: 'React' })).toBeInTheDocument();
		expect(screen.queryByRole('option', { name: 'Vue' })).not.toBeInTheDocument();
		expect(screen.queryByRole('option', { name: 'Angular' })).not.toBeInTheDocument();
	});

	it('filters items by keywords', () => {
		const itemsWithKeywords = [
			{ value: '15m', label: '15 minutes', keywords: ['quarter hour', 'fifteen'] },
			{ value: '30m', label: '30 minutes', keywords: ['half hour', 'thirty'] },
			{ value: '1h', label: '1 hour', keywords: ['sixty minutes'] },
		];

		renderWithProviders(
			<ComboboxSimple items={itemsWithKeywords} testId="combo" withPortal={false} />
		);

		fireEvent.click(screen.getByTestId('combo'));
		const input = screen.getByPlaceholderText('Select an option...');

		fireEvent.change(input, { target: { value: 'quarter' } });

		expect(screen.getByRole('option', { name: '15 minutes' })).toBeInTheDocument();
		expect(screen.queryByRole('option', { name: '30 minutes' })).not.toBeInTheDocument();
		expect(screen.queryByRole('option', { name: '1 hour' })).not.toBeInTheDocument();
	});

	it('filters items by displayValue', () => {
		const itemsWithDisplayValue = [
			{ value: 'us-east-1', label: 'US East (N. Virginia)', displayValue: 'US East' },
			{ value: 'eu-west-1', label: 'EU West (Ireland)', displayValue: 'EU West' },
		];

		renderWithProviders(
			<ComboboxSimple items={itemsWithDisplayValue} testId="combo" withPortal={false} />
		);

		fireEvent.click(screen.getByTestId('combo'));
		const input = screen.getByPlaceholderText('Select an option...');

		fireEvent.change(input, { target: { value: 'US East' } });

		expect(screen.getByRole('option', { name: 'US East (N. Virginia)' })).toBeInTheDocument();
		expect(screen.queryByRole('option', { name: 'EU West (Ireland)' })).not.toBeInTheDocument();
	});

	it('filters items by label when label is string', () => {
		renderWithProviders(<ComboboxSimple items={defaultItems} testId="combo" withPortal={false} />);

		fireEvent.click(screen.getByTestId('combo'));
		const input = screen.getByPlaceholderText('Select an option...');

		fireEvent.change(input, { target: { value: 'Angular' } });

		expect(screen.getByRole('option', { name: 'Angular' })).toBeInTheDocument();
		expect(screen.queryByRole('option', { name: 'React' })).not.toBeInTheDocument();
		expect(screen.queryByRole('option', { name: 'Vue' })).not.toBeInTheDocument();
	});

	it('ranks exact matches higher than partial matches', () => {
		const items = [
			{ value: 'react-native', label: 'React Native' },
			{ value: 'react', label: 'React' },
			{ value: 'preact', label: 'Preact' },
		];

		renderWithProviders(<ComboboxSimple items={items} testId="combo" withPortal={false} />);

		fireEvent.click(screen.getByTestId('combo'));
		const input = screen.getByPlaceholderText('Select an option...');

		fireEvent.change(input, { target: { value: 'react' } });

		const options = screen.getAllByRole('option');
		expect(options[0]).toHaveTextContent('React');
	});
});

describe('ComboboxSimple empty state', () => {
	it('shows empty placeholder when no results', () => {
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				emptyPlaceholder="Nothing found"
				testId="combo"
				withPortal={false}
			/>
		);

		fireEvent.click(screen.getByTestId('combo'));
		const input = screen.getByPlaceholderText('Select an option...');
		fireEvent.change(input, { target: { value: 'nonexistent' } });

		expect(screen.getByText('Nothing found')).toBeInTheDocument();
	});

	it('uses default empty placeholder', () => {
		renderWithProviders(<ComboboxSimple items={defaultItems} testId="combo" withPortal={false} />);

		fireEvent.click(screen.getByTestId('combo'));
		const input = screen.getByPlaceholderText('Select an option...');
		fireEvent.change(input, { target: { value: 'xyz' } });

		expect(screen.getByText('No results found.')).toBeInTheDocument();
	});
});
