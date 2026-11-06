import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ReactNode, useState } from 'react';
import { afterEach, beforeEach, expect } from 'vitest';
import { OPENER_NAME } from '../../dialog/__tests__/dialog.test-utils.js';
import { Dialog, type DialogCloseReasonType } from '../../dialog/index.js';
import { AlertDialog } from '../index.js';
import type { AlertDialogProps } from '../types.js';

const PANELS = '[data-slot="dialog-popup"], [data-slot="alert-dialog-popup"]';

export type AlertHarnessProps = Partial<
	Omit<AlertDialogProps, 'open' | 'handle' | 'children' | 'onCancel'>
> & {
	children?: ReactNode;
	defaultOpen?: boolean;
	/**
	 * Sets `open` to `false` from `onCancel`, the way a consumer does.
	 */
	closesOnCancel?: boolean;
	onCancel?: () => void;
};

/**
 * The alert as an app holds it. `onConfirm` is the consumer's handler and does not close the
 * alert by itself, so a test sees what the alert does on its own.
 */
export function AlertHarness({
	defaultOpen = false,
	closesOnCancel = true,
	title = 'Delete this view?',
	color = 'danger',
	confirmText = 'Delete view',
	testId = 'alert',
	onConfirm = () => {},
	onCancel,
	children = 'Dashboards that link to it open the default view.',
	...props
}: AlertHarnessProps): ReactNode {
	const [open, setOpen] = useState(defaultOpen);

	return (
		<>
			<button type="button" onClick={() => setOpen(true)}>
				{OPENER_NAME}
			</button>
			<AlertDialog
				{...props}
				open={open}
				title={title}
				color={color}
				confirmText={confirmText}
				testId={testId}
				onConfirm={onConfirm}
				onCancel={() => {
					onCancel?.();
					if (closesOnCancel) {
						setOpen(false);
					}
				}}
			>
				{children}
			</AlertDialog>
		</>
	);
}

/**
 * Waits for the entrance transition of every dialog and alert panel on the page to end. A popup
 * opened while the panel still scales in is placed against a box that is about to move.
 */
export async function waitForSettled(): Promise<void> {
	await waitFor(() => {
		for (const panel of document.querySelectorAll(PANELS)) {
			expect(panel).not.toHaveAttribute('data-starting-style');
			expect(panel.getAnimations()).toHaveLength(0);
		}
	});
}

/**
 * Renders the alert already open and waits for the panel to take the focus.
 */
export async function renderOpenAlert(props: Omit<AlertHarnessProps, 'defaultOpen'> = {}) {
	const result = render(<AlertHarness defaultOpen {...props} />);

	await waitFor(() => {
		expect(screen.getByRole('alertdialog').contains(document.activeElement)).toBe(true);
	});
	await waitForSettled();

	return result;
}

/**
 * Opens the alert from its button, the way a user does, so the opener is what held the focus.
 */
export async function openFromButton(): Promise<void> {
	await userEvent.click(screen.getByRole('button', { name: OPENER_NAME }));
	await waitFor(() => {
		expect(screen.getByRole('alertdialog').contains(document.activeElement)).toBe(true);
	});
	await waitForSettled();
}

/**
 * Waits for the exit animation to end and the content of every dialog and alert to unmount.
 */
export async function waitForClosed(): Promise<void> {
	await waitFor(() => {
		expect(document.querySelectorAll(PANELS)).toHaveLength(0);
	});
}

export function confirmButton(): HTMLElement {
	return screen.getByRole('button', { name: 'Delete view' });
}

export function cancelButton(): HTMLElement {
	return screen.getByRole('button', { name: 'Cancel' });
}

export function isLoading(button: HTMLElement): boolean {
	return button.getAttribute('aria-busy') === 'true';
}

export function isDisabled(button: HTMLElement): boolean {
	return button.getAttribute('aria-disabled') === 'true' || button.hasAttribute('disabled');
}

export async function waitForLoading(): Promise<void> {
	await waitFor(() => {
		expect(isLoading(confirmButton())).toBe(true);
	});
}

export function nextTask(): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(resolve, 0);
	});
}

export interface Deferred<Value = void> {
	promise: Promise<Value>;
	resolve: (value: Value) => void;
	reject: (error: Error) => void;
}

export function defer<Value = void>(): Deferred<Value> {
	let resolve!: (value: Value) => void;
	let reject!: (error: Error) => void;
	const promise = new Promise<Value>((resolvePromise, rejectPromise) => {
		resolve = resolvePromise;
		reject = rejectPromise;
	});

	return { promise, resolve, reject };
}

/**
 * `AlertDialog` catches the rejection of `onConfirm` and does not rethrow it. A listener on
 * `window` records any rejection that still reaches the page, so a test can assert there is none.
 * Call it once at the top of a test file, and read the array in the tests.
 */
export function trackUnhandledRejections(): unknown[] {
	const unhandled: unknown[] = [];

	function collect(event: PromiseRejectionEvent): void {
		event.preventDefault();
		unhandled.push(event.reason);
	}

	beforeEach(() => {
		unhandled.length = 0;
		window.addEventListener('unhandledrejection', collect);
	});

	afterEach(() => {
		window.removeEventListener('unhandledrejection', collect);
	});

	return unhandled;
}

export type AlertInDialogHarnessProps = {
	/**
	 * Where the alert renders in the dialog: its `children`, its `footerSuffix`, or its
	 * `footerPrefix` (with a `Save` button in the suffix, which the prefix needs to render).
	 */
	childIn?: 'body' | 'footer-suffix' | 'footer-prefix';
	onParentClose?: (reason: DialogCloseReasonType) => void;
	onChildCancel?: () => void;
	onChildConfirm?: () => void;
	/**
	 * The dialog and the alert close on every answer, the way a consumer does. `false` leaves
	 * them open.
	 */
	closes?: boolean;
	defaultParentOpen?: boolean;
	defaultChildOpen?: boolean;
};

/**
 * A form that asks "Discard unsaved changes?" before it closes: a parent `Dialog` with a button
 * that opens an `AlertDialog` inside its body or its footer.
 */
export function AlertInDialogHarness({
	childIn = 'body',
	onParentClose,
	onChildCancel,
	onChildConfirm,
	closes = true,
	defaultParentOpen = false,
	defaultChildOpen = false,
}: AlertInDialogHarnessProps): ReactNode {
	const [parentOpen, setParentOpen] = useState(defaultParentOpen);
	const [childOpen, setChildOpen] = useState(defaultChildOpen);

	const childAndOpener = (
		<>
			<button type="button" onClick={() => setChildOpen(true)}>
				Open child
			</button>
			<AlertDialog
				open={childOpen}
				title="Discard changes?"
				color="danger"
				confirmText="Discard"
				testId="child"
				onConfirm={() => onChildConfirm?.()}
				onCancel={() => {
					onChildCancel?.();
					if (closes) {
						setChildOpen(false);
					}
				}}
			>
				The edits are lost.
			</AlertDialog>
		</>
	);
	const footerSuffix = {
		body: undefined,
		'footer-suffix': childAndOpener,
		'footer-prefix': <button type="button">Save</button>,
	}[childIn];

	return (
		<>
			<button type="button" onClick={() => setParentOpen(true)}>
				{OPENER_NAME}
			</button>
			<Dialog
				open={parentOpen}
				title="Edit view"
				testId="parent"
				onClose={(reason) => {
					onParentClose?.(reason);
					if (closes) {
						setParentOpen(false);
					}
				}}
				footerPrefix={childIn === 'footer-prefix' ? childAndOpener : undefined}
				footerSuffix={footerSuffix}
			>
				<input aria-label="Parent field" />
				{childIn === 'body' ? childAndOpener : null}
			</Dialog>
		</>
	);
}

/**
 * Opens the alert from the button inside the dialog, the way a user does, and waits for the
 * alert to take the focus.
 */
export async function openChildAlert(): Promise<HTMLElement> {
	await userEvent.click(screen.getByRole('button', { name: 'Open child' }));

	const panel = await waitFor(() => {
		const element = screen.getByRole('alertdialog', { name: 'Discard changes?' });

		expect(element.contains(document.activeElement)).toBe(true);

		return element;
	});
	await waitForSettled();

	return panel;
}

export type DialogOverAlertHarnessProps = {
	/**
	 * Where the dialog is declared: inside the body of the alert, so it is part of its tree, or
	 * next to it, so it is a second modal that happens to open while the alert is shown.
	 */
	dialogIn?: 'body' | 'sibling';
	onAlertCancel?: () => void;
	onDialogClose?: (reason: DialogCloseReasonType) => void;
	/**
	 * The alert and the dialog close on every answer, the way a consumer does. `false` leaves
	 * them open.
	 */
	closes?: boolean;
	defaultAlertOpen?: boolean;
	defaultDialogOpen?: boolean;
};

/**
 * An alert with a button in its body that opens a `Dialog` over it, such as a "See the affected
 * views" list.
 */
export function DialogOverAlertHarness({
	dialogIn = 'body',
	onAlertCancel,
	onDialogClose,
	closes = true,
	defaultAlertOpen = false,
	defaultDialogOpen = false,
}: DialogOverAlertHarnessProps): ReactNode {
	const [alertOpen, setAlertOpen] = useState(defaultAlertOpen);
	const [dialogOpen, setDialogOpen] = useState(defaultDialogOpen);

	const dialog = (
		<Dialog
			open={dialogOpen}
			title="Affected views"
			testId="dialog"
			onClose={(reason) => {
				onDialogClose?.(reason);
				if (closes) {
					setDialogOpen(false);
				}
			}}
		>
			<input aria-label="Dialog field" />
		</Dialog>
	);

	return (
		<>
			<button type="button" onClick={() => setAlertOpen(true)}>
				{OPENER_NAME}
			</button>
			<AlertDialog
				open={alertOpen}
				title="Delete this view?"
				color="danger"
				confirmText="Delete view"
				testId="alert"
				onConfirm={() => {}}
				onCancel={() => {
					onAlertCancel?.();
					if (closes) {
						setAlertOpen(false);
					}
				}}
			>
				<button type="button" onClick={() => setDialogOpen(true)}>
					Open details
				</button>
				{dialogIn === 'body' ? dialog : null}
			</AlertDialog>
			{dialogIn === 'sibling' ? dialog : null}
		</>
	);
}

/**
 * Opens the dialog from the button in the alert, the way a user does, and waits for the dialog to
 * take the focus.
 */
export async function openDialogOverAlert(): Promise<HTMLElement> {
	await userEvent.click(screen.getByRole('button', { name: 'Open details' }));

	const panel = await waitFor(() => {
		const element = screen.getByRole('dialog', { name: 'Affected views' });

		expect(element.contains(document.activeElement)).toBe(true);

		return element;
	});
	await waitForSettled();

	return panel;
}
