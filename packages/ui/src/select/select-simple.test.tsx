import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SelectSimple } from './presets/select-simple.js';
import { selectSimpleItems } from './select.test-utils.js';

describe('SelectSimple', () => {
	it('renders trigger combobox', () => {
		render(<SelectSimple items={selectSimpleItems} withPortal={false} />);
		expect(screen.getByRole('combobox')).toBeInTheDocument();
	});

	it('renders trigger with data-placeholder attribute when no value selected', () => {
		render(
			<SelectSimple items={selectSimpleItems} placeholder="Choose a framework" withPortal={false} />
		);
		expect(screen.getByRole('combobox')).toHaveAttribute('data-placeholder');
	});

	it('calls onChange when item is selected', () => {
		const onChange = vi.fn();
		render(<SelectSimple items={selectSimpleItems} onChange={onChange} withPortal={false} />);

		fireEvent.click(screen.getByRole('combobox'));
		fireEvent.click(screen.getByRole('option', { name: 'Vue' }));

		expect(onChange).toHaveBeenCalledWith('vue');
	});

	it('displays selected value in trigger via defaultValue', () => {
		render(<SelectSimple items={selectSimpleItems} defaultValue="react" withPortal={false} />);
		expect(screen.getByText('React')).toBeInTheDocument();
	});

	it('displays selected value in trigger via controlled value', () => {
		render(<SelectSimple items={selectSimpleItems} value="angular" withPortal={false} />);
		expect(screen.getByText('Angular')).toBeInTheDocument();
	});

	it('renders groups with headings', () => {
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

		render(<SelectSimple groups={groups} withPortal={false} />);

		fireEvent.click(screen.getByRole('combobox'));
		expect(screen.getByText('Frontend')).toBeInTheDocument();
		expect(screen.getByText('Backend')).toBeInTheDocument();
		expect(screen.getByRole('option', { name: 'React' })).toBeInTheDocument();
		expect(screen.getByRole('option', { name: 'Express' })).toBeInTheDocument();
	});

	it('renders groups without headings when heading is omitted', () => {
		const groups = [
			{ items: [{ value: 'a', label: 'Alpha' }] },
			{ items: [{ value: 'b', label: 'Beta' }] },
		];

		render(<SelectSimple groups={groups} withPortal={false} />);

		fireEvent.click(screen.getByRole('combobox'));
		expect(screen.getByRole('option', { name: 'Alpha' })).toBeInTheDocument();
		expect(screen.getByRole('option', { name: 'Beta' })).toBeInTheDocument();
	});

	it('disables the trigger when disabled is true', () => {
		render(<SelectSimple items={selectSimpleItems} disabled withPortal={false} />);
		expect(screen.getByRole('combobox')).toBeDisabled();
	});

	it('uses displayValue when item has a displayValue property', () => {
		const richItems = [{ value: 'node', label: <span>Node.js</span>, displayValue: 'Node.js' }];
		render(<SelectSimple items={richItems} defaultValue="node" withPortal={false} />);
		expect(screen.getByText('Node.js')).toBeInTheDocument();
	});

	it('supports multi-select mode: shows pills for selected values', () => {
		render(
			<SelectSimple
				items={selectSimpleItems}
				multiple
				defaultValue={['react', 'vue']}
				withPortal={false}
			/>
		);
		expect(screen.getByText('React')).toBeInTheDocument();
		expect(screen.getByText('Vue')).toBeInTheDocument();
	});

	it('supports multi-select mode: calls onChange with array on selection', () => {
		const onChange = vi.fn();
		render(
			<SelectSimple items={selectSimpleItems} multiple onChange={onChange} withPortal={false} />
		);

		fireEvent.click(screen.getByRole('combobox'));
		fireEvent.click(screen.getByRole('option', { name: 'Angular' }));

		expect(onChange).toHaveBeenCalledWith(['angular']);
	});

	it('shows all items when dropdown is opened', () => {
		render(<SelectSimple items={selectSimpleItems} withPortal={false} />);

		fireEvent.click(screen.getByRole('combobox'));
		expect(screen.getByRole('option', { name: 'React' })).toBeInTheDocument();
		expect(screen.getByRole('option', { name: 'Vue' })).toBeInTheDocument();
		expect(screen.getByRole('option', { name: 'Angular' })).toBeInTheDocument();
	});
});
