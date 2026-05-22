import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ComboboxSimple } from './combobox-simple.js';
import { renderWithProviders, setupMocks } from './combobox-simple.test-utils.js';

setupMocks();

const groups = [
	{
		heading: 'Frontend',
		items: [
			{ value: 'react', label: 'React' },
			{ value: 'vue', label: 'Vue' },
		],
	},
	{
		heading: 'Backend',
		items: [{ value: 'express', label: 'Express' }],
	},
];

describe('ComboboxSimple groups', () => {
	it('renders groups with headings', () => {
		renderWithProviders(<ComboboxSimple groups={groups} testId="combo" withPortal={false} />);

		fireEvent.click(screen.getByTestId('combo'));
		expect(screen.getByText('Frontend')).toBeInTheDocument();
		expect(screen.getByText('Backend')).toBeInTheDocument();
		expect(screen.getByRole('option', { name: 'React' })).toBeInTheDocument();
		expect(screen.getByRole('option', { name: 'Express' })).toBeInTheDocument();
	});

	it('renders groups without headings when heading is omitted', () => {
		const noHeadingGroups = [
			{ items: [{ value: 'a', label: 'Alpha' }] },
			{ items: [{ value: 'b', label: 'Beta' }] },
		];

		renderWithProviders(
			<ComboboxSimple groups={noHeadingGroups} testId="combo" withPortal={false} />
		);

		fireEvent.click(screen.getByTestId('combo'));
		expect(screen.getByRole('option', { name: 'Alpha' })).toBeInTheDocument();
		expect(screen.getByRole('option', { name: 'Beta' })).toBeInTheDocument();
	});

	it('selects item from group correctly', () => {
		const onChange = vi.fn();
		renderWithProviders(
			<ComboboxSimple groups={groups} onChange={onChange} testId="combo" withPortal={false} />
		);

		fireEvent.click(screen.getByTestId('combo'));
		fireEvent.click(screen.getByRole('option', { name: 'Express' }));

		expect(onChange).toHaveBeenCalledWith('express');
	});
});
