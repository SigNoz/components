import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ReactNode, useEffect } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Dialog } from '../dialog.js';
import type { DialogHandle } from '../dialog-handle.js';
import { useDialogHandle } from '../use-dialog-handle.js';
import {
	OPENER_NAME,
	opener,
	openFromButton,
	slot,
	waitForClosed,
	waitForSettled,
} from './dialog.test-utils.js';

interface Row {
	name: string;
}

const LATENCY: Row = { name: 'Latency overview' };
const ERRORS: Row = { name: 'Errors by service' };

interface HandleRef {
	current: DialogHandle<Row> | null;
}

function handleOf(ref: HandleRef): DialogHandle<Row> {
	return ref.current as DialogHandle<Row>;
}

interface DefaultRowProps {
	row: Row;
}

function RowBody({ row }: DefaultRowProps): ReactNode {
	return (
		<>
			<p>Row: {row.name}</p>
			<input aria-label="Name" />
		</>
	);
}

interface DialogHarnessProps {
	handleRef?: HandleRef;
	onOpenChange?: (open: boolean) => void;
	renderRow?: (row: Row) => ReactNode;
}

/**
 * One dialog declared once, opened from a button that sits outside of it, the way a row action
 * in a table opens it.
 */
function DialogHandleHarness({
	handleRef,
	onOpenChange,
	renderRow = (row) => <RowBody row={row} />,
}: DialogHarnessProps): ReactNode {
	const handle = useDialogHandle<Row>(onOpenChange);

	useEffect(() => {
		if (handleRef) {
			handleRef.current = handle;
		}
	}, [handle, handleRef]);

	return (
		<>
			<button type="button" onClick={() => handle.open(LATENCY)}>
				{OPENER_NAME}
			</button>
			<Dialog handle={handle} title="Edit view" testId="dialog">
				{(row: Row) => renderRow(row)}
			</Dialog>
		</>
	);
}

async function renderHarness(props: DialogHarnessProps = {}): Promise<HandleRef> {
	const handleRef: HandleRef = props.handleRef ?? { current: null };

	render(<DialogHandleHarness {...props} handleRef={handleRef} />);
	await waitFor(() => {
		expect(handleRef.current).not.toBeNull();
	});

	return handleRef;
}

async function openWith(handle: DialogHandle<Row>, row: Row): Promise<void> {
	act(() => handle.open(row));
	await waitFor(() => {
		expect(screen.getByRole('dialog').contains(document.activeElement)).toBe(true);
	});
	await waitForSettled();
}

async function pressBackdrop(): Promise<void> {
	await userEvent.click(screen.getByTestId('dialog-backdrop'));
}

const CLOSERS: Array<[name: string, close: () => Promise<void>]> = [
	[
		'Esc',
		async () => {
			await userEvent.keyboard('{Escape}');
		},
	],
	['a press on the backdrop', pressBackdrop],
	['the close button', async () => userEvent.click(screen.getByRole('button', { name: 'Close' }))],
];

describe('Dialog with a handle', () => {
	it('shows nothing until the handle opens it', async () => {
		const handleRef = await renderHarness();

		expect(screen.queryByRole('dialog')).toBeNull();
		expect(slot('dialog-backdrop')).toBeNull();
		expect(handleOf(handleRef).isOpen).toBe(false);
	});

	it('opens from a button outside of it and renders the payload through children', async () => {
		await renderHarness();

		await openFromButton();

		expect(screen.getByRole('dialog', { name: 'Edit view' })).toBeInTheDocument();
		expect(screen.getByTestId('dialog-body')).toHaveTextContent('Row: Latency overview');
	});

	it('opens from code that runs outside of React, with no button', async () => {
		const handleRef = await renderHarness();

		await openWith(handleOf(handleRef), ERRORS);

		expect(screen.getByTestId('dialog-body')).toHaveTextContent('Row: Errors by service');
		expect(screen.getByRole('dialog', { name: 'Edit view' })).toHaveFocus();
	});

	it('does not call the children function before the first open, nor without a payload', async () => {
		const renderRow = vi.fn((row: Row) => <p>Row: {row.name}</p>);
		const handleRef = await renderHarness({ renderRow });

		expect(renderRow).not.toHaveBeenCalled();

		await openWith(handleOf(handleRef), LATENCY);
		await userEvent.keyboard('{Escape}');
		await waitForClosed();

		expect(renderRow).toHaveBeenCalled();
		expect(renderRow.mock.calls.every(([row]) => row === LATENCY)).toBe(true);
	});

	it('swaps the content and keeps the panel when it is opened again with another payload', async () => {
		const onOpenChange = vi.fn();
		const handleRef = await renderHarness({ onOpenChange });
		await openFromButton();
		const panel = screen.getByRole('dialog');

		act(() => handleOf(handleRef).open(ERRORS));

		await waitFor(() => {
			expect(screen.getByTestId('dialog-body')).toHaveTextContent('Row: Errors by service');
		});
		expect(screen.getAllByRole('dialog')).toHaveLength(1);
		expect(screen.getByRole('dialog')).toBe(panel);
		expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(true);
	});

	it('closes from handle.close(), and keeps the last payload on screen while it leaves', async () => {
		const handleRef = await renderHarness();
		await openFromButton();

		act(() => handleOf(handleRef).close());

		const panel = screen.getByRole('dialog', { hidden: true });

		expect(panel).toHaveAttribute('data-closed');
		expect(panel).toHaveTextContent('Row: Latency overview');

		await waitForClosed();

		expect(screen.queryByRole('dialog')).toBeNull();
		expect(slot('dialog-backdrop')).toBeNull();
	});

	it('reports whether it is open through handle.isOpen', async () => {
		const handleRef = await renderHarness();
		const handle = handleOf(handleRef);

		expect(handle.isOpen).toBe(false);

		act(() => handle.open(LATENCY));

		expect(handle.isOpen).toBe(true);

		act(() => handle.close());

		expect(handle.isOpen).toBe(false);
	});

	it('unmounts the content on close and keeps no state when it opens again', async () => {
		await renderHarness();
		await openFromButton();
		await userEvent.type(screen.getByRole('textbox', { name: 'Name' }), 'Latency');

		await userEvent.keyboard('{Escape}');
		await waitForClosed();
		await openFromButton();

		expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('');
	});

	it('gives the focus back to the element that opened it', async () => {
		await renderHarness();
		await openFromButton();

		await userEvent.keyboard('{Escape}');
		await waitForClosed();

		expect(opener()).toHaveFocus();
	});

	it('renders children that are not a function as they are', async () => {
		function Static(): ReactNode {
			const handle = useDialogHandle();

			return (
				<>
					<button type="button" onClick={() => handle.open()}>
						{OPENER_NAME}
					</button>
					<Dialog handle={handle} title="Edit view" testId="dialog">
						<p>Static body</p>
					</Dialog>
				</>
			);
		}
		render(<Static />);

		await openFromButton();

		expect(screen.getByTestId('dialog-body')).toHaveTextContent('Static body');
	});

	it('opens a handle without a payload with no argument, and calls children with nothing', async () => {
		const received: unknown[] = [];
		function Plain(): ReactNode {
			const handle = useDialogHandle();

			return (
				<>
					<button type="button" onClick={() => handle.open()}>
						{OPENER_NAME}
					</button>
					<Dialog handle={handle} title="Edit view" testId="dialog">
						{(payload: void) => {
							received.push(payload);

							return <p>No payload</p>;
						}}
					</Dialog>
				</>
			);
		}
		render(<Plain />);

		await openFromButton();

		expect(screen.getByTestId('dialog-body')).toHaveTextContent('No payload');
		expect(received.length).toBeGreaterThan(0);
		expect(received.every((payload) => payload === undefined)).toBe(true);
	});
});

describe('Dialog with a handle closing', () => {
	it.each(CLOSERS)(
		'closes itself on %s and reports it through onOpenChange',
		async (_name, close) => {
			const onOpenChange = vi.fn();
			const handleRef = await renderHarness({ onOpenChange });
			await openFromButton();

			await close();
			await waitForClosed();

			expect(onOpenChange.mock.calls).toEqual([[true], [false]]);
			expect(handleOf(handleRef).isOpen).toBe(false);
			expect(screen.queryByRole('dialog')).toBeNull();
			expect(opener()).toHaveFocus();
		},
	);

	it('does not count a press inside the panel as an outside press', async () => {
		const onOpenChange = vi.fn();
		await renderHarness({ onOpenChange });
		await openFromButton();

		await userEvent.click(screen.getByTestId('dialog-title'));
		await userEvent.click(screen.getByTestId('dialog-body'));
		await userEvent.click(screen.getByRole('textbox', { name: 'Name' }));

		expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(true);
		expect(screen.getByRole('dialog')).toBeInTheDocument();
	});

	it('can be opened again after it closed itself', async () => {
		await renderHarness();
		await openFromButton();
		await userEvent.keyboard('{Escape}');
		await waitForClosed();

		await openFromButton();

		expect(screen.getByTestId('dialog-body')).toHaveTextContent('Row: Latency overview');
	});
});

describe('Dialog with a handle and onOpenChange', () => {
	it('reports every open and close once, whichever caused it', async () => {
		const changes: boolean[] = [];
		const handleRef = await renderHarness({ onOpenChange: (open) => changes.push(open) });
		const handle = handleOf(handleRef);

		await openFromButton();
		await userEvent.keyboard('{Escape}');
		await waitForClosed();

		expect(changes).toEqual([true, false]);

		await openWith(handle, ERRORS);
		act(() => handle.close());
		await waitForClosed();

		expect(changes).toEqual([true, false, true, false]);
	});

	it('does not report a close when it is already closed, nor an open while it is open', async () => {
		const onOpenChange = vi.fn();
		const handleRef = await renderHarness({ onOpenChange });
		const handle = handleOf(handleRef);

		act(() => handle.close());

		expect(onOpenChange).not.toHaveBeenCalled();

		act(() => handle.open(LATENCY));
		act(() => handle.open(ERRORS));

		expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(true);
	});

	describe("opened from an effect of a child, which runs before the owner's effects", () => {
		interface OwnerProps {
			onOpenChange: (open: boolean) => void;
			openOnMount: boolean;
		}

		function OpensInEffect({ handle, when }: { handle: DialogHandle<Row>; when: boolean }) {
			useEffect(() => {
				if (when) {
					handle.open(LATENCY);
				}
			}, [handle, when]);

			return null;
		}

		function Owner({ onOpenChange, openOnMount }: OwnerProps): ReactNode {
			const handle = useDialogHandle<Row>(onOpenChange);

			return (
				<>
					<OpensInEffect handle={handle} when={openOnMount} />
					<Dialog handle={handle} title="Edit view" testId="dialog">
						{(row: Row) => <RowBody row={row} />}
					</Dialog>
				</>
			);
		}

		it('reports an open made on the first mount', async () => {
			const onOpenChange = vi.fn();

			render(<Owner onOpenChange={onOpenChange} openOnMount />);
			await screen.findByRole('dialog');

			expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(true);
		});

		it('reports it to the onOpenChange of the same render', async () => {
			const first = vi.fn();
			const second = vi.fn();
			const { rerender } = render(<Owner onOpenChange={first} openOnMount={false} />);

			rerender(<Owner onOpenChange={second} openOnMount />);
			await screen.findByRole('dialog');

			expect(first).not.toHaveBeenCalled();
			expect(second).toHaveBeenCalledExactlyOnceWith(true);
		});
	});

	it('calls the latest onOpenChange, not the one it was created with', async () => {
		const first = vi.fn();
		const second = vi.fn();
		const handleRef: HandleRef = { current: null };
		const { rerender } = render(<DialogHandleHarness handleRef={handleRef} onOpenChange={first} />);

		rerender(<DialogHandleHarness handleRef={handleRef} onOpenChange={second} />);
		act(() => handleOf(handleRef).open(LATENCY));

		expect(first).not.toHaveBeenCalled();
		expect(second).toHaveBeenCalledExactlyOnceWith(true);
	});
});
