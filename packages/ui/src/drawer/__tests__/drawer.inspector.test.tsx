import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { userEvent as browserUser, page } from 'vitest/browser';
import type { DrawerHarnessProps } from './drawer.test-utils.js';
import {
	drawerPanel,
	DrawerHarness,
	isOnTop,
	openFromButton,
	opener,
	slot,
	waitForClosed,
} from './drawer.test-utils.js';

// At the default 414px the panel fills the page, and there is no page left beside it to use.
beforeEach(async () => {
	await page.viewport(1280, 800);
});

afterEach(async () => {
	window.scrollTo(0, 0);
	await page.viewport(414, 896);
});

/**
 * A list page with a search field, the drawer declared after it, and a row button after the
 * drawer. The page is taller than the screen, so it has something to scroll.
 */
function renderPage(props: DrawerHarnessProps & { onRowPress?: () => void } = {}) {
	const { onRowPress, ...drawerProps } = props;

	return render(
		<>
			<input aria-label="Search" />
			<DrawerHarness type="inspector" title="Span details" {...drawerProps} />
			<button type="button" onClick={onRowPress}>
				Next row
			</button>
			<div style={{ height: '300vh' }} />
		</>,
	);
}

function pageScrolls(): boolean {
	return [document.documentElement, document.body].every(
		(element) => getComputedStyle(element).overflowY !== 'hidden',
	);
}

function rowButton(): HTMLElement {
	return screen.getByRole('button', { name: 'Next row', hidden: true });
}

describe('Drawer inspector', () => {
	it('renders no backdrop, and is not modal', async () => {
		renderPage();
		await openFromButton();

		expect(slot('drawer-backdrop')).toBeNull();
		expect(screen.queryByTestId('drawer-backdrop')).toBeNull();
		expect(screen.getByRole('dialog', { name: 'Span details' })).not.toHaveAttribute('aria-modal');
	});

	it('leaves the page beside it clickable while it is open', async () => {
		const onRowPress = vi.fn();
		const onClose = vi.fn();
		renderPage({ onRowPress, onClose });
		await openFromButton();

		expect(isOnTop(rowButton())).toBe(true);
		expect(isOnTop(screen.getByRole('textbox', { name: 'Search' }))).toBe(true);

		await browserUser.click(rowButton());

		expect(onRowPress).toHaveBeenCalledOnce();
		expect(onClose).not.toHaveBeenCalled();
		expect(drawerPanel()).toHaveAttribute('data-open');
	});

	it('never calls onClose on a press outside it', async () => {
		const onClose = vi.fn();
		renderPage({ onClose, closes: false });
		await openFromButton();

		await userEvent.click(document.elementFromPoint(400, 400) as Element);
		await userEvent.click(rowButton());
		await userEvent.click(screen.getByRole('textbox', { name: 'Search' }));
		await userEvent.click(document.body);

		expect(onClose).not.toHaveBeenCalled();
		expect(screen.getByRole('dialog', { name: 'Span details' })).toHaveAttribute('data-open');
	});

	it('lets a click move the focus out to the page, and stays open', async () => {
		const onClose = vi.fn();
		renderPage({ onClose });
		await openFromButton();

		await browserUser.click(screen.getByRole('textbox', { name: 'Search' }));
		await browserUser.keyboard('latency');

		expect(screen.getByRole('textbox', { name: 'Search' })).toHaveFocus();
		expect(screen.getByRole('textbox', { name: 'Search' })).toHaveValue('latency');
		expect(onClose).not.toHaveBeenCalled();
		expect(drawerPanel()).toHaveAttribute('data-open');
	});

	// Base UI keeps the panel in the tab order of the page where the drawer is declared, though the
	// panel itself renders at the end of `document.body`.
	it('lets Tab move the focus out to the page after it, and Shift+Tab back in, and stays open', async () => {
		const onClose = vi.fn();
		renderPage({ onClose });
		await openFromButton();
		screen.getByRole('textbox', { name: 'Name' }).focus();

		await browserUser.tab();

		await waitFor(() => {
			expect(rowButton()).toHaveFocus();
		});

		await browserUser.tab({ shift: true });

		await waitFor(() => {
			expect(screen.getByRole('textbox', { name: 'Name' })).toHaveFocus();
		});
		expect(onClose).not.toHaveBeenCalled();
		expect(drawerPanel()).toHaveAttribute('data-open');
	});

	it('does not lock the scroll of the page', async () => {
		renderPage();
		await openFromButton();

		expect(pageScrolls()).toBe(true);

		window.scrollTo(0, 300);

		await waitFor(() => {
			expect(window.scrollY).toBe(300);
		});
		expect(drawerPanel()).toHaveAttribute('data-open');
	});

	it('leaves the rest of the page to assistive technology, with no aria-hidden and no inert', async () => {
		renderPage();
		await openFromButton();

		for (const element of [
			screen.getByRole('textbox', { name: 'Search' }),
			screen.getByRole('button', { name: 'Next row' }),
			screen.getByRole('button', { name: 'Open drawer' }),
		]) {
			expect(element.closest('[aria-hidden="true"]')).toBeNull();
			expect(element.closest('[inert]')).toBeNull();
		}
	});

	it.each([
		['escape-key', 'Esc', async () => userEvent.keyboard('{Escape}')],
		[
			'close-press',
			'the close button',
			async () => userEvent.click(screen.getByRole('button', { name: 'Close' })),
		],
	])('calls onClose with %s on %s, and closes', async (reason, _name, close) => {
		const onClose = vi.fn();
		renderPage({ onClose });
		await openFromButton();

		await close();
		await waitForClosed();

		expect(onClose).toHaveBeenCalledExactlyOnceWith(reason);
		expect(opener()).toHaveFocus();
	});

	it('is unlike a task, which locks the scroll and hides the page behind its backdrop', async () => {
		renderPage({ type: 'task' });
		await openFromButton();

		expect(pageScrolls()).toBe(false);
		expect(screen.queryByRole('button', { name: 'Next row' })).toBeNull();
		expect(screen.queryByRole('textbox', { name: 'Search' })).toBeNull();
		expect(isOnTop(rowButton())).toBe(false);
		expect(screen.getByTestId('drawer-backdrop')).toBeInTheDocument();
	});
});
