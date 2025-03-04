import './index.css';
import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from './lib/utils';

// Add context for the colors
const TabsContext = React.createContext<{
	tabColor?: string;
	slideColor?: string;
	hoverColor?: string;
}>({});

const TabsRoot = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> & {
		tabColor?: string;
		slideColor?: string;
		hoverColor?: string;
	}
>(({ tabColor, slideColor, hoverColor, ...props }, ref) => (
	<TabsContext.Provider value={{ tabColor, slideColor, hoverColor }}>
		<TabsPrimitive.Root
			ref={ref}
			className="d-flex flex-column align-top text-left"
			{...props}
		/>
	</TabsContext.Provider>
));
TabsRoot.displayName = TabsPrimitive.Root.displayName;

// Define the TabItem type
type TabItemType = {
	key: string;
	label: React.ReactNode;
	children: React.ReactNode;
	disabled?: boolean;
	prefixIcon?: React.ReactNode;
	suffixIcon?: React.ReactNode;
};

// Create the new main Tabs component
const Tabs = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.Root>,
	Omit<React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>, 'children'> & {
		items: TabItemType[];
		tabColor?: string;
		slideColor?: string;
		hoverColor?: string;
		onChange?: (key: string) => void;
	}
>(({ items, onChange, ...props }, ref) => {
	const handleValueChange = (value: string) => {
		onChange?.(value);
	};

	return (
		<TabsRoot ref={ref} onValueChange={handleValueChange} {...props}>
			<TabsList>
				{items.map((item) => (
					<TabsTrigger key={item.key} value={item.key} disabled={item.disabled}>
						{item.prefixIcon && item.prefixIcon}
						{item.label}
						{item.suffixIcon && item.suffixIcon}
					</TabsTrigger>
				))}
			</TabsList>
			{items.map((item) => (
				<TabsContent key={item.key} value={item.key}>
					{item.children}
				</TabsContent>
			))}
		</TabsRoot>
	);
});
Tabs.displayName = 'Tabs';

const TabsList = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.List>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => {
	const { slideColor, hoverColor } = React.useContext(TabsContext);

	return (
		<TabsPrimitive.List
			ref={ref}
			className={cn(
				'inline-flex items-center gap-6 p-1 rounded-md relative',
				'before:absolute before:content-[""] before:h-[calc(100%-8px)] before:top-1',
				{
					[`before:bg-${hoverColor}/10`]: hoverColor,
					'before:bg-vanilla-100/10': !hoverColor,
				},
				'before:rounded',
				'before:transition-[width,transform,opacity] before:duration-200 before:ease-in-out',
				'before:opacity-0 hover:before:opacity-100',
				'[--tab-width:0px] [--tab-left:0px]',
				'before:w-[var(--tab-width)] before:transform before:translate-x-[var(--tab-left)]',

				// Active state underline
				'after:absolute after:content-[""] after:bottom-[-8px] after:left-0 after:h-0.5',
				{
					[`after:bg-${slideColor}`]: slideColor,
					'after:bg-robin-500': !slideColor,
				},
				'after:rounded-full after:transition-[width,transform]',
				'after:duration-200 after:ease-in-out',
				'[--active-width:0px] [--active-left:0px]',
				'after:w-[var(--active-width)] after:transform after:translate-x-[var(--active-left)]',
				className,
			)}
			{...props}
		/>
	);
});
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => {
	const triggerRef = React.useRef<HTMLButtonElement>(null);
	const { tabColor } = React.useContext(TabsContext);

	React.useImperativeHandle(ref, () => triggerRef.current!);

	const updateActiveStyles = React.useCallback(() => {
		const button = triggerRef.current;
		if (!button) return;

		const list = button.closest('[role="tablist"]');
		if (!list) return;

		const rect = button.getBoundingClientRect();
		const listRect = list.getBoundingClientRect();
		const left = rect.left - listRect.left;

		(list as HTMLElement).style.setProperty('--active-width', `${rect.width}px`);
		(list as HTMLElement).style.setProperty('--active-left', `${left}px`);
	}, []);

	React.useEffect(() => {
		const button = triggerRef.current;
		if (!button) return;

		// Create a mutation observer to watch for attribute changes
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (
					mutation.type === 'attributes' &&
					mutation.attributeName === 'data-state' &&
					button.getAttribute('data-state') === 'active'
				) {
					// Use requestAnimationFrame to ensure DOM measurements are accurate
					requestAnimationFrame(updateActiveStyles);
				}
			});
		});

		// Start observing the button for attribute changes
		observer.observe(button, { attributes: true });

		// Check initial state
		if (button.getAttribute('data-state') === 'active') {
			requestAnimationFrame(updateActiveStyles);
		}

		return () => observer.disconnect();
	}, [updateActiveStyles]);

	const updateTabHoverStyles = (e: React.MouseEvent<HTMLButtonElement>) => {
		const button = e.currentTarget;
		const list = button.closest('[role="tablist"]');
		if (!list) return;

		const rect = button.getBoundingClientRect();
		const listRect = list.getBoundingClientRect();
		const left = rect.left - listRect.left - 4; // Subtract 4px to account for padding

		(list as HTMLElement).style.setProperty('--tab-width', `${rect.width}px`);
		(list as HTMLElement).style.setProperty('--tab-left', `${left}px`);
	};

	const resetTabHoverStyles = (e: React.MouseEvent<HTMLButtonElement>) => {
		const button = e.currentTarget;
		const list = button.closest('[role="tablist"]');
		if (!list) return;

		(list as HTMLElement).style.setProperty('--tab-width', '0px');
	};

	return (
		<TabsPrimitive.Trigger
			ref={triggerRef}
			className={cn(
				'inline-flex items-center gap-2 rounded px-1.5 py-1 text-sm font-normal',
				// 'text-vanilla-400 transition-colors hover:text-vanilla-100',
				'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-juniper-500',
				'disabled:pointer-events-none disabled:opacity-50',
				'data-[state=active]:bg-transparent',
				'relative z-10',
				{
					[`text-${tabColor} hover:text-${tabColor}  data-[state=active]:text-${tabColor}`]:
						tabColor,
					'text-vanilla-400 hover:text-vanilla-100 data-[state=active]:text-vanilla-100':
						!tabColor,
				},
				className,
			)}
			onMouseEnter={updateTabHoverStyles}
			onMouseLeave={resetTabHoverStyles}
			{...props}
		/>
	);
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

// TabsContent remains unchanged
const TabsContent = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
	<TabsPrimitive.Content
		ref={ref}
		className={cn(
			'mt-2 p-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
			className,
		)}
		{...props}
	/>
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export default Tabs;
