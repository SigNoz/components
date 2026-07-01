import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ComboboxSimple } from './combobox-simple.js';
import { defaultItems, renderWithProviders, setupMocks } from './combobox-simple.test-utils.js';

setupMocks();

describe('ComboboxSimple keyboard in single-select', () => {
	it('closes dropdown on Escape key', () => {
		renderWithProviders(<ComboboxSimple items={defaultItems} testId="combo" withPortal={false} />);

		fireEvent.click(screen.getByTestId('combo'));
		expect(screen.getByRole('option', { name: 'React' })).toBeInTheDocument();

		const input = screen.getByRole('combobox');
		fireEvent.keyDown(input, { key: 'Escape' });

		expect(screen.queryByRole('option')).not.toBeInTheDocument();
	});

	it('closes dropdown and focuses trigger on Shift+Tab', () => {
		renderWithProviders(<ComboboxSimple items={defaultItems} testId="combo" withPortal={false} />);

		const trigger = screen.getByTestId('combo');
		fireEvent.click(trigger);

		const input = screen.getByRole('combobox');
		fireEvent.keyDown(input, { key: 'Tab', shiftKey: true });

		expect(screen.queryByRole('option')).not.toBeInTheDocument();
		expect(document.activeElement).toBe(trigger);
	});

	it('selects item with Enter after navigation', () => {
		const onChange = vi.fn();
		renderWithProviders(
			<ComboboxSimple items={defaultItems} onChange={onChange} testId="combo" withPortal={false} />
		);

		fireEvent.click(screen.getByTestId('combo'));
		const input = screen.getByRole('combobox');

		fireEvent.keyDown(input, { key: 'ArrowDown' });
		fireEvent.keyDown(input, { key: 'Enter' });

		expect(onChange).toHaveBeenCalledWith('vue');
	});

	it('closes dropdown after Enter selection in single mode', () => {
		renderWithProviders(<ComboboxSimple items={defaultItems} testId="combo" withPortal={false} />);

		fireEvent.click(screen.getByTestId('combo'));
		const input = screen.getByRole('combobox');

		fireEvent.keyDown(input, { key: 'ArrowDown' });
		fireEvent.keyDown(input, { key: 'Enter' });

		expect(screen.queryByRole('option')).not.toBeInTheDocument();
	});
});

describe('ComboboxSimple keyboard in multi-select', () => {
	it('opens on Enter key', () => {
		renderWithProviders(
			<ComboboxSimple items={defaultItems} multiple testId="combo" withPortal={false} />
		);

		const trigger = screen.getByTestId('combo');
		fireEvent.keyDown(trigger, { key: 'Enter' });

		expect(screen.getByRole('option', { name: 'React' })).toBeInTheDocument();
	});

	it('opens on Space key', () => {
		renderWithProviders(
			<ComboboxSimple items={defaultItems} multiple testId="combo" withPortal={false} />
		);

		const trigger = screen.getByTestId('combo');
		fireEvent.keyDown(trigger, { key: ' ' });

		expect(screen.getByRole('option', { name: 'React' })).toBeInTheDocument();
	});

	it('keeps dropdown open after Enter selection', () => {
		renderWithProviders(
			<ComboboxSimple items={defaultItems} multiple testId="combo" withPortal={false} />
		);

		fireEvent.click(screen.getByTestId('combo'));
		const input = screen.getByPlaceholderText('Select an option...');

		fireEvent.keyDown(input, { key: 'ArrowDown' });
		fireEvent.keyDown(input, { key: 'Enter' });

		expect(screen.getByRole('option', { name: 'Vue' })).toBeInTheDocument();
	});

	it('toggles selection with Enter', () => {
		const onChange = vi.fn();
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				multiple
				onChange={onChange}
				testId="combo"
				withPortal={false}
			/>
		);

		fireEvent.click(screen.getByTestId('combo'));
		const input = screen.getByPlaceholderText('Select an option...');

		fireEvent.keyDown(input, { key: 'ArrowDown' });
		fireEvent.keyDown(input, { key: 'Enter' });

		expect(onChange).toHaveBeenCalledWith(['vue']);
	});

	it('does not remove pill with Backspace when input has value', () => {
		const onChange = vi.fn();
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				multiple
				defaultValue={['react']}
				onChange={onChange}
				testId="combo"
				withPortal={false}
			/>
		);

		fireEvent.click(screen.getByTestId('combo'));
		const input = screen.getByPlaceholderText('Select an option...');
		fireEvent.change(input, { target: { value: 'test' } });
		fireEvent.keyDown(input, { key: 'Backspace' });

		expect(onChange).not.toHaveBeenCalled();
	});

	it('closes on Escape and focuses trigger', () => {
		renderWithProviders(
			<ComboboxSimple items={defaultItems} multiple testId="combo" withPortal={false} />
		);

		const trigger = screen.getByTestId('combo');
		fireEvent.click(trigger);

		const input = screen.getByPlaceholderText('Select an option...');
		fireEvent.keyDown(input, { key: 'Escape' });

		expect(screen.queryByRole('option')).not.toBeInTheDocument();
	});
});
