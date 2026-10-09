import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { SelectItemType } from '../types.js';

export const FRAMEWORKS: SelectItemType[] = [
	{ type: 'item', value: 'react', label: 'React' },
	{ type: 'item', value: 'vue', label: 'Vue' },
	{ type: 'item', value: 'angular', label: 'Angular' },
	{ type: 'item', value: 'svelte', label: 'Svelte' },
];

/**
 * Opens the popup by clicking the trigger and hands back the listbox. The popup is portalled to
 * `document.body`, so it is never inside the render container.
 */
export async function openSelect(name = 'Framework'): Promise<HTMLElement> {
	await userEvent.click(screen.getByRole('combobox', { name }));

	return screen.findByRole('listbox');
}
