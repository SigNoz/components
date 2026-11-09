import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ReactNode, useEffect } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { OPENER_NAME, opener, slot } from '../../dialog/__tests__/dialog.test-utils.js';
import type { DialogHandle } from '../../dialog/dialog-handle.js';
import { useDialogHandle } from '../../dialog/index.js';
import { AlertDialog } from '../index.js';
import {
	cancelButton,
	confirmButton,
	defer,
	isDisabled,
	isLoading,
	nextTask,
	openFromButton,
	trackUnhandledRejections,
	waitForClosed,
	waitForLoading,
	waitForSettled,
} from './alert-dialog.test-utils.js';

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

interface HarnessProps {
	handleRef?: HandleRef;
	onConfirm?: (row: Row) => Promise<boolean | void> | boolean | void;
	onOpenChange?: (open: boolean) => void;
	renderRow?: (row: Row) => ReactNode;
	mounted?: boolean;
}

/**
 * One alert declared once, opened from a button that sits outside of it, the way a row action in
 * a table opens it.
 */
function HandleHarness({
	handleRef,
	onConfirm = () => {},
	onOpenChange,
	renderRow = (row) => <>Everyone loses access to {row.name}.</>,
	mounted = true,
}: HarnessProps): ReactNode {
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
			{mounted ? (
				<AlertDialog
					handle={handle}
					title="Delete this view?"
					color="danger"
					confirmText="Delete view"
					testId="alert"
					onConfirm={onConfirm}
				>
					{(row: Row) => renderRow(row)}
				</AlertDialog>
			) : null}
		</>
	);
}

async function renderHarness(props: HarnessProps = {}): Promise<HandleRef> {
	const handleRef: HandleRef = props.handleRef ?? { current: null };

	render(<HandleHarness {...props} handleRef={handleRef} />);
	await waitFor(() => {
		expect(handleRef.current).not.toBeNull();
	});

	return handleRef;
}

async function openWith(handle: DialogHandle<Row>, row: Row): Promise<void> {
	act(() => handle.open(row));
	await waitFor(() => {
		expect(screen.getByRole('alertdialog').contains(document.activeElement)).toBe(true);
	});
	await waitForSettled();
}

const unhandled = trackUnhandledRejections();

describe('AlertDialog with a handle', () => {
	it('shows nothing until the handle opens it, and does not call children before that', async () => {
		const renderRow = vi.fn((row: Row) => <>Everyone loses access to {row.name}.</>);
		const handleRef = await renderHarness({ renderRow });

		expect(screen.queryByRole('alertdialog')).toBeNull();
		expect(slot('alert-dialog-backdrop')).toBeNull();
		expect(renderRow).not.toHaveBeenCalled();
		expect(handleOf(handleRef).isOpen).toBe(false);
	});

	it('opens from a button outside of it and renders the payload through children', async () => {
		await renderHarness();

		await openFromButton();

		expect(screen.getByRole('alertdialog', { name: 'Delete this view?' })).toBeInTheDocument();
		expect(screen.getByTestId('alert-body')).toHaveTextContent(
			'Everyone loses access to Latency overview.',
		);
		expect(screen.getByRole('alertdialog', { name: 'Delete this view?' })).toHaveFocus();
	});

	it('opens from code that runs outside of React, with no button', async () => {
		const handleRef = await renderHarness();

		await openWith(handleOf(handleRef), ERRORS);

		expect(screen.getByTestId('alert-body')).toHaveTextContent(
			'Everyone loses access to Errors by service.',
		);
		expect(screen.getByRole('alertdialog', { name: 'Delete this view?' })).toHaveFocus();
	});

	it('only calls children with the payload it was opened with', async () => {
		const renderRow = vi.fn((row: Row) => <>Everyone loses access to {row.name}.</>);
		const handleRef = await renderHarness({ renderRow });

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
		const panel = screen.getByRole('alertdialog');

		act(() => handleOf(handleRef).open(ERRORS));

		await waitFor(() => {
			expect(screen.getByTestId('alert-body')).toHaveTextContent(
				'Everyone loses access to Errors by service.',
			);
		});
		expect(screen.getAllByRole('alertdialog')).toHaveLength(1);
		expect(screen.getByRole('alertdialog')).toBe(panel);
		expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(true);
	});

	it('closes from handle.close(), and keeps the last payload on screen while it leaves', async () => {
		const handleRef = await renderHarness();
		await openFromButton();

		act(() => handleOf(handleRef).close());

		const panel = screen.getByRole('alertdialog', { hidden: true });

		expect(panel).toHaveAttribute('data-closed');
		expect(panel).toHaveTextContent('Everyone loses access to Latency overview.');

		await waitForClosed();

		expect(handleOf(handleRef).isOpen).toBe(false);
		expect(slot('alert-dialog-backdrop')).toBeNull();
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

	it('reports every open and close through onOpenChange', async () => {
		const changes: boolean[] = [];
		const handleRef = await renderHarness({ onOpenChange: (open) => changes.push(open) });

		await openFromButton();
		await userEvent.click(cancelButton());
		await waitForClosed();

		expect(changes).toEqual([true, false]);

		await openWith(handleOf(handleRef), ERRORS);
		act(() => handleOf(handleRef).close());
		await waitForClosed();

		expect(changes).toEqual([true, false, true, false]);
	});

	it('renders children that are not a function as they are', async () => {
		function Static(): ReactNode {
			const handle = useDialogHandle();

			return (
				<>
					<button type="button" onClick={() => handle.open()}>
						{OPENER_NAME}
					</button>
					<AlertDialog
						handle={handle}
						title="Delete this view?"
						color="danger"
						confirmText="Delete view"
						testId="alert"
						onConfirm={() => {}}
					>
						Static body
					</AlertDialog>
				</>
			);
		}
		render(<Static />);

		await openFromButton();

		expect(screen.getByTestId('alert-body')).toHaveTextContent('Static body');
	});

	it('unmounts the content on close and keeps no state when it opens again', async () => {
		const handleRef = await renderHarness({
			renderRow: () => <input aria-label="Reason" />,
		});
		await openFromButton();
		await userEvent.type(screen.getByRole('textbox', { name: 'Reason' }), 'Because');

		await userEvent.keyboard('{Escape}');
		await waitForClosed();
		await openWith(handleOf(handleRef), LATENCY);

		expect(screen.getByRole('textbox', { name: 'Reason' })).toHaveValue('');
	});

	it('can be opened again after it closed itself', async () => {
		await renderHarness();
		await openFromButton();
		await userEvent.keyboard('{Escape}');
		await waitForClosed();

		await openFromButton();

		expect(screen.getByTestId('alert-body')).toHaveTextContent(
			'Everyone loses access to Latency overview.',
		);
		expect(screen.getByRole('alertdialog', { name: 'Delete this view?' })).toHaveFocus();
	});
});

describe('AlertDialog with a handle answering', () => {
	it('hands the payload to onConfirm', async () => {
		const onConfirm = vi.fn();
		await renderHarness({ onConfirm });
		await openFromButton();

		await userEvent.click(confirmButton());

		expect(onConfirm).toHaveBeenCalledExactlyOnceWith(LATENCY);
	});

	it('hands onConfirm the payload of the latest open', async () => {
		const onConfirm = vi.fn();
		const handleRef = await renderHarness({ onConfirm });
		await openFromButton();
		act(() => handleOf(handleRef).open(ERRORS));
		await waitFor(() => {
			expect(screen.getByTestId('alert-body')).toHaveTextContent('Errors by service');
		});

		await userEvent.click(confirmButton());

		expect(onConfirm).toHaveBeenCalledExactlyOnceWith(ERRORS);
	});

	it('closes itself after an onConfirm that returns nothing, with no loading state', async () => {
		const onConfirm = vi.fn();
		const handleRef = await renderHarness({ onConfirm });
		await openFromButton();

		await userEvent.click(confirmButton());
		await waitForClosed();

		expect(onConfirm).toHaveBeenCalledOnce();
		expect(handleOf(handleRef).isOpen).toBe(false);
		expect(screen.queryByRole('alertdialog')).toBeNull();
	});

	it('closes itself after an onConfirm that returns true', async () => {
		const handleRef = await renderHarness({ onConfirm: () => true });
		await openFromButton();

		await userEvent.click(confirmButton());
		await waitForClosed();

		expect(handleOf(handleRef).isOpen).toBe(false);
	});

	it('stays open after an onConfirm that returns false, with no loading state', async () => {
		const onConfirm = vi.fn(() => false);
		const onOpenChange = vi.fn();
		const handleRef = await renderHarness({ onConfirm, onOpenChange });
		await openFromButton();

		await userEvent.click(confirmButton());
		await nextTask();

		expect(onConfirm).toHaveBeenCalledExactlyOnceWith(LATENCY);
		expect(isLoading(confirmButton())).toBe(false);
		expect(isDisabled(cancelButton())).toBe(false);
		expect(handleOf(handleRef).isOpen).toBe(true);
		expect(slot('alert-dialog-popup')).not.toHaveAttribute('data-closed');
		expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(true);
	});

	it('calls onConfirm once for a second Enter while it closes', async () => {
		const onConfirm = vi.fn();
		await renderHarness({ onConfirm });
		await openFromButton();
		confirmButton().focus();

		await userEvent.keyboard('{Enter}');
		await userEvent.keyboard('{Enter}');
		await waitForClosed();

		expect(onConfirm).toHaveBeenCalledOnce();
	});

	it('calls onConfirm once for a second Enter while it closes after the promise resolved', async () => {
		const pending = defer();
		const onConfirm = vi.fn(() => pending.promise);
		await renderHarness({ onConfirm });
		await openFromButton();
		confirmButton().focus();
		await userEvent.keyboard('{Enter}');
		await waitForLoading();
		const panel = screen.getByRole('alertdialog');

		pending.resolve();
		await waitFor(() => {
			expect(panel).toHaveAttribute('data-closed');
		});
		await userEvent.keyboard('{Enter}');
		await waitForClosed();

		expect(onConfirm).toHaveBeenCalledOnce();
	});

	it('gives the focus back to the opener after a confirm', async () => {
		await renderHarness();
		await openFromButton();

		await userEvent.click(confirmButton());
		await waitForClosed();

		expect(opener()).toHaveFocus();
	});

	it('shows the loading state while onConfirm is pending, and closes itself when it resolves', async () => {
		const pending = defer();
		const onOpenChange = vi.fn();
		const handleRef = await renderHarness({ onConfirm: () => pending.promise, onOpenChange });
		await openFromButton();

		await userEvent.click(confirmButton());
		await waitForLoading();

		expect(isDisabled(cancelButton())).toBe(true);
		expect(handleOf(handleRef).isOpen).toBe(true);
		expect(screen.getByRole('alertdialog')).toBeInTheDocument();
		expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(true);

		pending.resolve();
		await waitForClosed();

		expect(handleOf(handleRef).isOpen).toBe(false);
		expect(onOpenChange).toHaveBeenLastCalledWith(false);
		expect(unhandled).toEqual([]);
	});

	it('keeps the loading state through the exit when it closes itself after the promise resolves', async () => {
		const pending = defer();
		await renderHarness({ onConfirm: () => pending.promise });
		await openFromButton();
		const panel = screen.getByRole('alertdialog');

		await userEvent.click(confirmButton());
		await waitForLoading();
		pending.resolve();
		await waitFor(() => {
			expect(panel).toHaveAttribute('data-closed');
		});

		expect(isLoading(screen.getByTestId('alert-confirm'))).toBe(true);
		expect(isDisabled(screen.getByTestId('alert-cancel'))).toBe(true);
		await waitForClosed();
	});

	it('ends the loading state when it resolves, so the next open starts clean', async () => {
		const pending = defer();
		const handleRef = await renderHarness({ onConfirm: () => pending.promise });
		await openFromButton();
		await userEvent.click(confirmButton());
		await waitForLoading();

		pending.resolve();
		await waitForClosed();
		await openWith(handleOf(handleRef), LATENCY);

		expect(isLoading(confirmButton())).toBe(false);
		expect(isDisabled(cancelButton())).toBe(false);
	});

	it('does not close the alert opened again with another payload while onConfirm was pending', async () => {
		const pending = defer();
		const handleRef = await renderHarness({ onConfirm: () => pending.promise });
		await openFromButton();
		await userEvent.click(confirmButton());
		await waitForLoading();

		act(() => handleOf(handleRef).open(ERRORS));

		await waitFor(() => {
			expect(isLoading(confirmButton())).toBe(false);
		});
		expect(isDisabled(cancelButton())).toBe(false);

		pending.resolve();
		await nextTask();

		expect(handleOf(handleRef).isOpen).toBe(true);
		expect(screen.getByTestId('alert-body')).toHaveTextContent(
			'Everyone loses access to Errors by service.',
		);
		expect(isLoading(confirmButton())).toBe(false);
	});

	it('starts clean when it is closed and opened again while onConfirm is pending', async () => {
		const pending = defer();
		const handleRef = await renderHarness({ onConfirm: () => pending.promise });
		await openFromButton();
		await userEvent.click(confirmButton());
		await waitForLoading();

		act(() => handleOf(handleRef).close());
		await waitForClosed();
		await openWith(handleOf(handleRef), ERRORS);

		expect(isLoading(confirmButton())).toBe(false);
		expect(isDisabled(cancelButton())).toBe(false);

		pending.resolve();
		await nextTask();

		expect(handleOf(handleRef).isOpen).toBe(true);
	});

	it('closes the handle when onConfirm resolves after the alert unmounted', async () => {
		const pending = defer();
		const onConfirm = () => pending.promise;
		const handleRef: HandleRef = { current: null };
		const { rerender } = render(<HandleHarness handleRef={handleRef} onConfirm={onConfirm} />);
		await openFromButton();
		await userEvent.click(confirmButton());
		await waitForLoading();

		rerender(<HandleHarness handleRef={handleRef} onConfirm={onConfirm} mounted={false} />);
		pending.resolve();
		await nextTask();

		expect(handleOf(handleRef).isOpen).toBe(false);

		rerender(<HandleHarness handleRef={handleRef} onConfirm={onConfirm} />);

		expect(screen.queryByRole('alertdialog')).toBeNull();
	});

	it('does not close the handle opened again after the alert unmounted with onConfirm pending', async () => {
		const pending = defer();
		const onConfirm = () => pending.promise;
		const handleRef: HandleRef = { current: null };
		const { rerender } = render(<HandleHarness handleRef={handleRef} onConfirm={onConfirm} />);
		await openFromButton();
		await userEvent.click(confirmButton());
		await waitForLoading();

		rerender(<HandleHarness handleRef={handleRef} onConfirm={onConfirm} mounted={false} />);
		act(() => handleOf(handleRef).open(ERRORS));
		pending.resolve();
		await nextTask();

		expect(handleOf(handleRef).isOpen).toBe(true);
	});

	it('ends only the loading state of the latest request when an older one settles', async () => {
		const first = defer();
		const second = defer();
		const onConfirm = vi
			.fn<(row: Row) => Promise<void>>()
			.mockReturnValueOnce(first.promise)
			.mockReturnValueOnce(second.promise);
		const handleRef = await renderHarness({ onConfirm });
		await openFromButton();
		await userEvent.click(confirmButton());
		await waitForLoading();

		act(() => handleOf(handleRef).open(ERRORS));
		await waitFor(() => {
			expect(isLoading(confirmButton())).toBe(false);
		});
		await userEvent.click(confirmButton());
		await waitForLoading();

		first.resolve();
		await nextTask();

		expect(isLoading(confirmButton())).toBe(true);
		expect(handleOf(handleRef).isOpen).toBe(true);

		second.resolve();
		await waitForClosed();

		expect(onConfirm).toHaveBeenNthCalledWith(2, ERRORS);
	});

	it('waits for a promise from another realm before it closes', async () => {
		const frame = document.createElement('iframe');
		document.body.append(frame);

		try {
			const FramePromise = (frame.contentWindow as Window & typeof globalThis).Promise;
			let resolve: () => void = () => {};
			const pending = new FramePromise<void>((settle) => {
				resolve = settle;
			});
			const handleRef = await renderHarness({ onConfirm: () => pending });
			await openFromButton();

			await userEvent.click(confirmButton());
			await waitForLoading();

			expect(pending instanceof Promise).toBe(false);
			expect(handleOf(handleRef).isOpen).toBe(true);

			resolve();
			await waitForClosed();

			expect(handleOf(handleRef).isOpen).toBe(false);
		} finally {
			frame.remove();
		}
	});

	it('waits for a thenable that is not a native promise before it closes', async () => {
		let resolve: () => void = () => {};
		const thenable = {
			// oxlint-disable-next-line unicorn/no-thenable -- the case under test is a thenable
			then(onFulfilled: () => void) {
				resolve = onFulfilled;
			},
		};
		const handleRef = await renderHarness({
			onConfirm: () => thenable as unknown as Promise<void>,
		});
		await openFromButton();

		await userEvent.click(confirmButton());
		await waitForLoading();

		expect(handleOf(handleRef).isOpen).toBe(true);

		resolve();
		await waitForClosed();

		expect(handleOf(handleRef).isOpen).toBe(false);
	});

	it('stays open when onConfirm rejects, ends the loading state and does not rethrow', async () => {
		const pending = defer();
		const handleRef = await renderHarness({ onConfirm: () => pending.promise });
		await openFromButton();
		await userEvent.click(confirmButton());
		await waitForLoading();

		pending.reject(new Error('The server said no'));

		await waitFor(() => {
			expect(isLoading(confirmButton())).toBe(false);
		});
		expect(isDisabled(cancelButton())).toBe(false);
		expect(handleOf(handleRef).isOpen).toBe(true);
		expect(screen.getByRole('alertdialog')).toBeInTheDocument();
		expect(slot('alert-dialog-popup')).not.toHaveAttribute('data-closed');
		await nextTask();
		expect(unhandled).toEqual([]);
	});

	it('stays open when the promise resolves to false, and ends the loading state', async () => {
		const pending = defer<boolean>();
		const handleRef = await renderHarness({ onConfirm: () => pending.promise });
		await openFromButton();
		await userEvent.click(confirmButton());
		await waitForLoading();

		pending.resolve(false);

		await waitFor(() => {
			expect(isLoading(confirmButton())).toBe(false);
		});
		expect(isDisabled(cancelButton())).toBe(false);
		expect(handleOf(handleRef).isOpen).toBe(true);
		expect(slot('alert-dialog-popup')).not.toHaveAttribute('data-closed');
	});

	it('closes once the promise resolves to anything but false', async () => {
		const first = defer<boolean>();
		const second = defer<boolean>();
		const onConfirm = vi
			.fn()
			.mockReturnValueOnce(first.promise)
			.mockReturnValueOnce(second.promise);
		const handleRef = await renderHarness({ onConfirm });
		await openFromButton();
		await userEvent.click(confirmButton());
		first.resolve(false);
		await waitFor(() => {
			expect(isLoading(confirmButton())).toBe(false);
		});

		await userEvent.click(confirmButton());
		await waitForLoading();
		second.resolve(true);
		await waitForClosed();

		expect(onConfirm).toHaveBeenCalledTimes(2);
		expect(handleOf(handleRef).isOpen).toBe(false);
	});

	it('lets the user try again after a rejection, and closes once that resolves', async () => {
		const first = defer();
		const second = defer();
		const onConfirm = vi
			.fn()
			.mockReturnValueOnce(first.promise)
			.mockReturnValueOnce(second.promise);
		const handleRef = await renderHarness({ onConfirm });
		await openFromButton();
		await userEvent.click(confirmButton());
		first.reject(new Error('The server said no'));
		await waitFor(() => {
			expect(isLoading(confirmButton())).toBe(false);
		});

		await userEvent.click(confirmButton());
		await waitForLoading();
		second.resolve();
		await waitForClosed();

		expect(onConfirm).toHaveBeenCalledTimes(2);
		expect(onConfirm).toHaveBeenNthCalledWith(2, LATENCY);
		expect(handleOf(handleRef).isOpen).toBe(false);
	});

	it('ignores Esc and the cancel button while onConfirm is pending', async () => {
		const pending = defer();
		const onOpenChange = vi.fn();
		const handleRef = await renderHarness({ onConfirm: () => pending.promise, onOpenChange });
		await openFromButton();
		await userEvent.click(confirmButton());
		await waitForLoading();

		await userEvent.keyboard('{Escape}');
		await userEvent.click(cancelButton());

		expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(true);
		expect(handleOf(handleRef).isOpen).toBe(true);
		expect(screen.getByRole('alertdialog')).toBeInTheDocument();

		pending.resolve();
		await waitForClosed();
	});

	it.each([
		['Esc', async () => userEvent.keyboard('{Escape}')],
		['the cancel button', async () => userEvent.click(cancelButton())],
	])('closes itself on %s and reports it through onOpenChange', async (_name, cancel) => {
		const onOpenChange = vi.fn();
		const onConfirm = vi.fn();
		const handleRef = await renderHarness({ onConfirm, onOpenChange });
		await openFromButton();

		await cancel();
		await waitForClosed();

		expect(onOpenChange.mock.calls).toEqual([[true], [false]]);
		expect(onConfirm).not.toHaveBeenCalled();
		expect(handleOf(handleRef).isOpen).toBe(false);
		expect(screen.queryByRole('alertdialog')).toBeNull();
		expect(opener()).toHaveFocus();
	});

	it('does nothing on a press on the backdrop', async () => {
		const onOpenChange = vi.fn();
		const onConfirm = vi.fn();
		const handleRef = await renderHarness({ onConfirm, onOpenChange });
		await openFromButton();

		await userEvent.click(screen.getByTestId('alert-backdrop'));
		await userEvent.click(document.elementFromPoint(2, 2) as Element);

		expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(true);
		expect(onConfirm).not.toHaveBeenCalled();
		expect(handleOf(handleRef).isOpen).toBe(true);
		expect(screen.getByRole('alertdialog')).toBeInTheDocument();
	});

	it('does not count a press inside the panel as an answer', async () => {
		const onOpenChange = vi.fn();
		const onConfirm = vi.fn();
		await renderHarness({ onConfirm, onOpenChange });
		await openFromButton();

		await userEvent.click(screen.getByTestId('alert-title'));
		await userEvent.click(screen.getByTestId('alert-body'));

		expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(true);
		expect(onConfirm).not.toHaveBeenCalled();
		expect(screen.getByRole('alertdialog')).toBeInTheDocument();
	});

	it('calls onConfirm with nothing for a handle without a payload', async () => {
		const onConfirm = vi.fn();
		function Plain(): ReactNode {
			const handle = useDialogHandle();

			return (
				<>
					<button type="button" onClick={() => handle.open()}>
						{OPENER_NAME}
					</button>
					<AlertDialog
						handle={handle}
						title="Delete this view?"
						color="danger"
						confirmText="Delete view"
						testId="alert"
						onConfirm={onConfirm}
					>
						Gone for good.
					</AlertDialog>
				</>
			);
		}
		render(<Plain />);
		await openFromButton();

		await userEvent.click(confirmButton());
		await waitForClosed();

		expect(onConfirm).toHaveBeenCalledExactlyOnceWith(undefined);
	});

	it('reads onConfirm at the moment of the press, not at the moment it opened', async () => {
		const first = vi.fn();
		const second = vi.fn();
		const handleRef: HandleRef = { current: null };
		const { rerender } = render(<HandleHarness handleRef={handleRef} onConfirm={first} />);
		await openFromButton();

		rerender(<HandleHarness handleRef={handleRef} onConfirm={second} />);
		await userEvent.click(confirmButton());

		expect(first).not.toHaveBeenCalled();
		expect(second).toHaveBeenCalledExactlyOnceWith(LATENCY);
	});
});

describe('AlertDialog with a handle and onOpenChange', () => {
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
});

interface SwitchHarnessProps {
	handleRef: HandleRef;
	useSecond: boolean;
}

function SwitchHandleHarness({ handleRef, useSecond }: SwitchHarnessProps): ReactNode {
	const first = useDialogHandle<Row>();
	const second = useDialogHandle<Row>();

	useEffect(() => {
		handleRef.current = first;
	}, [first, handleRef]);

	return (
		<AlertDialog
			handle={useSecond ? second : first}
			title="Delete this view?"
			color="danger"
			confirmText="Delete view"
			testId="alert"
			onConfirm={() => {}}
		>
			{(row: Row) => <p>Row: {row.name}</p>}
		</AlertDialog>
	);
}

describe('AlertDialog moved to another handle', () => {
	it('keeps the last payload on screen while it leaves for a handle that was never opened', async () => {
		const handleRef: HandleRef = { current: null };
		const { rerender } = render(<SwitchHandleHarness handleRef={handleRef} useSecond={false} />);
		await waitFor(() => {
			expect(handleRef.current).not.toBeNull();
		});
		await openWith(handleOf(handleRef), LATENCY);

		rerender(<SwitchHandleHarness handleRef={handleRef} useSecond />);

		const panel = screen.getByRole('alertdialog', { hidden: true });

		expect(panel).toHaveAttribute('data-closed');
		expect(panel).toHaveTextContent('Row: Latency overview');

		await waitForClosed();
	});
});
