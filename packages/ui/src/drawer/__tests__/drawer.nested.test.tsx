import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ReactNode, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { userEvent as browserUser } from 'vitest/browser';
import { AlertDialog } from '../../alert-dialog/index.js';
import { waitForSettled as waitForDialogSettled } from '../../dialog/__tests__/dialog.test-utils.js';
import { Dialog } from '../../dialog/dialog.js';
import type { DialogCloseReasonType } from '../../dialog/types.js';
import { Drawer } from '../drawer.js';
import type { DrawerCloseReasonType, DrawerTypeType } from '../types.js';
import {
	drawerPanel,
	OPENER_NAME,
	opener,
	openFromButton,
	slot,
	slots,
	waitForClosed,
	waitForSettled,
} from './drawer.test-utils.js';

function centerOf(element: Element): { x: number; y: number } {
	const { left, top, width, height } = element.getBoundingClientRect();

	return { x: left + width / 2, y: top + height / 2 };
}

interface GuardedFormProps {
	onDrawerClose?: (reason: DrawerCloseReasonType) => void;
}

/**
 * An edit form in a task drawer that asks "Discard changes?" before it closes with unsaved edits:
 * `onClose` and the Cancel button open a nested `AlertDialog` instead of closing.
 */
function GuardedForm({ onDrawerClose }: GuardedFormProps): ReactNode {
	const [open, setOpen] = useState(false);
	const [confirming, setConfirming] = useState(false);
	const [name, setName] = useState('');
	const close = (): void => {
		setOpen(false);
		setName('');
	};
	const requestClose = (): void => {
		if (name === '') {
			close();
		} else {
			setConfirming(true);
		}
	};

	return (
		<>
			<button type="button" onClick={() => setOpen(true)}>
				{OPENER_NAME}
			</button>
			<Drawer
				type="task"
				open={open}
				onClose={(reason) => {
					onDrawerClose?.(reason);
					requestClose();
				}}
				title="Edit member"
				testId="drawer"
				footerSuffix={
					<>
						<button type="button" onClick={requestClose}>
							Cancel
						</button>
						<button type="submit" form="edit-member">
							Save changes
						</button>
					</>
				}
			>
				<form id="edit-member" onSubmit={(event) => event.preventDefault()}>
					<input aria-label="Name" value={name} onChange={(event) => setName(event.target.value)} />
				</form>
				<AlertDialog
					open={confirming}
					title="Discard changes?"
					color="danger"
					confirmText="Discard"
					cancelText="Keep editing"
					testId="discard"
					onConfirm={() => {
						setConfirming(false);
						close();
					}}
					onCancel={() => setConfirming(false)}
				>
					The edits to this member are lost.
				</AlertDialog>
			</Drawer>
		</>
	);
}

async function renderDirtyForm(props: GuardedFormProps = {}): Promise<void> {
	render(<GuardedForm {...props} />);
	await openFromButton();
	await userEvent.type(screen.getByRole('textbox', { name: 'Name' }), 'Ada');
}

async function waitForGuard(): Promise<HTMLElement> {
	const guard = await waitFor(() => {
		const element = screen.getByRole('alertdialog', { name: 'Discard changes?' });

		expect(element.contains(document.activeElement)).toBe(true);

		return element;
	});
	await waitForDialogSettled();

	return guard;
}

async function waitForGuardClosed(): Promise<void> {
	await waitFor(() => {
		expect(slot('alert-dialog-popup')).toBeNull();
	});
}

const CLOSE_REQUESTS: Array<[name: string, request: () => Promise<void>]> = [
	[
		'Esc',
		async () => {
			await userEvent.keyboard('{Escape}');
		},
	],
	['a press on the backdrop', async () => userEvent.click(screen.getByTestId('drawer-backdrop'))],
	['the close button', async () => userEvent.click(screen.getByRole('button', { name: 'Close' }))],
	[
		'the Cancel button',
		async () => userEvent.click(screen.getByRole('button', { name: 'Cancel' })),
	],
];

describe('Drawer with an AlertDialog that guards its close', () => {
	it('closes at once when the form has no edits', async () => {
		render(<GuardedForm />);
		await openFromButton();

		await userEvent.keyboard('{Escape}');
		await waitForClosed();

		expect(screen.queryByRole('alertdialog')).toBeNull();
		expect(opener()).toHaveFocus();
	});

	it.each(CLOSE_REQUESTS)(
		'asks before it closes with unsaved edits on %s, and stays open',
		async (_name, request) => {
			await renderDirtyForm();

			await request();
			const guard = await waitForGuard();

			expect(guard).toHaveTextContent('The edits to this member are lost.');
			expect(drawerPanel()).toHaveAttribute('data-open');
			expect(screen.getByRole('textbox', { name: 'Name', hidden: true })).toHaveValue('Ada');
		},
	);

	it.each(CLOSE_REQUESTS)(
		'goes back to the form on Keep editing after %s, with the edits and the focus in the drawer',
		async (_name, request) => {
			await renderDirtyForm();
			await request();
			await waitForGuard();

			await userEvent.click(screen.getByRole('button', { name: 'Keep editing' }));
			await waitForGuardClosed();

			expect(drawerPanel()).toHaveAttribute('data-open');
			expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('Ada');
			await waitFor(() => {
				expect(drawerPanel().contains(document.activeElement)).toBe(true);
			});
		},
	);

	it('gives the focus back to the field that had it when Esc asked to close', async () => {
		await renderDirtyForm();
		await userEvent.keyboard('{Escape}');
		await waitForGuard();

		await userEvent.click(screen.getByRole('button', { name: 'Keep editing' }));
		await waitForGuardClosed();

		await waitFor(() => {
			expect(screen.getByRole('textbox', { name: 'Name' })).toHaveFocus();
		});
	});

	it('treats Esc on the question as Keep editing, and leaves the drawer open', async () => {
		const onDrawerClose = vi.fn();
		await renderDirtyForm({ onDrawerClose });
		await userEvent.click(screen.getByRole('button', { name: 'Close' }));
		await waitForGuard();

		await userEvent.keyboard('{Escape}');
		await waitForGuardClosed();

		expect(onDrawerClose).toHaveBeenCalledExactlyOnceWith('close-press');
		expect(drawerPanel()).toHaveAttribute('data-open');
		expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('Ada');
	});

	it('ignores a press outside the question, and does not pass it to the drawer', async () => {
		const onDrawerClose = vi.fn();
		await renderDirtyForm({ onDrawerClose });
		await userEvent.click(screen.getByRole('button', { name: 'Close' }));
		await waitForGuard();

		await userEvent.click(document.elementFromPoint(2, 2) as Element);

		expect(onDrawerClose).toHaveBeenCalledExactlyOnceWith('close-press');
		expect(screen.getByRole('alertdialog', { name: 'Discard changes?' })).toBeInTheDocument();
		expect(drawerPanel()).toHaveAttribute('data-open');
	});

	it.each(CLOSE_REQUESTS)(
		'closes the question and the drawer on Discard after %s, and gives the focus back to the page',
		async (_name, request) => {
			await renderDirtyForm();
			await request();
			await waitForGuard();

			await userEvent.click(screen.getByRole('button', { name: 'Discard' }));
			await waitForClosed();
			await waitForGuardClosed();

			expect(screen.queryByRole('dialog', { hidden: true })).toBeNull();
			expect(screen.queryByRole('alertdialog', { hidden: true })).toBeNull();
			await waitFor(() => {
				expect(opener()).toHaveFocus();
			});
		},
	);

	it('opens again with a clean form after the edits were discarded', async () => {
		await renderDirtyForm();
		await userEvent.keyboard('{Escape}');
		await waitForGuard();
		await userEvent.click(screen.getByRole('button', { name: 'Discard' }));
		await waitForClosed();

		await openFromButton();

		expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('');
		expect(screen.queryByRole('alertdialog')).toBeNull();
	});

	it('stacks the question above the drawer, with the drawer backdrop as the only one', async () => {
		await renderDirtyForm();
		await userEvent.keyboard('{Escape}');
		const guard = await waitForGuard();
		const { x, y } = centerOf(guard);

		expect(guard.contains(document.elementFromPoint(x, y))).toBe(true);
		expect(document.querySelectorAll('[data-slot$="backdrop"]')).toHaveLength(1);
		expect(slots('drawer-backdrop')).toHaveLength(1);
	});
});

interface NestedHarnessProps {
	type?: DrawerTypeType;
	onDrawerClose?: (reason: DrawerCloseReasonType) => void;
	onDialogClose?: (reason: DialogCloseReasonType) => void;
	/**
	 * Both close on every reason, the way a consumer does. `false` leaves them open.
	 */
	closes?: boolean;
}

/**
 * A drawer with a button in its body that opens a `Dialog` declared next to it.
 */
function NestedHarness({
	type = 'task',
	onDrawerClose,
	onDialogClose,
	closes = true,
}: NestedHarnessProps): ReactNode {
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [dialogOpen, setDialogOpen] = useState(false);

	return (
		<>
			<button type="button" onClick={() => setDrawerOpen(true)}>
				{OPENER_NAME}
			</button>
			<Drawer
				type={type}
				open={drawerOpen}
				onClose={(reason) => {
					onDrawerClose?.(reason);
					if (closes) {
						setDrawerOpen(false);
					}
				}}
				title="Edit member"
				testId="drawer"
			>
				<input aria-label="Drawer field" />
				<button type="button" onClick={() => setDialogOpen(true)}>
					Open child
				</button>
				<Dialog
					open={dialogOpen}
					onClose={(reason) => {
						onDialogClose?.(reason);
						if (closes) {
							setDialogOpen(false);
						}
					}}
					title="Rename view"
					testId="child"
					width="narrow"
				>
					<input aria-label="Child field" />
				</Dialog>
			</Drawer>
		</>
	);
}

async function renderNested(props: NestedHarnessProps = {}): Promise<void> {
	render(<NestedHarness {...props} />);
	await openFromButton();
}

async function openChild(): Promise<HTMLElement> {
	await userEvent.click(screen.getByRole('button', { name: 'Open child' }));

	const panel = await waitFor(() => {
		const element = screen.getByRole('dialog', { name: 'Rename view' });

		expect(element.contains(document.activeElement)).toBe(true);

		return element;
	});
	await waitForDialogSettled();

	return panel;
}

async function waitForChildClosed(): Promise<void> {
	await waitFor(() => {
		expect(screen.queryByTestId('child')).toBeNull();
	});
}

describe('Drawer with a Dialog nested in it', () => {
	it('renders the dialog above the drawer, which stays rendered', async () => {
		await renderNested();

		const panel = await openChild();

		expect(drawerPanel()).toHaveAttribute('data-open');
		expect(screen.getByRole('textbox', { name: 'Drawer field', hidden: true })).toBeInTheDocument();
		expect(slots('dialog-layer')).toHaveLength(1);
		expect(within(panel).getByRole('textbox', { name: 'Child field' })).toBeInTheDocument();
	});

	it.each<DrawerTypeType>(['task', 'inspector'])(
		'hides a %s from assistive technology while the dialog is open, and shows it again after',
		async (type) => {
			await renderNested({ type });

			await openChild();

			expect(screen.queryByRole('dialog', { name: 'Edit member' })).toBeNull();
			expect(screen.queryByRole('textbox', { name: 'Drawer field' })).toBeNull();
			expect(slot('drawer-layer')).toHaveAttribute('aria-hidden', 'true');
			expect(screen.getByRole('dialog', { name: 'Rename view' })).toBeInTheDocument();

			await userEvent.keyboard('{Escape}');
			await waitForChildClosed();

			expect(screen.getByRole('dialog', { name: 'Edit member' })).toBeInTheDocument();
			expect(slot('drawer-layer')).not.toHaveAttribute('aria-hidden');
		},
	);

	it.each<DrawerTypeType>(['task', 'inspector'])(
		'paints the dialog over the fields of a %s, so a press cannot reach them',
		async (type) => {
			await renderNested({ type });
			const panel = await openChild();
			const { x, y } = centerOf(
				screen.getByRole('textbox', { name: 'Drawer field', hidden: true }),
			);

			expect(drawerPanel().contains(document.elementFromPoint(x, y))).toBe(false);
			expect(
				panel.closest('[data-slot="dialog-layer"]')?.contains(document.elementFromPoint(x, y)),
			).toBe(true);
		},
	);

	it.each<DrawerTypeType>(['task', 'inspector'])(
		'traps the focus in the dialog over a %s however many times Tab is pressed',
		async (type) => {
			await renderNested({ type });
			const panel = await openChild();

			for (let step = 0; step < 6; step += 1) {
				await browserUser.tab();
				expect(panel.contains(document.activeElement)).toBe(true);
			}
			for (let step = 0; step < 6; step += 1) {
				await browserUser.tab({ shift: true });
				expect(panel.contains(document.activeElement)).toBe(true);
			}
		},
	);

	it.each([
		[
			'Esc',
			async () => {
				await userEvent.keyboard('{Escape}');
			},
		],
		['its close button', async () => userEvent.click(screen.getByTestId('child-close'))],
	])(
		'gives the focus back to the button in the drawer that opened it on %s',
		async (_name, close) => {
			await renderNested();
			await openChild();

			await close();
			await waitForChildClosed();

			await waitFor(() => {
				expect(screen.getByRole('button', { name: 'Open child' })).toHaveFocus();
			});
			expect(drawerPanel()).toHaveAttribute('data-open');
		},
	);

	it('closes only the dialog on Esc, then the drawer on the next', async () => {
		const onDrawerClose = vi.fn();
		const onDialogClose = vi.fn();
		await renderNested({ onDrawerClose, onDialogClose });
		await openChild();

		await userEvent.keyboard('{Escape}');

		expect(onDialogClose).toHaveBeenCalledExactlyOnceWith('escape-key');
		expect(onDrawerClose).not.toHaveBeenCalled();
		await waitForChildClosed();

		await userEvent.keyboard('{Escape}');

		expect(onDrawerClose).toHaveBeenCalledExactlyOnceWith('escape-key');
		await waitForClosed();
	});

	it('does not close the drawer when the dialog stays open on Esc', async () => {
		const onDrawerClose = vi.fn();
		await renderNested({ onDrawerClose, closes: false });
		await openChild();

		await userEvent.keyboard('{Escape}');
		await userEvent.keyboard('{Escape}');

		expect(onDrawerClose).not.toHaveBeenCalled();
		expect(screen.getByRole('dialog', { name: 'Rename view' })).toBeInTheDocument();
	});

	it.each<DrawerTypeType>(['task', 'inspector'])(
		'treats a press outside the dialog as an outside press for the dialog only, over a %s',
		async (type) => {
			const onDrawerClose = vi.fn();
			const onDialogClose = vi.fn();
			await renderNested({ type, onDrawerClose, onDialogClose, closes: false });
			await openChild();

			await userEvent.click(document.elementFromPoint(2, 2) as Element);

			expect(onDrawerClose).not.toHaveBeenCalled();
			expect(onDialogClose).toHaveBeenCalledExactlyOnceWith('outside-press');
		},
	);

	it('keeps the state of the drawer while the dialog opens and closes', async () => {
		await renderNested();
		await userEvent.type(screen.getByRole('textbox', { name: 'Drawer field' }), 'Latency');

		await openChild();
		await userEvent.keyboard('{Escape}');
		await waitForChildClosed();

		expect(screen.getByRole('textbox', { name: 'Drawer field' })).toHaveValue('Latency');
	});

	// Base UI writes `data-nested-drawer-open` on a drawer panel only for a nested `Drawer`, and
	// `data-nested-dialog-open` only on a `Dialog` panel. A dialog over a drawer hides the layer
	// of the drawer instead, which is what to style or assert on.
	it('puts no nested attribute on the drawer panel while the dialog is open', async () => {
		await renderNested();

		await openChild();

		expect(drawerPanel()).not.toHaveAttribute('data-nested-dialog-open');
		expect(drawerPanel()).not.toHaveAttribute('data-nested-drawer-open');
		expect(slot('drawer-layer')).toHaveAttribute('aria-hidden', 'true');
	});

	it('closes the dialog with the drawer, because it is part of its content', async () => {
		const onDialogClose = vi.fn();
		function Harness({ open }: { open: boolean }): ReactNode {
			return (
				<Drawer type="task" open={open} onClose={() => {}} title="Edit member" testId="drawer">
					<Dialog open onClose={onDialogClose} title="Rename view" testId="child">
						Body
					</Dialog>
				</Drawer>
			);
		}
		const { rerender } = render(<Harness open />);
		await screen.findByRole('dialog', { name: 'Rename view' });
		await waitForSettled();

		rerender(<Harness open={false} />);
		await waitForClosed();

		expect(screen.queryByRole('dialog', { hidden: true })).toBeNull();
		expect(slot('dialog-layer')).toBeNull();
		expect(onDialogClose).not.toHaveBeenCalled();
	});

	it('opens again from scratch after the drawer closed', async () => {
		await renderNested();
		await openChild();
		await userEvent.keyboard('{Escape}');
		await waitForChildClosed();
		await userEvent.keyboard('{Escape}');
		await waitForClosed();

		await openFromButton();

		expect(screen.queryByTestId('child')).toBeNull();
		expect(slot('drawer-layer')).not.toHaveAttribute('aria-hidden');
		expect(screen.getByRole('textbox', { name: 'Drawer field' })).toHaveValue('');
	});
});
