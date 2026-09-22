import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { toast } from '../../sonner/sonner.js';
import { DROPDOWN_ACTION_ERROR_MESSAGE } from '../constants.js';
import { Dropdown } from '../index.js';
import type { DropdownItemType } from '../types.js';
import { openDropdown } from './dropdown.test-utils.js';

/** A promise with its settle functions pulled out, so a test can hold the row pending. */
function deferred<T>(): {
	promise: Promise<T>;
	resolve: (value: T) => void;
	reject: (error: unknown) => void;
} {
	let resolve!: (value: T) => void;
	let reject!: (error: unknown) => void;
	const promise = new Promise<T>((resolveFn, rejectFn) => {
		resolve = resolveFn;
		reject = rejectFn;
	});

	return { promise, resolve, reject };
}

function renderDropdown(items: DropdownItemType[]) {
	return render(
		<Dropdown nativeButton side="bottom" align="start" items={items} testId="menu">
			<button type="button">Actions</button>
		</Dropdown>,
	);
}

afterEach(() => {
	vi.restoreAllMocks();
});

describe('Dropdown async actions', () => {
	it('holds the row pending, holds the list inert, and closes on resolve', async () => {
		const gate = deferred<void>();
		renderDropdown([
			{ type: 'item', value: 'archive', label: 'Archive', onClick: () => gate.promise },
			{ type: 'item', value: 'rename', label: 'Rename', onClick: vi.fn() },
		]);
		await openDropdown();

		await userEvent.click(screen.getByRole('menuitem', { name: 'Archive' }));

		await waitFor(() => {
			expect(screen.getByTestId('menu-item-archive')).toHaveAttribute('data-pending', 'true');
		});
		expect(screen.getByTestId('menu-item-archive')).toHaveAttribute('data-loading', 'true');
		expect(screen.getByTestId('menu-item-rename')).toHaveAttribute('aria-disabled', 'true');

		gate.resolve();

		await waitFor(() => {
			expect(screen.queryByRole('menu')).toBeNull();
		});
	});

	it('keeps the menu open and clears the row when the promise resolves false', async () => {
		const gate = deferred<boolean>();
		renderDropdown([
			{ type: 'item', value: 'archive', label: 'Archive', onClick: () => gate.promise },
		]);
		await openDropdown();

		await userEvent.click(screen.getByRole('menuitem', { name: 'Archive' }));
		gate.resolve(false);

		await waitFor(() => {
			expect(screen.getByTestId('menu-item-archive')).not.toHaveAttribute('data-pending');
		});
		expect(screen.getByRole('menu')).toBeInTheDocument();
	});

	it('raises a toast with the rejection message and keeps the menu open', async () => {
		const error = vi.spyOn(toast, 'error').mockImplementation(() => '');
		const gate = deferred<void>();
		renderDropdown([
			{ type: 'item', value: 'archive', label: 'Archive', onClick: () => gate.promise },
		]);
		await openDropdown();

		await userEvent.click(screen.getByRole('menuitem', { name: 'Archive' }));
		gate.reject(new Error('The workspace is read only'));

		await waitFor(() => {
			expect(error).toHaveBeenCalledWith('The workspace is read only');
		});
		expect(screen.getByTestId('menu-item-archive')).not.toHaveAttribute('data-pending');
		expect(screen.getByRole('menu')).toBeInTheDocument();
	});

	it('falls back to a generic message when the rejection is not an Error', async () => {
		const error = vi.spyOn(toast, 'error').mockImplementation(() => '');
		const gate = deferred<void>();
		renderDropdown([
			{ type: 'item', value: 'archive', label: 'Archive', onClick: () => gate.promise },
		]);
		await openDropdown();

		await userEvent.click(screen.getByRole('menuitem', { name: 'Archive' }));
		gate.reject('nope');

		await waitFor(() => {
			expect(error).toHaveBeenCalledWith(DROPDOWN_ACTION_ERROR_MESSAGE);
		});
	});

	it('ignores a second click while the first is still in flight', async () => {
		const gate = deferred<void>();
		const onClick = vi.fn(() => gate.promise);
		renderDropdown([{ type: 'item', value: 'archive', label: 'Archive', onClick }]);
		await openDropdown();

		const row = screen.getByRole('menuitem', { name: 'Archive' });
		await userEvent.click(row);
		await userEvent.click(row);

		expect(onClick).toHaveBeenCalledTimes(1);
		gate.resolve();
	});
	it('leaves a reopened menu alone when an action from the previous opening settles', async () => {
		const gate = deferred<void>();
		renderDropdown([
			{ type: 'item', value: 'archive', label: 'Archive', onClick: () => gate.promise },
		]);
		await openDropdown();

		await userEvent.click(screen.getByRole('menuitem', { name: 'Archive' }));
		await userEvent.keyboard('{Escape}');
		await waitFor(() => {
			expect(screen.queryByRole('menu')).toBeNull();
		});
		await openDropdown();

		gate.resolve();
		await gate.promise;
		await new Promise((resolve) => setTimeout(resolve, 50));

		expect(screen.getByRole('menu')).toBeInTheDocument();
	});

	it('marks only the row that was clicked, when another row shares its value', async () => {
		const gate = deferred<void>();
		renderDropdown([
			{ type: 'item', value: 'delete', label: 'Delete', onClick: () => gate.promise },
			{
				type: 'radio-group',
				name: 'mode',
				items: [{ label: 'Delete mode', value: 'delete', testId: 'radio-delete' }],
			},
		]);
		await openDropdown();

		await userEvent.click(screen.getByRole('menuitem', { name: 'Delete' }));

		await waitFor(() => {
			expect(screen.getByTestId('menu-item-delete')).toHaveAttribute('data-pending', 'true');
		});
		expect(screen.getByTestId('radio-delete')).not.toHaveAttribute('data-loading');
		gate.resolve();
	});

	it('raises a toast and keeps the menu open when the handler throws', async () => {
		const error = vi.spyOn(toast, 'error').mockImplementation(() => '');
		renderDropdown([
			{
				type: 'item',
				value: 'archive',
				label: 'Archive',
				onClick: () => {
					throw new Error('read only');
				},
			},
		]);
		await openDropdown();

		await userEvent.click(screen.getByRole('menuitem', { name: 'Archive' }));

		expect(error).toHaveBeenCalledWith('read only');
		expect(screen.getByRole('menu')).toBeInTheDocument();
	});
});
