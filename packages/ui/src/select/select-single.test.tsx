import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Select } from './components/select.js';
import { SelectContent } from './components/select-content.js';
import { SelectGroup, SelectLabel } from './components/select-group.js';
import { SelectItem } from './components/select-item.js';
import { SelectTrigger } from './components/select-trigger.js';
import { renderSingleSelect } from './select.test-utils.js';

describe('Select single', () => {
	it('renders trigger with placeholder when no value is selected', () => {
		renderSingleSelect({ placeholder: 'Choose a fruit' });
		expect(screen.getByText('Choose a fruit')).toBeInTheDocument();
	});

	it('opens dropdown when trigger is clicked', () => {
		renderSingleSelect();
		fireEvent.click(screen.getByRole('combobox'));
		expect(screen.getByRole('option', { name: 'Apple' })).toBeInTheDocument();
	});

	it('calls onChange with selected value when item is clicked', () => {
		const onChange = vi.fn();
		renderSingleSelect({ onChange });

		fireEvent.click(screen.getByRole('combobox'));
		fireEvent.click(screen.getByRole('option', { name: 'Banana' }));

		expect(onChange).toHaveBeenCalledWith('banana');
	});

	it('closes dropdown after selecting an item', () => {
		renderSingleSelect();
		fireEvent.click(screen.getByRole('combobox'));
		expect(screen.getByRole('option', { name: 'Apple' })).toBeInTheDocument();
		fireEvent.click(screen.getByRole('option', { name: 'Apple' }));
		expect(screen.queryByRole('option', { name: 'Apple' })).not.toBeInTheDocument();
	});

	it('displays selected value in trigger via defaultValue', () => {
		renderSingleSelect({ defaultValue: 'cherry' });
		expect(screen.getByText('Cherry')).toBeInTheDocument();
	});

	it('displays selected value in trigger via controlled value', () => {
		renderSingleSelect({ value: 'banana' });
		expect(screen.getByText('Banana')).toBeInTheDocument();
	});

	it('disables trigger when disabled prop is true', () => {
		renderSingleSelect({ disabled: true });
		expect(screen.getByRole('combobox')).toBeDisabled();
	});

	it('does not open dropdown when trigger is clicked while disabled', () => {
		renderSingleSelect({ disabled: true });
		fireEvent.click(screen.getByRole('combobox'));
		expect(screen.queryByRole('option', { name: 'Apple' })).not.toBeInTheDocument();
	});

	it('renders groups with labels', () => {
		render(
			<Select>
				<SelectTrigger placeholder="Select fruit" />
				<SelectContent withPortal={false}>
					<SelectGroup>
						<SelectLabel>Tropical</SelectLabel>
						<SelectItem value="mango">Mango</SelectItem>
						<SelectItem value="papaya">Papaya</SelectItem>
					</SelectGroup>
					<SelectGroup>
						<SelectLabel>Berries</SelectLabel>
						<SelectItem value="strawberry">Strawberry</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>
		);

		fireEvent.click(screen.getByRole('combobox'));
		expect(screen.getByText('Tropical')).toBeInTheDocument();
		expect(screen.getByText('Berries')).toBeInTheDocument();
		expect(screen.getByRole('option', { name: 'Mango' })).toBeInTheDocument();
		expect(screen.getByRole('option', { name: 'Papaya' })).toBeInTheDocument();
		expect(screen.getByRole('option', { name: 'Strawberry' })).toBeInTheDocument();
	});

	it('reflects controlled value changes on rerender', () => {
		const { rerender } = render(
			<Select value="apple">
				<SelectTrigger placeholder="Pick" />
				<SelectContent withPortal={false}>
					<SelectItem value="apple">Apple</SelectItem>
					<SelectItem value="banana">Banana</SelectItem>
				</SelectContent>
			</Select>
		);
		expect(screen.getByText('Apple')).toBeInTheDocument();

		rerender(
			<Select value="banana">
				<SelectTrigger placeholder="Pick" />
				<SelectContent withPortal={false}>
					<SelectItem value="apple">Apple</SelectItem>
					<SelectItem value="banana">Banana</SelectItem>
				</SelectContent>
			</Select>
		);
		expect(screen.getByText('Banana')).toBeInTheDocument();
	});
});
