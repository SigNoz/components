import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TooltipProvider } from '../../tooltip/index.js';
import { ComboboxSimple } from './combobox-simple.js';
import { defaultItems, renderWithProviders, setupMocks } from './combobox-simple.test-utils.js';

setupMocks();

describe('ComboboxSimple loading state', () => {
	it('shows loading indicator when loading is true', () => {
		renderWithProviders(
			<ComboboxSimple items={defaultItems} loading testId="combo" withPortal={false} />,
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
			/>,
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
			/>,
		);

		fireEvent.click(screen.getByTestId('combo'));

		expect(screen.getByTestId('custom-loader')).toBeInTheDocument();
	});

	it('hides items while loading', () => {
		renderWithProviders(
			<ComboboxSimple items={defaultItems} loading testId="combo" withPortal={false} />,
		);

		fireEvent.click(screen.getByTestId('combo'));

		expect(screen.queryByRole('option', { name: 'React' })).not.toBeInTheDocument();
	});

	it('shows items after loading completes', () => {
		// The loading flag is flipped by re-rendering rather than by clicking a
		// button outside the popover: an outside press dismisses the popover, so
		// that would assert the dismissal rather than the loading transition.
		function LoadingToggle({ loading }: { loading: boolean }) {
			return (
				<TooltipProvider>
					<ComboboxSimple
						items={defaultItems}
						loading={loading}
						testId="combo"
						withPortal={false}
					/>
				</TooltipProvider>
			);
		}

		const { rerender } = render(<LoadingToggle loading />);

		fireEvent.click(screen.getByTestId('combo'));
		expect(screen.getByText('Loading...')).toBeInTheDocument();

		rerender(<LoadingToggle loading={false} />);

		expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
		expect(screen.getByRole('option', { name: 'React' })).toBeInTheDocument();
	});

	it('does not show create option while loading', () => {
		renderWithProviders(
			<ComboboxSimple items={defaultItems} loading allowCreate testId="combo" withPortal={false} />,
		);

		fireEvent.click(screen.getByTestId('combo'));
		const input = screen.getByRole('combobox');
		fireEvent.change(input, { target: { value: 'new-item' } });

		expect(screen.queryByText(/Create/)).not.toBeInTheDocument();
	});

	it('shows loading in multi-select mode', () => {
		renderWithProviders(
			<ComboboxSimple items={defaultItems} multiple loading testId="combo" withPortal={false} />,
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
			<ComboboxSimple items={largeItems} virtualized loading testId="combo" withPortal={false} />,
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
			/>,
		);

		fireEvent.click(screen.getByTestId('combo'));

		expect(onChange).not.toHaveBeenCalled();
	});
});
