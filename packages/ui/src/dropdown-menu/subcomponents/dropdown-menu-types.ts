import type * as React from 'react';

/**
 * Base properties shared by all menu items.
 */
export type BaseMenuItem = {
	/**
	 * Unique key for the item. If not provided, the index will be used.
	 */
	key?: string;
	/**
	 * The label content to display.
	 */
	label?: React.ReactNode;
	/**
	 * When `true`, prevents the user from interacting with the item.
	 */
	disabled?: boolean;
	/**
	 * Optional icon to display before the label.
	 */
	icon?: React.ReactNode;
	/**
	 * Optional icon to display after the label.
	 */
	rightIcon?: React.ReactNode;
	/**
	 * Keyboard shortcut text to display.
	 */
	shortcut?: React.ReactNode;
	/**
	 * Event handler called when the item is selected.
	 */
	onClick?: (info: { key: string; keyPath: string[] }) => void;
	/**
	 * When `true`, the item will be styled as destructive (e.g., delete actions).
	 */
	danger?: boolean;
	/**
	 * Additional CSS classes to apply to the item.
	 */
	className?: string;
};

/**
 * A group of menu items with a label header.
 */
export type MenuGroup = BaseMenuItem & {
	/**
	 * Identifies this item as a group.
	 */
	type: 'group';
	/**
	 * The label for the group header.
	 */
	label: string;
	/**
	 * The child items in the group.
	 */
	children: MenuItem[];
};

/**
 * A visual divider between menu items.
 */
export type MenuDivider = {
	/**
	 * Identifies this item as a divider.
	 */
	type: 'divider';
	/**
	 * Optional key for the divider.
	 */
	key?: string;
};

/**
 * A menu item with a submenu.
 */
export type SubMenuItem = BaseMenuItem & {
	/**
	 * The child items in the submenu.
	 */
	children: MenuItem[];
};

/**
 * A checkbox menu item that can be checked or unchecked.
 */
export type CheckboxMenuItem = BaseMenuItem & {
	/**
	 * Identifies this item as a checkbox.
	 */
	type: 'checkbox';
	/**
	 * Unique key for the checkbox item.
	 */
	key: string;
	/**
	 * The label content to display.
	 */
	label: React.ReactNode;
	/**
	 * The controlled checked state.
	 */
	checked?: boolean;
	/**
	 * Event handler called when the checked state changes.
	 */
	onCheckedChange?: (checked: boolean) => void;
};

/**
 * A radio menu item within a radio group.
 */
export type RadioMenuItem = {
	/**
	 * Identifies this item as a radio item.
	 */
	type: 'radio';
	/**
	 * Unique key for the radio item.
	 */
	key: string;
	/**
	 * The label content to display.
	 */
	label: React.ReactNode;
	/**
	 * The value of the radio item.
	 */
	value: string;
	/**
	 * When `true`, prevents the user from interacting with the item.
	 */
	disabled?: boolean;
	/**
	 * Additional CSS classes to apply to the item.
	 */
	className?: string;
};

/**
 * A group of radio menu items.
 */
export type RadioGroupMenuItem = {
	/**
	 * Identifies this item as a radio group.
	 */
	type: 'radio-group';
	/**
	 * Optional key for the radio group.
	 */
	key?: string;
	/**
	 * The controlled value of the selected radio item.
	 */
	value?: string;
	/**
	 * Event handler called when the selected value changes.
	 */
	onChange?: (value: string) => void;
	/**
	 * The radio items in the group.
	 */
	children: RadioMenuItem[];
};

/**
 * Union type of all possible menu item types.
 */
export type MenuItem =
	| MenuGroup
	| MenuDivider
	| CheckboxMenuItem
	| RadioGroupMenuItem
	| (SubMenuItem & { type?: never })
	| (BaseMenuItem & { type?: never; children?: never });

/**
 * Configuration for the menu, including items, search, and loading state.
 */
export type MenuProps = {
	/**
	 * The menu items to render.
	 */
	items: MenuItem[];
	/**
	 * Search configuration for the menu.
	 */
	search?: {
		/**
		 * Placeholder text for the search input.
		 */
		placeholder?: string;
		/**
		 * Optional icon to display in the search input.
		 */
		searchIcon?: React.ReactNode;
		/**
		 * Callback fired when the search query changes.
		 */
		onSearchChange?: (value: string) => void;
	};
	/**
	 * Loading state configuration.
	 * Can be a boolean or an object with custom loading text.
	 */
	loading?: boolean | { text?: string };
};
