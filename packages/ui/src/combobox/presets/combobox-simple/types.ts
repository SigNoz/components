import type * as React from 'react';

export type ComboboxSimpleItem = {
	/**
	 * Unique value for the option.
	 */
	value: string;
	/**
	 * Display content for the option. Can be string or ReactNode (e.g. icon + text).
	 */
	label: React.ReactNode;
	/**
	 * Optional string to show in the trigger instead of label. Use when label is ReactNode but you want plain text in the trigger.
	 */
	displayValue?: string;
	/**
	 * When set, item becomes a "hint" that inserts this value into input instead of selecting.
	 * Useful for suggestions like "status:" that let users continue typing.
	 */
	insertValue?: string;
	/**
	 * Additional keywords for filtering. Useful when value differs from searchable text.
	 * E.g. value="15" with keywords=["15 minutes", "quarter hour"]
	 */
	keywords?: string[];
};

export type ComboboxSimpleGroup = {
	/**
	 * Optional heading for the group. Can be string or ReactNode.
	 */
	heading?: React.ReactNode;
	/**
	 * Items in this group.
	 */
	items: ComboboxSimpleItem[];
};

export type VirtualizedRowData =
	| { type: 'item'; item: ComboboxSimpleItem }
	| { type: 'custom'; value: string }
	| { type: 'create'; value: string }
	| { type: 'group-heading'; heading: React.ReactNode }
	| { type: 'separator' };
