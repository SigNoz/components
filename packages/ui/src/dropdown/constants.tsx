/**
 * What kind of row an entry of `items` renders.
 *
 * The discriminant is required on every entry, including the plain action row. A union where five
 * members carry a discriminant and one declares `type?: never` cannot narrow on an excess property
 * check: TypeScript gives up and blames whichever member came first.
 */
export const DropdownItemKind = {
	Item: 'item',
	Submenu: 'submenu',
	Group: 'group',
	Separator: 'separator',
	RadioGroup: 'radio-group',
	Checkbox: 'checkbox',
} as const;

/**
 * What a row shows when its `label` renders nothing.
 *
 * Labels are hardcoded at nearly every call site, so an empty one is a bug rather than a state. The
 * row still renders: hiding it would take an action out of the menu without saying so.
 */
export const DROPDOWN_EMPTY_LABEL = '<No label>';

/**
 * What a menu shows when it has nothing to put in it.
 *
 * An empty `items` is a consumer bug, so it also logs a warning. An empty search result is a state
 * rather than a bug, so it shows this row and logs nothing.
 */
export const DROPDOWN_EMPTY_CONTENT = '<No content>';

/**
 * The gap between the trigger and the popup, in pixels.
 *
 * Not a custom property: Base UI takes the offset as a number on the positioner, so a token could
 * only reach it by reading computed style on every open.
 */
export const DROPDOWN_SIDE_OFFSET = 4;

/**
 * What the toast says when an async `onClick` rejects with something that is not an `Error`.
 *
 * A handler that wants its own copy catches its own error and resolves `false`, which keeps the
 * menu open and raises nothing.
 *
 * @access private
 */
export const DROPDOWN_ACTION_ERROR_MESSAGE = 'Something went wrong.';

/**
 * The accessible name of the pinned search row, used when `searchInputProps.placeholder` gives no
 * other one. A field the user cannot see a label for still needs one.
 *
 * @access private
 */
export const DROPDOWN_SEARCH_LABEL = 'Search';

/**
 * The keys the search row lets through to the menu. Every other key stops at the field, so Base
 * UI's typeahead does not race the text the user is typing.
 *
 * @access private
 */
export const DROPDOWN_SEARCH_PASSTHROUGH_KEYS = ['ArrowDown', 'ArrowUp', 'Escape', 'Tab'];

/**
 * The rows the arrow keys walk, as the DOM can find them. Base UI sets the role on each one.
 *
 * @access private
 */
export const DROPDOWN_ROW_SELECTOR =
	'[role="menuitem"],[role="menuitemcheckbox"],[role="menuitemradio"]';
