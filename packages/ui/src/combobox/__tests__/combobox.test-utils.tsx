import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'vitest';
import type { ComboboxItemType } from '../types.js';

export const FRAMEWORKS: ComboboxItemType[] = [
	{ type: 'item', value: 'react', label: 'React' },
	{ type: 'item', value: 'vue', label: 'Vue' },
	{ type: 'item', value: 'angular', label: 'Angular' },
	{ type: 'item', value: 'svelte', label: 'Svelte' },
];

export function searchInput(): HTMLElement {
	return screen.getByRole('combobox', { name: 'Search' });
}

/**
 * Opens the popup by clicking the trigger, waits for the search row to take the focus, and hands
 * back the listbox. The popup is portalled to `document.body`, so it is never inside the render
 * container.
 */
export async function openCombobox(name = 'Framework'): Promise<HTMLElement> {
	await userEvent.click(screen.getByRole('combobox', { name }));
	const listbox = await screen.findByRole('listbox');

	await waitFor(() => {
		expect(searchInput()).toHaveFocus();
	});

	return listbox;
}
