import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ForceOpenProvider } from '../../testing/index.js';
import { Combobox } from '../index.js';
import { FRAMEWORKS, openCombobox, searchInput } from './combobox.test-utils.js';

function trigger(): HTMLElement {
	return screen.getByRole('combobox', { name: 'Framework' });
}

describe('Combobox keyboard', () => {
	it.each(['{Enter}', ' ', '{ArrowDown}'])(
		'opens on %s and moves the focus to the search row',
		async (key) => {
			render(
				<Combobox
					placeholder="Select a framework..."
					searchInputProps={{ placeholder: 'Search' }}
					aria-label="Framework"
					items={FRAMEWORKS}
				/>,
			);
			trigger().focus();

			await userEvent.keyboard(key);

			await screen.findByRole('listbox');
			await waitFor(() => {
				expect(searchInput()).toHaveFocus();
			});
			expect(trigger()).toHaveAttribute('aria-expanded', 'true');
		},
	);

	it('walks the rows with the arrow keys and picks with Enter', async () => {
		const onChange = vi.fn();
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={FRAMEWORKS}
				onChange={onChange}
			/>,
		);
		await openCombobox();

		await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');

		expect(onChange).toHaveBeenCalledWith('vue');
	});

	it('highlights the first match while typing, so Enter picks it', async () => {
		const onChange = vi.fn();
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={FRAMEWORKS}
				onChange={onChange}
			/>,
		);
		await openCombobox();

		await userEvent.keyboard('an');

		expect(screen.getByRole('option', { name: 'Angular' })).toHaveAttribute('data-highlighted');

		await userEvent.keyboard('{Enter}');

		expect(onChange).toHaveBeenCalledWith('angular');
	});

	it('closes on Escape and gives the focus back to the trigger', async () => {
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={FRAMEWORKS}
			/>,
		);
		await openCombobox();

		await userEvent.keyboard('{Escape}');

		await waitFor(() => {
			expect(screen.queryByRole('listbox')).toBeNull();
		});
		expect(trigger()).toHaveFocus();
	});

	it('keeps the value on Escape over a closed combobox', async () => {
		const onChange = vi.fn();
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={FRAMEWORKS}
				defaultValue="vue"
				onChange={onChange}
			/>,
		);
		trigger().focus();

		await userEvent.keyboard('{Escape}');

		expect(onChange).not.toHaveBeenCalled();
		expect(trigger()).toHaveTextContent('Vue');
	});

	it('clears on Delete and Backspace with allowClear, and only with it', async () => {
		const onChange = vi.fn();
		const { rerender } = render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={FRAMEWORKS}
				defaultValue="vue"
				onChange={onChange}
			/>,
		);
		trigger().focus();
		await userEvent.keyboard('{Delete}');

		expect(onChange).not.toHaveBeenCalled();

		rerender(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={FRAMEWORKS}
				defaultValue="vue"
				onChange={onChange}
				allowClear
			/>,
		);
		trigger().focus();
		await userEvent.keyboard('{Backspace}');

		expect(onChange).toHaveBeenCalledWith(undefined);
	});
});

describe('Combobox clear button', () => {
	it('clears a single value', async () => {
		const onChange = vi.fn();
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={FRAMEWORKS}
				defaultValue="vue"
				onChange={onChange}
				allowClear
				testId="cb"
			/>,
		);

		await userEvent.click(screen.getByTestId('cb-clear'));

		expect(onChange).toHaveBeenCalledWith(undefined);
		expect(trigger()).toHaveTextContent('Select a framework...');
		expect(screen.queryByRole('listbox')).toBeNull();
	});

	it('clears every value of a multiple combobox', async () => {
		const onChange = vi.fn();
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				multiple
				aria-label="Framework"
				items={FRAMEWORKS}
				defaultValue={['vue', 'react']}
				onChange={onChange}
				allowClear
				testId="cb"
			/>,
		);

		const clear = screen.getByTestId('cb-clear');

		expect(clear).toHaveAttribute('aria-label', 'Clear selection');

		await userEvent.click(clear);

		expect(onChange).toHaveBeenCalledWith([]);
	});

	it('is not rendered without a value, or while loading', () => {
		const { rerender } = render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={FRAMEWORKS}
				allowClear
				testId="cb"
			/>,
		);

		expect(screen.queryByTestId('cb-clear')).toBeNull();

		rerender(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={FRAMEWORKS}
				allowClear
				defaultValue="vue"
				loading
				testId="cb"
			/>,
		);

		expect(screen.queryByTestId('cb-clear')).toBeNull();
	});
});

describe('Combobox disabled and readOnly', () => {
	it('does not open while disabled, and keeps the trigger focusable', async () => {
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={FRAMEWORKS}
				disabled
				disabledTooltip="Pick a project first"
			/>,
		);

		await userEvent.click(trigger());

		expect(screen.queryByRole('listbox')).toBeNull();
		expect(trigger()).toHaveAttribute('aria-disabled', 'true');
		expect(trigger()).not.toBeDisabled();
		expect(trigger()).toHaveFocus();
	});

	it('shows the disabled reason on hover', async () => {
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={FRAMEWORKS}
				disabled
				disabledTooltip="Pick a project first"
			/>,
		);

		await userEvent.hover(trigger());

		expect(await screen.findByText('Pick a project first')).toBeInTheDocument();
	});

	it('does not open while readOnly, and shows its reason', async () => {
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={FRAMEWORKS}
				defaultValue="vue"
				readOnly
				readOnlyTooltip="Managed by the admin"
			/>,
		);

		await userEvent.click(trigger());

		expect(screen.queryByRole('listbox')).toBeNull();
		expect(trigger()).toHaveAttribute('aria-readonly', 'true');

		await userEvent.hover(trigger());

		expect(await screen.findByText('Managed by the admin')).toBeInTheDocument();
	});

	it('shows only the disabled reason when both are set', async () => {
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={FRAMEWORKS}
				disabled
				disabledTooltip="Disabled reason"
				readOnly
				readOnlyTooltip="Read-only reason"
			/>,
		);

		await userEvent.hover(trigger());

		expect(await screen.findByText('Disabled reason')).toBeInTheDocument();
		expect(screen.queryByText('Read-only reason')).toBeNull();
	});

	it('hides the chip remove buttons and the clear button', () => {
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				multiple
				aria-label="Framework"
				items={FRAMEWORKS}
				defaultValue={['vue']}
				allowClear
				readOnly
				readOnlyTooltip={undefined}
				testId="cb"
			/>,
		);

		expect(screen.queryByTestId('cb-chip-vue-remove')).toBeNull();
		expect(screen.queryByTestId('cb-clear')).toBeNull();
	});

	it('keeps its value when a letter is typed on a disabled trigger', async () => {
		const onChange = vi.fn();
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={FRAMEWORKS}
				virtualized
				disabled
				disabledTooltip="Pick a project first"
				onChange={onChange}
			/>,
		);
		trigger().focus();

		await userEvent.keyboard('v');

		expect(onChange).not.toHaveBeenCalled();
		expect(trigger()).not.toHaveTextContent('Vue');
	});

	it('closes when it turns disabled while open, and stays closed once it turns back', async () => {
		function renderWith(disabled: boolean): ReactElement {
			return (
				<Combobox
					placeholder="Select a framework..."
					searchInputProps={{ placeholder: 'Search' }}
					aria-label="Framework"
					items={FRAMEWORKS}
					disabled={disabled}
					disabledTooltip="Pick a project first"
				/>
			);
		}

		const { rerender } = render(renderWith(false));
		await openCombobox();

		rerender(renderWith(true));

		await waitFor(() => {
			expect(screen.queryByRole('listbox')).toBeNull();
		});

		rerender(renderWith(false));

		expect(screen.queryByRole('listbox')).toBeNull();
	});
});

describe('Combobox loading', () => {
	it('swaps the chevron for a spinner and the rows for loadingContent', async () => {
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={FRAMEWORKS}
				loading
				loadingContent="Fetching..."
				testId="cb"
			/>,
		);

		expect(trigger().querySelector('[data-slot="combobox-spinner"]')).not.toBeNull();

		await openCombobox();

		expect(screen.getByTestId('cb-loading')).toHaveTextContent('Fetching...');
		expect(screen.queryAllByRole('option')).toHaveLength(0);
	});
});

describe('Combobox footer action', () => {
	it('runs the action and closes the popup', async () => {
		const onClick = vi.fn();
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={FRAMEWORKS}
				footerAction={{ label: 'Create a model', onClick }}
				testId="cb"
			/>,
		);
		await openCombobox();

		await userEvent.click(screen.getByTestId('cb-footer-action'));

		expect(onClick).toHaveBeenCalledTimes(1);
		await waitFor(() => {
			expect(screen.queryByRole('listbox')).toBeNull();
		});
	});

	it('is reached with Tab from the search row', async () => {
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={FRAMEWORKS}
				footerAction={{ label: 'Create a model', onClick: vi.fn() }}
			/>,
		);
		await openCombobox();

		await userEvent.tab();

		expect(screen.getByRole('button', { name: 'Create a model' })).toHaveFocus();
		expect(screen.getByRole('listbox')).toBeInTheDocument();
	});
});

describe('Combobox under ForceOpenProvider', () => {
	it('holds the popup open whatever the user does', async () => {
		const onChange = vi.fn();
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={FRAMEWORKS}
				onChange={onChange}
			/>,
			{ wrapper: ForceOpenProvider },
		);

		await screen.findByRole('listbox');
		await userEvent.click(screen.getByRole('option', { name: 'Vue' }));
		await userEvent.keyboard('{Escape}');
		await userEvent.click(document.body);

		expect(onChange).toHaveBeenCalledWith('vue');
		expect(screen.getByRole('listbox')).toBeInTheDocument();
	});

	it('leaves a disabled or read-only combobox closed', () => {
		render(
			<>
				<Combobox
					placeholder="Select a framework..."
					searchInputProps={{ placeholder: 'Search' }}
					aria-label="Disabled"
					items={FRAMEWORKS}
					disabled
					disabledTooltip="No access"
				/>
				<Combobox
					placeholder="Select a framework..."
					searchInputProps={{ placeholder: 'Search' }}
					aria-label="Read-only"
					items={FRAMEWORKS}
					readOnly
					readOnlyTooltip="Locked"
				/>
			</>,
			{ wrapper: ForceOpenProvider },
		);

		expect(screen.queryByRole('listbox')).toBeNull();
	});
});
