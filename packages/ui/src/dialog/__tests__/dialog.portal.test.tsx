import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ReactNode, useState } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { Popover } from '../../popover/index.js';
import { Dialog } from '../dialog.js';
import { waitForSettled } from './dialog.test-utils.js';

const hosts: HTMLElement[] = [];

function createHost(): HTMLElement {
	const host = document.createElement('div');

	document.body.append(host);
	hosts.push(host);

	return host;
}

afterEach(() => {
	for (const host of hosts.splice(0)) {
		host.remove();
	}
});

interface HarnessProps {
	parentContainer?: HTMLElement;
	childContainer?: HTMLElement;
	inPopover?: boolean;
}

function Harness({ parentContainer, childContainer, inPopover = false }: HarnessProps): ReactNode {
	const [childOpen, setChildOpen] = useState(false);
	const child = (
		<>
			<button type="button" onClick={() => setChildOpen(true)}>
				Open child
			</button>
			<Dialog
				open={childOpen}
				onClose={() => setChildOpen(false)}
				title="Delete view"
				testId="child"
				container={childContainer}
			>
				<input aria-label="Child field" />
			</Dialog>
		</>
	);

	return (
		<Dialog open onClose={() => {}} title="Edit view" testId="parent" container={parentContainer}>
			{inPopover ? (
				<Popover
					nativeButton
					side="bottom"
					align="start"
					aria-label="Actions"
					trigger={<button type="button">Open actions</button>}
				>
					{child}
				</Popover>
			) : (
				child
			)}
		</Dialog>
	);
}

async function openChild(inPopover: boolean): Promise<HTMLElement> {
	await screen.findByRole('dialog', { name: 'Edit view' });
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

describe('Dialog declared in a popover inside another dialog', () => {
	it('renders in document.body, outside the panel that has a will-change', async () => {
		render(<Harness inPopover />);

		const child = await openChild(true);

		expect(screen.getByTestId('parent')).not.toContainElement(child);
		expect(document.body).toContainElement(child);
		expect(child.closest('[data-slot="popup-container"]')).toBeNull();
	});

	it('is centered on the page, not on the panel it is declared in', async () => {
		render(<Harness inPopover />);

		const child = await openChild(true);
		const page = document.documentElement;
		const viewport = viewportOf(child);

		expect(viewport.width).toBe(page.clientWidth);
		expect(viewport.height).toBe(page.clientHeight);
		expect(viewport.left).toBe(0);
		expect(viewport.top).toBe(0);
	});

	it('takes the focus and the Esc alone, and leaves the popover open', async () => {
		render(<Harness inPopover />);
		const child = await openChild(true);

		await waitFor(() => {
			expect(child.contains(document.activeElement)).toBe(true);
		});

		await userEvent.keyboard('{Escape}');

		await waitFor(() => {
			expect(screen.queryByRole('dialog', { name: 'Delete view' })).toBeNull();
		});
		expect(screen.getByRole('dialog', { name: 'Actions' })).toBeInTheDocument();
		expect(screen.getByRole('dialog', { name: 'Edit view' })).toBeInTheDocument();
	});

	it('renders in the container of the dialog it is in', async () => {
		const host = createHost();
		render(<Harness parentContainer={host} inPopover />);

		const child = await openChild(true);

		expect(host).toContainElement(child);
		expect(screen.getByTestId('parent')).not.toContainElement(child);
	});

	it('renders in its own container over the one of the dialog it is in', async () => {
		const parentHost = createHost();
		const childHost = createHost();
		render(<Harness parentContainer={parentHost} childContainer={childHost} inPopover />);

		const child = await openChild(true);

		expect(childHost).toContainElement(child);
		expect(parentHost).not.toContainElement(child);
	});
});

describe('Dialog nested directly in another dialog', () => {
	it('renders in the container of its parent', async () => {
		const host = createHost();
		render(<Harness parentContainer={host} />);

		const child = await openChild(false);

		expect(host).toContainElement(child);
		expect(screen.getByTestId('parent')).not.toContainElement(child);
	});

	it('renders in document.body when its parent has no container', async () => {
		render(<Harness />);

		const child = await openChild(false);

		expect(document.body).toContainElement(child);
		expect(screen.getByTestId('parent')).not.toContainElement(child);
	});

	it('renders in its own container over the one of its parent', async () => {
		const parentHost = createHost();
		const childHost = createHost();
		render(<Harness parentContainer={parentHost} childContainer={childHost} />);

		const child = await openChild(false);

		expect(childHost).toContainElement(child);
		expect(parentHost).not.toContainElement(child);
	});
});
