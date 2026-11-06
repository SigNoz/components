import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, type ReactNode, type RefObject } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Popover } from '../../popover/index.js';
import { Tooltip } from '../../tooltip/index.js';
import { Dialog } from '../dialog.js';
import { DialogHandle } from '../dialog-handle.js';
import { isOnTop, slot, waitForClosed, waitForSettled, waitForOnTop } from './dialog.test-utils.js';

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
	return slot('dialog-layer') as HTMLElement;
}

type Container = HTMLElement | RefObject<HTMLElement | null> | null | undefined;

function DialogIn({
	container,
	children,
	onClose = () => {},
}: {
	container: Container;
	children?: ReactNode;
	onClose?: (reason: string) => void;
}): ReactNode {
	return (
		<Dialog
			open
			title="Rename view"
			testId="dialog"
			container={container}
			onClose={(reason) => onClose(reason)}
		>
			{children ?? <input aria-label="Name" />}
		</Dialog>
	);
}

async function settle(): Promise<HTMLElement> {
	const panel = await screen.findByRole('dialog');

	await waitFor(() => {
		expect(panel.contains(document.activeElement)).toBe(true);
	});
	await waitForSettled();

	return panel;
}

describe('Dialog container', () => {
	it('renders the layer, the backdrop and the panel inside the element it is given', async () => {
		const host = createHost();
		const { container } = render(<DialogIn container={host} />);

		const panel = await settle();

		expect(host).toContainElement(panel);
		expect(host).toContainElement(screen.getByTestId('dialog-backdrop'));
		expect(host).toContainElement(layer());
		expect(layer()).toContainElement(panel);
		expect(container).not.toContainElement(panel);
		expect(host.querySelectorAll('[data-slot="dialog-layer"]')).toHaveLength(1);
	});

	it('renders inside the element a ref points to', async () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<>
				<div ref={ref} data-testid="host" />
				<DialogIn container={ref} />
			</>,
		);

		const panel = await settle();

		expect(screen.getByTestId('host')).toContainElement(panel);
		expect(screen.getByTestId('host')).toContainElement(screen.getByTestId('dialog-backdrop'));
	});

	it('renders in document.body when container is not passed, not in another element', async () => {
		const host = createHost();
		const { container } = render(<DialogIn container={undefined} />);

		const panel = await settle();

		expect(document.body).toContainElement(panel);
		expect(host).not.toContainElement(panel);
		expect(container).not.toContainElement(panel);
		expect(document.body).toContainElement(screen.getByTestId('dialog-backdrop'));
	});

	it('waits for the element while container is null, then renders in it', async () => {
		const host = createHost();
		const { rerender } = render(<DialogIn container={null} />);

		await act(async () => {});

		expect(screen.queryByRole('dialog')).toBeNull();
		expect(slot('dialog-layer')).toBeNull();

		rerender(<DialogIn container={host} />);

		expect(host).toContainElement(await settle());
	});

	it('leaves nothing in the container once it closes', async () => {
		const host = createHost();
		const { rerender } = render(<DialogIn container={host} />);
		await settle();

		rerender(
			<Dialog open={false} title="Rename view" container={host} onClose={() => {}}>
				Body
			</Dialog>,
		);
		await waitForClosed();

		expect(host.querySelector('[data-slot="dialog-layer"]')).toBeNull();
		expect(host.querySelector('[data-slot="dialog-popup"]')).toBeNull();
	});

	it('paints the panel on top, and keeps its content clickable', async () => {
		const host = createHost();
		render(<DialogIn container={host} />);

		const panel = await settle();

		expect(isOnTop(screen.getByTestId('dialog-title'))).toBe(true);
		expect(isOnTop(panel)).toBe(true);

		await userEvent.click(screen.getByRole('textbox', { name: 'Name' }));

		expect(screen.getByRole('textbox', { name: 'Name' })).toHaveFocus();
	});

	it('closes on Esc, on a press on the backdrop and on the close button, and says why', async () => {
		const host = createHost();
		const onClose = vi.fn();
		render(<DialogIn container={host} onClose={onClose} />);
		await settle();

		await userEvent.keyboard('{Escape}');
		await userEvent.click(screen.getByTestId('dialog-backdrop'));
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
		render(<DialogIn container={host} onClose={onClose} />);
		await settle();

		await userEvent.click(screen.getByTestId('dialog-title'));
		await userEvent.click(screen.getByTestId('dialog-body'));

		expect(onClose).not.toHaveBeenCalled();
	});

	it('shows from a handle inside the container, and closes through it', async () => {
		const host = createHost();
		const handle = new DialogHandle<{ name: string }>();
		render(
			<Dialog handle={handle} title="Rename view" testId="dialog" container={host}>
				{(row: { name: string }) => <p>Row: {row.name}</p>}
			</Dialog>,
		);

		act(() => handle.open({ name: 'Latency overview' }));
		const panel = await settle();

		expect(host).toContainElement(panel);
		expect(panel).toHaveTextContent('Row: Latency overview');

		await userEvent.keyboard('{Escape}');
		await waitForClosed();

		expect(handle.isOpen).toBe(false);
		expect(host.querySelector('[data-slot="dialog-layer"]')).toBeNull();
	});
});

describe('Dialog container with popups opened inside the panel', () => {
	it('portals a popover into the panel, not into the container or the body', async () => {
		const host = createHost();
		render(
			<DialogIn container={host}>
				<Popover
					nativeButton
					side="bottom"
					align="start"
					aria-label="Actions"
					trigger={<button type="button">Open</button>}
				>
					<button type="button">Rename</button>
				</Popover>
			</DialogIn>,
		);
		await settle();

		await userEvent.click(screen.getByRole('button', { name: 'Open' }));
		const popover = await screen.findByRole('dialog', { name: 'Actions' });

		expect(screen.getByTestId('dialog')).toContainElement(popover);
		expect(host).toContainElement(popover);
		await waitForOnTop(popover);
		await waitForOnTop(screen.getByRole('button', { name: 'Rename' }));
	});

	it('portals a tooltip into the panel', async () => {
		const host = createHost();
		render(
			<DialogIn container={host}>
				<Tooltip title="Copies the span id">
					<button type="button">Copy</button>
				</Tooltip>
			</DialogIn>,
		);
		await settle();

		await userEvent.hover(screen.getByRole('button', { name: 'Copy' }));
		const tooltip = await screen.findByRole('tooltip');

		expect(screen.getByTestId('dialog')).toContainElement(tooltip);
		await waitForOnTop(tooltip);
	});

	it('does not count a press on a popover opened from the panel as an outside press', async () => {
		const host = createHost();
		const onClose = vi.fn();
		render(
			<DialogIn container={host} onClose={onClose}>
				<Popover
					nativeButton
					side="bottom"
					align="start"
					aria-label="Actions"
					trigger={<button type="button">Open</button>}
				>
					<button type="button">Rename</button>
				</Popover>
			</DialogIn>,
		);
		await settle();
		await userEvent.click(screen.getByRole('button', { name: 'Open' }));
		await screen.findByRole('dialog', { name: 'Actions' });

		await userEvent.click(screen.getByRole('button', { name: 'Rename' }));

		expect(onClose).not.toHaveBeenCalled();
	});
});
