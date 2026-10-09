import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { hydrateRoot, type Root } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Resizable } from '../resizable.js';
import type { ResizableItemType, ResizableProps } from '../types.js';
import {
	doubleClick,
	drag,
	Frame,
	handle,
	makeItems,
	memoryStorage,
	panelHeight,
	panelWidth,
	releasePointer,
	renderResizable,
	sizeOf,
} from './resizable.test-utils.js';

afterEach(() => {
	releasePointer();
	vi.restoreAllMocks();
	localStorage.clear();
});

// The 1px handle takes one pixel of the root, so the panels share 400px and 1% is 4px.
const ROOT = { width: 401, height: 200 };

const ITEMS: ResizableItemType[] = [
	{ value: 'a', label: 'A', defaultSize: '50%', minSize: '20%', maxSize: '70%', children: 'a' },
	{ value: 'b', label: 'B', children: 'b' },
];

const FIXED: ResizableItemType[] = [
	{ value: 'tree', label: 'Tree', defaultSize: '100px', minSize: '40px', children: 'tree' },
	{ value: 'rest', label: 'Rest', children: 'rest' },
];

function saved(storage: ReturnType<typeof memoryStorage>, key: string) {
	const raw = storage.entries.get(key);

	return raw === undefined ? undefined : JSON.parse(raw);
}

function Harness(props: Partial<ResizableProps> & { items: ResizableItemType[] }) {
	return (
		<Frame {...ROOT}>
			<Resizable testId="split" orientation="horizontal" {...props} />
		</Frame>
	);
}

function Hideable({
	hidden,
	...props
}: Partial<ResizableProps> & { items: ResizableItemType[]; hidden: boolean }) {
	return (
		<div data-testid="hideable" style={{ display: hidden ? 'none' : 'block' }}>
			<Harness {...props} />
		</div>
	);
}

/**
 * The key a layout of `values` is saved under.
 */
function keyOf(storageKey: string, values: string[], orientation = 'horizontal') {
	return [encodeURIComponent(storageKey), orientation, ...values.map(encodeURIComponent)].join(':');
}

describe('Resizable saving the layout', () => {
	it('saves nothing on mount', () => {
		const storage = memoryStorage();

		renderResizable({ items: ITEMS, storageKey: 'editor', storage }, ROOT);

		expect(storage.entries.size).toBe(0);
	});

	it('saves the panel sizes in pixels after a key press, keyed by the panel values', async () => {
		const storage = memoryStorage();

		renderResizable({ items: ITEMS, storageKey: 'editor', storage }, ROOT);
		handle('a').focus();
		await userEvent.keyboard('{ArrowRight}');

		expect(saved(storage, keyOf('editor', ['a', 'b']))).toEqual({ a: 220, b: 180 });
	});

	it('saves when a drag ends, not on every move', () => {
		const storage = memoryStorage();

		renderResizable({ items: ITEMS, storageKey: 'editor', storage }, ROOT);
		drag(handle('a'), 40, 0, { release: false });

		expect(storage.entries.size).toBe(0);

		releasePointer();

		expect(saved(storage, keyOf('editor', ['a', 'b']))).toEqual({ a: 240, b: 160 });
	});

	it('saves after a double-click reset', async () => {
		const storage = memoryStorage();

		renderResizable({ items: ITEMS, storageKey: 'editor', storage }, ROOT);
		handle('a').focus();
		await userEvent.keyboard('{ArrowRight}');
		doubleClick(handle('a'));

		expect(saved(storage, keyOf('editor', ['a', 'b']))).toEqual({ a: 200, b: 200 });
	});

	it('saves a double-click reset in the band around the line, off the line itself', async () => {
		const storage = memoryStorage();

		renderResizable({ items: ITEMS, storageKey: 'editor', storage }, ROOT);
		handle('a').focus();
		await userEvent.keyboard('{ArrowRight}');
		doubleClick(handle('a'), 3);

		expect(sizeOf(handle('a'))).toBe(50);
		expect(saved(storage, keyOf('editor', ['a', 'b']))).toEqual({ a: 200, b: 200 });
	});

	it('saves a double-click reset on the part of the band outside the root', () => {
		const storage = memoryStorage();
		const items: ResizableItemType[] = [
			{ value: 'a', label: 'A', defaultSize: '50%', children: 'a' },
			{ value: 'b', label: 'B', children: 'b' },
		];

		render(
			<div style={{ padding: 20 }}>
				<Harness items={items} storageKey="editor" storage={storage} />
			</div>,
		);
		// The first panel at 0 puts the line on the left edge of the root.
		drag(handle('a'), -300, 0);

		expect(saved(storage, keyOf('editor', ['a', 'b']))).toEqual({ a: 0, b: 400 });

		doubleClick(handle('a'), -3);

		expect(sizeOf(handle('a'))).toBe(50);
		expect(saved(storage, keyOf('editor', ['a', 'b']))).toEqual({ a: 200, b: 200 });
	});

	it('saves nothing when the root changes size after a double-click', async () => {
		const storage = memoryStorage();
		const harness = (width: number) => (
			<Frame width={width} height={200}>
				<Resizable
					testId="split"
					orientation="horizontal"
					items={FIXED}
					storageKey="editor"
					storage={storage}
				/>
			</Frame>
		);
		const { rerender } = render(harness(401));

		handle('tree').focus();
		await userEvent.keyboard('{ArrowRight}');
		doubleClick(handle('tree'));

		expect(saved(storage, keyOf('editor', ['tree', 'rest']))).toEqual({ tree: 100, rest: 300 });

		rerender(harness(301));

		await waitFor(() => {
			expect(panelWidth('rest')).toBeCloseTo(200, 0);
		});
		expect(saved(storage, keyOf('editor', ['tree', 'rest']))).toEqual({ tree: 100, rest: 300 });
	});

	it('saves nothing when the root changes size after a double-click a document listener stops', async () => {
		const storage = memoryStorage();
		const harness = (width: number) => (
			<Frame width={width} height={200}>
				<Resizable
					testId="split"
					orientation="horizontal"
					items={FIXED}
					storageKey="editor"
					storage={storage}
				/>
			</Frame>
		);
		const { rerender } = render(harness(401));
		// Runs after the listener of the library, which is on the same node, and keeps the
		// double-click from `<html>`.
		const stop = (event: Event) => event.stopPropagation();

		handle('tree').focus();
		await userEvent.keyboard('{ArrowRight}');
		document.addEventListener('dblclick', stop, true);

		try {
			doubleClick(handle('tree'));
		} finally {
			document.removeEventListener('dblclick', stop, true);
		}

		expect(saved(storage, keyOf('editor', ['tree', 'rest']))).toEqual({ tree: 100, rest: 300 });

		rerender(harness(301));

		await waitFor(() => {
			expect(panelWidth('rest')).toBeCloseTo(200, 0);
		});
		expect(saved(storage, keyOf('editor', ['tree', 'rest']))).toEqual({ tree: 100, rest: 300 });
	});

	it('saves nothing on a double-click the content of a panel handles itself', () => {
		const storage = memoryStorage();

		renderResizable(
			{
				items: [
					{
						...ITEMS[0],
						children: (
							<div data-testid="editor" onDoubleClick={(event) => event.preventDefault()} />
						),
					},
					ITEMS[1],
				],
				storageKey: 'editor',
				storage,
			},
			ROOT,
		);

		act(() => {
			screen
				.getByTestId('editor')
				.dispatchEvent(new MouseEvent('dblclick', { bubbles: true, cancelable: true }));
		});

		expect(storage.entries.size).toBe(0);
	});

	it('saves nothing while the root has no room for its handles', async () => {
		const storage = memoryStorage();
		const { rerender } = render(
			<Frame width={401} height={200}>
				<Resizable
					testId="split"
					orientation="horizontal"
					items={makeItems('a', 'b', 'c')}
					storageKey="editor"
					storage={storage}
				/>
			</Frame>,
		);

		handle('a').focus();
		rerender(
			<Frame width={1} height={200}>
				<Resizable
					testId="split"
					orientation="horizontal"
					items={makeItems('a', 'b', 'c')}
					storageKey="editor"
					storage={storage}
				/>
			</Frame>,
		);
		await userEvent.keyboard('{ArrowRight}');

		expect(storage.entries.size).toBe(0);
	});

	it('saves a panel whose value is __proto__, and restores it', async () => {
		const storage = memoryStorage();
		const items = makeItems('__proto__', 'b');
		const { unmount } = render(<Harness items={items} storageKey="editor" storage={storage} />);

		handle('__proto__').focus();
		await userEvent.keyboard('{ArrowRight}');
		unmount();

		expect(saved(storage, keyOf('editor', ['__proto__', 'b']))).toEqual(
			JSON.parse('{"__proto__": 220, "b": 180}'),
		);

		render(<Harness items={items} storageKey="editor" storage={storage} />);

		expect(sizeOf(handle('__proto__'))).toBe(55);
	});

	it('saves and restores a panel whose value holds a lone surrogate', async () => {
		const storage = memoryStorage();
		const items = makeItems('a\uD83D', 'b');
		const { unmount } = render(<Harness items={items} storageKey="editor" storage={storage} />);

		handle('a\uD83D').focus();
		await userEvent.keyboard('{ArrowRight}');
		unmount();
		render(<Harness items={items} storageKey="editor" storage={storage} />);

		expect(sizeOf(handle('a\uD83D'))).toBe(55);
	});

	it('uses localStorage by default', async () => {
		renderResizable({ items: ITEMS, storageKey: 'editor' }, ROOT);
		handle('a').focus();
		await userEvent.keyboard('{ArrowLeft}');

		expect(JSON.parse(localStorage.getItem(keyOf('editor', ['a', 'b'])) ?? 'null')).toEqual({
			a: 180,
			b: 220,
		});
	});

	it('reads and writes nothing without storageKey', async () => {
		const storage = { getItem: vi.fn(() => null), setItem: vi.fn() };

		renderResizable({ items: ITEMS, storage });
		handle('a').focus();
		await userEvent.keyboard('{ArrowRight}');

		expect(storage.getItem).not.toHaveBeenCalled();
		expect(storage.setItem).not.toHaveBeenCalled();
	});

	it('keeps two sets of panels apart when a value holds the separator of the key', async () => {
		const storage = memoryStorage();

		render(
			<>
				<Harness items={makeItems('a', 'b:c')} storageKey="editor" storage={storage} />
				<Harness items={makeItems('a:b', 'c')} storageKey="editor" storage={storage} />
			</>,
		);
		handle('a').focus();
		await userEvent.keyboard('{ArrowRight}');
		handle('a:b').focus();
		await userEvent.keyboard('{ArrowLeft}');

		expect(saved(storage, keyOf('editor', ['a', 'b:c']))).toEqual({ a: 220, 'b:c': 180 });
		expect(saved(storage, keyOf('editor', ['a:b', 'c']))).toEqual({ 'a:b': 180, c: 220 });
	});

	it('keeps two storageKeys apart when one holds the separator of the key', async () => {
		const storage = memoryStorage();
		const one = (
			<Harness
				testId="one"
				items={makeItems('x', 'y')}
				storageKey="panel:horizontal"
				storage={storage}
			/>
		);
		const two = (
			<Harness
				testId="two"
				items={makeItems('horizontal', 'x', 'y')}
				storageKey="panel"
				storage={storage}
			/>
		);
		const { unmount } = render(
			<>
				{one}
				{two}
			</>,
		);

		screen.getByTestId('one-handle-x').focus();
		await userEvent.keyboard('{ArrowRight}');
		screen.getByTestId('two-handle-horizontal').focus();
		await userEvent.keyboard('{ArrowLeft}');
		unmount();
		render(one);

		expect(sizeOf(screen.getByTestId('one-handle-x'))).toBe(55);
	});

	it('keeps one saved layout per orientation', async () => {
		const storage = memoryStorage();
		const horizontal = (
			<Harness items={FIXED} orientation="horizontal" storageKey="editor" storage={storage} />
		);
		const vertical = (
			<Harness items={FIXED} orientation="vertical" storageKey="editor" storage={storage} />
		);
		const first = render(horizontal);

		handle('tree').focus();
		await userEvent.keyboard('{ArrowRight}');

		expect(panelWidth('tree')).toBeCloseTo(120, 0);

		first.unmount();
		const second = render(vertical);

		// The 120px saved as a width is not a height.
		expect(panelHeight('tree')).toBeCloseTo(100, 0);

		handle('tree').focus();
		await userEvent.keyboard('{ArrowDown}');
		const height = panelHeight('tree');
		second.unmount();
		render(horizontal);

		expect(panelWidth('tree')).toBeCloseTo(120, 0);

		cleanup();
		render(vertical);

		expect(panelHeight('tree')).toBeCloseTo(height, 0);
	});
});

describe('Resizable restoring the layout', () => {
	it('starts from the saved layout on the next mount', () => {
		const storage = memoryStorage({
			[keyOf('editor', ['a', 'b'])]: JSON.stringify({ a: 140, b: 260 }),
		});

		renderResizable({ items: ITEMS, storageKey: 'editor', storage }, ROOT);

		expect(sizeOf(handle('a'))).toBe(35);
	});

	it('keeps a saved layout within the current limits', () => {
		const storage = memoryStorage({
			[keyOf('editor', ['a', 'b'])]: JSON.stringify({ a: 360, b: 40 }),
		});

		renderResizable({ items: ITEMS, storageKey: 'editor', storage }, ROOT);

		expect(sizeOf(handle('a'))).toBe(70);
	});

	it('gives a panel in px its pixels back in a root of another size, and the rest to the others', () => {
		// Saved in a root whose panels shared 400px.
		const storage = memoryStorage({
			[keyOf('editor', ['tree', 'rest'])]: JSON.stringify({ tree: 160, rest: 240 }),
		});

		renderResizable({ items: FIXED, storageKey: 'editor', storage }, { width: 301, height: 200 });

		expect(panelWidth('tree')).toBeCloseTo(160, 0);
		expect(panelWidth('rest')).toBeCloseTo(140, 0);
	});

	it('gives the panels sized in % their saved shares in a root of another size', () => {
		const storage = memoryStorage({
			[keyOf('editor', ['a', 'b'])]: JSON.stringify({ a: 240, b: 160 }),
		});

		renderResizable({ items: ITEMS, storageKey: 'editor', storage }, { width: 201, height: 200 });

		expect(sizeOf(handle('a'))).toBe(60);
	});

	it.each([
		['does not parse', '{not json'],
		['is not an object', '42'],
		['misses a panel', JSON.stringify({ a: 120 })],
		['holds something other than a number', JSON.stringify({ a: '120', b: 280 })],
		['holds a negative size', JSON.stringify({ a: -120, b: 520 })],
	])('falls back to the defaultSizes when the saved layout %s', (_case, raw) => {
		const storage = memoryStorage({ [keyOf('editor', ['a', 'b'])]: raw });

		renderResizable({ items: ITEMS, storageKey: 'editor', storage }, ROOT);

		expect(sizeOf(handle('a'))).toBe(50);
	});

	it('does not break the page when the storage throws', async () => {
		const storage = {
			getItem: () => {
				throw new Error('blocked');
			},
			setItem: () => {
				throw new Error('blocked');
			},
		};

		renderResizable({ items: ITEMS, storageKey: 'editor', storage }, ROOT);
		handle('a').focus();
		await userEvent.keyboard('{ArrowRight}');

		expect(sizeOf(handle('a'))).toBe(55);
	});

	it('reads the storage once per key, not on every render', () => {
		const storage = memoryStorage({
			[keyOf('editor', ['a', 'b'])]: JSON.stringify({ a: 140, b: 260 }),
		});
		const getItem = vi.spyOn(storage, 'getItem');
		const { rerender } = render(
			<Harness items={[...ITEMS]} storageKey="editor" storage={storage} />,
		);

		rerender(<Harness items={[...ITEMS]} storageKey="editor" storage={storage} />);
		rerender(<Harness items={[...ITEMS]} storageKey="editor" storage={storage} />);

		expect(getItem).toHaveBeenCalledTimes(1);
		expect(sizeOf(handle('a'))).toBe(35);
	});

	it('applies the layout saved under a new storageKey, and saves there from then on', async () => {
		const storage = memoryStorage({
			[keyOf('trace-1', ['a', 'b'])]: JSON.stringify({ a: 120, b: 280 }),
			[keyOf('trace-2', ['a', 'b'])]: JSON.stringify({ a: 240, b: 160 }),
		});
		const { rerender } = render(<Harness items={ITEMS} storageKey="trace-1" storage={storage} />);

		expect(sizeOf(handle('a'))).toBe(30);

		rerender(<Harness items={ITEMS} storageKey="trace-2" storage={storage} />);

		expect(sizeOf(handle('a'))).toBe(60);

		handle('a').focus();
		await userEvent.keyboard('{ArrowRight}');

		expect(saved(storage, keyOf('trace-2', ['a', 'b']))).toEqual({ a: 260, b: 140 });
		expect(saved(storage, keyOf('trace-1', ['a', 'b']))).toEqual({ a: 120, b: 280 });
	});

	it('leaves the panels where they are under a new storageKey with nothing saved', () => {
		const storage = memoryStorage({
			[keyOf('trace-1', ['a', 'b'])]: JSON.stringify({ a: 120, b: 280 }),
		});
		const { rerender } = render(<Harness items={ITEMS} storageKey="trace-1" storage={storage} />);

		rerender(<Harness items={ITEMS} storageKey="trace-2" storage={storage} />);

		expect(sizeOf(handle('a'))).toBe(30);
		expect(storage.entries.has(keyOf('trace-2', ['a', 'b']))).toBe(false);
	});

	it('applies the layout of a storageKey set while the root is hidden once it shows', async () => {
		const storage = memoryStorage({
			[keyOf('trace-1', ['a', 'b'])]: JSON.stringify({ a: 120, b: 280 }),
			[keyOf('trace-2', ['a', 'b'])]: JSON.stringify({ a: 240, b: 160 }),
		});
		const props = { items: ITEMS, storage };
		const { rerender } = render(<Hideable {...props} hidden={false} storageKey="trace-1" />);

		expect(sizeOf(handle('a'))).toBe(30);

		rerender(<Hideable {...props} hidden storageKey="trace-1" />);
		rerender(<Hideable {...props} hidden storageKey="trace-2" />);
		// Shown with no render of the component, as a tab or a collapsed section would show it.
		act(() => {
			screen.getByTestId('hideable').style.display = 'block';
		});

		await waitFor(() => {
			expect(sizeOf(handle('a'))).toBe(60);
		});

		handle('a').focus();
		await userEvent.keyboard('{ArrowRight}');

		expect(saved(storage, keyOf('trace-2', ['a', 'b']))).toEqual({ a: 260, b: 140 });
	});

	it('creates no observer per render while a saved layout waits for a hidden root', async () => {
		const storage = memoryStorage({
			[keyOf('trace-1', ['a', 'b'])]: JSON.stringify({ a: 120, b: 280 }),
			[keyOf('trace-2', ['a', 'b'])]: JSON.stringify({ a: 240, b: 160 }),
		});
		const { rerender } = render(
			<Hideable items={[...ITEMS]} storage={storage} hidden={false} storageKey="trace-1" />,
		);

		rerender(<Hideable items={[...ITEMS]} storage={storage} hidden storageKey="trace-1" />);
		rerender(<Hideable items={[...ITEMS]} storage={storage} hidden storageKey="trace-2" />);

		const Original = window.ResizeObserver;
		let created = 0;

		window.ResizeObserver = class extends Original {
			constructor(callback: ResizeObserverCallback) {
				super(callback);
				created++;
			}
		};

		try {
			for (let count = 0; count < 5; count++) {
				rerender(<Hideable items={[...ITEMS]} storage={storage} hidden storageKey="trace-2" />);
			}
		} finally {
			window.ResizeObserver = Original;
		}

		expect(created).toBe(0);

		act(() => {
			screen.getByTestId('hideable').style.display = 'block';
		});

		await waitFor(() => {
			expect(sizeOf(handle('a'))).toBe(60);
		});
	});

	it('applies the layout saved for the panels in their new order', () => {
		const storage = memoryStorage({
			[keyOf('editor', ['b', 'a'])]: JSON.stringify({ b: 120, a: 280 }),
		});
		const { rerender } = render(
			<Harness items={makeItems('a', 'b')} storageKey="editor" storage={storage} />,
		);

		expect(sizeOf(handle('a'))).toBe(50);

		rerender(<Harness items={makeItems('b', 'a')} storageKey="editor" storage={storage} />);

		expect(panelWidth('b')).toBeCloseTo(120, 0);
	});

	it('restores the layout in a right-to-left page', () => {
		const storage = memoryStorage({
			[keyOf('editor', ['a', 'b'])]: JSON.stringify({ a: 120, b: 280 }),
		});

		render(
			<div dir="rtl">
				<Harness items={ITEMS} storageKey="editor" storage={storage} />
			</div>,
		);

		expect(panelWidth('a')).toBeCloseTo(120, 0);
	});

	it('hydrates server markup with no mismatch, then restores the layout saved in the browser', () => {
		const element = (
			<Frame {...ROOT}>
				<Resizable testId="split" orientation="horizontal" items={ITEMS} storageKey="editor" />
			</Frame>
		);
		// The server has no localStorage of the browser, so it renders the defaultSizes.
		const html = renderToString(element);
		const container = document.createElement('div');

		container.innerHTML = html;
		document.body.append(container);
		localStorage.setItem(keyOf('editor', ['a', 'b']), JSON.stringify({ a: 140, b: 260 }));

		const error = vi.spyOn(console, 'error');
		let root: Root | undefined;

		act(() => {
			root = hydrateRoot(container, element);
		});

		try {
			expect(error).not.toHaveBeenCalled();
			expect(sizeOf(handle('a'))).toBe(35);
		} finally {
			act(() => {
				root?.unmount();
			});
			container.remove();
		}
	});
});

describe('Resizable sets of panels', () => {
	it('keeps one saved layout per set of panel values', () => {
		const storage = memoryStorage({
			[keyOf('editor', ['a', 'b'])]: JSON.stringify({ a: 120, b: 280 }),
			[keyOf('editor', ['a', 'b', 'c'])]: JSON.stringify({ a: 80, b: 120, c: 200 }),
		});
		const { rerender } = render(
			<Harness items={makeItems('a', 'b')} storageKey="editor" storage={storage} />,
		);

		expect(sizeOf(handle('a'))).toBe(30);

		rerender(<Harness items={makeItems('a', 'b', 'c')} storageKey="editor" storage={storage} />);

		expect(sizeOf(handle('a'))).toBe(20);
		expect(sizeOf(handle('b'))).toBe(30);

		rerender(<Harness items={makeItems('a', 'b')} storageKey="editor" storage={storage} />);

		expect(sizeOf(handle('a'))).toBe(30);
	});

	it('gives the panels their sizes back when a panel leaves and comes back, without storageKey', async () => {
		const { rerender } = render(<Harness items={makeItems('a', 'b')} />);

		handle('a').focus();
		await userEvent.keyboard('{ArrowRight}{ArrowRight}');

		expect(sizeOf(handle('a'))).toBe(60);

		rerender(<Harness items={makeItems('a')} />);

		expect(screen.queryByRole('separator')).not.toBeInTheDocument();

		rerender(<Harness items={makeItems('a', 'b')} />);

		expect(sizeOf(handle('a'))).toBe(60);
	});
});
