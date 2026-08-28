import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import {
	ConfirmDialog,
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogWrapper,
} from './index.js';

/**
 * Assertions target the open/close contract, the public prop surface and the
 * dismissal callbacks rather than the primitive's own state attributes, so they
 * remain meaningful if the primitive underneath is replaced.
 */
function renderDialog(
	contentProps: React.ComponentProps<typeof DialogContent> = {},
	rootProps: React.ComponentProps<typeof Dialog> = {},
) {
	return render(
		<Dialog {...rootProps}>
			<DialogTrigger asChild>
				<button type="button">Open</button>
			</DialogTrigger>
			<DialogContent {...contentProps}>
				<DialogHeader>
					<DialogTitle>Report details</DialogTitle>
				</DialogHeader>
				<DialogDescription>Body copy</DialogDescription>
			</DialogContent>
		</Dialog>,
	);
}

describe('Dialog open state', () => {
	it('opens from the trigger and reports the change', () => {
		const onOpenChange = vi.fn();
		renderDialog({}, { onOpenChange });

		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
		fireEvent.click(screen.getByRole('button', { name: 'Open' }));

		expect(screen.getByRole('dialog')).toBeInTheDocument();
		expect(onOpenChange).toHaveBeenCalledWith(true);
	});

	it('renders content when open by default', () => {
		renderDialog({}, { defaultOpen: true });

		expect(screen.getByRole('dialog')).toHaveTextContent('Body copy');
	});

	it('honours the controlled open prop', () => {
		function Controlled() {
			const [open, setOpen] = useState(false);
			return (
				<>
					<button type="button" onClick={() => setOpen(true)}>
						Show
					</button>
					<Dialog open={open} onOpenChange={setOpen}>
						<DialogContent>
							<DialogTitle>Controlled</DialogTitle>
						</DialogContent>
					</Dialog>
				</>
			);
		}
		render(<Controlled />);

		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
		fireEvent.click(screen.getByRole('button', { name: 'Show' }));
		expect(screen.getByRole('dialog')).toBeInTheDocument();
	});

	it('closes through DialogClose', () => {
		render(
			<Dialog defaultOpen>
				<DialogContent>
					<DialogTitle>Closable</DialogTitle>
					<DialogClose asChild>
						<button type="button">Dismiss</button>
					</DialogClose>
				</DialogContent>
			</Dialog>,
		);

		fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));

		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});
});

describe('Dialog accessibility wiring', () => {
	it('labels the dialog with its title', () => {
		renderDialog({}, { defaultOpen: true });

		const dialog = screen.getByRole('dialog');
		const title = screen.getByText('Report details');
		expect(dialog).toHaveAttribute('aria-labelledby', title.id);
	});
});

describe('Dialog content props', () => {
	it('exposes width, position, height mode and animation as data attributes', () => {
		renderDialog(
			{ width: 'wide', position: 'top', heightMode: 'full', animation: 'slide', testId: 'panel' },
			{ defaultOpen: true },
		);

		const panel = screen.getByTestId('panel');
		expect(panel).toHaveAttribute('data-width', 'wide');
		expect(panel).toHaveAttribute('data-position', 'top');
		expect(panel).toHaveAttribute('data-height-mode', 'full');
		expect(panel).toHaveAttribute('data-animation', 'slide');
	});

	it('offsets the panel when positioned away from the centre', () => {
		renderDialog({ position: 'top', offset: 40, testId: 'panel' }, { defaultOpen: true });

		expect(screen.getByTestId('panel')).toHaveStyle({ top: '40px' });
	});

	it('renders the overlay by default and omits it on request', () => {
		const { unmount } = renderDialog({}, { defaultOpen: true });
		expect(document.querySelector('[data-slot="dialog-overlay"]')).not.toBeNull();
		unmount();

		renderDialog({ showOverlay: false }, { defaultOpen: true });
		expect(document.querySelector('[data-slot="dialog-overlay"]')).toBeNull();
	});

	it('forwards className and id to the panel', () => {
		renderDialog({ className: 'custom', id: 'panel-id', testId: 'panel' }, { defaultOpen: true });

		const panel = screen.getByTestId('panel');
		expect(panel).toHaveClass('custom');
		expect(panel).toHaveAttribute('id', 'panel-id');
	});
});

describe('Dialog forceMount', () => {
	/**
	 * `forceMount` exists so a JS animation library can own the exit. Base UI
	 * would otherwise hide the popup the moment it considers the dialog closed,
	 * which would cut the exit animation off, so the panel must stay mounted and
	 * visible while closed.
	 */
	it('keeps the panel mounted and unhidden while closed', () => {
		renderDialog({ forceMount: true, testId: 'panel' });

		const panel = screen.getByTestId('panel');
		expect(panel).toBeInTheDocument();
		expect(panel).not.toHaveAttribute('hidden');
	});

	it('keeps the overlay unhidden while closed', () => {
		renderDialog({ forceMount: true });

		const overlay = document.querySelector('[data-slot="dialog-overlay"]');
		expect(overlay).not.toBeNull();
		expect(overlay).not.toHaveAttribute('hidden');
	});
});

describe('Dialog dismissal callbacks', () => {
	it('calls onEscapeKeyDown when Escape closes the dialog', () => {
		const onEscapeKeyDown = vi.fn();
		renderDialog({ onEscapeKeyDown }, { defaultOpen: true });

		fireEvent.keyDown(document, { key: 'Escape' });

		expect(onEscapeKeyDown).toHaveBeenCalledTimes(1);
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	it('keeps the dialog open when onEscapeKeyDown prevents the default', () => {
		const onOpenChange = vi.fn();
		renderDialog(
			{ onEscapeKeyDown: (event) => event.preventDefault() },
			{ defaultOpen: true, onOpenChange },
		);

		fireEvent.keyDown(document, { key: 'Escape' });

		expect(screen.getByRole('dialog')).toBeInTheDocument();
		expect(onOpenChange).not.toHaveBeenCalled();
	});

	it('reports an outside press to onPointerDownOutside and onInteractOutside', () => {
		const onPointerDownOutside = vi.fn();
		const onInteractOutside = vi.fn();
		renderDialog({ onPointerDownOutside, onInteractOutside }, { defaultOpen: true });

		const overlay = document.querySelector('[data-slot="dialog-overlay"]') as HTMLElement;
		fireEvent.pointerDown(overlay);
		fireEvent.mouseDown(overlay);
		fireEvent.click(overlay);

		expect(onPointerDownOutside).toHaveBeenCalledTimes(1);
		expect(onInteractOutside).toHaveBeenCalledTimes(1);
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	it('keeps the dialog open when the outside press is prevented', () => {
		renderDialog(
			{ onPointerDownOutside: (event) => event.preventDefault() },
			{ defaultOpen: true },
		);

		const overlay = document.querySelector('[data-slot="dialog-overlay"]') as HTMLElement;
		fireEvent.pointerDown(overlay);
		fireEvent.mouseDown(overlay);
		fireEvent.click(overlay);

		expect(screen.getByRole('dialog')).toBeInTheDocument();
	});
});

describe('Dialog focus callbacks', () => {
	it('suppresses auto-focus when onOpenAutoFocus prevents the default', async () => {
		render(
			<Dialog>
				<DialogTrigger asChild>
					<button type="button">Open</button>
				</DialogTrigger>
				<DialogContent onOpenAutoFocus={(event) => event.preventDefault()}>
					<DialogTitle>Focus</DialogTitle>
					<button type="button">Inside</button>
				</DialogContent>
			</Dialog>,
		);

		fireEvent.click(screen.getByRole('button', { name: 'Open' }));

		await waitFor(() => expect(screen.getByRole('button', { name: 'Inside' })).toBeInTheDocument());
		expect(screen.getByRole('button', { name: 'Inside' })).not.toHaveFocus();
	});

	it('focuses into the dialog when auto-focus is not prevented', async () => {
		render(
			<Dialog>
				<DialogTrigger asChild>
					<button type="button">Open</button>
				</DialogTrigger>
				<DialogContent onOpenAutoFocus={() => {}}>
					<DialogTitle>Focus</DialogTitle>
					<button type="button">Inside</button>
				</DialogContent>
			</Dialog>,
		);

		fireEvent.click(screen.getByRole('button', { name: 'Open' }));

		await waitFor(() => expect(screen.getByRole('button', { name: 'Inside' })).toHaveFocus());
	});
});

describe('DialogWrapper preset', () => {
	it('renders title, body and footer and closes with the close button', () => {
		const onOpenChange = vi.fn();
		render(
			<DialogWrapper
				open
				onOpenChange={onOpenChange}
				title="Edit report"
				subTitle="Change the details"
				footer={<button type="button">Save</button>}
			>
				Body copy
			</DialogWrapper>,
		);

		expect(screen.getByText('Edit report')).toBeInTheDocument();
		expect(screen.getByText('Change the details')).toBeInTheDocument();
		expect(screen.getByText('Body copy')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();

		fireEvent.click(screen.getByRole('button', { name: 'Close' }));
		expect(onOpenChange).toHaveBeenCalledWith(false);
	});

	it('does not close on an outside press when disableOutsideClick is set', () => {
		const onOpenChange = vi.fn();
		render(
			<DialogWrapper open onOpenChange={onOpenChange} title="Locked" disableOutsideClick>
				Body copy
			</DialogWrapper>,
		);

		const overlay = document.querySelector('[data-slot="dialog-overlay"]') as HTMLElement;
		fireEvent.pointerDown(overlay);
		fireEvent.mouseDown(overlay);
		fireEvent.click(overlay);

		expect(onOpenChange).not.toHaveBeenCalled();
		expect(screen.getByText('Body copy')).toBeInTheDocument();
	});
});

describe('ConfirmDialog preset', () => {
	it('runs the confirm handler and closes', async () => {
		const onConfirm = vi.fn().mockResolvedValue(true);
		const onOpenChange = vi.fn();
		render(
			<ConfirmDialog
				open
				onOpenChange={onOpenChange}
				title="Delete report"
				onConfirm={onConfirm}
				confirmText="Delete"
				cancelText="Cancel"
			>
				This cannot be undone.
			</ConfirmDialog>,
		);

		fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

		await waitFor(() => expect(onConfirm).toHaveBeenCalledTimes(1));
		await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
	});

	it('keeps the dialog open when confirm resolves false', async () => {
		const onConfirm = vi.fn().mockResolvedValue(false);
		const onOpenChange = vi.fn();
		render(
			<ConfirmDialog
				open
				onOpenChange={onOpenChange}
				title="Delete report"
				onConfirm={onConfirm}
				confirmText="Delete"
			>
				This cannot be undone.
			</ConfirmDialog>,
		);

		fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

		await waitFor(() => expect(onConfirm).toHaveBeenCalledTimes(1));
		expect(onOpenChange).not.toHaveBeenCalled();
	});
});
