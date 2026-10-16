import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentProps, ReactNode } from 'react';
import { Popover } from '../popover.js';

type PopoverCallProps = ComponentProps<typeof Popover>;

export const CONTENT_TEXT = 'Popover content';

export function renderPopover(
	props: Partial<PopoverCallProps> = {},
	content: ReactNode = <p>{CONTENT_TEXT}</p>,
) {
	return render(
		<Popover
			nativeButton
			side="bottom"
			align="start"
			trigger={<button type="button">Open</button>}
			testId="popover"
			{...props}
		>
			{content}
		</Popover>,
	);
}

/**
 * Opens the popover by clicking its trigger, and hands back the popup.
 *
 * The popup is portalled to `document.body`, so it is never inside the render container.
 */
export async function openPopover(triggerName = 'Open'): Promise<HTMLElement> {
	await userEvent.click(screen.getByRole('button', { name: triggerName }));

	return await screen.findByRole('dialog');
}
