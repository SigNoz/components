import { act, render, screen, waitFor } from '@testing-library/react';
import { type ReactNode, StrictMode, useEffect, useRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Dialog } from '../dialog.js';
import type { DialogHandle } from '../dialog-handle.js';
import { useDialogHandle } from '../use-dialog-handle.js';
import { waitForClosed, waitForSettled } from './dialog.test-utils.js';

interface HandleRef {
	current: DialogHandle | null;
}

function handleOf(ref: HandleRef): DialogHandle {
	return ref.current as DialogHandle;
}

function ShownHarness({
	handleRef,
	onOpenChange,
	shown,
}: {
	handleRef: HandleRef;
	onOpenChange: (open: boolean) => void;
	shown: boolean;
}): ReactNode {
	const handle = useDialogHandle(onOpenChange);

	useEffect(() => {
		handleRef.current = handle;
	}, [handle, handleRef]);

	return shown ? (
		<Dialog handle={handle} title="Edit view" testId="dialog">
			<input aria-label="Name" />
		</Dialog>
	) : null;
}

function ParentHarness({
	handleRef,
	onOpenChange,
	parentOpen,
}: {
	handleRef: HandleRef;
	onOpenChange: (open: boolean) => void;
	parentOpen: boolean;
}): ReactNode {
	const child = useDialogHandle(onOpenChange);

	useEffect(() => {
		handleRef.current = child;
	}, [child, handleRef]);

	return (
		<Dialog open={parentOpen} onClose={() => {}} title="Edit view" testId="parent">
			<Dialog handle={child} title="Discard changes?" testId="child">
				Body
			</Dialog>
		</Dialog>
	);
}

function KeyedHarness({
	handleRef,
	onOpenChange,
	dialogKey,
}: {
	handleRef: HandleRef;
	onOpenChange: (open: boolean) => void;
	dialogKey: string;
}): ReactNode {
	const handle = useDialogHandle(onOpenChange);

	useEffect(() => {
		handleRef.current = handle;
	}, [handle, handleRef]);

	return (
		<Dialog key={dialogKey} handle={handle} title="Edit view" testId="dialog">
			Body
		</Dialog>
	);
}

describe('Dialog on a handle that unmounts while open', () => {
	it('closes the handle and reports it, when the dialog is no longer rendered', async () => {
		const onOpenChange = vi.fn();
		const handleRef: HandleRef = { current: null };
		const { rerender } = render(
			<ShownHarness handleRef={handleRef} onOpenChange={onOpenChange} shown />,
		);
		act(() => handleOf(handleRef).open());
		await screen.findByRole('dialog', { name: 'Edit view' });
		await waitForSettled();

		rerender(<ShownHarness handleRef={handleRef} onOpenChange={onOpenChange} shown={false} />);

		await waitFor(() => {
			expect(handleOf(handleRef).isOpen).toBe(false);
		});
		expect(onOpenChange.mock.calls).toEqual([[true], [false]]);
		expect(screen.queryByRole('dialog', { hidden: true })).toBeNull();
	});

	it('does not open at once when it is rendered again', async () => {
		const onOpenChange = vi.fn();
		const handleRef: HandleRef = { current: null };
		const { rerender } = render(
			<ShownHarness handleRef={handleRef} onOpenChange={onOpenChange} shown />,
		);
		act(() => handleOf(handleRef).open());
		await screen.findByRole('dialog', { name: 'Edit view' });
		rerender(<ShownHarness handleRef={handleRef} onOpenChange={onOpenChange} shown={false} />);
		await waitFor(() => {
			expect(handleOf(handleRef).isOpen).toBe(false);
		});

		rerender(<ShownHarness handleRef={handleRef} onOpenChange={onOpenChange} shown />);
		await act(async () => {});

		expect(screen.queryByRole('dialog', { hidden: true })).toBeNull();
	});

	it('keeps a handle that is opened again right after the dialog unmounted', async () => {
		const onOpenChange = vi.fn();
		const handleRef: HandleRef = { current: null };
		const { rerender } = render(
			<ShownHarness handleRef={handleRef} onOpenChange={onOpenChange} shown />,
		);
		act(() => handleOf(handleRef).open());
		await screen.findByRole('dialog', { name: 'Edit view' });
		await waitForSettled();

		rerender(<ShownHarness handleRef={handleRef} onOpenChange={onOpenChange} shown={false} />);
		act(() => handleOf(handleRef).open());
		await act(async () => {});

		expect(handleOf(handleRef).isOpen).toBe(true);
		expect(onOpenChange.mock.calls).toEqual([[true]]);
	});

	it('keeps the handle open when the dialog is replaced by one with another key', async () => {
		const onOpenChange = vi.fn();
		const handleRef: HandleRef = { current: null };
		const { rerender } = render(
			<KeyedHarness handleRef={handleRef} onOpenChange={onOpenChange} dialogKey="first" />,
		);
		act(() => handleOf(handleRef).open());
		await screen.findByRole('dialog', { name: 'Edit view' });
		await waitForSettled();

		rerender(<KeyedHarness handleRef={handleRef} onOpenChange={onOpenChange} dialogKey="second" />);
		await act(async () => {});

		expect(handleOf(handleRef).isOpen).toBe(true);
		expect(onOpenChange.mock.calls).toEqual([[true]]);
		expect(screen.getByRole('dialog', { name: 'Edit view' })).toBeInTheDocument();
	});

	it('leaves a handle that is already closed alone', async () => {
		const onOpenChange = vi.fn();
		const handleRef: HandleRef = { current: null };
		const { rerender } = render(
			<ShownHarness handleRef={handleRef} onOpenChange={onOpenChange} shown />,
		);

		rerender(<ShownHarness handleRef={handleRef} onOpenChange={onOpenChange} shown={false} />);
		await act(async () => {});

		expect(onOpenChange).not.toHaveBeenCalled();
	});

	it('resets a child that closed with its parent, so it stays closed when the parent opens again', async () => {
		const onOpenChange = vi.fn();
		const handleRef: HandleRef = { current: null };
		const { rerender } = render(
			<ParentHarness handleRef={handleRef} onOpenChange={onOpenChange} parentOpen />,
		);
		await screen.findByRole('dialog', { name: 'Edit view' });
		act(() => handleOf(handleRef).open());
		await screen.findByRole('dialog', { name: 'Discard changes?' });
		await waitForSettled();

		rerender(
			<ParentHarness handleRef={handleRef} onOpenChange={onOpenChange} parentOpen={false} />,
		);
		await waitForClosed();

		await waitFor(() => {
			expect(handleOf(handleRef).isOpen).toBe(false);
		});
		expect(onOpenChange.mock.calls).toEqual([[true], [false]]);

		rerender(<ParentHarness handleRef={handleRef} onOpenChange={onOpenChange} parentOpen />);
		await screen.findByRole('dialog', { name: 'Edit view' });
		await act(async () => {});

		expect(screen.queryByRole('dialog', { name: 'Discard changes?' })).toBeNull();
	});

	it('keeps a handle that was opened on mount open through Strict Mode', async () => {
		const handleRef: HandleRef = { current: null };
		function OpensOnMount(): ReactNode {
			const handle = useDialogHandle();
			const opened = useRef(false);

			// A ref survives Strict Mode's second pass, so the handle is opened once, not again.
			useEffect(() => {
				handleRef.current = handle;
				if (!opened.current) {
					opened.current = true;
					handle.open();
				}
			}, [handle]);

			return (
				<Dialog handle={handle} title="Edit view" testId="dialog">
					Body
				</Dialog>
			);
		}
		render(
			<StrictMode>
				<OpensOnMount />
			</StrictMode>,
		);

		await screen.findByRole('dialog', { name: 'Edit view' });
		await act(async () => {});

		expect(handleOf(handleRef).isOpen).toBe(true);
		expect(screen.getByRole('dialog', { name: 'Edit view' })).toBeInTheDocument();
	});
});
