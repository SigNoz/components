import './index.css';

import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Command as CommandPrimitive } from 'cmdk';
import { Check, ChevronDown } from 'lucide-react';
import * as React from 'react';
import { cn } from '../lib/utils.js';
import styles from './combobox.module.css';

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
		className={cn(styles['combobox__trigger'], className)}
		{...props}
	>
		<span className={styles['combobox__trigger-text']}>
			{value || placeholder || 'Select an option...'}
		</span>
		<ChevronDown className={styles['combobox__trigger-icon']} />
	</PopoverPrimitive.Trigger>
));
ComboboxTrigger.displayName = 'ComboboxTrigger';

const ComboboxContent = React.forwardRef<
	React.ElementRef<typeof PopoverPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, ...props }, ref) => (
	<PopoverPrimitive.Portal>
		<PopoverPrimitive.Content
			data-slot="combobox-content"
			ref={ref}
			className={cn(styles['combobox__content'], className)}
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
	<CommandPrimitive ref={ref} className={cn(styles['combobox__command'], className)} {...props} />
));
ComboboxCommand.displayName = CommandPrimitive.displayName;

const ComboboxInput = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.Input>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
	<CommandPrimitive.Input
		ref={ref}
		className={cn(styles['combobox__input'], className)}
		{...props}
	/>
));
ComboboxInput.displayName = CommandPrimitive.Input.displayName;

const ComboboxList = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.List>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
	<CommandPrimitive.List ref={ref} className={cn(styles['combobox__list'], className)} {...props} />
));
ComboboxList.displayName = CommandPrimitive.List.displayName;

const ComboboxEmpty = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.Empty>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>(({ className, ...props }, ref) => (
	<CommandPrimitive.Empty
		ref={ref}
		className={cn(styles['combobox__empty'], className)}
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
		className={cn(styles['combobox__loading'], className)}
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
		className={cn(styles['combobox__group'], className)}
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
		className={cn(styles['combobox__label'], className)}
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
	<CommandPrimitive.Item ref={ref} className={cn(styles['combobox__item'], className)} {...props}>
		{showCheck && (
			<Check
				className={cn(
					styles['combobox__item-check'],
					isSelected
						? styles['combobox__item-check--visible']
						: styles['combobox__item-check--hidden']
				)}
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
		className={cn(styles['combobox__separator'], className)}
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
