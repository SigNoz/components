import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { slot, slots } from '../../dialog/__tests__/dialog.test-utils.js';
import { AlertDialog } from '../index.js';
import { AlertHarness, renderOpenAlert } from './alert-dialog.test-utils.js';

describe('AlertDialog rendering', () => {
	it('renders nothing while it is closed', () => {
		render(<AlertHarness />);

		expect(screen.queryByRole('alertdialog')).toBeNull();
		expect(slots('alert-dialog-popup')).toHaveLength(0);
		expect(slots('alert-dialog-backdrop')).toHaveLength(0);
		expect(slots('alert-dialog-layer')).toHaveLength(0);
	});

	it('renders a modal alert dialog named by the title and described by the body', async () => {
		await renderOpenAlert();

		const panel = screen.getByRole('alertdialog', { name: 'Delete this view?' });

		expect(panel).toHaveAttribute('aria-modal', 'true');
		expect(panel.getAttribute('aria-labelledby')).toBe(screen.getByTestId('alert-title').id);
		expect(panel.getAttribute('aria-describedby')).toBe(screen.getByTestId('alert-body').id);
		expect(panel).toHaveAccessibleDescription('Dashboards that link to it open the default view.');
	});

	it('is not a role=dialog', async () => {
		await renderOpenAlert();

		expect(screen.queryByRole('dialog')).toBeNull();
	});

	it('renders no close button and no part of the dialog', async () => {
		await renderOpenAlert();

		expect(screen.queryByRole('button', { name: 'Close' })).toBeNull();
		expect(slots('dialog-close')).toHaveLength(0);
		expect(slots('dialog-footer')).toHaveLength(0);
		expect(slots('dialog-footer-prefix')).toHaveLength(0);
		expect(slots('dialog-footer-suffix')).toHaveLength(0);
		expect(slots('dialog-popup')).toHaveLength(0);
		expect(screen.getAllByRole('button')).toHaveLength(2);
	});

	it('renders the children in the body', async () => {
		await renderOpenAlert({ children: <p>The edits are lost.</p> });

		expect(screen.getByTestId('alert-body')).toHaveTextContent('The edits are lost.');
		expect(screen.getByRole('alertdialog')).toHaveAccessibleDescription('The edits are lost.');
	});

	it('renders Cancel and the confirm text, cancel first', async () => {
		await renderOpenAlert();

		const cancel = screen.getByRole('button', { name: 'Cancel' });
		const confirm = screen.getByRole('button', { name: 'Delete view' });

		expect(cancel).toBe(screen.getByTestId('alert-cancel'));
		expect(confirm).toBe(screen.getByTestId('alert-confirm'));
		expect(cancel.compareDocumentPosition(confirm) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
	});

	it('takes the label of the cancel button from cancelText', async () => {
		await renderOpenAlert({ cancelText: 'Keep it' });

		expect(screen.getByRole('button', { name: 'Keep it' })).toBe(
			screen.getByTestId('alert-cancel'),
		);
		expect(screen.queryByRole('button', { name: 'Cancel' })).toBeNull();
	});

	it('renders the icons of the title and of both buttons', async () => {
		await renderOpenAlert({
			titleIcon: <svg data-testid="title-glyph" />,
			confirmIcon: <svg data-testid="confirm-glyph" />,
			cancelIcon: <svg data-testid="cancel-glyph" />,
		});

		expect(screen.getByTestId('alert-title').parentElement).toContainElement(
			screen.getByTestId('title-glyph'),
		);
		expect(screen.getByTestId('alert-confirm')).toContainElement(
			screen.getByTestId('confirm-glyph'),
		);
		expect(screen.getByTestId('alert-cancel')).toContainElement(screen.getByTestId('cancel-glyph'));
		expect(screen.getByTestId('title-glyph').parentElement).toHaveAttribute('aria-hidden', 'true');
	});

	it('renders the title icon before the title, and keeps it out of the accessible name', async () => {
		await renderOpenAlert({ titleIcon: <svg data-testid="title-glyph" /> });

		const icon = screen.getByTestId('title-glyph');
		const heading = screen.getByTestId('alert-title');

		expect(icon.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
		expect(screen.getByRole('alertdialog')).toHaveAccessibleName('Delete this view?');
	});

	it('renders only the title in the heading when there is no title icon', async () => {
		await renderOpenAlert();

		expect(screen.getByTestId('alert-title').parentElement?.children).toHaveLength(1);
	});

	it.each([
		['an empty string', ''],
		['only spaces', '  '],
	])('renders <No title> for %s', async (_name, title) => {
		await renderOpenAlert({ title });

		expect(screen.getByTestId('alert-title')).toHaveTextContent('<No title>');
		expect(screen.getByRole('alertdialog', { name: '<No title>' })).toBeInTheDocument();
	});

	it.each(['primary', 'danger'] as const)('exposes data-color=%s on the panel', async (color) => {
		await renderOpenAlert({ color });

		expect(screen.getByRole('alertdialog')).toHaveAttribute('data-color', color);
		expect(screen.getByTestId('alert-confirm')).toHaveAttribute('data-color', color);
		expect(screen.getByTestId('alert-cancel')).toHaveAttribute('data-color', 'secondary');
	});

	it('has no data-width, it has one width', async () => {
		await renderOpenAlert();

		expect(screen.getByRole('alertdialog')).not.toHaveAttribute('data-width');
	});

	it('puts the backdrop and the panel in one layer', async () => {
		await renderOpenAlert();

		const layer = slot('alert-dialog-layer');

		expect(layer).toContainElement(screen.getByTestId('alert-backdrop'));
		expect(layer).toContainElement(screen.getByRole('alertdialog'));
		expect(slots('alert-dialog-layer')).toHaveLength(1);
		expect(slots('dialog-layer')).toHaveLength(0);
	});

	it('renders one backdrop and one panel', async () => {
		await renderOpenAlert();

		expect(slots('alert-dialog-backdrop')).toHaveLength(1);
		expect(slots('alert-dialog-popup')).toHaveLength(1);
	});

	it('names every part after the testId', async () => {
		await renderOpenAlert();

		expect(screen.getByTestId('alert')).toBe(screen.getByRole('alertdialog'));
		for (const part of ['backdrop', 'title', 'body', 'cancel', 'confirm']) {
			expect(screen.getByTestId(`alert-${part}`)).toBeInTheDocument();
		}
	});

	it('puts a data-slot on every part', async () => {
		await renderOpenAlert();

		const expected: Record<string, string> = {
			'alert-backdrop': 'alert-dialog-backdrop',
			alert: 'alert-dialog-popup',
			'alert-title': 'alert-dialog-title',
			'alert-body': 'alert-dialog-body',
			'alert-cancel': 'alert-dialog-cancel',
			'alert-confirm': 'alert-dialog-confirm',
		};

		for (const [testId, dataSlot] of Object.entries(expected)) {
			expect(screen.getByTestId(testId, { exact: true })).toHaveAttribute('data-slot', dataSlot);
		}
	});

	it('renders no data-testid on any part when no testId is given', async () => {
		render(
			<AlertDialog
				open
				title="Delete this view?"
				color="danger"
				confirmText="Delete view"
				onConfirm={() => {}}
				onCancel={() => {}}
			>
				Body
			</AlertDialog>,
		);
		await screen.findByRole('alertdialog');

		expect(document.querySelectorAll('div[data-testid], button[data-testid]')).toHaveLength(0);
	});

	it('renders in document.body, outside the render container', async () => {
		const { container } = await renderOpenAlert();

		expect(container.querySelector('[role="alertdialog"]')).toBeNull();
		expect(slot('alert-dialog-popup')?.closest('[data-base-ui-portal]')?.parentElement).toBe(
			document.body,
		);
	});
});

describe('AlertDialog forwarded props', () => {
	it('lands id, aria-* and data-* on the panel', async () => {
		await renderOpenAlert({ id: 'delete-alert', 'aria-busy': true, 'data-area': 'views' });
		const panel = screen.getByRole('alertdialog');

		expect(panel).toHaveAttribute('id', 'delete-alert');
		expect(panel).toHaveAttribute('aria-busy', 'true');
		expect(panel).toHaveAttribute('data-area', 'views');
	});

	it('does not let a data-slot from the call site take the slot of the panel', async () => {
		await renderOpenAlert({ 'data-slot': 'mine' });

		expect(screen.getByRole('alertdialog')).toHaveAttribute('data-slot', 'alert-dialog-popup');
	});

	it('does not let a data-color from the call site take the color of the panel', async () => {
		await renderOpenAlert({ color: 'danger', 'data-color': 'mine' });

		expect(screen.getByRole('alertdialog')).toHaveAttribute('data-color', 'danger');
	});

	it('does not let an aria-modal from the call site undo the modal', async () => {
		await renderOpenAlert({ 'aria-modal': false });

		expect(screen.getByRole('alertdialog')).toHaveAttribute('aria-modal', 'true');
	});

	it('does not forward a style', async () => {
		const unchecked: Record<string, unknown> = { style: { zIndex: 1100, color: 'red' } };
		await renderOpenAlert(unchecked);

		const panel = screen.getByRole('alertdialog');

		expect(panel.style.color).toBe('');
		expect(panel.style.zIndex).toBe('');
	});
});
