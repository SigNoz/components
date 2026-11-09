import { Info } from '@signozhq/icons';
import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { Drawer } from '../drawer.js';
import type { DrawerTypeType, DrawerWidthType } from '../types.js';
import { DrawerHarness, renderOpenDrawer, slot, slots } from './drawer.test-utils.js';

const HEADER_SLOTS = {
	headerPrefix: (
		<button type="button" aria-label="Previous">
			↑
		</button>
	),
	titlePrefix: <Info />,
	titleSuffix: (
		<button type="button" aria-label="Copy name">
			⧉
		</button>
	),
	headerSuffix: <button type="button">Edit</button>,
};

const TASK_SLOTS = {
	...HEADER_SLOTS,
	description: 'Changes apply to every dashboard',
	footerPrefix: <button type="button">Delete member</button>,
	footerSuffix: <button type="button">Save</button>,
};

const RENDERS_NOTHING: [string, ReactNode][] = [
	['an empty string', ''],
	['null', null],
	['false', false],
	['true', true],
	['an empty fragment', <></>],
	['an empty array', []],
];

describe('Drawer rendering', () => {
	it('renders nothing while it is closed', () => {
		render(<DrawerHarness />);

		expect(screen.queryByRole('dialog')).toBeNull();
		expect(slots('drawer-popup')).toHaveLength(0);
		expect(slots('drawer-backdrop')).toHaveLength(0);
	});

	it('renders a task as a modal dialog named by the title', async () => {
		await renderOpenDrawer();

		const panel = screen.getByRole('dialog', { name: 'Edit member' });

		expect(panel).toHaveAttribute('aria-modal', 'true');
		expect(panel).toHaveAttribute('data-type', 'task');
		expect(panel.getAttribute('aria-labelledby')).toBe(screen.getByTestId('drawer-title').id);
	});

	it('renders an inspector as a dialog named by the title, without aria-modal', async () => {
		await renderOpenDrawer({ type: 'inspector', title: 'Span details' });

		const panel = screen.getByRole('dialog', { name: 'Span details' });

		expect(panel).not.toHaveAttribute('aria-modal');
		expect(panel).toHaveAttribute('data-type', 'inspector');
		expect(panel.getAttribute('aria-labelledby')).toBe(screen.getByTestId('drawer-title').id);
	});

	it('describes a task with the description, under the title in the header', async () => {
		await renderOpenDrawer({ description: 'Changes apply to every dashboard' });

		const panel = screen.getByRole('dialog');
		const description = screen.getByTestId('drawer-description');

		expect(panel.getAttribute('aria-describedby')).toBe(description.id);
		expect(panel).toHaveAccessibleDescription('Changes apply to every dashboard');
		expect(slot('drawer-header')).toContainElement(description);
		expect(
			screen.getByTestId('drawer-title').compareDocumentPosition(description) &
				Node.DOCUMENT_POSITION_FOLLOWING,
		).toBeTruthy();
	});

	it('names every part of a task after the testId', async () => {
		await renderOpenDrawer(TASK_SLOTS);

		expect(screen.getByTestId('drawer')).toBe(screen.getByRole('dialog'));
		for (const part of [
			'backdrop',
			'header',
			'header-prefix',
			'title-prefix',
			'title',
			'title-suffix',
			'description',
			'header-suffix',
			'close',
			'body',
			'footer',
			'footer-prefix',
			'footer-suffix',
		]) {
			expect(screen.getByTestId(`drawer-${part}`)).toBeInTheDocument();
		}
	});

	it('puts a data-slot on every part of a task', async () => {
		await renderOpenDrawer(TASK_SLOTS);

		const expected: Record<string, string> = {
			'drawer-backdrop': 'drawer-backdrop',
			drawer: 'drawer-popup',
			'drawer-header': 'drawer-header',
			'drawer-header-prefix': 'drawer-header-prefix',
			'drawer-title-prefix': 'drawer-title-prefix',
			'drawer-title': 'drawer-title',
			'drawer-title-suffix': 'drawer-title-suffix',
			'drawer-description': 'drawer-description',
			'drawer-header-suffix': 'drawer-header-suffix',
			'drawer-close': 'drawer-close',
			'drawer-body': 'drawer-body',
			'drawer-footer': 'drawer-footer',
			'drawer-footer-prefix': 'drawer-footer-prefix',
			'drawer-footer-suffix': 'drawer-footer-suffix',
		};

		for (const [testId, dataSlot] of Object.entries(expected)) {
			expect(screen.getByTestId(testId, { exact: true })).toHaveAttribute('data-slot', dataSlot);
		}
		expect(slot('drawer-layer')).toContainElement(screen.getByTestId('drawer'));
	});

	it('names every part of an inspector after the testId, with no backdrop and no footer', async () => {
		await renderOpenDrawer({ type: 'inspector', ...HEADER_SLOTS });

		const expected: Record<string, string> = {
			drawer: 'drawer-popup',
			'drawer-header': 'drawer-header',
			'drawer-header-prefix': 'drawer-header-prefix',
			'drawer-title-prefix': 'drawer-title-prefix',
			'drawer-title': 'drawer-title',
			'drawer-title-suffix': 'drawer-title-suffix',
			'drawer-header-suffix': 'drawer-header-suffix',
			'drawer-close': 'drawer-close',
			'drawer-body': 'drawer-body',
		};

		for (const [testId, dataSlot] of Object.entries(expected)) {
			expect(screen.getByTestId(testId, { exact: true })).toHaveAttribute('data-slot', dataSlot);
		}
		expect(slots('drawer-backdrop')).toHaveLength(0);
		expect(slots('drawer-footer')).toHaveLength(0);
		expect(slots('drawer-description')).toHaveLength(0);
	});

	it('renders each slot inside its part', async () => {
		await renderOpenDrawer(TASK_SLOTS);

		expect(screen.getByTestId('drawer-header-prefix')).toContainElement(
			screen.getByRole('button', { name: 'Previous' }),
		);
		expect(screen.getByTestId('drawer-title-prefix')).toContainElement(screen.getByTestId('info'));
		expect(screen.getByTestId('drawer-title-suffix')).toContainElement(
			screen.getByRole('button', { name: 'Copy name' }),
		);
		expect(screen.getByTestId('drawer-header-suffix')).toContainElement(
			screen.getByRole('button', { name: 'Edit' }),
		);
		expect(screen.getByTestId('drawer-footer-prefix')).toContainElement(
			screen.getByRole('button', { name: 'Delete member' }),
		);
		expect(screen.getByTestId('drawer-footer-suffix')).toContainElement(
			screen.getByRole('button', { name: 'Save' }),
		);
	});

	it('renders the header in order: prefix, divider, title row, suffix, close button', async () => {
		await renderOpenDrawer(TASK_SLOTS);

		const header = screen.getByTestId('drawer-header');
		const [prefix, divider, heading, suffix, close] = header.children;

		expect(header.children).toHaveLength(5);
		expect(prefix).toBe(screen.getByTestId('drawer-header-prefix'));
		expect(divider).toHaveAttribute('aria-hidden', 'true');
		expect(divider).toBeEmptyDOMElement();
		expect(heading).toContainElement(screen.getByTestId('drawer-title-prefix'));
		expect(heading).toContainElement(screen.getByTestId('drawer-title'));
		expect(heading).toContainElement(screen.getByTestId('drawer-title-suffix'));
		expect(heading).toContainElement(screen.getByTestId('drawer-description'));
		expect(suffix).toBe(screen.getByTestId('drawer-header-suffix'));
		expect(close).toBe(screen.getByTestId('drawer-close'));
	});

	it('puts the title prefix before the title and the title suffix after it', async () => {
		await renderOpenDrawer(HEADER_SLOTS);

		const title = screen.getByTestId('drawer-title');

		expect(
			screen.getByTestId('drawer-title-prefix').compareDocumentPosition(title) &
				Node.DOCUMENT_POSITION_FOLLOWING,
		).toBeTruthy();
		expect(
			title.compareDocumentPosition(screen.getByTestId('drawer-title-suffix')) &
				Node.DOCUMENT_POSITION_FOLLOWING,
		).toBeTruthy();
	});

	it('renders no divider without a headerPrefix', async () => {
		await renderOpenDrawer({ headerSuffix: HEADER_SLOTS.headerSuffix });

		const header = screen.getByTestId('drawer-header');

		expect(header.children).toHaveLength(3);
		expect(header.firstElementChild).toContainElement(screen.getByTestId('drawer-title'));
		expect(header.querySelector(':scope > [aria-hidden="true"]')).toBeNull();
	});

	it('keeps the titlePrefix out of the accessible name', async () => {
		await renderOpenDrawer({ titlePrefix: <span>Pod</span> });

		expect(screen.getByTestId('drawer-title-prefix')).toHaveTextContent('Pod');
		expect(screen.getByRole('dialog')).toHaveAccessibleName('Edit member');
	});

	it('renders the close button last in the header, labelled Close', async () => {
		await renderOpenDrawer({ headerSuffix: HEADER_SLOTS.headerSuffix });

		const close = screen.getByRole('button', { name: 'Close' });

		expect(close).toBe(screen.getByTestId('drawer-close'));
		expect(close).toHaveAttribute('data-slot', 'drawer-close');
		expect(screen.getByTestId('drawer-header').lastElementChild).toBe(close);
		expect(screen.getByTestId('drawer-header')).toHaveAttribute('data-close-position', 'end');
	});

	it('renders the header in order with closePosition="start": close button, prefix, divider, title row, suffix', async () => {
		await renderOpenDrawer({ ...TASK_SLOTS, closePosition: 'start' });

		const header = screen.getByTestId('drawer-header');
		const [close, prefix, divider, heading, suffix] = header.children;

		expect(header).toHaveAttribute('data-close-position', 'start');
		expect(header.children).toHaveLength(5);
		expect(close).toBe(screen.getByRole('button', { name: 'Close' }));
		expect(prefix).toBe(screen.getByTestId('drawer-header-prefix'));
		expect(divider).toHaveAttribute('aria-hidden', 'true');
		expect(heading).toContainElement(screen.getByTestId('drawer-title'));
		expect(suffix).toBe(screen.getByTestId('drawer-header-suffix'));
	});

	it('renders the close button last for a closePosition the types reject', async () => {
		await renderOpenDrawer({
			headerSuffix: HEADER_SLOTS.headerSuffix,
			closePosition: 'left' as unknown as 'start',
		});

		const header = screen.getByTestId('drawer-header');

		expect(header).toHaveAttribute('data-close-position', 'end');
		expect(header.lastElementChild).toBe(screen.getByRole('button', { name: 'Close' }));
	});

	it('renders the children in the body', async () => {
		await renderOpenDrawer({ children: <p>The body text</p> });

		expect(screen.getByTestId('drawer-body')).toHaveTextContent('The body text');
	});

	it('renders the footer after the body, inside the panel', async () => {
		await renderOpenDrawer({ footerSuffix: <button type="button">Save</button> });

		const footer = screen.getByTestId('drawer-footer');

		expect(screen.getByRole('dialog')).toContainElement(footer);
		expect(
			screen.getByTestId('drawer-body').compareDocumentPosition(footer) &
				Node.DOCUMENT_POSITION_FOLLOWING,
		).toBeTruthy();
	});

	it('renders the footerPrefix as the first child of the footer, before the footerSuffix', async () => {
		await renderOpenDrawer({
			footerPrefix: TASK_SLOTS.footerPrefix,
			footerSuffix: TASK_SLOTS.footerSuffix,
		});

		const footer = screen.getByTestId('drawer-footer');

		expect(footer.children).toHaveLength(2);
		expect(footer.firstElementChild).toBe(screen.getByTestId('drawer-footer-prefix'));
		expect(footer.lastElementChild).toBe(screen.getByTestId('drawer-footer-suffix'));
	});

	it('renders only the suffix slot in the footer when there is no footerPrefix', async () => {
		await renderOpenDrawer({ footerSuffix: TASK_SLOTS.footerSuffix });

		const footer = screen.getByTestId('drawer-footer');

		expect(footer.children).toHaveLength(1);
		expect(footer.firstElementChild).toBe(screen.getByTestId('drawer-footer-suffix'));
		expect(slots('drawer-footer-prefix')).toHaveLength(0);
	});

	it('renders no footer for a task without a footerSuffix', async () => {
		await renderOpenDrawer();

		expect(slots('drawer-footer')).toHaveLength(0);
		expect(screen.getByTestId('drawer-body')).toBe(
			screen.getByTestId('drawer-header').parentElement?.lastElementChild,
		);
	});

	it('renders no footer and no prefix for a footerPrefix alone', async () => {
		await renderOpenDrawer({ footerPrefix: TASK_SLOTS.footerPrefix });

		expect(screen.queryByTestId('drawer-footer')).toBeNull();
		expect(screen.queryByTestId('drawer-footer-prefix')).toBeNull();
		expect(slots('drawer-footer')).toHaveLength(0);
		expect(slots('drawer-footer-prefix')).toHaveLength(0);
		expect(screen.queryByRole('button', { name: 'Delete member' })).toBeNull();
	});

	it.each(RENDERS_NOTHING)('renders no header slot and no divider for %s', async (_name, node) => {
		await renderOpenDrawer({
			headerPrefix: node,
			titlePrefix: node,
			titleSuffix: node,
			headerSuffix: node,
			description: node,
		});

		for (const name of [
			'drawer-header-prefix',
			'drawer-title-prefix',
			'drawer-title-suffix',
			'drawer-header-suffix',
			'drawer-description',
		]) {
			expect(slots(name)).toHaveLength(0);
		}
		expect(screen.getByTestId('drawer-header').children).toHaveLength(2);
		expect(screen.getByRole('dialog')).not.toHaveAttribute('aria-describedby');
	});

	it.each(RENDERS_NOTHING)('renders no footer for a footerSuffix of %s', async (_name, node) => {
		await renderOpenDrawer({ footerPrefix: TASK_SLOTS.footerPrefix, footerSuffix: node });

		expect(screen.queryByTestId('drawer-footer')).toBeNull();
		expect(slots('drawer-footer')).toHaveLength(0);
		expect(slots('drawer-footer-prefix')).toHaveLength(0);
		expect(slots('drawer-footer-suffix')).toHaveLength(0);
	});

	it.each(RENDERS_NOTHING)(
		'renders no prefix slot for a footerPrefix of %s',
		async (_name, node) => {
			await renderOpenDrawer({ footerPrefix: node, footerSuffix: TASK_SLOTS.footerSuffix });

			expect(screen.getByTestId('drawer-footer-suffix')).toBeInTheDocument();
			expect(slots('drawer-footer-prefix')).toHaveLength(0);
		},
	);

	it('drops a description and a footer forced onto an inspector', async () => {
		render(
			<Drawer
				// A `type` widened to the union gets past the rule that rejects these on an inspector.
				type={'inspector' as DrawerTypeType}
				stack="overlay"
				open
				onClose={() => {}}
				title="Span details"
				testId="drawer"
				description="Changes apply to every dashboard"
				footerPrefix={TASK_SLOTS.footerPrefix}
				footerSuffix={TASK_SLOTS.footerSuffix}
			>
				Body
			</Drawer>,
		);
		const panel = await screen.findByRole('dialog', { name: 'Span details' });

		expect(panel).toHaveAttribute('data-type', 'inspector');
		expect(panel).not.toHaveAttribute('aria-describedby');
		expect(slots('drawer-description')).toHaveLength(0);
		expect(slots('drawer-footer')).toHaveLength(0);
		expect(screen.queryByText('Changes apply to every dashboard')).toBeNull();
		expect(screen.queryByRole('button', { name: 'Save' })).toBeNull();
		expect(screen.queryByRole('button', { name: 'Delete member' })).toBeNull();
	});

	it.each([
		['an empty string', ''],
		['only spaces', '   '],
	])('renders <No title> for %s', async (_name, title) => {
		await renderOpenDrawer({ title });

		const heading = screen.getByTestId('drawer-title');

		expect(heading).toHaveTextContent('<No title>');
		expect(screen.getByRole('dialog', { name: '<No title>' })).toBeInTheDocument();
	});

	it('renders one backdrop and one panel for a task', async () => {
		await renderOpenDrawer();

		expect(slots('drawer-backdrop')).toHaveLength(1);
		expect(slots('drawer-popup')).toHaveLength(1);
	});

	it('renders no data-testid on any part when no testId is given', async () => {
		render(
			<Drawer
				type="task"
				stack="overlay"
				open
				onClose={() => {}}
				title="Edit member"
				headerPrefix="Prefix"
				titlePrefix="Icon"
				titleSuffix="Copy"
				headerSuffix="Actions"
				description="Detail"
				footerPrefix="Prefix"
				footerSuffix="Suffix"
			>
				Body
			</Drawer>,
		);
		await screen.findByRole('dialog');

		expect(
			document.querySelectorAll('div[data-testid], span[data-testid], button[data-testid]'),
		).toHaveLength(0);
	});

	it('renders in document.body, outside the render container', async () => {
		const { container } = await renderOpenDrawer();

		expect(container.querySelector('[role="dialog"]')).toBeNull();
		expect(slot('drawer-popup')?.closest('[data-base-ui-portal]')?.parentElement).toBe(
			document.body,
		);
	});
});

describe('Drawer width', () => {
	it('defaults to base', async () => {
		await renderOpenDrawer();

		expect(screen.getByRole('dialog')).toHaveAttribute('data-width', 'base');
	});

	it.each<DrawerWidthType>(['narrow', 'base', 'wide', 'extra-wide', 'entity'])(
		'writes data-width %s on the panel',
		async (width) => {
			await renderOpenDrawer({ width });

			expect(screen.getByRole('dialog')).toHaveAttribute('data-width', width);
		},
	);
});

describe('Drawer forwarded props', () => {
	it('lands id, aria-* and data-* on the panel', async () => {
		render(
			<Drawer
				type="task"
				stack="overlay"
				open
				onClose={() => {}}
				title="Edit member"
				id="edit-member"
				aria-busy
				data-area="members"
			>
				Body
			</Drawer>,
		);
		const panel = await screen.findByRole('dialog');

		expect(panel).toHaveAttribute('id', 'edit-member');
		expect(panel).toHaveAttribute('aria-busy', 'true');
		expect(panel).toHaveAttribute('data-area', 'members');
	});

	it('does not forward a className', async () => {
		const unchecked: Record<string, unknown> = { className: 'scope-a' };
		await renderOpenDrawer(unchecked);

		const panel = screen.getByRole('dialog');

		expect(panel).not.toHaveClass('scope-a');
		expect(panel.className).not.toBe('');
	});

	it('does not forward a style', async () => {
		const unchecked: Record<string, unknown> = { style: { zIndex: 1100, color: 'red' } };
		await renderOpenDrawer(unchecked);

		const panel = screen.getByRole('dialog');

		expect(panel).not.toHaveAttribute('style', expect.stringContaining('1100'));
		expect(panel.style.color).toBe('');
	});

	it('does not let the call site take the slot, the type or the modal state of a task', async () => {
		render(
			<Drawer
				type="task"
				stack="overlay"
				open
				onClose={() => {}}
				title="Edit member"
				data-slot="mine"
				data-type="inspector"
				aria-modal={false}
			>
				Body
			</Drawer>,
		);
		const panel = await screen.findByRole('dialog');

		expect(panel).toHaveAttribute('data-slot', 'drawer-popup');
		expect(panel).toHaveAttribute('data-type', 'task');
		expect(panel).toHaveAttribute('aria-modal', 'true');
	});

	it('does not let the call site make an inspector modal', async () => {
		render(
			<Drawer
				type="inspector"
				stack="overlay"
				open
				onClose={() => {}}
				title="Span details"
				data-slot="mine"
				data-type="task"
				aria-modal
			>
				Body
			</Drawer>,
		);
		const panel = await screen.findByRole('dialog');

		expect(panel).toHaveAttribute('data-slot', 'drawer-popup');
		expect(panel).toHaveAttribute('data-type', 'inspector');
		expect(panel).not.toHaveAttribute('aria-modal');
	});

	it('does not let the call site take the width, the loading state or the test id', async () => {
		render(
			<Drawer
				type="task"
				stack="overlay"
				open
				onClose={() => {}}
				title="Edit member"
				width="narrow"
				testId="member"
				data-width="entity"
				data-loading
				data-testid="mine"
			>
				Body
			</Drawer>,
		);
		const panel = await screen.findByRole('dialog');

		expect(panel).toHaveAttribute('data-width', 'narrow');
		expect(panel).not.toHaveAttribute('data-loading');
		expect(panel).toHaveAttribute('data-testid', 'member');
	});
});
