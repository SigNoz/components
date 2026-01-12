import './index.css';

import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Command as CommandPrimitive } from 'cmdk';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from './lib/utils';

const Combobox = PopoverPrimitive.Root;

const ComboboxTrigger = React.forwardRef<
	React.ElementRef<typeof PopoverPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger> & {
		placeholder?: string;
		value?: string;
	}
>(({ className, placeholder, value, ...props }, ref) => (
	<PopoverPrimitive.Trigger
		ref={ref}
		className={cn(
			'flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
			className,
		)}
		{...props}
	>
		<span className="line-clamp-1">
			{value || placeholder || 'Select an option...'}
		</span>
		<ChevronDown className="h-4 w-4 opacity-50" />
	</PopoverPrimitive.Trigger>
));
ComboboxTrigger.displayName = 'ComboboxTrigger';

const ComboboxContent = React.forwardRef<
	React.ElementRef<typeof PopoverPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, ...props }, ref) => (
	<PopoverPrimitive.Portal>
		<PopoverPrimitive.Content
			ref={ref}
			className={cn(
				'w-[--radix-popover-trigger-width] rounded-md border bg-popover text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
				className,
			)}
			style={{ minWidth: 'var(--radix-popover-trigger-width)' }}
			{...props}
		/>
	</PopoverPrimitive.Portal>
));
ComboboxContent.displayName = 'ComboboxContent';

const ComboboxCommand = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
	<CommandPrimitive
		ref={ref}
		className={cn('flex h-full w-full flex-col overflow-hidden', className)}
		{...props}
	/>
));
ComboboxCommand.displayName = CommandPrimitive.displayName;

const ComboboxInput = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.Input>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
	<CommandPrimitive.Input
		ref={ref}
		className={cn(
			'flex h-10 w-full rounded-md border-b px-3 py-2 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
			className,
		)}
		{...props}
	/>
));
ComboboxInput.displayName = CommandPrimitive.Input.displayName;

const ComboboxList = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.List>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
	<CommandPrimitive.List
		ref={ref}
		className={cn(
			'max-h-[200px] overflow-y-auto overflow-x-hidden p-1',
			className,
		)}
		{...props}
	/>
));
ComboboxList.displayName = CommandPrimitive.List.displayName;

const ComboboxEmpty = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.Empty>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>(({ className, ...props }, ref) => (
	<CommandPrimitive.Empty
		ref={ref}
		className={cn('py-6 text-center text-sm', className)}
		{...props}
	/>
));
ComboboxEmpty.displayName = CommandPrimitive.Empty.displayName;

const ComboboxLoading = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.Loading>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Loading>
>(({ className, ...props }, ref) => (
	<CommandPrimitive.Loading
		ref={ref}
		className={cn('py-6 text-center text-sm', className)}
		{...props}
	/>
));
ComboboxLoading.displayName = CommandPrimitive.Loading.displayName;

const ComboboxGroup = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.Group>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
	<CommandPrimitive.Group
		ref={ref}
		className={cn('overflow-hidden text-foreground', className)}
		{...props}
	/>
));
ComboboxGroup.displayName = CommandPrimitive.Group.displayName;

const ComboboxLabel = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.Group>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
	<CommandPrimitive.Group
		ref={ref}
		className={cn(
			'overflow-hidden px-2 py-1.5 text-xs font-medium text-muted-foreground',
			className,
		)}
		{...props}
	/>
));
ComboboxLabel.displayName = 'ComboboxLabel';

const ComboboxItem = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item> & {
		isSelected?: boolean;
		showCheck?: boolean;
	}
>(({ className, isSelected, showCheck = true, ...props }, ref) => (
	<CommandPrimitive.Item
		ref={ref}
		className={cn(
			'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
			className,
		)}
		{...props}
	>
		{showCheck && (
			<Check
				className={cn('mr-2 h-4 w-4', isSelected ? 'opacity-100' : 'opacity-0')}
			/>
		)}
		{props.children}
	</CommandPrimitive.Item>
));
ComboboxItem.displayName = CommandPrimitive.Item.displayName;

const ComboboxSeparator = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.Separator>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
	<CommandPrimitive.Separator
		ref={ref}
		className={cn('-mx-1 h-px bg-border', className)}
		{...props}
	/>
));
ComboboxSeparator.displayName = CommandPrimitive.Separator.displayName;

export {
	Combobox,
	ComboboxTrigger,
	ComboboxContent,
	ComboboxCommand,
	ComboboxInput,
	ComboboxList,
	ComboboxEmpty,
	ComboboxLoading,
	ComboboxGroup,
	ComboboxLabel,
	ComboboxItem,
	ComboboxSeparator,
};
