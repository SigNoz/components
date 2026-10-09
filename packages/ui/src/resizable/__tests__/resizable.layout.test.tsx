import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Resizable } from '../resizable.js';
import type { ResizableItemType, ResizableOrientationType } from '../types.js';
import {
	Frame,
	handle,
	makeItems,
	panel,
	panelHeight,
	panelWidth,
	renderResizable,
	TEST_ID,
} from './resizable.test-utils.js';

afterEach(() => {
	vi.restoreAllMocks();
});

function renderInFrame(
	items: ResizableItemType[],
	width: number,
	orientation: ResizableOrientationType = 'horizontal',
) {
	const view = render(
		<Frame width={width} height={200}>
			<Resizable testId={TEST_ID} orientation={orientation} items={items} />
		</Frame>,
	);

	return {
		resizeTo(nextWidth: number, nextHeight = 200) {
			view.rerender(
				<Frame width={nextWidth} height={nextHeight}>
					<Resizable testId={TEST_ID} orientation={orientation} items={items} />
				</Frame>,
			);
		},
	};
}

describe('Resizable when the root changes size', () => {
	it('keeps the pixels of a panel sized in px, and gives the change to the others', async () => {
		const { resizeTo } = renderInFrame(
			[
				{ value: 'side', label: 'Side', defaultSize: '100px', children: 'side' },
				{ value: 'main', label: 'Main', children: 'main' },
			],
			400,
		);

		expect(panelWidth('side')).toBeCloseTo(100, 0);

		resizeTo(600);

		await waitFor(() => {
			expect(panelWidth('main')).toBeCloseTo(499, 0);
		});
		expect(panelWidth('side')).toBeCloseTo(100, 0);
	});

	it('keeps the pixels of a panel sized in rem', async () => {
		const { resizeTo } = renderInFrame(
			[
				{ value: 'side', label: 'Side', defaultSize: '10rem', children: 'side' },
				{ value: 'main', label: 'Main', children: 'main' },
			],
			400,
		);

		resizeTo(800);

		await waitFor(() => {
			expect(panelWidth('main')).toBeCloseTo(639, 0);
		});
		expect(panelWidth('side')).toBeCloseTo(160, 0);
	});

	it('keeps the share of a panel sized in %, or with no defaultSize', async () => {
		const { resizeTo } = renderInFrame(
			[
				{ value: 'a', label: 'A', defaultSize: '25%', children: 'a' },
				{ value: 'b', label: 'B', children: 'b' },
			],
			401,
		);

		resizeTo(801);

		await waitFor(() => {
			expect(panelWidth('a')).toBeCloseTo(200, 0);
		});
		expect(panelWidth('b')).toBeCloseTo(600, 0);
	});

	it('gives the change to the last panel and warns when every panel is in px', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		const { resizeTo } = renderInFrame(
			[
				{ value: 'a', label: 'A', defaultSize: '100px', children: 'a' },
				{ value: 'b', label: 'B', defaultSize: '299px', children: 'b' },
			],
			400,
		);

		resizeTo(600);

		await waitFor(() => {
			expect(panelWidth('b')).toBeCloseTo(499, 0);
		});
		expect(panelWidth('a')).toBeCloseTo(100, 0);
		expect(warn).toHaveBeenCalledWith(
			'Resizable: every panel has a `defaultSize` in `px` or `rem`, so the last panel takes the change when the root changes size.',
		);
	});
});

describe('Resizable onResize', () => {
	it('reports the width in pixels on mount and on each change', async () => {
		const onResize = vi.fn();

		renderResizable(
			{
				items: [
					{ value: 'a', label: 'A', defaultSize: '50%', onResize, children: 'a' },
					{ value: 'b', label: 'B', children: 'b' },
				],
			},
			{ width: 401 },
		);

		await waitFor(() => {
			expect(onResize).toHaveBeenCalledWith(200);
		});

		handle('a').focus();
		await userEvent.keyboard('{ArrowRight}');

		await waitFor(() => {
			expect(onResize).toHaveBeenLastCalledWith(220);
		});
	});

	it('reports the height in a vertical Resizable', async () => {
		const onResize = vi.fn();

		renderResizable(
			{
				orientation: 'vertical',
				items: [
					{ value: 'a', label: 'A', defaultSize: '25%', onResize, children: 'a' },
					{ value: 'b', label: 'B', children: 'b' },
				],
			},
			{ height: 201 },
		);

		await waitFor(() => {
			expect(onResize).toHaveBeenCalledWith(50);
		});
	});

	it('is not called when only the other axis changes', async () => {
		const onResize = vi.fn();
		const items: ResizableItemType[] = [
			{ value: 'a', label: 'A', defaultSize: '50%', onResize, children: 'a' },
			{ value: 'b', label: 'B', children: 'b' },
		];
		const { resizeTo } = renderInFrame(items, 401);

		await waitFor(() => {
			expect(onResize).toHaveBeenCalledTimes(1);
		});

		resizeTo(401, 300);

		await waitFor(() => {
			expect(panelHeight('a')).toBe(300);
		});
		await new Promise((resolve) => requestAnimationFrame(resolve));

		expect(onResize).toHaveBeenCalledTimes(1);
	});

	it('is not called again when a limit of the panel changes and its size does not', async () => {
		const onResize = vi.fn();
		const items = (minSize: ResizableItemType['minSize']): ResizableItemType[] => [
			{ value: 'a', label: 'A', defaultSize: '50%', minSize, onResize, children: 'a' },
			{ value: 'b', label: 'B', children: 'b' },
		];
		const { rerender } = render(
			<Frame width={401} height={200}>
				<Resizable testId={TEST_ID} orientation="horizontal" items={items('10%')} />
			</Frame>,
		);

		await waitFor(() => {
			expect(onResize).toHaveBeenCalledTimes(1);
		});

		rerender(
			<Frame width={401} height={200}>
				<Resizable testId={TEST_ID} orientation="horizontal" items={items('20%')} />
			</Frame>,
		);
		await new Promise((resolve) => requestAnimationFrame(resolve));
		await new Promise((resolve) => requestAnimationFrame(resolve));

		expect(panelWidth('a')).toBe(200);
		expect(onResize).toHaveBeenCalledTimes(1);
	});
});

describe('Resizable filling the room', () => {
	it('fills a block parent', () => {
		renderResizable({}, { width: 300, height: 120 });

		const rect = screen.getByTestId(TEST_ID).getBoundingClientRect();

		expect(rect.width).toBe(300);
		expect(rect.height).toBe(120);
	});

	it('takes the room a header leaves in a flex column', () => {
		render(
			<div style={{ display: 'flex', flexDirection: 'column', width: 300, height: 200 }}>
				<header style={{ height: 50, flexShrink: 0 }}>Header</header>
				<Resizable testId={TEST_ID} orientation="vertical" items={makeItems('a', 'b')} />
			</div>,
		);

		expect(screen.getByTestId(TEST_ID).getBoundingClientRect().height).toBe(150);
	});

	it('scrolls a panel whose content is larger, and leaves the other panels where they are', () => {
		renderResizable({
			items: [
				{ value: 'long', label: 'Long', children: <div style={{ width: 1000, height: 1000 }} /> },
				{ value: 'short', label: 'Short', children: 'short' },
			],
		});

		const box = panel('long');

		expect(box.scrollHeight).toBeGreaterThan(box.clientHeight);
		expect(box.scrollWidth).toBeGreaterThan(box.clientWidth);
		expect(panelWidth('long')).toBeCloseTo(panelWidth('short'), 0);
		expect(panelHeight('long')).toBe(200);
	});

	it('lets a child with height 100% fill its panel', () => {
		renderResizable({
			items: [
				{ value: 'a', label: 'A', children: <div data-testid="fill" style={{ height: '100%' }} /> },
				{ value: 'b', label: 'B', children: 'b' },
			],
		});

		expect(screen.getByTestId('fill').getBoundingClientRect().height).toBe(200);
	});

	it('fills a panel with a nested Resizable, with no wrapper', () => {
		renderResizable({
			items: [
				{
					value: 'main',
					label: 'Main',
					children: (
						<Resizable testId="inner" orientation="vertical" items={makeItems('top', 'bottom')} />
					),
				},
				{ value: 'side', label: 'Side', children: 'side' },
			],
		});

		const inner = screen.getByTestId('inner').getBoundingClientRect();
		const outer = panel('main').getBoundingClientRect();

		expect(inner.width).toBeCloseTo(outer.width, 0);
		expect(inner.height).toBe(outer.height);
		expect(screen.getByTestId('inner-handle-top')).toHaveAttribute(
			'aria-orientation',
			'horizontal',
		);
	});
});
