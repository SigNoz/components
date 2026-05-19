import type * as React from 'react';

export type BreadcrumbDropdownItem = {
	/**
	 * The display title of the dropdown item.
	 */
	title: React.ReactNode;
	/**
	 * The href for the dropdown item link.
	 */
	href?: string;
	/**
	 * Click handler for the dropdown item.
	 */
	onClick?: (e: React.MouseEvent) => void;
};

export type BreadcrumbItemType = {
	/**
	 * The display title of the breadcrumb item.
	 */
	title: React.ReactNode;
	/**
	 * The path for the breadcrumb item. Used with itemRender.
	 */
	path?: string;
	/**
	 * The href for the breadcrumb link.
	 */
	href?: string;
	/**
	 * Icon to display before the title.
	 */
	icon?: React.ReactNode;
	/**
	 * Click handler for the breadcrumb item.
	 */
	onClick?: (e: React.MouseEvent) => void;
	/**
	 * Dropdown menu items for this breadcrumb.
	 */
	menu?: BreadcrumbDropdownItem[];
	/**
	 * Additional className for this item.
	 */
	className?: string;
};
