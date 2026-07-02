import type * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import * as React from 'react';

import { DropdownMenuCheckboxItem } from '../subcomponents/dropdown-menu-checkbox-item.js';
import {
	DropdownMenuContent,
	type DropdownMenuContentProps,
} from '../subcomponents/dropdown-menu-content.js';
import { DropdownMenuItem } from '../subcomponents/dropdown-menu-item.js';
import { DropdownMenuLabel } from '../subcomponents/dropdown-menu-label.js';
import { DropdownMenuLoading } from '../subcomponents/dropdown-menu-loading.js';
import { DropdownMenuRadioGroup } from '../subcomponents/dropdown-menu-radio-group.js';
import { DropdownMenuRadioItem } from '../subcomponents/dropdown-menu-radio-item.js';
import { DropdownMenu } from '../subcomponents/dropdown-menu-root.js';
import { DropdownMenuSearch } from '../subcomponents/dropdown-menu-search.js';
import { DropdownMenuSeparator } from '../subcomponents/dropdown-menu-separator.js';
import { DropdownMenuShortcut } from '../subcomponents/dropdown-menu-shortcut.js';
import { DropdownMenuSub } from '../subcomponents/dropdown-menu-sub.js';
import { DropdownMenuSubContent } from '../subcomponents/dropdown-menu-sub-content.js';
import { DropdownMenuSubTrigger } from '../subcomponents/dropdown-menu-sub-trigger.js';
import { DropdownMenuTrigger } from '../subcomponents/dropdown-menu-trigger.js';
import type {
	BaseMenuItem,
	MenuDivider,
	MenuGroup,
	MenuItem,
	MenuProps,
} from '../subcomponents/dropdown-menu-types.js';

/**
 * Checks if a menu item is a divider.
 */
function isDivider(item: MenuItem): item is MenuDivider {
	return 'type' in item && item.type === 'divider';
}

/**
 * Checks if a menu item is a group.
 */
function isGroup(item: MenuItem): item is MenuGroup {
	return 'type' in item && item.type === 'group';
}

/**
 * Filters out empty groups and cleans up orphaned separators.
 * - Removes groups with no children
 * - Removes consecutive separators
 * - Removes separators at the start or end
 */
function cleanupMenuItems(items: MenuItem[]): MenuItem[] {
	// First pass: filter out empty groups
	const withoutEmptyGroups = items.filter((item) => {
		if (isGroup(item)) {
			return item.children && item.children.length > 0;
		}
		return true;
	});

	// Second pass: clean up separators
	const cleaned: MenuItem[] = [];
	for (let i = 0; i < withoutEmptyGroups.length; i++) {
		const item = withoutEmptyGroups[i];

		if (isDivider(item)) {
			// Skip if at the start
			if (cleaned.length === 0) continue;
			// Skip if previous item is also a divider
			if (cleaned.length > 0 && isDivider(cleaned[cleaned.length - 1])) continue;
			// Skip if this is the last item
			if (i === withoutEmptyGroups.length - 1) continue;
		}

		cleaned.push(item);
	}

	// Remove trailing divider if present
	if (cleaned.length > 0 && isDivider(cleaned[cleaned.length - 1])) {
		cleaned.pop();
	}

	return cleaned;
}

export type DropdownProps = Omit<DropdownMenuContentProps, 'children' | 'className' | 'style'> &
	Omit<React.HTMLAttributes<HTMLButtonElement>, 'children' | 'className' | 'style'> & {
		/**
		 * The menu configuration including items, search, and loading state.
		 */
		menu: MenuProps;
		/**
		 * The trigger element that opens the dropdown menu.
		 */
		children: React.ReactNode;
		/**
		 * Additional class name to apply to the trigger button.
		 */
		className?: string;
		/**
		 * Additional style to apply to the trigger button.
		 */
		style?: React.CSSProperties;
		/**
		 * Additional class name to apply to the dropdown content.
		 */
		contentClassName?: string;
		/**
		 * Additional style to apply to the dropdown content.
		 */
		contentStyle?: React.CSSProperties;
		/**
		 * When true, the menu cannot be opened. The trigger stays hoverable/focusable
		 * (marked with `aria-disabled`) so a wrapping tooltip keeps working — unlike a
		 * natively `disabled` trigger, which suppresses hover.
		 * @default false
		 */
		disabled?: boolean;
	};

/**
 * Helper function to render menu items recursively.
 */
function renderMenuItems(items: MenuItem[], keyPath: string[] = []): React.ReactNode[] {
	return items.map((item, index) => {
		const itemKey = item.key || `item-${index}`;
		const currentKeyPath = [...keyPath, itemKey];

		// Handle divider
		if ('type' in item && item.type === 'divider') {
			return <DropdownMenuSeparator key={itemKey || index} />;
		}

		// Handle group
		if ('type' in item && item.type === 'group') {
			return (
				<React.Fragment key={itemKey}>
					<DropdownMenuLabel>{item.label}</DropdownMenuLabel>
					{renderMenuItems(item.children, currentKeyPath)}
				</React.Fragment>
			);
		}

		// Handle checkbox
		if ('type' in item && item.type === 'checkbox') {
			return (
				<DropdownMenuCheckboxItem
					key={itemKey}
					checked={item.checked}
					onCheckedChange={item.onCheckedChange}
					className={item.className}
				>
					{item.label}
				</DropdownMenuCheckboxItem>
			);
		}

		// Handle radio group
		if ('type' in item && item.type === 'radio-group') {
			return (
				<DropdownMenuRadioGroup key={itemKey} value={item.value} onValueChange={item.onChange}>
					{item.children.map((radioItem) => (
						<DropdownMenuRadioItem
							key={radioItem.key}
							value={radioItem.value}
							disabled={radioItem.disabled}
							className={radioItem.className}
						>
							{radioItem.label}
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			);
		}

		// Handle submenu (has children but not a group)
		if ('children' in item && item.children && item.children.length > 0) {
			return (
				<DropdownMenuSub key={itemKey}>
					<DropdownMenuSubTrigger
						leftIcon={item.icon}
						disabled={item.disabled}
						className={item.className}
					>
						{item.label}
					</DropdownMenuSubTrigger>
					<DropdownMenuSubContent>
						{renderMenuItems(item.children, currentKeyPath)}
					</DropdownMenuSubContent>
				</DropdownMenuSub>
			);
		}

		// Handle regular menu item
		const baseItem = item as BaseMenuItem;
		const handleSelect = () => {
			if (baseItem.onClick) {
				baseItem.onClick({ key: itemKey, keyPath: currentKeyPath });
			}
		};

		return (
			<DropdownMenuItem
				key={itemKey}
				leftIcon={baseItem.icon}
				rightIcon={baseItem.rightIcon}
				destructive={baseItem.danger}
				disabled={baseItem.disabled}
				clickable={Boolean(baseItem.onClick)}
				onSelect={handleSelect}
				className={baseItem.className}
			>
				{baseItem.label}
				{baseItem.shortcut && <DropdownMenuShortcut>{baseItem.shortcut}</DropdownMenuShortcut>}
			</DropdownMenuItem>
		);
	});
}

/**
 * A simplified dropdown menu component with an Ant Design-style API.
 * Renders a complete dropdown menu from a declarative `menu` configuration.
 *
 * @example
 * ```tsx
 * const items = [
 *   { key: 'profile', label: 'Profile', icon: <UserIcon /> },
 *   { key: 'settings', label: 'Settings', icon: <SettingsIcon /> },
 *   { type: 'divider' as const },
 *   { key: 'logout', label: 'Logout', danger: true },
 * ];
 *
 * <DropdownMenuSimple menu={{ items }}>
 *   <Button>Open Menu</Button>
 * </DropdownMenuSimple>
 * ```
 *
 * @example
 * ```tsx
 * // With search and loading
 * <DropdownMenuSimple
 *   menu={{
 *     items,
 *     search: {
 *       placeholder: 'Search...',
 *       onSearchChange: handleSearch,
 *     },
 *     loading: isLoading,
 *   }}
 * >
 *   <Button>Actions</Button>
 * </DropdownMenuSimple>
 * ```
 *
 * @example
 * ```tsx
 * // With submenus
 * const items = [
 *   {
 *     key: 'more',
 *     label: 'More Options',
 *     children: [
 *       { key: 'sub1', label: 'Sub Item 1' },
 *       { key: 'sub2', label: 'Sub Item 2' },
 *     ],
 *   },
 * ];
 * ```
 */
export const DropdownMenuSimple = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.Trigger>,
	DropdownProps
>(
	(
		{
			menu,
			children,
			sideOffset = 4,
			className,
			style,
			contentClassName,
			contentStyle,
			disabled = false,
			onOpenAutoFocus,
			// Content-specific props
			align,
			alignOffset,
			arrowPadding,
			avoidCollisions,
			collisionBoundary,
			collisionPadding,
			forceMount,
			hideWhenDetached,
			loop,
			side,
			sticky,
			onCloseAutoFocus,
			onEscapeKeyDown,
			onPointerDownOutside,
			onFocusOutside,
			onInteractOutside,
			// All remaining props go to trigger (for tooltip compatibility)
			...triggerProps
		},
		ref
	) => {
		const searchInputRef = React.useRef<HTMLInputElement>(null);
		const contentRef = React.useRef<HTMLDivElement | null>(null);

		const cleanedItems = React.useMemo(() => {
			return cleanupMenuItems(menu.items);
		}, [menu.items]);

		const menuItems = React.useMemo(() => {
			return renderMenuItems(cleanedItems);
		}, [cleanedItems]);

		// When search is present, prevent auto-focus on first menu item
		// and instead focus the search input
		const handleOpenAutoFocus = React.useCallback(
			(event: Event) => {
				if (menu.search) {
					event.preventDefault();
					searchInputRef.current?.focus();
				}
				onOpenAutoFocus?.(event);
			},
			[menu.search, onOpenAutoFocus]
		);

		const menuItemSelector =
			'[data-slot="dropdown-menu-item"]:not([data-disabled]), ' +
			'[data-slot="dropdown-menu-checkbox-item"]:not([data-disabled]), ' +
			'[data-slot="dropdown-menu-radio-item"]:not([data-disabled])';

		// Handle ArrowDown from search to focus first menu item
		const handleNavigateDown = React.useCallback(() => {
			const content = contentRef.current;
			if (!content) return;

			const firstItem = content.querySelector<HTMLElement>(menuItemSelector);
			firstItem?.focus();
		}, []);

		// Handle keyboard navigation within the dropdown
		const handleContentKeyDown = React.useCallback(
			(e: React.KeyboardEvent<HTMLDivElement>) => {
				const content = contentRef.current;
				if (!content) return;

				const items = Array.from(content.querySelectorAll<HTMLElement>(menuItemSelector));
				const activeElement = document.activeElement as HTMLElement;
				const currentIndex = activeElement ? items.indexOf(activeElement) : -1;

				// Handle ArrowUp or Shift+Tab from first item to focus search input
				if ((e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) && menu.search) {
					const firstItem = items[0];
					if (activeElement === firstItem) {
						e.preventDefault();
						searchInputRef.current?.focus();
						return;
					}
				}

				if (e.target === searchInputRef.current) {
					return;
				}

				// Handle Tab to navigate to next item
				if (e.key === 'Tab' && !e.shiftKey && currentIndex !== -1) {
					e.preventDefault();
					const nextIndex = currentIndex + 1;
					if (nextIndex < items.length) {
						items[nextIndex].focus();
					} else if (nextIndex === items.length && searchInputRef.current) {
						searchInputRef.current.focus();
					} else if (nextIndex === items.length && !searchInputRef.current && items.length > 0) {
						items[0].focus();
					}
					return;
				}

				// Handle Shift+Tab to navigate to previous item
				if (e.key === 'Tab' && e.shiftKey && currentIndex !== -1) {
					e.preventDefault();
					const prevIndex = currentIndex - 1;
					if (prevIndex >= 0) {
						items[prevIndex].focus();
					} else if (prevIndex === -1 && searchInputRef.current) {
						searchInputRef.current.focus();
					} else if (prevIndex === -1 && !searchInputRef.current && items.length > 0) {
						items[items.length - 1].focus();
					}
				}
			},
			[menu.search]
		);

		const [open, setOpen] = React.useState(false);

		const handleOpenChange = React.useCallback(
			(next: boolean) => {
				// Gate opening here (rather than natively disabling the trigger) so a wrapping
				// tooltip still receives hover/focus events on the trigger.
				if (disabled) return;
				setOpen(next);
				if (next && menu.search) {
					searchInputRef.current?.focus();
				} else if (!next) {
					menu.search?.onSearchChange?.('');
				}
			},
			[disabled, menu.search]
		);

		const dropdownContent = (
			<DropdownMenu open={open} onOpenChange={handleOpenChange}>
				<DropdownMenuTrigger
					ref={ref}
					asChild
					className={className}
					style={style}
					aria-disabled={disabled || undefined}
					data-disabled={disabled || undefined}
					{...triggerProps}
				>
					{children}
				</DropdownMenuTrigger>
				<DropdownMenuContent
					ref={contentRef}
					sideOffset={sideOffset}
					className={contentClassName}
					style={contentStyle}
					onOpenAutoFocus={handleOpenAutoFocus}
					onKeyDown={handleContentKeyDown}
					align={align}
					alignOffset={alignOffset}
					arrowPadding={arrowPadding}
					avoidCollisions={avoidCollisions}
					collisionBoundary={collisionBoundary}
					collisionPadding={collisionPadding}
					forceMount={forceMount}
					hideWhenDetached={hideWhenDetached}
					loop={loop}
					side={side}
					sticky={sticky}
					onCloseAutoFocus={onCloseAutoFocus}
					onEscapeKeyDown={onEscapeKeyDown}
					onPointerDownOutside={onPointerDownOutside}
					onFocusOutside={onFocusOutside}
					onInteractOutside={onInteractOutside}
				>
					{menu.search && (
						<>
							<DropdownMenuSearch
								ref={searchInputRef}
								placeholder={menu.search.placeholder}
								searchIcon={menu.search.searchIcon}
								onSearchChange={menu.search.onSearchChange}
								onNavigateDown={handleNavigateDown}
							/>
							<DropdownMenuSeparator />
						</>
					)}
					{menu.loading ? (
						<DropdownMenuLoading
							text={typeof menu.loading === 'object' ? menu.loading.text : undefined}
						/>
					) : (
						menuItems
					)}
				</DropdownMenuContent>
			</DropdownMenu>
		);

		return dropdownContent;
	}
);

DropdownMenuSimple.displayName = 'DropdownMenuSimple';
