import { ChevronDown } from '@signozhq/icons';
import * as React from 'react';
import { Dropdown } from '../../dropdown/dropdown.js';
import type { DropdownItemType } from '../../dropdown/types.js';
import { cn } from '../../lib/utils.js';
import styles from '../breadcrumb.module.scss';
import type { BreadcrumbDropdownItem } from './breadcrumb-types.js';

export type BreadcrumbDropdownProps = Pick<
	React.ComponentPropsWithoutRef<'button'>,
	'id' | 'className' | 'style' | 'title' | 'aria-label' | 'aria-labelledby' | 'aria-describedby'
> & {
	/**
	 * The test ID to apply to the breadcrumb dropdown.
	 */
	testId?: string;
	/**
	 * The items to display in the dropdown menu.
	 */
	items: BreadcrumbDropdownItem[];
	/**
	 * The trigger content for the dropdown.
	 */
	children: React.ReactNode;
};

/**
 * Dropdown menu for breadcrumb items with multiple sub-options.
 * Useful for showing child pages or alternate paths.
 *
 * The trigger is a `<button>`, so it is reachable with the keyboard on its own. The menu itself is
 * a `Dropdown`: no search, no section labels, one action per entry.
 *
 * @example
 * ```tsx
 * <BreadcrumbDropdown
 *   items={[
 *     { title: 'Electronics', href: '/products/electronics' },
 *     { title: 'Clothing', href: '/products/clothing' },
 *     { title: 'Books', href: '/products/books' },
 *   ]}
 * >
 *   Products
 * </BreadcrumbDropdown>
 * ```
 *
 * @example
 * ```tsx
 * // With onClick handlers
 * <BreadcrumbDropdown
 *   items={[
 *     { title: 'Option 1', onClick: () => console.log('clicked') },
 *     { title: 'Option 2', href: '/option-2' },
 *   ]}
 * >
 *   Select
 * </BreadcrumbDropdown>
 * ```
 */
export const BreadcrumbDropdown = React.forwardRef<HTMLButtonElement, BreadcrumbDropdownProps>(
	({ className, testId, items, children, ...props }, ref) => {
		const menuItems = React.useMemo<DropdownItemType[]>(
			() =>
				items.map((item, index) => ({
					type: 'item',
					// `href` is the natural identity, and the index covers the entries that only have a
					// handler.
					value: item.href ?? `item-${index}`,
					label: item.title,
					onClick: (event: React.MouseEvent): void => {
						if (item.href) {
							window.location.href = item.href;
						}

						item.onClick?.(event);
					},
				})),
			[items],
		);

		return (
			<Dropdown
				side="bottom"
				align="start"
				items={menuItems}
				ref={ref}
				{...(testId === undefined ? {} : { testId })}
			>
				<button
					type="button"
					data-slot="breadcrumb-dropdown"
					className={cn(styles['breadcrumb-dropdown'], className)}
					{...props}
				>
					{children}
					<ChevronDown size={14} className={styles['breadcrumb-dropdown-icon']} />
				</button>
			</Dropdown>
		);
	},
);

BreadcrumbDropdown.displayName = 'BreadcrumbDropdown';
