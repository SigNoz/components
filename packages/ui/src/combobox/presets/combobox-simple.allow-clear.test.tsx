import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { TooltipProvider } from '../../tooltip/index.js';
import { ComboboxSimple } from './combobox-simple.js';
import { defaultItems, renderWithProviders, setupMocks } from './combobox-simple.test-utils.js';

setupMocks();

describe('ComboboxSimple allowClear', () => {
	it('shows clear icon on hover when value selected', () => {
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				defaultValue="react"
				allowClear
				testId="combo"
				withPortal={false}
			/>
		);

		const trigger = screen.getByTestId('combo');
		expect(trigger.querySelector('[data-slot="combobox-icon"]')).toBeInTheDocument();

		fireEvent.mouseEnter(trigger);
		expect(trigger.querySelector('[data-slot="combobox-clear"]')).toBeInTheDocument();
		expect(trigger.querySelector('[data-slot="combobox-icon"]')).not.toBeInTheDocument();

		fireEvent.mouseLeave(trigger);
		expect(trigger.querySelector('[data-slot="combobox-icon"]')).toBeInTheDocument();
		expect(trigger.querySelector('[data-slot="combobox-clear"]')).not.toBeInTheDocument();
	});

	it('does not show clear icon when no value selected', () => {
		renderWithProviders(
			<ComboboxSimple items={defaultItems} allowClear testId="combo" withPortal={false} />
		);

		const trigger = screen.getByTestId('combo');
		fireEvent.mouseEnter(trigger);

		expect(trigger.querySelector('[data-slot="combobox-clear"]')).not.toBeInTheDocument();
		expect(trigger.querySelector('[data-slot="combobox-icon"]')).toBeInTheDocument();
	});

	it('calls onChange with undefined when clear clicked (single)', () => {
		const onChange = vi.fn();
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				value="react"
				onChange={onChange}
				allowClear
				testId="combo"
				withPortal={false}
			/>
		);

		const trigger = screen.getByTestId('combo');
		fireEvent.mouseEnter(trigger);

		const clearButton = trigger.querySelector('[data-slot="combobox-clear"]');
		expect(clearButton).toBeInTheDocument();
		fireEvent.click(clearButton!);

		expect(onChange).toHaveBeenCalledWith(undefined);
	});

	it('calls onChange with empty array when clear clicked (multiple)', () => {
		const onChange = vi.fn();
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				value={['react', 'vue']}
				onChange={onChange}
				allowClear
				multiple
				testId="combo"
				withPortal={false}
			/>
		);

		const trigger = screen.getByTestId('combo');
		fireEvent.mouseEnter(trigger);

		const clearButton = trigger.querySelector('[data-slot="combobox-clear"]');
		expect(clearButton).toBeInTheDocument();
		fireEvent.click(clearButton!);

		expect(onChange).toHaveBeenCalledWith([]);
	});

	it('does not open dropdown when clear clicked', () => {
		const onChange = vi.fn();
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				value="react"
				onChange={onChange}
				allowClear
				testId="combo"
				withPortal={false}
			/>
		);

		const trigger = screen.getByTestId('combo');
		fireEvent.mouseEnter(trigger);

		const clearButton = trigger.querySelector('[data-slot="combobox-clear"]');
		fireEvent.click(clearButton!);

		expect(screen.queryByRole('option')).not.toBeInTheDocument();
	});

	it('does not show clear icon when disabled', () => {
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				defaultValue="react"
				allowClear
				disabled
				testId="combo"
				withPortal={false}
			/>
		);

		const trigger = screen.getByTestId('combo');
		fireEvent.mouseEnter(trigger);

		expect(trigger.querySelector('[data-slot="combobox-clear"]')).not.toBeInTheDocument();
	});

	it('does not show clear icon when loading', () => {
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				defaultValue="react"
				allowClear
				loading
				testId="combo"
				withPortal={false}
			/>
		);

		const trigger = screen.getByTestId('combo');
		fireEvent.mouseEnter(trigger);

		expect(trigger.querySelector('[data-slot="combobox-clear"]')).not.toBeInTheDocument();
		expect(trigger.querySelector('[data-slot="combobox-spinner"]')).toBeInTheDocument();
	});

	it('does not show clear icon when allowClear is false', () => {
		renderWithProviders(
			<ComboboxSimple items={defaultItems} defaultValue="react" testId="combo" withPortal={false} />
		);

		const trigger = screen.getByTestId('combo');
		fireEvent.mouseEnter(trigger);

		expect(trigger.querySelector('[data-slot="combobox-clear"]')).not.toBeInTheDocument();
	});

	it('does not show clear icon when value is empty string', () => {
		renderWithProviders(
			<ComboboxSimple items={defaultItems} value="" allowClear testId="combo" withPortal={false} />
		);

		const trigger = screen.getByTestId('combo');
		fireEvent.mouseEnter(trigger);

		expect(trigger.querySelector('[data-slot="combobox-clear"]')).not.toBeInTheDocument();
		expect(trigger.querySelector('[data-slot="combobox-icon"]')).toBeInTheDocument();
	});

	it('does not show clear icon when multiple value is empty array', () => {
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				value={[]}
				multiple
				allowClear
				testId="combo"
				withPortal={false}
			/>
		);

		const trigger = screen.getByTestId('combo');
		fireEvent.mouseEnter(trigger);

		expect(trigger.querySelector('[data-slot="combobox-clear"]')).not.toBeInTheDocument();
		expect(trigger.querySelector('[data-slot="combobox-icon"]')).toBeInTheDocument();
	});

	it('clears value and allows re-selection (single)', () => {
		const onChange = vi.fn();
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				value="react"
				onChange={onChange}
				allowClear
				testId="combo"
				withPortal={false}
			/>
		);

		const trigger = screen.getByTestId('combo');

		expect(trigger.querySelector('[data-slot="combobox-value"]')).toHaveTextContent('React');

		fireEvent.mouseEnter(trigger);
		const clearButton = trigger.querySelector('[data-slot="combobox-clear"]');
		fireEvent.click(clearButton!);

		expect(onChange).toHaveBeenCalledWith(undefined);
	});

	it('clears all values and allows re-selection (multiple)', () => {
		const onChange = vi.fn();
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				value={['react', 'vue']}
				onChange={onChange}
				allowClear
				multiple
				testId="combo"
				withPortal={false}
			/>
		);

		const trigger = screen.getByTestId('combo');

		expect(screen.getByText('React')).toBeInTheDocument();
		expect(screen.getByText('Vue')).toBeInTheDocument();

		fireEvent.mouseEnter(trigger);
		const clearButton = trigger.querySelector('[data-slot="combobox-clear"]');
		fireEvent.click(clearButton!);

		expect(onChange).toHaveBeenCalledWith([]);
	});

	it('full cycle: select, clear, select again (single)', async () => {
		const onChangeSpy = vi.fn();
		function TestComponent() {
			const [value, setValue] = useState<string | undefined>(undefined);
			return (
				<TooltipProvider>
					<ComboboxSimple
						items={defaultItems}
						value={value}
						onChange={(v) => {
							onChangeSpy(v);
							setValue(v as string | undefined);
						}}
						allowClear
						testId="combo"
						withPortal={false}
					/>
				</TooltipProvider>
			);
		}

		render(<TestComponent />);

		const trigger = screen.getByTestId('combo');

		expect(trigger.querySelector('[data-slot="combobox-placeholder"]')).toBeInTheDocument();

		fireEvent.click(trigger);
		fireEvent.click(screen.getByRole('option', { name: 'React' }));

		await waitFor(() => {
			expect(onChangeSpy).toHaveBeenCalledWith('react');
		});

		expect(trigger.querySelector('[data-slot="combobox-value"]')).toHaveTextContent('React');

		fireEvent.mouseEnter(trigger);

		await waitFor(() => {
			expect(trigger.querySelector('[data-slot="combobox-clear"]')).toBeInTheDocument();
		});

		fireEvent.click(trigger.querySelector('[data-slot="combobox-clear"]')!);

		await waitFor(() => {
			expect(onChangeSpy).toHaveBeenCalledWith(undefined);
		});

		expect(trigger.querySelector('[data-slot="combobox-placeholder"]')).toBeInTheDocument();

		fireEvent.click(trigger);
		fireEvent.click(screen.getByRole('option', { name: 'Vue' }));

		await waitFor(() => {
			expect(onChangeSpy).toHaveBeenCalledWith('vue');
		});

		expect(trigger.querySelector('[data-slot="combobox-value"]')).toHaveTextContent('Vue');
	});

	it('trigger shows placeholder immediately after clear (no stale value)', async () => {
		function TestComponent() {
			const [value, setValue] = useState<string | undefined>('react');
			return (
				<TooltipProvider>
					<ComboboxSimple
						items={defaultItems}
						value={value}
						onChange={(v) => setValue(v as string | undefined)}
						allowClear
						testId="combo"
						withPortal={false}
					/>
					<span data-testid="state-value">{value ?? 'cleared'}</span>
				</TooltipProvider>
			);
		}

		render(<TestComponent />);

		const trigger = screen.getByTestId('combo');

		expect(trigger.querySelector('[data-slot="combobox-value"]')).toHaveTextContent('React');

		fireEvent.mouseEnter(trigger);
		fireEvent.click(trigger.querySelector('[data-slot="combobox-clear"]')!);

		expect(screen.getByTestId('state-value')).toHaveTextContent('cleared');
		expect(trigger.querySelector('[data-slot="combobox-placeholder"]')).toBeInTheDocument();
		expect(trigger.querySelector('[data-slot="combobox-value"]')).not.toBeInTheDocument();
	});

	it('full cycle: select, clear, select again (multiple)', async () => {
		function TestComponent() {
			const [values, setValues] = useState<string[]>([]);
			return (
				<TooltipProvider>
					<ComboboxSimple
						items={defaultItems}
						value={values}
						onChange={(v) => setValues(v as string[])}
						allowClear
						multiple
						testId="combo"
						withPortal={false}
					/>
				</TooltipProvider>
			);
		}

		render(<TestComponent />);

		const trigger = screen.getByTestId('combo');

		expect(trigger.querySelector('[data-slot="combobox-placeholder"]')).toBeInTheDocument();

		fireEvent.click(trigger);
		fireEvent.click(screen.getByRole('option', { name: 'React' }));
		fireEvent.click(screen.getByRole('option', { name: 'Vue' }));

		await waitFor(() => {
			const pills = trigger.querySelectorAll('[data-slot="combobox-value"] span');
			expect(pills.length).toBeGreaterThanOrEqual(2);
		});

		fireEvent.keyDown(trigger, { key: 'Escape' });

		fireEvent.mouseEnter(trigger);
		const clearButton = trigger.querySelector('[data-slot="combobox-clear"]');
		fireEvent.click(clearButton!);

		await waitFor(() => {
			expect(trigger.querySelector('[data-slot="combobox-placeholder"]')).toBeInTheDocument();
		});

		fireEvent.click(trigger);
		fireEvent.click(screen.getByRole('option', { name: 'Angular' }));

		await waitFor(() => {
			const newPills = trigger.querySelectorAll('[data-slot="combobox-value"] span');
			expect(newPills.length).toBeGreaterThanOrEqual(1);
		});
	});

	it('clears value in uncontrolled mode (single)', () => {
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				defaultValue="react"
				allowClear
				testId="combo"
				withPortal={false}
			/>
		);

		const trigger = screen.getByTestId('combo');
		expect(trigger.querySelector('[data-slot="combobox-value"]')).toHaveTextContent('React');

		fireEvent.mouseEnter(trigger);
		const clearButton = trigger.querySelector('[data-slot="combobox-clear"]');
		fireEvent.click(clearButton!);

		expect(trigger.querySelector('[data-slot="combobox-placeholder"]')).toBeInTheDocument();
		expect(trigger.querySelector('[data-slot="combobox-value"]')).not.toBeInTheDocument();
	});

	it('clears value in uncontrolled mode (multiple)', () => {
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				defaultValue={['react', 'vue']}
				allowClear
				multiple
				testId="combo"
				withPortal={false}
			/>
		);

		const trigger = screen.getByTestId('combo');
		expect(trigger.querySelector('[data-slot="combobox-value"]')).toBeInTheDocument();

		fireEvent.mouseEnter(trigger);
		const clearButton = trigger.querySelector('[data-slot="combobox-clear"]');
		fireEvent.click(clearButton!);

		expect(trigger.querySelector('[data-slot="combobox-placeholder"]')).toBeInTheDocument();
		expect(trigger.querySelector('[data-slot="combobox-value"]')).not.toBeInTheDocument();
	});

	it('clears value on Delete key press when focused (single)', () => {
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				defaultValue="react"
				allowClear
				testId="combo"
				withPortal={false}
			/>
		);

		const trigger = screen.getByTestId('combo');
		expect(trigger.querySelector('[data-slot="combobox-value"]')).toHaveTextContent('React');

		fireEvent.keyDown(trigger, { key: 'Delete' });

		expect(trigger.querySelector('[data-slot="combobox-placeholder"]')).toBeInTheDocument();
	});

	it('clears value on Backspace key press when focused (multiple)', () => {
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				defaultValue={['react', 'vue']}
				allowClear
				multiple
				testId="combo"
				withPortal={false}
			/>
		);

		const trigger = screen.getByTestId('combo');
		expect(trigger.querySelector('[data-slot="combobox-value"]')).toBeInTheDocument();

		fireEvent.keyDown(trigger, { key: 'Backspace' });

		expect(trigger.querySelector('[data-slot="combobox-placeholder"]')).toBeInTheDocument();
	});

	it('does not clear on Delete/Backspace when allowClear is false', () => {
		renderWithProviders(
			<ComboboxSimple items={defaultItems} defaultValue="react" testId="combo" withPortal={false} />
		);

		const trigger = screen.getByTestId('combo');
		fireEvent.keyDown(trigger, { key: 'Delete' });

		expect(trigger.querySelector('[data-slot="combobox-value"]')).toHaveTextContent('React');
	});

	it('does not clear on Delete/Backspace when disabled', () => {
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				defaultValue="react"
				allowClear
				disabled
				testId="combo"
				withPortal={false}
			/>
		);

		const trigger = screen.getByTestId('combo');
		fireEvent.keyDown(trigger, { key: 'Delete' });

		expect(trigger.querySelector('[data-slot="combobox-value"]')).toHaveTextContent('React');
	});
});
