import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRef, useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { userEvent as browserUser } from 'vitest/browser';
import { Popover } from '../../popover/index.js';
import { Select } from '../../select/index.js';
import { Drawer } from '../drawer.js';
import type { DrawerTypeType } from '../types.js';
import {
	DrawerHarness,
	drawerPanel,
	OPENER_NAME,
	openFromButton,
	opener,
	renderOpenDrawer,
	waitForClosed,
	waitForSettled,
} from './drawer.test-utils.js';

const TYPES: DrawerTypeType[] = ['task', 'inspector'];

const FRAMEWORKS = [
	{ type: 'item', value: 'react', label: 'React' },
	{ type: 'item', value: 'vue', label: 'Vue' },
] as const;

const focused: Element[] = [];

function remember(event: FocusEvent): void {
	if (event.target instanceof Element) {
		focused.push(event.target);
	}
}

beforeEach(() => {
	focused.length = 0;
	document.addEventListener('focusin', remember);
});

afterEach(() => {
	document.removeEventListener('focusin', remember);
});

function everFocused(element: Element): boolean {
	return focused.includes(element);
}

function activeName(): string {
	return (
		document.activeElement?.getAttribute('aria-label') ?? document.activeElement?.textContent ?? ''
	);
}

async function tabNames(count: number): Promise<string[]> {
	const names: string[] = [];

	for (let step = 0; step < count; step += 1) {
		await browserUser.tab();
		names.push(activeName());
	}

	return names;
}

/**
 * A drawer opened from a button, with a search field on the page. `initialFocus` points to its
 * Second field, `finalFocus` to the search field.
 */
function RefHarness({ type, pin }: { type: DrawerTypeType; pin: 'initialFocus' | 'finalFocus' }) {
	const [open, setOpen] = useState(false);
	const second = useRef<HTMLInputElement>(null);
	const search = useRef<HTMLInputElement>(null);

	return (
		<>
			<input aria-label="Search" ref={search} />
			<button type="button" onClick={() => setOpen(true)}>
				{OPENER_NAME}
			</button>
			<Drawer
				type={type}
				open={open}
				onClose={() => setOpen(false)}
				title="Edit member"
				initialFocus={pin === 'initialFocus' ? second : undefined}
				finalFocus={pin === 'finalFocus' ? search : undefined}
			>
				<input aria-label="First" />
				<input aria-label="Second" ref={second} />
			</Drawer>
		</>
	);
}

describe('Drawer initial focus', () => {
	it.each(TYPES)(
		'focuses the panel of a %s, not the first field of the body, so the title is read first',
		async (type) => {
			await renderOpenDrawer({
				type,
				children: (
					<>
						<p>Intro</p>
						<input aria-label="First" />
						<input aria-label="Second" />
					</>
				),
			});

			await waitFor(() => {
				expect(drawerPanel()).toHaveFocus();
			});
			expect(everFocused(screen.getByRole('textbox', { name: 'First' }))).toBe(false);
		},
	);

	it.each(TYPES)('focuses the panel when a %s is opened from a button', async (type) => {
		render(<DrawerHarness type={type} />);

		await userEvent.click(screen.getByRole('button', { name: OPENER_NAME }));

		await waitFor(() => {
			expect(screen.getByRole('dialog', { name: 'Edit member' })).toHaveFocus();
		});
	});

	it('never moves the focus through the header buttons on the way', async () => {
		await renderOpenDrawer({
			headerPrefix: <button type="button">Previous</button>,
			headerSuffix: <button type="button">Copy link</button>,
		});
		await waitFor(() => {
			expect(drawerPanel()).toHaveFocus();
		});

		expect(everFocused(screen.getByRole('button', { name: 'Previous' }))).toBe(false);
		expect(everFocused(screen.getByRole('button', { name: 'Copy link' }))).toBe(false);
		expect(everFocused(screen.getByRole('button', { name: 'Close' }))).toBe(false);
	});

	it.each(TYPES)(
		'reaches the close button, then the body, with Tab from the panel of a %s',
		async (type) => {
			await renderOpenDrawer({ type });
			await waitFor(() => {
				expect(drawerPanel()).toHaveFocus();
			});

			expect(await tabNames(2)).toEqual(['Close', 'Name']);
		},
	);

	it.each(TYPES)(
		'reaches the headerPrefix first with Tab from the panel of a %s, then the header in order',
		async (type) => {
			await renderOpenDrawer({
				type,
				headerPrefix: (
					<>
						<button type="button">Previous</button>
						<button type="button">Next</button>
					</>
				),
				titleSuffix: <button type="button">Copy name</button>,
				headerSuffix: <button type="button">Copy link</button>,
			});
			await waitFor(() => {
				expect(drawerPanel()).toHaveFocus();
			});

			expect(await tabNames(6)).toEqual([
				'Previous',
				'Next',
				'Copy name',
				'Copy link',
				'Close',
				'Name',
			]);
		},
	);

	it.each(TYPES)(
		'focuses the element an initialFocus ref names on a %s, and goes back to the opener on close',
		async (type) => {
			render(<RefHarness type={type} pin="initialFocus" />);
			await userEvent.click(screen.getByRole('button', { name: OPENER_NAME }));

			await waitFor(() => {
				expect(screen.getByRole('textbox', { name: 'Second' })).toHaveFocus();
			});
			expect(everFocused(screen.getByRole('textbox', { name: 'First' }))).toBe(false);
			expect(everFocused(drawerPanel())).toBe(false);

			await userEvent.keyboard('{Escape}');
			await waitForClosed();

			expect(opener()).toHaveFocus();
		},
	);

	it.each(TYPES)('leaves the focus on the opener of a %s with initialFocus false', async (type) => {
		render(<DrawerHarness type={type} initialFocus={false} />);

		await userEvent.click(screen.getByRole('button', { name: OPENER_NAME }));
		await screen.findByRole('dialog', { name: 'Edit member' });
		await waitForSettled();

		expect(opener()).toHaveFocus();
		expect(everFocused(drawerPanel())).toBe(false);
	});
});

describe('Drawer focus return', () => {
	it.each(TYPES)('goes to finalFocus on a %s when it is set', async (type) => {
		render(<RefHarness type={type} pin="finalFocus" />);
		await openFromButton();

		await userEvent.keyboard('{Escape}');
		await waitForClosed();

		await waitFor(() => {
			expect(screen.getByRole('textbox', { name: 'Search' })).toHaveFocus();
		});
	});

	it.each([
		['task', 'Esc', async () => userEvent.keyboard('{Escape}')],
		['inspector', 'Esc', async () => userEvent.keyboard('{Escape}')],
		[
			'task',
			'the close button',
			async () => userEvent.click(screen.getByRole('button', { name: 'Close' })),
		],
		[
			'inspector',
			'the close button',
			async () => userEvent.click(screen.getByRole('button', { name: 'Close' })),
		],
	] as const)('goes back to the opener of a %s on %s', async (type, _name, close) => {
		render(<DrawerHarness type={type} />);
		await openFromButton();

		await close();
		await waitForClosed();

		expect(opener()).toHaveFocus();
	});

	it('goes back to the opener on a press on the backdrop of a task', async () => {
		render(<DrawerHarness />);
		await openFromButton();

		await userEvent.click(screen.getByTestId('drawer-backdrop'));
		await waitForClosed();

		expect(opener()).toHaveFocus();
	});

	it('goes back to the element that had the focus when it opened, not to the first button', async () => {
		render(
			<>
				<button type="button">Before</button>
				<DrawerHarness />
				<button type="button">After</button>
			</>,
		);
		await openFromButton();

		await userEvent.keyboard('{Escape}');
		await waitForClosed();

		expect(opener()).toHaveFocus();
		expect(screen.getByRole('button', { name: 'Before' })).not.toHaveFocus();
	});
});

describe('Drawer focus trap', () => {
	it('loops Tab and Shift+Tab through the panel of a task, header first', async () => {
		await renderOpenDrawer({
			footerSuffix: (
				<>
					<button type="button">Cancel</button>
					<button type="button">Save</button>
				</>
			),
		});
		await waitFor(() => {
			expect(drawerPanel()).toHaveFocus();
		});

		expect(await tabNames(5)).toEqual(['Close', 'Name', 'Cancel', 'Save', 'Close']);

		await browserUser.tab({ shift: true });

		await waitFor(() => {
			expect(screen.getByRole('button', { name: 'Save' })).toHaveFocus();
		});
	});

	it('never leaves the panel of a task however many times Tab is pressed', async () => {
		render(
			<>
				<button type="button">Page button</button>
				<DrawerHarness defaultOpen />
				<button type="button">After</button>
			</>,
		);
		await waitFor(() => {
			expect(drawerPanel().contains(document.activeElement)).toBe(true);
		});

		for (let step = 0; step < 6; step += 1) {
			await browserUser.tab();
			expect(drawerPanel().contains(document.activeElement)).toBe(true);
		}
		for (let step = 0; step < 6; step += 1) {
			await browserUser.tab({ shift: true });
			expect(drawerPanel().contains(document.activeElement)).toBe(true);
		}
	});

	it('lets Tab leave the panel of an inspector for the page after it', async () => {
		const onClose = vi.fn();
		render(
			<>
				<DrawerHarness type="inspector" onClose={onClose} />
				<button type="button">Next row</button>
			</>,
		);
		await openFromButton();

		expect(await tabNames(3)).toEqual(['Close', 'Name', 'Next row']);
		expect(drawerPanel().contains(document.activeElement)).toBe(false);
		expect(onClose).not.toHaveBeenCalled();
	});
});

describe('Drawer Esc with a popup open inside the panel', () => {
	async function expectOnlyThePopupCloses(
		onClose: ReturnType<typeof vi.fn>,
		popup: () => HTMLElement | null,
	): Promise<void> {
		await userEvent.keyboard('{Escape}');

		await waitFor(() => {
			expect(popup()).toBeNull();
		});
		expect(onClose).not.toHaveBeenCalled();
		expect(drawerPanel()).toHaveAttribute('data-open');

		await userEvent.keyboard('{Escape}');

		expect(onClose).toHaveBeenCalledExactlyOnceWith('escape-key');
	}

	it.each(TYPES)('closes only the select list of a %s', async (type) => {
		const onClose = vi.fn();
		await renderOpenDrawer({
			type,
			onClose,
			closes: false,
			children: <Select placeholder="Pick" aria-label="Framework" items={[...FRAMEWORKS]} />,
		});
		await userEvent.click(screen.getByRole('combobox', { name: 'Framework' }));
		await screen.findByRole('listbox');

		await expectOnlyThePopupCloses(onClose, () => screen.queryByRole('listbox'));
	});

	it.each(TYPES)('closes only the popover of a %s', async (type) => {
		const onClose = vi.fn();
		await renderOpenDrawer({
			type,
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

describe('Drawer keys', () => {
	it('adds no Enter handler: a form in the body submits through its own button in the footer', async () => {
		const onSubmit = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
		const onClose = vi.fn();
		await renderOpenDrawer({
			onClose,
			children: (
				<form id="edit-member" onSubmit={onSubmit}>
					<input aria-label="Name" />
				</form>
			),
			footerSuffix: (
				<button type="submit" form="edit-member">
					Save
				</button>
			),
		});
		await waitFor(() => {
			expect(drawerPanel()).toHaveFocus();
		});

		await userEvent.keyboard('{Enter}');

		expect(onSubmit).not.toHaveBeenCalled();

		screen.getByRole('textbox', { name: 'Name' }).focus();
		await userEvent.keyboard('{Enter}');

		expect(onSubmit).toHaveBeenCalledOnce();
		expect(onClose).not.toHaveBeenCalled();
		expect(drawerPanel()).toHaveAttribute('data-open');
	});

	it('presses the focused footer button on Enter and on Space, and nothing else', async () => {
		const onClick = vi.fn();
		const onClose = vi.fn();
		await renderOpenDrawer({
			onClose,
			footerSuffix: (
				<button type="button" onClick={onClick}>
					Save
				</button>
			),
		});
		screen.getByRole('button', { name: 'Save' }).focus();

		await userEvent.keyboard('{Enter}');
		await userEvent.keyboard(' ');

		expect(onClick).toHaveBeenCalledTimes(2);
		expect(onClose).not.toHaveBeenCalled();
	});

	it.each(TYPES)('presses the close button of a %s on Enter and on Space', async (type) => {
		const onClose = vi.fn();
		await renderOpenDrawer({ type, onClose, closes: false });
		screen.getByRole('button', { name: 'Close' }).focus();

		await userEvent.keyboard('{Enter}');
		await userEvent.keyboard(' ');

		expect(onClose).toHaveBeenCalledTimes(2);
		expect(onClose).toHaveBeenCalledWith('close-press');
	});
});
