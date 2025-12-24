import './index.css';
import React, {
	ComponentPropsWithoutRef,
	CSSProperties,
	ElementRef,
	forwardRef,
	ReactNode,
	useCallback,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { type VariantProps } from 'class-variance-authority';
import { cn } from './lib/utils';
import { LockIcon } from 'lucide-react';
import { Tooltip, TooltipProvider } from '@signozhq/tooltip';
import {
	tabsListVariants,
	tabsListWrapperVariants,
	tabsTriggerVariants,
	tabsVariants,
} from './tabVariants';

type TabItemType = {
	key: string;
	label: ReactNode;
	children: ReactNode;
	disabled?: boolean;
	disabledReason?: string;
	prefixIcon?: ReactNode;
	suffixIcon?: ReactNode;
};

const Tabs = forwardRef<
	ElementRef<typeof TabsPrimitive.Root>,
	ComponentPropsWithoutRef<typeof TabsPrimitive.Root> & {
		items: TabItemType[];
		variant?: 'primary' | 'secondary';
		onChange?: (key: string) => void;
	}
>(
	(
		{
			items,
			onChange,
			defaultValue,
			value,
			variant = 'primary',
			className,
			...props
		},
		ref,
	) => {
		const [activeTabKey, setActiveTabKey] = useState(
			value || defaultValue || items[0]?.key,
		);
		const tabsListRef = useRef<HTMLDivElement>(null);
		const triggerRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

		// State for the active tab slider
		const [activeSliderStyle, setActiveSliderStyle] = useState<CSSProperties>({});
		// State for the hover tab slider
		const [hoverSliderStyle, setHoverSliderStyle] = useState<CSSProperties>({
			opacity: 0, // Initially hidden
		});

		const handleValueChange = (newValue: string) => {
			setActiveTabKey(newValue);
			onChange?.(newValue);
		};

		// --- Active Slider Logic ---
		const updateActiveSliderPosition = useCallback(() => {
			if (activeTabKey && tabsListRef.current) {
				const activeTrigger = triggerRefs.current[activeTabKey];
				if (activeTrigger) {
					const listRect = tabsListRef.current.getBoundingClientRect();
					const triggerRect = activeTrigger.getBoundingClientRect();

					setActiveSliderStyle({
						left: triggerRect.left - listRect.left,
						width: triggerRect.width,
						opacity: 1,
					});
				} else {
					setActiveSliderStyle({ opacity: 0 }); // Hide if no active trigger
				}
			}
		}, [activeTabKey]);

		useEffect(() => {
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					updateActiveSliderPosition();
				});
			});
		}, [activeTabKey, items, updateActiveSliderPosition]);

		// --- Hover Slider Logic ---
		const handleMouseEnter = (itemKey: string) => {
			if (tabsListRef.current && triggerRefs.current[itemKey]) {
				const hoveredTrigger = triggerRefs.current[itemKey];
				const listRect = tabsListRef.current.getBoundingClientRect();
				const triggerRect = hoveredTrigger!.getBoundingClientRect();

				setHoverSliderStyle({
					left: triggerRect.left - listRect.left,
					width: triggerRect.width,
					opacity: 1, // Make visible on hover
				});
			}
		};

		const handleMouseLeave = () => {
			// Hide the hover slider when not hovering
			setHoverSliderStyle((prev) => ({ ...prev, opacity: 0 }));
		};

		// Effect to update slider styles on window resize
		useEffect(() => {
			const handleResize = () => {
				updateActiveSliderPosition();
				// We don't need to update hover position on resize unless a tab is actively hovered.
				// It will be re-calculated on the next mouse enter.
			};

			window.addEventListener('resize', handleResize);
			return () => window.removeEventListener('resize', handleResize);
		}, [updateActiveSliderPosition]);

		return (
			<TabsPrimitive.Root
				ref={ref}
				onValueChange={handleValueChange}
				defaultValue={defaultValue}
				value={activeTabKey}
				className={cn(tabsVariants({ variant, className }))}
				{...props}
			>
				<TooltipProvider>
					<TabsList variant={variant} ref={tabsListRef}>
						{variant === 'secondary' && (
							<div className="min-w-4 border-b border-[var(--tab-border-color)] flex-0"></div>
						)}
						{items.map((item) => {
							const triggerContent = (
								<TabsTrigger
									key={item.key}
									value={item.key}
									disabled={item.disabled}
									variant={variant}
									ref={(el) => {
										triggerRefs.current[item.key] = el;
										// Update position when active tab's ref is set (handles initial render)
										if (el && item.key === activeTabKey) {
											requestAnimationFrame(() => {
												updateActiveSliderPosition();
											});
										}
									}}
									// Add hover event handlers
									onMouseEnter={() => handleMouseEnter(item.key)}
									onMouseLeave={handleMouseLeave}
								>
									{item.disabled ? (
										<LockIcon className="shrink-0" size={16} />
									) : (
										item.prefixIcon && <span className="shrink-0">{item.prefixIcon}</span>
									)}
									{item.label}
									{!item.disabled && item.suffixIcon && (
										<span className="shrink-0">{item.suffixIcon}</span>
									)}
								</TabsTrigger>
							);

							return item.disabled ? (
								<Tooltip
									key={item.key}
									title={item.disabledReason || 'This tab is disabled'}
								>
									{triggerContent}
								</Tooltip>
							) : (
								triggerContent
							);
						})}
						{variant === 'secondary' ? (
							<div className="min-w-4 border-b border-[var(--tab-border-color)] shrink-0 grow"></div>
						) : (
							<>
								{/* Hover Slider */}
								<div
									className="tab-hover-slider absolute bg-[var(--tab-hover-bg)]/10 rounded z-0"
									style={{
										...hoverSliderStyle,
										height: '28px',
									}}
								/>
								{/* Active Slider */}
								<div
									className="tab-active-slider absolute bottom-[-8px] h-[2px] bg-[var(--tab-active-accent-color)] rounded"
									style={activeSliderStyle}
								/>
							</>
						)}
					</TabsList>
					{items.map((item) => (
						<TabsContent key={item.key} value={item.key}>
							{item.children}
						</TabsContent>
					))}{' '}
				</TooltipProvider>
			</TabsPrimitive.Root>
		);
	},
);
Tabs.displayName = 'Tabs';

// Update TabsList to use variants
const TabsList = forwardRef<
	ElementRef<typeof TabsPrimitive.List>,
	ComponentPropsWithoutRef<typeof TabsPrimitive.List> &
		VariantProps<typeof tabsListVariants>
>(({ className, variant = 'primary', ...props }, ref) => {
	return (
		<div className={cn(tabsListWrapperVariants({ variant }))}>
			<TabsPrimitive.List
				ref={ref}
				className={cn(tabsListVariants({ variant }), className)}
				{...props}
			/>
		</div>
	);
});
TabsList.displayName = TabsPrimitive.List.displayName;

// Update TabsTrigger to use variants
const TabsTrigger = forwardRef<
	ElementRef<typeof TabsPrimitive.Trigger>,
	ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> &
		VariantProps<typeof tabsTriggerVariants>
>(({ className, children, variant = 'primary', disabled, ...props }, ref) => {
	const triggerRef = useRef<HTMLButtonElement>(null);

	useImperativeHandle(ref, () => triggerRef.current!);

	return (
		<TabsPrimitive.Trigger
			ref={triggerRef}
			data-slot="tabs-trigger"
			className={cn(tabsTriggerVariants({ variant, className }))}
			disabled={disabled}
			{...props}
		>
			{children}
		</TabsPrimitive.Trigger>
	);
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = forwardRef<
	ElementRef<typeof TabsPrimitive.Content>,
	ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => {
	return (
		<TabsPrimitive.Content
			ref={ref}
			className={cn(
				'mt-2 p-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
				className,
			)}
			{...props}
		/>
	);
});
TabsContent.displayName = TabsPrimitive.Content.displayName;

export default Tabs;
