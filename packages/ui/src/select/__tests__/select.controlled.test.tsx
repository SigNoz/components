import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Select } from '../select.js';
import { FRAMEWORKS, openSelect } from './select.test-utils.js';

function placeholder(): Element | null {
	return document.querySelector('[data-slot="select-placeholder"]');
}

function value(): Element | null {
	return document.querySelector('[data-slot="select-value"]');
}

function chips(): string[] {
	return [...document.querySelectorAll('[data-slot="select-chip"]')].map(
		(chip) => chip.textContent ?? '',
	);
}

type SingleProps = {
	value?: string;
	defaultValue?: string;
	onChange?: (value: string) => void;
};

// Spreading the props keeps a `value` that is left out apart from one written as `undefined`.
function Single(props: SingleProps) {
	return (
		<Select
			placeholder="Select a framework..."
			aria-label="Framework"
			items={FRAMEWORKS}
			{...props}
		/>
	);
}

type MultipleProps = {
	value?: string[];
	defaultValue?: string[];
	onChange?: (value: string[]) => void;
};

function Multiple(props: MultipleProps) {
	return (
		<Select
			multiple
			placeholder="Select frameworks..."
			aria-label="Framework"
			items={FRAMEWORKS}
			{...props}
		/>
	);
}

afterEach(() => {
	vi.restoreAllMocks();
});

describe('Select value rule, one value', () => {
	it('keeps its own state and starts at defaultValue while value is undefined on the first render', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
		const onChange = vi.fn();
		render(<Single value={undefined} defaultValue="svelte" onChange={onChange} />);

		expect(value()).toHaveTextContent('Svelte');

		const listbox = await openSelect();
		await userEvent.click(within(listbox).getByRole('option', { name: 'Vue' }));

		await waitFor(() => {
			expect(value()).toHaveTextContent('Vue');
		});
		expect(onChange).toHaveBeenCalledExactlyOnceWith('vue');
		expect(warn).not.toHaveBeenCalled();
	});

	it('follows a value that arrives after the first render, with one warning', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
		const { rerender } = render(<Single value={undefined} />);

		expect(placeholder()).not.toBeNull();

		rerender(<Single value="vue" />);
		expect(value()).toHaveTextContent('Vue');

		rerender(<Single value="angular" />);
		expect(value()).toHaveTextContent('Angular');
		expect(warn).toHaveBeenCalledTimes(1);
		expect(warn.mock.calls[0]?.[0]).toContain(
			'Select: `value` was `undefined` on the first render',
		);
	});

	it('stays controlled and empty once value turns undefined or is left out', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
		const onChange = vi.fn();
		const { rerender } = render(<Single value="vue" onChange={onChange} />);

		expect(value()).toHaveTextContent('Vue');

		rerender(<Single onChange={onChange} />);
		expect(placeholder()).not.toBeNull();

		const listbox = await openSelect();
		await userEvent.click(within(listbox).getByRole('option', { name: 'Angular' }));

		await waitFor(() => {
			expect(screen.queryByRole('listbox')).toBeNull();
		});
		expect(onChange).toHaveBeenCalledExactlyOnceWith('angular');
		expect(placeholder()).not.toBeNull();

		rerender(<Single value={undefined} onChange={onChange} />);
		expect(placeholder()).not.toBeNull();
		expect(warn).not.toHaveBeenCalled();
	});

	it('treats null on the first render as controlled and empty, and ignores defaultValue', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
		const onChange = vi.fn();
		render(
			<Select
				nullable
				placeholder="Select a framework..."
				aria-label="Framework"
				items={FRAMEWORKS}
				value={null}
				defaultValue="svelte"
				onChange={onChange}
			/>,
		);

		expect(placeholder()).not.toBeNull();

		const listbox = await openSelect();
		await userEvent.click(within(listbox).getByRole('option', { name: 'Vue' }));

		await waitFor(() => {
			expect(screen.queryByRole('listbox')).toBeNull();
		});
		expect(onChange).toHaveBeenCalledExactlyOnceWith('vue');
		expect(placeholder()).not.toBeNull();
		expect(warn).not.toHaveBeenCalled();
	});
});

describe('Select value rule, several values', () => {
	it('keeps its own state and starts at defaultValue while value is undefined on the first render', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
		const onChange = vi.fn();
		render(<Multiple value={undefined} defaultValue={['react']} onChange={onChange} />);

		expect(chips()).toEqual(['React']);

		const listbox = await openSelect();
		await userEvent.click(within(listbox).getByRole('option', { name: 'Vue' }));

		await waitFor(() => {
			expect(chips()).toEqual(['React', 'Vue']);
		});
		expect(onChange).toHaveBeenCalledExactlyOnceWith(['react', 'vue']);
		expect(warn).not.toHaveBeenCalled();
	});

	it('follows a value that arrives after the first render, with one warning', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
		const { rerender } = render(<Multiple value={undefined} />);

		expect(chips()).toEqual([]);

		rerender(<Multiple value={['vue']} />);
		expect(chips()).toEqual(['Vue']);

		rerender(<Multiple value={['vue', 'angular']} />);
		expect(chips()).toEqual(['Vue', 'Angular']);
		expect(warn).toHaveBeenCalledTimes(1);
		expect(warn.mock.calls[0]?.[0]).toContain(
			'Select: `value` was `undefined` on the first render',
		);
	});

	it('stays controlled and empty once value turns undefined or is left out', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
		const onChange = vi.fn();
		const { rerender } = render(<Multiple value={['vue']} onChange={onChange} />);

		expect(chips()).toEqual(['Vue']);

		rerender(<Multiple onChange={onChange} />);
		expect(chips()).toEqual([]);

		const listbox = await openSelect();
		await userEvent.click(within(listbox).getByRole('option', { name: 'Angular' }));

		expect(onChange).toHaveBeenCalledExactlyOnceWith(['angular']);
		expect(chips()).toEqual([]);

		rerender(<Multiple value={undefined} onChange={onChange} />);
		expect(chips()).toEqual([]);
		expect(warn).not.toHaveBeenCalled();
	});

	it('treats null on the first render as controlled and empty, and ignores defaultValue', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
		const onChange = vi.fn();
		render(
			<Select
				multiple
				nullable
				placeholder="Select frameworks..."
				aria-label="Framework"
				items={FRAMEWORKS}
				value={null}
				defaultValue={['svelte']}
				onChange={onChange}
			/>,
		);

		expect(chips()).toEqual([]);

		const listbox = await openSelect();
		await userEvent.click(within(listbox).getByRole('option', { name: 'Vue' }));

		expect(onChange).toHaveBeenCalledExactlyOnceWith(['vue']);
		expect(chips()).toEqual([]);
		expect(warn).not.toHaveBeenCalled();
	});
});
