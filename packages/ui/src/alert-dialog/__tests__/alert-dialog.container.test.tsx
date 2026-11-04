import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, type ReactNode, type RefObject } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { isOnTop, slot } from '../../dialog/__tests__/dialog.test-utils.js';
import { DialogHandle } from '../../dialog/dialog-handle.js';
import { AlertDialog } from '../index.js';
import {
	cancelButton,
	confirmButton,
	waitForClosed,
	waitForSettled,
} from './alert-dialog.test-utils.js';

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
	return slot('alert-dialog-layer') as HTMLElement;
}

type Container = HTMLElement | RefObject<HTMLElement | null> | null | undefined;

function AlertIn({
	container,
	onCancel = () => {},
}: {
	container: Container;
	onCancel?: () => void;
}): ReactNode {
	return (
		<AlertDialog
			open
			title="Delete this view?"
			color="danger"
			confirmText="Delete view"
			testId="alert"
			container={container}
			onConfirm={() => {}}
			onCancel={onCancel}
		>
			Gone for good.
		</AlertDialog>
	);
}

async function settle(): Promise<HTMLElement> {
	const panel = await screen.findByRole('alertdialog');

	await waitFor(() => {
		expect(panel.contains(document.activeElement)).toBe(true);
	});
	await waitForSettled();

	return panel;
}

describe('AlertDialog container', () => {
	it('renders the layer, the backdrop and the panel inside the element it is given', async () => {
		const host = createHost();
		const { container } = render(<AlertIn container={host} />);

		const panel = await settle();

		expect(host).toContainElement(panel);
		expect(host).toContainElement(screen.getByTestId('alert-backdrop'));
		expect(host).toContainElement(layer());
		expect(layer()).toContainElement(panel);
		expect(container).not.toContainElement(panel);
		expect(host.querySelectorAll('[data-slot="alert-dialog-layer"]')).toHaveLength(1);
	});

	it('renders inside the element a ref points to', async () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<>
				<div ref={ref} data-testid="host" />
				<AlertIn container={ref} />
			</>,
		);

		const panel = await settle();

		expect(screen.getByTestId('host')).toContainElement(panel);
		expect(screen.getByTestId('host')).toContainElement(screen.getByTestId('alert-backdrop'));
	});

	it('renders in document.body when container is not passed, not in another element', async () => {
		const host = createHost();
		const { container } = render(<AlertIn container={undefined} />);

		const panel = await settle();

		expect(document.body).toContainElement(panel);
		expect(host).not.toContainElement(panel);
		expect(container).not.toContainElement(panel);
	});

	it('waits for the element while container is null, then renders in it', async () => {
		const host = createHost();
		const { rerender } = render(<AlertIn container={null} />);

		await act(async () => {});

		expect(screen.queryByRole('alertdialog')).toBeNull();
		expect(slot('alert-dialog-layer')).toBeNull();

		rerender(<AlertIn container={host} />);

		expect(host).toContainElement(await settle());
	});

	it('answers on Esc and on the cancel button, and paints on top', async () => {
		const host = createHost();
		const onCancel = vi.fn();
		render(<AlertIn container={host} onCancel={onCancel} />);
		await settle();

		expect(isOnTop(cancelButton())).toBe(true);
		expect(isOnTop(confirmButton())).toBe(true);
		expect(screen.getByRole('alertdialog')).toHaveFocus();

		await userEvent.keyboard('{Escape}');
		await userEvent.click(cancelButton());

		expect(onCancel).toHaveBeenCalledTimes(2);
	});

	it('does nothing on a press on the backdrop', async () => {
		const host = createHost();
		const onCancel = vi.fn();
		render(<AlertIn container={host} onCancel={onCancel} />);
		await settle();

		await userEvent.click(screen.getByTestId('alert-backdrop'));

		expect(onCancel).not.toHaveBeenCalled();
		expect(screen.getByRole('alertdialog')).toBeInTheDocument();
	});

	it('shows from a handle inside the container, and closes itself once confirmed', async () => {
		const host = createHost();
		const handle = new DialogHandle<{ name: string }>();
		const onConfirm = vi.fn();
		render(
			<AlertDialog
				handle={handle}
				title="Delete this view?"
				color="danger"
				confirmText="Delete view"
				testId="alert"
				container={host}
				onConfirm={onConfirm}
			>
				{(row: { name: string }) => <>Gone: {row.name}</>}
			</AlertDialog>,
		);

		act(() => handle.open({ name: 'Latency overview' }));
		const panel = await settle();

		expect(host).toContainElement(panel);
		expect(panel).toHaveTextContent('Gone: Latency overview');

		await userEvent.click(confirmButton());
		await waitForClosed();

		expect(onConfirm).toHaveBeenCalledExactlyOnceWith({ name: 'Latency overview' });
		expect(handle.isOpen).toBe(false);
		expect(host.querySelector('[data-slot="alert-dialog-layer"]')).toBeNull();
	});

	it('removes the layer from the container when it closes', async () => {
		const host = createHost();
		const { rerender } = render(<AlertIn container={host} />);
		await settle();

		rerender(
			<AlertDialog
				open={false}
				title="Delete this view?"
				color="danger"
				confirmText="Delete view"
				container={host}
				onConfirm={() => {}}
				onCancel={() => {}}
			>
				Gone for good.
			</AlertDialog>,
		);
		await waitForClosed();

		expect(host.children).toHaveLength(0);
	});
});
