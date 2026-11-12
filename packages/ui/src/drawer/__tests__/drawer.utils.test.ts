import { describe, expect, it, vi } from 'vitest';
import type { DrawerTrailEntry } from '../drawer-stack-context.js';
import type { DrawerCloseReasonType } from '../types.js';
import {
	buildTrail,
	displayTitle,
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
 * One drawer of a trail. Its `close` records the reason and closes it, unless it refuses.
 */
function drawer(name: string, log: string[], { refuses = false } = {}) {
	let open = true;

	return {
		close: vi.fn((reason: DrawerCloseReasonType) => {
			log.push(`${name}:${reason}`);
			open = refuses;
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
	const isOpen = () => true;

	it('appends the steps, then the crumb, to the trail of the parent', () => {
		const parent = entry('cluster', drawer('cluster', []));
		const trail = buildTrail({
			parentTrail: [parent],
			steps: [{ title: 'node', href: '#node' }, { title: 'namespace' }],
			crumb: { title: 'pod', preview: 'About the pod' },
			title: 'Pod details',
			close,
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
			isOpen,
			onTrailSelect,
		});

		trail[2]?.select?.('crumb-press');

		expect(onTrailSelect).toHaveBeenCalledExactlyOnceWith(1, 'crumb-press');
	});

	it('names the crumb after the title of the drawer, then `<No title>`', () => {
		const crumbOf = (crumbTitle: string | undefined, title: string) =>
			buildTrail({
				parentTrail: [],
				steps: [],
				crumb: crumbTitle === undefined ? undefined : { title: crumbTitle },
				title,
				close,
				isOpen,
				onTrailSelect: undefined,
			})[0]?.title;

		expect(crumbOf(undefined, 'pod')).toBe('pod');
		expect(crumbOf(' ', 'pod')).toBe('pod');
		expect(crumbOf('', '')).toBe('<No title>');
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

	it('stops at a drawer that stays open', () => {
		const log: string[] = [];
		const trail = [
			entry('cluster', drawer('cluster', log)),
			entry('node', drawer('node', log, { refuses: true })),
			entry('pod', drawer('pod', log)),
		];

		leaveTrail(trail, 'swipe');

		expect(log).toEqual(['pod:swipe', 'node:swipe']);
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

	it('closes nothing more and selects nothing once a drawer stays open', () => {
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

	it('does nothing for an index past the trail', () => {
		const log: string[] = [];

		stepBackInTrail([entry('cluster', drawer('cluster', log))], 3);

		expect(log).toEqual([]);
	});
});
