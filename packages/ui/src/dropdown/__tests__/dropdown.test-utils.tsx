import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/**
 * Opens the menu by clicking its trigger, and hands back the popup.
 *
 * The popup is portalled to `document.body`, so it is never inside the render container.
 */
export async function openDropdown(triggerName = 'Actions'): Promise<HTMLElement> {
	await userEvent.click(screen.getByRole('button', { name: triggerName }));

	return await screen.findByRole('menu');
}
