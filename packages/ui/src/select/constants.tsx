/**
 * What kind of row an entry of `items` renders.
 */
export const SelectItemKind = {
	Item: 'item',
	Group: 'group',
	Separator: 'separator',
} as const;

/**
 * What a row shows when its `label` renders nothing.
 */
export const SELECT_EMPTY_LABEL = '<No label>';

/**
 * What the popup shows when `items` is empty, unless `noContent` says otherwise.
 */
export const SELECT_EMPTY_CONTENT = 'No results found :/';

/**
 * The gap between the trigger and the popup, in pixels.
 *
 * Not a custom property: Base UI takes the offset as a number on the positioner, so a token could
 * only reach it by reading computed style on every open.
 *
 * @access private
 */
export const SELECT_SIDE_OFFSET = 4;
