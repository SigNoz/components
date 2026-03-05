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
import styles from './pin-list.module.css';

export type PinListItem = {
	key: string;
	label: string | React.ReactNode;
	icon: React.ReactElement;
	isPinned: boolean;
	isEnabled: boolean;
	itemKey: string;
	active?: boolean;
	className?: string;
};

export type PinListProps = {
	items: PinListItem[];
	onItemClick?: (item: PinListItem) => void;
	onPinToggle?: (item: PinListItem) => void;
	shortcutsLabel?: string;
	moreLabel?: string;
	className?: string;
	itemClassName?: string;
	labelClassName?: string;
	transition?: Transition;
	isDocked?: boolean;
} & Omit<HTMLMotionProps<'div'>, 'children'>;

const defaultTransition: Transition = {
	stiffness: 320,
	damping: 20,
	mass: 0.8,
	type: 'spring',
};

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

	const pinned = listItems.filter((item) => item.isPinned && item.isEnabled);
	const unpinned = listItems.filter((item) => !item.isPinned && item.isEnabled);

	const toggleStatus = (key: string) => {
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

		if (onPinToggle) {
			onPinToggle({ ...item, isPinned: !item.isPinned });
		}
	};

	const handleItemClick = (item: PinListItem) => {
		if (onItemClick) {
			onItemClick(item);
		}
	};

	return (
		<TooltipProvider>
			<motion.div className={cn(styles['pin-list-container'], className)} {...props}>
				<LayoutGroup>
					<div>
						<AnimatePresence>
							<motion.p
								layout
								key="pinned-label"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.22, ease: 'easeInOut' }}
								className={cn(
									styles['pin-list-label'],
									isDockedProp && 'pin-list-label-docked',
									labelClassName
								)}
							>
								<div className={styles['pin-list-label__icon']}>
									<MousePointerClick className="size-[16px] text-card-foreground" />
								</div>
								<span className={styles['pin-list-label-text']}>{shortcutsLabel}</span>
							</motion.p>
						</AnimatePresence>
						{pinned.length > 0 ? (
							<div className={styles['pin-list-items-container']}>
								{pinned.map((item) => (
									<PinListItem
										key={item.key}
										item={item}
										transition={transition}
										onClick={() => handleItemClick(item)}
										onPinClick={() => toggleStatus(item.key)}
										isPinned
										isDocked={isDockedProp}
										className={cn(itemClassName, item.className)}
									/>
								))}
							</div>
						) : (
							<div className={styles['pin-list-empty-state']}>
								<p className={styles['pin-list-empty-state__text']}>
									You have not added any shortcuts yet.
								</p>
							</div>
						)}
					</div>

					<div>
						<AnimatePresence>
							{unpinned.length > 0 && (
								<motion.button
									layout
									key="more-label"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.22, ease: 'easeInOut' }}
									onClick={() => setIsMoreExpanded(!isMoreExpanded)}
									className={cn(
										styles['pin-list-more-label'],
										isDockedProp && 'pin-list-more-label-docked',
										labelClassName
									)}
								>
									<div className={styles['pin-list-more-label-content']}>
										<div className={styles['pin-list-more-label__icon']}>
											<MoreHorizontal className="size-[16px] text-card-foreground" />
										</div>
										<span className={styles['pin-list-more-label-text']}>{moreLabel}</span>
									</div>
									<div className={styles['pin-list-more-label-chevron']}>
										<motion.div
											animate={{ rotate: isMoreExpanded ? 0 : -90 }}
											transition={{ duration: 0.2, ease: 'easeInOut' }}
										>
											<ChevronDown className="size-[16px] text-card-foreground" />
										</motion.div>
									</div>
								</motion.button>
							)}
						</AnimatePresence>
						<AnimatePresence>
							{unpinned.length > 0 && isMoreExpanded && (
								<motion.div
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: 'auto' }}
									exit={{ opacity: 0, height: 0 }}
									transition={{ duration: 0.2, ease: 'easeInOut' }}
									className={styles['pin-list-more-items-container']}
								>
									{unpinned.map((item) => (
										<PinListItem
											key={item.key}
											item={item}
											transition={transition}
											onClick={() => handleItemClick(item)}
											onPinClick={() => toggleStatus(item.key)}
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

type PinListItemProps = {
	item: PinListItem;
	transition: Transition;
	onClick: () => void;
	onPinClick: () => void;
	isPinned: boolean;
	isDocked?: boolean;
	className?: string;
};

function PinListItem({
	item,
	transition,
	onClick,
	onPinClick,
	isPinned,
	isDocked = false,
	className,
}: PinListItemProps) {
	const [isHovered, setIsHovered] = React.useState(false);

	return (
		<motion.button
			layoutId={`item-${item.key}`}
			onClick={onClick}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			transition={transition}
			data-active={item.active}
			className={cn(styles['pin-list-item'], isDocked && 'pin-list-item-docked', className)}
		>
			<div className={styles['pin-list-item-content']}>
				<div className={styles['pin-list-item__icon']}>
					{React.cloneElement(item.icon, {
						className: cn('size-[16px] text-foreground', item.icon.props.className),
					})}
				</div>
				<div
					className={styles['pin-list-item-label']}
					data-active={item.active || isHovered}
					data-hovered={isHovered}
				>
					{item.label}
				</div>
			</div>
			<Tooltip title={isPinned ? 'Remove from shortcuts' : 'Add to shortcuts'}>
				<div
					className={styles['pin-list-item-pin-button']}
					data-visible={isPinned || isHovered}
					onClick={(e) => {
						e.stopPropagation();
						onPinClick();
					}}
					onMouseDown={(e) => {
						e.stopPropagation();
					}}
				>
					{isPinned ? (
						<PinOff className={cn('size-[16px]', 'text-foreground')} />
					) : (
						<Pin className={cn('size-[16px]', 'text-foreground')} />
					)}
				</div>
			</Tooltip>
		</motion.button>
	);
}

export { PinList };
