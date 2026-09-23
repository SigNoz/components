import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ReactElement, useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ButtonGroup } from '../button-group.js';
import type { ButtonGroupItemType } from '../types.js';
import { countVisibleMembers } from '../utils.js';
import {
	BASE,
	MANY_ITEMS,
	noop,
	renderInFrame,
	silenceConsoleError,
	visibleMembers,
} from './button-group.test-utils.js';

/**
 * Real layout and a real `ResizeObserver`, so nothing here may import `mockLabelMeasurement`.
 */
afterEach(() => {
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});

function visibleLabels(): string[] {
	return visibleMembers().map((button) => button.textContent ?? '');
}

/**
 * The right edge of the group's content box, where the row has to stop.
 */
function contentRight(group: HTMLElement): number {
	const style = getComputedStyle(group);
	return (
		group.getBoundingClientRect().right -
		Number.parseFloat(style.paddingRight) -
		Number.parseFloat(style.borderRightWidth)
	);
}

function expectRowToFit(group: HTMLElement): void {
	const right = Math.max(
		...screen.getAllByRole('button').map((b) => b.getBoundingClientRect().right),
	);
	expect(right).toBeLessThanOrEqual(contentRight(group) + 0.5);
}

describe('countVisibleMembers', () => {
	// Three 85px members sharing borders, a 32px ellipsis pulling back by 1px.
	const ends = [85, 169, 253];

	it('keeps every member when the full row fits', () => {
		expect(countVisibleMembers(ends, 32, -1, 253)).toBe(3);
	});

	it('drops members from the end until the row plus the ellipsis fits', () => {
		expect(countVisibleMembers(ends, 32, -1, 252)).toBe(2);
		expect(countVisibleMembers(ends, 32, -1, 199)).toBe(1);
	});

	it('keeps the ellipsis alone when not even one member fits beside it', () => {
		expect(countVisibleMembers(ends, 32, -1, 115)).toBe(0);
		expect(countVisibleMembers(ends, 32, -1, 10)).toBe(0);
	});
});

describe('ButtonGroup overflow', () => {
	it('renders no ellipsis while every member fits', async () => {
		renderInFrame(<ButtonGroup {...BASE} items={MANY_ITEMS} testId="group" />, { size: 1200 });

		await waitFor(() => expect(visibleMembers()).toHaveLength(6));
		expect(screen.queryByTestId('group-overflow')).not.toBeInTheDocument();
		expect(screen.getByTestId('group')).not.toHaveAttribute('data-overflowing');
	});

	it('collapses trailing members behind an ellipsis that says how many', async () => {
		renderInFrame(<ButtonGroup {...BASE} items={MANY_ITEMS} testId="group" />, { size: 300 });

		const overflow = await screen.findByTestId('group-overflow');
		const visible = visibleLabels();

		expect(visible.length).toBeGreaterThan(0);
		expect(visible.length).toBeLessThan(6);
		expect(visible).toEqual(MANY_ITEMS.slice(0, visible.length).map((item) => item.label));
		expect(overflow).toHaveAccessibleName(`Show ${6 - visible.length} more options`);
		expect(overflow).toHaveAttribute('data-position', 'end');
		expect(screen.getByTestId('group').getBoundingClientRect().width).toBeLessThanOrEqual(300);
	});

	it('lists exactly the collapsed members in the menu, and runs their onClick', async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();
		const items = MANY_ITEMS.map((item) => ({ ...item, onClick })) as ButtonGroupItemType[];

		renderInFrame(<ButtonGroup {...BASE} items={items} testId="group" />, { size: 300 });

		await user.click(await screen.findByTestId('group-overflow'));

		const menu = await screen.findByRole('menu');
		const visibleCount = visibleMembers().length;
		const rows = within(menu).getAllByRole('menuitem');

		expect(rows.map((row) => row.textContent)).toEqual(
			MANY_ITEMS.slice(visibleCount).map((item) => item.label),
		);

		const last = MANY_ITEMS.at(-1)?.value;
		await user.click(screen.getByTestId(`group-item-${last}`));
		expect(onClick).toHaveBeenCalledOnce();
	});

	it('keeps only the ellipsis when not even one member fits', async () => {
		renderInFrame(<ButtonGroup {...BASE} items={MANY_ITEMS} testId="group" />, { size: 40 });

		const overflow = await screen.findByTestId('group-overflow');
		await waitFor(() => expect(visibleMembers()).toHaveLength(0));
		expect(overflow).toHaveAttribute('data-position', 'only');
		expect(overflow).toHaveAccessibleName('Show 6 more options');
	});

	it('brings members back when its container grows', async () => {
		const { rerender } = render(
			<div style={{ width: 300 }}>
				<ButtonGroup {...BASE} items={MANY_ITEMS} testId="group" />
			</div>,
		);

		await screen.findByTestId('group-overflow');

		rerender(
			<div style={{ width: 1200 }}>
				<ButtonGroup {...BASE} items={MANY_ITEMS} testId="group" />
			</div>,
		);

		await waitFor(() => expect(visibleMembers()).toHaveLength(6));
		expect(screen.queryByTestId('group-overflow')).not.toBeInTheDocument();
	});

	it('shrinks inside a flex row next to other content', async () => {
		render(
			<div style={{ display: 'flex', width: 400, gap: 24 }}>
				<span style={{ flex: '0 0 200px' }}>Title</span>
				<ButtonGroup {...BASE} items={MANY_ITEMS} testId="group" />
			</div>,
		);

		await screen.findByTestId('group-overflow');
		expect(screen.getByTestId('group').getBoundingClientRect().width).toBeLessThanOrEqual(176);
	});
});

describe('ButtonGroup overflow measurement', () => {
	it('measures a loading member with its spinner, so the row still fits', async () => {
		renderInFrame(<ButtonGroup {...BASE} loading items={MANY_ITEMS} testId="group" />, {
			size: 380,
		});

		const group = screen.getByTestId('group');
		await waitFor(() => expectRowToFit(group));
		expect(screen.getByTestId('group-overflow')).toBeInTheDocument();
	});

	it('keeps the row inside the group padding', async () => {
		renderInFrame(
			<ButtonGroup {...BASE} items={MANY_ITEMS} style={{ paddingInline: 30 }} testId="group" />,
			{ size: 300 },
		);

		await screen.findByTestId('group-overflow');
		await waitFor(() => expectRowToFit(screen.getByTestId('group')));
	});

	it('ignores typography the buttons do not inherit', async () => {
		// A button resets `word-spacing`, so the members do not grow with it, and neither may the
		// thresholds.
		renderInFrame(<ButtonGroup {...BASE} items={MANY_ITEMS} testId="group" />, {
			size: 600,
			style: { wordSpacing: 200 },
		});

		await waitFor(() => expect(visibleMembers()).toHaveLength(6));
		expect(screen.queryByTestId('group-overflow')).not.toBeInTheDocument();
	});

	it('marks the ellipsis as a member of the group', async () => {
		renderInFrame(<ButtonGroup {...BASE} items={MANY_ITEMS} testId="group" />, { size: 300 });

		expect(await screen.findByTestId('group-overflow')).toHaveAttribute(
			'data-slot',
			'button-group-item',
		);
	});

	it('builds its ResizeObserver once, whatever ref the consumer passes', async () => {
		// Label truncation has observers of its own, so only those watching the group count.
		let created = 0;
		vi.stubGlobal(
			'ResizeObserver',
			class extends ResizeObserver {
				override observe(target: Element, options?: ResizeObserverOptions): void {
					if (target.getAttribute('data-slot') === 'button-group') {
						created++;
					}
					super.observe(target, options);
				}
			},
		);

		function Harness(): ReactElement {
			const [, setTick] = useState(0);

			return (
				<>
					<button type="button" onClick={() => setTick((tick) => tick + 1)}>
						Render again
					</button>
					<ButtonGroup {...BASE} items={MANY_ITEMS} ref={(node) => node} />
				</>
			);
		}

		const user = userEvent.setup();
		render(<Harness />);
		const afterMount = created;

		for (let index = 0; index < 3; index++) {
			await user.click(screen.getByRole('button', { name: 'Render again' }));
		}

		expect(afterMount).toBe(1);
		expect(created).toBe(afterMount);
	});

	it('reports an empty label on a member that arrives collapsed', async () => {
		const error = silenceConsoleError();
		const { rerender } = renderInFrame(
			<ButtonGroup {...BASE} items={MANY_ITEMS} testId="group" />,
			{ size: 300 },
		);

		await screen.findByTestId('group-overflow');
		rerender(
			<ButtonGroup
				{...BASE}
				items={[...MANY_ITEMS, { value: 'empty', label: '', onClick: noop }]}
				testId="group"
			/>,
		);

		await waitFor(() =>
			expect(error).toHaveBeenCalledWith(expect.stringContaining('"empty" renders no label')),
		);
	});
});
