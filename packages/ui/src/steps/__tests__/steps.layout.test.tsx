import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { queryOpenTooltip } from '../../__tests__/test-utils.js';
import { Steps } from '../index.js';
import type { StepsItem } from '../types.js';
import {
	declareDesignTokens,
	heightOf,
	LONG_DESCRIPTION,
	LONG_LABEL,
	ONBOARDING,
	PLAIN,
	stepElements,
	widthOf,
} from './steps.test-utils.js';

declareDesignTokens();

const MARKER = 24;

function Frame({ children, width = 700 }: { children: ReactNode; width?: number }) {
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

function rectsOf(testId: string): string[] {
	return [byId(testId), ...byId(testId).querySelectorAll('[data-slot]')].map((element) => {
		const { x, y, width, height } = rectOf(element);

		return [x, y, width, height].map((value) => value.toFixed(2)).join(',');
	});
}

describe('Steps row layout', () => {
	it('fills the width of its parent', () => {
		render(
			<Frame>
				<Steps current={1} items={ONBOARDING} testId="steps" />
			</Frame>,
		);

		expect(widthOf(byId('steps'))).toBe(700);
		expect(rectOf(byId('steps')).left).toBe(rectOf(byId('frame')).left);
	});

	it('follows the width of its parent as it grows and shrinks', () => {
		const { rerender } = render(
			<Frame width={900}>
				<Steps current={1} items={ONBOARDING} testId="steps" />
			</Frame>,
		);
		expect(widthOf(byId('steps'))).toBe(900);

		rerender(
			<Frame width={500}>
				<Steps current={1} items={ONBOARDING} testId="steps" />
			</Frame>,
		);

		expect(widthOf(byId('steps'))).toBe(500);
	});

	it('lays the steps out in one row, in order', () => {
		render(
			<Frame>
				<Steps current={1} items={ONBOARDING} testId="steps" />
			</Frame>,
		);

		const rects = stepElements('steps').map(rectOf);

		expect(new Set(rects.map((rect) => rect.top)).size).toBe(1);
		expect(rects[0]?.right).toBeLessThanOrEqual(rects[1]?.left ?? 0);
		expect(rects[1]?.right).toBeLessThanOrEqual(rects[2]?.left ?? 0);
	});

	it('gives every step but the last an equal share of the row', () => {
		render(
			<Frame>
				<Steps current={1} items={ONBOARDING} testId="steps" />
			</Frame>,
		);

		const [first, second] = stepElements('steps').map(widthOf);

		expect(first).toBeGreaterThan(100);
		expect(first).toBeCloseTo(second ?? 0, 1);
	});

	it('gives every step but the last the same share whatever its text', () => {
		render(
			<Frame>
				<Steps
					current={1}
					items={[
						{ label: 'A', description: 'short' },
						{ label: 'A much longer label than the first step has' },
						{ label: 'Third step' },
						{ label: 'Last' },
					]}
					testId="steps"
				/>
			</Frame>,
		);

		const [first, second, third] = stepElements('steps').map(widthOf);

		expect(first).toBeCloseTo(second ?? 0, 1);
		expect(first).toBeCloseTo(third ?? 0, 1);
	});

	it('gives the last step the width of its content, and ends the row at the end of the parent', () => {
		render(
			<Frame>
				<Steps current={1} items={ONBOARDING} testId="steps" />
			</Frame>,
		);

		const steps = stepElements('steps');
		const last = steps.at(-1) as HTMLElement;
		const first = steps[0] as HTMLElement;
		const label = byId('steps-item-3-label');
		const marker = byId('steps-item-3-marker');
		const gap = rectOf(label).left - rectOf(marker).right;

		expect(widthOf(last)).toBeLessThan(widthOf(first));
		expect(widthOf(last)).toBeCloseTo(MARKER + gap + widthOf(label), 0);
		expect(rectOf(last).right).toBeLessThanOrEqual(rectOf(byId('frame')).right + 0.5);
	});

	it('joins the end of the text of a step to the next marker with a line', () => {
		render(
			<Frame>
				<Steps current={1} items={ONBOARDING} testId="steps" />
			</Frame>,
		);

		const connectors = Array.from(
			document.querySelectorAll('[data-slot="steps-connector"]'),
		) as HTMLElement[];

		expect(connectors).toHaveLength(2);

		for (const [index, connector] of connectors.entries()) {
			const n = index + 1;
			const text = [byId(`steps-item-${n}-label`), byId(`steps-item-${n}-description`)];
			const nextMarker = byId(`steps-item-${n + 1}-marker`);
			const marker = byId(`steps-item-${n}-marker`);
			const line = rectOf(connector);

			expect(line.left, `step ${n}`).toBeGreaterThanOrEqual(
				Math.max(...text.map((element) => rectOf(element).right)) - 0.5,
			);
			expect(line.right, `step ${n}`).toBeLessThanOrEqual(rectOf(nextMarker).left);
			expect(rectOf(nextMarker).left - line.right, `step ${n}`).toBeLessThanOrEqual(16);
			expect(line.width, `step ${n}`).toBeGreaterThan(8);
			expect(line.top + line.height / 2, `step ${n}`).toBeCloseTo(
				rectOf(marker).top + MARKER / 2,
				0,
			);
			expect(line.height).toBe(1);
		}
	});

	it('starts the line at the end of a label shorter than the floor of the text', () => {
		render(
			<Frame>
				<Steps current={1} items={PLAIN} testId="steps" />
			</Frame>,
		);

		for (const n of [1, 2]) {
			const label = rectOf(byId(`steps-item-${n}-label`));
			const marker = rectOf(byId(`steps-item-${n}-marker`));
			const gap = label.left - marker.right;
			const line = rectOf(
				byId(`steps-item-${n}`).querySelector('[data-slot="steps-connector"]') as Element,
			);

			expect(label.width, `step ${n}`).toBeLessThan(48);
			expect(line.left - label.right, `step ${n}`).toBeCloseTo(gap, 0);
		}
	});

	it('keeps a floor of 48px for a cut text, and less for a text shorter than that', () => {
		render(
			<Frame width={200}>
				<Steps
					current={1}
					items={[{ label: LONG_LABEL }, { label: 'One' }, { label: LONG_LABEL }]}
					testId="steps"
				/>
			</Frame>,
		);

		expect(widthOf(byId('steps-item-1-label'))).toBeCloseTo(48, 0);
		expect(widthOf(byId('steps-item-2-label'))).toBeLessThan(48);
		expect(widthOf(byId('steps-item-3-label'))).toBeCloseTo(48, 0);
	});

	it('puts the label next to the marker and the description under the label', () => {
		render(
			<Frame>
				<Steps current={1} items={ONBOARDING} testId="steps" />
			</Frame>,
		);

		const marker = rectOf(byId('steps-item-1-marker'));
		const label = rectOf(byId('steps-item-1-label'));
		const description = rectOf(byId('steps-item-1-description'));

		expect(label.left).toBeGreaterThanOrEqual(marker.right);
		expect(label.top).toBeGreaterThanOrEqual(marker.top);
		expect(label.bottom).toBeLessThanOrEqual(marker.bottom + 0.5);
		expect(description.top).toBeGreaterThanOrEqual(label.bottom);
		expect(description.left).toBe(label.left);
	});

	it('keeps the markers square at one size in every state', () => {
		render(
			<Frame>
				<Steps current={2} items={[...PLAIN, { label: 'Four' }]} testId="steps" />
			</Frame>,
		);

		for (const n of [1, 2, 3, 4]) {
			const rect = rectOf(byId(`steps-item-${n}-marker`));

			expect(rect.width, `step ${n}`).toBe(MARKER);
			expect(rect.height, `step ${n}`).toBe(MARKER);
		}
	});

	it('fits a number of two digits in a marker without growing it', () => {
		render(
			<Frame width={1500}>
				<Steps
					current={1}
					items={Array.from({ length: 12 }, (_, index) => ({ label: `Step ${index + 1}` }))}
					testId="steps"
				/>
			</Frame>,
		);

		expect(widthOf(byId('steps-item-12-marker'))).toBe(MARKER);
		expect(widthOf(byId('steps-item-10-marker'))).toBe(MARKER);
	});

	it('draws a single step at the width of its content', () => {
		render(
			<Frame>
				<Steps current={1} items={[{ label: 'Only step' }]} testId="steps" />
			</Frame>,
		);

		expect(widthOf(stepElements('steps')[0] as HTMLElement)).toBeLessThan(200);
	});
});

describe('Steps stable layout', () => {
	it('keeps every step, marker, label and line where it was while current moves', () => {
		const { rerender } = render(
			<Frame>
				<Steps current={1} items={ONBOARDING} testId="steps" />
			</Frame>,
		);
		const before = rectsOf('steps');

		for (const current of [2, 3, 4, 1]) {
			rerender(
				<Frame>
					<Steps current={current} items={ONBOARDING} testId="steps" />
				</Frame>,
			);

			expect(rectsOf('steps'), `current ${current}`).toEqual(before);
		}
	});

	it('keeps the layout while current is not a step number', () => {
		const { rerender } = render(
			<Frame>
				<Steps current={1} items={ONBOARDING} testId="steps" />
			</Frame>,
		);
		const before = rectsOf('steps');

		for (const current of [0, 2.5, Number.NaN]) {
			rerender(
				<Frame>
					<Steps current={current} items={ONBOARDING} testId="steps" />
				</Frame>,
			);

			expect(rectsOf('steps')).toEqual(before);
		}
	});

	it('gives every step the same height when only one has a description', () => {
		render(
			<Frame>
				<Steps
					current={1}
					items={[
						{ label: 'One', description: 'Kubernetes' },
						{ label: 'Two' },
						{ label: 'Three' },
					]}
					testId="steps"
				/>
			</Frame>,
		);

		const heights = stepElements('steps').map(heightOf);

		expect(new Set(heights.map((height) => height.toFixed(2))).size).toBe(1);
	});

	it('keeps the height of the row when the descriptions of the other steps arrive', () => {
		const { rerender } = render(
			<Frame>
				<Steps
					current={1}
					items={[
						{ label: 'One', description: 'Kubernetes' },
						{ label: 'Two' },
						{ label: 'Three' },
					]}
					testId="steps"
				/>
			</Frame>,
		);
		const reserved = heightOf(byId('steps'));
		const positions = stepElements('steps').map((step) => rectOf(step).top);

		rerender(
			<Frame>
				<Steps
					current={1}
					items={[
						{ label: 'One', description: 'Kubernetes' },
						{ label: 'Two', description: 'my-cluster' },
						{ label: 'Three', description: 'Done' },
					]}
					testId="steps"
				/>
			</Frame>,
		);

		expect(heightOf(byId('steps'))).toBeCloseTo(reserved, 2);
		expect(stepElements('steps').map((step) => rectOf(step).top)).toEqual(positions);
	});

	it('reserves the height of a description line, so a row with a description is taller than one with none', () => {
		const { rerender } = render(
			<Frame>
				<Steps current={1} items={PLAIN} testId="steps" />
			</Frame>,
		);
		const bare = heightOf(byId('steps'));

		rerender(
			<Frame>
				<Steps
					current={1}
					items={[
						{ label: 'One', description: 'Kubernetes' },
						{ label: 'Two' },
						{ label: 'Three' },
					]}
					testId="steps"
				/>
			</Frame>,
		);

		expect(heightOf(byId('steps'))).toBeGreaterThan(bare);
	});

	it('does not draw the reserved line', () => {
		render(
			<Frame>
				<Steps current={1} items={ONBOARDING} testId="steps" />
			</Frame>,
		);

		const placeholder = byId('steps-item-3').querySelector<HTMLElement>(
			'[aria-hidden="true"]:not([data-slot])',
		) as HTMLElement;

		expect(getComputedStyle(placeholder).visibility).toBe('hidden');
		expect(heightOf(placeholder)).toBeGreaterThan(0);
	});
});

describe('Steps overflow', () => {
	it('never wraps: the steps keep their row at a narrow width', () => {
		render(
			<Frame width={360}>
				<Steps
					current={1}
					items={[
						{ label: LONG_LABEL, description: LONG_DESCRIPTION },
						{ label: LONG_LABEL, description: LONG_DESCRIPTION },
						{ label: LONG_LABEL },
					]}
					testId="steps"
				/>
			</Frame>,
		);

		const rects = stepElements('steps').map(rectOf);

		expect(new Set(rects.map((rect) => rect.top)).size).toBe(1);
		expect(heightOf(byId('steps'))).toBeLessThan(80);
	});

	it('keeps every label and description on one line', () => {
		render(
			<Frame width={360}>
				<Steps
					current={1}
					items={[
						{ label: LONG_LABEL, description: LONG_DESCRIPTION },
						{ label: LONG_LABEL, description: LONG_DESCRIPTION },
						{ label: LONG_LABEL },
					]}
					testId="steps"
				/>
			</Frame>,
		);

		const label = rectOf(byId('steps-item-1-label'));
		const description = rectOf(byId('steps-item-1-description'));

		expect(label.height).toBeLessThanOrEqual(16);
		expect(description.height).toBeLessThanOrEqual(16);
	});

	it('cuts the last label alike when the row is short, instead of the earlier ones first', async () => {
		render(
			<Frame width={600}>
				<Steps
					current={1}
					items={[{ label: 'Select data source' }, { label: 'Configure' }, { label: LONG_LABEL }]}
					testId="steps"
				/>
			</Frame>,
		);

		const [first, , last] = stepElements('steps').map(widthOf);

		await waitFor(() =>
			expect(byId('steps-item-3-label')).toHaveAttribute('data-truncated', 'true'),
		);
		expect(byId('steps-item-1-label')).not.toHaveAttribute('data-truncated');
		expect(last).toBeLessThanOrEqual((first ?? 0) + 0.5);
	});

	it('cuts the labels and the descriptions before anything else', async () => {
		render(
			<Frame width={420}>
				<Steps
					current={1}
					items={[
						{ label: LONG_LABEL, description: LONG_DESCRIPTION },
						{ label: LONG_LABEL, description: LONG_DESCRIPTION },
						{ label: 'Send data' },
					]}
					testId="steps"
				/>
			</Frame>,
		);

		for (const id of ['steps-item-1-label', 'steps-item-1-description', 'steps-item-2-label']) {
			await waitFor(() => expect(byId(id), id).toHaveAttribute('data-truncated', 'true'));
			expect(getComputedStyle(byId(id)).textOverflow, id).toBe('ellipsis');
			expect(getComputedStyle(byId(id)).whiteSpace, id).toBe('nowrap');
		}
		expect(byId('steps-item-3-label')).not.toHaveAttribute('data-truncated');
		for (const n of [1, 2, 3]) {
			expect(widthOf(byId(`steps-item-${n}-marker`)), `step ${n}`).toBe(MARKER);
		}
	});

	it('keeps the connector of a step whose text is cut', async () => {
		render(
			<Frame width={420}>
				<Steps
					current={1}
					items={[{ label: LONG_LABEL }, { label: LONG_LABEL }, { label: 'Send data' }]}
					testId="steps"
				/>
			</Frame>,
		);
		await waitFor(() =>
			expect(byId('steps-item-1-label')).toHaveAttribute('data-truncated', 'true'),
		);

		const connector = byId('steps-item-1').querySelector('[data-slot="steps-connector"]');

		expect(widthOf(connector as Element)).toBeGreaterThanOrEqual(16);
	});

	it('opens the tooltip with the full text of a label cut by the width', async () => {
		const user = userEvent.setup();
		render(
			<Frame width={420}>
				<Steps
					current={1}
					items={[{ label: LONG_LABEL }, { label: LONG_LABEL }, { label: 'Send data' }]}
					testId="steps"
				/>
			</Frame>,
		);
		const label = byId('steps-item-1-label');
		await waitFor(() => expect(label).toHaveAttribute('data-truncated', 'true'));

		await user.hover(label);

		await waitFor(() => expect(queryOpenTooltip()).toHaveTextContent(LONG_LABEL));
	});

	it('reaches the cut label and description with Tab, in reading order, and not the others', async () => {
		const user = userEvent.setup();
		render(
			<Frame width={420}>
				<Steps
					current={1}
					items={[
						{ label: LONG_LABEL, description: LONG_DESCRIPTION },
						{ label: LONG_LABEL, description: LONG_DESCRIPTION },
						{ label: 'Send data' },
					]}
					testId="steps"
				/>
			</Frame>,
		);
		for (const id of [
			'steps-item-1-label',
			'steps-item-1-description',
			'steps-item-2-label',
			'steps-item-2-description',
		]) {
			await waitFor(() => expect(byId(id)).toHaveAttribute('data-truncated', 'true'));
		}

		const order: (string | null)[] = [];
		for (let index = 0; index < 4; index += 1) {
			await user.tab();
			order.push(document.activeElement?.getAttribute('data-testid') ?? null);
		}

		expect(order).toEqual([
			'steps-item-1-label',
			'steps-item-1-description',
			'steps-item-2-label',
			'steps-item-2-description',
		]);
	});

	it('draws a focus ring on the text that is cut while it has the focus', async () => {
		const user = userEvent.setup();
		render(
			<Frame width={420}>
				<Steps
					current={1}
					items={[{ label: LONG_LABEL }, { label: LONG_LABEL }, { label: 'Send data' }]}
					testId="steps"
				/>
			</Frame>,
		);
		const label = byId('steps-item-1-label');
		await waitFor(() => expect(label).toHaveAttribute('data-truncated', 'true'));

		await user.tab();

		expect(label).toHaveFocus();
		expect(getComputedStyle(label).outlineStyle).toBe('solid');
		expect(getComputedStyle(label).outlineColor).toBe('rgb(120, 200, 80)');
	});

	it('does not cut text that fits, and does not make it a tab stop', async () => {
		render(
			<Frame width={900}>
				<Steps current={1} items={ONBOARDING} testId="steps" />
			</Frame>,
		);
		await new Promise((resolve) => setTimeout(resolve, 100));

		expect(document.querySelector('[data-truncated]')).toBeNull();
		expect(document.querySelector('[tabindex]')).toBeNull();
	});

	it('stops cutting the text once the parent gets wider, and cuts it again when it narrows', async () => {
		const items: StepsItem[] = [
			{ label: LONG_LABEL },
			{ label: LONG_LABEL },
			{ label: 'Send data' },
		];
		const { rerender } = render(
			<Frame width={420}>
				<Steps current={1} items={items} testId="steps" />
			</Frame>,
		);
		const label = byId('steps-item-1-label');
		await waitFor(() => expect(label).toHaveAttribute('data-truncated', 'true'));

		rerender(
			<Frame width={1600}>
				<Steps current={1} items={items} testId="steps" />
			</Frame>,
		);
		await waitFor(() => expect(label).not.toHaveAttribute('data-truncated'));
		expect(label).not.toHaveAttribute('tabindex');

		rerender(
			<Frame width={420}>
				<Steps current={1} items={items} testId="steps" />
			</Frame>,
		);
		await waitFor(() => expect(label).toHaveAttribute('data-truncated', 'true'));
	});

	it('keeps the markers at their size and overflows the parent when even the cut text does not fit', () => {
		render(
			<Frame width={150}>
				<Steps
					current={1}
					items={[{ label: LONG_LABEL }, { label: LONG_LABEL }, { label: LONG_LABEL }]}
					testId="steps"
				/>
			</Frame>,
		);

		for (const n of [1, 2, 3]) {
			expect(widthOf(byId(`steps-item-${n}-marker`)), `step ${n}`).toBe(MARKER);
		}
		expect(rectOf(stepElements('steps').at(-1) as HTMLElement).right).toBeGreaterThan(
			rectOf(byId('frame')).right,
		);
		const rects = stepElements('steps').map(rectOf);
		expect(new Set(rects.map((rect) => rect.top)).size).toBe(1);
	});

	it('does not turn into a column on a narrow parent', () => {
		render(
			<Frame width={150}>
				<Steps current={1} items={ONBOARDING} testId="steps" />
			</Frame>,
		);

		const [first, second, third] = stepElements('steps').map(rectOf);

		expect(first?.left).toBeLessThan(second?.left ?? 0);
		expect(second?.left).toBeLessThan(third?.left ?? 0);
		expect(first?.top).toBe(third?.top);
	});
});
