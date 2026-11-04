import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
	isOnTop,
	OPENER_NAME,
	slot,
	waitForOnTop,
	zIndexOf,
} from '../../dialog/__tests__/dialog.test-utils.js';
import { Dialog } from '../../dialog/index.js';
import { Dropdown } from '../../dropdown/index.js';
import { Popover } from '../../popover/index.js';
import { Select } from '../../select/index.js';
import { toast, Toaster } from '../../toast/index.js';
import { Tooltip } from '../../tooltip/index.js';
import { AlertDialog } from '../index.js';
import {
	AlertHarness,
	AlertInDialogHarness,
	cancelButton,
	DialogOverAlertHarness,
	openChildAlert,
	openDialogOverAlert,
	openFromButton,
	renderOpenAlert,
} from './alert-dialog.test-utils.js';

function layer(index = 0): HTMLElement {
	return document.querySelectorAll<HTMLElement>('[data-slot$="layer"]')[index] as HTMLElement;
}

function alertLayer(): HTMLElement {
	return slot('alert-dialog-layer') as HTMLElement;
}

function dialogLayer(): HTMLElement {
	return slot('dialog-layer') as HTMLElement;
}

function setRootProperty(name: string, value: string): () => void {
	const root = document.documentElement.style;

	root.setProperty(name, value);

	return () => root.removeProperty(name);
}

const FRAMEWORKS = [
	{ type: 'item', value: 'react', label: 'React' },
	{ type: 'item', value: 'vue', label: 'Vue' },
	{ type: 'item', value: 'angular', label: 'Angular' },
] as const;

describe('AlertDialog layer', () => {
	it('stacks at 50 when it opens from a page with no layer of its own', async () => {
		render(<AlertHarness />);

		await openFromButton();

		expect(zIndexOf(alertLayer())).toBe(50);
		expect(isOnTop(screen.getByTestId('alert-title'))).toBe(true);
		expect(isOnTop(cancelButton())).toBe(true);
	});

	it('stacks just above a fixed element it is opened from', async () => {
		render(
			<div style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
				<AlertHarness />
			</div>,
		);

		await openFromButton();

		expect(zIndexOf(alertLayer())).toBe(1001);
		expect(isOnTop(screen.getByTestId('alert-title'))).toBe(true);
		expect(isOnTop(cancelButton())).toBe(true);
		expect(document.elementFromPoint(1, 1)).toBe(screen.getByTestId('alert').parentElement);
	});

	it('lets a press land on the panel when it opens from a fixed element', async () => {
		const onCancel = vi.fn();
		const onConfirm = vi.fn();
		render(
			<div style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
				<AlertHarness onCancel={onCancel} onConfirm={onConfirm} closesOnCancel={false} />
			</div>,
		);
		await openFromButton();

		await userEvent.click(screen.getByRole('button', { name: 'Delete view' }));
		await userEvent.click(cancelButton());

		expect(onConfirm).toHaveBeenCalledOnce();
		expect(onCancel).toHaveBeenCalledOnce();
	});

	it('stacks above an element in a drawer-like layer that is itself inside another one', async () => {
		render(
			<div style={{ position: 'fixed', inset: 0, zIndex: 20 }}>
				<div style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
					<AlertHarness />
				</div>
			</div>,
		);

		await openFromButton();

		expect(zIndexOf(alertLayer())).toBeGreaterThanOrEqual(21);
		expect(isOnTop(screen.getByTestId('alert-title'))).toBe(true);
	});

	it('never goes below its own z-index, whatever layer it opens from', async () => {
		render(
			<div style={{ position: 'relative', zIndex: 10 }}>
				<AlertHarness />
			</div>,
		);

		await openFromButton();

		expect(zIndexOf(alertLayer())).toBe(50);
	});

	it('moves the backdrop and the panel together with --alert-dialog-z-index', async () => {
		const restore = setRootProperty('--alert-dialog-z-index', '1500');
		render(<div data-testid="chrome" style={{ position: 'fixed', inset: 0, zIndex: 1000 }} />);

		try {
			await renderOpenAlert();

			expect(zIndexOf(alertLayer())).toBe(1500);
			expect(document.elementFromPoint(1, 1)).toBe(screen.getByTestId('alert').parentElement);
			expect(isOnTop(screen.getByTestId('alert-title'))).toBe(true);
		} finally {
			restore();
		}
	});

	it('is not moved by --dialog-z-index, which belongs to Dialog', async () => {
		const restore = setRootProperty('--dialog-z-index', '1500');

		try {
			await renderOpenAlert();

			expect(zIndexOf(alertLayer())).toBe(50);
		} finally {
			restore();
		}
	});

	it('still clears the layer it opens from when --alert-dialog-z-index is lower', async () => {
		const restore = setRootProperty('--alert-dialog-z-index', '5');

		try {
			render(
				<div style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
					<AlertHarness />
				</div>,
			);
			await openFromButton();

			expect(zIndexOf(alertLayer())).toBe(1001);
		} finally {
			restore();
		}
	});

	it('stays under a toast', async () => {
		render(<Toaster />);
		await renderOpenAlert();

		act(() => {
			toast.danger('Could not copy the link', { action: { label: 'Close' } });
		});
		const toaster = await vi.waitFor(() => {
			const element = slot('toaster');
			expect(element).not.toBeNull();

			return element as HTMLElement;
		});

		expect(zIndexOf(toaster)).toBeGreaterThan(zIndexOf(alertLayer()));
		act(() => toast.dismiss());
	});

	// The row a delete alert opens from is often gone by then, which leaves the focus on body.
	it('stays under a toast that is already on screen when it opens with the focus on body', async () => {
		render(<Toaster />);
		act(() => {
			toast.danger('Could not copy the link', { action: { label: 'Close' } });
		});
		await vi.waitFor(() => expect(slot('toast')).not.toBeNull());
		(document.activeElement as HTMLElement | null)?.blur();

		try {
			render(<AlertHarness defaultOpen />);
			await screen.findByRole('alertdialog');

			expect(zIndexOf(alertLayer())).toBe(50);
			expect(zIndexOf(slot('toaster') as HTMLElement)).toBeGreaterThan(zIndexOf(alertLayer()));
		} finally {
			act(() => toast.dismiss());
			await vi.waitFor(() => expect(slot('toast')).toBeNull());
		}
	});
});

describe('AlertDialog layer over a Dialog', () => {
	it('stacks the alert above the dialog, and paints it on top', async () => {
		render(<AlertInDialogHarness />);
		await userEvent.click(screen.getByRole('button', { name: OPENER_NAME }));
		await userEvent.click(await screen.findByRole('button', { name: 'Open child' }));
		const panel = await screen.findByRole('alertdialog');

		expect(zIndexOf(alertLayer())).toBeGreaterThan(zIndexOf(dialogLayer()));
		expect(isOnTop(panel)).toBe(true);
		expect(isOnTop(within(panel).getByRole('button', { name: 'Cancel' }))).toBe(true);
	});

	it('stacks above a dialog whose --dialog-z-index is raised', async () => {
		const restore = setRootProperty('--dialog-z-index', '1500');

		try {
			render(<AlertInDialogHarness />);
			await userEvent.click(screen.getByRole('button', { name: OPENER_NAME }));
			await screen.findByRole('dialog', { name: 'Edit view' });

			const panel = await openChildAlert();

			expect(zIndexOf(dialogLayer())).toBe(1500);
			expect(zIndexOf(alertLayer())).toBeGreaterThan(1500);
			expect(isOnTop(panel)).toBe(true);
		} finally {
			restore();
		}
	});

	it('stacks every level above the one before it, three deep', async () => {
		function ThreeLevels() {
			const [second, setSecond] = useState(false);
			const [third, setThird] = useState(false);

			return (
				<Dialog open onClose={() => {}} title="First">
					<button type="button" onClick={() => setSecond(true)}>
						Open second
					</button>
					<Dialog open={second} onClose={() => setSecond(false)} title="Second">
						<button type="button" onClick={() => setThird(true)}>
							Open third
						</button>
						<AlertDialog
							open={third}
							title="Third"
							color="primary"
							confirmText="Go"
							onConfirm={() => {}}
							onCancel={() => setThird(false)}
						>
							Deep
						</AlertDialog>
					</Dialog>
				</Dialog>
			);
		}
		render(<ThreeLevels />);
		await userEvent.click(await screen.findByRole('button', { name: 'Open second' }));
		await userEvent.click(await screen.findByRole('button', { name: 'Open third' }));
		const third = await screen.findByRole('alertdialog', { name: 'Third' });

		expect(zIndexOf(layer(1))).toBeGreaterThan(zIndexOf(layer(0)));
		expect(zIndexOf(layer(2))).toBeGreaterThan(zIndexOf(layer(1)));
		expect(isOnTop(third)).toBe(true);
	});
});

describe.each(['body', 'sibling'] as const)(
	'AlertDialog layer under a Dialog declared in its %s',
	(dialogIn) => {
		it('stacks the dialog above the alert, and paints it on top', async () => {
			render(<DialogOverAlertHarness dialogIn={dialogIn} />);
			await userEvent.click(screen.getByRole('button', { name: OPENER_NAME }));
			await screen.findByRole('alertdialog');

			const panel = await openDialogOverAlert();

			expect(zIndexOf(dialogLayer())).toBeGreaterThan(zIndexOf(alertLayer()));
			expect(isOnTop(panel)).toBe(true);
			expect(isOnTop(within(panel).getByRole('textbox', { name: 'Dialog field' }))).toBe(true);
		});

		it('stacks the dialog above an alert whose --alert-dialog-z-index is raised', async () => {
			const restore = setRootProperty('--alert-dialog-z-index', '1500');

			try {
				render(<DialogOverAlertHarness dialogIn={dialogIn} />);
				await userEvent.click(screen.getByRole('button', { name: OPENER_NAME }));
				await screen.findByRole('alertdialog');

				const panel = await openDialogOverAlert();

				expect(zIndexOf(alertLayer())).toBe(1500);
				expect(zIndexOf(dialogLayer())).toBeGreaterThan(1500);
				expect(isOnTop(panel)).toBe(true);
			} finally {
				restore();
			}
		});
	},
);

describe('AlertDialog with popups opened inside the panel', () => {
	it('portals a tooltip into the panel and stacks it above', async () => {
		await renderOpenAlert({
			children: (
				<Tooltip title="Copies the span id">
					<button type="button">Copy</button>
				</Tooltip>
			),
		});

		await userEvent.hover(screen.getByRole('button', { name: 'Copy' }));
		const tooltip = await screen.findByRole('tooltip');

		expect(screen.getByTestId('alert')).toContainElement(tooltip);
		await waitForOnTop(tooltip);
	});

	it('portals a popover into the panel, stacks it above and keeps it clickable', async () => {
		const onClick = vi.fn();
		await renderOpenAlert({
			children: (
				<Popover
					nativeButton
					side="bottom"
					align="start"
					aria-label="Actions"
					trigger={<button type="button">Open</button>}
				>
					<button type="button" onClick={onClick}>
						Rename
					</button>
				</Popover>
			),
		});

		await userEvent.click(screen.getByRole('button', { name: 'Open' }));
		const popover = await screen.findByRole('dialog', { name: 'Actions' });

		expect(screen.getByTestId('alert')).toContainElement(popover);
		await waitForOnTop(screen.getByRole('button', { name: 'Rename' }));

		await userEvent.click(screen.getByRole('button', { name: 'Rename' }));

		expect(onClick).toHaveBeenCalledOnce();
	});

	it('portals a select into the panel, stacks it above and keeps the rows clickable', async () => {
		await renderOpenAlert({
			children: (
				<Select
					placeholder="Select a framework..."
					aria-label="Framework"
					items={[...FRAMEWORKS]}
				/>
			),
		});

		await userEvent.click(screen.getByRole('combobox', { name: 'Framework' }));
		const listbox = await screen.findByRole('listbox');
		const row = within(listbox).getByRole('option', { name: 'Vue' });

		expect(screen.getByTestId('alert')).toContainElement(listbox);
		await waitForOnTop(row);

		await userEvent.click(row);

		expect(screen.getByRole('combobox', { name: 'Framework' })).toHaveTextContent('Vue');
	});

	it('portals a dropdown into the panel, stacks it above and keeps the rows clickable', async () => {
		const onClick = vi.fn();
		await renderOpenAlert({
			children: (
				<Dropdown
					nativeButton
					side="bottom"
					align="start"
					items={[{ type: 'item', value: 'rename', label: 'Rename', onClick }]}
				>
					<button type="button">Actions</button>
				</Dropdown>
			),
		});

		await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
		const menu = await screen.findByRole('menu');
		const row = within(menu).getByRole('menuitem', { name: 'Rename' });

		expect(screen.getByTestId('alert')).toContainElement(menu);
		await waitForOnTop(row);

		await userEvent.click(row);

		expect(onClick).toHaveBeenCalledOnce();
	});

	it('does not answer the alert on a press on a popup opened from the panel', async () => {
		const onCancel = vi.fn();
		await renderOpenAlert({
			onCancel,
			closesOnCancel: false,
			children: (
				<Popover
					nativeButton
					side="bottom"
					align="start"
					aria-label="Actions"
					trigger={<button type="button">Open</button>}
				>
					<button type="button">Rename</button>
				</Popover>
			),
		});
		await userEvent.click(screen.getByRole('button', { name: 'Open' }));
		await screen.findByRole('dialog', { name: 'Actions' });

		await userEvent.click(screen.getByRole('button', { name: 'Rename' }));

		expect(onCancel).not.toHaveBeenCalled();
		expect(screen.getByRole('alertdialog')).toBeInTheDocument();
	});
});

describe('AlertDialog Esc with a popup open inside the panel', () => {
	async function expectOnlyThePopupCloses(
		onCancel: ReturnType<typeof vi.fn>,
		popup: () => HTMLElement | null,
	) {
		await userEvent.keyboard('{Escape}');

		await waitFor(() => {
			expect(popup()).toBeNull();
		});
		expect(onCancel).not.toHaveBeenCalled();
		expect(screen.getByRole('alertdialog', { name: 'Delete this view?' })).toBeInTheDocument();

		await userEvent.keyboard('{Escape}');

		expect(onCancel).toHaveBeenCalledOnce();
	}

	it('closes only the select list', async () => {
		const onCancel = vi.fn();
		await renderOpenAlert({
			onCancel,
			closesOnCancel: false,
			children: <Select placeholder="Pick" aria-label="Framework" items={[...FRAMEWORKS]} />,
		});
		await userEvent.click(screen.getByRole('combobox', { name: 'Framework' }));
		await screen.findByRole('listbox');

		await expectOnlyThePopupCloses(onCancel, () => screen.queryByRole('listbox'));
	});

	it('closes only the dropdown menu', async () => {
		const onCancel = vi.fn();
		await renderOpenAlert({
			onCancel,
			closesOnCancel: false,
			children: (
				<Dropdown
					nativeButton
					side="bottom"
					align="start"
					items={[{ type: 'item', value: 'rename', label: 'Rename' }]}
				>
					<button type="button">Actions</button>
				</Dropdown>
			),
		});
		await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
		await screen.findByRole('menu');

		await expectOnlyThePopupCloses(onCancel, () => screen.queryByRole('menu'));
	});

	it('closes only the popover', async () => {
		const onCancel = vi.fn();
		await renderOpenAlert({
			onCancel,
			closesOnCancel: false,
			children: (
				<Popover
					nativeButton
					side="bottom"
					align="start"
					aria-label="Actions"
					trigger={<button type="button">Open</button>}
				>
					<button type="button">Rename</button>
				</Popover>
			),
		});
		await userEvent.click(screen.getByRole('button', { name: 'Open' }));
		await screen.findByRole('dialog', { name: 'Actions' });

		await expectOnlyThePopupCloses(onCancel, () =>
			screen.queryByRole('dialog', { name: 'Actions' }),
		);
	});
});

describe('AlertDialog with a toast over it', () => {
	afterEach(() => {
		act(() => toast.dismiss());
	});

	async function pressToastAction(): Promise<void> {
		act(() => {
			toast.danger('Could not copy the link', { action: { label: 'Close' } });
		});
		const action = await vi.waitFor(() => {
			const element = slot('toast-action');
			expect(element).not.toBeNull();

			return element as HTMLElement;
		});

		await userEvent.click(action);
		await vi.waitFor(() => expect(slot('toast')).toBeNull());
	}

	it('stays open when a toast button is pressed', async () => {
		const onCancel = vi.fn();
		render(<Toaster />);
		render(<AlertHarness defaultOpen onCancel={onCancel} closesOnCancel={false} />);
		await screen.findByRole('alertdialog');

		await pressToastAction();

		expect(onCancel).not.toHaveBeenCalled();
		expect(screen.getByRole('alertdialog')).toBeInTheDocument();
	});

	it('keeps the dialog and the alert open when a toast button is pressed over a nested alert', async () => {
		const onParentClose = vi.fn();
		const onChildCancel = vi.fn();
		render(<Toaster />);
		render(
			<AlertInDialogHarness
				defaultParentOpen
				defaultChildOpen
				onParentClose={onParentClose}
				onChildCancel={onChildCancel}
				closes={false}
			/>,
		);
		await screen.findByRole('alertdialog', { name: 'Discard changes?' });

		await pressToastAction();

		expect(onParentClose).not.toHaveBeenCalled();
		expect(onChildCancel).not.toHaveBeenCalled();
	});

	it('does nothing on a press on the backdrop', async () => {
		const onCancel = vi.fn();
		render(<Toaster />);
		render(<AlertHarness defaultOpen onCancel={onCancel} closesOnCancel={false} />);
		await screen.findByRole('alertdialog');
		act(() => {
			toast.danger('Could not copy the link', { action: { label: 'Close' } });
		});
		await vi.waitFor(() => expect(slot('toast-action')).not.toBeNull());

		await userEvent.click(screen.getByTestId('alert-backdrop'));

		expect(onCancel).not.toHaveBeenCalled();
		expect(screen.getByRole('alertdialog')).toBeInTheDocument();
	});
});

describe('AlertDialog layer with the focus on body', () => {
	function addModal(role: 'dialog' | 'alertdialog' = 'dialog', display = 'block'): HTMLElement {
		const drawer = document.createElement('div');
		drawer.style.cssText = `display:${display};position:fixed;inset:0 0 0 50%;z-index:1000;`;
		drawer.innerHTML = `<div role="${role}" aria-label="Settings"><p>Drawer</p></div>`;
		document.body.append(drawer);
		(document.activeElement as HTMLElement | null)?.blur();

		return drawer;
	}

	// A drawer's save button that closes its form as the alert opens leaves the focus on body.
	it.each(['dialog', 'alertdialog'] as const)(
		'stacks above the highest open modal on the page, a role=%s',
		async (role) => {
			const drawer = addModal(role);

			try {
				render(<AlertHarness defaultOpen />);
				await screen.findByTestId('alert-title');

				expect(zIndexOf(alertLayer())).toBe(1001);
				await waitForOnTop(screen.getByTestId('alert-title'));
			} finally {
				drawer.remove();
			}
		},
	);

	it('ignores a modal that is hidden', async () => {
		const drawer = addModal('dialog', 'none');

		try {
			render(<AlertHarness defaultOpen />);
			await screen.findByTestId('alert-title');

			expect(zIndexOf(alertLayer())).toBe(50);
		} finally {
			drawer.remove();
		}
	});
});
