import './index.css';
import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { type VariantProps } from 'class-variance-authority';
import { cn } from './lib/utils';
import {
	tabsListVariants,
	tabsListWrapperVariants,
	tabsTriggerVariants,
	tabsVariants,
} from './tabVariants';

type TabItemType = {
	key: string;
	label: React.ReactNode;
	children: React.ReactNode;
	disabled?: boolean;
	prefixIcon?: React.ReactNode;
	suffixIcon?: React.ReactNode;
};

const Tabs = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> & {
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
		const handleValueChange = (newValue: string) => {
			onChange?.(newValue);
		};

		return (
			<TabsPrimitive.Root
				ref={ref}
				onValueChange={handleValueChange}
				defaultValue={defaultValue}
				value={value}
				className={cn(tabsVariants({ variant, className }))}
				{...props}
			>
				<TabsList variant={variant}>
					<div className="min-w-4  border-b border-secondary flex-0"></div>
					{items.map((item) => (
						<TabsTrigger
							key={item.key}
							value={item.key}
							disabled={item.disabled}
							variant={variant}
						>
							{item.prefixIcon && item.prefixIcon}
							{item.label}
							{item.suffixIcon && item.suffixIcon}
						</TabsTrigger>
					))}
					<div className="min-w-4  border-b border-secondary flex-0"></div>
				</TabsList>
				{items.map((item) => (
					<TabsContent key={item.key} value={item.key}>
						{item.children}
					</TabsContent>
				))}
			</TabsPrimitive.Root>
		);
	},
);
Tabs.displayName = 'Tabs';

// Update TabsList to use variants
const TabsList = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.List>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> &
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

const updateActiveStyles = (triggerRef: React.RefObject<HTMLButtonElement>) => {
	const button = triggerRef.current;
	if (!button) return;

	const list = button.closest('[role="tablist"]');
	if (!list) return;

	const rect = button.getBoundingClientRect();
	const listRect = list.getBoundingClientRect();
	const left = rect.left - listRect.left;

	(list as HTMLElement).style.setProperty('--active-width', `${rect.width}px`);
	(list as HTMLElement).style.setProperty('--active-left', `${left}px`);
};

// Update TabsTrigger to use variants
const TabsTrigger = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> &
		VariantProps<typeof tabsTriggerVariants>
>(({ className, children, variant = 'primary', ...props }, ref) => {
	const triggerRef = React.useRef<HTMLButtonElement>(null);

	React.useImperativeHandle(ref, () => triggerRef.current!);

	const memoizedUpdateActiveStyles = React.useCallback(() => {
		updateActiveStyles(triggerRef);
	}, []);

	React.useEffect(() => {
		if (variant !== 'primary') return;

		const button = triggerRef.current;
		if (!button) return;

		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (
					mutation.type === 'attributes' &&
					mutation.attributeName === 'data-state' &&
					button.getAttribute('data-state') === 'active'
				) {
					requestAnimationFrame(memoizedUpdateActiveStyles);
				}
			});
		});

		observer.observe(button, { attributes: true });

		if (button.getAttribute('data-state') === 'active') {
			requestAnimationFrame(memoizedUpdateActiveStyles);
		}

		return () => observer.disconnect();
	}, [variant, memoizedUpdateActiveStyles]);

	return (
		<TabsPrimitive.Trigger
			ref={triggerRef}
			className={cn(tabsTriggerVariants({ variant, className }))}
			onMouseEnter={variant === 'primary' ? updateTabHoverStyles : undefined}
			onMouseLeave={variant === 'primary' ? resetTabHoverStyles : undefined}
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
