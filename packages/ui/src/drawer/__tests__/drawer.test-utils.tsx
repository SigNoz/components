import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ReactNode, useState } from 'react';
import { expect } from 'vitest';
import { Drawer } from '../drawer.js';
import type { DrawerCloseReasonType, DrawerTypeType, DrawerWidthType } from '../types.js';

export {
	isOnTop,
	slot,
	slots,
	waitForOnTop,
	zIndexOf,
} from '../../dialog/__tests__/dialog.test-utils.js';

export const OPENER_NAME = 'Open drawer';

export type DrawerHarnessProps = {
	type?: DrawerTypeType;
	title?: string;
	testId?: string;
	headerPrefix?: ReactNode;
	titlePrefix?: ReactNode;
	titleSuffix?: ReactNode;
	headerSuffix?: ReactNode;
	description?: ReactNode;
	footerPrefix?: ReactNode;
	footerSuffix?: ReactNode;
	loading?: boolean;
	loadingContent?: ReactNode;
	width?: DrawerWidthType;
	container?: HTMLElement | null;
	initialFocus?: boolean;
	children?: ReactNode;
	defaultOpen?: boolean;
	/**
	 * Closes the drawer on every reason, the way a consumer does with
	 * `onClose={() => setOpen(false)}`. `false` leaves it open, to see what `onClose` was told.
	 */
	closes?: boolean;
	onClose?: (reason: DrawerCloseReasonType) => void;
};

/**
 * The drawer as an app holds it: `open` in state and a button that opens it. A `task` by
 * default. The footer props are passed only to a `task`, as the types require.
 */
export function DrawerHarness({
	type = 'task',
	defaultOpen = false,
	closes = true,
	onClose,
	children = <input aria-label="Name" />,
	title = 'Edit member',
	testId = 'drawer',
	description,
	footerPrefix,
	footerSuffix,
	...props
}: DrawerHarnessProps): ReactNode {
	const [open, setOpen] = useState(defaultOpen);
	const handleClose = (reason: DrawerCloseReasonType): void => {
		onClose?.(reason);
		if (closes) {
			setOpen(false);
		}
	};

	return (
		<>
			<button type="button" onClick={() => setOpen(true)}>
				{OPENER_NAME}
			</button>
			{type === 'task' ? (
				<Drawer
					{...props}
					type="task"
					stack="overlay"
					open={open}
					title={title}
					testId={testId}
					description={description}
					footerPrefix={footerPrefix}
					footerSuffix={footerSuffix}
					onClose={handleClose}
				>
					{children}
				</Drawer>
			) : (
				<Drawer
					{...props}
					type="inspector"
					stack="overlay"
					open={open}
					title={title}
					testId={testId}
					onClose={handleClose}
				>
					{children}
				</Drawer>
			)}
		</>
	);
}

/**
 * Waits for the entrance transition of every panel on the page to end. A popup opened while the
 * panel still slides in is placed against a box that is about to move.
 */
export async function waitForSettled(): Promise<void> {
	await waitFor(() => {
		for (const panel of document.querySelectorAll('[data-slot="drawer-popup"]')) {
			expect(panel).not.toHaveAttribute('data-starting-style');
			expect(panel.getAnimations()).toHaveLength(0);
		}
	});
}

/**
 * Renders the drawer already open and waits for the panel to take the focus and settle.
 */
export async function renderOpenDrawer(props: Omit<DrawerHarnessProps, 'defaultOpen'> = {}) {
	const result = render(<DrawerHarness defaultOpen {...props} />);

	await waitFor(() => {
		expect(drawerPanel().contains(document.activeElement)).toBe(true);
	});
	await waitForSettled();

	return result;
}

/**
 * Opens the drawer from its button, the way a user does, so the opener is what held the focus.
 */
export async function openFromButton(): Promise<void> {
	await userEvent.click(screen.getByRole('button', { name: OPENER_NAME }));
	await waitFor(() => {
		expect(drawerPanel().contains(document.activeElement)).toBe(true);
	});
	await waitForSettled();
}

export function opener(): HTMLElement {
	return screen.getByRole('button', { name: OPENER_NAME, hidden: true });
}

/**
 * The panel, found by its slot: the role query skips it while a modal above hides it.
 */
export function drawerPanel(): HTMLElement {
	const panel = document.querySelector<HTMLElement>('[data-slot="drawer-popup"]');
	expect(panel).not.toBeNull();

	return panel as HTMLElement;
}

/**
 * Waits for the exit transition to end and the content to unmount.
 */
export async function waitForClosed(): Promise<void> {
	await waitFor(() => {
		expect(document.querySelector('[data-slot="drawer-popup"]')).toBeNull();
	});
}
