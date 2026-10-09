import type { AriaAttributes, ComponentProps, ReactElement, ReactNode } from 'react';
import type { CommandItemKind } from './constants.js';

export type CommandItemKindType = (typeof CommandItemKind)[keyof typeof CommandItemKind];

/**
 * `disabled` and `disabledTooltip` travel together on a row.
 *
 * @note The empty branch goes last, here and in every union a row is built from. The compiler
 * explains a failed assignment against the last member, so a row missing some other prop is told
 * about that prop instead of about `disabledTooltip`.
 */
export type CommandItemDisabledType =
	| {
			/**
			 * When true, the row cannot be run: a click or `Enter` on it does nothing, and the
			 * palette stays open.
			 *
			 * @note Requires `disabledTooltip`.
			 *
			 * @note The row is marked `aria-disabled` rather than skipped, so the arrow keys still
			 * land on it and the reason stays reachable.
			 *
			 * @note Suppressed entirely while `loading` is true, along with `disabledTooltip`.
			 */
			disabled: boolean;
			/**
			 * Why this row cannot be run. Shown in a tooltip while the row is highlighted, and only
			 * while `disabled` is true.
			 *
			 * @note Only allowed alongside `disabled`. Pass `undefined` when there is no reason to
			 * give.
			 */
			disabledTooltip: ReactNode;
	  }
	| {
			disabled?: never;
			disabledTooltip?: never;
	  };

/**
 * `loading` and `loadingTooltip` travel together on a row, the same way {@link
 * CommandItemDisabledType} does.
 */
export type CommandItemLoadingType =
	| {
			/**
			 * When true, the row is waiting on something of its own: a spinner takes the leading
			 * slot, or the trailing one when the row has no prefix, and the row cannot be run.
			 *
			 * @note Requires `loadingTooltip`.
			 *
			 * @note Outranks `disabled`, the way it does on `Button`. While this is true the row is
			 * not disabled at all, whatever `disabled` says, and `disabledTooltip` does not render.
			 *
			 * @note The arrow keys still land on the row, which is what makes `loadingTooltip`
			 * reachable by keyboard.
			 */
			loading: boolean;
			/**
			 * What the row is waiting for, shown in a tooltip while the row is highlighted and
			 * `loading` is true.
			 *
			 * @note Only allowed alongside `loading`. Pass `undefined` when there is no reason to
			 * give.
			 */
			loadingTooltip: ReactNode;
	  }
	| {
			loading?: never;
			loadingTooltip?: never;
	  };

// The row is cut into named parts because the compiler spreads the unions below into one member per
// combination, and names only what has a name. A row missing `onClick` is told about
// `CommandItemBaseType`, not about the whole row written out three times.
type CommandItemBaseType = {
	// Required on the plain row too. On a union where one member declares `type?: never`,
	// TypeScript cannot narrow an excess property check and blames the first member.
	type: typeof CommandItemKind.Item;
	/**
	 * What the user reads on the row. Also its accessible name.
	 *
	 * @note A node that renders nothing (`null`, `false` or an empty string) falls back to the text
	 * `<No label>`, and the row carries `data-empty-label`. The row still renders: an action that
	 * disappears takes a choice out of the palette without saying so.
	 */
	label: ReactNode;
	/**
	 * This row's identity. Keys the list and names the row's `data-testid`.
	 *
	 * @note Unique across the whole palette, groups included.
	 */
	value: string;
	/**
	 * Extra text the built-in search matches against, on top of the label.
	 *
	 * @note This is what makes a node label findable at all: the search reads a label only when it
	 * renders to text.
	 */
	searchMetadata?: string;
	/**
	 * Element rendered at the start of the row. An icon, sized to `--command-item-icon-size`
	 * whatever size the element carries.
	 *
	 * @note Replaced by a spinner while the row is loading. A row without one shows the spinner in
	 * the trailing slot instead, in place of the suffix or the shortcut.
	 */
	prefix?: ReactElement;
	/**
	 * Called when the row is picked, by click or by `Enter`. The palette then calls
	 * `onOpenChange(false)`, also when this throws.
	 *
	 * @note Not called while the row is `disabled` or `loading`, and the palette stays open.
	 */
	onClick: () => void;
	/**
	 * Forwarded to the row as `data-testid`.
	 *
	 * @note Optional because the palette names its rows: with a `testId` on `Command`, a row with
	 * none of its own is addressable as `` `${commandTestId}-item-${value}` ``. Write this only to
	 * give one row a name of its own, which then wins.
	 */
	testId?: string;
};

type CommandItemShortcutType = {
	suffix?: never;
	/**
	 * A keyboard shortcut, rendered in the trailing slot through `Kbd`.
	 *
	 * @note Documentation only. The component does not bind the key.
	 *
	 * @note Screen readers announce it as the row's description, after the label. A node that
	 * renders nothing, such as `isMac && '⌘K'` off a Mac, leaves the slot empty.
	 *
	 * @note Takes the trailing slot, so it cannot be combined with `suffix`.
	 */
	shortcut: ReactNode;
};

type CommandItemSuffixType = {
	/**
	 * Element rendered at the end of the row. An icon, sized to `--command-item-icon-size`.
	 */
	suffix?: ReactElement;
	shortcut?: never;
};

/**
 * One action. The row a palette is made of.
 */
export type CommandActionItemType = CommandItemBaseType &
	CommandItemDisabledType &
	CommandItemLoadingType &
	(CommandItemShortcutType | CommandItemSuffixType);

/**
 * A section heading and the rows under it.
 */
export type CommandGroupItemType = {
	type: typeof CommandItemKind.Group;
	/**
	 * The section heading, and the group's accessible name. Not a row: the arrow keys skip it.
	 */
	label: ReactNode;
	/**
	 * This group's identity. Keys the list and names the group's `data-testid`.
	 */
	value: string;
	/**
	 * The rows under the heading, in the order they are rendered while the query is empty.
	 */
	items: CommandActionItemType[];
	/**
	 * Forwarded to the group as `data-testid`. Defaults to `` `${commandTestId}-group-${value}` ``.
	 */
	testId?: string;
};

/**
 * One entry of `items`. Two kinds, told apart by `type`.
 */
export type CommandItemType = CommandActionItemType | CommandGroupItemType;

/**
 * The search field at the top of the palette.
 */
export type CommandSearchInputProps = {
	/**
	 * Placeholder text for the search field.
	 *
	 * @note Not the field's name. `label` on `Command` names it.
	 */
	placeholder: string;
	/**
	 * Element rendered at the start of the field. Defaults to the search glyph.
	 */
	prefix?: ReactElement;
	/**
	 * Element rendered at the end of the field. Empty by default.
	 */
	suffix?: ReactElement;
	/**
	 * When true, replaces `prefix` with a spinner and leaves the field usable. The server-side
	 * companion to `filter: false`: the query has gone out and the rows have not come back.
	 *
	 * @default false
	 */
	loading?: boolean;
	/**
	 * When false, the palette stops filtering and ranking `items` and only reports the query
	 * through `onChange`. The rows show in the order of `items`.
	 *
	 * @note Turn it off for rows that come from a server and are already filtered by the time they
	 * arrive.
	 *
	 * @default true
	 */
	filter?: boolean;
	/**
	 * Called with the current query on every keystroke, and with `''` when the palette closes over
	 * a query.
	 */
	onChange?: (value: string) => void;
};

interface TheTestIdPropIsCalledTestId {
	'`data-testid` is written as the `testId` prop, which lands on the palette and names every row': never;
}

/**
 * Extra constraints layered on top of {@link CommandProps} at the call site.
 *
 * Resolves to `unknown` while the props are valid, and to a rule object when they are not.
 */
export type ValidateCommandProps<T> = T extends { 'data-testid': unknown }
	? TheTestIdPropIsCalledTestId
	: unknown;

export type CommandProps = Pick<ComponentProps<'div'>, 'id'> &
	AriaAttributes & {
		/**
		 * The rows, in the order they are rendered while the query is empty. The palette owns its
		 * markup, so there are no children to compose.
		 */
		items: CommandItemType[];
		/**
		 * The accessible name of the palette and of its search field. Not shown.
		 *
		 * @note Required. The placeholder is not a name, and the palette has no visible title.
		 */
		label: string;
		/**
		 * Whether the palette is open. The palette has no trigger, so the app always holds this.
		 *
		 * @note The component does not listen for `⌘K` or `Ctrl+K`. The app binds the shortcut and
		 * sets `open`.
		 */
		open: boolean;
		/**
		 * Called with `false` when the palette closes itself: after `Esc`, a click outside, or a
		 * picked row.
		 */
		onOpenChange: (open: boolean) => void;
		/**
		 * Props for the search field. `placeholder` is required.
		 */
		searchInputProps: CommandSearchInputProps;
		/**
		 * What the list shows when no row matches the query.
		 *
		 * @note With `searchInputProps.filter: false`, it shows only while `items` is empty and
		 * `searchInputProps.loading` is false.
		 *
		 * @note `null` shows nothing. Only an omitted prop falls back to the default.
		 *
		 * @default 'No results found :/'
		 */
		noContent?: ReactNode;
		/**
		 * How wide the palette may get, written as `--command-internal-max-inline-size`. A number is
		 * written as `px`.
		 *
		 * @note The palette fills a narrower viewport, and stays centred either way.
		 *
		 * @default '32rem'
		 */
		contentMaxWidth?: number | string;
		/**
		 * How tall the rows may get before they scroll, written as
		 * `--command-internal-max-block-size`. A number is written as `px`.
		 *
		 * @note The search row stays pinned whatever this is, and the palette still stops short of
		 * the bottom of the viewport, so on a short viewport the list scrolls sooner.
		 *
		 * @default '20rem'
		 */
		contentMaxHeight?: number | string;
		/**
		 * Forwarded to the palette as `data-testid`, and the stem every part is named from.
		 */
		testId?: string;
		/**
		 * Any `data-*` prop is accepted and forwarded to the palette, alongside `aria-*`.
		 */
		[key: `data-${string}`]: unknown;
	};
