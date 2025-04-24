import './index.css';
import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';

import { cn } from './lib/utils'; // Assuming cn utility is available at this path

// Add context (keeping this as it was part of the desired structure, though colors aren't used in styling now)
const TabsContext = React.createContext<{
	tabColor?: string;
	slideColor?: string;
	hoverColor?: string;
}>({});

// TabsRoot component to provide the context (keeping this structure)
const TabsRoot = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> & {
		tabColor?: string;
		slideColor?: string;
		hoverColor?: string;
	}
>(({ tabColor, slideColor, hoverColor, className, ...props }, ref) => (
	<TabsContext.Provider value={{ tabColor, slideColor, hoverColor }}>
		<TabsPrimitive.Root
			ref={ref}
			className={cn('flex flex-col gap-2', className)}
			{...props}
		/>
	</TabsContext.Provider>
));
TabsRoot.displayName = TabsPrimitive.Root.displayName;

// Define the TabItem type (keeping this structure)
type TabItemType = {
	key: string;
	label: React.ReactNode;
	children: React.ReactNode;
	disabled?: boolean;
	prefixIcon?: React.ReactNode;
	suffixIcon?: React.ReactNode;
};

// Create the new main Tabs component that consumes the items prop
const Tabs = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.Root>,
	Omit<React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>, 'children'> & {
		items: TabItemType[];
		tabColor?: string;
		slideColor?: string;
		hoverColor?: string;
		onChange?: (key: string) => void;
	}
>(({ items, onChange, defaultValue, value, ...props }, ref) => {
	const handleValueChange = (newValue: string) => {
		onChange?.(newValue);
	};

	return (
		// Use TabsRoot to provide context and wrap the primitive root
		<TabsRoot
			ref={ref}
			onValueChange={handleValueChange}
			defaultValue={defaultValue}
			value={value}
			{...props}
		>
			{/* Render the list of triggers based on items */}
			<TabsList>
				{items.map((item) => (
					<TabsTrigger key={item.key} value={item.key} disabled={item.disabled}>
						{item.prefixIcon && item.prefixIcon}
						{item.label}
						{item.suffixIcon && item.suffixIcon}
					</TabsTrigger>
				))}
			</TabsList>
			{/* Render the content for each tab based on items */}
			{items.map((item) => (
				<TabsContent key={item.key} value={item.key}>
					{item.children}
				</TabsContent>
			))}
		</TabsRoot>
	);
});
Tabs.displayName = 'Tabs';

// TabsList component
const TabsList = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.List>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => {
	return (
		<div className=" w-full border-b border-b-secondary rounded-none pl-4">
			<TabsPrimitive.List
				ref={ref}
				className={cn(
					'text-muted-foreground inline-flex h-9 w-fit items justify-center bg-transparent',
					className,
				)}
				{...props}
			/>
		</div>
	);
});
TabsList.displayName = TabsPrimitive.List.displayName;

// TabsTrigger component
const TabsTrigger = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, children, ...props }, ref) => {
	return (
		<TabsPrimitive.Trigger
			ref={ref}
			className={cn(
				'inline-flex h-full flex-1 items-center justify-center gap-1.5 bg-background ',
				'whitespace-nowrap px-5 py-1 text-sm font-small transition-[color]',
				'border-t border-b-none border-l last:border-r border-secondary first:rounded-tl-[1px] last:rounded-tr-[1px]',
				'text-slate-50 dark:text-vanilla-400',
				'data-[state=active]:bg-card data-[state=active]:border-b-transparent',
				'hover:text-slate-400 dark:hover:text-vanilla-100 data-[state=active]:text-slate-400 dark:data-[state=active]:bg-input/30 dark:data-[state=active]:text-vanilla-100',
				'focus-visible:ring-ring/50 focus-visible:outline-ring focus-visible:ring-[3px] focus-visible:outline-1',
				'disabled:pointer-events-none disabled:opacity-50',
				"[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
				'data-[state=active]:mb-[-0.75px] data-[state=active]:h-[calc(100%+0.75px)] data-[state=active]:pb-[4.7px]',
				'cursor-pointer',
				className,
			)}
			{...props}
		>
			{children}
		</TabsPrimitive.Trigger>
	);
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => {
	return (
		<TabsPrimitive.Content
			ref={ref}
			// Reverted to original className from the first prompt
			className={cn('flex-1 outline-hidden', className)}
			{...props}
		/>
	);
});
TabsContent.displayName = TabsPrimitive.Content.displayName;

// Export only the main Tabs component
export default Tabs;
