import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { AlertDialog } from '../index.js';
import {
	cancelButton,
	confirmButton,
	type Deferred,
	defer,
	isDisabled,
	isLoading,
	nextTask,
	renderOpenAlert,
	trackUnhandledRejections,
	waitForClosed,
	waitForLoading,
} from './alert-dialog.test-utils.js';

const unhandled = trackUnhandledRejections();

describe('AlertDialog onConfirm that returns nothing', () => {
	it('calls onConfirm once, without a loading state, and keeps the alert open', async () => {
		const onConfirm = vi.fn();
		await renderOpenAlert({ onConfirm });

		await userEvent.click(confirmButton());

		expect(onConfirm).toHaveBeenCalledOnce();
		expect(isLoading(confirmButton())).toBe(false);
		expect(isDisabled(cancelButton())).toBe(false);
		expect(screen.getByRole('alertdialog')).toBeInTheDocument();
	});

	it('calls onConfirm with no payload when it is controlled with open', async () => {
		const onConfirm = vi.fn();
		await renderOpenAlert({ onConfirm });

		await userEvent.click(confirmButton());

		expect(onConfirm).toHaveBeenCalledExactlyOnceWith(undefined);
	});

	it('calls onConfirm on Enter and on Space when the confirm button has the focus', async () => {
		const onConfirm = vi.fn();
		await renderOpenAlert({ onConfirm });
		confirmButton().focus();

		await userEvent.keyboard('{Enter}');
		await userEvent.keyboard(' ');

		expect(onConfirm).toHaveBeenCalledTimes(2);
	});

	it('treats a false answer like any other with open: the consumer still owns the open state', async () => {
		const onConfirm = vi.fn(() => false);
		const onCancel = vi.fn();
		await renderOpenAlert({ onConfirm, onCancel, closesOnCancel: false });

		await userEvent.click(confirmButton());

		expect(onConfirm).toHaveBeenCalledOnce();
		expect(isLoading(confirmButton())).toBe(false);
		expect(screen.getByRole('alertdialog')).toBeInTheDocument();
		expect(onCancel).not.toHaveBeenCalled();
	});

	it('lets the consumer close the alert from the handler', async () => {
		function Harness() {
			const [open, setOpen] = useState(true);

			return (
				<AlertDialog
					open={open}
					title="Delete this view?"
					color="danger"
					confirmText="Delete view"
					onConfirm={() => setOpen(false)}
					onCancel={() => setOpen(false)}
				>
					Gone for good.
				</AlertDialog>
			);
		}
		render(<Harness />);
		await screen.findByRole('alertdialog');

		await userEvent.click(confirmButton());
		await waitForClosed();

		expect(screen.queryByRole('alertdialog')).toBeNull();
	});
});

describe('AlertDialog onConfirm that returns a promise', () => {
	async function renderPending(pending: Deferred, onCancel = vi.fn()) {
		const onConfirm = vi.fn(() => pending.promise);
		await renderOpenAlert({ onConfirm, onCancel, closesOnCancel: false });

		return { onConfirm, onCancel };
	}

	it('shows the loading state of the confirm button while it is pending', async () => {
		const pending = defer();
		const { onConfirm } = await renderPending(pending);

		await userEvent.click(confirmButton());

		await waitForLoading();
		expect(onConfirm).toHaveBeenCalledOnce();
		expect(isDisabled(confirmButton())).toBe(true);
		pending.resolve();
	});

	it('disables the cancel button while it is pending', async () => {
		const pending = defer();
		const { onCancel } = await renderPending(pending);

		await userEvent.click(confirmButton());
		await waitForLoading();

		expect(isDisabled(cancelButton())).toBe(true);

		await userEvent.click(cancelButton());

		expect(onCancel).not.toHaveBeenCalled();
		pending.resolve();
	});

	it('ignores Esc while it is pending, with the focus anywhere in the panel', async () => {
		const pending = defer();
		const { onCancel } = await renderPending(pending);

		await userEvent.click(confirmButton());
		await waitForLoading();
		await userEvent.keyboard('{Escape}');
		cancelButton().focus();
		await userEvent.keyboard('{Escape}');
		confirmButton().focus();
		await userEvent.keyboard('{Escape}');

		expect(onCancel).not.toHaveBeenCalled();
		expect(screen.getByRole('alertdialog')).toBeInTheDocument();
		pending.resolve();
	});

	it('still does not close on a press on the backdrop while it is pending', async () => {
		const pending = defer();
		const { onCancel } = await renderPending(pending);

		await userEvent.click(confirmButton());
		await userEvent.click(document.elementFromPoint(2, 2) as Element);

		expect(onCancel).not.toHaveBeenCalled();
		pending.resolve();
	});

	it('calls onConfirm once for a double press while it is pending', async () => {
		const pending = defer();
		const { onConfirm } = await renderPending(pending);

		await userEvent.dblClick(confirmButton());
		await userEvent.click(confirmButton());
		confirmButton().focus();
		await userEvent.keyboard('{Enter}');
		await userEvent.keyboard(' ');

		expect(onConfirm).toHaveBeenCalledOnce();
		pending.resolve();
	});

	it('ends the loading state when it resolves, and gives the cancel button back', async () => {
		const pending = defer();
		const { onConfirm, onCancel } = await renderPending(pending);

		await userEvent.click(confirmButton());
		await waitForLoading();

		pending.resolve();

		await waitFor(() => {
			expect(isLoading(confirmButton())).toBe(false);
		});
		expect(isDisabled(cancelButton())).toBe(false);
		expect(screen.getByRole('alertdialog')).toBeInTheDocument();

		await userEvent.keyboard('{Escape}');

		expect(onCancel).toHaveBeenCalledOnce();
		expect(onConfirm).toHaveBeenCalledOnce();
	});

	it('closes when the consumer sets open to false at the end of the handler', async () => {
		const pending = defer();
		function Harness() {
			const [open, setOpen] = useState(true);

			return (
				<AlertDialog
					open={open}
					title="Delete this view?"
					color="danger"
					confirmText="Delete view"
					onConfirm={async () => {
						await pending.promise;
						setOpen(false);
					}}
					onCancel={() => setOpen(false)}
				>
					Gone for good.
				</AlertDialog>
			);
		}
		render(<Harness />);
		await screen.findByRole('alertdialog');

		await userEvent.click(confirmButton());
		await waitForLoading();
		pending.resolve();
		await waitForClosed();

		expect(screen.queryByRole('alertdialog')).toBeNull();
		expect(unhandled).toEqual([]);
	});

	it('keeps the loading state through the exit when the consumer closes it at the end of the handler', async () => {
		const pending = defer();
		function Harness() {
			const [open, setOpen] = useState(true);

			return (
				<AlertDialog
					open={open}
					title="Delete this view?"
					color="danger"
					confirmText="Delete view"
					testId="alert"
					onConfirm={async () => {
						await pending.promise;
						setOpen(false);
					}}
					onCancel={() => setOpen(false)}
				>
					Gone for good.
				</AlertDialog>
			);
		}
		render(<Harness />);
		const panel = await screen.findByRole('alertdialog');

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

	it('keeps the alert open when it resolves to false, since the consumer owns the open state', async () => {
		const pending = defer<boolean>();
		const onCancel = vi.fn();
		await renderOpenAlert({ onConfirm: () => pending.promise, onCancel, closesOnCancel: false });

		await userEvent.click(confirmButton());
		await waitForLoading();
		pending.resolve(false);

		await waitFor(() => {
			expect(isLoading(confirmButton())).toBe(false);
		});
		expect(screen.getByRole('alertdialog')).toBeInTheDocument();
		expect(onCancel).not.toHaveBeenCalled();
	});

	it('is pending again on the next press after it resolved', async () => {
		const first = defer();
		const second = defer();
		const onConfirm = vi
			.fn()
			.mockReturnValueOnce(first.promise)
			.mockReturnValueOnce(second.promise);
		await renderOpenAlert({ onConfirm });

		await userEvent.click(confirmButton());
		first.resolve();
		await waitFor(() => {
			expect(isLoading(confirmButton())).toBe(false);
		});
		await userEvent.click(confirmButton());

		await waitForLoading();
		expect(onConfirm).toHaveBeenCalledTimes(2);
		second.resolve();
	});

	it('starts clean when open goes to false and back while it is pending', async () => {
		const pending = defer();
		const props = {
			title: 'Delete this view?',
			confirmText: 'Delete view',
			onConfirm: () => pending.promise,
			onCancel: () => {},
			children: 'Dashboards that link to it open the default view.',
		};
		const { rerender } = render(<AlertDialog {...props} open />);
		await waitFor(() => {
			expect(screen.getByRole('alertdialog')).toBeInTheDocument();
		});
		await userEvent.click(confirmButton());
		await waitForLoading();

		rerender(<AlertDialog {...props} open={false} />);
		await waitForClosed();
		rerender(<AlertDialog {...props} open />);
		await waitFor(() => {
			expect(screen.getByRole('alertdialog')).toBeInTheDocument();
		});

		expect(isLoading(confirmButton())).toBe(false);
		expect(isDisabled(cancelButton())).toBe(false);
		pending.resolve();
	});
});

describe('AlertDialog onConfirm that rejects', () => {
	it('ends the loading state, keeps the alert open and gives the cancel button back', async () => {
		const pending = defer();
		const onCancel = vi.fn();
		await renderOpenAlert({ onConfirm: () => pending.promise, onCancel, closesOnCancel: false });

		await userEvent.click(confirmButton());
		await waitForLoading();

		pending.reject(new Error('The server said no'));

		await waitFor(() => {
			expect(isLoading(confirmButton())).toBe(false);
		});
		expect(isDisabled(cancelButton())).toBe(false);
		expect(screen.getByRole('alertdialog')).toBeInTheDocument();

		await userEvent.keyboard('{Escape}');

		expect(onCancel).toHaveBeenCalledOnce();
	});

	it('does not rethrow the rejection, so it never reaches the page', async () => {
		const pending = defer();
		await renderOpenAlert({ onConfirm: () => pending.promise });

		await userEvent.click(confirmButton());
		pending.reject(new Error('The server said no'));
		await waitFor(() => {
			expect(isLoading(confirmButton())).toBe(false);
		});
		await nextTask();

		expect(unhandled).toEqual([]);
	});

	it('lets the user try again', async () => {
		const first = defer();
		const second = defer();
		const onConfirm = vi
			.fn()
			.mockReturnValueOnce(first.promise)
			.mockReturnValueOnce(second.promise);
		await renderOpenAlert({ onConfirm });

		await userEvent.click(confirmButton());
		first.reject(new Error('The server said no'));
		await waitFor(() => {
			expect(isLoading(confirmButton())).toBe(false);
		});

		await userEvent.click(confirmButton());

		await waitForLoading();
		expect(onConfirm).toHaveBeenCalledTimes(2);
		second.resolve();
	});

	it('lets the consumer show the error in the alert from the handler', async () => {
		function Harness() {
			const [error, setError] = useState<string | null>(null);

			return (
				<AlertDialog
					open
					title="Delete this view?"
					color="danger"
					confirmText="Delete view"
					onConfirm={async () => {
						try {
							await Promise.reject(new Error('The server said no'));
						} catch (caught) {
							setError((caught as Error).message);
						}
					}}
					onCancel={() => {}}
				>
					{error ?? 'Gone for good.'}
				</AlertDialog>
			);
		}
		render(<Harness />);
		await screen.findByRole('alertdialog');

		await userEvent.click(confirmButton());

		expect(await screen.findByText('The server said no')).toBeInTheDocument();
		expect(isLoading(confirmButton())).toBe(false);
		expect(unhandled).toEqual([]);
	});
});

describe('AlertDialog onConfirm between renders', () => {
	it('reads onConfirm at the moment of the press, not at the moment it opened', async () => {
		const first = vi.fn();
		const second = vi.fn();
		const { rerender } = render(
			<AlertDialog
				open
				title="Delete this view?"
				color="danger"
				confirmText="Delete view"
				onConfirm={first}
				onCancel={() => {}}
			>
				Gone for good.
			</AlertDialog>,
		);
		await screen.findByRole('alertdialog');

		rerender(
			<AlertDialog
				open
				title="Delete this view?"
				color="danger"
				confirmText="Delete view"
				onConfirm={second}
				onCancel={() => {}}
			>
				Gone for good.
			</AlertDialog>,
		);
		await userEvent.click(confirmButton());

		expect(first).not.toHaveBeenCalled();
		expect(second).toHaveBeenCalledOnce();
	});
});
