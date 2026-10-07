import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Resizable } from '../resizable.js';
import type { ResizableProps } from '../types.js';
import { handle, makeItems, panel, renderResizable, TEST_ID } from './resizable.test-utils.js';

afterEach(() => {
	vi.restoreAllMocks();
});

describe('Resizable parts', () => {
	it('renders a panel per row and a handle between each pair', () => {
		renderResizable({ items: makeItems('a', 'b', 'c') });

		expect(screen.getByTestId(TEST_ID)).toHaveAttribute('data-slot', 'resizable');
		expect(screen.getAllByRole('separator')).toHaveLength(2);
		expect(panel('a')).toHaveAttribute('data-slot', 'resizable-panel');
		expect(panel('c')).toHaveTextContent('c');
		expect(handle('a')).toHaveAttribute('data-slot', 'resizable-handle');
		expect(handle('b')).toBeInTheDocument();
		expect(screen.queryByTestId(`${TEST_ID}-handle-c`)).not.toBeInTheDocument();
	});

	it('puts a grip in every handle, hidden from assistive technology', () => {
		renderResizable({ items: makeItems('a', 'b', 'c') });

		for (const separator of screen.getAllByRole('separator')) {
			const grip = separator.querySelector('[data-slot="resizable-handle-grip"]');

			expect(grip).toHaveAttribute('aria-hidden', 'true');
		}
	});

	it('mirrors orientation on the root', () => {
		const { rerender } = render(
			<Resizable orientation="horizontal" testId="r" items={makeItems('a', 'b')} />,
		);

		expect(screen.getByTestId('r')).toHaveAttribute('data-orientation', 'horizontal');

		rerender(<Resizable orientation="vertical" testId="r" items={makeItems('a', 'b')} />);

		expect(screen.getByTestId('r')).toHaveAttribute('data-orientation', 'vertical');
	});

	it('renders one panel at the full size of the root, with no handle', () => {
		renderResizable({
			items: [{ value: 'only', label: 'Only', defaultSize: '30%', maxSize: '40%', children: 'x' }],
		});

		expect(screen.queryByRole('separator')).not.toBeInTheDocument();
		expect(panel('only').getBoundingClientRect().width).toBe(400);
	});

	it('renders an empty root and warns when there are no items', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

		renderResizable({ items: [] });

		expect(screen.getByTestId(TEST_ID)).toBeEmptyDOMElement();
		expect(warn).toHaveBeenCalledWith('Resizable: `items` is empty, rendering an empty root.');
	});

	it('renders the first of two items with the same value, and warns', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

		renderResizable({
			items: [
				{ value: 'a', label: 'A', children: 'first a' },
				{ value: 'a', label: 'A again', children: 'second a' },
				{ value: 'b', label: 'B', children: 'b' },
			],
		});

		expect(screen.getAllByRole('separator')).toHaveLength(1);
		expect(panel('a')).toHaveTextContent('first a');
		expect(screen.queryByText('second a')).not.toBeInTheDocument();
		expect(warn).toHaveBeenCalledWith(
			'Resizable: two items share a `value`, so only the first of them renders.',
		);
	});

	it('stays quiet in the happy path', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

		renderResizable({});

		expect(warn).not.toHaveBeenCalled();
	});
});

describe('Resizable test IDs', () => {
	it('names the root, each panel and each handle from testId', () => {
		renderResizable({ items: makeItems('preview', 'editor') });

		expect(screen.getByTestId(TEST_ID)).toHaveAttribute('data-slot', 'resizable');
		expect(screen.getByTestId(`${TEST_ID}-panel-preview`)).toHaveTextContent('preview');
		expect(screen.getByTestId(`${TEST_ID}-panel-editor`)).toHaveTextContent('editor');
		expect(screen.getByTestId(`${TEST_ID}-handle-preview`)).toHaveAttribute('role', 'separator');
	});

	it('writes no test ID without testId', () => {
		const { container } = render(
			<Resizable orientation="horizontal" id="split" items={makeItems('a', 'b')} />,
		);

		expect(container.querySelector('[data-slot="resizable"]')).not.toHaveAttribute('data-testid');
		expect(screen.getByRole('separator')).not.toHaveAttribute('data-testid');
		expect(container.querySelector('[data-slot="resizable-panel"]')).not.toHaveAttribute(
			'data-testid',
		);
		expect(container.querySelector('[data-panel]')).not.toHaveAttribute('data-testid');
	});

	it('names only the box that scrolls after a panel', () => {
		renderResizable({ items: makeItems('a', 'b') });

		expect(screen.getAllByTestId(/-panel-a$/)).toEqual([panel('a')]);
	});

	it('follows a change of testId', () => {
		const items = makeItems('a', 'b');
		const { rerender } = render(<Resizable orientation="horizontal" testId="one" items={items} />);

		rerender(<Resizable orientation="horizontal" testId="two" items={items} />);

		expect(screen.getByTestId('two')).toHaveAttribute('data-slot', 'resizable');
		expect(screen.getByTestId('two-handle-a')).toHaveAttribute('role', 'separator');
		expect(screen.queryByTestId('one')).not.toBeInTheDocument();
	});

	it('puts the panel test ID on the box that scrolls', () => {
		renderResizable({
			items: [
				{ value: 'long', label: 'Long', children: <div style={{ width: 2000, height: 2000 }} /> },
				{ value: 'short', label: 'Short', children: 'short' },
			],
		});

		const box = panel('long');
		box.scrollTop = 100;
		box.scrollLeft = 50;

		expect(box.scrollTop).toBe(100);
		expect(box.scrollLeft).toBe(50);
	});
});

describe('Resizable forwarding', () => {
	it('lands id, aria-* and data-* on the root', () => {
		renderResizable({ id: 'layout', 'aria-describedby': 'hint', 'data-area': 'editor' });

		const root = screen.getByTestId(TEST_ID);

		expect(root).toHaveAttribute('id', 'layout');
		expect(root).toHaveAttribute('aria-describedby', 'hint');
		expect(root).toHaveAttribute('data-area', 'editor');
	});

	it('makes the root a group named by aria-label or aria-labelledby, and gives it no role otherwise', () => {
		const { rerender } = render(
			<Resizable orientation="horizontal" aria-label="Editor layout" items={makeItems('a', 'b')} />,
		);

		expect(screen.getByRole('group', { name: 'Editor layout' })).toHaveAttribute(
			'data-slot',
			'resizable',
		);

		rerender(
			<>
				<span id="layout-name">Trace layout</span>
				<Resizable
					orientation="horizontal"
					aria-labelledby="layout-name"
					items={makeItems('a', 'b')}
				/>
			</>,
		);

		expect(screen.getByRole('group', { name: 'Trace layout' })).toBeInTheDocument();

		rerender(<Resizable orientation="horizontal" testId="split" items={makeItems('a', 'b')} />);

		expect(screen.getByTestId('split')).not.toHaveAttribute('role');
	});

	it('drops className, style and the props of the old API', () => {
		const onLayoutChanged = vi.fn();
		const props = {
			className: 'stray',
			style: { background: 'red' },
			disabled: true,
			onLayoutChanged,
		} as unknown as Partial<ResizableProps>;

		renderResizable(props);

		const root = screen.getByTestId(TEST_ID);

		expect(root).not.toHaveClass('stray');
		expect(root.style.background).toBe('');
		expect(handle('first')).toHaveAttribute('tabindex', '0');
		expect(onLayoutChanged).not.toHaveBeenCalled();
	});
});

describe('Resizable accessibility', () => {
	it('names each handle after the panel before it and points at that panel', () => {
		renderResizable({ items: makeItems('preview', 'editor', 'settings') });

		const first = screen.getByRole('separator', { name: 'preview panel' });
		const second = screen.getByRole('separator', { name: 'editor panel' });

		expect(first.getAttribute('aria-controls')).toBe(panel('preview').closest('[data-panel]')?.id);
		expect(second.getAttribute('aria-controls')).toBe(panel('editor').closest('[data-panel]')?.id);
	});

	it('reports the size and the limits of the panel before the handle', () => {
		renderResizable({
			items: [
				{
					value: 'a',
					label: 'A',
					defaultSize: '40%',
					minSize: '20%',
					maxSize: '70%',
					children: 'a',
				},
				{ value: 'b', label: 'B', children: 'b' },
			],
		});

		const separator = handle('a');

		expect(separator).toHaveAttribute('aria-valuenow', '40');
		expect(separator).toHaveAttribute('aria-valuemin', '20');
		expect(separator).toHaveAttribute('aria-valuemax', '70');
	});

	// `react-resizable-panels` works out the limits of every handle by moving the first one. Needs a
	// fix upstream.
	it.fails('reports the limits of the panel before a handle after the first', () => {
		renderResizable({
			items: [
				{ value: 'a', label: 'A', defaultSize: '30%', children: 'a' },
				{
					value: 'b',
					label: 'B',
					defaultSize: '30%',
					minSize: '20%',
					maxSize: '40%',
					children: 'b',
				},
				{ value: 'c', label: 'C', children: 'c' },
			],
		});

		const separator = handle('b');

		expect(separator).toHaveAttribute('aria-valuenow', '30');
		expect(separator).toHaveAttribute('aria-valuemin', '20');
		expect(separator).toHaveAttribute('aria-valuemax', '40');
	});

	it('gives the line the other direction as its orientation', () => {
		const { rerender } = render(<Resizable orientation="horizontal" items={makeItems('a', 'b')} />);

		expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical');

		rerender(<Resizable orientation="vertical" items={makeItems('a', 'b')} />);

		expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'horizontal');
	});

	it('keeps DOM IDs unique when two roots share panel values', () => {
		render(
			<>
				<Resizable orientation="horizontal" items={makeItems('preview', 'editor')} />
				<Resizable orientation="horizontal" items={makeItems('preview', 'editor')} />
			</>,
		);

		const ids = [...document.querySelectorAll('[data-panel], [data-separator]')].map((el) => el.id);

		expect(new Set(ids).size).toBe(ids.length);
		expect(ids).not.toContain('preview');
	});

	it('keeps a value with whitespace out of the IDs, so aria-controls names one panel', () => {
		renderResizable({ items: makeItems('span tree', 'timeline') });

		const controls = handle('span tree').getAttribute('aria-controls') ?? '';

		expect(controls).not.toMatch(/\s/);
		expect(controls).toBe(panel('span tree').closest('[data-panel]')?.id);
	});

	it('renders values with lone surrogates, and keeps their IDs apart', () => {
		renderResizable({ items: makeItems('a\uD83D', 'a\uD83E', 'b') });

		expect(screen.getAllByRole('separator')).toHaveLength(2);
		expect(handle('a\uD83D').id).not.toBe(handle('a\uD83E').id);
		expect(handle('a\uD83D').getAttribute('aria-controls')).toBe(
			panel('a\uD83D').closest('[data-panel]')?.id,
		);
	});

	it.each([
		['empty', ''],
		['blank', '   '],
		// From a caller with no types.
		['missing', undefined as unknown as string],
	])('warns about a panel with a %s label and leaves its handle unnamed', (_case, label) => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

		renderResizable({
			items: [
				{ value: 'a', label, children: 'a' },
				{ value: 'b', label: 'B', children: 'b' },
			],
		});

		expect(handle('a')).not.toHaveAttribute('aria-label');
		expect(warn).toHaveBeenCalledWith(
			'Resizable: a panel has an empty `label`, so the handle after it has no name.',
		);
	});

	it('does not warn about an empty label on the last panel, which has no handle', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

		renderResizable({
			items: [
				{ value: 'a', label: 'A', children: 'a' },
				{ value: 'b', label: '', children: 'b' },
			],
		});

		expect(warn).not.toHaveBeenCalled();
	});
});
