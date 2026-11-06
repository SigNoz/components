import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { userEvent as browserUser } from 'vitest/browser';
import { OPENER_NAME, slot, slots } from '../../dialog/__tests__/dialog.test-utils.js';
import { Dialog } from '../../dialog/index.js';
import { AlertDialog } from '../index.js';
import {
	AlertInDialogHarness,
	type AlertInDialogHarnessProps,
	cancelButton,
	DialogOverAlertHarness,
	type DialogOverAlertHarnessProps,
	openChildAlert,
	openDialogOverAlert,
	waitForClosed,
} from './alert-dialog.test-utils.js';

function parentPanel(): HTMLElement {
	return screen.getByRole('dialog', { name: 'Edit view', hidden: true });
}

function centerOf(element: Element): { x: number; y: number } {
	const { left, top, width, height } = element.getBoundingClientRect();

	return { x: left + width / 2, y: top + height / 2 };
}

/**
 * A press on the edge of the parent panel, where a narrow child leaves it uncovered. With a child
 * open, the page paints the child's viewport there, which is what a user presses.
 */
async function pressWhereTheParentIs(): Promise<void> {
	const { left, top, height } = parentPanel().getBoundingClientRect();

	await userEvent.click(document.elementFromPoint(left + 4, top + height / 2) as Element);
}

async function waitForChildClosed(): Promise<void> {
	await waitFor(() => {
		expect(screen.queryByTestId('child')).toBeNull();
	});
}

async function pressBackdrop(): Promise<void> {
	await userEvent.click(document.elementFromPoint(2, 2) as Element);
}

async function renderNested(props: AlertInDialogHarnessProps = {}) {
	render(<AlertInDialogHarness {...props} />);
	await userEvent.click(screen.getByRole('button', { name: OPENER_NAME }));
	await waitFor(() => {
		expect(screen.getByRole('dialog', { name: 'Edit view' }).contains(document.activeElement)).toBe(
			true,
		);
	});
}

describe('AlertDialog nested in a Dialog', () => {
	it('renders the alert above the dialog, which stays rendered', async () => {
		await renderNested();

		const panel = await openChildAlert();

		expect(panel).toBeInTheDocument();
		expect(parentPanel()).toBeInTheDocument();
		expect(parentPanel().isConnected).toBe(true);
		expect(screen.getByRole('textbox', { name: 'Parent field', hidden: true })).toBeInTheDocument();
	});

	it('lets only the alert take input: the dialog is hidden from assistive technology', async () => {
		await renderNested();
		await openChildAlert();

		expect(screen.queryByRole('dialog', { name: 'Edit view' })).toBeNull();
		expect(screen.queryByRole('textbox', { name: 'Parent field' })).toBeNull();
		expect(screen.getByRole('alertdialog', { name: 'Discard changes?' })).toBeInTheDocument();
	});

	it('lets only the alert take input: the page paints the alert over the dialog', async () => {
		await renderNested();
		const panel = await openChildAlert();
		const { x, y } = centerOf(screen.getByRole('textbox', { name: 'Parent field', hidden: true }));

		expect(parentPanel().contains(document.elementFromPoint(x, y))).toBe(false);
		expect(
			panel.closest('[data-slot="alert-dialog-layer"]')?.contains(document.elementFromPoint(x, y)),
		).toBe(true);
	});

	it('traps the focus in the alert however many times Tab is pressed', async () => {
		await renderNested();
		const panel = await openChildAlert();

		for (let step = 0; step < 6; step += 1) {
			await browserUser.tab();
			expect(panel.contains(document.activeElement)).toBe(true);
		}
		for (let step = 0; step < 6; step += 1) {
			await browserUser.tab({ shift: true });
			expect(panel.contains(document.activeElement)).toBe(true);
		}
	});

	it('marks the dialog panel with data-nested-dialog-open while the alert is open', async () => {
		await renderNested();

		expect(parentPanel()).not.toHaveAttribute('data-nested-dialog-open');

		await openChildAlert();

		expect(parentPanel()).toHaveAttribute('data-nested-dialog-open');
		expect(screen.getByRole('alertdialog')).not.toHaveAttribute('data-nested-dialog-open');

		await userEvent.keyboard('{Escape}');
		await waitForChildClosed();
		await waitFor(() => {
			expect(parentPanel()).not.toHaveAttribute('data-nested-dialog-open');
		});
	});

	it('renders one backdrop, the one of the dialog', async () => {
		await renderNested();
		await openChildAlert();

		expect(document.querySelectorAll('[data-slot$="backdrop"]')).toHaveLength(1);
		expect(slots('dialog-backdrop')).toHaveLength(1);
		expect(slots('alert-dialog-backdrop')).toHaveLength(0);
		expect(screen.queryByTestId('child-backdrop')).toBeNull();
	});

	it('closes only the alert on Esc, then the dialog on the next', async () => {
		const onParentClose = vi.fn();
		const onChildCancel = vi.fn();
		await renderNested({ onParentClose, onChildCancel });
		await openChildAlert();

		await userEvent.keyboard('{Escape}');

		expect(onChildCancel).toHaveBeenCalledOnce();
		expect(onParentClose).not.toHaveBeenCalled();

		await waitForChildClosed();
		expect(screen.getByRole('dialog', { name: 'Edit view' })).toBeInTheDocument();

		await userEvent.keyboard('{Escape}');

		expect(onParentClose).toHaveBeenCalledExactlyOnceWith('escape-key');
		await waitForClosed();
	});

	it('closes only the alert on its cancel button', async () => {
		const onParentClose = vi.fn();
		const onChildCancel = vi.fn();
		await renderNested({ onParentClose, onChildCancel });
		await openChildAlert();

		await userEvent.click(cancelButton());
		await waitForChildClosed();

		expect(onChildCancel).toHaveBeenCalledOnce();
		expect(onParentClose).not.toHaveBeenCalled();
		expect(screen.getByRole('dialog', { name: 'Edit view' })).toBeInTheDocument();
	});

	it('does not close the dialog when the alert stays open on Esc', async () => {
		const onParentClose = vi.fn();
		await renderNested({ onParentClose, closes: false });
		await openChildAlert();

		await userEvent.keyboard('{Escape}');
		await userEvent.keyboard('{Escape}');

		expect(onParentClose).not.toHaveBeenCalled();
		expect(screen.getByRole('alertdialog')).toBeInTheDocument();
	});

	it('answers on the alert and not on the dialog when its confirm button is pressed', async () => {
		const onParentClose = vi.fn();
		const onChildConfirm = vi.fn();
		const onChildCancel = vi.fn();
		await renderNested({ onParentClose, onChildConfirm, onChildCancel, closes: false });
		await openChildAlert();

		await userEvent.click(screen.getByRole('button', { name: 'Discard' }));

		expect(onChildConfirm).toHaveBeenCalledOnce();
		expect(onChildCancel).not.toHaveBeenCalled();
		expect(onParentClose).not.toHaveBeenCalled();
		expect(screen.getByRole('alertdialog')).toBeInTheDocument();
	});

	it('does nothing on a press where the dialog panel is', async () => {
		const onParentClose = vi.fn();
		const onChildCancel = vi.fn();
		await renderNested({ onParentClose, onChildCancel, closes: false });
		await openChildAlert();

		await pressWhereTheParentIs();

		expect(onParentClose).not.toHaveBeenCalled();
		expect(onChildCancel).not.toHaveBeenCalled();
		expect(screen.getByRole('alertdialog')).toBeInTheDocument();
	});

	it('does nothing on a press on the backdrop', async () => {
		const onParentClose = vi.fn();
		const onChildCancel = vi.fn();
		await renderNested({ onParentClose, onChildCancel, closes: false });
		await openChildAlert();

		await pressBackdrop();

		expect(onParentClose).not.toHaveBeenCalled();
		expect(onChildCancel).not.toHaveBeenCalled();
	});

	it('leaves both open after a press outside the alert, even when they close on every answer', async () => {
		const onParentClose = vi.fn();
		await renderNested({ onParentClose });
		await openChildAlert();

		await pressBackdrop();

		expect(screen.getByRole('alertdialog')).toBeInTheDocument();
		expect(onParentClose).not.toHaveBeenCalled();
	});

	it('does not treat a press inside the alert as an outside press', async () => {
		const onParentClose = vi.fn();
		const onChildCancel = vi.fn();
		await renderNested({ onParentClose, onChildCancel, closes: false });
		const panel = await openChildAlert();

		await userEvent.click(screen.getByTestId('child-title'));
		await userEvent.click(panel);

		expect(onParentClose).not.toHaveBeenCalled();
		expect(onChildCancel).not.toHaveBeenCalled();
	});

	it('gives the focus back to the element in the dialog that opened the alert', async () => {
		await renderNested();
		await openChildAlert();

		await userEvent.keyboard('{Escape}');
		await waitForChildClosed();

		await waitFor(() => {
			expect(screen.getByRole('button', { name: 'Open child' })).toHaveFocus();
		});
		expect(screen.getByRole('dialog', { name: 'Edit view' })).toBeInTheDocument();
	});

	it('gives the focus back to it when the alert closes from its cancel button', async () => {
		await renderNested();
		await openChildAlert();

		await userEvent.click(cancelButton());
		await waitForChildClosed();

		await waitFor(() => {
			expect(screen.getByRole('button', { name: 'Open child' })).toHaveFocus();
		});
	});

	it('keeps the state of the dialog while the alert opens and closes', async () => {
		await renderNested();
		await userEvent.type(screen.getByRole('textbox', { name: 'Parent field' }), 'Latency');

		await openChildAlert();
		await userEvent.keyboard('{Escape}');
		await waitForChildClosed();

		expect(screen.getByRole('textbox', { name: 'Parent field' })).toHaveValue('Latency');
	});

	it.each(['footer-suffix', 'footer-prefix'] as const)(
		'works when the alert renders in the %s of the dialog',
		async (childIn) => {
			const onParentClose = vi.fn();
			await renderNested({ childIn, onParentClose });

			expect(screen.getByRole('button', { name: 'Open child' }).closest('[data-slot]')).toBe(
				slot(`dialog-${childIn}`),
			);
			await openChildAlert();

			expect(parentPanel()).toHaveAttribute('data-nested-dialog-open');
			expect(document.querySelectorAll('[data-slot$="backdrop"]')).toHaveLength(1);

			await userEvent.keyboard('{Escape}');
			await waitForChildClosed();

			expect(onParentClose).not.toHaveBeenCalled();
			await waitFor(() => {
				expect(screen.getByRole('button', { name: 'Open child' })).toHaveFocus();
			});
		},
	);

	it('closes the alert with the dialog, because it is part of its content', async () => {
		const onChildCancel = vi.fn();
		function Harness({ open }: { open: boolean }) {
			return (
				<Dialog open={open} onClose={() => {}} title="Edit view">
					<AlertDialog
						open
						title="Discard changes?"
						color="danger"
						confirmText="Discard"
						onConfirm={() => {}}
						onCancel={onChildCancel}
					>
						The edits are lost.
					</AlertDialog>
				</Dialog>
			);
		}
		const { rerender } = render(<Harness open />);
		await screen.findByRole('alertdialog', { name: 'Discard changes?' });

		rerender(<Harness open={false} />);
		await waitForClosed();

		expect(screen.queryByRole('dialog', { hidden: true })).toBeNull();
		expect(screen.queryByRole('alertdialog', { hidden: true })).toBeNull();
		expect(onChildCancel).not.toHaveBeenCalled();
	});

	it('opens again from scratch after the dialog closed with the alert open', async () => {
		await renderNested();
		await openChildAlert();

		await userEvent.keyboard('{Escape}');
		await waitForChildClosed();
		await userEvent.keyboard('{Escape}');
		await waitForClosed();
		await userEvent.click(screen.getByRole('button', { name: OPENER_NAME }));

		expect(await screen.findByRole('dialog', { name: 'Edit view' })).toBeInTheDocument();
		expect(screen.queryByTestId('child')).toBeNull();
		expect(slot('dialog-popup')).not.toHaveAttribute('data-nested-dialog-open');
	});

	it('renders open at the same time as its dialog when both start open', async () => {
		render(<AlertInDialogHarness defaultParentOpen defaultChildOpen />);

		const panel = await screen.findByRole('alertdialog', { name: 'Discard changes?' });

		await waitFor(() => {
			expect(panel.contains(document.activeElement)).toBe(true);
		});
		expect(document.querySelectorAll('[data-slot$="backdrop"]')).toHaveLength(1);
		expect(parentPanel()).toHaveAttribute('data-nested-dialog-open');
	});
});

describe('AlertDialog nested at any depth', () => {
	it('answers the alert on each Esc, then closes the dialogs under it, down to the first', async () => {
		const calls: string[] = [];
		function Harness() {
			const [first, setFirst] = useState(true);
			const [second, setSecond] = useState(true);
			const [third, setThird] = useState(true);

			return (
				<Dialog
					open={first}
					title="First"
					onClose={() => {
						calls.push('first');
						setFirst(false);
					}}
				>
					<Dialog
						open={second}
						title="Second"
						onClose={() => {
							calls.push('second');
							setSecond(false);
						}}
					>
						<AlertDialog
							open={third}
							title="Third"
							color="primary"
							confirmText="Go"
							onConfirm={() => {}}
							onCancel={() => {
								calls.push('third');
								setThird(false);
							}}
						>
							Deep
						</AlertDialog>
					</Dialog>
				</Dialog>
			);
		}
		render(<Harness />);
		await screen.findByRole('alertdialog', { name: 'Third' });

		expect(document.querySelectorAll('[data-slot$="backdrop"]')).toHaveLength(1);

		await userEvent.keyboard('{Escape}');
		await waitFor(() => {
			expect(screen.queryByRole('alertdialog', { hidden: true })).toBeNull();
		});
		await userEvent.keyboard('{Escape}');
		await waitFor(() => {
			expect(screen.queryByRole('dialog', { name: 'Second', hidden: true })).toBeNull();
		});
		await userEvent.keyboard('{Escape}');
		await waitForClosed();

		expect(calls).toEqual(['third', 'second', 'first']);
	});

	it('marks every dialog under the alert, and not the alert', async () => {
		render(
			<Dialog open onClose={() => {}} title="First" testId="first">
				<Dialog open onClose={() => {}} title="Second" testId="second">
					<AlertDialog
						open
						title="Third"
						color="primary"
						confirmText="Go"
						testId="third"
						onConfirm={() => {}}
						onCancel={() => {}}
					>
						Deep
					</AlertDialog>
				</Dialog>
			</Dialog>,
		);
		await screen.findByRole('alertdialog', { name: 'Third' });

		expect(screen.getByTestId('first')).toHaveAttribute('data-nested-dialog-open');
		expect(screen.getByTestId('second')).toHaveAttribute('data-nested-dialog-open');
		expect(screen.getByTestId('third')).not.toHaveAttribute('data-nested-dialog-open');
	});

	it('answers an alert inside an alert on its own, and leaves the first one for the next answer', async () => {
		const calls: string[] = [];
		function Harness() {
			const [second, setSecond] = useState(true);

			return (
				<AlertDialog
					open
					title="Delete this view?"
					color="danger"
					confirmText="Delete view"
					testId="first"
					onConfirm={() => {}}
					onCancel={() => calls.push('first')}
				>
					<AlertDialog
						open={second}
						title="Are you sure?"
						color="danger"
						confirmText="Yes, delete"
						testId="second"
						onConfirm={() => {}}
						onCancel={() => {
							calls.push('second');
							setSecond(false);
						}}
					>
						There is no undo.
					</AlertDialog>
				</AlertDialog>
			);
		}
		render(<Harness />);
		await screen.findByRole('alertdialog', { name: 'Are you sure?' });

		expect(screen.getByTestId('first')).toHaveAttribute('data-nested-dialog-open');
		expect(document.querySelectorAll('[data-slot$="backdrop"]')).toHaveLength(1);

		await userEvent.keyboard('{Escape}');
		await waitFor(() => {
			expect(screen.queryByTestId('second')).toBeNull();
		});

		expect(calls).toEqual(['second']);
		expect(screen.getByRole('alertdialog', { name: 'Delete this view?' })).toBeInTheDocument();

		await userEvent.keyboard('{Escape}');

		expect(calls).toEqual(['second', 'first']);
	});
});

type DialogPlacement = NonNullable<DialogOverAlertHarnessProps['dialogIn']>;

async function renderAlertWithDialog(
	dialogIn: DialogPlacement,
	props: DialogOverAlertHarnessProps = {},
) {
	render(<DialogOverAlertHarness dialogIn={dialogIn} {...props} />);
	await userEvent.click(screen.getByRole('button', { name: OPENER_NAME }));
	await screen.findByRole('alertdialog', { name: 'Delete this view?' });
}

describe.each<DialogPlacement>(['body', 'sibling'])(
	'AlertDialog with a Dialog opened over it, declared in its %s',
	(dialogIn) => {
		const renderOver = (props: DialogOverAlertHarnessProps = {}) =>
			renderAlertWithDialog(dialogIn, props);

		it('renders the dialog above the alert, which stays rendered', async () => {
			await renderOver();

			const panel = await openDialogOverAlert();

			expect(panel).toBeInTheDocument();
			expect(screen.getByRole('alertdialog', { hidden: true })).toBeInTheDocument();
			expect(screen.getByRole('alertdialog', { hidden: true }).isConnected).toBe(true);
		});

		it('lets only the dialog take input: the alert is hidden from assistive technology', async () => {
			await renderOver();
			await openDialogOverAlert();

			expect(screen.queryByRole('alertdialog')).toBeNull();
			expect(screen.queryByRole('button', { name: 'Delete view' })).toBeNull();
			expect(screen.getByRole('dialog', { name: 'Affected views' })).toBeInTheDocument();
		});

		it('lets only the dialog take input: the page paints the dialog over the alert', async () => {
			await renderOver();
			const panel = await openDialogOverAlert();
			const { x, y } = centerOf(screen.getByRole('button', { name: 'Delete view', hidden: true }));

			expect(slot('alert-dialog-popup')?.contains(document.elementFromPoint(x, y))).toBe(false);
			expect(
				panel.closest('[data-slot="dialog-layer"]')?.contains(document.elementFromPoint(x, y)),
			).toBe(true);
		});

		it('traps the focus in the dialog however many times Tab is pressed', async () => {
			await renderOver();
			const panel = await openDialogOverAlert();

			for (let step = 0; step < 6; step += 1) {
				await browserUser.tab();
				expect(panel.contains(document.activeElement)).toBe(true);
			}
			for (let step = 0; step < 6; step += 1) {
				await browserUser.tab({ shift: true });
				expect(panel.contains(document.activeElement)).toBe(true);
			}
		});

		it('closes only the dialog on Esc, then answers the alert on the next', async () => {
			const onAlertCancel = vi.fn();
			const onDialogClose = vi.fn();
			await renderOver({ onAlertCancel, onDialogClose });
			await openDialogOverAlert();

			await userEvent.keyboard('{Escape}');

			expect(onDialogClose).toHaveBeenCalledExactlyOnceWith('escape-key');
			expect(onAlertCancel).not.toHaveBeenCalled();
			await waitFor(() => {
				expect(screen.queryByRole('dialog', { name: 'Affected views', hidden: true })).toBeNull();
			});
			expect(screen.getByRole('alertdialog', { name: 'Delete this view?' })).toBeInTheDocument();

			await userEvent.keyboard('{Escape}');

			expect(onAlertCancel).toHaveBeenCalledOnce();
			await waitForClosed();
		});

		it('does not answer the alert on a press on the backdrop, and closes the dialog', async () => {
			const onAlertCancel = vi.fn();
			const onDialogClose = vi.fn();
			await renderOver({ onAlertCancel, onDialogClose, closes: false });
			await openDialogOverAlert();

			await pressBackdrop();

			expect(onDialogClose).toHaveBeenCalledExactlyOnceWith('outside-press');
			expect(onAlertCancel).not.toHaveBeenCalled();
			expect(screen.getByRole('dialog', { name: 'Affected views' })).toBeInTheDocument();
		});

		it('does not close the alert when the dialog closes from its close button', async () => {
			const onAlertCancel = vi.fn();
			await renderOver({ onAlertCancel });
			await openDialogOverAlert();

			await userEvent.click(screen.getByRole('button', { name: 'Close' }));

			await waitFor(() => {
				expect(screen.queryByRole('dialog', { name: 'Affected views', hidden: true })).toBeNull();
			});
			expect(onAlertCancel).not.toHaveBeenCalled();
			expect(screen.getByRole('alertdialog')).toBeInTheDocument();
		});

		it('gives the focus back to the element in the alert that opened the dialog', async () => {
			await renderOver();
			await openDialogOverAlert();

			await userEvent.keyboard('{Escape}');
			await waitFor(() => {
				expect(screen.queryByRole('dialog', { name: 'Affected views', hidden: true })).toBeNull();
			});

			await waitFor(() => {
				expect(screen.getByRole('button', { name: 'Open details' })).toHaveFocus();
			});
		});

		it('takes input in the dialog while the alert is behind it', async () => {
			await renderOver();
			await openDialogOverAlert();

			await userEvent.type(screen.getByRole('textbox', { name: 'Dialog field' }), 'abc');

			expect(screen.getByRole('textbox', { name: 'Dialog field' })).toHaveValue('abc');
		});
	},
);

describe('AlertDialog with a Dialog declared in its body', () => {
	it('opens already over the alert when both start open', async () => {
		render(<DialogOverAlertHarness dialogIn="body" defaultAlertOpen defaultDialogOpen />);

		const panel = await screen.findByRole('dialog', { name: 'Affected views' });

		await waitFor(() => {
			expect(panel.contains(document.activeElement)).toBe(true);
		});
		expect(screen.queryByRole('alertdialog')).toBeNull();
	});

	it('marks the alert panel with data-nested-dialog-open while the dialog is open', async () => {
		await renderAlertWithDialog('body');

		expect(slot('alert-dialog-popup')).not.toHaveAttribute('data-nested-dialog-open');

		await openDialogOverAlert();

		expect(screen.getByRole('alertdialog', { hidden: true })).toHaveAttribute(
			'data-nested-dialog-open',
		);
		expect(screen.getByRole('dialog')).not.toHaveAttribute('data-nested-dialog-open');
	});

	it('renders one backdrop, the one of the alert', async () => {
		await renderAlertWithDialog('body');
		await openDialogOverAlert();

		expect(document.querySelectorAll('[data-slot$="backdrop"]')).toHaveLength(1);
		expect(slots('alert-dialog-backdrop')).toHaveLength(1);
		expect(slots('dialog-backdrop')).toHaveLength(0);
	});
});

describe('AlertDialog with a Dialog declared next to it', () => {
	it('is a second modal on its own: it has its own backdrop and does not mark the alert', async () => {
		await renderAlertWithDialog('sibling');
		await openDialogOverAlert();

		expect(screen.getByRole('alertdialog', { hidden: true })).not.toHaveAttribute(
			'data-nested-dialog-open',
		);
		expect(slots('alert-dialog-backdrop')).toHaveLength(1);
		expect(slots('dialog-backdrop')).toHaveLength(1);
	});
});
