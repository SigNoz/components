import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Popover } from '../popover.js';
import { CONTENT_TEXT, openPopover, renderPopover } from './popover.test-utils.js';

describe('Popover rendering', () => {
	it('renders the trigger as the element it was given, with the testId on it', () => {
		renderPopover();

		const trigger = screen.getByRole('button', { name: 'Open' });
		expect(trigger).toBe(screen.getByTestId('popover'));
		expect(trigger.tagName).toBe('BUTTON');
		expect(trigger.querySelector('button')).toBeNull();
		expect(trigger).toHaveAttribute('data-slot', 'popover-trigger');
	});

	it('puts nothing in the DOM before the first open', () => {
		renderPopover();

		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
		expect(document.querySelector('[data-slot="popover-popup"]')).toBeNull();
	});

	it('renders the content in the popup once open, named from the testId', async () => {
		renderPopover();
		const popup = await openPopover();

		expect(popup).toHaveTextContent(CONTENT_TEXT);
		expect(popup).toBe(screen.getByTestId('popover-popup'));
		expect(popup).toHaveAttribute('data-slot', 'popover-popup');
		expect(popup.closest('[data-slot="popover-positioner"]')).not.toBeNull();
	});

	it('forwards aria-*, data-* and id to the popup, not the trigger', async () => {
		renderPopover({ 'aria-label': 'Saved views', 'data-origin': 'widget', id: 'views-popup' });
		const popup = await openPopover();

		expect(popup).toHaveAttribute('aria-label', 'Saved views');
		expect(popup).toHaveAttribute('data-origin', 'widget');
		expect(popup).toHaveAttribute('id', 'views-popup');

		const trigger = screen.getByRole('button', { name: 'Open' });
		expect(trigger).not.toHaveAttribute('aria-label', 'Saved views');
		expect(trigger).not.toHaveAttribute('data-origin');
	});

	it('keeps data-slot on the popup against a data-slot from the call site', async () => {
		renderPopover({ 'data-slot': 'mine' });
		const popup = await openPopover();

		expect(popup).toHaveAttribute('data-slot', 'popover-popup');
	});

	it('renders the trigger alone when the content renders nothing', () => {
		render(
			<Popover
				nativeButton
				side="bottom"
				align="start"
				trigger={<button type="button">Open</button>}
				testId="popover"
			>
				{null}
			</Popover>,
		);

		const trigger = screen.getByRole('button', { name: 'Open' });
		expect(trigger).not.toHaveAttribute('aria-haspopup');
		expect(trigger).not.toHaveAttribute('data-slot');
	});

	it('treats a fragment of empty strings as no content', () => {
		render(
			<Popover
				nativeButton
				side="bottom"
				align="start"
				trigger={<button type="button">Open</button>}
			>
				{''}
			</Popover>,
		);

		expect(screen.getByRole('button', { name: 'Open' })).not.toHaveAttribute('aria-haspopup');
	});

	it('marks the trigger as a dialog opener', async () => {
		renderPopover();
		const trigger = screen.getByRole('button', { name: 'Open' });

		expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
		expect(trigger).toHaveAttribute('aria-expanded', 'false');

		await openPopover();
		expect(trigger).toHaveAttribute('aria-expanded', 'true');
	});
});
