import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRef, useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { userEvent as browserUser } from 'vitest/browser';
import { opener } from '../../dialog/__tests__/dialog.test-utils.js';
import { Dropdown } from '../../dropdown/index.js';
import { AlertDialog } from '../index.js';
import {
	AlertHarness,
	cancelButton,
	confirmButton,
	openFromButton,
	renderOpenAlert,
	waitForClosed,
} from './alert-dialog.test-utils.js';

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

const panel = () => screen.getByRole('alertdialog');

describe('AlertDialog initial focus', () => {
	it('focuses the panel, so the title and the body are read first', async () => {
		await renderOpenAlert();

		await waitFor(() => {
			expect(panel()).toHaveFocus();
		});
	});

	it('focuses the panel when it is opened from a button', async () => {
		render(<AlertHarness />);

		await userEvent.click(screen.getByRole('button', { name: 'Open dialog' }));

		await waitFor(() => {
			expect(panel()).toHaveFocus();
		});
	});

	it('never focuses a button on the way', async () => {
		await renderOpenAlert();
		await waitFor(() => {
			expect(panel()).toHaveFocus();
		});

		expect(everFocused(confirmButton())).toBe(false);
		expect(everFocused(cancelButton())).toBe(false);
	});

	it('focuses the panel when the body holds a focusable element', async () => {
		await renderOpenAlert({ children: <a href="#details">More detail</a> });

		await waitFor(() => {
			expect(panel()).toHaveFocus();
		});
		expect(everFocused(screen.getByRole('link', { name: 'More detail' }))).toBe(false);
	});

	it('reaches the cancel button first with Tab from the panel', async () => {
		await renderOpenAlert();
		await waitFor(() => {
			expect(panel()).toHaveFocus();
		});

		await browserUser.tab();

		await waitFor(() => {
			expect(cancelButton()).toHaveFocus();
		});
	});
});

describe('AlertDialog initialFocus and finalFocus', () => {
	function Redirected() {
		const fieldRef = useRef<HTMLInputElement | null>(null);
		const tableRef = useRef<HTMLDivElement | null>(null);

		return (
			<>
				<div ref={tableRef} tabIndex={-1} aria-label="Views" role="grid" />
				<AlertHarness initialFocus={fieldRef} finalFocus={tableRef}>
					<input ref={fieldRef} aria-label="Type the view name" />
				</AlertHarness>
			</>
		);
	}

	it('focuses the element initialFocus points to instead of the panel', async () => {
		render(<Redirected />);

		await userEvent.click(opener());

		await waitFor(() => {
			expect(screen.getByRole('textbox', { name: 'Type the view name' })).toHaveFocus();
		});
		expect(panel()).not.toHaveFocus();
	});

	it('sends the focus where finalFocus points on close, not back to the opener', async () => {
		render(<Redirected />);
		await userEvent.click(opener());
		await waitFor(() => {
			expect(screen.getByRole('textbox', { name: 'Type the view name' })).toHaveFocus();
		});

		await userEvent.keyboard('{Escape}');
		await waitForClosed();

		expect(screen.getByRole('grid', { name: 'Views' })).toHaveFocus();
		expect(opener()).not.toHaveFocus();
	});
});

describe('AlertDialog focus return', () => {
	it.each([
		['Esc', async () => userEvent.keyboard('{Escape}')],
		['the cancel button', async () => userEvent.click(cancelButton())],
	])('goes back to the opener on %s', async (_name, close) => {
		render(<AlertHarness />);
		await openFromButton();

		await close();
		await waitForClosed();

		expect(opener()).toHaveFocus();
	});

	it('goes back to the element that had the focus when it opened, not to the first button', async () => {
		render(
			<>
				<button type="button">Before</button>
				<AlertHarness />
				<button type="button">After</button>
			</>,
		);
		await openFromButton();

		await userEvent.keyboard('{Escape}');
		await waitForClosed();

		expect(opener()).toHaveFocus();
		expect(screen.getByRole('button', { name: 'Before' })).not.toHaveFocus();
	});

	it('goes back to the opener once the consumer closes it after a confirm', async () => {
		function Harness() {
			const [open, setOpen] = useState(false);

			return (
				<>
					<button type="button" onClick={() => setOpen(true)}>
						Open dialog
					</button>
					<AlertDialog
						open={open}
						title="Delete this view?"
						color="danger"
						confirmText="Delete view"
						onConfirm={() => setOpen(false)}
						onCancel={() => setOpen(false)}
					>
						Gone for good.
					</AlertDialog>
				</>
			);
		}
		render(<Harness />);
		await openFromButton();

		await userEvent.click(confirmButton());
		await waitForClosed();

		expect(opener()).toHaveFocus();
	});

	// The Dropdown closes and returns its focus to the trigger as the alert opens, so the trigger
	// is what holds the focus when the alert reads where it came from.
	it('goes back to the Dropdown trigger when an AlertDialog opens from a Dropdown item', async () => {
		function Menu() {
			const [open, setOpen] = useState(false);

			return (
				<>
					<Dropdown
						nativeButton
						side="bottom"
						align="start"
						items={[
							{
								type: 'item',
								value: 'delete',
								label: 'Delete',
								onClick: () => setOpen(true),
							},
						]}
					>
						<button type="button">Actions</button>
					</Dropdown>
					<AlertDialog
						open={open}
						title="Delete this view?"
						color="danger"
						confirmText="Delete view"
						onConfirm={() => {}}
						onCancel={() => setOpen(false)}
					>
						Gone for good.
					</AlertDialog>
				</>
			);
		}
		render(<Menu />);

		await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
		await userEvent.click(await screen.findByRole('menuitem', { name: 'Delete' }));
		await screen.findByRole('alertdialog');

		await userEvent.keyboard('{Escape}');
		await waitForClosed();

		await waitFor(() => {
			expect(screen.getByRole('button', { name: 'Actions' })).toHaveFocus();
		});
	});
});

describe('AlertDialog focus trap', () => {
	it('loops Tab between the two buttons', async () => {
		await renderOpenAlert();
		await waitFor(() => {
			expect(panel()).toHaveFocus();
		});
		cancelButton().focus();

		await browserUser.tab();
		await waitFor(() => {
			expect(confirmButton()).toHaveFocus();
		});

		await browserUser.tab();
		await waitFor(() => {
			expect(cancelButton()).toHaveFocus();
		});

		await browserUser.tab({ shift: true });
		await waitFor(() => {
			expect(confirmButton()).toHaveFocus();
		});
	});

	it('never leaves the panel however many times Tab is pressed', async () => {
		await renderOpenAlert();

		for (let step = 0; step < 8; step += 1) {
			await browserUser.tab();
			expect(screen.getByRole('alertdialog').contains(document.activeElement)).toBe(true);
		}
		for (let step = 0; step < 8; step += 1) {
			await browserUser.tab({ shift: true });
			expect(screen.getByRole('alertdialog').contains(document.activeElement)).toBe(true);
		}
	});

	it('goes through the body, then the two buttons, from the panel', async () => {
		await renderOpenAlert({ children: <input aria-label="Reason" /> });
		await waitFor(() => {
			expect(panel()).toHaveFocus();
		});
		const names: string[] = [];

		for (let step = 0; step < 4; step += 1) {
			await browserUser.tab();
			await waitFor(() => {
				expect(screen.getByRole('alertdialog').contains(document.activeElement)).toBe(true);
			});
			names.push(
				document.activeElement?.getAttribute('aria-label') ??
					document.activeElement?.textContent ??
					'',
			);
		}

		expect(names).toEqual(['Reason', 'Cancel', 'Delete view', 'Reason']);
	});

	it('hides everything outside an alert from assistive technology', async () => {
		render(
			<>
				<button type="button">Page button</button>
				<AlertHarness defaultOpen />
			</>,
		);
		await screen.findByRole('alertdialog');

		expect(screen.queryByRole('button', { name: 'Page button' })).toBeNull();
		expect(screen.queryByRole('button', { name: 'Open dialog' })).toBeNull();
		expect(cancelButton()).toBeInTheDocument();
		expect(confirmButton()).toBeInTheDocument();
	});

	it('gives the page back to assistive technology on close', async () => {
		render(
			<>
				<button type="button">Page button</button>
				<AlertHarness />
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
				<AlertHarness />
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

describe('AlertDialog keys', () => {
	it('presses the focused confirm button on Enter and on Space, and nothing else', async () => {
		const onConfirm = vi.fn();
		const onCancel = vi.fn();
		await renderOpenAlert({ onConfirm, onCancel });
		confirmButton().focus();

		await userEvent.keyboard('{Enter}');
		await userEvent.keyboard(' ');

		expect(onConfirm).toHaveBeenCalledTimes(2);
		expect(onCancel).not.toHaveBeenCalled();
	});

	it('presses the focused cancel button on Enter and on Space', async () => {
		const onConfirm = vi.fn();
		const onCancel = vi.fn();
		await renderOpenAlert({ onConfirm, onCancel, closesOnCancel: false });
		cancelButton().focus();

		await userEvent.keyboard('{Enter}');
		await userEvent.keyboard(' ');

		expect(onCancel).toHaveBeenCalledTimes(2);
		expect(onConfirm).not.toHaveBeenCalled();
	});

	it('answers nothing on a press of Enter or Space on the opening focus', async () => {
		const onConfirm = vi.fn();
		const onCancel = vi.fn();
		await renderOpenAlert({ onConfirm, onCancel, closesOnCancel: false });
		await waitFor(() => {
			expect(panel()).toHaveFocus();
		});

		await userEvent.keyboard('{Enter}');
		await userEvent.keyboard(' ');

		expect(onCancel).not.toHaveBeenCalled();
		expect(onConfirm).not.toHaveBeenCalled();
		expect(panel()).toBeInTheDocument();
	});
});
