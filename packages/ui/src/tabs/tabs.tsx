import * as TabsPrimitive from '@radix-ui/react-tabs';
import { Lock } from '@signozhq/icons';
import * as React from 'react';
import { cn } from '../lib/utils.js';
import { Tooltip, TooltipProvider } from '../tooltip/index.js';
import styles from './tabs.module.scss';

export type TabVariants = 'primary' | 'secondary';

export type TabItemProps = {
	/**
	 * Unique identifier for the tab item.
	 */
	key: string;
	/**
	 * The label content displayed in the tab trigger.
	 */
	label: React.ReactNode;
	/**
	 * The content displayed when the tab is active.
	 */
	children: React.ReactNode;
	/**
	 * When true, prevents the user from interacting with the tab.
	 */
	disabled?: boolean;
	/**
	 * Tooltip message shown when the tab is disabled.
	 */
	disabledReason?: string;
	/**
	 * Icon displayed before the tab label.
	 */
	prefixIcon?: React.ReactNode;
	/**
	 * Icon displayed after the tab label.
	 */
	suffixIcon?: React.ReactNode;
};

export type TabsProps = Pick<
	React.ComponentPropsWithoutRef<'div'>,
	'id' | 'className' | 'children'
> & {
	/**
	 * Array of tab items to render.
	 */
	items: TabItemProps[];
	/**
	 * The visual style variant of the tabs.
	 * @default 'primary'
	 */
	variant?: TabVariants;
	/**
	 * The value of the tab that should be active when initially rendered.
	 * Use when you do not need to control the state of the tabs.
	 */
	defaultValue?: string;
	/**
	 * The controlled value of the tab to activate.
	 * Should be used in conjunction with onChange.
	 */
	value?: string;
	/**
	 * Event handler called when the active tab changes.
	 */
	onChange?: (key: string) => void;
	/**
	 * The orientation of the tabs.
	 */
	orientation?: 'horizontal' | 'vertical';
	/**
	 * The direction of navigation when using keyboard.
	 */
	dir?: 'ltr' | 'rtl';
	/**
	 * When automatic, tabs are activated when receiving focus.
	 * When manual, tabs are activated when clicked.
	 * @default 'automatic'
	 */
	activationMode?: 'automatic' | 'manual';
};

/**
 * Tabs component for organizing content into separate views.
 *
 * @example
 * ```tsx
 * // Basic usage with primary variant
 * <Tabs
 *   items={[
 *     { key: 'tab1', label: 'Tab 1', children: <div>Content 1</div> },
 *     { key: 'tab2', label: 'Tab 2', children: <div>Content 2</div> },
 *   ]}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Secondary variant with controlled state
 * const [activeTab, setActiveTab] = React.useState('tab1');
 * <Tabs
 *   variant="secondary"
 *   value={activeTab}
 *   onChange={setActiveTab}
 *   items={[
 *     { key: 'tab1', label: 'Overview', children: <div>Overview content</div> },
 *     { key: 'tab2', label: 'Details', children: <div>Details content</div> },
 *   ]}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With icons and disabled tabs
 * <Tabs
 *   items={[
 *     { key: 'tab1', label: 'Home', prefixIcon: <HomeIcon />, children: <div>Home</div> },
 *     { key: 'tab2', label: 'Settings', disabled: true, disabledReason: 'Coming soon', children: <div>Settings</div> },
 *   ]}
 * />
 * ```
 */
export const Tabs = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Root>, TabsProps>(
	({ items, onChange, defaultValue, value, variant = 'primary', className, ...props }, ref) => {
		return (
			<TabsRoot
				ref={ref}
				onValueChange={onChange}
				defaultValue={defaultValue ?? items[0]?.key}
				value={value}
				className={className}
				{...props}
			>
				<TooltipProvider>
					<TabsList variant={variant}>
						{items.map((item) => {
							const triggerContent = (
								<TabsTrigger
									key={item.key}
									value={item.key}
									disabled={item.disabled}
									variant={variant}
								>
									{item.disabled ? (
										<Lock className={styles['tabs__icon']} size={16} />
									) : (
										item.prefixIcon && (
											<span className={styles['tabs__icon']}>{item.prefixIcon}</span>
										)
									)}
									{item.label}
									{!item.disabled && item.suffixIcon && (
										<span className={styles['tabs__icon']}>{item.suffixIcon}</span>
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
					</TabsList>
					{items.map((item) => (
						<TabsContent key={item.key} value={item.key}>
							{item.children}
						</TabsContent>
					))}
				</TooltipProvider>
			</TabsRoot>
		);
	}
);

export type TabsListProps = Pick<
	React.ComponentPropsWithoutRef<'div'>,
	'id' | 'className' | 'children'
> & {
	/**
	 * The visual style variant of the tabs list.
	 */
	variant?: TabVariants;
	/**
	 * When true, keyboard navigation will loop from last tab to first, and vice versa.
	 */
	loop?: boolean;
};

/**
 * Container for tab triggers that provides navigation and styling.
 *
 * @example
 * ```tsx
 * // Basic usage with TabsTrigger children
 * <TabsList>
 *   <TabsTrigger value="tab1">Tab 1</TabsTrigger>
 *   <TabsTrigger value="tab2">Tab 2</TabsTrigger>
 * </TabsList>
 * ```
 *
 * @example
 * ```tsx
 * // Secondary variant with keyboard loop navigation
 * <TabsList variant="secondary" loop>
 *   <TabsTrigger value="overview">Overview</TabsTrigger>
 *   <TabsTrigger value="analytics">Analytics</TabsTrigger>
 *   <TabsTrigger value="reports">Reports</TabsTrigger>
 * </TabsList>
 * ```
 */
export const TabsList = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.List>,
	TabsListProps
>(({ className, variant = 'primary', children, ...props }, ref) => {
	const listRef = React.useRef<HTMLDivElement>(null);
	const activeSliderRef = React.useRef<HTMLDivElement>(null);
	const hoverSliderRef = React.useRef<HTMLDivElement>(null);

	// Combine refs
	React.useImperativeHandle(ref, () => listRef.current as HTMLDivElement);

	const updateSliderPosition = React.useCallback(
		(slider: HTMLDivElement | null, trigger: HTMLElement | null) => {
			if (!slider || !trigger || !listRef.current) {
				if (slider) slider.style.opacity = '0';
				return;
			}

			const listRect = listRef.current.getBoundingClientRect();
			const triggerRect = trigger.getBoundingClientRect();
			const offset = triggerRect.left - listRect.left;

			slider.style.transform = `translateX(${offset}px)`;
			slider.style.width = `${triggerRect.width}px`;
			slider.style.opacity = '1';
		},
		[]
	);

	const updateActiveSlider = React.useCallback(() => {
		if (variant !== 'primary' || !listRef.current) return;

		const activeTrigger = listRef.current.querySelector<HTMLElement>(
			'[data-slot="tabs-trigger"][data-state="active"]'
		);
		updateSliderPosition(activeSliderRef.current, activeTrigger);
	}, [variant, updateSliderPosition]);

	// Update active slider on mount and when children change
	React.useEffect(() => {
		if (variant !== 'primary') return;

		requestAnimationFrame(updateActiveSlider);

		// Observe for data-state changes on triggers
		const list = listRef.current;
		if (!list) return;

		const observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				if (mutation.type === 'attributes' && mutation.attributeName === 'data-state') {
					updateActiveSlider();
					break;
				}
			}
		});

		observer.observe(list, {
			attributes: true,
			attributeFilter: ['data-state'],
			subtree: true,
		});

		return () => observer.disconnect();
	}, [variant, updateActiveSlider]);

	React.useEffect(() => {
		if (variant !== 'primary') return;

		const handleResize = () => updateActiveSlider();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, [variant, updateActiveSlider]);

	const handleMouseOver = React.useCallback(
		(e: React.MouseEvent) => {
			if (variant !== 'primary') return;

			const trigger = (e.target as HTMLElement).closest<HTMLElement>('[data-slot="tabs-trigger"]');
			if (trigger) {
				updateSliderPosition(hoverSliderRef.current, trigger);
			}
		},
		[variant, updateSliderPosition]
	);

	const handleMouseLeave = React.useCallback(() => {
		if (variant !== 'primary') return;

		const slider = hoverSliderRef.current;
		if (slider) slider.style.opacity = '0';
	}, [variant]);

	return (
		<div className={styles['tabs__list-wrapper']} data-variant={variant}>
			{variant === 'secondary' && <div className={styles['tabs__border-spacer']} />}
			<TabsPrimitive.List
				ref={listRef}
				className={cn(styles['tabs__list'], className)}
				data-variant={variant}
				onMouseOver={variant === 'primary' ? handleMouseOver : undefined}
				onMouseLeave={variant === 'primary' ? handleMouseLeave : undefined}
				{...props}
			>
				{children}
			</TabsPrimitive.List>
			{variant === 'secondary' ? (
				<div className={cn(styles['tabs__border-spacer'], styles['tabs__border-spacer--grow'])} />
			) : (
				<>
					<div
						ref={hoverSliderRef}
						className={styles['tabs__hover-slider']}
						style={{ height: '28px', opacity: 0 }}
					/>
					<div
						ref={activeSliderRef}
						className={styles['tabs__active-slider']}
						style={{ opacity: 0 }}
					/>
				</>
			)}
		</div>
	);
});

export type TabsTriggerProps = Pick<
	React.ComponentPropsWithoutRef<'button'>,
	'id' | 'className' | 'children' | 'onMouseEnter' | 'onMouseDown' | 'onMouseLeave'
> & {
	/**
	 * The unique value that associates the trigger with a content panel.
	 */
	value: string;
	/**
	 * When true, prevents the user from interacting with the tab.
	 */
	disabled?: boolean;
	/**
	 * The visual style variant of the trigger.
	 */
	variant?: TabVariants;
};

/**
 * Interactive button that activates its associated tab content panel.
 *
 * @example
 * ```tsx
 * // Basic tab trigger
 * <TabsTrigger value="settings">Settings</TabsTrigger>
 * ```
 *
 * @example
 * ```tsx
 * // Disabled trigger with secondary variant
 * <TabsTrigger value="admin" variant="secondary" disabled>
 *   Admin Panel
 * </TabsTrigger>
 * ```
 *
 * @example
 * ```tsx
 * // With custom event handlers
 * <TabsTrigger
 *   value="dashboard"
 *   onMouseEnter={() => prefetchData()}
 *   onMouseLeave={() => cancelPrefetch()}
 * >
 *   Dashboard
 * </TabsTrigger>
 * ```
 */
export const TabsTrigger = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.Trigger>,
	TabsTriggerProps
>(({ className, children, variant = 'primary', disabled, ...props }, ref) => (
	<TabsPrimitive.Trigger
		ref={ref}
		data-slot="tabs-trigger"
		data-variant={variant}
		className={cn(styles['tabs__trigger'], className)}
		disabled={disabled}
		{...props}
	>
		{children}
	</TabsPrimitive.Trigger>
));

export type TabsContentProps = Pick<
	React.ComponentPropsWithoutRef<'div'>,
	'id' | 'className' | 'children'
> & {
	/**
	 * The unique value that associates the content with a trigger.
	 */
	value: string;
	/**
	 * When true, content is kept mounted in the DOM when inactive.
	 */
	forceMount?: true;
};

/**
 * Container for the content associated with a tab trigger.
 *
 * @example
 * ```tsx
 * // Basic tab content
 * <TabsContent value="profile">
 *   <ProfileSettings />
 * </TabsContent>
 * ```
 *
 * @example
 * ```tsx
 * // With forceMount to keep content in DOM when inactive
 * <TabsContent value="video" forceMount>
 *   <VideoPlayer />
 * </TabsContent>
 * ```
 *
 * @example
 * ```tsx
 * // Multiple content panels with custom styling
 * <>
 *   <TabsContent value="code" className="p-4">
 *     <CodeEditor />
 *   </TabsContent>
 *   <TabsContent value="preview" className="p-4">
 *     <LivePreview />
 *   </TabsContent>
 * </>
 * ```
 */
export const TabsContent = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.Content>,
	TabsContentProps
>(({ className, ...props }, ref) => {
	return (
		<TabsPrimitive.Content
			ref={ref}
			className={cn(styles['tabs__content'], className)}
			{...props}
		/>
	);
});

export type TabsRootProps = Pick<
	React.ComponentPropsWithoutRef<'div'>,
	'id' | 'className' | 'children'
> & {
	/**
	 * The direction of navigation when using keyboard.
	 */
	dir?: 'ltr' | 'rtl';
	/**
	 * The value of the tab that should be active when initially rendered.
	 * Use when you do not need to control the state of the tabs.
	 */
	defaultValue?: string;
	/**
	 * The controlled value of the tab to activate.
	 * Should be used in conjunction with onValueChange.
	 */
	value?: string;
	/**
	 * Event handler called when the active tab changes.
	 */
	onValueChange?: (value: string) => void;
	/**
	 * The orientation of the tabs.
	 */
	orientation?: 'horizontal' | 'vertical';
	/**
	 * When automatic, tabs are activated when receiving focus.
	 * When manual, tabs are activated when clicked.
	 * @default 'automatic'
	 */
	activationMode?: 'automatic' | 'manual';
};

/**
 * Root container for primitive tabs composition.
 * Use this when you need full control over the tabs structure.
 *
 * @example
 * ```tsx
 * <TabsRoot defaultValue="tab1">
 *   <TabsList variant="primary">
 *     <TabsTrigger value="tab1">Tab 1</TabsTrigger>
 *     <TabsTrigger value="tab2">Tab 2</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="tab1">Content 1</TabsContent>
 *   <TabsContent value="tab2">Content 2</TabsContent>
 * </TabsRoot>
 * ```
 */
export const TabsRoot = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.Root>,
	TabsRootProps
>(({ className, ...props }, ref) => {
	return <TabsPrimitive.Root ref={ref} className={cn(styles.tabs, className)} {...props} />;
});
