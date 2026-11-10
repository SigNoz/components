import { render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { userEvent as browserUser } from 'vitest/browser';
import { Combobox } from '../../combobox/index.js';
import { Dropdown } from '../../dropdown/index.js';
import { RadioGroup } from '../../radio-group/index.js';
import { Select } from '../../select/index.js';
import { Tabs } from '../../tabs/index.js';
import { Drawer } from '../drawer.js';
import type { DrawerCloseReasonType, DrawerTypeType } from '../types.js';
import { drawerPanel, waitForSettled } from './drawer.test-utils.js';

const TYPES: DrawerTypeType[] = ['task', 'inspector'];

// The keys Base UI stops at the popup of a dialog or a drawer, so a composite the popup is
// declared in does not move its roving focus.
const PAGE_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'] as const;
const OTHER_KEYS = ['PageDown', 'Enter', 'a'] as const;

const FRAMEWORKS = [
	{ type: 'item', value: 'react', label: 'React' },
	{ type: 'item', value: 'vue', label: 'Vue' },
	{ type: 'item', value: 'angular', label: 'Angular' },
] as const;

const ACTIONS = [
	{ type: 'item', value: 'rename', label: 'Rename' },
	{ type: 'item', value: 'duplicate', label: 'Duplicate' },
	{ type: 'item', value: 'delete', label: 'Delete' },
] as const;

type DocumentKeys = {
	bubbled: KeyboardEvent[];
	captured: KeyboardEvent[];
};

let stopListening: (() => void) | undefined;

/**
 * Listens for `keydown` on `document`, the way an app shortcut does: once in the bubble phase
 * and once in the capture phase, which no `stopPropagation` below the document can skip.
 */
function listenOnDocument(): DocumentKeys {
	const keys: DocumentKeys = { bubbled: [], captured: [] };
	const onBubble = (event: KeyboardEvent): void => {
		keys.bubbled.push(event);
	};
	const onCapture = (event: KeyboardEvent): void => {
		keys.captured.push(event);
	};

	document.addEventListener('keydown', onBubble);
	document.addEventListener('keydown', onCapture, true);
	stopListening = () => {
		document.removeEventListener('keydown', onBubble);
		document.removeEventListener('keydown', onCapture, true);
	};

	return keys;
}

afterEach(() => {
	stopListening?.();
	stopListening = undefined;
});

/**
 * The keys a page shortcut would act on: those that reached `document` and that no widget under
 * it handled.
 */
function unhandled(keys: DocumentKeys): string[] {
	return keys.bubbled.filter((event) => !event.defaultPrevented).map((event) => event.key);
}

async function press(key: string): Promise<void> {
	await browserUser.keyboard(key.length === 1 ? key : `{${key}}`);
}

type OpenOptions = {
	type: DrawerTypeType;
	children?: ReactNode;
	onClose?: (reason: DrawerCloseReasonType) => void;
};

/**
 * Opens the drawer and waits for the panel to take the focus and settle.
 */
async function openDrawer({
	type,
	children = <input aria-label="Name" />,
	onClose = () => {},
}: OpenOptions): Promise<void> {
	render(
		type === 'task' ? (
			<Drawer
				type="task"
				stack="overlay"
				open
				title="Edit member"
				onClose={onClose}
				testId="drawer"
			>
				{children}
			</Drawer>
		) : (
			<Drawer
				type="inspector"
				stack="overlay"
				open
				title="Edit member"
				onClose={onClose}
				testId="drawer"
			>
				{children}
			</Drawer>
		),
	);
	await waitFor(() => {
		expect(drawerPanel().contains(document.activeElement)).toBe(true);
	});
	await waitForSettled();
}

describe('Drawer arrow keys', () => {
	it.each(PAGE_KEYS)('an inspector lets %s reach the page', async (key) => {
		await openDrawer({ type: 'inspector' });
		const keys = listenOnDocument();

		await press(key);

		expect(keys.bubbled.map((event) => event.key)).toEqual([key]);
		expect(drawerPanel().contains(keys.bubbled[0]?.target as Node)).toBe(true);
	});

	it('an inspector lets the key through from a control inside the panel', async () => {
		await openDrawer({ type: 'inspector', children: <button type="button">Action</button> });
		screen.getByRole('button', { name: 'Action' }).focus();
		const keys = listenOnDocument();

		await press('ArrowDown');

		expect(keys.bubbled.map((event) => event.key)).toEqual(['ArrowDown']);
	});

	it.each(PAGE_KEYS)('a task keeps %s inside the panel', async (key) => {
		await openDrawer({ type: 'task' });
		const keys = listenOnDocument();

		await press(key);

		expect(keys.captured.map((event) => event.key)).toEqual([key]);
		expect(keys.bubbled).toEqual([]);
	});

	it.each(TYPES)('a %s lets the other keys reach the page', async (type) => {
		await openDrawer({ type });
		const keys = listenOnDocument();

		for (const key of OTHER_KEYS) {
			await press(key);
		}

		expect(keys.bubbled.map((event) => event.key)).toEqual([...OTHER_KEYS]);
	});

	it('an inspector still closes on Esc', async () => {
		const onClose = vi.fn();
		await openDrawer({ type: 'inspector', onClose });

		await press('Escape');

		await waitFor(() => {
			expect(onClose).toHaveBeenCalledWith('escape-key');
		});
	});
});

describe('Drawer arrow keys with a widget inside an inspector', () => {
	it('keeps the keys an open Select list handles', async () => {
		const onChange = vi.fn();
		await openDrawer({
			type: 'inspector',
			children: (
				<Select
					aria-label="Framework"
					placeholder="Pick"
					items={[...FRAMEWORKS]}
					onChange={onChange}
				/>
			),
		});
		await browserUser.click(screen.getByRole('combobox', { name: 'Framework' }));
		await screen.findByRole('listbox');
		const keys = listenOnDocument();

		await press('ArrowDown');
		await press('ArrowDown');
		await press('Enter');

		await waitFor(() => {
			expect(onChange).toHaveBeenCalledWith('vue');
		});
		expect(unhandled(keys)).toEqual([]);
	});

	it('keeps the keys an open Combobox list handles', async () => {
		const onChange = vi.fn();
		await openDrawer({
			type: 'inspector',
			children: (
				<Combobox
					aria-label="Framework"
					placeholder="Pick"
					searchInputProps={{ placeholder: 'Search' }}
					items={[...FRAMEWORKS]}
					onChange={onChange}
				/>
			),
		});
		await browserUser.click(screen.getByRole('combobox', { name: 'Framework' }));
		await screen.findByRole('listbox');
		await waitFor(() => {
			expect(screen.getByRole('combobox', { name: 'Search' })).toHaveFocus();
		});
		const keys = listenOnDocument();

		await press('ArrowDown');
		await press('ArrowDown');
		await press('Enter');

		await waitFor(() => {
			expect(onChange).toHaveBeenCalledWith('vue');
		});
		expect(unhandled(keys)).toEqual([]);
	});

	it('keeps the keys an open Dropdown menu handles', async () => {
		await openDrawer({
			type: 'inspector',
			children: (
				<Dropdown nativeButton side="bottom" align="start" items={[...ACTIONS]}>
					<button type="button">Actions</button>
				</Dropdown>
			),
		});
		await browserUser.click(screen.getByRole('button', { name: 'Actions' }));
		await screen.findByRole('menu');
		const keys = listenOnDocument();

		await press('ArrowDown');
		await waitFor(() => {
			expect(screen.getByRole('menuitem', { name: 'Rename' })).toHaveFocus();
		});
		await press('End');
		await waitFor(() => {
			expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();
		});
		await press('Home');
		await waitFor(() => {
			expect(screen.getByRole('menuitem', { name: 'Rename' })).toHaveFocus();
		});
		expect(unhandled(keys)).toEqual([]);
	});

	it('keeps the keys a RadioGroup moves its selection with', async () => {
		await openDrawer({
			type: 'inspector',
			children: (
				<RadioGroup
					aria-label="Environment"
					defaultValue="staging"
					items={[
						{ label: 'Staging', value: 'staging' },
						{ label: 'Production', value: 'production' },
					]}
				/>
			),
		});
		screen.getByRole('radio', { name: 'Staging' }).focus();
		const keys = listenOnDocument();

		await press('ArrowDown');

		await waitFor(() => {
			expect(screen.getByRole('radio', { name: 'Production' })).toHaveFocus();
		});
		expect(unhandled(keys)).toEqual([]);
	});

	it('keeps the keys a Tabs list moves its focus with', async () => {
		await openDrawer({
			type: 'inspector',
			children: (
				<Tabs
					variant="primary"
					orientation="horizontal"
					alignment="start"
					items={[
						{ key: 'overview', label: 'Overview', children: 'Overview content' },
						{ key: 'settings', label: 'Settings', children: 'Settings content' },
						{ key: 'logs', label: 'Logs', children: 'Logs content' },
					]}
				/>
			),
		});
		screen.getByRole('tab', { name: 'Overview' }).focus();
		const keys = listenOnDocument();

		await press('ArrowRight');
		await waitFor(() => {
			expect(screen.getByRole('tab', { name: 'Settings' })).toHaveFocus();
		});
		await press('End');
		await waitFor(() => {
			expect(screen.getByRole('tab', { name: 'Logs' })).toHaveFocus();
		});
		await press('Home');
		await waitFor(() => {
			expect(screen.getByRole('tab', { name: 'Overview' })).toHaveFocus();
		});
		expect(unhandled(keys)).toEqual([]);
	});

	it('leaves a text field its caret keys, and the page reads them unhandled', async () => {
		await openDrawer({
			type: 'inspector',
			children: <input aria-label="Name" defaultValue="abc" />,
		});
		const field = screen.getByRole('textbox', { name: 'Name' }) as HTMLInputElement;
		field.focus();
		field.setSelectionRange(1, 1);
		const keys = listenOnDocument();

		await press('End');
		expect(field.selectionStart).toBe(3);
		await press('Home');
		expect(field.selectionStart).toBe(0);
		await press('ArrowRight');
		expect(field.selectionStart).toBe(1);

		expect(unhandled(keys)).toEqual(['End', 'Home', 'ArrowRight']);
	});
});

describe('Drawer arrow keys in nested drawers', () => {
	it('an inspector in a task stays inside the task, which is modal', async () => {
		render(
			<Drawer type="task" stack="overlay" open title="Parent" onClose={() => {}} testId="parent">
				<Drawer
					type="inspector"
					stack="overlay"
					open
					title="Child"
					onClose={() => {}}
					testId="child"
				>
					<button type="button">Inside child</button>
				</Drawer>
			</Drawer>,
		);
		const inside = await screen.findByRole('button', { name: 'Inside child' });
		await waitForSettled();
		inside.focus();
		const keys = listenOnDocument();

		await press('ArrowDown');

		expect(keys.bubbled).toEqual([]);
	});

	it('an inspector in an inspector reaches the page', async () => {
		render(
			<Drawer
				type="inspector"
				stack="overlay"
				open
				title="Parent"
				onClose={() => {}}
				testId="parent"
			>
				<Drawer
					type="inspector"
					stack="overlay"
					open
					title="Child"
					onClose={() => {}}
					testId="child"
				>
					<button type="button">Inside child</button>
				</Drawer>
			</Drawer>,
		);
		const inside = await screen.findByRole('button', { name: 'Inside child' });
		await waitForSettled();
		inside.focus();
		const keys = listenOnDocument();

		await press('ArrowDown');

		expect(keys.bubbled.map((event) => event.key)).toEqual(['ArrowDown']);
	});
});
