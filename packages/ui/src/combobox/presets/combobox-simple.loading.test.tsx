import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { TooltipProvider } from '../../tooltip/index.js';
import { ComboboxSimple } from './combobox-simple.js';
import { defaultItems, renderWithProviders, setupMocks } from './combobox-simple.test-utils.js';

setupMocks();

describe('ComboboxSimple loading state', () => {
	it('shows loading indicator when loading is true', () => {
		renderWithProviders(
			<ComboboxSimple items={defaultItems} loading testId="combo" withPortal={false} />
		);

		fireEvent.click(screen.getByTestId('combo'));

		expect(screen.getByText('Loading...')).toBeInTheDocument();
	});

	it('shows custom loading placeholder', () => {
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				loading
				loadingPlaceholder="Fetching options..."
				testId="combo"
				withPortal={false}
			/>
		);

		fireEvent.click(screen.getByTestId('combo'));

		expect(screen.getByText('Fetching options...')).toBeInTheDocument();
	});

	it('shows ReactNode as loading placeholder', () => {
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				loading
				loadingPlaceholder={<span data-testid="custom-loader">Custom loader</span>}
				testId="combo"
				withPortal={false}
			/>
		);

		fireEvent.click(screen.getByTestId('combo'));

		expect(screen.getByTestId('custom-loader')).toBeInTheDocument();
	});

	it('hides items while loading', () => {
		renderWithProviders(
			<ComboboxSimple items={defaultItems} loading testId="combo" withPortal={false} />
		);

		fireEvent.click(screen.getByTestId('combo'));

		expect(screen.queryByRole('option', { name: 'React' })).not.toBeInTheDocument();
	});

	it('shows items after loading completes', () => {
		function LoadingToggle() {
			const [loading, setLoading] = useState(true);
			return (
				<TooltipProvider>
					<ComboboxSimple
						items={defaultItems}
						loading={loading}
						testId="combo"
						withPortal={false}
					/>
					<button onClick={() => setLoading(false)}>Done Loading</button>
				</TooltipProvider>
			);
		}

		render(<LoadingToggle />);

		fireEvent.click(screen.getByTestId('combo'));
		expect(screen.getByText('Loading...')).toBeInTheDocument();

		fireEvent.click(screen.getByText('Done Loading'));

		expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
		expect(screen.getByRole('option', { name: 'React' })).toBeInTheDocument();
	});

	it('does not show create option while loading', () => {
		renderWithProviders(
			<ComboboxSimple items={defaultItems} loading allowCreate testId="combo" withPortal={false} />
		);

		fireEvent.click(screen.getByTestId('combo'));
		const input = screen.getByRole('combobox');
		fireEvent.change(input, { target: { value: 'new-item' } });

		expect(screen.queryByText(/Create/)).not.toBeInTheDocument();
	});

	it('shows loading in multi-select mode', () => {
		renderWithProviders(
			<ComboboxSimple items={defaultItems} multiple loading testId="combo" withPortal={false} />
		);

		fireEvent.click(screen.getByTestId('combo'));

		expect(screen.getByText('Loading...')).toBeInTheDocument();
	});

	it('shows loading in virtualized mode', () => {
		const largeItems = Array.from({ length: 100 }, (_, i) => ({
			value: `item-${i}`,
			label: `Item ${i}`,
		}));

		renderWithProviders(
			<ComboboxSimple items={largeItems} virtualized loading testId="combo" withPortal={false} />
		);

		fireEvent.click(screen.getByTestId('combo'));

		expect(screen.getByText('Loading...')).toBeInTheDocument();
	});

	it('does not call onChange while loading', () => {
		const onChange = vi.fn();
		renderWithProviders(
			<ComboboxSimple
				items={defaultItems}
				loading
				onChange={onChange}
				testId="combo"
				withPortal={false}
			/>
		);

		fireEvent.click(screen.getByTestId('combo'));

		expect(onChange).not.toHaveBeenCalled();
	});
});
