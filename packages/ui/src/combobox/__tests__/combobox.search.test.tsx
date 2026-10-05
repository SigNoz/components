import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Combobox } from '../index.js';
import type { ComboboxItemType } from '../types.js';
import { FRAMEWORKS, openCombobox, searchInput } from './combobox.test-utils.js';

function optionNames(): string[] {
	return screen.getAllByRole('option').map((option) => option.textContent ?? '');
}

afterEach(() => {
	vi.restoreAllMocks();
});

describe('Combobox search', () => {
	it('filters on a substring of the label, case insensitive', async () => {
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={FRAMEWORKS}
			/>,
		);
		await openCombobox();

		await userEvent.keyboard('VEL');

		expect(optionNames()).toEqual(['Svelte']);
	});

	it('does not fuzzy match', async () => {
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={FRAMEWORKS}
			/>,
		);
		await openCombobox();

		await userEvent.keyboard('rct');

		expect(screen.queryAllByRole('option')).toHaveLength(0);
	});

	it('ignores accents', async () => {
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={[{ type: 'item', value: 'cafe', label: 'Café' }]}
			/>,
		);
		await openCombobox();

		await userEvent.keyboard('cafe');

		expect(optionNames()).toEqual(['Café']);
	});

	it('matches the value, the displayValue and the searchMetadata', async () => {
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={[
					{ type: 'item', value: 'asia-south1', label: 'Mumbai' },
					{ type: 'item', value: '25', label: 'Auto', displayValue: 'twenty five' },
					{ type: 'item', value: '15', label: '15 minutes', searchMetadata: 'quarter hour' },
				]}
			/>,
		);
		await openCombobox();

		await userEvent.keyboard('south');
		expect(optionNames()).toEqual(['Mumbai']);

		await userEvent.clear(searchInput());
		await userEvent.keyboard('twenty');
		expect(optionNames()).toEqual(['Auto']);

		await userEvent.clear(searchInput());
		await userEvent.keyboard('quarter');
		expect(optionNames()).toEqual(['15 minutes']);
	});

	it('reads the text of a node label', async () => {
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={[
					{
						type: 'item',
						value: 'react',
						label: (
							<>
								<span>icon</span> React
							</>
						),
					},
				]}
			/>,
		);
		await openCombobox();

		await userEvent.keyboard('react');

		expect(screen.getAllByRole('option')).toHaveLength(1);
	});

	it('shows the empty row when nothing matches, named after noContent', async () => {
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={FRAMEWORKS}
				noContent="Nothing here"
				testId="cb"
			/>,
		);
		await openCombobox();

		await userEvent.keyboard('zzz');

		expect(screen.getByTestId('cb-empty')).toHaveTextContent('Nothing here');
	});

	it('warns on an empty items, unless noContent is set', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
		const { rerender } = render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={[]}
			/>,
		);

		expect(warn).toHaveBeenCalledWith('Combobox: `items` is empty, showing the empty row.');

		warn.mockClear();
		rerender(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={[]}
				noContent="No services yet"
			/>,
		);

		expect(warn).not.toHaveBeenCalled();
	});

	it('does not warn on an empty items with allowCreate, where every value is typed', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				multiple
				allowCreate
				aria-label="Tags"
				items={[]}
			/>,
		);

		expect(warn).not.toHaveBeenCalled();
	});

	it('reports the query and, with filter off, keeps every row', async () => {
		const onSearch = vi.fn();
		render(
			<Combobox
				placeholder="Select a framework..."
				aria-label="Framework"
				items={FRAMEWORKS}
				searchInputProps={{ placeholder: 'Find one', filter: false, onChange: onSearch }}
			/>,
		);
		await userEvent.click(screen.getByRole('combobox', { name: 'Framework' }));
		const field = await screen.findByRole('combobox', { name: 'Find one' });
		await waitFor(() => {
			expect(field).toHaveFocus();
		});

		await userEvent.keyboard('zz');

		expect(onSearch).toHaveBeenLastCalledWith('zz');
		expect(screen.getAllByRole('option')).toHaveLength(FRAMEWORKS.length);
	});

	it('clears the query on close and reports it as an empty string', async () => {
		const onSearch = vi.fn();
		render(
			<Combobox
				placeholder="Select a framework..."
				aria-label="Framework"
				items={FRAMEWORKS}
				searchInputProps={{ placeholder: 'Search', onChange: onSearch }}
			/>,
		);
		await openCombobox();

		await userEvent.keyboard('vu');
		await userEvent.keyboard('{Escape}');

		await waitFor(() => {
			expect(onSearch).toHaveBeenLastCalledWith('');
		});

		await openCombobox();
		expect(searchInput()).toHaveValue('');
	});

	it('swaps the search glyph for a spinner while the search is loading', async () => {
		render(
			<Combobox
				placeholder="Select a framework..."
				aria-label="Framework"
				items={FRAMEWORKS}
				searchInputProps={{ placeholder: 'Search', loading: true }}
				testId="cb"
			/>,
		);
		await openCombobox();

		const prefix = screen.getByTestId('cb-search-prefix');

		expect(prefix).toHaveAttribute('data-loading');
		expect(prefix.querySelector('[data-slot="spinner"]')).not.toBeNull();
		expect(screen.getAllByRole('option')).toHaveLength(FRAMEWORKS.length);
	});
});

describe('Combobox create', () => {
	it('adds a create row for a query that matches no value, and selects it', async () => {
		const onChange = vi.fn();
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={FRAMEWORKS}
				allowCreate
				onChange={onChange}
				testId="cb"
			/>,
		);
		await openCombobox();

		await userEvent.keyboard('solid ');
		const create = screen.getByTestId('cb-create');

		expect(create).toHaveTextContent('Create "solid"');
		expect(screen.getAllByRole('option')[0]).toBe(create);

		await userEvent.click(create);

		expect(onChange).toHaveBeenCalledWith('solid');
		await waitFor(() => {
			expect(screen.getByRole('combobox', { name: 'Framework' })).toHaveTextContent('solid');
		});
	});

	it('creates from the keyboard, since the first row is highlighted while typing', async () => {
		const onChange = vi.fn();
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				multiple
				aria-label="Framework"
				items={[]}
				allowCreate
				onChange={onChange}
			/>,
		);
		await openCombobox();

		await userEvent.keyboard('backend{Enter}');

		expect(onChange).toHaveBeenLastCalledWith(['backend']);
		expect(screen.getByRole('listbox')).toBeInTheDocument();
	});

	it('has no create row for the value of a row, a selected value or a blank query', async () => {
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				multiple
				aria-label="Framework"
				items={FRAMEWORKS}
				defaultValue={['solid']}
				allowCreate
				testId="cb"
			/>,
		);
		await openCombobox();

		await userEvent.keyboard('vue');
		expect(screen.queryByTestId('cb-create')).toBeNull();

		await userEvent.clear(searchInput());
		await userEvent.keyboard('solid');
		expect(screen.queryByTestId('cb-create')).toBeNull();

		await userEvent.clear(searchInput());
		await userEvent.keyboard('   ');
		expect(screen.queryByTestId('cb-create')).toBeNull();
	});

	it('has no create row for the value of a row or of a selected one in another case, hints included', async () => {
		render(
			<Combobox
				placeholder="Select a filter..."
				searchInputProps={{ placeholder: 'Search' }}
				multiple
				aria-label="Framework"
				items={[
					...FRAMEWORKS,
					{ type: 'hint', value: 'status', label: 'status:', insertValue: 'status:' },
				]}
				defaultValue={['Solid']}
				allowCreate
				testId="cb"
			/>,
		);
		await openCombobox();

		await userEvent.keyboard('VUE');
		expect(screen.queryByTestId('cb-create')).toBeNull();

		await userEvent.clear(searchInput());
		await userEvent.keyboard('solid');
		expect(screen.queryByTestId('cb-create')).toBeNull();

		await userEvent.clear(searchInput());
		await userEvent.keyboard('Status');
		expect(screen.queryByTestId('cb-create')).toBeNull();

		await userEvent.clear(searchInput());
		await userEvent.keyboard('vu');
		expect(screen.getByTestId('cb-create')).toBeInTheDocument();
	});

	it('renders the label from a function', async () => {
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={FRAMEWORKS}
				allowCreate={(query) => `Add tag ${query}`}
				testId="cb"
			/>,
		);
		await openCombobox();

		await userEvent.keyboard('infra');

		expect(screen.getByTestId('cb-create')).toHaveTextContent('Add tag infra');
	});

	it('keeps a created value under Custom, where it can be unselected', async () => {
		function Tags() {
			const [tags, setTags] = useState<string[]>(['infra']);

			return (
				<Combobox
					placeholder="Select a framework..."
					searchInputProps={{ placeholder: 'Search' }}
					multiple
					aria-label="Framework"
					items={FRAMEWORKS}
					allowCreate
					value={tags}
					onChange={setTags}
					testId="cb"
				/>
			);
		}

		render(<Tags />);
		await openCombobox();

		await userEvent.click(screen.getByTestId('cb-custom-infra'));

		expect(screen.queryByTestId('cb-chip-infra')).toBeNull();
	});
});

describe('Combobox hints', () => {
	const ITEMS: ComboboxItemType[] = [
		{ type: 'hint', value: 'status', label: 'status:', insertValue: 'status:' },
		{ type: 'item', value: 'status:active', label: 'Status: Active' },
		{ type: 'item', value: 'status:closed', label: 'Status: Closed' },
	];

	it('writes insertValue into the search row and keeps the popup open', async () => {
		const onChange = vi.fn();
		const onSearch = vi.fn();
		render(
			<Combobox
				placeholder="Select a framework..."
				aria-label="Framework"
				items={ITEMS}
				onChange={onChange}
				searchInputProps={{ placeholder: 'Search', onChange: onSearch }}
				testId="cb"
			/>,
		);
		await openCombobox();

		await userEvent.click(screen.getByTestId('cb-hint-status'));

		expect(searchInput()).toHaveValue('status:');
		expect(onSearch).toHaveBeenLastCalledWith('status:');
		expect(onChange).not.toHaveBeenCalled();
		expect(screen.getByRole('listbox')).toBeInTheDocument();
	});

	it('hides the hints once the query starts with one', async () => {
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={ITEMS}
				testId="cb"
			/>,
		);
		await openCombobox();

		expect(screen.getByTestId('cb-hint-status')).toBeInTheDocument();

		await userEvent.keyboard('status:a');

		expect(screen.queryByTestId('cb-hint-status')).toBeNull();
		expect(optionNames()).toEqual(['Status: Active']);
	});

	it('hides the hints whatever the case of the query and its leading spaces', async () => {
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={ITEMS}
				testId="cb"
			/>,
		);
		await openCombobox();

		// The hint itself matches this query, so only the hint rule can hide it.
		await userEvent.keyboard('  STATUS:');

		expect(screen.queryByTestId('cb-hint-status')).toBeNull();
		expect(optionNames()).toEqual(['Status: Active', 'Status: Closed']);
	});

	it('does not insert a hint from a letter typed on the closed trigger', async () => {
		const onChange = vi.fn();
		const onSearch = vi.fn();
		render(
			<Combobox
				placeholder="Select a framework..."
				aria-label="Framework"
				items={ITEMS}
				onChange={onChange}
				searchInputProps={{ placeholder: 'Search', onChange: onSearch }}
				testId="cb"
			/>,
		);
		screen.getByRole('combobox', { name: 'Framework' }).focus();

		await userEvent.keyboard('s');

		expect(onSearch).not.toHaveBeenCalled();
		expect(onChange).not.toHaveBeenCalled();

		await openCombobox();

		expect(searchInput()).toHaveValue('');
	});

	it('inserts from the keyboard', async () => {
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={ITEMS}
			/>,
		);
		await openCombobox();

		await userEvent.keyboard('stat{Enter}');

		expect(searchInput()).toHaveValue('status:');
	});
});
