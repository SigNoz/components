import './index.css';
import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './lib/utils';

const tabsVariants = cva('flex flex-col gap-2', {
	variants: {
		variant: {
			primary: 'flex flex-col items-start text-left',
			secondary: '',
		},
	},
	defaultVariants: {
		variant: 'primary',
	},
});

const tabsListWrapperVariants = cva('', {
	variants: {
		variant: {
			primary: '',
			secondary: 'w-full border-b rounded-none pl-4 border-secondary',
		},
	},
	defaultVariants: {
		variant: 'primary',
	},
});

const tabsListVariants = cva('', {
	variants: {
		variant: {
			primary: [
				'group inline-flex items-center gap-6 p-1 rounded-md relative',
				'before:absolute before:content-[""] before:h-[calc(100%-8px)] before:top-1',
				'before:bg-[#3E44631A] dark:before:bg-[#ABBDFF1A]',
				'before:rounded ',
				'before:transition-[width,transform,opacity] before:duration-200 before:ease-in-out',
				'before:opacity-0 hover:before:opacity-100',
				'[--tab-width:0px] [--tab-left:0px]',
				'before:w-[var(--tab-width)] before:transform before:translate-x-[var(--tab-left)]',
				'after:absolute after:content-[""] after:bottom-[-8px] after:left-0 after:h-0.5',
				'after:bg-primary',
				'after:rounded-full after:transition-[width,transform]',
				'after:duration-200 after:ease-in-out',
				'[--active-width:0px] [--active-left:0px]',
				'after:w-[var(--active-width)] after:transform after:translate-x-[var(--active-left)]',
			],
			secondary: 'border-b-secondary',
		},
	},
	defaultVariants: {
		variant: 'primary',
	},
});

const tabsTriggerVariants = cva('cursor-pointer', {
	variants: {
		variant: {
			primary: [
				'whitespace-nowrap inline-flex items-center gap-2 rounded px-1.5 py-1 text-sm font-normal',
				'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
				'disabled:pointer-events-none disabled:opacity-50',
				'data-[state=active]:bg-background data-[state=active]:text-foreground text-muted-foreground',
				'relative z-10',
			],
			secondary: [
				'inline-flex h-full flex-1 items-center justify-center gap-1.5 bg-background whitespace-nowrap px-5 py-1 text-sm text-sm transition-[color] border-t border-b-none border-l last:border-r first:rounded-tl-[1px] last:rounded-tr-[1px] data-[state=active]:border-b-transparent focus-visible:ring-ring/50 focus-visible:outline-ring focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4 data-[state=active]:mb-[-0.75px] data-[state=active]:h-[calc(100%+0.75px)] data-[state=active]:pb-[4.7px] cursor-pointer',
				'border-secondary',
				'text-slate-50 dark:text-vanilla-400',
				'data-[state=active]:bg-card',
				'hover:text-slate-400 dark:hover:text-vanilla-100',
				'data-[state=active]:text-slate-400 dark:data-[state=active]:bg-input/30 dark:data-[state=active]:text-vanilla-100',
			],
		},
	},
	defaultVariants: {
		variant: 'primary',
	},
});

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

// Export only the main Tabs component
export default Tabs;
