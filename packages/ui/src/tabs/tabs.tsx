import './index.css';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { LockIcon } from 'lucide-react';
import {
	type ComponentPropsWithoutRef,
	type CSSProperties,
	type ElementRef,
	forwardRef,
	type ReactNode,
	useCallback,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from 'react';
import { cn } from '../lib/utils.js';
import { Tooltip, TooltipProvider } from '../tooltip/index.js';
import styles from './tabs.module.css';

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
>(({ items, onChange, defaultValue, value, variant = 'primary', className, ...props }, ref) => {
	const [activeTabKey, setActiveTabKey] = useState(value || defaultValue || items[0]?.key);
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
	}, [updateActiveSliderPosition]);

	// --- Hover Slider Logic ---
	const handleMouseEnter = (itemKey: string) => {
		if (tabsListRef.current && triggerRefs.current[itemKey]) {
			const hoveredTrigger = triggerRefs.current[itemKey];
			const listRect = tabsListRef.current.getBoundingClientRect();
			const triggerRect = hoveredTrigger?.getBoundingClientRect();

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
			data-variant={variant}
			className={cn(styles['tabs'], className)}
			{...props}
		>
			<TooltipProvider>
				<TabsList variant={variant} ref={tabsListRef}>
					{variant === 'secondary' && <div className={styles['tabs-secondary-border']}></div>}
					{items.map((item) => {
						const triggerContent = (
							<TabsTrigger
								key={item.key}
								value={item.key}
								disabled={item.disabled}
								variant={variant}
								ref={(el: HTMLButtonElement | null) => {
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
									<LockIcon className={styles['tabs-trigger__icon']} size={16} />
								) : (
									item.prefixIcon && (
										<span className={styles['tabs-trigger__icon']}>{item.prefixIcon}</span>
									)
								)}
								{item.label}
								{!item.disabled && item.suffixIcon && (
									<span className={styles['tabs-trigger__icon']}>{item.suffixIcon}</span>
								)}
							</TabsTrigger>
						);

						return item.disabled ? (
							<Tooltip key={item.key} title={item.disabledReason || 'This tab is disabled'}>
								{triggerContent}
							</Tooltip>
						) : (
							triggerContent
						);
					})}
					{variant === 'secondary' ? (
						<div
							className={cn(styles['tabs-secondary-border'], styles['tabs-secondary-border--grow'])}
						></div>
					) : (
						<>
							{/* Hover Slider */}
							<div
								className={styles['tab-hover-slider']}
								style={{
									...hoverSliderStyle,
									height: '28px',
								}}
							/>
							{/* Active Slider */}
							<div className={styles['tab-active-slider']} style={activeSliderStyle} />
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
});
Tabs.displayName = 'Tabs';

// Update TabsList to use data attributes
const TabsList = forwardRef<
	ElementRef<typeof TabsPrimitive.List>,
	ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
		variant?: 'primary' | 'secondary';
	}
>(({ className, variant = 'primary', ...props }, ref) => {
	return (
		<div data-variant={variant} className={styles['tabs-list-wrapper']}>
			<TabsPrimitive.List
				ref={ref}
				data-variant={variant}
				className={cn(styles['tabs-list'], className)}
				{...props}
			/>
		</div>
	);
});
TabsList.displayName = TabsPrimitive.List.displayName;

// Update TabsTrigger to use data attributes
const TabsTrigger = forwardRef<
	ElementRef<typeof TabsPrimitive.Trigger>,
	ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
		variant?: 'primary' | 'secondary';
	}
>(({ className, children, variant = 'primary', disabled, ...props }, ref) => {
	const triggerRef = useRef<HTMLButtonElement>(null);

	useImperativeHandle(ref, () => triggerRef.current!);

	return (
		<TabsPrimitive.Trigger
			ref={triggerRef}
			data-slot="tabs-trigger"
			data-variant={variant}
			className={cn(styles['tabs-trigger'], className)}
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
		<TabsPrimitive.Content ref={ref} className={cn(styles['tabs-content'], className)} {...props} />
	);
});
TabsContent.displayName = TabsPrimitive.Content.displayName;

export default Tabs;
