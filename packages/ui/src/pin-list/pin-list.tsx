import { ChevronDown, MoreHorizontal, MousePointerClick, Pin, PinOff } from 'lucide-react';
import {
	AnimatePresence,
	type HTMLMotionProps,
	LayoutGroup,
	motion,
	type Transition,
} from 'motion/react';
import * as React from 'react';
import { cn } from '../lib/utils.js';
import { Tooltip, TooltipProvider } from '../tooltip/index.js';
import styles from './pin-list.module.scss';

/**
 * Represents a single item in the PinList component.
 */
export type PinListItem = {
	/**
	 * Unique identifier for the item, used for React keys and internal state management.
	 */
	key: string;
	/**
	 * The display content for the item. Can be a simple string or a React node for custom rendering.
	 */
	label: string | React.ReactNode;
	/**
	 * Icon element to display alongside the item label.
	 * Must be a React element (e.g., `<FileText />` from lucide-react).
	 */
	icon: React.ReactElement;
	/**
	 * Whether the item is currently pinned to the shortcuts section.
	 * Pinned items appear in the top section, unpinned items appear in the "MORE" section.
	 */
	isPinned: boolean;
	/**
	 * Whether the item is enabled and should be displayed.
	 * Disabled items are filtered out from both pinned and unpinned lists.
	 */
	isEnabled: boolean;
	/**
	 * Alternative key identifier for the item, typically used for external state management.
	 */
	itemKey: string;
	/**
	 * Whether the item is currently active/selected.
	 * Active items have a highlighted background style.
	 */
	active?: boolean;
	/**
	 * Additional CSS class names to apply to this specific item.
	 */
	className?: string;
};

export type PinListProps = {
	/**
	 * Array of items to display in the pin list.
	 * Items are automatically separated into pinned (shortcuts) and unpinned (more) sections.
	 *
	 * @example
	 * ```tsx
	 * const items = [
	 *   { key: '1', itemKey: '1', label: 'Logs', icon: <FileText />, isPinned: true, isEnabled: true },
	 *   { key: '2', itemKey: '2', label: 'Metrics', icon: <BarChart />, isPinned: false, isEnabled: true },
	 * ];
	 * ```
	 */
	items: PinListItem[];
	/**
	 * Callback fired when an item is clicked.
	 * Receives the clicked item with its current state.
	 *
	 * @param item - The clicked PinListItem
	 */
	onItemClick?: (item: PinListItem) => void;
	/**
	 * Callback fired when an item's pin state is toggled.
	 * Receives the item with its **new** isPinned state (already toggled).
	 *
	 * @param item - The toggled PinListItem with updated isPinned value
	 */
	onPinToggle?: (item: PinListItem) => void;
	/**
	 * Label text for the pinned items section header.
	 * @default "SHORTCUTS"
	 */
	shortcutsLabel?: string;
	/**
	 * Label text for the unpinned items section header.
	 * @default "MORE"
	 */
	moreLabel?: string;
	/**
	 * Additional CSS class names to apply to the container element.
	 */
	className?: string;
	/**
	 * Additional CSS class names to apply to all item elements.
	 */
	itemClassName?: string;
	/**
	 * Additional CSS class names to apply to section label elements (shortcuts and more headers).
	 */
	labelClassName?: string;
	/**
	 * Framer Motion transition configuration for item animations.
	 * Uses spring animation by default for smooth, natural-feeling transitions.
	 *
	 * @default { stiffness: 320, damping: 20, mass: 0.8, type: 'spring' }
	 */
	transition?: Transition;
	/**
	 * Whether the component is in a docked/collapsed state.
	 * Can be used to apply different styling when the sidebar is collapsed.
	 */
	isDocked?: boolean;
} & Omit<HTMLMotionProps<'div'>, 'children'>;

/**
 * Default spring transition configuration for smooth animations.
 */
const defaultTransition: Transition = {
	stiffness: 320,
	damping: 20,
	mass: 0.8,
	type: 'spring',
};

/**
 * Animation configuration for label fade transitions.
 */
const labelAnimationTransition = { duration: 0.22, ease: 'easeInOut' } as const;

/**
 * Animation configuration for the more section expand/collapse.
 */
const moreSectionAnimationTransition = { duration: 0.2, ease: 'easeInOut' } as const;

/**
 * Initial animation state for fade-in elements.
 */
const fadeInInitial = { opacity: 0 } as const;

/**
 * Animate state for fade-in elements.
 */
const fadeInAnimate = { opacity: 1 } as const;

/**
 * Initial animation state for the expandable more section.
 */
const expandInitial = { opacity: 0, height: 0 } as const;

/**
 * Animate state for the expandable more section.
 */
const expandAnimate = { opacity: 1, height: 'auto' } as const;

/**
 * PinList component for displaying a list of items that can be pinned/unpinned as shortcuts.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <PinList
 *   items={[
 *     { key: '1', label: 'Dashboard', icon: <HomeIcon />, isPinned: true, isEnabled: true, itemKey: 'dashboard' },
 *     { key: '2', label: 'Settings', icon: <SettingsIcon />, isPinned: false, isEnabled: true, itemKey: 'settings' },
 *   ]}
 *   onItemClick={(item) => console.log('Clicked:', item.label)}
 *   onPinToggle={(item) => console.log('Toggled pin:', item.label)}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With custom labels
 * <PinList
 *   items={items}
 *   shortcutsLabel="FAVORITES"
 *   moreLabel="ALL ITEMS"
 *   onItemClick={handleClick}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Docked mode (collapsed sidebar)
 * <PinList
 *   items={items}
 *   isDocked={true}
 *   onItemClick={handleClick}
 * />
 * ```
 */
function PinList({
	items: initialItems,
	onItemClick,
	onPinToggle,
	shortcutsLabel = 'SHORTCUTS',
	moreLabel = 'MORE',
	className,
	itemClassName,
	labelClassName,
	transition = defaultTransition,
	isDocked: isDockedProp,
	...props
}: PinListProps) {
	const [listItems, setListItems] = React.useState(initialItems);
	const [isMoreExpanded, setIsMoreExpanded] = React.useState(true);

	React.useEffect(() => {
		setListItems(initialItems);
	}, [initialItems]);

	const pinned = React.useMemo(
		() => listItems.filter((item) => item.isPinned && item.isEnabled),
		[listItems]
	);

	const unpinned = React.useMemo(
		() => listItems.filter((item) => !item.isPinned && item.isEnabled),
		[listItems]
	);

	const toggleStatus = React.useCallback(
		(key: string) => {
			const item = listItems.find((i) => i.key === key);
			if (!item) return;

			setListItems((prev) => {
				const idx = prev.findIndex((i) => i.key === key);
				if (idx === -1) return prev;
				const updated = [...prev];
				const [itemToToggle] = updated.splice(idx, 1);
				if (!itemToToggle) return prev;
				const toggled = { ...itemToToggle, isPinned: !itemToToggle.isPinned };
				if (toggled.isPinned) updated.push(toggled);
				else updated.unshift(toggled);
				return updated;
			});

			onPinToggle?.({ ...item, isPinned: !item.isPinned });
		},
		[listItems, onPinToggle]
	);

	const handleItemClick = React.useCallback(
		(item: PinListItem) => {
			onItemClick?.(item);
		},
		[onItemClick]
	);

	const toggleMoreExpanded = React.useCallback(() => {
		setIsMoreExpanded((prev) => !prev);
	}, []);

	const chevronRotation = React.useMemo(
		() => ({ rotate: isMoreExpanded ? 0 : -90 }),
		[isMoreExpanded]
	);

	return (
		<TooltipProvider>
			<motion.div className={cn(styles['container'], className)} {...props}>
				<LayoutGroup>
					<div className={styles['section']}>
						<AnimatePresence>
							<motion.p
								layout
								key="pinned-label"
								initial={fadeInInitial}
								animate={fadeInAnimate}
								exit={fadeInInitial}
								transition={labelAnimationTransition}
								className={cn(styles['label'], labelClassName)}
							>
								<div className={styles['label-icon']}>
									<MousePointerClick className={styles['label-icon']} />
								</div>
								<span>{shortcutsLabel}</span>
							</motion.p>
						</AnimatePresence>
						{pinned.length > 0 ? (
							<div className={styles['section-items']}>
								{pinned.map((item) => (
									<PinListItemComponent
										key={item.key}
										item={item}
										transition={transition}
										onItemClick={handleItemClick}
										onPinClick={toggleStatus}
										isPinned
										isDocked={isDockedProp}
										className={cn(itemClassName, item.className)}
									/>
								))}
							</div>
						) : (
							<div className={styles['empty-state']}>
								<p className={styles['empty-state-text']}>You have not added any shortcuts yet.</p>
							</div>
						)}
					</div>

					<div className={styles['section']}>
						<AnimatePresence>
							{unpinned.length > 0 && (
								<motion.button
									layout
									key="more-label"
									initial={fadeInInitial}
									animate={fadeInAnimate}
									exit={fadeInInitial}
									transition={labelAnimationTransition}
									onClick={toggleMoreExpanded}
									className={cn(styles['more-label'], labelClassName)}
								>
									<div className={styles['more-label-content']}>
										<div className={styles['label-icon']}>
											<MoreHorizontal className={styles['label-icon']} />
										</div>
										<span>{moreLabel}</span>
									</div>
									<div className={styles['more-label-chevron']}>
										<motion.div
											animate={chevronRotation}
											transition={moreSectionAnimationTransition}
										>
											<ChevronDown className={styles['more-label-chevron']} />
										</motion.div>
									</div>
								</motion.button>
							)}
						</AnimatePresence>
						<AnimatePresence>
							{unpinned.length > 0 && isMoreExpanded && (
								<motion.div
									initial={expandInitial}
									animate={expandAnimate}
									exit={expandInitial}
									transition={moreSectionAnimationTransition}
									className={cn(styles['section-items'], 'overflow-hidden')}
								>
									{unpinned.map((item) => (
										<PinListItemComponent
											key={item.key}
											item={item}
											transition={transition}
											onItemClick={handleItemClick}
											onPinClick={toggleStatus}
											isPinned={false}
											isDocked={isDockedProp}
											className={cn(itemClassName, item.className)}
										/>
									))}
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</LayoutGroup>
			</motion.div>
		</TooltipProvider>
	);
}

type PinListItemComponentProps = {
	item: PinListItem;
	transition: Transition;
	onItemClick: (item: PinListItem) => void;
	onPinClick: (key: string) => void;
	isPinned: boolean;
	isDocked?: boolean;
	className?: string;
};

const PinListItemComponent = React.memo(function PinListItemComponent({
	item,
	transition,
	onItemClick,
	onPinClick,
	isPinned,
	className,
}: PinListItemComponentProps) {
	const [isHovered, setIsHovered] = React.useState(false);

	const handleClick = React.useCallback(() => {
		onItemClick(item);
	}, [onItemClick, item]);

	const handlePinClick = React.useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation();
			onPinClick(item.key);
		},
		[onPinClick, item.key]
	);

	const handlePinMouseDown = React.useCallback((e: React.MouseEvent) => {
		e.stopPropagation();
	}, []);

	const handleMouseEnter = React.useCallback(() => {
		setIsHovered(true);
	}, []);

	const handleMouseLeave = React.useCallback(() => {
		setIsHovered(false);
	}, []);

	const tooltipTitle = isPinned ? 'Remove from shortcuts' : 'Add to shortcuts';

	return (
		<motion.button
			layoutId={`item-${item.key}`}
			onClick={handleClick}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			transition={transition}
			className={cn(styles['item'], className)}
			data-active={item.active}
		>
			<div className={styles['item-content']}>
				<div className={styles['item-icon']}>
					{React.cloneElement(item.icon, {
						className: cn(styles['item-icon'], item.icon.props.className),
					})}
				</div>
				<div className={styles['item-label']} data-active={item.active} data-hovered={isHovered}>
					{item.label}
				</div>
			</div>
			<Tooltip title={tooltipTitle}>
				<div
					className={styles['item-pin-button']}
					data-visible={isPinned || isHovered}
					onClick={handlePinClick}
					onMouseDown={handlePinMouseDown}
				>
					{isPinned ? (
						<PinOff className={styles['item-icon']} />
					) : (
						<Pin className={styles['item-icon']} />
					)}
				</div>
			</Tooltip>
		</motion.button>
	);
});

export { PinList };
