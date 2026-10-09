import { describe, expect, it } from 'vitest';
import type { CommandActionItemType, CommandItemType } from '../types.js';
import {
	type CommandSection,
	groupJumpIndex,
	rankCommandSections,
	toCommandSections,
} from '../utils.js';

function item(
	value: string,
	label: CommandActionItemType['label'] = value,
	searchMetadata?: string,
) {
	return { type: 'item', value, label, searchMetadata, onClick: () => {} } as const;
}

function shape(sections: CommandSection[]) {
	return sections.map((section) => ({
		group: section.group?.value,
		rows: section.rows.map((row) => row.item.value),
	}));
}

const ITEMS: CommandItemType[] = [
	item('home', 'Go to Home'),
	{
		type: 'group',
		value: 'navigation',
		label: 'Navigation',
		items: [item('go-dashboards', 'Go to Dashboards'), item('logs', 'Logs Explorer')],
	},
	item('dark-mode', 'Toggle Dark Mode'),
	{
		type: 'group',
		value: 'pages',
		label: 'Pages',
		items: [item('dashboards', 'Dashboards'), item('members', 'Settings / Members', 'zebra users')],
	},
	item('api-keys', 'API keys'),
];

describe('toCommandSections', () => {
	it('keeps every row in the order of items', () => {
		expect(shape(toCommandSections(ITEMS))).toEqual([
			{ group: undefined, rows: ['home'] },
			{ group: 'navigation', rows: ['go-dashboards', 'logs'] },
			{ group: undefined, rows: ['dark-mode'] },
			{ group: 'pages', rows: ['dashboards', 'members'] },
			{ group: undefined, rows: ['api-keys'] },
		]);
	});

	it('keeps neighbouring loose rows in one section', () => {
		expect(shape(toCommandSections([item('a'), item('b')]))).toEqual([
			{ group: undefined, rows: ['a', 'b'] },
		]);
	});

	it('leaves out a group with no row, and keeps the rows around it one run', () => {
		expect(
			shape(
				toCommandSections([
					{ type: 'group', value: 'empty', label: 'Empty', items: [] },
					item('a'),
					{ type: 'group', value: 'loading', label: 'Loading', items: [] },
					item('b'),
				]),
			),
		).toEqual([{ group: undefined, rows: ['a', 'b'] }]);
	});

	it('reads the text out of an element label', () => {
		const [section] = toCommandSections([
			item(
				'home',
				<span>
					Go to <strong>Home</strong>
				</span>,
			),
		]);

		expect(section?.rows[0]?.searchText).toBe('Go to Home');
	});
});

describe('rankCommandSections', () => {
	const sections = toCommandSections(ITEMS);

	it('returns every section for an empty or blank query', () => {
		expect(shape(rankCommandSections(sections, ''))).toEqual(shape(sections));
		expect(shape(rankCommandSections(sections, '   '))).toEqual(shape(sections));
	});

	it('ranks a word start above a letter in the middle, and the group with it', () => {
		expect(shape(rankCommandSections(sections, 'dshb'))).toEqual([
			{ group: 'pages', rows: ['dashboards'] },
			{ group: 'navigation', rows: ['go-dashboards'] },
		]);
	});

	it('drops a section with no matching row', () => {
		expect(shape(rankCommandSections(sections, 'tdm'))).toEqual([
			{ group: undefined, rows: ['dark-mode'] },
		]);
	});

	it('matches searchMetadata', () => {
		expect(shape(rankCommandSections(sections, 'zebr'))).toEqual([
			{ group: 'pages', rows: ['members'] },
		]);
	});

	it('drops every row when nothing matches', () => {
		expect(rankCommandSections(sections, 'xyz')).toEqual([]);
	});

	it('ranks the rows outside any group as one run, across the groups between them', () => {
		const split = toCommandSections([
			item('later', 'Run later'),
			{ type: 'group', value: 'jobs', label: 'Jobs', items: [item('now', 'Run now')] },
			item('run', 'Run'),
		]);

		expect(shape(rankCommandSections(split, 'run'))).toEqual([
			{ group: undefined, rows: ['run', 'later'] },
			{ group: 'jobs', rows: ['now'] },
		]);
	});

	it('puts the rows outside any group above the groups, as cmdk does', () => {
		const split = toCommandSections([
			{ type: 'group', value: 'jobs', label: 'Jobs', items: [item('run', 'Run')] },
			item('later', 'Run later'),
		]);

		expect(shape(rankCommandSections(split, 'run'))).toEqual([
			{ group: undefined, rows: ['later'] },
			{ group: 'jobs', rows: ['run'] },
		]);
	});
});

describe('groupJumpIndex', () => {
	// Rows in order: home, then go-dashboards and logs in Navigation, dark-mode, then dashboards and
	// members in Pages, then api-keys.
	const sections = toCommandSections(ITEMS);

	it('goes to the first row of the next group, past the rows outside any group', () => {
		expect(groupJumpIndex(sections, 2, 1)).toBe(4);
	});

	it('goes to the first row of the previous group', () => {
		expect(groupJumpIndex(sections, 5, -1)).toBe(1);
	});

	it('returns undefined when no group lies that way', () => {
		expect(groupJumpIndex(sections, 4, 1)).toBeUndefined();
		expect(groupJumpIndex(sections, 1, -1)).toBeUndefined();
	});

	it('returns undefined for a row outside any group, or no row', () => {
		expect(groupJumpIndex(sections, 3, 1)).toBeUndefined();
		expect(groupJumpIndex(sections, -1, 1)).toBeUndefined();
	});
});
