import { commandScore } from '../lib/command-score.js';
import { toSearchText } from '../lib/search-text.js';
import type { CommandActionItemType, CommandGroupItemType, CommandItemType } from './types.js';

/**
 * @access private
 */
export type CommandRow = {
	item: CommandActionItemType;
	searchText: string;
};

/**
 * A group from `items`, or a run of rows that sit outside any group (`group` is `undefined`).
 *
 * @access private
 */
export type CommandSection = {
	group: CommandGroupItemType | undefined;
	rows: CommandRow[];
};

function toRow(item: CommandActionItemType): CommandRow {
	return { item, searchText: toSearchText(item.label) };
}

/**
 * The entries of `items` as sections, in order. A group with no row is left out, and the rows on
 * either side of it stay one run.
 *
 * @access private
 */
export function toCommandSections(items: readonly CommandItemType[]): CommandSection[] {
	const sections: CommandSection[] = [];
	let loose: CommandSection | undefined;

	for (const entry of items) {
		if (entry.type === 'group') {
			if (entry.items.length > 0) {
				loose = undefined;
				sections.push({ group: entry, rows: entry.items.map(toRow) });
			}

			continue;
		}

		if (loose === undefined) {
			loose = { group: undefined, rows: [] };
			sections.push(loose);
		}

		loose.rows.push(toRow(entry));
	}

	return sections;
}

/**
 * The rows of `rows` that match `query` with their score, best first.
 */
function rankRows(
	rows: readonly CommandRow[],
	query: string,
): Array<{ row: CommandRow; score: number }> {
	// `sort` is stable, so rows with the same score keep the order of `items`.
	return rows
		.map((row) => ({
			row,
			score: commandScore(
				row.searchText,
				query,
				row.item.searchMetadata === undefined ? [] : [row.item.searchMetadata],
			),
		}))
		.filter((entry) => entry.score > 0)
		.sort((a, b) => b.score - a.score);
}

function toRows(scored: ReadonlyArray<{ row: CommandRow }>): CommandRow[] {
	return scored.map((entry) => entry.row);
}

/**
 * Drops the rows that do not match `query` and sorts the rest best first, as cmdk does: the rows
 * outside any group rank together as one run above the groups, and the groups sort by their best
 * row. A section left with no row is dropped. An empty query keeps every row in order.
 *
 * @access private
 */
export function rankCommandSections(
	sections: readonly CommandSection[],
	query: string,
): CommandSection[] {
	if (query.trim() === '') {
		return [...sections];
	}

	const loose = rankRows(
		sections.flatMap((section) => (section.group === undefined ? section.rows : [])),
		query,
	);
	const groups: Array<{ section: CommandSection; best: number }> = [];

	for (const section of sections) {
		if (section.group === undefined) {
			continue;
		}

		const scored = rankRows(section.rows, query);
		const best = scored[0];

		if (best !== undefined) {
			groups.push({ section: { group: section.group, rows: toRows(scored) }, best: best.score });
		}
	}

	const ranked = groups.sort((a, b) => b.best - a.best).map((entry) => entry.section);

	return loose.length === 0 ? ranked : [{ group: undefined, rows: toRows(loose) }, ...ranked];
}

/**
 * The row `Alt+ArrowDown` or `Alt+ArrowUp` highlights, as cmdk does: the first row of the next
 * or the previous group, skipping the rows outside any group. `index` is the highlighted row,
 * counted across `sections` in order.
 *
 * `undefined` when that row sits outside a group or no group lies that way. The key then moves
 * one row.
 *
 * @access private
 */
export function groupJumpIndex(
	sections: readonly CommandSection[],
	index: number,
	direction: 1 | -1,
): number | undefined {
	const starts: number[] = [];
	let start = 0;

	for (const section of sections) {
		starts.push(start);
		start += section.rows.length;
	}

	const current = sections.findIndex(
		(section, position) =>
			index >= (starts[position] ?? 0) && index < (starts[position] ?? 0) + section.rows.length,
	);

	if (current === -1 || sections[current]?.group === undefined) {
		return undefined;
	}

	for (
		let position = current + direction;
		position >= 0 && position < sections.length;
		position += direction
	) {
		if (sections[position]?.group !== undefined) {
			return starts[position];
		}
	}

	return undefined;
}

/**
 * Whether a row cannot be run: it is loading or disabled.
 *
 * @access private
 */
export function isCommandItemInert(item: CommandActionItemType): boolean {
	return item.loading === true || item.disabled === true;
}

/**
 * Runs the picked row's `onClick`, then closes the palette, also when `onClick` throws.
 *
 * A function of its own because React Compiler cannot compile a `finally` inside a component.
 *
 * @access private
 */
export function runThenClose(
	item: CommandActionItemType,
	onOpenChange: (open: boolean) => void,
): void {
	try {
		item.onClick();
	} finally {
		onOpenChange(false);
	}
}

type KeyEvent = {
	key: string;
	ctrlKey: boolean;
	shiftKey: boolean;
	altKey: boolean;
	metaKey: boolean;
};

type NavigationKey = 'ArrowDown' | 'ArrowUp' | 'Home' | 'End';

/**
 * Where a cmdk key moves the highlight: one row, the first or the last row, or the first row of
 * the next or the previous group.
 *
 * @access private
 */
export type CommandMove = { direction: 1 | -1; to: 'row' | 'edge' | 'group' };

/**
 * @access private
 */
export function hasModifier(event: KeyEvent): boolean {
	return event.ctrlKey || event.shiftKey || event.altKey || event.metaKey;
}

/**
 * Which way a key moves the highlight: the arrows, and cmdk's `Ctrl+N` and `Ctrl+J` down,
 * `Ctrl+P` and `Ctrl+K` up.
 */
function readDirection(event: KeyEvent): 1 | -1 | undefined {
	if (event.key === 'ArrowDown' || (event.ctrlKey && (event.key === 'n' || event.key === 'j'))) {
		return 1;
	}

	if (event.key === 'ArrowUp' || (event.ctrlKey && (event.key === 'p' || event.key === 'k'))) {
		return -1;
	}

	return undefined;
}

/**
 * The cmdk move a key makes, in cmdk's order: `Home` and `End` go to the first and the last row,
 * so does `Meta` with a direction, `Alt` with one goes to the next or the previous group, and a
 * `Ctrl` letter moves one row. A plain arrow is `undefined`: Base UI takes it as it is.
 *
 * @access private
 */
export function readCommandMove(event: KeyEvent): CommandMove | undefined {
	if (event.key === 'Home' || event.key === 'End') {
		return { direction: event.key === 'End' ? 1 : -1, to: 'edge' };
	}

	const direction = readDirection(event);

	if (direction === undefined) {
		return undefined;
	}

	if (event.metaKey) {
		return { direction, to: 'edge' };
	}

	if (event.altKey) {
		return { direction, to: 'group' };
	}

	return event.key.startsWith('Arrow') ? undefined : { direction, to: 'row' };
}

// The events `replayKey` sends. The key handler lets them through to Base UI untouched.
const replayedEvents = new WeakSet<Event>();

/**
 * Whether `replayKey` sent this event.
 *
 * @access private
 */
export function isReplayedKey(event: Event): boolean {
	return replayedEvents.has(event);
}

/**
 * Sends `key` to the field `times` times, as plain key presses, and keeps the caret where it was.
 *
 * Base UI has no way to move the highlight from outside. Its list navigation reads plain keys on
 * the field, so a cmdk key replays as the plain keys that reach the same row. Base UI also moves
 * the caret on `Home` and `End`, and cmdk's keys leave it where it was.
 *
 * This leans on how Base UI handles keys, which no type checks. `@base-ui/react` is pinned to one
 * version, and `command.interaction.test.tsx` covers every key replayed here: run it on an upgrade.
 *
 * @access private
 */
export function replayKey(input: HTMLInputElement, key: NavigationKey, times = 1): void {
	const { selectionStart, selectionEnd, selectionDirection } = input;

	for (let step = 0; step < times; step += 1) {
		const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
		replayedEvents.add(event);
		input.dispatchEvent(event);
	}

	input.setSelectionRange(selectionStart, selectionEnd, selectionDirection ?? undefined);
}
