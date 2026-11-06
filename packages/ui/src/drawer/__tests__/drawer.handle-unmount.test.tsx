import { act, render, screen, waitFor } from '@testing-library/react';
import { type ReactNode, StrictMode, useEffect, useRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Dialog } from '../../dialog/dialog.js';
import { useDialogHandle } from '../../dialog/use-dialog-handle.js';
import { Drawer } from '../drawer.js';
import type { DrawerHandleType } from '../types.js';
import { useDrawerHandle } from '../use-drawer-handle.js';
import { drawerPanel, slot, waitForClosed, waitForSettled } from './drawer.test-utils.js';

interface HandleRef {
	current: DrawerHandleType | null;
}

function handleOf(ref: HandleRef): DrawerHandleType {
	return ref.current as DrawerHandleType;
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
	const handle = useDrawerHandle(onOpenChange);

	useEffect(() => {
		handleRef.current = handle;
	}, [handle, handleRef]);

	return shown ? (
		<Drawer handle={handle} type="task" title="Log details" testId="drawer">
			<input aria-label="Name" />
		</Drawer>
	) : null;
}

function KeyedHarness({
	handleRef,
	onOpenChange,
	drawerKey,
}: {
	handleRef: HandleRef;
	onOpenChange: (open: boolean) => void;
	drawerKey: string;
}): ReactNode {
	const handle = useDrawerHandle(onOpenChange);

	useEffect(() => {
		handleRef.current = handle;
	}, [handle, handleRef]);

	return (
		<Drawer key={drawerKey} handle={handle} type="inspector" title="Log details" testId="drawer">
			Body
		</Drawer>
	);
}

/**
 * A task drawer with a `Dialog` on a handle inside it, the way a form asks to confirm a step.
 */
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
		<Drawer type="task" open={parentOpen} onClose={() => {}} title="Edit member" testId="drawer">
			<Dialog handle={child} title="Discard changes?" testId="child">
				Body
			</Dialog>
		</Drawer>
	);
}

async function renderOpenShown(onOpenChange: (open: boolean) => void) {
	const handleRef: HandleRef = { current: null };
	const result = render(<ShownHarness handleRef={handleRef} onOpenChange={onOpenChange} shown />);
	act(() => handleOf(handleRef).open());
	await screen.findByRole('dialog', { name: 'Log details' });
	await waitForSettled();

	return { ...result, handleRef };
}

describe('Drawer on a handle that unmounts while open', () => {
	it('closes the handle and reports it, when the drawer is no longer rendered', async () => {
		const onOpenChange = vi.fn();
		const { handleRef, rerender } = await renderOpenShown(onOpenChange);

		rerender(<ShownHarness handleRef={handleRef} onOpenChange={onOpenChange} shown={false} />);

		await waitFor(() => {
			expect(handleOf(handleRef).isOpen).toBe(false);
		});
		expect(onOpenChange.mock.calls).toEqual([[true], [false]]);
		expect(slot('drawer-popup')).toBeNull();
		expect(slot('drawer-backdrop')).toBeNull();
	});

	it('does not open at once when it is rendered again', async () => {
		const onOpenChange = vi.fn();
		const { handleRef, rerender } = await renderOpenShown(onOpenChange);
		rerender(<ShownHarness handleRef={handleRef} onOpenChange={onOpenChange} shown={false} />);
		await waitFor(() => {
			expect(handleOf(handleRef).isOpen).toBe(false);
		});

		rerender(<ShownHarness handleRef={handleRef} onOpenChange={onOpenChange} shown />);
		await act(async () => {});

		expect(slot('drawer-popup')).toBeNull();
	});

	it('keeps a handle that is opened again right after the drawer unmounted', async () => {
		const onOpenChange = vi.fn();
		const { handleRef, rerender } = await renderOpenShown(onOpenChange);

		rerender(<ShownHarness handleRef={handleRef} onOpenChange={onOpenChange} shown={false} />);
		act(() => handleOf(handleRef).open());
		await act(async () => {});

		expect(handleOf(handleRef).isOpen).toBe(true);
		expect(onOpenChange.mock.calls).toEqual([[true]]);
	});

	it('opens on the next mount when the handle was opened again while nothing rendered it', async () => {
		const onOpenChange = vi.fn();
		const { handleRef, rerender } = await renderOpenShown(onOpenChange);
		rerender(<ShownHarness handleRef={handleRef} onOpenChange={onOpenChange} shown={false} />);
		act(() => handleOf(handleRef).open());
		await act(async () => {});

		rerender(<ShownHarness handleRef={handleRef} onOpenChange={onOpenChange} shown />);

		expect(await screen.findByRole('dialog', { name: 'Log details' })).toBeInTheDocument();
		expect(handleOf(handleRef).isOpen).toBe(true);
	});

	it('keeps the handle open when the drawer is replaced by one with another key', async () => {
		const onOpenChange = vi.fn();
		const handleRef: HandleRef = { current: null };
		const { rerender } = render(
			<KeyedHarness handleRef={handleRef} onOpenChange={onOpenChange} drawerKey="first" />,
		);
		act(() => handleOf(handleRef).open());
		await screen.findByRole('dialog', { name: 'Log details' });
		await waitForSettled();
		const first = drawerPanel();

		rerender(<KeyedHarness handleRef={handleRef} onOpenChange={onOpenChange} drawerKey="second" />);
		await act(async () => {});

		expect(handleOf(handleRef).isOpen).toBe(true);
		expect(onOpenChange.mock.calls).toEqual([[true]]);
		expect(screen.getByRole('dialog', { name: 'Log details' })).toBeInTheDocument();
		expect(screen.getByRole('dialog', { name: 'Log details' })).not.toBe(first);
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

	it('does not close again a handle that closed and unmounted in the same update', async () => {
		const onOpenChange = vi.fn();
		const { handleRef, rerender } = await renderOpenShown(onOpenChange);

		act(() => {
			handleOf(handleRef).close();
			rerender(<ShownHarness handleRef={handleRef} onOpenChange={onOpenChange} shown={false} />);
		});
		await act(async () => {});

		expect(onOpenChange.mock.calls).toEqual([[true], [false]]);
		expect(handleOf(handleRef).isOpen).toBe(false);
	});

	it('opens again when the handle is opened while the drawer still plays its exit', async () => {
		const onOpenChange = vi.fn();
		const { handleRef } = await renderOpenShown(onOpenChange);

		act(() => handleOf(handleRef).close());
		expect(drawerPanel()).toHaveAttribute('data-closed');
		act(() => handleOf(handleRef).open());

		await waitFor(() => {
			expect(drawerPanel()).toHaveAttribute('data-open');
		});
		await waitForSettled();
		await act(async () => {});

		expect(handleOf(handleRef).isOpen).toBe(true);
		expect(onOpenChange.mock.calls).toEqual([[true], [false], [true]]);
		expect(screen.getByRole('dialog', { name: 'Log details' })).toBeInTheDocument();
	});

	it('resets a dialog that closed with the drawer it is in, so it stays closed when the drawer opens again', async () => {
		const onOpenChange = vi.fn();
		const handleRef: HandleRef = { current: null };
		const { rerender } = render(
			<ParentHarness handleRef={handleRef} onOpenChange={onOpenChange} parentOpen />,
		);
		await screen.findByRole('dialog', { name: 'Edit member' });
		act(() => handleOf(handleRef).open());
		await screen.findByRole('dialog', { name: 'Discard changes?' });

		rerender(
			<ParentHarness handleRef={handleRef} onOpenChange={onOpenChange} parentOpen={false} />,
		);
		await waitForClosed();

		await waitFor(() => {
			expect(handleOf(handleRef).isOpen).toBe(false);
		});
		expect(onOpenChange.mock.calls).toEqual([[true], [false]]);

		rerender(<ParentHarness handleRef={handleRef} onOpenChange={onOpenChange} parentOpen />);
		await screen.findByRole('dialog', { name: 'Edit member' });
		await act(async () => {});

		expect(screen.queryByRole('dialog', { name: 'Discard changes?' })).toBeNull();
	});

	it('keeps a handle that was opened on mount open through Strict Mode', async () => {
		const handleRef: HandleRef = { current: null };
		function OpensOnMount(): ReactNode {
			const handle = useDrawerHandle();
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
				<Drawer handle={handle} type="task" title="Log details" testId="drawer">
					Body
				</Drawer>
			);
		}
		render(
			<StrictMode>
				<OpensOnMount />
			</StrictMode>,
		);

		await screen.findByRole('dialog', { name: 'Log details' });
		await act(async () => {});

		expect(handleOf(handleRef).isOpen).toBe(true);
		expect(screen.getByRole('dialog', { name: 'Log details' })).toBeInTheDocument();
	});
});
