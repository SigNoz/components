import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { AskedDrawers, DrawerTrailEntry } from '../drawer-stack-context.js';
import type { DrawerCloseReasonType } from '../types.js';
import { useCommittedOpen } from '../use-committed-open.js';
import {
	afterAnswer,
	afterNextTask,
	buildTrail,
	closeTopFirst,
	displayTitle,
	isPromiseLike,
	leaveTrail,
	letPageKeysThrough,
	stepBackInTrail,
	toDrawerCloseReason,
} from '../utils.js';

describe('toDrawerCloseReason', () => {
	it.each(['escape-key', 'outside-press', 'close-press', 'swipe'] as const)(
		'reports %s as it is',
		(reason) => {
			expect(toDrawerCloseReason(reason)).toBe(reason);
		},
	);

	// The Android back gesture: dropped, the drawer would stay open and the next press would leave
	// the page.
	it('reports the close watcher of the platform as escape-key', () => {
		expect(toDrawerCloseReason('close-watcher')).toBe('escape-key');
	});

	it.each(['trigger-press', 'focus-out', 'imperative-action', 'none'])(
		'reports nothing for %s, which no drawer without a trigger closes for',
		(reason) => {
			expect(toDrawerCloseReason(reason)).toBeUndefined();
		},
	);
});

describe('letPageKeysThrough', () => {
	function pressKey(key: string) {
		const preventBaseUIHandler = vi.fn();
		letPageKeysThrough({ key, preventBaseUIHandler } as unknown as Parameters<
			typeof letPageKeysThrough
		>[0]);

		return preventBaseUIHandler;
	}

	it.each(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'])(
		'skips the Base UI handler for %s',
		(key) => {
			expect(pressKey(key)).toHaveBeenCalledTimes(1);
		},
	);

	// Skipping the Base UI handler skips the one that reads Escape, so only the six keys may.
	it.each(['Escape', 'Enter', 'PageDown', 'Tab', 'a'])(
		'keeps the Base UI handler for %s',
		(key) => {
			expect(pressKey(key)).not.toHaveBeenCalled();
		},
	);
});

describe('displayTitle', () => {
	it('takes the first title that renders something', () => {
		expect(displayTitle('pod', 'Pod details')).toBe('pod');
		expect(displayTitle(undefined, 'Pod details')).toBe('Pod details');
	});

	it.each([
		['an empty string', ''],
		['whitespace', '  '],
		['null', null],
		['false', false],
	])('skips %s', (_name, blank) => {
		expect(displayTitle(blank, 'Pod details')).toBe('Pod details');
	});

	it('falls back to `<No title>` when no title renders anything', () => {
		expect(displayTitle(' ', '')).toBe('<No title>');
		expect(displayTitle('')).toBe('<No title>');
	});
});

/**
 * One drawer of a trail. Its `close` records the reason and answers whether it agreed. It closes the
 * drawer, unless it refuses, as a drawer that calls `cancel()` does, or `stays` open without
 * refusing, as one whose app closes it later does.
 */
function drawer(name: string, log: string[], { refuses = false, stays = false } = {}) {
	let open = true;

	return {
		close: vi.fn((reason: DrawerCloseReasonType, _asked?: AskedDrawers) => {
			log.push(`${name}:${reason}`);
			open = refuses || stays;

			return !refuses;
		}),
		isOpen: () => open,
	};
}

function entry(
	title: string,
	{ close, isOpen }: Pick<DrawerTrailEntry, 'close' | 'isOpen'>,
	select?: DrawerTrailEntry['select'],
): DrawerTrailEntry {
	return { title, close, isOpen, select };
}

describe('buildTrail', () => {
	const close = vi.fn();
	const closeNested = vi.fn(() => true);
	const isOpen = () => true;

	it('appends the steps, then the crumb, to the trail of the parent', () => {
		const parent = entry('cluster', drawer('cluster', []));
		const trail = buildTrail({
			parentTrail: [parent],
			steps: [{ title: 'node', href: '#node' }, { title: 'namespace' }],
			crumb: { title: 'pod', preview: 'About the pod' },
			title: 'Pod details',
			close,
			closeNested,
			isOpen,
			onTrailSelect: undefined,
		});

		expect(trail.map((item) => item.title)).toEqual(['cluster', 'node', 'namespace', 'pod']);
		expect(trail[0]).toBe(parent);
		expect(trail[1]?.href).toBe('#node');
		expect(trail[3]?.preview).toBe('About the pod');
		expect(trail[3]?.select).toBeUndefined();
		for (const own of trail.slice(1)) {
			expect(own.close).toBe(close);
			expect(own.isOpen).toBe(isOpen);
		}
	});

	it('selects a step by its index among the steps', () => {
		const onTrailSelect = vi.fn();
		const trail = buildTrail({
			parentTrail: [entry('cluster', drawer('cluster', []))],
			steps: [{ title: 'node' }, { title: 'namespace' }],
			crumb: undefined,
			title: 'pod',
			close,
			closeNested,
			isOpen,
			onTrailSelect,
		});

		trail[2]?.select?.('crumb-press');

		expect(onTrailSelect).toHaveBeenCalledExactlyOnceWith(1, 'crumb-press', { title: 'namespace' });
	});

	it('closes the drawers nested in its own before it selects a step', () => {
		const log: string[] = [];
		const onTrailSelect = vi.fn(() => {
			log.push('select');
		});
		const trail = buildTrail({
			parentTrail: [],
			steps: [{ title: 'node' }],
			crumb: undefined,
			title: 'pod',
			close,
			closeNested: (reason) => {
				log.push(`nested:${reason}`);

				return true;
			},
			isOpen,
			onTrailSelect,
		});

		trail[0]?.select?.('crumb-press');

		expect(log).toEqual(['nested:crumb-press', 'select']);
	});

	it('hands the press to the drawers nested in its own', () => {
		const asked: AskedDrawers = new Set();
		const closeNestedSpy = vi.fn(() => true);
		const trail = buildTrail({
			parentTrail: [],
			steps: [{ title: 'node' }],
			crumb: undefined,
			title: 'pod',
			close,
			closeNested: closeNestedSpy,
			isOpen,
			onTrailSelect: vi.fn(),
		});

		trail[0]?.select?.('crumb-press', asked);

		expect(closeNestedSpy).toHaveBeenCalledExactlyOnceWith('crumb-press', asked);
	});

	it('selects no step while a drawer nested in its own cancels', () => {
		const onTrailSelect = vi.fn();
		const trail = buildTrail({
			parentTrail: [],
			steps: [{ title: 'node' }],
			crumb: undefined,
			title: 'pod',
			close,
			closeNested: () => false,
			isOpen,
			onTrailSelect,
		});

		trail[0]?.select?.('escape-key');

		expect(onTrailSelect).not.toHaveBeenCalled();
	});

	it('names the crumb after the title of the drawer, then `<No title>`', () => {
		const crumbOf = (crumbTitle: string | undefined, title: string) =>
			buildTrail({
				parentTrail: [],
				steps: [],
				crumb: crumbTitle === undefined ? undefined : { title: crumbTitle },
				title,
				close,
				closeNested,
				isOpen,
				onTrailSelect: undefined,
			})[0]?.title;

		expect(crumbOf(undefined, 'pod')).toBe('pod');
		expect(crumbOf(' ', 'pod')).toBe('pod');
		expect(crumbOf('', '')).toBe('<No title>');
	});
});

describe('closeTopFirst', () => {
	it('asks the drawer on top first, then the ones under it, and answers true', () => {
		const log: string[] = [];

		const agreed = closeTopFirst(
			[drawer('pod', log), drawer('trace', log), drawer('log', log)],
			'close-press',
		);

		expect(agreed).toBe(true);
		expect(log).toEqual(['log:close-press', 'trace:close-press', 'pod:close-press']);
	});

	it('stops at a drawer that cancels, and answers false', () => {
		const log: string[] = [];

		const agreed = closeTopFirst(
			[drawer('pod', log), drawer('trace', log, { refuses: true }), drawer('log', log)],
			'close-press',
		);

		expect(agreed).toBe(false);
		expect(log).toEqual(['log:close-press', 'trace:close-press']);
	});

	it('goes on past a drawer that stays open without cancelling', () => {
		const log: string[] = [];

		const agreed = closeTopFirst(
			[drawer('pod', log), drawer('trace', log, { stays: true }), drawer('log', log)],
			'close-press',
		);

		expect(agreed).toBe(true);
		expect(log).toEqual(['log:close-press', 'trace:close-press', 'pod:close-press']);
	});

	it('skips a drawer that is closed already, and one that shares its close with an earlier entry', () => {
		const log: string[] = [];
		const closedAlready = { ...drawer('trace', log), isOpen: () => false };
		const node = drawer('node', log);

		const agreed = closeTopFirst(
			[entry('node step', node), entry('node', node), closedAlready],
			'swipe',
		);

		expect(agreed).toBe(true);
		expect(closedAlready.close).not.toHaveBeenCalled();
		expect(node.close).toHaveBeenCalledOnce();
	});

	it('leaves out the drawers of the press that were asked already', () => {
		const log: string[] = [];
		const node = drawer('node', log);
		const asked: AskedDrawers = new Set([node.isOpen]);

		const agreed = closeTopFirst([entry('node', node), drawer('pod', log)], 'crumb-press', asked);

		expect(agreed).toBe(true);
		expect(log).toEqual(['pod:crumb-press']);
	});

	it('adds each drawer it asks to the press, and hands the press to its close', () => {
		const log: string[] = [];
		const pod = drawer('pod', log);
		const asked: AskedDrawers = new Set();

		closeTopFirst([pod], 'swipe', asked);

		expect(asked).toEqual(new Set([pod.isOpen]));
		expect(pod.close).toHaveBeenCalledExactlyOnceWith('swipe', asked);
	});
});

/**
 * A drawer whose `close` answers with `answer`, a promise for one whose `onClose` returned one.
 */
function deciding(name: string, log: string[], answer: Promise<boolean>) {
	return {
		close: vi.fn((reason: DrawerCloseReasonType, _asked?: AskedDrawers) => {
			log.push(`${name}:${reason}`);

			return answer;
		}),
		isOpen: () => true,
	};
}

describe('closeTopFirst with an answer that is a promise', () => {
	it('waits for the answer, then asks the drawer under it, and answers with a promise of true', async () => {
		const log: string[] = [];
		let agree: (agreed: boolean) => void = () => {};
		const answer = new Promise<boolean>((resolve) => {
			agree = resolve;
		});

		const agreed = closeTopFirst(
			[drawer('pod', log), deciding('trace', log, answer), drawer('log', log)],
			'close-press',
		);

		expect(agreed).toBeInstanceOf(Promise);
		expect(log).toEqual(['log:close-press', 'trace:close-press']);

		agree(true);

		await expect(agreed).resolves.toBe(true);
		expect(log).toEqual(['log:close-press', 'trace:close-press', 'pod:close-press']);
	});

	it('asks no drawer under one whose promise answers false, and answers with a promise of false', async () => {
		const log: string[] = [];

		const agreed = closeTopFirst(
			[drawer('pod', log), deciding('trace', log, Promise.resolve(false))],
			'swipe',
		);

		await expect(agreed).resolves.toBe(false);
		expect(log).toEqual(['trace:swipe']);
	});

	it('answers with a boolean, not a promise, when every drawer answers at once', () => {
		const log: string[] = [];

		expect(closeTopFirst([drawer('pod', log), drawer('log', log)], 'close-press')).toBe(true);
		expect(
			closeTopFirst([drawer('pod', log), drawer('log', log, { refuses: true })], 'close-press'),
		).toBe(false);
	});
});

describe('isPromiseLike', () => {
	it('recognizes a callable thenable but treats an ordinary function as synchronous', () => {
		const done = Promise.resolve();
		const callable = Object.assign(() => {}, {
			// oxlint-disable-next-line unicorn/no-thenable -- this function implements PromiseLike
			then: done.then.bind(done),
		});

		expect(isPromiseLike(callable)).toBe(true);
		expect(isPromiseLike(() => {})).toBe(false);
	});
});

describe('afterAnswer', () => {
	it('calls next in the same call for an answer that is not a promise, and answers with its result', () => {
		const next = vi.fn((agreed: boolean) => !agreed);

		expect(afterAnswer(false, next)).toBe(true);
		expect(next).toHaveBeenCalledExactlyOnceWith(false);
	});

	it('calls next once a promise answer settles, and answers with a promise of its result', async () => {
		const next = vi.fn((agreed: boolean) => agreed);

		const answer = afterAnswer(Promise.resolve(true), next);

		expect(next).not.toHaveBeenCalled();
		await expect(answer).resolves.toBe(true);
		expect(next).toHaveBeenCalledExactlyOnceWith(true);
	});
});

describe('afterNextTask', () => {
	it('hands on the value in a task of its own, after the microtasks that follow it', async () => {
		const log: string[] = [];

		const handedOn = afterNextTask('agreed').then((value) => {
			log.push(value);
		});
		await Promise.resolve();
		await Promise.resolve();

		expect(log).toEqual([]);
		await handedOn;
		expect(log).toEqual(['agreed']);
	});
});

describe('leaveTrail', () => {
	it('closes every drawer with the reason, the one on top first, each once', () => {
		const log: string[] = [];
		const cluster = drawer('cluster', log);
		const node = drawer('node', log);
		const trail = [
			entry('cluster', cluster),
			entry('node step', node),
			entry('node', node),
			entry('pod', drawer('pod', log)),
		];

		leaveTrail(trail, 'close-press');

		expect(log).toEqual(['pod:close-press', 'node:close-press', 'cluster:close-press']);
		expect(node.close).toHaveBeenCalledOnce();
	});

	it('stops at a drawer that cancels', () => {
		const log: string[] = [];
		const trail = [
			entry('cluster', drawer('cluster', log)),
			entry('node', drawer('node', log, { refuses: true })),
			entry('pod', drawer('pod', log)),
		];

		leaveTrail(trail, 'swipe');

		expect(log).toEqual(['pod:swipe', 'node:swipe']);
	});

	it('goes on past a drawer that stays open without cancelling', () => {
		const log: string[] = [];
		const trail = [
			entry('cluster', drawer('cluster', log)),
			entry('node', drawer('node', log, { stays: true })),
			entry('pod', drawer('pod', log)),
		];

		leaveTrail(trail, 'swipe');

		expect(log).toEqual(['pod:swipe', 'node:swipe', 'cluster:swipe']);
	});

	it('skips a drawer that is closed already', () => {
		const log: string[] = [];
		const trace = { ...drawer('trace', log), isOpen: () => false };
		const trail = [entry('cluster', drawer('cluster', log)), entry('trace', trace)];

		leaveTrail(trail, 'close-press');

		expect(log).toEqual(['cluster:close-press']);
		expect(trace.close).not.toHaveBeenCalled();
	});
});

describe('stepBackInTrail', () => {
	it('closes every drawer after the crumb, the one on top first, then selects the crumb', () => {
		const log: string[] = [];
		const select = vi.fn(() => {
			log.push('select');
		});
		const node = drawer('node', log);
		const trail = [
			entry('cluster', drawer('cluster', log)),
			entry('node step', node, select),
			entry('node', node),
			entry('pod', drawer('pod', log)),
			entry('log', drawer('log', log)),
		];

		stepBackInTrail(trail, 1);

		expect(log).toEqual(['log:crumb-press', 'pod:crumb-press', 'select']);
		expect(node.close).not.toHaveBeenCalled();
	});

	it('closes nothing more and selects nothing once a drawer cancels', () => {
		const log: string[] = [];
		const select = vi.fn();
		const node = drawer('node', log);
		const trail = [
			entry('node step', node, select),
			entry('node', node),
			entry('pod', drawer('pod', log, { refuses: true })),
			entry('log', drawer('log', log)),
		];

		stepBackInTrail(trail, 0);

		expect(log).toEqual(['log:crumb-press', 'pod:crumb-press']);
		expect(select).not.toHaveBeenCalled();
	});

	it('goes on to select the crumb past a drawer that stays open without cancelling', () => {
		const log: string[] = [];
		const select = vi.fn(() => {
			log.push('select');
		});
		const node = drawer('node', log);
		const trail = [
			entry('node step', node, select),
			entry('node', node),
			entry('pod', drawer('pod', log, { stays: true })),
		];

		stepBackInTrail(trail, 0);

		expect(log).toEqual(['pod:crumb-press', 'select']);
	});

	it('hands the drawer it steps into to the select, so it is not asked again', () => {
		const log: string[] = [];
		const select = vi.fn<NonNullable<DrawerTrailEntry['select']>>();
		const node = drawer('node', log);
		const trail = [
			entry('node step', node, select),
			entry('node', node),
			entry('pod', drawer('pod', log)),
		];

		stepBackInTrail(trail, 0);

		const asked = select.mock.calls[0]?.[1];
		expect(select).toHaveBeenCalledExactlyOnceWith('crumb-press', asked);
		expect(asked?.has(node.isOpen)).toBe(true);
		expect(node.close).not.toHaveBeenCalled();
	});

	it('discards a press when the target closes and reopens before the child answers', async () => {
		const { result, rerender } = renderHook((open: boolean) => useCommittedOpen(open), {
			initialProps: true,
		});
		const select = vi.fn();
		const target = { title: 'Earlier step', close: vi.fn(), isOpen: result.current, select };
		let agree = () => {};
		const answer = new Promise<boolean>((resolve) => {
			agree = () => resolve(true);
		});
		const child = deciding('child', [], answer);

		stepBackInTrail([target, entry('Child', child)], 0);
		expect(child.close).toHaveBeenCalledOnce();
		rerender(false);
		rerender(true);
		await act(async () => agree());

		expect(result.current()).toBe(true);
		expect(select).not.toHaveBeenCalled();
	});

	it('does nothing for an index past the trail', () => {
		const log: string[] = [];

		stepBackInTrail([entry('cluster', drawer('cluster', log))], 3);

		expect(log).toEqual([]);
	});
});
