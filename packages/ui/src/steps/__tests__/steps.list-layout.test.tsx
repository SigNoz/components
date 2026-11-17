import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { Steps } from '../index.js';
import { declareDesignTokens, heightOf, widthOf } from './steps.test-utils.js';

declareDesignTokens();

const MARKER = 24;

function Frame({ children, width = 500 }: { children: ReactNode; width?: number }) {
	return (
		<div data-testid="frame" style={{ inlineSize: `${width}px` }}>
			{children}
		</div>
	);
}

function rectOf(element: Element): DOMRect {
	return element.getBoundingClientRect();
}

function byId(testId: string): HTMLElement {
	return screen.getByTestId(testId);
}

function connectorOf(testId: string): HTMLElement {
	return byId(testId).querySelector('[data-slot="steps-list-connector"]') as HTMLElement;
}

const TALL = <div style={{ blockSize: '200px' }}>tall</div>;

describe('Steps.List layout', () => {
	it('fills the width of its parent', () => {
		render(
			<Frame>
				<Steps.List items={[{ label: 'One', children: 'a' }]} testId="list" />
			</Frame>,
		);

		expect(widthOf(byId('list'))).toBe(500);
		expect(rectOf(byId('list')).left).toBe(rectOf(byId('frame')).left);
	});

	it('stacks the steps in one column, in order', () => {
		render(
			<Frame>
				<Steps.List
					testId="list"
					items={[
						{ label: 'One', children: 'a' },
						{ label: 'Two', children: 'b' },
						{ label: 'Three', children: 'c' },
					]}
				/>
			</Frame>,
		);

		const rects = [1, 2, 3].map((n) => rectOf(byId(`list-item-${n}`)));

		expect(new Set(rects.map((rect) => rect.left)).size).toBe(1);
		expect(rects[0]?.bottom).toBeLessThanOrEqual(rects[1]?.top ?? 0);
		expect(rects[1]?.bottom).toBeLessThanOrEqual(rects[2]?.top ?? 0);
	});

	it('keeps the marker column at a fixed width, whatever the number or the label', () => {
		render(
			<Frame>
				<Steps.List
					testId="list"
					items={Array.from({ length: 12 }, (_, index) => ({
						label: index === 1 ? 'A label that is much longer than the others' : undefined,
						children: index === 2 ? 'a lot of content in this step '.repeat(6) : 'c',
					}))}
				/>
			</Frame>,
		);

		for (const n of [1, 2, 3, 9, 10, 12]) {
			expect(widthOf(byId(`list-item-${n}-marker`)), `step ${n}`).toBe(MARKER);
			expect(heightOf(byId(`list-item-${n}-marker`)), `step ${n}`).toBe(MARKER);
		}
		const bodies = [1, 2, 3, 10, 12].map((n) => rectOf(byId(`list-item-${n}-content`)).left);
		expect(new Set(bodies).size).toBe(1);
		expect(bodies[0]).toBeGreaterThan(rectOf(byId('list-item-1-marker')).right);
	});

	it('gives the label and the content the rest of the width', () => {
		render(
			<Frame>
				<Steps.List items={[{ label: 'One', children: 'a' }]} testId="list" />
			</Frame>,
		);

		const content = rectOf(byId('list-item-1-content'));
		const label = rectOf(byId('list-item-1-label'));

		expect(content.right).toBeCloseTo(rectOf(byId('frame')).right, 0);
		expect(label.right).toBeCloseTo(rectOf(byId('frame')).right, 0);
		expect(content.left).toBe(label.left);
	});

	it('puts the label next to the marker, and the content under the label', () => {
		render(
			<Frame>
				<Steps.List items={[{ label: 'One', children: 'a' }]} testId="list" />
			</Frame>,
		);

		const marker = rectOf(byId('list-item-1-marker'));
		const label = rectOf(byId('list-item-1-label'));
		const content = rectOf(byId('list-item-1-content'));

		expect(label.left).toBeGreaterThanOrEqual(marker.right);
		expect(label.top).toBe(marker.top);
		expect(content.top).toBeGreaterThanOrEqual(label.bottom);
		expect(content.left).toBe(label.left);
	});

	it('puts the content next to the marker for a step with no label', () => {
		render(
			<Frame>
				<Steps.List items={[{ children: 'a' }]} testId="list" />
			</Frame>,
		);

		const marker = rectOf(byId('list-item-1-marker'));
		const content = rectOf(byId('list-item-1-content'));

		expect(content.left).toBeGreaterThanOrEqual(marker.right);
		expect(content.top).toBeLessThanOrEqual(marker.bottom);
	});

	it('grows with the content, and does not cut or scroll it', () => {
		render(
			<Frame>
				<Steps.List
					testId="list"
					items={[
						{ label: 'One', children: TALL },
						{ label: 'Two', children: TALL },
					]}
				/>
			</Frame>,
		);

		const list = byId('list');

		expect(heightOf(list)).toBeGreaterThanOrEqual(400);
		expect(heightOf(byId('list-item-1-content'))).toBe(200);
		expect(getComputedStyle(list).overflow).toBe('visible');
		expect(list.scrollHeight).toBe(list.clientHeight);
		expect(list.scrollWidth).toBe(list.clientWidth);
	});

	it('wraps a long label, and never cuts it', () => {
		const label = 'A very long label that does not fit on one line of a narrow list and must wrap';
		render(
			<Frame width={240}>
				<Steps.List items={[{ label, children: 'a' }]} testId="list" />
			</Frame>,
		);

		const element = byId('list-item-1-label');

		expect(heightOf(element)).toBeGreaterThan(MARKER);
		expect(element.scrollWidth).toBeLessThanOrEqual(element.clientWidth);
		expect(element).not.toHaveAttribute('data-truncated');
		expect(rectOf(element).right).toBeLessThanOrEqual(rectOf(byId('frame')).right);
		expect(getComputedStyle(element).textOverflow).not.toBe('ellipsis');
		expect(getComputedStyle(element).whiteSpace).not.toBe('nowrap');
	});

	it('wraps a long word of a label inside the list', () => {
		render(
			<Frame width={240}>
				<Steps.List
					items={[
						{
							label: 'averyveryverylonglabelwithnospacesatallthatcannotbebrokenanywhere',
							children: 'a',
						},
					]}
					testId="list"
				/>
			</Frame>,
		);

		const element = byId('list-item-1-label');

		expect(rectOf(element).right).toBeLessThanOrEqual(rectOf(byId('frame')).right);
		expect(element.scrollWidth).toBeLessThanOrEqual(element.clientWidth);
	});

	it('does not cut the content at the width of the list', () => {
		render(
			<Frame width={240}>
				<Steps.List
					items={[{ label: 'One', children: <p>{'content wraps inside the step '.repeat(10)}</p> }]}
					testId="list"
				/>
			</Frame>,
		);

		const content = byId('list-item-1-content');

		expect(content.scrollWidth).toBeLessThanOrEqual(content.clientWidth);
		expect(getComputedStyle(content).overflow).toBe('visible');
		expect(document.querySelector('[data-truncated]')).toBeNull();
	});
});

describe('Steps.List connector', () => {
	it('joins each marker to the next one, along the full height of the content', () => {
		render(
			<Frame>
				<Steps.List
					testId="list"
					items={[
						{ label: 'One', children: TALL },
						{ label: 'Two', children: TALL },
						{ label: 'Three', children: TALL },
					]}
				/>
			</Frame>,
		);

		for (const n of [1, 2]) {
			const connector = rectOf(connectorOf(`list-item-${n}`));
			const marker = rectOf(byId(`list-item-${n}-marker`));
			const nextMarker = rectOf(byId(`list-item-${n + 1}-marker`));
			const content = rectOf(byId(`list-item-${n}-content`));

			expect(connector.top, `step ${n}`).toBeGreaterThanOrEqual(marker.bottom);
			expect(connector.top - marker.bottom, `step ${n}`).toBeLessThanOrEqual(8);
			expect(nextMarker.top - connector.bottom, `step ${n}`).toBeLessThanOrEqual(8);
			expect(nextMarker.top - connector.bottom, `step ${n}`).toBeGreaterThanOrEqual(0);
			expect(connector.bottom - connector.top, `step ${n}`).toBeGreaterThanOrEqual(content.height);
			expect(connector.left + connector.width / 2, `step ${n}`).toBeCloseTo(
				marker.left + marker.width / 2,
				0,
			);
			expect(connector.width, `step ${n}`).toBe(1);
		}
	});

	it('keeps joining the markers when the content is short', () => {
		render(
			<Frame>
				<Steps.List
					testId="list"
					items={[
						{ label: 'One', children: 'a' },
						{ children: null },
						{ label: 'Three', children: 'c' },
					]}
				/>
			</Frame>,
		);

		for (const n of [1, 2]) {
			const connector = rectOf(connectorOf(`list-item-${n}`));
			const nextMarker = rectOf(byId(`list-item-${n + 1}-marker`));

			expect(connector.height, `step ${n}`).toBeGreaterThan(0);
			expect(nextMarker.top - connector.bottom, `step ${n}`).toBeLessThanOrEqual(8);
			expect(nextMarker.top - connector.bottom, `step ${n}`).toBeGreaterThanOrEqual(0);
		}
	});

	it('gives a step that has nothing to show the room for its marker and a line', () => {
		render(
			<Frame>
				<Steps.List items={[{ children: null }, { children: null }]} testId="list" />
			</Frame>,
		);

		const first = rectOf(byId('list-item-1'));
		const second = rectOf(byId('list-item-2'));

		expect(first.height).toBeGreaterThanOrEqual(MARKER);
		expect(second.top).toBeGreaterThanOrEqual(first.bottom);
		expect(rectOf(byId('list-item-2-marker')).top).toBeGreaterThan(
			rectOf(byId('list-item-1-marker')).bottom,
		);
	});

	it('draws no line under the last step, and adds no space under it', () => {
		render(
			<Frame>
				<Steps.List
					testId="list"
					items={[
						{ label: 'One', children: 'a' },
						{ label: 'Two', children: 'b' },
					]}
				/>
			</Frame>,
		);

		expect(connectorOf('list-item-2')).toBeNull();
		expect(rectOf(byId('list-item-2')).bottom).toBeCloseTo(rectOf(byId('list')).bottom, 0);
	});

	it('runs the line of the last step down to the footer dot, and lines the footer up with the content', () => {
		render(
			<Frame>
				<Steps.List
					testId="list"
					items={[
						{ label: 'One', children: 'a' },
						{ label: 'Two', children: TALL },
					]}
					footer={<button type="button">Add step</button>}
				/>
			</Frame>,
		);

		const connector = rectOf(connectorOf('list-item-2'));
		const marker = rectOf(byId('list-item-2-marker'));
		const dot = rectOf(byId('list-footer-marker'));
		const footerContent = rectOf(byId('list-footer-content'));

		const footerLine = rectOf(
			byId('list-footer').querySelector('[data-slot="steps-list-footer-connector"]') as Element,
		);
		const stepGap = marker.top - rectOf(connectorOf('list-item-1')).bottom;

		expect(connector.bottom - connector.top).toBeGreaterThanOrEqual(200);
		expect(footerLine.top).toBeCloseTo(connector.bottom, 0);
		expect(footerLine.left).toBeCloseTo(connector.left, 0);
		expect(dot.top - footerLine.bottom).toBeCloseTo(stepGap, 0);
		expect(dot.width).toBeGreaterThan(0);
		expect(dot.width).toBeLessThan(marker.width);
		expect(dot.left + dot.width / 2).toBeCloseTo(marker.left + marker.width / 2, 0);
		expect(footerContent.left).toBeCloseTo(rectOf(byId('list-item-2-content')).left, 0);
		expect(dot.top + dot.height / 2).toBeCloseTo(footerContent.top + footerContent.height / 2, 0);
		expect(rectOf(byId('list-footer')).bottom).toBeCloseTo(rectOf(byId('list')).bottom, 0);
	});

	it('keeps the gap under the lines of a list nested in the last step of a list with a footer', () => {
		render(
			<Frame>
				<Steps.List
					testId="outer"
					items={[
						{ label: 'One', children: 'a' },
						{
							label: 'Two',
							children: (
								<Steps.List
									testId="inner"
									items={[
										{ label: 'A', children: 'a' },
										{ label: 'B', children: 'b' },
									]}
								/>
							),
						},
					]}
					footer={<button type="button">Add step</button>}
				/>
			</Frame>,
		);

		expect(getComputedStyle(connectorOf('outer-item-2')).marginBlockEnd).toBe('0px');
		expect(getComputedStyle(connectorOf('inner-item-1')).marginBlockEnd).toBe('4px');
	});

	it('keeps the room under the last step when a footer follows, and adds none without one', () => {
		const items = [
			{ label: 'One', children: 'a' },
			{ label: 'Two', children: TALL },
		];
		const { rerender } = render(
			<Frame>
				<Steps.List testId="list" items={items} footer={<button type="button">Add step</button>} />
			</Frame>,
		);

		const withFooter =
			rectOf(byId('list-item-2')).bottom - rectOf(byId('list-item-2-content')).bottom;

		expect(withFooter).toBe(24);
		expect(rectOf(byId('list-footer')).top).toBe(rectOf(byId('list-item-2')).bottom);

		rerender(
			<Frame>
				<Steps.List testId="list" items={items} />
			</Frame>,
		);

		expect(rectOf(byId('list-item-2')).bottom - rectOf(byId('list-item-2-content')).bottom).toBe(0);
	});

	it('stretches the ol and the footer across the root', () => {
		render(
			<Frame>
				<Steps.List
					testId="list"
					items={[{ label: 'One', children: 'a' }]}
					footer={<button type="button">Add step</button>}
				/>
			</Frame>,
		);

		for (const testId of ['list', 'list-items', 'list-footer']) {
			expect(widthOf(byId(testId)), testId).toBe(500);
			expect(rectOf(byId(testId)).left, testId).toBe(rectOf(byId('frame')).left);
		}
		expect(getComputedStyle(byId('list-items')).listStyleType).toBe('none');
		expect(getComputedStyle(byId('list-items')).paddingInlineStart).toBe('0px');
		expect(getComputedStyle(byId('list-items')).marginBlockStart).toBe('0px');
	});

	it('draws every marker the same in one list', () => {
		render(
			<Frame>
				<Steps.List
					testId="list"
					items={[
						{ label: 'One', children: 'a' },
						{ label: 'Two', children: 'b' },
					]}
				/>
			</Frame>,
		);

		const [first, second] = [1, 2].map((n) => getComputedStyle(byId(`list-item-${n}-marker`)));

		expect(first?.backgroundColor).toBe(second?.backgroundColor);
		expect(first?.borderTopColor).toBe(second?.borderTopColor);
		expect(first?.color).toBe(second?.color);
	});
});
