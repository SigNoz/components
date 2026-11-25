import { render, waitFor, within } from '@testing-library/react';
import { type ReactNode, useState } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { userEvent as browserUser } from 'vitest/browser';
import { Drawer } from '../drawer.js';
import type { DrawerCloseReasonType, DrawerStackType, DrawerTypeType } from '../types.js';
import { waitForSettled } from './drawer.test-utils.js';

/**
 * One drawer of a chain: its `type`, and the `stack` the next drawer of the chain opens with.
 */
type Level = { type: DrawerTypeType; stack: DrawerStackType };

const TYPES: DrawerTypeType[] = ['task', 'inspector'];
const STACKS: DrawerStackType[] = ['overlay', 'breadcrumb'];

/**
 * Every chain of two and three drawers: each `type` at each level, each `stack` at each link.
 */
function allChains(): Level[][] {
	const chains: Level[][] = [];
	for (const depth of [2, 3]) {
		const build = (levels: Level[]): void => {
			if (levels.length === depth) {
				chains.push(levels);
				return;
			}
			const stacks = levels.length === depth - 1 ? (['overlay'] as const) : STACKS;
			for (const type of TYPES) {
				for (const stack of stacks) {
					build([...levels, { type, stack }]);
				}
			}
		};
		build([]);
	}

	return chains;
}

function nameOf(levels: Level[]): string {
	return levels
		.map((level, index) =>
			index === levels.length - 1 ? level.type : `${level.type} ${level.stack}`,
		)
		.join(' > ');
}

/**
 * What the user gets at each level of a chain, from the rules of `stack` and `type`:
 *
 * - A drawer opened with `stack="breadcrumb"` is a step of the trail of the drawer before it. The
 *   first drawer of the trail sets the `type` of every step and the only backdrop, and a step
 *   hides the drawer before it.
 * - A `task` that is not a step has a backdrop, over everything below it.
 * - A drawer takes no pointer when it is hidden, covered by a step or by a `task`, or under a
 *   backdrop.
 * - The arrow keys pressed in a drawer the user can reach get to the page, except in a `task` on
 *   top, which keeps them.
 */
function expected(levels: Level[]) {
	const top = levels.length - 1;
	const isStep = (index: number): boolean => index > 0 && levels[index - 1].stack === 'breadcrumb';
	const trailType = (index: number): DrawerTypeType => {
		let first = index;
		while (isStep(first)) {
			first -= 1;
		}
		return levels[first].type;
	};
	const hasBackdrop = (index: number): boolean => levels[index].type === 'task' && !isStep(index);
	const isHidden = (index: number): boolean => index < top && isStep(index + 1);
	const isInert = (index: number): boolean =>
		index < top && (isStep(index + 1) || trailType(index + 1) === 'task');
	const isReachable = (index: number): boolean =>
		!isHidden(index) &&
		!isInert(index) &&
		levels.every((_, above) => above <= index || !hasBackdrop(above));

	return levels.map((_, index) => ({
		backdrop: hasBackdrop(index),
		modal: trailType(index) === 'task',
		hidden: isHidden(index),
		inert: isHidden(index) || isInert(index),
		reachable: isReachable(index),
		keysReachPage: isReachable(index) && (index < top || trailType(index) === 'inspector'),
	}));
}

const levelId = (index: number): string => `level-${index}`;

function ChainLevel({
	levels,
	index,
	open,
	onClose,
}: {
	levels: Level[];
	index: number;
	open: boolean[];
	onClose: (index: number, reason: DrawerCloseReasonType) => void;
}): ReactNode {
	const level = levels[index];
	const id = levelId(index);
	const body = (
		<>
			<button type="button">{`Row in ${id}`}</button>
			{index < levels.length - 1 ? (
				<ChainLevel levels={levels} index={index + 1} open={open} onClose={onClose} />
			) : null}
		</>
	);
	const props = {
		stack: level.stack,
		open: open[index],
		onClose: (reason: DrawerCloseReasonType) => onClose(index, reason),
		title: id,
		crumb: { title: id },
		width: 'entity' as const,
		testId: id,
	};

	return level.type === 'task' ? (
		<Drawer type="task" {...props}>
			{body}
		</Drawer>
	) : (
		<Drawer type="inspector" {...props}>
			{body}
		</Drawer>
	);
}

function Chain({
	levels,
	closes,
}: {
	levels: Level[];
	closes: [number, DrawerCloseReasonType][];
}): ReactNode {
	const [open, setOpen] = useState(() => levels.map(() => true));

	return (
		<ChainLevel
			levels={levels}
			index={0}
			open={open}
			onClose={(index, reason) => {
				closes.push([index, reason]);
				setOpen((current) => current.map((isOpen, at) => (at === index ? false : isOpen)));
			}}
		/>
	);
}

const panelOf = (index: number): HTMLElement => {
	const panel = document.querySelector<HTMLElement>(`[data-testid="${levelId(index)}"]`);
	expect(panel).not.toBeNull();

	return panel as HTMLElement;
};

const rowOf = (index: number): HTMLElement =>
	within(panelOf(index)).getByRole('button', { name: `Row in ${levelId(index)}`, hidden: true });

/**
 * Whether a press at the row of the level lands on it, the way a mouse finds its target.
 */
function takesPointer(index: number): boolean {
	const row = rowOf(index);
	const box = row.getBoundingClientRect();
	if (box.width === 0 || box.height === 0) {
		return false;
	}
	const hit = document.elementFromPoint(box.x + 2, box.y + box.height / 2);

	return hit !== null && row.contains(hit);
}

let stopListening: (() => void) | undefined;

afterEach(() => {
	stopListening?.();
	stopListening = undefined;
});

/**
 * The `ArrowDown` presses that reached `document` unhandled, the way an app shortcut sees them.
 */
function listenOnDocument(): KeyboardEvent[] {
	const keys: KeyboardEvent[] = [];
	const onKeyDown = (event: KeyboardEvent): void => {
		if (!event.defaultPrevented) {
			keys.push(event);
		}
	};
	document.addEventListener('keydown', onKeyDown);
	stopListening = () => document.removeEventListener('keydown', onKeyDown);

	return keys;
}

describe('Drawer chains, every stack and type', () => {
	it.each(allChains().map((levels) => [nameOf(levels), levels] as const))(
		'%s',
		async (_, levels) => {
			const closes: [number, DrawerCloseReasonType][] = [];
			render(<Chain levels={levels} closes={closes} />);
			const top = levels.length - 1;
			await waitFor(() => {
				expect(panelOf(top)).toBeVisible();
			});
			await waitForSettled();

			const want = expected(levels);
			const backdrops = [
				...document.querySelectorAll<HTMLElement>('[data-slot="drawer-backdrop"]'),
			];
			for (const [index, level] of want.entries()) {
				const panel = panelOf(index);
				const label = `${levelId(index)} of ${nameOf(levels)}`;

				expect
					.soft(
						backdrops.some((backdrop) => backdrop.dataset.testid === `${levelId(index)}-backdrop`),
						`${label}: backdrop`,
					)
					.toBe(level.backdrop);
				expect
					.soft(panel.getAttribute('aria-modal') === 'true', `${label}: modal`)
					.toBe(level.modal);
				expect.soft(panel.inert, `${label}: inert`).toBe(level.inert);
				expect
					.soft(panel.getAttribute('data-covered') === 'breadcrumb', `${label}: hidden`)
					.toBe(level.hidden);
				expect.soft(takesPointer(index), `${label}: takes the pointer`).toBe(level.reachable);
			}

			for (const [index, level] of want.entries()) {
				if (!level.reachable) {
					continue;
				}
				await browserUser.click(rowOf(index));
				expect(document.activeElement, `${levelId(index)}: focus after a press`).toBe(rowOf(index));
				const keys = listenOnDocument();
				await browserUser.keyboard('{ArrowDown}');
				expect
					.soft(
						keys.length > 0,
						`${levelId(index)} of ${nameOf(levels)}: arrow keys reach the page`,
					)
					.toBe(level.keysReachPage);
				stopListening?.();
				expect.soft(closes, `${levelId(index)}: a press leaves every drawer open`).toEqual([]);
			}

			await browserUser.click(rowOf(top));
			await browserUser.keyboard('{Escape}');
			await waitFor(() => {
				expect(document.querySelector(`[data-testid="${levelId(top)}"]`)).toBeNull();
			});
			expect(closes, 'Esc closes the drawer on top only').toEqual([[top, 'escape-key']]);
		},
	);
});
