import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ReactNode, useState } from 'react';
import { expect } from 'vitest';
import { Dialog } from '../dialog.js';
import type { DialogCloseReasonType, DialogProps, DialogWidthType } from '../types.js';

export const OPENER_NAME = 'Open dialog';

export type DialogHarnessProps = Partial<Omit<DialogProps, 'open' | 'onClose' | 'children'>> & {
	children?: ReactNode;
	defaultOpen?: boolean;
	/**
	 * Closes the dialog on every reason, the way a consumer does with
	 * `onClose={() => setOpen(false)}`. `false` leaves it open, to see what `onClose` was told.
	 */
	closes?: boolean;
	onClose?: (reason: DialogCloseReasonType) => void;
};

/**
 * The dialog as an app holds it: `open` in state and a button that opens it.
 */
export function DialogHarness({
	defaultOpen = false,
	closes = true,
	onClose,
	children = <input aria-label="Name" />,
	title = 'Rename view',
	testId = 'dialog',
	...props
}: DialogHarnessProps): ReactNode {
	const [open, setOpen] = useState(defaultOpen);

	return (
		<>
			<button type="button" onClick={() => setOpen(true)}>
				{OPENER_NAME}
			</button>
			<Dialog
				{...props}
				open={open}
				title={title}
				testId={testId}
				onClose={(reason) => {
					onClose?.(reason);
					if (closes) {
						setOpen(false);
					}
				}}
			>
				{children}
			</Dialog>
		</>
	);
}

/**
 * Waits for the entrance transition of every panel on the page to end. A popup opened while the
 * panel still scales in is placed against a box that is about to move.
 */
export async function waitForSettled(): Promise<void> {
	await waitFor(() => {
		for (const panel of document.querySelectorAll('[data-slot="dialog-popup"]')) {
			expect(panel).not.toHaveAttribute('data-starting-style');
			expect(panel.getAnimations()).toHaveLength(0);
		}
	});
}

/**
 * Renders the dialog already open and waits for the panel to take the focus.
 */
export async function renderOpenDialog(props: Omit<DialogHarnessProps, 'defaultOpen'> = {}) {
	const result = render(<DialogHarness defaultOpen {...props} />);

	await waitFor(() => {
		expect(screen.getByRole('dialog').contains(document.activeElement)).toBe(true);
	});
	await waitForSettled();

	return result;
}

/**
 * Opens the dialog from its button, the way a user does, so the opener is what held the focus.
 */
export async function openFromButton(): Promise<void> {
	await userEvent.click(screen.getByRole('button', { name: OPENER_NAME }));
	await waitFor(() => {
		expect(screen.getByRole('dialog').contains(document.activeElement)).toBe(true);
	});
	await waitForSettled();
}

export function opener(): HTMLElement {
	return screen.getByRole('button', { name: OPENER_NAME, hidden: true });
}

export function slot(name: string, root: ParentNode = document): HTMLElement | null {
	return root.querySelector<HTMLElement>(`[data-slot="${name}"]`);
}

export function slots(name: string, root: ParentNode = document): HTMLElement[] {
	return [...root.querySelectorAll<HTMLElement>(`[data-slot="${name}"]`)];
}

export function isOnTop(element: Element): boolean {
	const { left, top, width, height } = element.getBoundingClientRect();

	return element.contains(document.elementFromPoint(left + width / 2, top + height / 2));
}

/**
 * Waits until the element is the one a press lands on. A popup is placed against the box it opens
 * in, and Floating UI corrects its first position on a later frame.
 */
export async function waitForOnTop(element: Element): Promise<void> {
	await waitFor(() => {
		expect(isOnTop(element)).toBe(true);
	});
}

export function zIndexOf(element: Element): number {
	return Number.parseInt(getComputedStyle(element).zIndex, 10);
}

/**
 * Waits for the exit animation to end and the content to unmount.
 */
export async function waitForClosed(): Promise<void> {
	await waitFor(() => {
		expect(slot('dialog-popup')).toBeNull();
	});
}

export type NestedHarnessProps = {
	/**
	 * Where the child renders in the parent: its `children`, its `footerSuffix`, or its
	 * `footerPrefix` (with a `Save` button in the suffix, which the prefix needs to render).
	 */
	childIn?: 'body' | 'footer-suffix' | 'footer-prefix';
	childWidth?: DialogWidthType;
	onParentClose?: (reason: DialogCloseReasonType) => void;
	onChildClose?: (reason: DialogCloseReasonType) => void;
	/**
	 * Both dialogs close on every reason, the way a consumer does. `false` leaves them open.
	 */
	closes?: boolean;
	defaultParentOpen?: boolean;
	defaultChildOpen?: boolean;
};

/**
 * A form that asks "Discard unsaved changes?" before it closes: a parent dialog with a button
 * that opens a child `Dialog` inside its body or its footer.
 */
export function NestedHarness({
	childIn = 'body',
	childWidth,
	onParentClose,
	onChildClose,
	closes = true,
	defaultParentOpen = false,
	defaultChildOpen = false,
}: NestedHarnessProps): ReactNode {
	const [parentOpen, setParentOpen] = useState(defaultParentOpen);
	const [childOpen, setChildOpen] = useState(defaultChildOpen);

	const childElement = (
		<Dialog
			open={childOpen}
			title="Discard changes?"
			testId="child"
			width={childWidth}
			onClose={(reason) => {
				onChildClose?.(reason);
				if (closes) {
					setChildOpen(false);
				}
			}}
		>
			<input aria-label="Child field" />
		</Dialog>
	);

	const childAndOpener = (
		<>
			<button type="button" onClick={() => setChildOpen(true)}>
				Open child
			</button>
			{childElement}
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
 * Opens the child from the button inside the parent, the way a user does, and waits for the
 * child to take the focus.
 */
export async function openChild(): Promise<HTMLElement> {
	await userEvent.click(screen.getByRole('button', { name: 'Open child' }));

	const panel = await waitFor(() => {
		const element = screen.getByRole('dialog', { name: 'Discard changes?' });

		expect(element.contains(document.activeElement)).toBe(true);

		return element;
	});
	await waitForSettled();

	return panel;
}
