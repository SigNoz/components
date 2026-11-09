import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ReactNode, useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { page } from 'vitest/browser';
import { Dialog } from '../../dialog/dialog.js';
import { Popover } from '../../popover/index.js';
import { Drawer } from '../drawer.js';
import type { DrawerTypeType } from '../types.js';
import { waitForSettled } from './drawer.test-utils.js';

const TYPES: DrawerTypeType[] = ['task', 'inspector'];

const hosts: HTMLElement[] = [];

function createHost(): HTMLElement {
	const host = document.createElement('div');

	document.body.append(host);
	hosts.push(host);

	return host;
}

// At the default 414px the panel fills the page, and a dialog sized to the panel would look
// sized to the page.
beforeEach(async () => {
	await page.viewport(1280, 800);
});

afterEach(async () => {
	for (const host of hosts.splice(0)) {
		host.remove();
	}
	await page.viewport(414, 896);
});

function ActionsPopover({ children }: { children: ReactNode }): ReactNode {
	return (
		<Popover
			nativeButton
			side="bottom"
			align="start"
			aria-label="Actions"
			trigger={<button type="button">Open actions</button>}
		>
			{children}
		</Popover>
	);
}

interface HarnessProps {
	type?: DrawerTypeType;
	drawerContainer?: HTMLElement;
	childContainer?: HTMLElement;
	inPopover?: boolean;
	onDrawerClose?: () => void;
}

function Harness({
	type = 'task',
	drawerContainer,
	childContainer,
	inPopover = false,
	onDrawerClose = () => {},
}: HarnessProps): ReactNode {
	const [childOpen, setChildOpen] = useState(false);
	const child = (
		<>
			<button type="button" onClick={() => setChildOpen(true)}>
				Open child
			</button>
			<Dialog
				open={childOpen}
				onClose={() => setChildOpen(false)}
				title="Delete member"
				testId="child"
				container={childContainer}
			>
				<input aria-label="Child field" />
			</Dialog>
		</>
	);

	return (
		<Drawer
			type={type}
			stack="overlay"
			open
			onClose={onDrawerClose}
			title="Edit member"
			testId="drawer"
			container={drawerContainer}
		>
			{inPopover ? <ActionsPopover>{child}</ActionsPopover> : child}
		</Drawer>
	);
}

async function openChild(inPopover: boolean): Promise<HTMLElement> {
	await screen.findByRole('dialog', { name: 'Edit member' });
	await waitForSettled();
	if (inPopover) {
		await userEvent.click(screen.getByRole('button', { name: 'Open actions' }));
		await screen.findByRole('dialog', { name: 'Actions' });
	}
	await userEvent.click(screen.getByRole('button', { name: 'Open child' }));

	const child = await screen.findByTestId('child');

	await waitForSettled();

	return child;
}

function viewportOf(panel: HTMLElement): DOMRect {
	return (panel.parentElement as HTMLElement).getBoundingClientRect();
}

function expectToFillThePage(rect: DOMRect): void {
	const { clientWidth, clientHeight } = document.documentElement;

	expect(rect.width).toBe(clientWidth);
	expect(rect.height).toBe(clientHeight);
	expect(rect.left).toBe(0);
	expect(rect.top).toBe(0);
}

describe('Dialog declared in a popover inside a drawer', () => {
	it.each(TYPES)('renders in document.body, outside the panel of a %s', async (type) => {
		render(<Harness type={type} inPopover />);

		const child = await openChild(true);

		expect(screen.getByTestId('drawer')).not.toContainElement(child);
		expect(document.body).toContainElement(child);
		expect(child.closest('[data-slot="popup-container"]')).toBeNull();
	});

	it('is centered on the page, not on the panel it is declared in', async () => {
		render(<Harness inPopover />);

		const child = await openChild(true);

		expect(screen.getByTestId('drawer').getBoundingClientRect().width).toBeLessThan(
			document.documentElement.clientWidth / 2,
		);
		expectToFillThePage(viewportOf(child));
	});

	it.each(TYPES)(
		'takes the focus and the Esc alone, and leaves the popover and the %s open',
		async (type) => {
			const onDrawerClose = vi.fn();
			render(<Harness type={type} inPopover onDrawerClose={onDrawerClose} />);
			const child = await openChild(true);

			await waitFor(() => {
				expect(child.contains(document.activeElement)).toBe(true);
			});

			await userEvent.keyboard('{Escape}');

			await waitFor(() => {
				expect(screen.queryByRole('dialog', { name: 'Delete member' })).toBeNull();
			});
			expect(screen.getByRole('dialog', { name: 'Actions' })).toBeInTheDocument();
			expect(screen.getByRole('dialog', { name: 'Edit member' })).toBeInTheDocument();
			expect(onDrawerClose).not.toHaveBeenCalled();
		},
	);

	it('renders in the container of the drawer it is in', async () => {
		const host = createHost();
		render(<Harness drawerContainer={host} inPopover />);

		const child = await openChild(true);

		expect(host).toContainElement(child);
		expect(screen.getByTestId('drawer')).not.toContainElement(child);
	});

	it('renders in its own container over the one of the drawer it is in', async () => {
		const drawerHost = createHost();
		const childHost = createHost();
		render(<Harness drawerContainer={drawerHost} childContainer={childHost} inPopover />);

		const child = await openChild(true);

		expect(childHost).toContainElement(child);
		expect(drawerHost).not.toContainElement(child);
	});
});

describe('Dialog nested directly in a drawer', () => {
	it('renders in the container of the drawer', async () => {
		const host = createHost();
		render(<Harness drawerContainer={host} />);

		const child = await openChild(false);

		expect(host).toContainElement(child);
		expect(screen.getByTestId('drawer')).not.toContainElement(child);
	});

	it.each(TYPES)(
		'renders in document.body when the %s has no container, centered on the page',
		async (type) => {
			render(<Harness type={type} />);

			const child = await openChild(false);

			expect(document.body).toContainElement(child);
			expect(screen.getByTestId('drawer')).not.toContainElement(child);
			expectToFillThePage(viewportOf(child));
		},
	);

	it('renders in its own container over the one of the drawer', async () => {
		const drawerHost = createHost();
		const childHost = createHost();
		render(<Harness drawerContainer={drawerHost} childContainer={childHost} />);

		const child = await openChild(false);

		expect(childHost).toContainElement(child);
		expect(drawerHost).not.toContainElement(child);
	});
});

describe('Drawer declared in a popover inside a dialog', () => {
	function DialogHarness(): ReactNode {
		const [drawerOpen, setDrawerOpen] = useState(false);

		return (
			<Dialog open onClose={() => {}} title="Edit view" testId="dialog">
				<ActionsPopover>
					<button type="button" onClick={() => setDrawerOpen(true)}>
						Open drawer
					</button>
					<Drawer
						type="task"
						stack="overlay"
						open={drawerOpen}
						onClose={() => setDrawerOpen(false)}
						title="Pick a member"
						testId="drawer"
					>
						<input aria-label="Member" />
					</Drawer>
				</ActionsPopover>
			</Dialog>
		);
	}

	it('renders in document.body, outside the dialog panel, and fills the height of the page', async () => {
		render(<DialogHarness />);
		await screen.findByRole('dialog', { name: 'Edit view' });
		await userEvent.click(screen.getByRole('button', { name: 'Open actions' }));
		await screen.findByRole('dialog', { name: 'Actions' });

		await userEvent.click(screen.getByRole('button', { name: 'Open drawer' }));
		const drawer = await screen.findByTestId('drawer');
		await waitForSettled();

		expect(document.body).toContainElement(drawer);
		expect(screen.getByTestId('dialog')).not.toContainElement(drawer);
		expect(drawer.closest('[data-slot="popup-container"]')).toBeNull();
		expectToFillThePage(viewportOf(drawer));
	});
});
