import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ComboboxSimple } from './combobox-simple.js';
import { defaultItems, renderWithProviders, setupMocks } from './combobox-simple.test-utils.js';

setupMocks();

describe('ComboboxSimple disabled state', () => {
	it('does not open dropdown when disabled', () => {
		renderWithProviders(
			<ComboboxSimple items={defaultItems} disabled testId="combo" withPortal={false} />
		);

		fireEvent.click(screen.getByTestId('combo'));
		expect(screen.queryByRole('option')).not.toBeInTheDocument();
	});

	it('applies disabled attribute to single-select trigger', () => {
		renderWithProviders(
			<ComboboxSimple items={defaultItems} disabled testId="combo" withPortal={false} />
		);

		const trigger = screen.getByTestId('combo');
		expect(trigger).toBeDisabled();
		expect(trigger).toHaveAttribute('data-disabled', 'true');
	});

	it('applies disabled attributes to multi-select trigger', () => {
		renderWithProviders(
			<ComboboxSimple items={defaultItems} multiple disabled testId="combo" withPortal={false} />
		);

		const trigger = screen.getByTestId('combo');
		expect(trigger).toHaveAttribute('aria-disabled', 'true');
		expect(trigger).toHaveAttribute('data-disabled', 'true');
		expect(trigger).toHaveAttribute('tabIndex', '-1');
	});

	it('does not open on Enter key when disabled', () => {
		renderWithProviders(
			<ComboboxSimple items={defaultItems} multiple disabled testId="combo" withPortal={false} />
		);

		const trigger = screen.getByTestId('combo');
		fireEvent.keyDown(trigger, { key: 'Enter' });

		expect(screen.queryByRole('option')).not.toBeInTheDocument();
	});

	it('does not call onChange when disabled', () => {
		const onChange = vi.fn();
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				disabled
				onChange={onChange}
				testId="combo"
				withPortal={false}
			/>
		);

		fireEvent.click(screen.getByTestId('combo'));
		expect(onChange).not.toHaveBeenCalled();
	});

	it('does not open with groups when disabled', () => {
		const groups = [
			{
				heading: 'Frameworks',
				items: defaultItems,
			},
		];
		renderWithProviders(
			<ComboboxSimple groups={groups} disabled testId="combo" withPortal={false} />
		);

		fireEvent.click(screen.getByTestId('combo'));
		expect(screen.queryByText('Frameworks')).not.toBeInTheDocument();
		expect(screen.queryByRole('option')).not.toBeInTheDocument();
	});

	it('does not show create option when disabled with allowCreate', () => {
		renderWithProviders(
			<ComboboxSimple items={defaultItems} allowCreate disabled testId="combo" withPortal={false} />
		);

		fireEvent.click(screen.getByTestId('combo'));
		expect(screen.queryByText(/Create/)).not.toBeInTheDocument();
	});

	it('does not open on Space key when disabled', () => {
		renderWithProviders(
			<ComboboxSimple items={defaultItems} disabled testId="combo" withPortal={false} />
		);

		const trigger = screen.getByTestId('combo');
		fireEvent.keyDown(trigger, { key: ' ' });

		expect(screen.queryByRole('option')).not.toBeInTheDocument();
	});

	it('does not open on ArrowDown when disabled', () => {
		renderWithProviders(
			<ComboboxSimple items={defaultItems} disabled testId="combo" withPortal={false} />
		);

		const trigger = screen.getByTestId('combo');
		fireEvent.keyDown(trigger, { key: 'ArrowDown' });

		expect(screen.queryByRole('option')).not.toBeInTheDocument();
	});
});
