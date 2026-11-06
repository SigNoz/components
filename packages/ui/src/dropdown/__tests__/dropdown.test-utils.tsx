import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { page } from 'vitest/browser';

/**
 * Opens the menu by clicking its trigger, and hands back the popup.
 *
 * The popup is portalled to `document.body`, so it is never inside the render container.
 *
 * The page is made 1024px wide first: below 640px `Kbd` draws nothing, and a row's shortcut would
 * be missing from its description.
 */
export async function openDropdown(triggerName = 'Actions'): Promise<HTMLElement> {
	await page.viewport(1024, 768);
	await userEvent.click(screen.getByRole('button', { name: triggerName }));

	return await screen.findByRole('menu');
}
