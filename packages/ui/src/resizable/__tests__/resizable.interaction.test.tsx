import { act, fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { CSSProperties } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Resizable } from '../resizable.js';
import type { ResizableItemType } from '../types.js';
import {
	doubleClick,
	drag,
	Frame,
	handle,
	hover,
	makeItems,
	panelHeight,
	panelWidth,
	releasePointer,
	renderResizable,
	sizeOf,
	TEST_ID,
} from './resizable.test-utils.js';

afterEach(() => {
	releasePointer();
	vi.restoreAllMocks();
});

const BOUNDED: ResizableItemType[] = [
	{ value: 'a', label: 'A', defaultSize: '50%', minSize: '20%', maxSize: '70%', children: 'a' },
	{ value: 'b', label: 'B', children: 'b' },
];

describe('Resizable keyboard', () => {
	it('moves a horizontal handle by 5% with ArrowLeft and ArrowRight', async () => {
		renderResizable({ items: BOUNDED });
		const separator = handle('a');

		separator.focus();
		await userEvent.keyboard('{ArrowRight}');

		expect(sizeOf(separator)).toBe(55);

		await userEvent.keyboard('{ArrowLeft}{ArrowLeft}');

		expect(sizeOf(separator)).toBe(45);
	});

	it('moves a vertical handle with ArrowUp and ArrowDown', async () => {
		renderResizable({ items: BOUNDED, orientation: 'vertical' });
		const separator = handle('a');

		separator.focus();
		await userEvent.keyboard('{ArrowDown}');

		expect(sizeOf(separator)).toBe(55);

		await userEvent.keyboard('{ArrowUp}');

		expect(sizeOf(separator)).toBe(50);
	});

	it('ignores the arrows of the other axis, and keeps them from scrolling the page', () => {
		renderResizable({ items: BOUNDED });
		const separator = handle('a');

		expect(fireEvent.keyDown(separator, { key: 'ArrowUp' })).toBe(false);
		expect(fireEvent.keyDown(separator, { key: 'ArrowDown' })).toBe(false);
		expect(sizeOf(separator)).toBe(50);
	});

	it('moves the handle to the limits with Home and End', async () => {
		renderResizable({ items: BOUNDED });
		const separator = handle('a');

		separator.focus();
		await userEvent.keyboard('{End}');

		expect(sizeOf(separator)).toBe(70);

		await userEvent.keyboard('{Home}');

		expect(sizeOf(separator)).toBe(20);
	});

	it('does nothing on Enter', async () => {
		renderResizable({ items: BOUNDED });
		const separator = handle('a');

		separator.focus();
		await userEvent.keyboard('{Enter}');

		expect(sizeOf(separator)).toBe(50);
	});

	it('cycles the focus through the handles with F6 and Shift+F6', async () => {
		renderResizable({ items: makeItems('a', 'b', 'c') });

		handle('a').focus();
		await userEvent.keyboard('{F6}');

		expect(handle('b')).toHaveFocus();

		await userEvent.keyboard('{F6}');

		expect(handle('a')).toHaveFocus();

		await userEvent.keyboard('{Shift>}{F6}{/Shift}');

		expect(handle('b')).toHaveFocus();
	});

	it('moves the panels on each side of a handle after items change order', () => {
		const { rerender } = render(
			<Frame width={402} height={200}>
				<Resizable testId={TEST_ID} orientation="horizontal" items={makeItems('a', 'b', 'c')} />
			</Frame>,
		);

		rerender(
			<Frame width={402} height={200}>
				<Resizable testId={TEST_ID} orientation="horizontal" items={makeItems('c', 'a', 'b')} />
			</Frame>,
		);
		// Past the panel after it, the handle takes the rest from the next one.
		drag(handle('c'), 300, 0);

		expect(panelWidth('c')).toBeCloseTo(400, 0);
		expect(panelWidth('a')).toBe(0);
		expect(panelWidth('b')).toBe(0);

		drag(handle('a'), -300, 0);

		expect(panelWidth('c')).toBeCloseTo(100, 0);
		expect(panelWidth('b')).toBeCloseTo(300, 0);
	});

	it('cycles the focus through the handles in their new order after items change order', async () => {
		const { rerender } = render(
			<Frame width={400} height={200}>
				<Resizable
					testId={TEST_ID}
					orientation="horizontal"
					items={makeItems('a', 'b', 'c', 'd')}
				/>
			</Frame>,
		);

		rerender(
			<Frame width={400} height={200}>
				<Resizable
					testId={TEST_ID}
					orientation="horizontal"
					items={makeItems('b', 'a', 'c', 'd')}
				/>
			</Frame>,
		);
		handle('b').focus();
		await userEvent.keyboard('{F6}');

		expect(handle('a')).toHaveFocus();

		await userEvent.keyboard('{F6}');

		expect(handle('c')).toHaveFocus();
	});

	it('makes every handle a focus stop in the order of items, and no panel', async () => {
		renderResizable({ items: makeItems('a', 'b', 'c') });

		await userEvent.tab();

		expect(handle('a')).toHaveFocus();

		await userEvent.tab();

		expect(handle('b')).toHaveFocus();
	});
});

describe('Resizable pointer', () => {
	it('grows one panel and shrinks the other by the same amount on a drag', () => {
		renderResizable({ items: makeItems('a', 'b') });
		const before = panelWidth('a') + panelWidth('b');

		drag(handle('a'), 40, 0);

		expect(sizeOf(handle('a'))).toBe(60);
		expect(panelWidth('a') + panelWidth('b')).toBeCloseTo(before, 0);
	});

	it('stops the handle at the limits of the panels', () => {
		renderResizable({ items: BOUNDED });

		drag(handle('a'), 300, 0);

		expect(sizeOf(handle('a'))).toBe(70);

		drag(handle('a'), -400, 0);

		expect(sizeOf(handle('a'))).toBe(20);
	});

	it('drags a vertical handle along the vertical axis', () => {
		renderResizable({ items: makeItems('a', 'b'), orientation: 'vertical' }, { height: 200 });

		drag(handle('a'), 0, -40);

		expect(sizeOf(handle('a'))).toBe(30);
		expect(panelHeight('a')).toBeLessThan(panelHeight('b'));
	});

	it('marks the handle while hovered and while dragged, also with the pointer off the line', () => {
		renderResizable({ items: makeItems('a', 'b') });
		const separator = handle('a');

		hover(separator, 4);

		expect(separator).toHaveAttribute('data-separator', 'hover');

		drag(separator, 120, 0, { release: false });

		expect(separator).toHaveAttribute('data-separator', 'active');
	});

	it('takes the pointer within 5px of the line on each side', () => {
		renderResizable({ items: makeItems('a', 'b') });
		const separator = handle('a');

		hover(separator, 20);

		expect(separator).toHaveAttribute('data-separator', 'inactive');

		hover(separator, -4);

		expect(separator).toHaveAttribute('data-separator', 'hover');
	});
});

describe('Resizable double-click', () => {
	it('puts the panel before the handle back to its defaultSize', () => {
		renderResizable({ items: BOUNDED });

		drag(handle('a'), 60, 0);

		expect(sizeOf(handle('a'))).not.toBe(50);

		doubleClick(handle('a'));

		expect(sizeOf(handle('a'))).toBe(50);
	});

	it('resets the panel after the handle when the one before has no defaultSize', () => {
		renderResizable({
			items: [
				{ value: 'a', label: 'A', children: 'a' },
				{ value: 'b', label: 'B', defaultSize: '30%', children: 'b' },
			],
		});

		drag(handle('a'), -80, 0);
		doubleClick(handle('a'));

		expect(sizeOf(handle('a'))).toBe(70);
	});

	it('does nothing when neither panel has a defaultSize', () => {
		renderResizable({ items: makeItems('a', 'b') });

		drag(handle('a'), 40, 0);
		doubleClick(handle('a'));

		expect(sizeOf(handle('a'))).toBe(60);
	});
});

describe('Resizable handle colour', () => {
	const COLOURS = {
		'--resizable-handle-color': 'rgb(1, 1, 1)',
		'--resizable-handle-active-color': 'rgb(2, 2, 2)',
		'--resizable-handle-transition-duration': '0s',
	} as CSSProperties;

	function renderColoured() {
		render(
			<div style={COLOURS}>
				<Frame width={400} height={200}>
					<Resizable testId={TEST_ID} orientation="horizontal" items={makeItems('a', 'b')} />
				</Frame>
			</div>,
		);
	}

	function colourOf(separator: HTMLElement) {
		return getComputedStyle(separator).backgroundColor;
	}

	it('colours the line while the pointer is in the band', () => {
		renderColoured();

		expect(colourOf(handle('a'))).toBe('rgb(1, 1, 1)');

		hover(handle('a'), 3);

		expect(colourOf(handle('a'))).toBe('rgb(2, 2, 2)');
	});

	it('colours the line of a handle a drag left focused, also under the pointer in the band', () => {
		renderColoured();

		drag(handle('a'), 40, 0);
		hover(handle('a'), 3);

		expect(handle('a')).toHaveFocus();
		expect(colourOf(handle('a'))).toBe('rgb(2, 2, 2)');

		hover(handle('a'), 100);

		expect(colourOf(handle('a'))).toBe('rgb(2, 2, 2)');

		act(() => {
			handle('a').blur();
		});

		expect(colourOf(handle('a'))).toBe('rgb(1, 1, 1)');
	});
});
