import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { waitForOnTop } from '../../dialog/__tests__/dialog.test-utils.js';
import { Select } from '../../select/index.js';
import { cancelButton, confirmButton, renderOpenAlert } from './alert-dialog.test-utils.js';

const SERVICES = ['frontend', 'checkout', 'cart', 'payment', 'shipping', 'email'];

/**
 * The design tokens are not loaded here, so the spacing the alert reads is declared in the test
 * with the numbers `@signozhq/design-tokens` ships.
 */
let tokens: HTMLStyleElement;

const DEFAULT_VIEWPORT = { width: 414, height: 896 };

beforeEach(() => {
	tokens = document.createElement('style');
	tokens.textContent = `:root {
		--spacing-3: 6px;
		--spacing-4: 8px;
		--spacing-6: 12px;
		--spacing-8: 16px;
		--spacing-12: 24px;
		--radius-2: 4px;
		--paragraph-base-400-line-height: 20px;
	}`;
	document.head.append(tokens);
});

afterEach(async () => {
	tokens.remove();
	await page.viewport(DEFAULT_VIEWPORT.width, DEFAULT_VIEWPORT.height);
});

function rect(element: HTMLElement): DOMRect {
	return element.getBoundingClientRect();
}

describe('AlertDialog width', () => {
	it('is one width, 384px, centered', async () => {
		await page.viewport(1280, 800);
		await renderOpenAlert();
		const panel = rect(screen.getByRole('alertdialog'));

		expect(panel.width).toBeCloseTo(384, 0);
		expect(getComputedStyle(screen.getByRole('alertdialog')).maxWidth).toBe('384px');
		expect(panel.left + panel.right).toBeCloseTo(window.innerWidth, 0);
	});

	it('shrinks on a narrow screen, 16px from each edge', async () => {
		await page.viewport(320, 700);
		await renderOpenAlert();
		const panel = rect(screen.getByRole('alertdialog'));

		expect(panel.left).toBeGreaterThanOrEqual(16 - 0.5);
		expect(window.innerWidth - panel.right).toBeGreaterThanOrEqual(16 - 0.5);
	});

	it('is centered vertically when it is shorter than the screen', async () => {
		await page.viewport(1280, 800);
		await renderOpenAlert();
		const panel = rect(screen.getByRole('alertdialog'));

		expect(panel.top + panel.bottom).toBeCloseTo(window.innerHeight, 0);
	});
});

describe('AlertDialog overflow', () => {
	it('stays inside the viewport on a short screen', async () => {
		await page.viewport(414, 200);
		await renderOpenAlert({ children: <div style={{ height: '1000px' }}>Tall</div> });
		const panel = rect(screen.getByRole('alertdialog'));

		expect(panel.top).toBeGreaterThanOrEqual(16 - 0.5);
		expect(panel.bottom).toBeLessThanOrEqual(window.innerHeight - 16 + 0.5);
	});

	it('scrolls the body, not the panel, when the body is taller than the screen', async () => {
		await page.viewport(414, 300);
		await renderOpenAlert({ children: <div style={{ height: '1000px' }}>Tall</div> });
		const panel = screen.getByRole('alertdialog');
		const body = screen.getByTestId('alert-body');

		expect(body.scrollHeight).toBeGreaterThan(body.clientHeight);
		expect(getComputedStyle(body).overflowY).toBe('auto');
		expect(getComputedStyle(panel).overflowY).toBe('visible');
	});

	it('keeps the title and the buttons on screen when the body scrolls', async () => {
		await page.viewport(414, 300);
		await renderOpenAlert({ children: <div style={{ height: '1000px' }}>Tall</div> });
		const panel = rect(screen.getByRole('alertdialog'));

		expect(rect(screen.getByTestId('alert-title')).top).toBeGreaterThanOrEqual(panel.top);
		expect(rect(confirmButton()).bottom).toBeLessThanOrEqual(panel.bottom + 0.5);
		expect(rect(cancelButton()).bottom).toBeLessThanOrEqual(panel.bottom + 0.5);
	});

	it('lets a popup in the body reach past the edge of the panel', async () => {
		await renderOpenAlert({
			children: (
				<Select
					placeholder="Select a service..."
					aria-label="Service"
					items={SERVICES.map((name) => ({ type: 'item', value: name, label: name }))}
				/>
			),
		});

		await userEvent.click(screen.getByRole('combobox', { name: 'Service' }));
		const last = await screen.findByRole('option', { name: SERVICES.at(-1) });
		await waitFor(() => {
			expect(rect(last).bottom).toBeGreaterThan(rect(screen.getByRole('alertdialog')).bottom);
		});

		await waitForOnTop(last);
	});
});

describe('AlertDialog footer', () => {
	it('stacks the buttons with the confirm one on top below 640px', async () => {
		await page.viewport(639, 800);
		await renderOpenAlert();
		const cancel = rect(cancelButton());
		const confirm = rect(confirmButton());

		expect(confirm.top).toBeLessThan(cancel.top);
		expect(confirm.left).toBeCloseTo(cancel.left, 0);
	});

	it('lays the buttons in a row, confirm last, from 640px', async () => {
		await page.viewport(1280, 800);
		await renderOpenAlert();
		const cancel = rect(cancelButton());
		const confirm = rect(confirmButton());

		expect(cancel.top).toBeCloseTo(confirm.top, 0);
		expect(cancel.left).toBeLessThan(confirm.left);
	});

	it('puts the buttons at the end of the footer', async () => {
		await page.viewport(1280, 800);
		await renderOpenAlert();
		const panel = rect(screen.getByRole('alertdialog'));

		expect(panel.right - rect(confirmButton()).right).toBeCloseTo(16 + 1, 0);
	});
});

describe('AlertDialog title and body', () => {
	const LONG_TITLE =
		'A title that is far longer than any panel is wide, which wraps onto lines and is never cut';

	it('wraps a long title', async () => {
		await renderOpenAlert({ title: LONG_TITLE });
		const title = screen.getByTestId('alert-title');
		const style = getComputedStyle(title);

		expect(style.textOverflow).not.toBe('ellipsis');
		expect(title.scrollWidth).toBeLessThanOrEqual(title.clientWidth + 1);
		expect(title.getBoundingClientRect().height).toBeGreaterThan(parseFloat(style.fontSize) * 1.5);
	});

	it('wraps a long unbroken word in the body', async () => {
		await renderOpenAlert({ children: 'x'.repeat(200) });
		const body = screen.getByTestId('alert-body');

		expect(body.scrollWidth).toBeLessThanOrEqual(body.clientWidth + 1);
		expect(rect(body).right).toBeLessThanOrEqual(rect(screen.getByRole('alertdialog')).right);
	});

	it('keeps a sentence with a bold name in it on one line', async () => {
		await renderOpenAlert({
			children: (
				<>
					Delete <strong>Jon</strong>?
				</>
			),
		});
		const body = screen.getByTestId('alert-body');
		const name = body.querySelector('strong') as HTMLElement;

		// One 20px line: a flex body would put the name on a line of its own.
		expect(body.getBoundingClientRect().height).toBe(20);
		expect(name.getBoundingClientRect().bottom).toBeLessThanOrEqual(
			body.getBoundingClientRect().bottom,
		);
	});

	it('spaces the blocks of the body', async () => {
		await renderOpenAlert({
			children: (
				<>
					<div data-testid="first">The view goes away.</div>
					<div data-testid="second">Links to it open the default view.</div>
				</>
			),
		});
		const first = screen.getByTestId('first').getBoundingClientRect();
		const second = screen.getByTestId('second').getBoundingClientRect();

		expect(second.top - first.bottom).toBe(12);
	});

	it('puts the title icon before the title, on the same line', async () => {
		await renderOpenAlert({ titleIcon: <svg data-testid="title-glyph" width="14" height="14" /> });
		const icon = rect(screen.getByTestId('title-glyph'));
		const title = rect(screen.getByTestId('alert-title'));

		expect(icon.right).toBeLessThanOrEqual(title.left);
		expect(icon.top).toBeGreaterThanOrEqual(title.top - 1);
		expect(icon.bottom).toBeLessThanOrEqual(title.bottom + 1);
	});
});
