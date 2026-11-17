import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Steps } from '../index.js';
import { declareDesignTokens, PLAIN } from './steps.test-utils.js';

declareDesignTokens();

const L1_FOREGROUND = 'rgb(236, 238, 242)';
const L2_FOREGROUND = 'rgb(192, 193, 195)';
const L1_BACKGROUND = 'rgb(11, 12, 14)';
const L2_BACKGROUND = 'rgb(18, 20, 24)';
const L2_BORDER = 'rgb(35, 38, 46)';
const PRIMARY = 'rgb(78, 116, 248)';
const PRIMARY_FOREGROUND = 'rgb(255, 255, 255)';

const STRAY = { className: 'stray', style: { color: 'rgb(255, 0, 0)' } } as object;

function style(testId: string): CSSStyleDeclaration {
	return getComputedStyle(screen.getByTestId(testId));
}

describe('Steps className and style that get past the types', () => {
	it('do not reach the ol of Steps', () => {
		render(<Steps current={1} items={PLAIN} testId="steps" {...STRAY} />);

		const root = screen.getByTestId('steps');

		expect(root).not.toHaveClass('stray');
		expect(root.style.color).toBe('');
		expect(root.getAttribute('style')).toBeNull();
		expect(root.className).not.toBe('');
	});

	it('do not reach the root or the ol of Steps.List', () => {
		render(<Steps.List items={[{ children: 'a' }]} testId="list" {...STRAY} />);

		for (const testId of ['list', 'list-items']) {
			const element = screen.getByTestId(testId);

			expect(element, testId).not.toHaveClass('stray');
			expect(element.style.color, testId).toBe('');
			expect(element.getAttribute('style'), testId).toBeNull();
			expect(element.className, testId).not.toBe('');
		}
	});

	it('do not reach a step of Steps, nor its label, description or marker', () => {
		render(
			<Steps
				current={1}
				testId="steps"
				items={[
					{ label: 'One', description: 'a', ...STRAY },
					{ label: 'Two', description: 'b', ...STRAY },
				]}
			/>,
		);

		expect(document.querySelector('.stray')).toBeNull();
		for (const element of document.querySelectorAll<HTMLElement>('[data-slot]')) {
			expect(element.style.color, element.dataset.slot).toBe('');
			expect(element.getAttribute('style'), element.dataset.slot).toBeNull();
		}
	});

	it('do not reach a step of Steps.List, nor its label or content', () => {
		render(
			<Steps.List
				testId="list"
				items={[
					{ label: 'One', children: 'a', ...STRAY },
					{ label: 'Two', children: 'b', ...STRAY },
				]}
			/>,
		);

		expect(document.querySelector('.stray')).toBeNull();
		for (const element of document.querySelectorAll<HTMLElement>('[data-slot]')) {
			expect(element.style.color, element.dataset.slot).toBe('');
			expect(element.getAttribute('style'), element.dataset.slot).toBeNull();
		}
	});

	it('leave the colors of the steps as the component draws them', () => {
		render(<Steps current={1} items={PLAIN} testId="steps" {...STRAY} />);

		expect(style('steps-item-1-label').color).toBe(L1_FOREGROUND);
	});
});

describe('Steps markers', () => {
	it('draw the current step on the primary background', () => {
		render(<Steps current={2} items={PLAIN} testId="steps" />);

		const marker = style('steps-item-2-marker');

		expect(marker.backgroundColor).toBe(PRIMARY);
		expect(marker.borderTopColor).toBe(PRIMARY);
		expect(marker.color).toBe(PRIMARY_FOREGROUND);
	});

	it('draw a waiting step on the secondary background with its own border', () => {
		render(<Steps current={2} items={PLAIN} testId="steps" />);

		const marker = style('steps-item-3-marker');

		expect(marker.backgroundColor).toBe(L2_BACKGROUND);
		expect(marker.borderTopColor).toBe(L2_BORDER);
		expect(marker.color).toBe(L2_FOREGROUND);
	});

	it('draw a done step with a primary border and mark, on the base background', () => {
		render(<Steps current={2} items={PLAIN} testId="steps" />);

		const marker = style('steps-item-1-marker');

		expect(marker.backgroundColor).toBe(L1_BACKGROUND);
		expect(marker.borderTopColor).toBe(PRIMARY);
		expect(marker.color).toBe(PRIMARY);
	});

	it('make the three states differ in more than one property', () => {
		render(<Steps current={2} items={PLAIN} testId="steps" />);

		const [done, current, waiting] = [1, 2, 3].map((n) => style(`steps-item-${n}-marker`));
		const signature = (declaration: CSSStyleDeclaration | undefined): string =>
			[declaration?.backgroundColor, declaration?.borderTopColor, declaration?.color].join('|');

		expect(new Set([signature(done), signature(current), signature(waiting)]).size).toBe(3);
	});

	it('are round, one size, and the same size in every state', () => {
		render(<Steps current={2} items={PLAIN} testId="steps" />);

		for (const n of [1, 2, 3]) {
			const rect = screen.getByTestId(`steps-item-${n}-marker`).getBoundingClientRect();

			expect(rect.width, `step ${n}`).toBe(24);
			expect(rect.height, `step ${n}`).toBe(24);
			expect(style(`steps-item-${n}-marker`).borderTopLeftRadius, `step ${n}`).not.toBe('0px');
		}
	});

	it('draw a label in the base foreground for the current and done steps, and the secondary one for the waiting ones', () => {
		render(<Steps current={2} items={PLAIN} testId="steps" />);

		expect(style('steps-item-1-label').color).toBe(L1_FOREGROUND);
		expect(style('steps-item-2-label').color).toBe(L1_FOREGROUND);
		expect(style('steps-item-3-label').color).toBe(L2_FOREGROUND);
	});

	it('draw the connector of a done step in primary, and the others in the border color', () => {
		render(<Steps current={2} items={PLAIN} testId="steps" />);

		const [first, second] = Array.from(
			document.querySelectorAll<HTMLElement>('[data-slot="steps-connector"]'),
		).map((connector) => getComputedStyle(connector).backgroundColor);

		expect(first).toBe(PRIMARY);
		expect(second).toBe(L2_BORDER);
	});

	it('draw the connector one pixel thick', () => {
		render(<Steps current={1} items={PLAIN} testId="steps" />);

		const connector = document.querySelector('[data-slot="steps-connector"]');

		expect(connector?.getBoundingClientRect().height).toBe(1);
	});

	it('draw a plain text footer of Steps.List in the body text style, like the content', () => {
		render(<Steps.List testId="list" items={[{ children: 'a' }]} footer="Add a step" />);

		const footer = style('list-footer-content');
		const content = style('list-item-1-content');

		expect(footer.fontSize).toBe('13px');
		expect(footer.fontWeight).toBe('400');
		expect(footer.lineHeight).toBe('20px');
		for (const property of [
			'color',
			'fontFamily',
			'fontSize',
			'fontWeight',
			'lineHeight',
			'letterSpacing',
			'textTransform',
		] as const) {
			expect(footer[property]).toBe(content[property]);
		}
	});

	it('draw the markers of Steps.List the same in every step', () => {
		render(
			<Steps.List
				testId="list"
				items={[{ children: 'a' }, { children: 'b' }, { children: 'c' }]}
			/>,
		);

		const signatures = [1, 2, 3].map((n) => {
			const marker = style(`list-item-${n}-marker`);

			return [marker.backgroundColor, marker.borderTopColor, marker.color].join('|');
		});

		expect(new Set(signatures).size).toBe(1);
		expect(signatures[0]).toContain(L2_BACKGROUND);
	});
});

describe('Steps interaction states', () => {
	it('does not react to hover', async () => {
		const user = userEvent.setup();
		render(<Steps current={2} items={PLAIN} testId="steps" />);

		const before = [1, 2, 3].map((n) => ({
			marker: style(`steps-item-${n}-marker`).backgroundColor,
			label: style(`steps-item-${n}-label`).color,
			cursor: style(`steps-item-${n}`).cursor,
		}));

		for (const n of [1, 2, 3]) {
			await user.hover(screen.getByTestId(`steps-item-${n}`));
			await user.hover(screen.getByTestId(`steps-item-${n}-marker`));
		}

		const after = [1, 2, 3].map((n) => ({
			marker: style(`steps-item-${n}-marker`).backgroundColor,
			label: style(`steps-item-${n}-label`).color,
			cursor: style(`steps-item-${n}`).cursor,
		}));

		expect(after).toEqual(before);
		for (const { cursor } of after) {
			expect(cursor).not.toBe('pointer');
		}
	});

	it('does not draw a pointer cursor on a marker or a label', () => {
		render(<Steps current={2} items={PLAIN} testId="steps" />);

		for (const n of [1, 2, 3]) {
			expect(style(`steps-item-${n}-marker`).cursor).not.toBe('pointer');
			expect(style(`steps-item-${n}-label`).cursor).not.toBe('pointer');
		}
	});

	it('does not select the number of a marker', () => {
		render(<Steps current={2} items={PLAIN} testId="steps" />);

		expect(style('steps-item-2-marker').userSelect).toBe('none');
	});
});
