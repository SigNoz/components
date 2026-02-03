import './index.css';

import * as React from 'react';
import {
	ChevronDown,
	MoreHorizontal,
	MousePointerClick,
	Pin,
	PinOff,
} from 'lucide-react';
import {
	motion,
	LayoutGroup,
	AnimatePresence,
	type HTMLMotionProps,
	type Transition,
} from 'motion/react';
import { Tooltip, TooltipProvider } from '@signozhq/tooltip';
import { cn } from './lib/utils';

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
			<motion.div
				className={cn('pin-list-container space-y-10', className)}
				{...props}
			>
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
									'pin-list-label mb-2 text-card-foreground font-inter text-[11px] font-semibold leading-[18px] tracking-[0.88px] uppercase text-left flex items-center px-3 gap-[8px]',
									isDockedProp && 'pin-list-label-docked',
									labelClassName,
								)}
							>
								<div className="relative shrink-0 size-[16px]">
									<MousePointerClick className="size-[16px] text-card-foreground" />
								</div>
								<span className="pin-list-label-text">{shortcutsLabel}</span>
							</motion.p>
						</AnimatePresence>
						{pinned.length > 0 ? (
							<div className={cn('space-y-3 relative gap-[6px] flex flex-col')}>
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
							<div className="pin-list-empty-state">
								<p className="font-inter font-normal leading-4.5 opacity-60 text-foreground text-[12px] tracking-[-0.06px]  w-[150px] text-left pl-3">
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
										'pin-list-more-label mb-2 text-card-foreground font-inter text-[11px] font-semibold leading-[18px] tracking-[0.88px] uppercase text-left flex items-center w-full cursor-pointer hover:opacity-80 transition-opacity px-3 justify-between',
										isDockedProp && 'pin-list-more-label-docked',
										labelClassName,
									)}
								>
									<div className="pin-list-more-label-content flex items-center gap-[8px]">
										<div className="relative shrink-0 size-[16px]">
											<MoreHorizontal className="size-[16px] text-card-foreground" />
										</div>
										<span className="pin-list-more-label-text">{moreLabel}</span>
									</div>
									<div className="pin-list-more-label-chevron relative shrink-0 size-[16px]">
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
									className={cn(
										'space-y-3 relative gap-[6px] flex flex-col overflow-hidden',
									)}
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
			className={cn(
				'pin-list-item flex items-center rounded-[3px] py-[4px] relative w-full text-left transition-colors text-foreground font-inter text-[14px] font-normal leading-[18px] m-0 h-[32px] px-[12px] justify-between gap-5',
				isDocked && 'pin-list-item-docked',
				item.active
					? 'bg-secondary'
					: isHovered
						? 'bg-secondary'
						: 'bg-transparent',
				item.active && isHovered && 'bg-secondary/80',
				className,
			)}
		>
			<div className="pin-list-item-content flex items-center gap-[8px]">
				<div className="relative shrink-0 size-[16px]">
					{React.cloneElement(item.icon, {
						className: cn('size-[16px] text-foreground', item.icon.props.className),
					})}
				</div>
				<div
					className={cn(
						'pin-list-item-label font-inter text-[14px] font-normal leading-[18px]',
						item.active || isHovered
							? 'text-secondary-foreground'
							: 'text-foreground',
					)}
				>
					{item.label}
				</div>
			</div>
			<Tooltip title={isPinned ? 'Remove from shortcuts' : 'Add to shortcuts'}>
				<div
					className={cn(
						'pin-list-item-pin-button flex items-center justify-center size-[16px] shrink-0 transition-opacity cursor-pointer',
						isPinned ? 'opacity-100' : isHovered ? 'opacity-100' : 'opacity-0',
					)}
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
