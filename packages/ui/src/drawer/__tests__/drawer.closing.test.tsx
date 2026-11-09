import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { page } from 'vitest/browser';
import { toast, Toaster } from '../../toast/index.js';
import { Drawer } from '../drawer.js';
import type { DrawerTypeType } from '../types.js';
import {
	DrawerHarness,
	drawerPanel,
	OPENER_NAME,
	renderOpenDrawer,
	slot,
	slots,
	waitForClosed,
	waitForOnTop,
} from './drawer.test-utils.js';

const TYPES: DrawerTypeType[] = ['task', 'inspector'];

/**
 * The design tokens are not loaded here, so the 16px gap the viewport keeps around the panel is
 * declared in the test with the number `@signozhq/design-tokens` ships.
 */
let tokens: HTMLStyleElement;

// At the default 414px the panel fills the page, and there is nothing beside it to press.
beforeEach(async () => {
	tokens = document.createElement('style');
	tokens.textContent = ':root { --spacing-8: 16px; }';
	document.head.append(tokens);
	await page.viewport(1280, 800);
});

afterEach(async () => {
	tokens.remove();
	await page.viewport(414, 896);
});

/**
 * A press where a user presses: on whatever the page paints left of the panel, which on a task is
 * the viewport over the backdrop.
 */
async function pressBesidePanel(): Promise<void> {
	await userEvent.click(document.elementFromPoint(2, window.innerHeight / 2) as Element);
}

describe('Drawer closing', () => {
	it('does not call onClose on open or on a re-render', async () => {
		const onClose = vi.fn();
		const { rerender } = await renderOpenDrawer({ onClose });

		rerender(<DrawerHarness defaultOpen onClose={onClose} title="Another title" />);

		expect(onClose).not.toHaveBeenCalled();
	});

	it.each(TYPES)('calls onClose with escape-key on Esc on a %s, once', async (type) => {
		const onClose = vi.fn();
		await renderOpenDrawer({ type, onClose, closes: false });

		await userEvent.keyboard('{Escape}');

		expect(onClose).toHaveBeenCalledExactlyOnceWith('escape-key');
	});

	it('calls onClose with escape-key on Esc from the close button and from a footer button', async () => {
		const onClose = vi.fn();
		await renderOpenDrawer({
			onClose,
			closes: false,
			footerSuffix: <button type="button">Save</button>,
		});

		screen.getByRole('button', { name: 'Close' }).focus();
		await userEvent.keyboard('{Escape}');
		screen.getByRole('button', { name: 'Save' }).focus();
		await userEvent.keyboard('{Escape}');

		expect(onClose).toHaveBeenCalledTimes(2);
		expect(onClose).toHaveBeenNthCalledWith(1, 'escape-key');
		expect(onClose).toHaveBeenNthCalledWith(2, 'escape-key');
	});

	it('calls onClose with outside-press on a press on the page beside a task, once', async () => {
		const onClose = vi.fn();
		await renderOpenDrawer({ onClose, closes: false });

		await pressBesidePanel();

		expect(onClose).toHaveBeenCalledExactlyOnceWith('outside-press');
	});

	it('calls onClose with outside-press on a press on the backdrop element itself', async () => {
		const onClose = vi.fn();
		await renderOpenDrawer({ onClose, closes: false });

		await userEvent.click(screen.getByTestId('drawer-backdrop'));

		expect(onClose).toHaveBeenCalledExactlyOnceWith('outside-press');
	});

	it('calls onClose with outside-press on a press in the gap between the panel and the edge of the page', async () => {
		const onClose = vi.fn();
		await renderOpenDrawer({ onClose, closes: false });
		const panel = drawerPanel().getBoundingClientRect();
		const gap = document.elementFromPoint(
			(panel.right + window.innerWidth) / 2,
			panel.top + panel.height / 2,
		) as Element;

		expect(panel.right).toBe(window.innerWidth - 16);
		expect(drawerPanel().contains(gap)).toBe(false);

		await userEvent.click(gap);

		expect(onClose).toHaveBeenCalledExactlyOnceWith('outside-press');
	});

	it.each(TYPES)(
		'calls onClose with close-press on the close button of a %s, once',
		async (type) => {
			const onClose = vi.fn();
			await renderOpenDrawer({ type, onClose, closes: false });

			await userEvent.click(screen.getByRole('button', { name: 'Close' }));

			expect(onClose).toHaveBeenCalledExactlyOnceWith('close-press');
		},
	);

	it('does not treat a press inside the panel as an outside press', async () => {
		const onClose = vi.fn();
		await renderOpenDrawer({
			onClose,
			closes: false,
			description: 'Detail',
			headerPrefix: <button type="button">Previous</button>,
			headerSuffix: <button type="button">Copy link</button>,
			footerSuffix: <button type="button">Save</button>,
		});

		await userEvent.click(screen.getByTestId('drawer-header'));
		await userEvent.click(screen.getByRole('button', { name: 'Previous' }));
		await userEvent.click(screen.getByTestId('drawer-title'));
		await userEvent.click(screen.getByTestId('drawer-description'));
		await userEvent.click(screen.getByRole('button', { name: 'Copy link' }));
		await userEvent.click(screen.getByTestId('drawer-body'));
		await userEvent.click(screen.getByRole('textbox', { name: 'Name' }));
		await userEvent.click(screen.getByTestId('drawer-footer'));
		await userEvent.click(screen.getByRole('button', { name: 'Save' }));

		expect(onClose).not.toHaveBeenCalled();
	});

	it('stays open until open is false, whichever reason it was told', async () => {
		const onClose = vi.fn();
		await renderOpenDrawer({ onClose, closes: false });

		await userEvent.keyboard('{Escape}');
		await pressBesidePanel();
		await userEvent.click(screen.getByRole('button', { name: 'Close' }));

		expect(onClose.mock.calls.map(([reason]) => reason)).toEqual([
			'escape-key',
			'outside-press',
			'close-press',
		]);
		expect(screen.getByRole('dialog', { name: 'Edit member' })).toBeInTheDocument();
		expect(drawerPanel()).toHaveAttribute('data-open');
		expect(slot('drawer-backdrop')).toBeInTheDocument();
	});

	it.each([
		['Esc', async () => userEvent.keyboard('{Escape}')],
		['a press beside the panel', pressBesidePanel],
		[
			'the close button',
			async () => userEvent.click(screen.getByRole('button', { name: 'Close' })),
		],
	])('closes on %s when the consumer sets open to false', async (_name, close) => {
		render(<DrawerHarness defaultOpen />);
		await screen.findByRole('dialog', { name: 'Edit member' });

		await close();
		await waitForClosed();

		expect(screen.queryByRole('dialog')).toBeNull();
		expect(slots('drawer-backdrop')).toHaveLength(0);
		expect(slots('drawer-layer')).toHaveLength(0);
	});

	it('closes when the consumer sets open to false for a reason of its own', async () => {
		const { rerender } = render(
			<Drawer type="inspector" stack="overlay" open onClose={() => {}} title="Span details">
				Body
			</Drawer>,
		);
		await screen.findByRole('dialog', { name: 'Span details' });

		rerender(
			<Drawer type="inspector" stack="overlay" open={false} onClose={() => {}} title="Span details">
				Body
			</Drawer>,
		);
		await waitForClosed();

		expect(screen.queryByRole('dialog')).toBeNull();
	});

	it('plays its exit transition before it unmounts the content', async () => {
		const { rerender } = render(
			<Drawer
				type="task"
				stack="overlay"
				open
				onClose={() => {}}
				title="Edit member"
				testId="drawer"
			>
				Body
			</Drawer>,
		);
		const panel = await screen.findByRole('dialog', { name: 'Edit member' });

		expect(panel).toHaveAttribute('data-open');
		expect(panel).not.toHaveAttribute('data-closed');

		rerender(
			<Drawer
				type="task"
				stack="overlay"
				open={false}
				onClose={() => {}}
				title="Edit member"
				testId="drawer"
			>
				Body
			</Drawer>,
		);

		expect(panel.isConnected).toBe(true);
		expect(panel).toHaveAttribute('data-closed');
		expect(panel).toHaveAttribute('data-ending-style');
		expect(screen.getByTestId('drawer-backdrop')).toHaveAttribute('data-closed');

		await waitForClosed();

		expect(panel.isConnected).toBe(false);
	});

	it('unmounts the content on close and keeps no state when it opens again', async () => {
		render(<DrawerHarness />);
		await userEvent.click(screen.getByRole('button', { name: OPENER_NAME }));
		const field = await screen.findByRole('textbox', { name: 'Name' });

		await userEvent.type(field, 'Ada Lovelace');

		expect(field).toHaveValue('Ada Lovelace');

		await userEvent.keyboard('{Escape}');
		await waitForClosed();

		expect(screen.queryByRole('textbox', { name: 'Name', hidden: true })).toBeNull();

		await userEvent.click(screen.getByRole('button', { name: OPENER_NAME }));

		expect(await screen.findByRole('textbox', { name: 'Name' })).toHaveValue('');
	});

	it.each(TYPES)('does not mount the children of a closed %s', (type) => {
		const onRender = vi.fn();
		function Probe() {
			onRender();

			return <input aria-label="Probe" />;
		}
		render(
			<Drawer type={type} stack="overlay" open={false} onClose={() => {}} title="Edit member">
				<Probe />
			</Drawer>,
		);

		expect(onRender).not.toHaveBeenCalled();
		expect(slot('drawer-layer')).toBeNull();
	});
});

// The `Toaster` sits at the app root, so its toasts render next to the drawer, outside the panel.
describe('Drawer with a toast over it', () => {
	afterEach(() => {
		act(() => toast.dismiss());
	});

	async function raiseToast(): Promise<HTMLElement> {
		act(() => {
			toast.danger('Could not copy the link', { action: { label: 'Close' } });
		});

		const action = await vi.waitFor(() => {
			const element = slot('toast-action');
			expect(element).not.toBeNull();

			return element as HTMLElement;
		});
		await waitForOnTop(action);

		return action;
	}

	it.each(TYPES)('keeps a %s open when a toast button is pressed', async (type) => {
		const onClose = vi.fn();
		render(<Toaster />);
		await renderOpenDrawer({ type, onClose, closes: false });

		await userEvent.click(await raiseToast());
		await vi.waitFor(() => expect(slot('toast')).toBeNull());

		expect(onClose).not.toHaveBeenCalled();
		expect(screen.getByRole('dialog', { name: 'Edit member' })).toBeInTheDocument();
	});

	it('still closes a task on a press on the backdrop', async () => {
		const onClose = vi.fn();
		render(<Toaster />);
		await renderOpenDrawer({ onClose, closes: false });
		await raiseToast();

		await userEvent.click(screen.getByTestId('drawer-backdrop'));

		expect(onClose).toHaveBeenCalledExactlyOnceWith('outside-press');
	});
});
