import { Info } from '@signozhq/icons';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Dialog } from '../dialog.js';
import type { DialogWidthType } from '../types.js';
import { DialogHarness, renderOpenDialog, slot, slots } from './dialog.test-utils.js';

describe('Dialog rendering', () => {
	it('renders nothing while it is closed', () => {
		render(<DialogHarness />);

		expect(screen.queryByRole('dialog')).toBeNull();
		expect(slots('dialog-popup')).toHaveLength(0);
		expect(slots('dialog-backdrop')).toHaveLength(0);
	});

	it('renders a modal dialog named by the title', async () => {
		await renderOpenDialog();

		const panel = screen.getByRole('dialog', { name: 'Rename view' });

		expect(panel).toHaveAttribute('aria-modal', 'true');
		expect(panel).toHaveAccessibleName('Rename view');
		expect(panel.getAttribute('aria-labelledby')).toBe(screen.getByTestId('dialog-title').id);
	});

	it('describes the panel with the description', async () => {
		await renderOpenDialog({ description: 'Pick a name the team will recognise' });

		const panel = screen.getByRole('dialog');
		const description = screen.getByTestId('dialog-description');

		expect(panel.getAttribute('aria-describedby')).toBe(description.id);
		expect(panel).toHaveAccessibleDescription('Pick a name the team will recognise');
		expect(slot('dialog-header')).toContainElement(description);
	});

	it.each([
		['an empty string', ''],
		['null', null],
		['false', false],
		['an empty fragment', <></>],
		['an empty array', []],
	])('renders no description and no aria-describedby for %s', async (_name, description) => {
		await renderOpenDialog({ description });

		expect(screen.queryByTestId('dialog-description')).toBeNull();
		expect(slots('dialog-description')).toHaveLength(0);
		expect(screen.getByRole('dialog')).not.toHaveAttribute('aria-describedby');
	});

	it('renders the footer after the body, inside the panel', async () => {
		await renderOpenDialog({ footerSuffix: <button type="button">Save</button> });

		const footer = screen.getByTestId('dialog-footer');

		expect(screen.getByRole('dialog')).toContainElement(footer);
		expect(footer).toContainElement(screen.getByRole('button', { name: 'Save' }));
		expect(
			screen.getByTestId('dialog-body').compareDocumentPosition(footer) &
				Node.DOCUMENT_POSITION_FOLLOWING,
		).toBeTruthy();
	});

	it('renders the footerSuffix in the suffix slot of the footer', async () => {
		await renderOpenDialog({ footerSuffix: <button type="button">Save</button> });

		const suffix = screen.getByTestId('dialog-footer-suffix');

		expect(suffix).toHaveAttribute('data-slot', 'dialog-footer-suffix');
		expect(screen.getByTestId('dialog-footer')).toContainElement(suffix);
		expect(suffix).toContainElement(screen.getByRole('button', { name: 'Save' }));
	});

	it.each([
		['undefined', undefined],
		['an empty string', ''],
		['null', null],
		['false', false],
		['an empty fragment', <></>],
		['an empty array', []],
	])('renders no footer for %s', async (_name, footerSuffix) => {
		await renderOpenDialog({ footerSuffix });

		expect(screen.queryByTestId('dialog-footer')).toBeNull();
		expect(slots('dialog-footer')).toHaveLength(0);
		expect(slots('dialog-footer-suffix')).toHaveLength(0);
	});

	it('renders the footerPrefix as the first child of the footer, before the footerSuffix', async () => {
		await renderOpenDialog({
			footerPrefix: <button type="button">Delete view</button>,
			footerSuffix: <button type="button">Save</button>,
		});

		const footer = screen.getByTestId('dialog-footer');
		const prefix = screen.getByTestId('dialog-footer-prefix');
		const suffix = screen.getByTestId('dialog-footer-suffix');

		expect(prefix).toHaveAttribute('data-slot', 'dialog-footer-prefix');
		expect(footer.children).toHaveLength(2);
		expect(footer.firstElementChild).toBe(prefix);
		expect(footer.lastElementChild).toBe(suffix);
		expect(prefix).toContainElement(screen.getByRole('button', { name: 'Delete view' }));
		expect(suffix).toContainElement(screen.getByRole('button', { name: 'Save' }));
		expect(prefix).not.toContainElement(screen.getByRole('button', { name: 'Save' }));
		expect(prefix.compareDocumentPosition(suffix) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
	});

	it('renders only the suffix slot in the footer when there is no footerPrefix', async () => {
		await renderOpenDialog({ footerSuffix: <button type="button">Save</button> });

		const footer = screen.getByTestId('dialog-footer');

		expect(footer.children).toHaveLength(1);
		expect(footer.firstElementChild).toBe(screen.getByTestId('dialog-footer-suffix'));
		expect(slots('dialog-footer-prefix')).toHaveLength(0);
	});

	it('renders no footer and no prefix for a footerPrefix alone', async () => {
		await renderOpenDialog({ footerPrefix: <button type="button">Delete view</button> });

		expect(screen.queryByTestId('dialog-footer')).toBeNull();
		expect(screen.queryByTestId('dialog-footer-prefix')).toBeNull();
		expect(slots('dialog-footer')).toHaveLength(0);
		expect(slots('dialog-footer-prefix')).toHaveLength(0);
		expect(screen.queryByRole('button', { name: 'Delete view' })).toBeNull();
	});

	it.each([
		['undefined', undefined],
		['an empty string', ''],
		['null', null],
		['false', false],
		['an empty fragment', <></>],
		['an empty array', []],
	])('renders no prefix slot for a footerPrefix of %s', async (_name, footerPrefix) => {
		await renderOpenDialog({ footerPrefix, footerSuffix: <button type="button">Save</button> });

		expect(screen.getByTestId('dialog-footer')).toBeInTheDocument();
		expect(screen.getByTestId('dialog-footer-suffix')).toBeInTheDocument();
		expect(screen.queryByTestId('dialog-footer-prefix')).toBeNull();
		expect(slots('dialog-footer-prefix')).toHaveLength(0);
	});

	it.each([
		['an empty string', ''],
		['only spaces', '   '],
	])('renders <No title> for %s', async (_name, title) => {
		await renderOpenDialog({ title });

		const heading = screen.getByTestId('dialog-title');

		expect(heading).toHaveTextContent('<No title>');
		expect(screen.getByRole('dialog', { name: '<No title>' })).toBeInTheDocument();
		expect(slot('dialog-header')).toContainElement(heading);
	});

	it('renders the title icon before the title, hidden from assistive technology', async () => {
		await renderOpenDialog({ titleIcon: <Info /> });

		const icon = screen.getByTestId('info');
		const heading = screen.getByTestId('dialog-title');

		expect(icon.parentElement).toHaveAttribute('aria-hidden', 'true');
		expect(icon.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
		expect(screen.getByRole('dialog')).toHaveAccessibleName('Rename view');
	});

	it('renders no title icon when none is given', async () => {
		await renderOpenDialog();

		expect(screen.queryByTestId('info')).toBeNull();
	});

	it('renders the close button, labelled Close', async () => {
		await renderOpenDialog();

		const close = screen.getByRole('button', { name: 'Close' });

		expect(close).toBe(screen.getByTestId('dialog-close'));
		expect(close).toHaveAttribute('data-slot', 'dialog-close');
		expect(slot('dialog-header')).toContainElement(close);
	});

	it('renders the children in the body', async () => {
		await renderOpenDialog({ children: <p>The body text</p> });

		expect(screen.getByTestId('dialog-body')).toHaveTextContent('The body text');
	});

	it('names every part after the testId', async () => {
		await renderOpenDialog({
			description: 'Detail',
			footerPrefix: <button type="button">Delete view</button>,
			footerSuffix: <button type="button">Save</button>,
		});

		const panel = screen.getByTestId('dialog');

		expect(panel).toBe(screen.getByRole('dialog'));
		for (const part of [
			'backdrop',
			'header',
			'title',
			'description',
			'close',
			'body',
			'footer',
			'footer-prefix',
			'footer-suffix',
		]) {
			expect(screen.getByTestId(`dialog-${part}`)).toBeInTheDocument();
		}
	});

	it('puts a data-slot on every part', async () => {
		await renderOpenDialog({
			description: 'Detail',
			footerPrefix: <button type="button">Delete view</button>,
			footerSuffix: <button type="button">Save</button>,
		});

		const expected: Record<string, string> = {
			'dialog-backdrop': 'dialog-backdrop',
			dialog: 'dialog-popup',
			'dialog-header': 'dialog-header',
			'dialog-title': 'dialog-title',
			'dialog-description': 'dialog-description',
			'dialog-close': 'dialog-close',
			'dialog-body': 'dialog-body',
			'dialog-footer': 'dialog-footer',
			'dialog-footer-prefix': 'dialog-footer-prefix',
			'dialog-footer-suffix': 'dialog-footer-suffix',
		};

		for (const [testId, dataSlot] of Object.entries(expected)) {
			expect(screen.getByTestId(testId, { exact: true })).toHaveAttribute('data-slot', dataSlot);
		}
	});

	it('renders one backdrop and one panel', async () => {
		await renderOpenDialog();

		expect(slots('dialog-backdrop')).toHaveLength(1);
		expect(slots('dialog-popup')).toHaveLength(1);
	});

	it('renders no data-testid on any part when no testId is given', async () => {
		render(
			<Dialog
				open
				onClose={() => {}}
				title="Rename view"
				description="Detail"
				footerPrefix="Prefix"
				footerSuffix="Suffix"
			>
				Body
			</Dialog>,
		);
		await screen.findByRole('dialog');

		expect(document.querySelectorAll('div[data-testid], button[data-testid]')).toHaveLength(0);
	});

	it('renders in document.body, outside the render container', async () => {
		const { container } = await renderOpenDialog();

		expect(container.querySelector('[role="dialog"]')).toBeNull();
		expect(slot('dialog-popup')?.closest('[data-base-ui-portal]')?.parentElement).toBe(
			document.body,
		);
	});
});

describe('Dialog width', () => {
	it('defaults to base', async () => {
		await renderOpenDialog();

		expect(screen.getByRole('dialog')).toHaveAttribute('data-width', 'base');
	});

	it.each<[DialogWidthType, string]>([
		['narrow', '384px'],
		['base', '512px'],
		['wide', '672px'],
		['extra-wide', '820px'],
		['full', '100%'],
	])('data-width is %s and the panel max width is %s', async (width, maxWidth) => {
		await renderOpenDialog({ width });
		const panel = screen.getByRole('dialog');

		expect(panel).toHaveAttribute('data-width', width);
		expect(getComputedStyle(panel).maxWidth).toBe(maxWidth);
	});
});

describe('Dialog forwarded props', () => {
	it('lands id, aria-* and data-* on the panel', async () => {
		await renderOpenDialog({
			id: 'rename-dialog',
			'aria-label': undefined,
			'aria-busy': true,
			'data-area': 'views',
		});
		const panel = screen.getByRole('dialog');

		expect(panel).toHaveAttribute('id', 'rename-dialog');
		expect(panel).toHaveAttribute('aria-busy', 'true');
		expect(panel).toHaveAttribute('data-area', 'views');
	});

	it('does not forward a className', async () => {
		const unchecked: Record<string, unknown> = { className: 'scope-a' };
		await renderOpenDialog(unchecked);

		const panel = screen.getByRole('dialog');

		expect(panel).not.toHaveClass('scope-a');
		expect(panel.className).not.toBe('');
	});

	it('does not let a data-slot from the call site take the slot of the panel', async () => {
		await renderOpenDialog({ 'data-slot': 'mine' });

		expect(screen.getByRole('dialog')).toHaveAttribute('data-slot', 'dialog-popup');
	});

	it('does not forward a style', async () => {
		const unchecked: Record<string, unknown> = { style: { zIndex: 1100, color: 'red' } };
		await renderOpenDialog(unchecked);

		const panel = screen.getByRole('dialog');

		expect(panel).not.toHaveAttribute('style', expect.stringContaining('1100'));
		expect(panel.style.color).toBe('');
	});
});
