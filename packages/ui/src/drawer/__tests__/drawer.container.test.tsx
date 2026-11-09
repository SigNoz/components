import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, type ReactNode, type RefObject } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Popover } from '../../popover/index.js';
import { Tooltip } from '../../tooltip/index.js';
import { Drawer } from '../drawer.js';
import type { DrawerTypeType } from '../types.js';
import { useDrawerHandle } from '../use-drawer-handle.js';
import { isOnTop, slot, waitForClosed, waitForOnTop, waitForSettled } from './drawer.test-utils.js';

const TYPES: DrawerTypeType[] = ['task', 'inspector'];

const hosts: HTMLElement[] = [];

function createHost(): HTMLElement {
	const host = document.createElement('div');

	host.setAttribute('data-testid', 'host');
	document.body.append(host);
	hosts.push(host);

	return host;
}

afterEach(() => {
	for (const host of hosts.splice(0)) {
		host.remove();
	}
});

function layer(): HTMLElement {
	return slot('drawer-layer') as HTMLElement;
}

type Container = HTMLElement | RefObject<HTMLElement | null> | null | undefined;

function DrawerIn({
	container,
	type = 'task',
	children,
	onClose = () => {},
}: {
	container: Container;
	type?: DrawerTypeType;
	children?: ReactNode;
	onClose?: (reason: string) => void;
}): ReactNode {
	return (
		<Drawer
			type={type}
			stack="overlay"
			open
			title="Edit member"
			testId="drawer"
			container={container}
			onClose={(reason) => onClose(reason)}
		>
			{children ?? <input aria-label="Name" />}
		</Drawer>
	);
}

async function settle(): Promise<HTMLElement> {
	const panel = await screen.findByRole('dialog', { name: 'Edit member' });

	await waitFor(() => {
		expect(panel.contains(document.activeElement)).toBe(true);
	});
	await waitForSettled();

	return panel;
}

describe('Drawer container', () => {
	it('renders the layer, the backdrop and the panel of a task inside the element it is given', async () => {
		const host = createHost();
		const { container } = render(<DrawerIn container={host} />);

		const panel = await settle();

		expect(host).toContainElement(panel);
		expect(host).toContainElement(screen.getByTestId('drawer-backdrop'));
		expect(host).toContainElement(layer());
		expect(layer()).toContainElement(panel);
		expect(container).not.toContainElement(panel);
		expect(host.querySelectorAll('[data-slot="drawer-layer"]')).toHaveLength(1);
	});

	it('renders the layer and the panel of an inspector inside the element it is given', async () => {
		const host = createHost();
		render(<DrawerIn container={host} type="inspector" />);

		const panel = await settle();

		expect(host).toContainElement(panel);
		expect(layer()).toContainElement(panel);
		expect(host).toContainElement(layer());
		expect(slot('drawer-backdrop')).toBeNull();
	});

	it('renders inside the element a ref points to', async () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<>
				<div ref={ref} data-testid="host" />
				<DrawerIn container={ref} />
			</>,
		);

		const panel = await settle();

		expect(screen.getByTestId('host')).toContainElement(panel);
		expect(screen.getByTestId('host')).toContainElement(screen.getByTestId('drawer-backdrop'));
	});

	it('renders in document.body when container is not passed, not in another element', async () => {
		const host = createHost();
		const { container } = render(<DrawerIn container={undefined} />);

		const panel = await settle();

		expect(document.body).toContainElement(panel);
		expect(host).not.toContainElement(panel);
		expect(container).not.toContainElement(panel);
		expect(document.body).toContainElement(screen.getByTestId('drawer-backdrop'));
	});

	it('waits for the element while container is null, then renders in it', async () => {
		const host = createHost();
		const { rerender } = render(<DrawerIn container={null} />);

		await act(async () => {});

		expect(screen.queryByRole('dialog')).toBeNull();
		expect(slot('drawer-layer')).toBeNull();

		rerender(<DrawerIn container={host} />);

		expect(host).toContainElement(await settle());
	});

	it.each(TYPES)('leaves nothing in the container once a %s closes', async (type) => {
		const host = createHost();
		const { rerender } = render(<DrawerIn container={host} type={type} />);
		await settle();

		rerender(
			<Drawer
				type={type}
				stack="overlay"
				open={false}
				title="Edit member"
				container={host}
				onClose={() => {}}
			>
				Body
			</Drawer>,
		);
		await waitForClosed();

		expect(host.querySelector('[data-slot="drawer-layer"]')).toBeNull();
		expect(host.querySelector('[data-slot="drawer-popup"]')).toBeNull();
		expect(host.querySelector('[data-slot="drawer-backdrop"]')).toBeNull();
	});

	it.each(TYPES)(
		'paints the panel of a %s on top, and keeps its content clickable',
		async (type) => {
			const host = createHost();
			render(<DrawerIn container={host} type={type} />);

			const panel = await settle();

			expect(isOnTop(screen.getByTestId('drawer-title'))).toBe(true);
			expect(isOnTop(panel)).toBe(true);

			await userEvent.click(screen.getByRole('textbox', { name: 'Name' }));

			expect(screen.getByRole('textbox', { name: 'Name' })).toHaveFocus();
		},
	);

	it('closes on Esc, on a press on the backdrop and on the close button, and says why', async () => {
		const host = createHost();
		const onClose = vi.fn();
		render(<DrawerIn container={host} onClose={onClose} />);
		await settle();

		await userEvent.keyboard('{Escape}');
		await userEvent.click(screen.getByTestId('drawer-backdrop'));
		await userEvent.click(screen.getByRole('button', { name: 'Close' }));

		expect(onClose.mock.calls.map(([reason]) => reason)).toEqual([
			'escape-key',
			'outside-press',
			'close-press',
		]);
	});

	it('does not count a press inside the panel as an outside press', async () => {
		const host = createHost();
		const onClose = vi.fn();
		render(<DrawerIn container={host} onClose={onClose} />);
		await settle();

		await userEvent.click(screen.getByTestId('drawer-title'));
		await userEvent.click(screen.getByTestId('drawer-body'));

		expect(onClose).not.toHaveBeenCalled();
	});

	it('shows from a handle inside the container, and closes through it', async () => {
		const host = createHost();
		const onOpenChange = vi.fn();
		function RowDrawer(): ReactNode {
			const handle = useDrawerHandle<{ name: string }>(onOpenChange);

			return (
				<>
					<button type="button" onClick={() => handle.open({ name: 'Ada Lovelace' })}>
						Open row
					</button>
					<Drawer
						handle={handle}
						type="inspector"
						stack="overlay"
						title="Edit member"
						testId="drawer"
						container={host}
					>
						{(row) => <p>Row: {row.name}</p>}
					</Drawer>
				</>
			);
		}
		render(<RowDrawer />);

		await userEvent.click(screen.getByRole('button', { name: 'Open row' }));
		const panel = await settle();

		expect(host).toContainElement(panel);
		expect(panel).toHaveTextContent('Row: Ada Lovelace');

		await userEvent.keyboard('{Escape}');
		await waitForClosed();

		expect(onOpenChange.mock.calls).toEqual([[true], [false]]);
		expect(host.querySelector('[data-slot="drawer-layer"]')).toBeNull();
	});
});

describe('Drawer container with popups opened inside the panel', () => {
	it.each(TYPES)(
		'portals a popover into the panel of a %s, not into the container or the body',
		async (type) => {
			const host = createHost();
			render(
				<DrawerIn container={host} type={type}>
					<Popover
						nativeButton
						side="bottom"
						align="start"
						aria-label="Actions"
						trigger={<button type="button">Open</button>}
					>
						<button type="button">Rename</button>
					</Popover>
				</DrawerIn>,
			);
			await settle();

			await userEvent.click(screen.getByRole('button', { name: 'Open' }));
			const popover = await screen.findByRole('dialog', { name: 'Actions' });

			expect(screen.getByTestId('drawer')).toContainElement(popover);
			expect(slot('popup-container', screen.getByTestId('drawer'))).toContainElement(popover);
			expect(host).toContainElement(popover);
			await waitForOnTop(popover);
			await waitForOnTop(screen.getByRole('button', { name: 'Rename' }));
		},
	);

	it('portals a tooltip into the panel', async () => {
		const host = createHost();
		render(
			<DrawerIn container={host}>
				<Tooltip title="Copies the span id">
					<button type="button">Copy</button>
				</Tooltip>
			</DrawerIn>,
		);
		await settle();

		await userEvent.hover(screen.getByRole('button', { name: 'Copy' }));
		const tooltip = await screen.findByRole('tooltip');

		expect(screen.getByTestId('drawer')).toContainElement(tooltip);
		await waitForOnTop(tooltip);
	});

	it('does not count a press on a popover opened from the panel as an outside press', async () => {
		const host = createHost();
		const onClose = vi.fn();
		render(
			<DrawerIn container={host} onClose={onClose}>
				<Popover
					nativeButton
					side="bottom"
					align="start"
					aria-label="Actions"
					trigger={<button type="button">Open</button>}
				>
					<button type="button">Rename</button>
				</Popover>
			</DrawerIn>,
		);
		await settle();
		await userEvent.click(screen.getByRole('button', { name: 'Open' }));
		await screen.findByRole('dialog', { name: 'Actions' });

		await userEvent.click(screen.getByRole('button', { name: 'Rename' }));

		expect(onClose).not.toHaveBeenCalled();
	});
});
