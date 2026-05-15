import { ChevronDown } from '@signozhq/icons';
import * as React from 'react';
import { useCallback } from 'react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '../../dropdown-menu/index.js';
import { cn } from '../../lib/utils.js';
import styles from '../breadcrumb.module.scss';
import type { BreadcrumbDropdownItem } from './breadcrumb-types.js';

type DropdownItemComponentProps = {
	item: BreadcrumbDropdownItem;
};

const DropdownItemComponent = React.memo<DropdownItemComponentProps>(({ item }) => {
	const handleClick = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			if (item.href) {
				window.location.href = item.href;
			}
			item.onClick?.(e);
		},
		[item.href, item.onClick]
	);

	return <DropdownMenuItem onClick={handleClick}>{item.title}</DropdownMenuItem>;
});

DropdownItemComponent.displayName = 'DropdownItemComponent';

export type BreadcrumbDropdownProps = Pick<
	React.ComponentPropsWithoutRef<'span'>,
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
export const BreadcrumbDropdown = React.forwardRef<HTMLSpanElement, BreadcrumbDropdownProps>(
	({ className, testId, items, children, ...props }, ref) => {
		return (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<span
						ref={ref}
						data-testid={testId}
						data-slot="breadcrumb-dropdown"
						className={cn(styles['breadcrumb-dropdown'], className)}
						{...props}
					>
						{children}
						<ChevronDown size={14} className={styles['breadcrumb-dropdown-icon']} />
					</span>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start">
					{items.map((item) => (
						<DropdownItemComponent key={item.href ?? String(item.title)} item={item} />
					))}
				</DropdownMenuContent>
			</DropdownMenu>
		);
	}
);

BreadcrumbDropdown.displayName = 'BreadcrumbDropdown';
