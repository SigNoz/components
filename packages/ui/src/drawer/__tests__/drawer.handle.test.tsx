import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ReactNode, useEffect, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Drawer } from '../drawer.js';
import type { DrawerHandleType, DrawerTypeType } from '../types.js';
import { useDrawerHandle } from '../use-drawer-handle.js';
import {
	drawerPanel,
	OPENER_NAME,
	opener,
	openFromButton,
	slot,
	waitForClosed,
	waitForSettled,
} from './drawer.test-utils.js';

interface Row {
	name: string;
}

const LATENCY: Row = { name: 'Latency overview' };
const ERRORS: Row = { name: 'Errors by service' };
const SLOW: Row = { name: 'Slow queries' };
const ROWS: Row[] = [LATENCY, ERRORS, SLOW];

interface HandleRef {
	current: DrawerHandleType<Row> | null;
}

function handleOf(ref: HandleRef): DrawerHandleType<Row> {
	return ref.current as DrawerHandleType<Row>;
}

function RowBody({ row }: { row: Row }): ReactNode {
	return (
		<>
			<p>Row: {row.name}</p>
			<input aria-label="Name" />
		</>
	);
}

interface DrawerHandleHarnessProps {
	handleRef?: HandleRef;
	type?: DrawerTypeType;
	onOpenChange?: (open: boolean) => void;
	renderRow?: (row: Row) => ReactNode;
}

/**
 * One drawer declared once, opened from a button that sits outside of it, the way a row of a
 * table opens it.
 */
function DrawerHandleHarness({
	handleRef,
	type = 'task',
	onOpenChange,
	renderRow = (row) => <RowBody row={row} />,
}: DrawerHandleHarnessProps): ReactNode {
	const handle = useDrawerHandle<Row>(onOpenChange);

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
			<Drawer handle={handle} type={type} title="Log details" testId="drawer">
				{(row: Row) => renderRow(row)}
			</Drawer>
		</>
	);
}

async function renderHarness(props: DrawerHandleHarnessProps = {}): Promise<HandleRef> {
	const handleRef: HandleRef = props.handleRef ?? { current: null };

	render(<DrawerHandleHarness {...props} handleRef={handleRef} />);
	await waitFor(() => {
		expect(handleRef.current).not.toBeNull();
	});

	return handleRef;
}

async function openWith(handle: DrawerHandleType<Row>, row: Row): Promise<void> {
	act(() => handle.open(row));
	await waitFor(() => {
		expect(drawerPanel().contains(document.activeElement)).toBe(true);
	});
	await waitForSettled();
}

const CLOSERS: Array<[name: string, close: () => Promise<void>]> = [
	[
		'Esc',
		async () => {
			await userEvent.keyboard('{Escape}');
		},
	],
	['a press on the backdrop', async () => userEvent.click(screen.getByTestId('drawer-backdrop'))],
	['the close button', async () => userEvent.click(screen.getByRole('button', { name: 'Close' }))],
];

describe('Drawer with a handle', () => {
	it('shows nothing until the handle opens it', async () => {
		const handleRef = await renderHarness();

		expect(screen.queryByRole('dialog')).toBeNull();
		expect(slot('drawer-popup')).toBeNull();
		expect(slot('drawer-backdrop')).toBeNull();
		expect(handleOf(handleRef).isOpen).toBe(false);
	});

	it('opens from a button outside of it and renders the payload through children', async () => {
		await renderHarness();

		await openFromButton();

		expect(screen.getByRole('dialog', { name: 'Log details' })).toBeInTheDocument();
		expect(screen.getByTestId('drawer-body')).toHaveTextContent('Row: Latency overview');
	});

	it('opens from code that runs outside of React, with no button', async () => {
		const handleRef = await renderHarness();

		await openWith(handleOf(handleRef), ERRORS);

		expect(screen.getByTestId('drawer-body')).toHaveTextContent('Row: Errors by service');
		expect(screen.getByRole('dialog', { name: 'Log details' })).toHaveFocus();
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
		const panel = drawerPanel();

		act(() => handleOf(handleRef).open(ERRORS));

		await waitFor(() => {
			expect(screen.getByTestId('drawer-body')).toHaveTextContent('Row: Errors by service');
		});
		expect(screen.getAllByRole('dialog')).toHaveLength(1);
		expect(drawerPanel()).toBe(panel);
		expect(panel).toHaveAttribute('data-open');
		expect(panel).not.toHaveAttribute('data-starting-style');
		expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(true);
	});

	it('closes from handle.close(), and keeps the last payload on screen while it leaves', async () => {
		const handleRef = await renderHarness();
		await openFromButton();

		act(() => handleOf(handleRef).close());

		expect(drawerPanel()).toHaveAttribute('data-closed');
		expect(drawerPanel()).toHaveTextContent('Row: Latency overview');

		await waitForClosed();

		expect(screen.queryByRole('dialog')).toBeNull();
		expect(slot('drawer-backdrop')).toBeNull();
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
			const handle = useDrawerHandle();

			return (
				<>
					<button type="button" onClick={() => handle.open()}>
						{OPENER_NAME}
					</button>
					<Drawer handle={handle} type="task" title="Log details" testId="drawer">
						<p>Static body</p>
					</Drawer>
				</>
			);
		}
		render(<Static />);

		await openFromButton();

		expect(screen.getByTestId('drawer-body')).toHaveTextContent('Static body');
	});

	it('opens a handle without a payload with no argument, and calls children with nothing', async () => {
		const received: unknown[] = [];
		function Plain(): ReactNode {
			const handle = useDrawerHandle();

			return (
				<>
					<button type="button" onClick={() => handle.open()}>
						{OPENER_NAME}
					</button>
					<Drawer handle={handle} type="task" title="Log details" testId="drawer">
						{(payload: void) => {
							received.push(payload);

							return <p>No payload</p>;
						}}
					</Drawer>
				</>
			);
		}
		render(<Plain />);

		await openFromButton();

		expect(screen.getByTestId('drawer-body')).toHaveTextContent('No payload');
		expect(received.length).toBeGreaterThan(0);
		expect(received.every((payload) => payload === undefined)).toBe(true);
	});
});

describe('Drawer with a handle closing', () => {
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

	it('closes itself from handle.close() called inside its content, such as a save', async () => {
		const onOpenChange = vi.fn();
		function SavesAndCloses(): ReactNode {
			const handle = useDrawerHandle<Row>(onOpenChange);

			return (
				<>
					<button type="button" onClick={() => handle.open(LATENCY)}>
						{OPENER_NAME}
					</button>
					<Drawer
						handle={handle}
						type="task"
						title="Log details"
						testId="drawer"
						footerSuffix={
							<button type="button" onClick={() => handle.close()}>
								Save
							</button>
						}
					>
						{(row: Row) => <RowBody row={row} />}
					</Drawer>
				</>
			);
		}
		render(<SavesAndCloses />);
		await openFromButton();

		await userEvent.click(screen.getByRole('button', { name: 'Save' }));
		await waitForClosed();

		expect(onOpenChange.mock.calls).toEqual([[true], [false]]);
		expect(opener()).toHaveFocus();
	});

	it('does not count a press inside the panel as an outside press', async () => {
		const onOpenChange = vi.fn();
		await renderHarness({ onOpenChange });
		await openFromButton();

		await userEvent.click(screen.getByTestId('drawer-title'));
		await userEvent.click(screen.getByTestId('drawer-body'));
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

		expect(screen.getByTestId('drawer-body')).toHaveTextContent('Row: Latency overview');
	});
});

describe('Drawer with a handle and onOpenChange', () => {
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

	it('reports the open as handle.open() returns, before the panel renders', () => {
		const onOpenChange = vi.fn();
		const handleRef: HandleRef = { current: null };
		render(<DrawerHandleHarness handleRef={handleRef} onOpenChange={onOpenChange} />);

		act(() => {
			handleOf(handleRef).open(LATENCY);

			expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(true);
			expect(slot('drawer-popup')).toBeNull();
		});
	});

	it('reports the close as handle.close() returns, while the panel still plays its exit', async () => {
		const onOpenChange = vi.fn();
		const handleRef = await renderHarness({ onOpenChange });
		await openFromButton();

		act(() => handleOf(handleRef).close());

		expect(onOpenChange.mock.calls).toEqual([[true], [false]]);
		expect(drawerPanel()).toHaveAttribute('data-closed');

		await waitForClosed();

		expect(onOpenChange).toHaveBeenCalledTimes(2);
	});

	describe("opened from an effect of a child, which runs before the owner's effects", () => {
		interface OwnerProps {
			onOpenChange: (open: boolean) => void;
			openOnMount: boolean;
		}

		function OpensInEffect({ handle, when }: { handle: DrawerHandleType<Row>; when: boolean }) {
			useEffect(() => {
				if (when) {
					handle.open(LATENCY);
				}
			}, [handle, when]);

			return null;
		}

		function Owner({ onOpenChange, openOnMount }: OwnerProps): ReactNode {
			const handle = useDrawerHandle<Row>(onOpenChange);

			return (
				<>
					<OpensInEffect handle={handle} when={openOnMount} />
					<Drawer handle={handle} type="task" title="Log details" testId="drawer">
						{(row: Row) => <RowBody row={row} />}
					</Drawer>
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
		const { rerender } = render(<DrawerHandleHarness handleRef={handleRef} onOpenChange={first} />);

		rerender(<DrawerHandleHarness handleRef={handleRef} onOpenChange={second} />);
		act(() => handleOf(handleRef).open(LATENCY));

		expect(first).not.toHaveBeenCalled();
		expect(second).toHaveBeenCalledExactlyOnceWith(true);
	});
});

interface InspectorHarnessProps {
	onOpenChange?: (open: boolean) => void;
	onPagePress?: () => void;
}

/**
 * A list of rows on the page and one inspector on a handle: a row opens it, and the ↑/↓ buttons
 * in its header step through the rows without closing it.
 */
function InspectorHarness({ onOpenChange, onPagePress }: InspectorHarnessProps): ReactNode {
	const handle = useDrawerHandle<Row>(onOpenChange);
	const [index, setIndex] = useState(0);
	const show = (next: number): void => {
		setIndex(next);
		handle.open(ROWS[next] as Row);
	};

	return (
		<>
			<ul aria-label="Rows">
				{ROWS.map((row, rowIndex) => (
					<li key={row.name}>
						<button type="button" onClick={() => show(rowIndex)}>
							{row.name}
						</button>
					</li>
				))}
			</ul>
			<button type="button" onClick={onPagePress}>
				Refresh
			</button>
			<Drawer
				handle={handle}
				type="inspector"
				title="Log details"
				testId="drawer"
				headerPrefix={
					<>
						<button
							type="button"
							aria-label="Previous"
							disabled={index === 0}
							onClick={() => show(index - 1)}
						>
							↑
						</button>
						<button
							type="button"
							aria-label="Next"
							disabled={index === ROWS.length - 1}
							onClick={() => show(index + 1)}
						>
							↓
						</button>
					</>
				}
			>
				{(row: Row) => <RowBody row={row} />}
			</Drawer>
		</>
	);
}

async function openRow(name: string): Promise<void> {
	await userEvent.click(within(screen.getByRole('list', { name: 'Rows' })).getByText(name));
	await waitFor(() => {
		expect(drawerPanel().contains(document.activeElement)).toBe(true);
	});
	await waitForSettled();
}

describe('Drawer with a handle driving an inspector', () => {
	it('opens from a row of the page, with no backdrop and no aria-modal', async () => {
		render(<InspectorHarness />);

		await openRow('Latency overview');

		expect(screen.getByRole('dialog', { name: 'Log details' })).not.toHaveAttribute('aria-modal');
		expect(slot('drawer-backdrop')).toBeNull();
		expect(screen.getByTestId('drawer-body')).toHaveTextContent('Row: Latency overview');
	});

	it('steps through the rows with ↑/↓, in the same panel and with the focus kept on the button', async () => {
		const onOpenChange = vi.fn();
		render(<InspectorHarness onOpenChange={onOpenChange} />);
		await openRow('Latency overview');
		const panel = drawerPanel();

		await userEvent.click(screen.getByRole('button', { name: 'Next' }));

		expect(screen.getByTestId('drawer-body')).toHaveTextContent('Row: Errors by service');
		expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus();

		await userEvent.click(screen.getByRole('button', { name: 'Next' }));

		expect(screen.getByTestId('drawer-body')).toHaveTextContent('Row: Slow queries');
		expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();

		await userEvent.click(screen.getByRole('button', { name: 'Previous' }));

		expect(screen.getByTestId('drawer-body')).toHaveTextContent('Row: Errors by service');
		expect(screen.getByRole('button', { name: 'Previous' })).toHaveFocus();
		expect(drawerPanel()).toBe(panel);
		expect(panel).toHaveAttribute('data-open');
		expect(panel).not.toHaveAttribute('data-ending-style');
		expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(true);
	});

	it('swaps the record in place when another row of the page is pressed while it is open', async () => {
		const onOpenChange = vi.fn();
		render(<InspectorHarness onOpenChange={onOpenChange} />);
		await openRow('Latency overview');
		const panel = drawerPanel();

		await userEvent.click(screen.getByRole('button', { name: 'Slow queries' }));

		expect(screen.getByTestId('drawer-body')).toHaveTextContent('Row: Slow queries');
		expect(drawerPanel()).toBe(panel);
		expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(true);
	});

	it('stays open on a press on the page behind it', async () => {
		const onOpenChange = vi.fn();
		const onPagePress = vi.fn();
		render(<InspectorHarness onOpenChange={onOpenChange} onPagePress={onPagePress} />);
		await openRow('Latency overview');

		await userEvent.click(screen.getByRole('button', { name: 'Refresh' }));
		await userEvent.click(document.body);

		expect(onPagePress).toHaveBeenCalledOnce();
		expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(true);
		expect(drawerPanel()).toHaveAttribute('data-open');
	});

	// An inspector has no backdrop to press.
	it.each(CLOSERS.filter(([name]) => name !== 'a press on the backdrop'))(
		'closes itself on %s and reports it through onOpenChange',
		async (_name, close) => {
			const onOpenChange = vi.fn();
			render(<InspectorHarness onOpenChange={onOpenChange} />);
			await openRow('Latency overview');

			await close();
			await waitForClosed();

			expect(onOpenChange.mock.calls).toEqual([[true], [false]]);
			expect(screen.getByRole('button', { name: 'Latency overview' })).toHaveFocus();
		},
	);
});
