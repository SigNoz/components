import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRef, useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { userEvent as browserUser } from 'vitest/browser';
import { Dropdown } from '../../dropdown/index.js';
import { Dialog } from '../dialog.js';
import {
	DialogHarness,
	openFromButton,
	opener,
	renderOpenDialog,
	waitForClosed,
} from './dialog.test-utils.js';

const focused: Element[] = [];

function remember(event: FocusEvent): void {
	if (event.target instanceof Element) {
		focused.push(event.target);
	}
}

beforeEach(() => {
	focused.length = 0;
	document.addEventListener('focusin', remember);
});

afterEach(() => {
	document.removeEventListener('focusin', remember);
});

function everFocused(element: Element): boolean {
	return focused.includes(element);
}

describe('Dialog initial focus', () => {
	it('focuses the panel, not the first field of the body, so the title is read first', async () => {
		await renderOpenDialog({
			children: (
				<>
					<p>Intro</p>
					<input aria-label="First" />
					<input aria-label="Second" />
				</>
			),
		});

		await waitFor(() => {
			expect(screen.getByRole('dialog')).toHaveFocus();
		});
		expect(everFocused(screen.getByRole('textbox', { name: 'First' }))).toBe(false);
	});

	it('focuses the panel when the dialog is opened from a button', async () => {
		render(<DialogHarness />);

		await userEvent.click(screen.getByRole('button', { name: 'Open dialog' }));

		await waitFor(() => {
			expect(screen.getByRole('dialog')).toHaveFocus();
		});
	});

	it('never moves the focus through the close button on the way', async () => {
		await renderOpenDialog();
		await waitFor(() => {
			expect(screen.getByRole('dialog')).toHaveFocus();
		});

		expect(everFocused(screen.getByRole('button', { name: 'Close' }))).toBe(false);
	});

	it('reaches the close button, then the body, with Tab from the panel', async () => {
		await renderOpenDialog();
		await waitFor(() => {
			expect(screen.getByRole('dialog')).toHaveFocus();
		});

		await userEvent.tab();
		expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();

		await userEvent.tab();
		expect(screen.getByRole('textbox', { name: 'Name' })).toHaveFocus();
	});

	it('focuses the element an initialFocus ref names, and goes back to the opener on close', async () => {
		function PicksSecond() {
			const second = useRef<HTMLInputElement>(null);

			return (
				<DialogHarness initialFocus={second}>
					<input aria-label="First" />
					<input aria-label="Second" ref={second} />
				</DialogHarness>
			);
		}
		render(<PicksSecond />);
		await openFromButton();

		await waitFor(() => {
			expect(screen.getByRole('textbox', { name: 'Second' })).toHaveFocus();
		});
		expect(everFocused(screen.getByRole('textbox', { name: 'First' }))).toBe(false);
		expect(everFocused(screen.getByRole('button', { name: 'Close' }))).toBe(false);

		await userEvent.keyboard('{Escape}');
		await waitForClosed();

		expect(opener()).toHaveFocus();
	});

	it('takes the focus from an element on the page', async () => {
		render(
			<>
				<input aria-label="Page field" />
				<DialogHarness />
			</>,
		);
		screen.getByRole('textbox', { name: 'Page field' }).focus();

		await userEvent.click(screen.getByRole('button', { name: 'Open dialog' }));

		await waitFor(() => {
			expect(screen.getByRole('dialog')).toHaveFocus();
		});
	});

	it('focuses the panel when the body has nothing to focus, so the title is read', async () => {
		await renderOpenDialog({ children: <p>Nothing to press here</p> });

		await waitFor(() => {
			expect(screen.getByRole('dialog')).toHaveFocus();
		});
		expect(everFocused(screen.getByRole('button', { name: 'Close' }))).toBe(false);
	});

	it('does not look in the footer for the initial focus', async () => {
		await renderOpenDialog({
			children: <p>Nothing to press here</p>,
			footerPrefix: <button type="button">Delete view</button>,
			footerSuffix: <button type="button">Save</button>,
		});

		await waitFor(() => {
			expect(screen.getByRole('dialog')).toHaveFocus();
		});
		expect(everFocused(screen.getByRole('button', { name: 'Save' }))).toBe(false);
		expect(everFocused(screen.getByRole('button', { name: 'Delete view' }))).toBe(false);
	});
});

describe('Dialog focus return', () => {
	it('goes to finalFocus when it is set', async () => {
		function ReturnsToSearch() {
			const search = useRef<HTMLInputElement>(null);

			return (
				<>
					<input aria-label="Search" ref={search} />
					<DialogHarness finalFocus={search} />
				</>
			);
		}
		render(<ReturnsToSearch />);
		await openFromButton();

		await userEvent.keyboard('{Escape}');
		await waitForClosed();

		await waitFor(() => {
			expect(screen.getByRole('textbox', { name: 'Search' })).toHaveFocus();
		});
	});

	it.each([
		['Esc', async () => userEvent.keyboard('{Escape}')],
		[
			'the close button',
			async () => userEvent.click(screen.getByRole('button', { name: 'Close' })),
		],
	])('goes back to the opener on %s', async (_name, close) => {
		render(<DialogHarness />);
		await openFromButton();

		await close();
		await waitForClosed();

		expect(opener()).toHaveFocus();
	});

	it('goes back to the opener on a press outside the panel', async () => {
		render(<DialogHarness />);
		await openFromButton();

		await userEvent.click(document.elementFromPoint(2, 2) as Element);
		await waitForClosed();

		expect(opener()).toHaveFocus();
	});

	it('goes back to the element that had the focus when it opened, not to the first button', async () => {
		render(
			<>
				<button type="button">Before</button>
				<DialogHarness />
				<button type="button">After</button>
			</>,
		);
		await openFromButton();

		await userEvent.keyboard('{Escape}');
		await waitForClosed();

		expect(opener()).toHaveFocus();
		expect(screen.getByRole('button', { name: 'Before' })).not.toHaveFocus();
	});

	// The Dropdown closes and returns its focus to the trigger as the dialog opens, so the trigger
	// is what holds the focus when the dialog reads where it came from.
	it('goes back to the Dropdown trigger when a Dialog opens from a Dropdown item', async () => {
		function Menu() {
			const [open, setOpen] = useState(false);

			return (
				<>
					<Dropdown
						nativeButton
						items={[
							{
								type: 'item',
								value: 'rename',
								label: 'Rename',
								onClick: () => setOpen(true),
							},
						]}
					>
						<button type="button">Actions</button>
					</Dropdown>
					<Dialog open={open} onClose={() => setOpen(false)} title="Rename view">
						<input aria-label="Name" />
					</Dialog>
				</>
			);
		}
		render(<Menu />);

		await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
		await userEvent.click(await screen.findByRole('menuitem', { name: 'Rename' }));
		await screen.findByRole('dialog');

		await userEvent.keyboard('{Escape}');
		await waitForClosed();

		await waitFor(() => {
			expect(screen.getByRole('button', { name: 'Actions' })).toHaveFocus();
		});
	});
});

describe('Dialog focus trap', () => {
	function activeSlot(): string | null {
		return (
			document.activeElement?.closest('[data-slot]')?.getAttribute('data-slot') ??
			document.activeElement?.tagName ??
			null
		);
	}

	it('loops Tab and Shift+Tab through the panel, header button first', async () => {
		await renderOpenDialog({
			footerSuffix: (
				<>
					<button type="button">Cancel</button>
					<button type="button">Save</button>
				</>
			),
		});
		await waitFor(() => {
			expect(screen.getByRole('dialog')).toHaveFocus();
		});
		const names: string[] = [];

		for (let step = 0; step < 5; step += 1) {
			await browserUser.tab();
			await waitFor(() => {
				expect(screen.getByRole('dialog').contains(document.activeElement)).toBe(true);
			});
			names.push(
				document.activeElement?.getAttribute('aria-label') ??
					document.activeElement?.textContent ??
					'',
			);
		}

		expect(names).toEqual(['Close', 'Name', 'Cancel', 'Save', 'Close']);

		await browserUser.tab({ shift: true });

		await waitFor(() => {
			expect(screen.getByRole('button', { name: 'Save' })).toHaveFocus();
		});
	});

	it('reaches the footerPrefix before the footerSuffix with Tab', async () => {
		await renderOpenDialog({
			footerPrefix: <button type="button">Delete view</button>,
			footerSuffix: (
				<>
					<button type="button">Cancel</button>
					<button type="button">Save</button>
				</>
			),
		});
		await waitFor(() => {
			expect(screen.getByRole('dialog')).toHaveFocus();
		});
		const names: string[] = [];

		for (let step = 0; step < 5; step += 1) {
			await browserUser.tab();
			await waitFor(() => {
				expect(screen.getByRole('dialog').contains(document.activeElement)).toBe(true);
			});
			names.push(
				document.activeElement?.getAttribute('aria-label') ??
					document.activeElement?.textContent ??
					'',
			);
		}

		expect(names).toEqual(['Close', 'Name', 'Delete view', 'Cancel', 'Save']);
	});

	it('never leaves the panel however many times Tab is pressed', async () => {
		await renderOpenDialog();

		for (let step = 0; step < 8; step += 1) {
			await browserUser.tab();
			expect(screen.getByRole('dialog').contains(document.activeElement)).toBe(true);
		}
		for (let step = 0; step < 8; step += 1) {
			await browserUser.tab({ shift: true });
			expect(screen.getByRole('dialog').contains(document.activeElement)).toBe(true);
		}
		expect(activeSlot()).not.toBeNull();
	});

	it('keeps the focus on the panel when it is the only thing to focus and Tab is pressed', async () => {
		await renderOpenDialog({ children: <p>Nothing to press here</p> });

		for (let step = 0; step < 4; step += 1) {
			await browserUser.tab();
			expect(screen.getByRole('dialog').contains(document.activeElement)).toBe(true);
		}
	});

	it('hides everything outside the panel from assistive technology', async () => {
		render(
			<>
				<button type="button">Page button</button>
				<DialogHarness defaultOpen />
			</>,
		);
		await screen.findByRole('dialog');

		expect(screen.queryByRole('button', { name: 'Page button' })).toBeNull();
		expect(screen.queryByRole('button', { name: 'Open dialog' })).toBeNull();
		expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
	});

	it('gives the page back to assistive technology on close', async () => {
		render(
			<>
				<button type="button">Page button</button>
				<DialogHarness />
			</>,
		);
		await openFromButton();

		await userEvent.keyboard('{Escape}');
		await waitForClosed();

		expect(screen.getByRole('button', { name: 'Page button' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Open dialog' })).toBeInTheDocument();
	});

	it('locks the scroll of the page while it is open and unlocks it on close', async () => {
		render(
			<>
				<div style={{ height: '300vh' }} />
				<DialogHarness />
			</>,
		);
		const scrolls = (): boolean =>
			[document.documentElement, document.body].every(
				(element) => getComputedStyle(element).overflowY !== 'hidden',
			);

		expect(scrolls()).toBe(true);

		await openFromButton();

		expect(scrolls()).toBe(false);

		await userEvent.keyboard('{Escape}');
		await waitForClosed();

		await waitFor(() => {
			expect(scrolls()).toBe(true);
		});
	});
});

describe('Dialog keys', () => {
	it('adds no Enter handler: a form in the body submits through its own button in the footer', async () => {
		const onSubmit = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
		const onClose = vi.fn();
		await renderOpenDialog({
			onClose,
			children: (
				<form id="rename" onSubmit={onSubmit}>
					<input aria-label="Name" />
				</form>
			),
			footerSuffix: (
				<button type="submit" form="rename">
					Save
				</button>
			),
		});
		await waitFor(() => {
			expect(screen.getByRole('dialog')).toHaveFocus();
		});
		screen.getByRole('textbox', { name: 'Name' }).focus();

		await userEvent.keyboard('{Enter}');

		expect(onSubmit).toHaveBeenCalledOnce();
		expect(onClose).not.toHaveBeenCalled();
		expect(screen.getByRole('dialog')).toBeInTheDocument();
	});

	it('presses the focused footer button on Enter and on Space, and nothing else', async () => {
		const onClick = vi.fn();
		const onClose = vi.fn();
		await renderOpenDialog({
			onClose,
			footerSuffix: (
				<button type="button" onClick={onClick}>
					Save
				</button>
			),
		});
		screen.getByRole('button', { name: 'Save' }).focus();

		await userEvent.keyboard('{Enter}');
		await userEvent.keyboard(' ');

		expect(onClick).toHaveBeenCalledTimes(2);
		expect(onClose).not.toHaveBeenCalled();
	});

	it('presses the close button on Enter and on Space', async () => {
		const onClose = vi.fn();
		await renderOpenDialog({ onClose, closes: false });
		screen.getByRole('button', { name: 'Close' }).focus();

		await userEvent.keyboard('{Enter}');
		await userEvent.keyboard(' ');

		expect(onClose).toHaveBeenCalledTimes(2);
		expect(onClose).toHaveBeenCalledWith('close-press');
	});
});
