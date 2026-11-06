import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ReactNode, useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Combobox } from '../../combobox/index.js';
import { Dialog } from '../../dialog/dialog.js';
import { Dropdown } from '../../dropdown/index.js';
import { Popover } from '../../popover/index.js';
import { Select } from '../../select/index.js';
import { toast, Toaster } from '../../toast/index.js';
import { Tooltip } from '../../tooltip/index.js';
import { Drawer } from '../drawer.js';
import type { DrawerCloseReasonType, DrawerTypeType } from '../types.js';
import {
	DrawerHarness,
	drawerPanel,
	isOnTop,
	openFromButton,
	renderOpenDrawer,
	slot,
	slots,
	waitForClosed,
	waitForOnTop,
	waitForSettled,
	zIndexOf,
} from './drawer.test-utils.js';

function layer(index = 0): HTMLElement {
	return slots('drawer-layer')[index] as HTMLElement;
}

function addStyle(css: string): HTMLStyleElement {
	const style = document.createElement('style');
	style.textContent = css;
	document.head.append(style);

	return style;
}

const FRAMEWORKS = [
	{ type: 'item', value: 'react', label: 'React' },
	{ type: 'item', value: 'vue', label: 'Vue' },
	{ type: 'item', value: 'angular', label: 'Angular' },
	{ type: 'item', value: 'svelte', label: 'Svelte' },
] as const;

const POPOVER = (
	<Popover
		nativeButton
		side="bottom"
		align="start"
		aria-label="Actions"
		trigger={<button type="button">Open</button>}
	>
		<button type="button">Rename</button>
	</Popover>
);

describe('Drawer layer', () => {
	it('puts the backdrop and the panel in one layer', async () => {
		await renderOpenDrawer();

		expect(layer()).toContainElement(screen.getByTestId('drawer'));
		expect(layer()).toContainElement(screen.getByTestId('drawer-backdrop'));
		expect(slots('drawer-layer')).toHaveLength(1);
	});

	it.each<DrawerTypeType>(['task', 'inspector'])(
		'stacks a %s at 50 when it opens from a page with no layer of its own',
		async (type) => {
			render(<DrawerHarness type={type} />);

			await openFromButton();

			expect(zIndexOf(layer())).toBe(50);
			expect(isOnTop(screen.getByTestId('drawer-title'))).toBe(true);
		},
	);

	it('stacks just above a fixed element it is opened from, such as an antd modal', async () => {
		render(
			<div style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
				<DrawerHarness />
			</div>,
		);

		await openFromButton();

		expect(zIndexOf(layer())).toBe(1001);
		expect(isOnTop(screen.getByTestId('drawer-title'))).toBe(true);
		expect(isOnTop(screen.getByRole('textbox', { name: 'Name' }))).toBe(true);
		expect(layer().contains(document.elementFromPoint(1, 1))).toBe(true);
	});

	it('stacks an inspector above a fixed element it is opened from, and leaves the page beside it to the pointer', async () => {
		render(
			<div data-testid="opener-layer" style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
				<DrawerHarness type="inspector" width="narrow" />
			</div>,
		);

		await openFromButton();
		const { left, top, height } = drawerPanel().getBoundingClientRect();

		expect(zIndexOf(layer())).toBe(1001);
		expect(isOnTop(screen.getByTestId('drawer-title'))).toBe(true);
		expect(document.elementFromPoint(left / 2, top + height / 2)).toBe(
			screen.getByTestId('opener-layer'),
		);
	});

	it('lets a press land on the panel when it opens from a fixed element', async () => {
		const onClose = vi.fn();
		render(
			<div style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
				<DrawerHarness closes={false} onClose={onClose} />
			</div>,
		);
		await openFromButton();

		await userEvent.click(screen.getByRole('textbox', { name: 'Name' }));
		await userEvent.click(screen.getByRole('button', { name: 'Close' }));

		expect(onClose).toHaveBeenCalledExactlyOnceWith('close-press');
	});

	it('never goes below its own z-index, whatever layer it opens from', async () => {
		render(
			<div style={{ position: 'relative', zIndex: 10 }}>
				<DrawerHarness />
			</div>,
		);

		await openFromButton();

		expect(zIndexOf(layer())).toBe(50);
	});

	it('moves the backdrop and the panel together with --drawer-z-index', async () => {
		const root = document.documentElement.style;
		root.setProperty('--drawer-z-index', '1500');
		render(<div data-testid="chrome" style={{ position: 'fixed', inset: 0, zIndex: 1000 }} />);

		try {
			await renderOpenDrawer();

			expect(zIndexOf(layer())).toBe(1500);
			expect(layer().contains(document.elementFromPoint(1, 1))).toBe(true);
			expect(isOnTop(screen.getByTestId('drawer-title'))).toBe(true);
		} finally {
			root.removeProperty('--drawer-z-index');
		}
	});

	it('still clears the layer it opens from when --drawer-z-index is lower', async () => {
		const root = document.documentElement.style;
		root.setProperty('--drawer-z-index', '5');

		try {
			render(
				<div style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
					<DrawerHarness />
				</div>,
			);
			await openFromButton();

			expect(zIndexOf(layer())).toBe(1001);
		} finally {
			root.removeProperty('--drawer-z-index');
		}
	});

	it('is not covered by the rules an app writes for the slots of the old drawer', async () => {
		const rules = addStyle(`
			[data-slot='drawer-overlay'] { z-index: 1000 !important; }
			[data-slot='drawer-content'] { z-index: 1001 !important; }
		`);

		try {
			await renderOpenDrawer();

			expect(isOnTop(screen.getByRole('textbox', { name: 'Name' }))).toBe(true);
		} finally {
			rules.remove();
		}
	});
});

interface DialogInDrawerProps {
	type?: DrawerTypeType;
	onDrawerClose?: (reason: DrawerCloseReasonType) => void;
}

/**
 * A drawer with a button that opens a `Dialog` declared in its body, such as a rename form opened
 * from a record.
 */
function DialogInDrawer({ type = 'task', onDrawerClose }: DialogInDrawerProps): ReactNode {
	const [drawerOpen, setDrawerOpen] = useState(true);
	const [dialogOpen, setDialogOpen] = useState(false);

	return (
		<Drawer
			type={type}
			open={drawerOpen}
			onClose={(reason) => {
				onDrawerClose?.(reason);
				setDrawerOpen(false);
			}}
			title="Log details"
			testId="drawer"
		>
			<button type="button" onClick={() => setDialogOpen(true)}>
				Rename
			</button>
			<Dialog
				open={dialogOpen}
				onClose={() => setDialogOpen(false)}
				title="Rename view"
				testId="dialog"
				width="narrow"
			>
				<input aria-label="View name" />
			</Dialog>
		</Drawer>
	);
}

async function openDialogInDrawer(props: DialogInDrawerProps = {}): Promise<HTMLElement> {
	render(<DialogInDrawer {...props} />);
	await waitForSettled();
	await userEvent.click(await screen.findByRole('button', { name: 'Rename' }));

	return waitFor(() => {
		const panel = screen.getByRole('dialog', { name: 'Rename view' });

		expect(panel.contains(document.activeElement)).toBe(true);

		return panel;
	});
}

describe('Drawer layer with a Dialog opened from inside it', () => {
	it.each<DrawerTypeType>(['task', 'inspector'])(
		'stacks the dialog above a %s and paints it on top',
		async (type) => {
			const panel = await openDialogInDrawer({ type });

			expect(zIndexOf(slot('dialog-layer') as HTMLElement)).toBeGreaterThan(zIndexOf(layer()));
			await waitForOnTop(panel);
			await waitForOnTop(within(panel).getByRole('textbox', { name: 'View name' }));
		},
	);

	it('closes only the dialog on Esc, then the drawer on the next', async () => {
		const onDrawerClose = vi.fn();
		await openDialogInDrawer({ onDrawerClose });

		await userEvent.keyboard('{Escape}');

		await waitFor(() => {
			expect(screen.queryByRole('dialog', { name: 'Rename view', hidden: true })).toBeNull();
		});
		expect(onDrawerClose).not.toHaveBeenCalled();
		expect(drawerPanel()).toHaveAttribute('data-open');

		await userEvent.keyboard('{Escape}');

		expect(onDrawerClose).toHaveBeenCalledExactlyOnceWith('escape-key');
		await waitForClosed();
	});
});

interface DrawerInDialogProps {
	type?: DrawerTypeType;
	onDialogClose?: () => void;
	onDrawerClose?: (reason: DrawerCloseReasonType) => void;
}

/**
 * A dialog with a button that opens a drawer declared in its body, the way the pipeline editor
 * opens its preview.
 */
function DrawerInDialog({ type = 'task', onDialogClose, onDrawerClose }: DrawerInDialogProps) {
	const [dialogOpen, setDialogOpen] = useState(true);
	const [drawerOpen, setDrawerOpen] = useState(false);

	return (
		<Dialog
			open={dialogOpen}
			onClose={() => {
				onDialogClose?.();
				setDialogOpen(false);
			}}
			title="Edit pipeline"
			testId="dialog"
			width="wide"
		>
			<button type="button" onClick={() => setDrawerOpen(true)}>
				Preview
			</button>
			<Drawer
				type={type}
				open={drawerOpen}
				onClose={(reason) => {
					onDrawerClose?.(reason);
					setDrawerOpen(false);
				}}
				title="Pipeline preview"
				testId="drawer"
			>
				<input aria-label="Filter" />
			</Drawer>
		</Dialog>
	);
}

async function openDrawerInDialog(props: DrawerInDialogProps = {}): Promise<void> {
	render(<DrawerInDialog {...props} />);
	await userEvent.click(await screen.findByRole('button', { name: 'Preview' }));
	await waitFor(() => {
		expect(drawerPanel().contains(document.activeElement)).toBe(true);
	});
	await waitForSettled();
}

describe('Drawer layer when opened from inside a Dialog', () => {
	it.each<DrawerTypeType>(['task', 'inspector'])(
		'stacks a %s above the dialog and paints it on top',
		async (type) => {
			await openDrawerInDialog({ type });

			expect(zIndexOf(layer())).toBeGreaterThan(zIndexOf(slot('dialog-layer') as HTMLElement));
			await waitForOnTop(screen.getByTestId('drawer-title'));
			await waitForOnTop(screen.getByRole('textbox', { name: 'Filter' }));
		},
	);

	it('marks the dialog panel with data-nested-dialog-open while the drawer is open', async () => {
		await openDrawerInDialog();

		expect(screen.getByTestId('dialog')).toHaveAttribute('data-nested-dialog-open');

		await userEvent.keyboard('{Escape}');
		await waitForClosed();

		await waitFor(() => {
			expect(screen.getByTestId('dialog')).not.toHaveAttribute('data-nested-dialog-open');
		});
	});

	it('takes typing in its body, not in the dialog under it', async () => {
		await openDrawerInDialog();

		await userEvent.click(screen.getByRole('textbox', { name: 'Filter' }));
		await userEvent.keyboard('status:error');

		expect(screen.getByRole('textbox', { name: 'Filter' })).toHaveValue('status:error');
		expect(screen.getByRole('textbox', { name: 'Filter' })).toHaveFocus();
	});

	it('closes only the drawer on Esc, then the dialog on the next', async () => {
		const onDialogClose = vi.fn();
		const onDrawerClose = vi.fn();
		await openDrawerInDialog({ onDialogClose, onDrawerClose });

		await userEvent.keyboard('{Escape}');

		expect(onDrawerClose).toHaveBeenCalledExactlyOnceWith('escape-key');
		expect(onDialogClose).not.toHaveBeenCalled();
		await waitForClosed();
		expect(screen.getByRole('dialog', { name: 'Edit pipeline' })).toBeInTheDocument();

		await userEvent.keyboard('{Escape}');

		expect(onDialogClose).toHaveBeenCalledOnce();
	});

	it('gives the focus back to the button in the dialog that opened it', async () => {
		await openDrawerInDialog();

		await userEvent.click(screen.getByRole('button', { name: 'Close' }));
		await waitForClosed();

		await waitFor(() => {
			expect(screen.getByRole('button', { name: 'Preview' })).toHaveFocus();
		});
	});
});

describe('Drawer layer under a toast', () => {
	afterEach(() => {
		act(() => toast.dismiss());
	});

	async function raiseDanger(): Promise<HTMLElement> {
		act(() => {
			toast.danger('Could not copy the link', { action: { label: 'Close' } });
		});

		return vi.waitFor(() => {
			const element = slot('toast-action');
			expect(element).not.toBeNull();

			return element as HTMLElement;
		});
	}

	it.each<DrawerTypeType>(['task', 'inspector'])(
		'keeps a %s under a toast raised from the app root',
		async (type) => {
			render(<Toaster />);
			await renderOpenDrawer({ type });

			await waitForOnTop(await raiseDanger());

			expect(zIndexOf(slot('toaster') as HTMLElement)).toBeGreaterThan(zIndexOf(layer()));
		},
	);

	it('portals a toast raised from a Toaster inside it into the panel, and paints it on top', async () => {
		await renderOpenDrawer({ children: <Toaster /> });

		const action = await raiseDanger();

		expect(drawerPanel()).toContainElement(slot('toaster'));
		await waitForOnTop(action);
	});

	it.each<DrawerTypeType>(['task', 'inspector'])(
		'leaves a %s open when a toast button is pressed',
		async (type) => {
			const onClose = vi.fn();
			render(<Toaster />);
			await renderOpenDrawer({ type, onClose, closes: false });

			await userEvent.click(await raiseDanger());
			await vi.waitFor(() => expect(slot('toast')).toBeNull());

			expect(onClose).not.toHaveBeenCalled();
			expect(drawerPanel()).toHaveAttribute('data-open');
		},
	);

	it('still closes a task on a press on the backdrop while a toast shows', async () => {
		const onClose = vi.fn();
		render(<Toaster />);
		await renderOpenDrawer({ onClose, closes: false });
		await raiseDanger();

		await userEvent.click(screen.getByTestId('drawer-backdrop'));

		expect(onClose).toHaveBeenCalledExactlyOnceWith('outside-press');
	});
});

describe('Drawer with popups opened inside the panel', () => {
	it.each<DrawerTypeType>(['task', 'inspector'])(
		'portals a popover into a %s panel and stacks it above',
		async (type) => {
			await renderOpenDrawer({ type, children: POPOVER });

			await userEvent.click(screen.getByRole('button', { name: 'Open' }));
			const popover = await screen.findByRole('dialog', { name: 'Actions' });

			expect(drawerPanel()).toContainElement(popover);
			await waitForOnTop(popover);
			await waitForOnTop(screen.getByRole('button', { name: 'Rename' }));

			await userEvent.click(screen.getByRole('button', { name: 'Rename' }));
		},
	);

	it('portals a tooltip into the panel and stacks it above', async () => {
		await renderOpenDrawer({
			children: (
				<Tooltip title="Copies the span id">
					<button type="button">Copy</button>
				</Tooltip>
			),
		});

		await userEvent.hover(screen.getByRole('button', { name: 'Copy' }));
		const tooltip = await screen.findByRole('tooltip');

		expect(drawerPanel()).toContainElement(tooltip);
		await waitForOnTop(tooltip);
	});

	it('portals a tooltip into the panel when it is handed the panel as its container', async () => {
		function HandsThePanel(): ReactNode {
			const [panel, setPanel] = useState<HTMLDivElement | null>(null);

			return (
				<Drawer ref={setPanel} type="inspector" open onClose={() => {}} title="Log details">
					<Tooltip container={panel} title="Copies the span id">
						<button type="button">Copy</button>
					</Tooltip>
				</Drawer>
			);
		}
		render(<HandsThePanel />);
		await waitForSettled();

		await userEvent.hover(await screen.findByRole('button', { name: 'Copy' }));
		const tooltip = await screen.findByRole('tooltip');

		expect(drawerPanel()).toContainElement(tooltip);
		await waitForOnTop(tooltip);
	});

	it('portals a tooltip opened inside a popover into the panel too, and paints it over the popover', async () => {
		await renderOpenDrawer({
			children: (
				<Popover
					nativeButton
					side="bottom"
					align="start"
					aria-label="Actions"
					trigger={<button type="button">Open</button>}
				>
					<Tooltip title="Copies the span id">
						<button type="button">Copy</button>
					</Tooltip>
				</Popover>
			),
		});

		await userEvent.click(screen.getByRole('button', { name: 'Open' }));
		await userEvent.hover(await screen.findByRole('button', { name: 'Copy' }));
		const tooltip = await screen.findByRole('tooltip');
		const popover = screen
			.getByRole('dialog', { name: 'Actions' })
			.closest('[data-slot="popover-positioner"]') as Element;
		const tooltipPositioner = tooltip.closest('[data-slot="tooltip-positioner"]') as Element;

		expect(drawerPanel()).toContainElement(tooltip);
		expect(zIndexOf(tooltipPositioner)).toBeGreaterThanOrEqual(zIndexOf(popover));
		expect(popover.compareDocumentPosition(tooltipPositioner)).toBe(
			Node.DOCUMENT_POSITION_FOLLOWING,
		);
		await waitForOnTop(tooltip);
	});

	it.each<DrawerTypeType>(['task', 'inspector'])(
		'portals a select into a %s panel, stacks it above and keeps the rows clickable',
		async (type) => {
			await renderOpenDrawer({
				type,
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

			expect(drawerPanel()).toContainElement(listbox);
			await waitForOnTop(row);

			await userEvent.click(row);

			expect(screen.getByRole('combobox', { name: 'Framework' })).toHaveTextContent('Vue');
		},
	);

	it('portals a combobox into the panel, stacks it above and keeps the rows clickable', async () => {
		await renderOpenDrawer({
			children: (
				<Combobox
					placeholder="Select a framework..."
					searchInputProps={{ placeholder: 'Search' }}
					aria-label="Framework"
					items={[...FRAMEWORKS]}
				/>
			),
		});

		await userEvent.click(screen.getByRole('combobox', { name: 'Framework' }));
		const listbox = await screen.findByRole('listbox');
		const row = within(listbox).getByRole('option', { name: 'Vue' });

		expect(drawerPanel()).toContainElement(listbox);
		await waitForOnTop(row);

		await userEvent.click(row);

		expect(screen.getByRole('combobox', { name: 'Framework' })).toHaveTextContent('Vue');
	});

	it.each<DrawerTypeType>(['task', 'inspector'])(
		'portals a dropdown into a %s panel, stacks it above and keeps the rows clickable',
		async (type) => {
			const onClick = vi.fn();
			await renderOpenDrawer({
				type,
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

			expect(drawerPanel()).toContainElement(menu);
			await waitForOnTop(row);

			await userEvent.click(row);

			expect(onClick).toHaveBeenCalledOnce();
		},
	);

	it('does not count a press on a popup opened from the panel as an outside press', async () => {
		const onClose = vi.fn();
		await renderOpenDrawer({ onClose, closes: false, children: POPOVER });
		await userEvent.click(screen.getByRole('button', { name: 'Open' }));
		await screen.findByRole('dialog', { name: 'Actions' });

		await userEvent.click(screen.getByRole('button', { name: 'Rename' }));

		expect(onClose).not.toHaveBeenCalled();
	});
});

describe('Drawer Esc with a popup open inside the panel', () => {
	async function expectOnlyThePopupCloses(
		onClose: ReturnType<typeof vi.fn>,
		popup: () => HTMLElement | null,
	) {
		await userEvent.keyboard('{Escape}');

		await waitFor(() => {
			expect(popup()).toBeNull();
		});
		expect(onClose).not.toHaveBeenCalled();
		expect(drawerPanel()).toHaveAttribute('data-open');

		await userEvent.keyboard('{Escape}');

		expect(onClose).toHaveBeenCalledExactlyOnceWith('escape-key');
	}

	it('closes only the select list', async () => {
		const onClose = vi.fn();
		await renderOpenDrawer({
			onClose,
			closes: false,
			children: <Select placeholder="Pick" aria-label="Framework" items={[...FRAMEWORKS]} />,
		});
		await userEvent.click(screen.getByRole('combobox', { name: 'Framework' }));
		await screen.findByRole('listbox');

		await expectOnlyThePopupCloses(onClose, () => screen.queryByRole('listbox'));
	});

	it('closes only the combobox list', async () => {
		const onClose = vi.fn();
		await renderOpenDrawer({
			onClose,
			closes: false,
			children: (
				<Combobox
					placeholder="Pick"
					searchInputProps={{ placeholder: 'Search' }}
					aria-label="Framework"
					items={[...FRAMEWORKS]}
				/>
			),
		});
		await userEvent.click(screen.getByRole('combobox', { name: 'Framework' }));
		await screen.findByRole('listbox');
		await waitFor(() => {
			expect(screen.getByRole('combobox', { name: 'Search' })).toHaveFocus();
		});

		await expectOnlyThePopupCloses(onClose, () => screen.queryByRole('listbox'));
	});

	it('closes only the dropdown menu', async () => {
		const onClose = vi.fn();
		await renderOpenDrawer({
			onClose,
			closes: false,
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

		await expectOnlyThePopupCloses(onClose, () => screen.queryByRole('menu'));
	});

	it.each<DrawerTypeType>(['task', 'inspector'])(
		'closes only the popover in a %s',
		async (type) => {
			const onClose = vi.fn();
			await renderOpenDrawer({ type, onClose, closes: false, children: POPOVER });
			await userEvent.click(screen.getByRole('button', { name: 'Open' }));
			await screen.findByRole('dialog', { name: 'Actions' });

			await expectOnlyThePopupCloses(onClose, () =>
				screen.queryByRole('dialog', { name: 'Actions' }),
			);
		},
	);
});
