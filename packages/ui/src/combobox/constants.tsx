/**
 * What kind of row an entry of `items` renders.
 */
export const ComboboxItemKind = {
	Item: 'item',
	Hint: 'hint',
	Group: 'group',
	Separator: 'separator',
} as const;

/**
 * What a row shows when its `label` renders nothing.
 */
export const COMBOBOX_EMPTY_LABEL = '<No label>';

/**
 * What the popup shows when it has no row to list, unless `noContent` says otherwise.
 */
export const COMBOBOX_EMPTY_CONTENT = 'No results found :/';

/**
 * The heading of the group that lists the selected values `items` does not have.
 */
export const COMBOBOX_CUSTOM_GROUP_LABEL = 'Custom';

/**
 * The gap between the trigger and the popup, in pixels.
 *
 * Not a custom property: Base UI takes the offset as a number on the positioner, so a token could
 * only reach it by reading computed style on every open.
 *
 * @access private
 */
export const COMBOBOX_SIDE_OFFSET = 4;

/**
 * @access private
 */
export const COMBOBOX_CLEAR_LABEL = 'Clear selection';

/**
 * The virtual list estimates every row with it, then measures.
 *
 * @access private
 */
export const COMBOBOX_ESTIMATED_ROW_SIZE = 38;
