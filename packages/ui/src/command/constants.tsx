/**
 * What kind of row an entry of `items` renders.
 */
export const CommandItemKind = {
	Item: 'item',
	Group: 'group',
} as const;

/**
 * What a row shows when its `label` renders nothing.
 */
export const COMMAND_EMPTY_LABEL = '<No label>';

/**
 * What the list shows when no row matches the query, unless `noContent` says otherwise.
 */
export const COMMAND_EMPTY_CONTENT = 'No results found :/';
