import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ComboboxSimple } from './combobox-simple.js';
import { renderWithProviders, setupMocks } from './combobox-simple.test-utils.js';

setupMocks();

const groupsWithHints = [
	{
		heading: 'Suggestions',
		items: [
			{ value: 'hint:status', label: 'status:', insertValue: 'status:' },
			{ value: 'hint:priority', label: 'priority:', insertValue: 'priority:' },
		],
	},
	{
		heading: 'Status',
		items: [
			{ value: 'status:active', label: 'Status: Active' },
			{ value: 'status:pending', label: 'Status: Pending' },
		],
	},
];

describe('ComboboxSimple hint items (insertValue)', () => {
	it('shows hint items when input is empty', () => {
		renderWithProviders(
			<ComboboxSimple groups={groupsWithHints} testId="combo" withPortal={false} />
		);

		fireEvent.click(screen.getByTestId('combo'));

		expect(screen.getByText('Suggestions')).toBeInTheDocument();
		expect(screen.getByText('status:')).toBeInTheDocument();
		expect(screen.getByText('priority:')).toBeInTheDocument();
	});

	it('hides hint items when input starts with hint insertValue', () => {
		renderWithProviders(
			<ComboboxSimple groups={groupsWithHints} testId="combo" withPortal={false} />
		);

		fireEvent.click(screen.getByTestId('combo'));
		const input = screen.getByRole('combobox');
		fireEvent.change(input, { target: { value: 'status:' } });

		expect(screen.queryByText('Suggestions')).not.toBeInTheDocument();
		expect(screen.getByRole('option', { name: 'Status: Active' })).toBeInTheDocument();
	});

	it('inserts value into input when hint is clicked', () => {
		renderWithProviders(
			<ComboboxSimple groups={groupsWithHints} testId="combo" withPortal={false} />
		);

		fireEvent.click(screen.getByTestId('combo'));
		fireEvent.click(screen.getByText('status:'));

		const input = screen.getByRole('combobox');
		expect(input).toHaveValue('status:');
	});

	it('shows hints again after clearing input', () => {
		renderWithProviders(
			<ComboboxSimple groups={groupsWithHints} testId="combo" withPortal={false} />
		);

		fireEvent.click(screen.getByTestId('combo'));
		const input = screen.getByRole('combobox');

		fireEvent.change(input, { target: { value: 'status:' } });
		expect(screen.queryByText('Suggestions')).not.toBeInTheDocument();

		fireEvent.change(input, { target: { value: '' } });
		expect(screen.getByText('Suggestions')).toBeInTheDocument();
	});

	it('shows hints after deleting colon from prefix', () => {
		renderWithProviders(
			<ComboboxSimple groups={groupsWithHints} testId="combo" withPortal={false} />
		);

		fireEvent.click(screen.getByTestId('combo'));
		const input = screen.getByRole('combobox');

		fireEvent.change(input, { target: { value: 'status:' } });
		expect(screen.queryByText('Suggestions')).not.toBeInTheDocument();
		expect(screen.queryByText('status:')).not.toBeInTheDocument();

		fireEvent.change(input, { target: { value: 'status' } });
		expect(screen.getByText('Suggestions')).toBeInTheDocument();
		expect(screen.getByText('status:')).toBeInTheDocument();
	});

	it('works with flat items containing hints', () => {
		const itemsWithHint = [
			{ value: 'hint:tag', label: 'tag:', insertValue: 'tag:' },
			{ value: 'tag:bug', label: 'tag:bug' },
			{ value: 'tag:feature', label: 'tag:feature' },
		];

		renderWithProviders(<ComboboxSimple items={itemsWithHint} testId="combo" withPortal={false} />);

		fireEvent.click(screen.getByTestId('combo'));

		expect(screen.getByText('tag:')).toBeInTheDocument();

		fireEvent.click(screen.getByText('tag:'));

		const input = screen.getByRole('combobox');
		expect(input).toHaveValue('tag:');

		expect(screen.queryByText('tag:')).not.toBeInTheDocument();
	});

	it('works with multi-select mode', () => {
		renderWithProviders(
			<ComboboxSimple groups={groupsWithHints} multiple testId="combo" withPortal={false} />
		);

		fireEvent.click(screen.getByTestId('combo'));

		fireEvent.click(screen.getByText('priority:'));

		const input = screen.getByPlaceholderText('Select an option...');
		expect(input).toHaveValue('priority:');

		expect(screen.queryByText('Suggestions')).not.toBeInTheDocument();
	});
});
