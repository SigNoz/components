import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Combobox } from '../../combobox/index.js';
import { Dropdown } from '../../dropdown/index.js';
import { Popover } from '../../popover/index.js';
import { Select } from '../../select/index.js';
import { toast, Toaster } from '../../toast/index.js';
import { Tooltip } from '../../tooltip/index.js';
import { Dialog } from '../dialog.js';
import { useDialogHandle } from '../use-dialog-handle.js';
import {
	DialogHarness,
	isOnTop,
	NestedHarness,
	openChild,
	openFromButton,
	renderOpenDialog,
	slot,
	waitForOnTop,
	zIndexOf,
} from './dialog.test-utils.js';

function layer(index = 0): HTMLElement {
	return document.querySelectorAll<HTMLElement>('[data-slot="dialog-layer"]')[index] as HTMLElement;
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

describe('Dialog layer', () => {
	it('puts the backdrop and the panel in one layer', async () => {
		await renderOpenDialog();

		expect(layer()).toContainElement(screen.getByTestId('dialog'));
		expect(layer()).toContainElement(screen.getByTestId('dialog-backdrop'));
		expect(document.querySelectorAll('[data-slot="dialog-layer"]')).toHaveLength(1);
	});

	it('stacks at 50 when it opens from a page with no layer of its own', async () => {
		render(<DialogHarness />);

		await openFromButton();

		expect(zIndexOf(layer())).toBe(50);
		expect(isOnTop(screen.getByTestId('dialog-title'))).toBe(true);
	});

	it('stacks just above a fixed element it is opened from', async () => {
		render(
			<div style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
				<DialogHarness />
			</div>,
		);

		await openFromButton();

		expect(zIndexOf(layer())).toBe(1001);
		expect(isOnTop(screen.getByTestId('dialog-title'))).toBe(true);
		expect(isOnTop(screen.getByRole('textbox', { name: 'Name' }))).toBe(true);
		expect(document.elementFromPoint(1, 1)).toBe(screen.getByTestId('dialog').parentElement);
	});

	it('lets a press land on the panel when it opens from a fixed element', async () => {
		const onClose = vi.fn();
		render(
			<div style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
				<DialogHarness closes={false} onClose={onClose} />
			</div>,
		);
		await openFromButton();

		await userEvent.click(screen.getByRole('textbox', { name: 'Name' }));
		await userEvent.click(screen.getByRole('button', { name: 'Close' }));

		expect(onClose).toHaveBeenCalledExactlyOnceWith('close-press');
	});

	it('stacks above an element in a drawer-like layer that is itself inside another one', async () => {
		render(
			<div style={{ position: 'fixed', inset: 0, zIndex: 20 }}>
				<div style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
					<DialogHarness />
				</div>
			</div>,
		);

		await openFromButton();

		expect(zIndexOf(layer())).toBeGreaterThanOrEqual(21);
		expect(isOnTop(screen.getByTestId('dialog-title'))).toBe(true);
	});

	it('never goes below its own z-index, whatever layer it opens from', async () => {
		render(
			<div style={{ position: 'relative', zIndex: 10 }}>
				<DialogHarness />
			</div>,
		);

		await openFromButton();

		expect(zIndexOf(layer())).toBe(50);
	});

	it('moves the backdrop and the panel together with --dialog-z-index', async () => {
		const root = document.documentElement.style;
		root.setProperty('--dialog-z-index', '1500');
		render(<div data-testid="chrome" style={{ position: 'fixed', inset: 0, zIndex: 1000 }} />);

		try {
			await renderOpenDialog();

			expect(zIndexOf(layer())).toBe(1500);
			expect(document.elementFromPoint(1, 1)).toBe(screen.getByTestId('dialog').parentElement);
			expect(isOnTop(screen.getByTestId('dialog-title'))).toBe(true);
		} finally {
			root.removeProperty('--dialog-z-index');
		}
	});

	it('still clears the layer it opens from when --dialog-z-index is lower', async () => {
		const root = document.documentElement.style;
		root.setProperty('--dialog-z-index', '5');

		try {
			render(
				<div style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
					<DialogHarness />
				</div>,
			);
			await openFromButton();

			expect(zIndexOf(layer())).toBe(1001);
		} finally {
			root.removeProperty('--dialog-z-index');
		}
	});

	it('stays under a toast', async () => {
		render(<Toaster />);
		await renderOpenDialog();

		act(() => {
			toast.danger('Could not copy the link');
		});
		const toaster = await vi.waitFor(() => {
			const element = slot('toaster');
			expect(element).not.toBeNull();

			return element as HTMLElement;
		});

		expect(zIndexOf(toaster)).toBeGreaterThan(zIndexOf(layer()));
		act(() => toast.dismiss());
	});

	it('is not covered by the rules an app writes for the slots of the old dialog', async () => {
		const rules = addStyle(`
			[data-slot='dialog-overlay'] { z-index: 1000 !important; }
			[data-slot='dialog-content'] { z-index: 1001 !important; }
		`);

		try {
			await renderOpenDialog();

			expect(isOnTop(screen.getByRole('textbox', { name: 'Name' }))).toBe(true);
		} finally {
			rules.remove();
		}
	});
});

describe('Dialog layer when nested', () => {
	it('stacks the child above the parent, and paints it on top', async () => {
		render(<NestedHarness childWidth="narrow" />);
		await userEvent.click(screen.getByRole('button', { name: 'Open dialog' }));
		await screen.findByRole('dialog', { name: 'Edit view' });

		const panel = await openChild();

		expect(document.querySelectorAll('[data-slot="dialog-layer"]')).toHaveLength(2);
		expect(zIndexOf(layer(1))).toBeGreaterThan(zIndexOf(layer(0)));
		expect(isOnTop(panel)).toBe(true);
		expect(isOnTop(within(panel).getByRole('textbox', { name: 'Child field' }))).toBe(true);
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
						<Dialog open={third} onClose={() => setThird(false)} title="Third">
							Deep
						</Dialog>
					</Dialog>
				</Dialog>
			);
		}
		render(<ThreeLevels />);
		await userEvent.click(await screen.findByRole('button', { name: 'Open second' }));
		await userEvent.click(await screen.findByRole('button', { name: 'Open third' }));
		const third = await screen.findByRole('dialog', { name: 'Third' });

		expect(zIndexOf(layer(1))).toBeGreaterThan(zIndexOf(layer(0)));
		expect(zIndexOf(layer(2))).toBeGreaterThan(zIndexOf(layer(1)));
		expect(isOnTop(third)).toBe(true);
	});
});

function ToastOpensDialog({ parentOpen = false }: { parentOpen?: boolean }) {
	const handle = useDialogHandle();
	const raise = (
		<button
			type="button"
			onClick={() =>
				toast.success('Saved', { action: { label: 'Review', onClick: () => handle.open() } })
			}
		>
			Raise toast
		</button>
	);

	return (
		<>
			<Toaster />
			{parentOpen ? (
				<Dialog open onClose={() => {}} title="Parent">
					{raise}
				</Dialog>
			) : (
				raise
			)}
			<Dialog handle={handle} title="From a toast">
				Body
			</Dialog>
		</>
	);
}

async function openFromToastAction(): Promise<void> {
	await userEvent.click(await screen.findByRole('button', { name: 'Raise toast' }));
	const action = await vi.waitFor(() => {
		const element = slot('toast-action');
		expect(element).not.toBeNull();

		return element as HTMLElement;
	});

	await userEvent.click(action);
	await screen.findByRole('dialog', { name: 'From a toast' });
}

describe('Dialog opened from a toast action', () => {
	afterEach(() => {
		act(() => toast.dismiss());
	});

	it('stacks at 50 and stays under the toast, so a later toast shows over it', async () => {
		render(<ToastOpensDialog />);

		await openFromToastAction();

		expect(zIndexOf(layer())).toBe(50);
		expect(zIndexOf(slot('toaster') as HTMLElement)).toBeGreaterThan(zIndexOf(layer()));

		act(() => {
			toast.danger('Could not save', { action: { label: 'Dismiss' } });
		});
		// The modal marks the page behind it, the toaster included, as hidden to assistive technology.
		const dismiss = await vi.waitFor(() => {
			const element = document.querySelector<HTMLElement>(
				'[data-slot="toast-action"][data-type="danger"]',
			);
			expect(element).not.toBeNull();

			return element as HTMLElement;
		});

		await waitForOnTop(dismiss);
	});

	it('stacks above the dialog that is open when the toast action is pressed', async () => {
		render(<ToastOpensDialog parentOpen />);

		await openFromToastAction();

		expect(document.querySelectorAll('[data-slot="dialog-layer"]')).toHaveLength(2);
		expect(zIndexOf(layer(1))).toBe(zIndexOf(layer(0)) + 1);
		expect(isOnTop(screen.getByRole('dialog', { name: 'From a toast' }))).toBe(true);
	});
});

describe('Dialog with popups opened inside the panel', () => {
	it('portals a popover into the panel and stacks it above', async () => {
		await renderOpenDialog({
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
		const popover = await screen.findByRole('dialog', { name: 'Actions' });

		expect(screen.getByTestId('dialog')).toContainElement(popover);
		await waitForOnTop(popover);
		await waitForOnTop(screen.getByRole('button', { name: 'Rename' }));

		await userEvent.click(screen.getByRole('button', { name: 'Rename' }));
	});

	it('portals a tooltip into the panel and stacks it above', async () => {
		await renderOpenDialog({
			children: (
				<Tooltip title="Copies the span id">
					<button type="button">Copy</button>
				</Tooltip>
			),
		});

		await userEvent.hover(screen.getByRole('button', { name: 'Copy' }));
		const tooltip = await screen.findByRole('tooltip');

		expect(screen.getByTestId('dialog')).toContainElement(tooltip);
		await waitForOnTop(tooltip);
	});

	it('portals a tooltip opened inside a popover into the panel too, and paints it over the popover', async () => {
		await renderOpenDialog({
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

		expect(screen.getByTestId('dialog')).toContainElement(tooltip);
		expect(zIndexOf(tooltipPositioner)).toBeGreaterThanOrEqual(zIndexOf(popover));
		expect(popover.compareDocumentPosition(tooltipPositioner)).toBe(
			Node.DOCUMENT_POSITION_FOLLOWING,
		);
	});

	it('portals a select into the panel, stacks it above and keeps the rows clickable', async () => {
		await renderOpenDialog({
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

		expect(screen.getByTestId('dialog')).toContainElement(listbox);
		await waitForOnTop(row);

		await userEvent.click(row);

		expect(screen.getByRole('combobox', { name: 'Framework' })).toHaveTextContent('Vue');
	});

	it('lets a select list reach past the bottom edge of a short panel', async () => {
		await renderOpenDialog({
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
		const last = within(listbox).getByRole('option', { name: 'Svelte' });
		const panel = screen.getByTestId('dialog').getBoundingClientRect();

		expect(last.getBoundingClientRect().bottom).toBeGreaterThan(panel.bottom);
		await waitForOnTop(last);
	});

	it('portals a combobox into the panel, stacks it above and keeps the rows clickable', async () => {
		await renderOpenDialog({
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

		expect(screen.getByTestId('dialog')).toContainElement(listbox);
		await waitForOnTop(row);

		await userEvent.click(row);

		expect(screen.getByRole('combobox', { name: 'Framework' })).toHaveTextContent('Vue');
	});

	it('portals a dropdown into the panel, stacks it above and keeps the rows clickable', async () => {
		const onClick = vi.fn();
		await renderOpenDialog({
			children: (
				<Dropdown
					nativeButton
					items={[{ type: 'item', value: 'rename', label: 'Rename', onClick }]}
				>
					<button type="button">Actions</button>
				</Dropdown>
			),
		});

		await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
		const menu = await screen.findByRole('menu');
		const row = within(menu).getByRole('menuitem', { name: 'Rename' });

		expect(screen.getByTestId('dialog')).toContainElement(menu);
		await waitForOnTop(row);

		await userEvent.click(row);

		expect(onClick).toHaveBeenCalledOnce();
	});

	it('does not count a press on a popup opened from the panel as an outside press', async () => {
		const onClose = vi.fn();
		await renderOpenDialog({
			onClose,
			closes: false,
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

		expect(onClose).not.toHaveBeenCalled();
	});
});

describe('Dialog Esc with a popup open inside the panel', () => {
	async function expectOnlyThePopupCloses(
		onClose: ReturnType<typeof vi.fn>,
		popup: () => HTMLElement | null,
	) {
		await userEvent.keyboard('{Escape}');

		await waitFor(() => {
			expect(popup()).toBeNull();
		});
		expect(onClose).not.toHaveBeenCalled();
		expect(screen.getByRole('dialog', { name: 'Rename view' })).toBeInTheDocument();

		await userEvent.keyboard('{Escape}');

		expect(onClose).toHaveBeenCalledExactlyOnceWith('escape-key');
	}

	it('closes only the select list', async () => {
		const onClose = vi.fn();
		await renderOpenDialog({
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
		await renderOpenDialog({
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
		await renderOpenDialog({
			onClose,
			closes: false,
			children: (
				<Dropdown nativeButton items={[{ type: 'item', value: 'rename', label: 'Rename' }]}>
					<button type="button">Actions</button>
				</Dropdown>
			),
		});
		await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
		await screen.findByRole('menu');

		await expectOnlyThePopupCloses(onClose, () => screen.queryByRole('menu'));
	});

	it('closes only the popover', async () => {
		const onClose = vi.fn();
		await renderOpenDialog({
			onClose,
			closes: false,
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

		await expectOnlyThePopupCloses(onClose, () =>
			screen.queryByRole('dialog', { name: 'Actions' }),
		);
	});
});

describe('Dialog with a toast over it', () => {
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
		const onClose = vi.fn();
		render(<Toaster />);
		await renderOpenDialog({ onClose, closes: false });

		await pressToastAction();

		expect(onClose).not.toHaveBeenCalled();
		expect(screen.getByRole('dialog')).toBeInTheDocument();
	});

	it('keeps both dialogs open when a toast button is pressed over a nested one', async () => {
		const onParentClose = vi.fn();
		const onChildClose = vi.fn();
		render(<Toaster />);
		render(
			<NestedHarness
				defaultParentOpen
				defaultChildOpen
				onParentClose={onParentClose}
				onChildClose={onChildClose}
				closes={false}
			/>,
		);
		await screen.findByRole('dialog', { name: 'Discard changes?' });

		await pressToastAction();

		expect(onParentClose).not.toHaveBeenCalled();
		expect(onChildClose).not.toHaveBeenCalled();
	});

	it('still closes on a press on the backdrop', async () => {
		const onClose = vi.fn();
		render(<Toaster />);
		await renderOpenDialog({ onClose, closes: false });
		act(() => {
			toast.danger('Could not copy the link', { action: { label: 'Close' } });
		});
		await vi.waitFor(() => expect(slot('toast-action')).not.toBeNull());

		await userEvent.click(screen.getByTestId('dialog-backdrop'));

		expect(onClose).toHaveBeenCalledExactlyOnceWith('outside-press');
	});
});

describe('Dialog layer with the focus on body', () => {
	function addModal(display = 'block'): HTMLElement {
		const drawer = document.createElement('div');
		drawer.style.cssText = `display:${display};position:fixed;inset:0 0 0 50%;z-index:1000;`;
		drawer.innerHTML = '<div role="dialog" aria-label="Settings"><p>Drawer</p></div>';
		document.body.append(drawer);
		(document.activeElement as HTMLElement | null)?.blur();

		return drawer;
	}

	// A drawer's save button that closes its form as the dialog opens leaves the focus on body.
	it('stacks above the highest open modal on the page', async () => {
		const drawer = addModal();

		try {
			render(<DialogHarness defaultOpen />);
			await screen.findByTestId('dialog-title');

			expect(zIndexOf(layer())).toBe(1001);
			await waitForOnTop(screen.getByTestId('dialog-title'));
		} finally {
			drawer.remove();
		}
	});

	it.each([
		['an info toast', () => toast.info('Export started')],
		['a danger toast', () => toast.danger('Could not copy the link')],
	])('stays under %s', async (_name, raise) => {
		render(<Toaster />);
		act(() => {
			raise();
		});
		await vi.waitFor(() => expect(slot('toast')).not.toBeNull());
		(document.activeElement as HTMLElement | null)?.blur();

		try {
			render(<DialogHarness defaultOpen />);
			await screen.findByTestId('dialog-title');

			expect(zIndexOf(layer())).toBe(50);
			expect(zIndexOf(slot('toaster') as HTMLElement)).toBeGreaterThan(zIndexOf(layer()));
		} finally {
			act(() => toast.dismiss());
			await vi.waitFor(() => expect(slot('toast')).toBeNull());
		}
	});

	it('ignores a modal that is hidden', async () => {
		const drawer = addModal('none');

		try {
			render(<DialogHarness defaultOpen />);
			await screen.findByTestId('dialog-title');

			expect(zIndexOf(layer())).toBe(50);
		} finally {
			drawer.remove();
		}
	});
});
