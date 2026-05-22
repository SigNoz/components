import { fireEvent, render, screen } from '@testing-library/react';
import * as React from 'react';
import { describe, expect, it } from 'vitest';
import { ComboboxSimple } from './combobox-simple.js';
import { defaultItems, renderWithProviders, setupMocks } from './combobox-simple.test-utils.js';

setupMocks();

describe('ComboboxSimple rendering', () => {
	it('renders trigger button', () => {
		renderWithProviders(<ComboboxSimple items={defaultItems} testId="combo" withPortal={false} />);
		expect(screen.getByTestId('combo')).toBeInTheDocument();
	});

	it('renders trigger with placeholder text when no value selected', () => {
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				placeholder="Choose..."
				testId="combo"
				withPortal={false}
			/>
		);
		expect(screen.getByTestId('combo')).toHaveTextContent('Choose...');
	});

	it('uses inputPlaceholder for search input when provided', () => {
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				placeholder="Choose..."
				inputPlaceholder="Search items..."
				testId="combo"
				withPortal={false}
			/>
		);
		fireEvent.click(screen.getByTestId('combo'));
		expect(screen.getByPlaceholderText('Search items...')).toBeInTheDocument();
	});

	it('falls back to placeholder for search input when inputPlaceholder not provided', () => {
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				placeholder="Choose..."
				testId="combo"
				withPortal={false}
			/>
		);
		fireEvent.click(screen.getByTestId('combo'));
		expect(screen.getByPlaceholderText('Choose...')).toBeInTheDocument();
	});

	it('applies testId to trigger', () => {
		renderWithProviders(
			<ComboboxSimple items={defaultItems} testId="my-combobox" withPortal={false} />
		);
		expect(screen.getByTestId('my-combobox')).toBeInTheDocument();
	});

	it('applies id to trigger', () => {
		renderWithProviders(
			<ComboboxSimple items={defaultItems} id="combo-id" testId="combo" withPortal={false} />
		);
		expect(screen.getByTestId('combo')).toHaveAttribute('id', 'combo-id');
	});

	it('applies className to trigger', () => {
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				className="custom-class"
				testId="combo"
				withPortal={false}
			/>
		);
		expect(screen.getByTestId('combo')).toHaveClass('custom-class');
	});

	it('applies style to trigger', () => {
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				style={{ width: '200px' }}
				testId="combo"
				withPortal={false}
			/>
		);
		expect(screen.getByTestId('combo')).toHaveStyle({ width: '200px' });
	});

	it('does not nest button inside button in multi-select mode', () => {
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				multiple
				defaultValue={['react']}
				testId="combo"
				withPortal={false}
			/>
		);

		const trigger = screen.getByTestId('combo');
		const nestedButtons = trigger.querySelectorAll('button');

		if (trigger.tagName === 'BUTTON') {
			expect(nestedButtons.length).toBe(0);
		}
	});

	it('applies id to multi-select trigger', () => {
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				multiple
				id="multi-id"
				testId="combo"
				withPortal={false}
			/>
		);
		expect(screen.getByTestId('combo')).toHaveAttribute('id', 'multi-id');
	});

	it('exposes data-slot attributes on trigger parts', () => {
		renderWithProviders(<ComboboxSimple items={defaultItems} testId="combo" withPortal={false} />);
		const trigger = screen.getByTestId('combo');
		expect(trigger).toHaveAttribute('data-slot', 'combobox-trigger');
		expect(trigger.querySelector('[data-slot="combobox-placeholder"]')).toBeInTheDocument();
		expect(trigger.querySelector('[data-slot="combobox-icon"]')).toBeInTheDocument();
	});

	it('uses combobox-placeholder data-slot when no value selected (single)', () => {
		renderWithProviders(<ComboboxSimple items={defaultItems} testId="combo" withPortal={false} />);
		const trigger = screen.getByTestId('combo');
		expect(trigger.querySelector('[data-slot="combobox-placeholder"]')).toBeInTheDocument();
		expect(trigger.querySelector('[data-slot="combobox-value"]')).not.toBeInTheDocument();
	});

	it('uses combobox-value data-slot when value selected (single)', () => {
		renderWithProviders(
			<ComboboxSimple items={defaultItems} value="react" testId="combo" withPortal={false} />
		);
		const trigger = screen.getByTestId('combo');
		expect(trigger.querySelector('[data-slot="combobox-value"]')).toBeInTheDocument();
		expect(trigger.querySelector('[data-slot="combobox-placeholder"]')).not.toBeInTheDocument();
	});

	it('uses combobox-placeholder data-slot when no value selected (multi)', () => {
		renderWithProviders(
			<ComboboxSimple items={defaultItems} multiple testId="combo" withPortal={false} />
		);
		const trigger = screen.getByTestId('combo');
		expect(trigger.querySelector('[data-slot="combobox-placeholder"]')).toBeInTheDocument();
		expect(trigger.querySelector('[data-slot="combobox-value"]')).not.toBeInTheDocument();
	});

	it('uses combobox-value data-slot when value selected (multi)', () => {
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				multiple
				value={['react']}
				testId="combo"
				withPortal={false}
			/>
		);
		const trigger = screen.getByTestId('combo');
		expect(trigger.querySelector('[data-slot="combobox-value"]')).toBeInTheDocument();
		expect(trigger.querySelector('[data-slot="combobox-placeholder"]')).not.toBeInTheDocument();
	});

	it('shows spinner data-slot when loading', () => {
		renderWithProviders(
			<ComboboxSimple items={defaultItems} loading testId="combo" withPortal={false} />
		);
		const trigger = screen.getByTestId('combo');
		expect(trigger.querySelector('[data-slot="combobox-spinner"]')).toBeInTheDocument();
		expect(trigger.querySelector('[data-slot="combobox-icon"]')).not.toBeInTheDocument();
	});

	it('reflects open state in aria-expanded on multi-select trigger', () => {
		renderWithProviders(
			<ComboboxSimple items={defaultItems} multiple testId="combo" withPortal={false} />
		);
		const trigger = screen.getByTestId('combo');
		expect(trigger).toHaveAttribute('aria-expanded', 'false');

		fireEvent.click(trigger);
		expect(trigger).toHaveAttribute('aria-expanded', 'true');
	});

	it('renders without TooltipProvider when disableTooltipProvider is true', () => {
		const { container } = render(
			<ComboboxSimple
				items={defaultItems}
				disableTooltipProvider
				testId="combo"
				withPortal={false}
			/>
		);
		expect(container.querySelector('[data-testid="combo"]')).toBeInTheDocument();
	});

	it('forwards ref to single-select trigger button', () => {
		const ref = React.createRef<HTMLButtonElement | HTMLDivElement>();
		renderWithProviders(
			<ComboboxSimple ref={ref} items={defaultItems} testId="combo" withPortal={false} />
		);
		expect(ref.current).not.toBeNull();
		expect((ref.current as HTMLElement).tagName).toBe('BUTTON');
	});

	it('forwards ref to multi-select trigger div', () => {
		const ref = React.createRef<HTMLButtonElement | HTMLDivElement>();
		renderWithProviders(
			<ComboboxSimple ref={ref} items={defaultItems} multiple testId="combo" withPortal={false} />
		);
		expect(ref.current).not.toBeNull();
		expect((ref.current as HTMLElement).tagName).toBe('DIV');
	});

	it('multi-select trigger has aria-label for accessibility', () => {
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				multiple
				placeholder="Select items..."
				testId="combo"
				withPortal={false}
			/>
		);
		const trigger = screen.getByTestId('combo');
		expect(trigger).toHaveAttribute('aria-label', 'Select items...');
	});
});
