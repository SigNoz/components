import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { toast, Toaster } from '../../toast/index.js';
import { ACTIONS, CommandHarness, renderOpenCommand, searchField } from './command.test-utils.js';

function isOnTop(element: Element): boolean {
	const { left, top, width, height } = element.getBoundingClientRect();

	return element.contains(document.elementFromPoint(left + width / 2, top + height / 2));
}

function addStyle(css: string): HTMLStyleElement {
	const style = document.createElement('style');
	style.textContent = css;
	document.head.append(style);

	return style;
}

afterEach(() => {
	ACTIONS.members.mockClear();
});

describe('Command stacking', () => {
	it('puts the backdrop and the panel in one layer', async () => {
		await renderOpenCommand();
		const layer = document.querySelector('[data-slot="command-layer"]');

		expect(layer).toContainElement(screen.getByTestId('command'));
		expect(layer).toContainElement(document.querySelector('[data-slot="command-backdrop"]'));
	});

	// The SigNoz app lifts every library dialog with these rules. A palette built on that dialog
	// had its overlay lifted over its panel, and a click on a row closed it instead.
	it('keeps the rows clickable under the rules an app writes for the dialog slots', async () => {
		const rules = addStyle(`
			[data-slot='dialog-overlay'] { z-index: 1000 !important; }
			[data-slot='dialog-content'] { z-index: 1001 !important; }
		`);
		await renderOpenCommand();
		const row = screen.getByRole('option', { name: 'Members' });

		expect(isOnTop(row)).toBe(true);

		await userEvent.click(row);
		rules.remove();

		expect(ACTIONS.members).toHaveBeenCalledOnce();
	});

	it('stacks above the layer it opens from, such as a modal from another library', async () => {
		render(
			<div style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
				<CommandHarness />
			</div>,
		);

		await userEvent.click(screen.getByRole('button', { name: 'Open palette' }));
		await waitFor(() => {
			expect(searchField()).toHaveFocus();
		});
		const row = screen.getByRole('option', { name: 'Members' });

		expect(isOnTop(row)).toBe(true);

		await userEvent.click(row);

		expect(ACTIONS.members).toHaveBeenCalledOnce();
	});

	it('moves the backdrop and the panel together with --command-z-index', async () => {
		const root = document.documentElement.style;
		root.setProperty('--command-z-index', '1001');
		render(<div data-testid="chrome" style={{ position: 'fixed', inset: 0, zIndex: 1000 }} />);
		await renderOpenCommand();

		const backdrop = document.querySelector('[data-slot="command-backdrop"]');

		expect(document.elementFromPoint(1, 1)).toBe(backdrop);
		expect(isOnTop(screen.getByRole('option', { name: 'Members' }))).toBe(true);
		root.removeProperty('--command-z-index');
	});
});

describe('Command with a toast over it', () => {
	afterEach(() => {
		act(() => toast.dismiss());
	});

	it('stays open when a toast button is pressed', async () => {
		const onOpenChange = vi.fn();
		render(<Toaster />);
		await renderOpenCommand({ onOpenChange });

		act(() => {
			toast.danger('Could not copy the link', { action: { label: 'Close' } });
		});
		const action = await vi.waitFor(() => {
			const element = document.querySelector<HTMLElement>('[data-slot="toast-action"]');
			expect(element).not.toBeNull();

			return element as HTMLElement;
		});

		await userEvent.click(action);

		await vi.waitFor(() => expect(document.querySelector('[data-slot="toast"]')).toBeNull());
		expect(onOpenChange).not.toHaveBeenCalled();
		expect(screen.getByRole('dialog')).toBeInTheDocument();
	});
});
