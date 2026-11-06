import { Info } from '@signozhq/icons';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { describe, expect, it, onTestFinished, vi } from 'vitest';
import { Drawer } from '../drawer.js';
import type { DrawerTypeType } from '../types.js';
import {
	DrawerHarness,
	type DrawerHarnessProps,
	drawerPanel,
	renderOpenDrawer,
	slot,
	waitForClosed,
} from './drawer.test-utils.js';

const HEADER_SLOTS = {
	headerPrefix: (
		<button type="button" aria-label="Previous">
			↑
		</button>
	),
	titlePrefix: <Info data-testid="title-icon" />,
	titleSuffix: (
		<button type="button" aria-label="Copy name">
			⧉
		</button>
	),
	headerSuffix: <button type="button">Edit</button>,
};

const FOOTER = (
	<>
		<button type="button">Cancel</button>
		<button type="button">Save</button>
	</>
);

/**
 * Renders the drawer open and settled, and returns a setter that rerenders it with `loading`.
 */
async function renderWithLoadingSetter(props: Omit<DrawerHarnessProps, 'defaultOpen'>) {
	const { rerender } = await renderOpenDrawer(props);

	return (loading: boolean) => {
		rerender(<DrawerHarness defaultOpen {...props} loading={loading} />);
	};
}

describe('Drawer loading', () => {
	it('renders no skeleton and no busy state by default', async () => {
		await renderOpenDrawer({
			...HEADER_SLOTS,
			description: 'Changes apply to every dashboard',
			footerSuffix: FOOTER,
		});

		const panel = screen.getByRole('dialog');

		expect(panel).not.toHaveAttribute('aria-busy');
		expect(panel).not.toHaveAttribute('data-loading');
		for (const part of ['title-prefix', 'title', 'description', 'body']) {
			expect(screen.queryByTestId(`drawer-${part}-skeleton`)).toBeNull();
		}
		expect(slot('drawer-title-skeleton')).toBeNull();
		expect(slot('drawer-description-skeleton')).toBeNull();
		for (const name of ['drawer-header-prefix', 'drawer-title-prefix', 'drawer-header-suffix']) {
			expect(slot(name)).not.toHaveAttribute('data-loading');
		}
		expect(slot('drawer-header-prefix')?.inert).toBe(false);
		expect(slot('drawer-header-suffix')?.inert).toBe(false);
	});

	it('marks the panel busy and keeps the title as its accessible name', async () => {
		await renderOpenDrawer({ loading: true });

		const panel = screen.getByRole('dialog', { name: 'Edit member' });
		const title = screen.getByTestId('drawer-title');

		expect(panel).toHaveAttribute('aria-busy', 'true');
		expect(panel).toHaveAttribute('data-loading');
		expect(panel.getAttribute('aria-labelledby')).toBe(title.id);
		expect(title.getBoundingClientRect().width).toBeLessThanOrEqual(1);
		expect(
			slot('drawer-title-skeleton')?.contains(screen.getByTestId('drawer-title-skeleton')),
		).toBe(true);
	});

	it('shows a skeleton for the description only when one renders', async () => {
		const { unmount } = await renderOpenDrawer({ loading: true });

		expect(screen.queryByTestId('drawer-description-skeleton')).toBeNull();
		expect(slot('drawer-description-skeleton')).toBeNull();
		unmount();

		await renderOpenDrawer({ loading: true, description: 'Changes apply to every dashboard' });

		expect(
			slot('drawer-description-skeleton')?.contains(
				screen.getByTestId('drawer-description-skeleton'),
			),
		).toBe(true);
		expect(screen.queryByText('Changes apply to every dashboard')).toBeNull();
		expect(slot('drawer-description')).toBeNull();
		expect(screen.getByRole('dialog')).not.toHaveAttribute('aria-describedby');
	});

	it.each([
		['an empty string', ''],
		['null', null],
		['an empty fragment', <></>],
	])('shows no description skeleton for a description of %s', async (_name, description) => {
		await renderOpenDrawer({ loading: true, description });

		expect(screen.queryByTestId('drawer-description-skeleton')).toBeNull();
		expect(slot('drawer-description-skeleton')).toBeNull();
	});

	it('shows no description skeleton on an inspector with a description forced onto it', async () => {
		render(
			<Drawer
				// A `type` widened to the union gets past the rule that rejects it on an inspector.
				type={'inspector' as DrawerTypeType}
				open
				onClose={() => {}}
				title="Span details"
				testId="drawer"
				description="Changes apply to every dashboard"
				loading
			>
				Body
			</Drawer>,
		);
		await screen.findByRole('dialog');

		expect(screen.queryByTestId('drawer-description-skeleton')).toBeNull();
		expect(slot('drawer-description-skeleton')).toBeNull();
	});

	it('replaces the titlePrefix with an avatar skeleton', async () => {
		await renderOpenDrawer({ loading: true, titlePrefix: HEADER_SLOTS.titlePrefix });

		const prefix = screen.getByTestId('drawer-title-prefix');

		expect(screen.queryByTestId('title-icon')).toBeNull();
		expect(prefix).toHaveAttribute('data-loading');
		expect(prefix).toContainElement(screen.getByTestId('drawer-title-prefix-skeleton'));
		expect(screen.getByTestId('drawer-title-prefix-skeleton')).toHaveAttribute(
			'data-slot',
			'skeleton-avatar',
		);
	});

	it.each([
		{ size: undefined, expected: 14 },
		{ size: '20px', expected: 20 },
	])(
		'draws the titlePrefix skeleton at the icon size ($expected px)',
		async ({ size, expected }) => {
			if (size !== undefined) {
				document.body.style.setProperty('--drawer-title-prefix-icon-size', size);
				onTestFinished(() => document.body.style.removeProperty('--drawer-title-prefix-icon-size'));
			}
			await renderOpenDrawer({ loading: true, titlePrefix: <Info /> });

			const box = screen.getByTestId('drawer-title-prefix-skeleton').getBoundingClientRect();

			expect(box.width).toBe(expected);
			expect(box.height).toBe(expected);
		},
	);

	it('hides the titleSuffix', async () => {
		await renderOpenDrawer({ loading: true, titleSuffix: HEADER_SLOTS.titleSuffix });

		expect(slot('drawer-title-suffix')).toBeNull();
		expect(screen.queryByTestId('drawer-title-suffix')).toBeNull();
		expect(screen.queryByRole('button', { name: 'Copy name' })).toBeNull();
	});

	it.each([
		['headerPrefix', 'drawer-header-prefix', 'Previous'],
		['headerSuffix', 'drawer-header-suffix', 'Edit'],
	])('keeps the %s on screen, taking no input', async (prop, name, buttonName) => {
		await renderOpenDrawer({
			loading: true,
			[prop]: HEADER_SLOTS[prop as keyof typeof HEADER_SLOTS],
		});

		const part = slot(name);
		const button = screen.getByRole('button', { name: buttonName });

		expect(part).toHaveAttribute('data-loading');
		expect(part?.inert).toBe(true);
		expect(part).toContainElement(button);
		expect(button).toBeVisible();

		button.focus();

		expect(document.activeElement).not.toBe(button);
	});

	it.each<[DrawerTypeType, string, string, string]>([
		['task', 'headerPrefix', 'drawer-header-prefix', 'Previous'],
		['task', 'headerSuffix', 'drawer-header-suffix', 'Edit'],
		['inspector', 'headerPrefix', 'drawer-header-prefix', 'Previous'],
		['inspector', 'headerSuffix', 'drawer-header-suffix', 'Edit'],
	])(
		'moves the focus from the %s %s to the panel when loading turns true',
		async (type, prop, name, buttonName) => {
			const setLoading = await renderWithLoadingSetter({
				type,
				[prop]: HEADER_SLOTS[prop as keyof typeof HEADER_SLOTS],
			});
			const button = screen.getByRole('button', { name: buttonName });

			act(() => button.focus());

			expect(document.activeElement).toBe(button);

			setLoading(true);

			expect(document.activeElement).toBe(drawerPanel());
			expect(slot(name)?.inert).toBe(true);
		},
	);

	const UNMOUNTED_FOCUS: [string, Omit<DrawerHarnessProps, 'defaultOpen'>, string][] = [
		['the titleSuffix', { titleSuffix: HEADER_SLOTS.titleSuffix }, 'Copy name'],
		['the body', { children: <button type="button">Parent span</button> }, 'Parent span'],
	];

	it.each(UNMOUNTED_FOCUS)(
		'moves the focus from %s to the panel of a task when loading unmounts it',
		async (_name, props, buttonName) => {
			const setLoading = await renderWithLoadingSetter(props);

			act(() => screen.getByRole('button', { name: buttonName }).focus());
			setLoading(true);

			await waitFor(() => {
				expect(document.activeElement).toBe(drawerPanel());
			});
		},
	);

	// An inspector has no focus trap to take it back, so the drawer moves it itself.
	it.each(UNMOUNTED_FOCUS)(
		'moves the focus from %s to the panel of an inspector when loading unmounts it',
		async (_name, props, buttonName) => {
			const setLoading = await renderWithLoadingSetter({ type: 'inspector', ...props });

			act(() => screen.getByRole('button', { name: buttonName }).focus());
			setLoading(true);

			await waitFor(() => {
				expect(document.activeElement).toBe(drawerPanel());
			});
		},
	);

	it('leaves the focus where it is when it is outside the header slots', async () => {
		const setLoading = await renderWithLoadingSetter(HEADER_SLOTS);
		const close = screen.getByRole('button', { name: 'Close' });

		act(() => close.focus());
		setLoading(true);

		expect(document.activeElement).toBe(close);
	});

	it('gives the header slots their input back once loading turns false', async () => {
		const setLoading = await renderWithLoadingSetter({ ...HEADER_SLOTS, loading: true });

		setLoading(false);

		const button = screen.getByRole('button', { name: 'Edit' });

		expect(slot('drawer-header-prefix')?.inert).toBe(false);
		expect(slot('drawer-header-suffix')?.inert).toBe(false);
		expect(slot('drawer-header-suffix')).not.toHaveAttribute('data-loading');

		act(() => button.focus());

		expect(document.activeElement).toBe(button);
	});

	it('does not render the children and shows the default body skeleton', async () => {
		const renderBody = vi.fn();
		function Body(): ReactNode {
			renderBody();

			return <input aria-label="Name" />;
		}

		await renderOpenDrawer({ loading: true, children: <Body /> });

		expect(renderBody).not.toHaveBeenCalled();
		expect(screen.queryByRole('textbox', { name: 'Name' })).toBeNull();
		expect(slot('drawer-body')?.contains(screen.getByTestId('drawer-body-skeleton'))).toBe(true);
	});

	it('shows loadingContent in the body instead of the default skeleton', async () => {
		await renderOpenDrawer({
			loading: true,
			loadingContent: <div data-testid="form-skeleton" />,
		});

		expect(slot('drawer-body')?.contains(screen.getByTestId('form-skeleton'))).toBe(true);
		expect(screen.queryByTestId('drawer-body-skeleton')).toBeNull();
	});

	it('replaces the footer actions with skeletons and keeps the footer slots', async () => {
		await renderOpenDrawer({
			loading: true,
			footerPrefix: <button type="button">Delete</button>,
			footerSuffix: FOOTER,
		});

		expect(screen.queryByRole('button', { name: 'Save' })).toBeNull();
		expect(screen.queryByRole('button', { name: 'Cancel' })).toBeNull();
		expect(screen.queryByRole('button', { name: 'Delete' })).toBeNull();
		expect(
			slot('drawer-footer-prefix')?.querySelectorAll('[data-slot="skeleton-button"]'),
		).toHaveLength(1);
		expect(
			slot('drawer-footer-suffix')?.querySelectorAll('[data-slot="skeleton-button"]'),
		).toHaveLength(2);
	});

	it('renders no footer while loading when footerSuffix renders nothing', async () => {
		await renderOpenDrawer({ loading: true, footerPrefix: <button type="button">Delete</button> });

		expect(slot('drawer-footer')).toBeNull();
	});

	it('keeps the close button working while loading', async () => {
		const onClose = vi.fn();

		await renderOpenDrawer({ loading: true, onClose });
		await userEvent.click(screen.getByRole('button', { name: 'Close' }));

		expect(onClose).toHaveBeenCalledWith('close-press');
		await waitForClosed();
	});

	it.each<DrawerTypeType>(['task', 'inspector'])(
		'keeps Esc working on a %s while loading',
		async (type) => {
			const onClose = vi.fn();

			await renderOpenDrawer({ type, loading: true, ...HEADER_SLOTS, onClose });
			await userEvent.keyboard('{Escape}');

			expect(onClose).toHaveBeenCalledWith('escape-key');
			await waitForClosed();
		},
	);

	it('renders the content once loading turns false', async () => {
		const setLoading = await renderWithLoadingSetter({
			...HEADER_SLOTS,
			loading: true,
			description: 'Changes apply to every dashboard',
			footerSuffix: FOOTER,
		});

		expect(screen.getByRole('dialog')).toHaveAttribute('aria-busy', 'true');

		setLoading(false);

		const panel = screen.getByRole('dialog', { name: 'Edit member' });

		expect(panel).not.toHaveAttribute('aria-busy');
		expect(panel).not.toHaveAttribute('data-loading');
		expect(screen.getByRole('textbox', { name: 'Name' })).toBeInTheDocument();
		expect(screen.getByText('Changes apply to every dashboard')).toBeInTheDocument();
		expect(screen.getByTestId('title-icon')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Copy name' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
		expect(screen.getByTestId('drawer-title').getBoundingClientRect().width).toBeGreaterThan(1);
		expect(screen.queryByTestId('drawer-title-skeleton')).toBeNull();
		expect(screen.queryByTestId('drawer-body-skeleton')).toBeNull();
	});
});
