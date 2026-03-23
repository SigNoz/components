import * as React from 'react';

import { Input, type InputProps } from '../../input/index.js';
import { cn } from '../../lib/utils.js';
import styles from '../dropdown-menu.module.scss';

const navigationKeys = ['ArrowUp', 'ArrowDown', 'Enter', 'Escape', 'Tab'];

export type DropdownMenuSearchProps = Omit<InputProps, 'onChange' | 'prefix'> & {
	/**
	 * Callback fired when the search query changes.
	 */
	onSearchChange?: (value: string) => void;
	/**
	 * Optional icon to display before the input.
	 */
	searchIcon?: React.ReactNode;
	/**
	 * Callback fired when ArrowDown is pressed to navigate to menu items.
	 * @internal
	 */
	onNavigateDown?: () => void;
};

/**
 * A search input for filtering dropdown menu items.
 * Typically placed at the top of the dropdown content.
 *
 * @example
 * ```tsx
 * const [query, setQuery] = React.useState('');
 * const filteredItems = items.filter((item) =>
 *   item.label.toLowerCase().includes(query.toLowerCase())
 * );
 *
 * <DropdownMenuContent>
 *   <DropdownMenuSearch
 *     placeholder="Search items..."
 *     onSearchChange={setQuery}
 *   />
 *   {filteredItems.map((item) => (
 *     <DropdownMenuItem key={item.id}>{item.label}</DropdownMenuItem>
 *   ))}
 * </DropdownMenuContent>
 * ```
 *
 * @example
 * ```tsx
 * // With custom search icon
 * <DropdownMenuSearch
 *   searchIcon={<SearchIcon />}
 *   placeholder="Find..."
 *   onSearchChange={handleSearch}
 * />
 * ```
 */
export const DropdownMenuSearch = React.forwardRef<HTMLInputElement, DropdownMenuSearchProps>(
	(
		{ className, onSearchChange, onNavigateDown, searchIcon, placeholder = 'Search...', ...props },
		ref
	) => {
		const [value, setValue] = React.useState('');

		const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			const newValue = e.target.value;
			setValue(newValue);
			onSearchChange?.(newValue);
		};

		// Prevent character keys from triggering Radix's typeahead
		// Handle ArrowDown/Tab to navigate to menu items
		const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
			if ((e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) && onNavigateDown) {
				e.preventDefault();
				onNavigateDown();
			} else if (!navigationKeys.includes(e.key)) {
				e.stopPropagation();
			}
		};

		return (
			<Input
				ref={ref}
				type="text"
				data-slot="dropdown-menu-search"
				value={value}
				onChange={handleChange}
				onKeyDown={handleKeyDown}
				placeholder={placeholder}
				prefix={searchIcon}
				className={cn(styles['dropdown-menu__search'], className)}
				{...props}
			/>
		);
	}
);

DropdownMenuSearch.displayName = 'DropdownMenuSearch';
