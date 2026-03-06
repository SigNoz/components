import './index.css';

import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { Command as CommandPrimitive } from 'cmdk';
import * as React from 'react';
import { cn } from '../lib/utils.js';
import styles from './command.module.css';
import { Dialog, DialogContent } from './dialog.js';

const Command = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
	<CommandPrimitive ref={ref} className={cn(styles['command'], className)} {...props} />
));
Command.displayName = CommandPrimitive.displayName;

type DialogPosition = 'center' | 'top' | 'custom';
type CommandDialogProps = React.ComponentProps<typeof Dialog> & {
	position?: DialogPosition;
	offset?: number;
	contentClassName?: string;
};

const CommandDialog = ({
	children,
	position = 'center',
	offset = 100,
	contentClassName,
	...props
}: CommandDialogProps) => {
	return (
		<Dialog {...props}>
			<DialogContent
				className={cn(styles['command__dialog-content'], contentClassName)}
				position={position}
				offset={offset}
			>
				<Command className={styles['command__dialog-styles']}>{children}</Command>
			</DialogContent>
		</Dialog>
	);
};

const CommandInput = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.Input>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
	<div className={styles['command__input-wrapper']}>
		<MagnifyingGlassIcon className={styles['command__input-icon']} />
		<CommandPrimitive.Input
			ref={ref}
			className={cn(styles['command__input'], className)}
			{...props}
		/>
	</div>
));

CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.List>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
	<CommandPrimitive.List ref={ref} className={cn(styles['command__list'], className)} {...props} />
));

CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.Empty>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
	<CommandPrimitive.Empty ref={ref} className={styles['command__empty']} {...props} />
));

CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.Group>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
	<CommandPrimitive.Group
		ref={ref}
		className={cn(styles['command__group'], className)}
		{...props}
	/>
));

CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandSeparator = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.Separator>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
	<CommandPrimitive.Separator
		ref={ref}
		className={cn(styles['command__separator'], className)}
		{...props}
	/>
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

const CommandItem = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
	<CommandPrimitive.Item ref={ref} className={cn(styles['command__item'], className)} {...props} />
));

CommandItem.displayName = CommandPrimitive.Item.displayName;

const CommandShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
	return <span className={cn(styles['command__shortcut'], className)} {...props} />;
};
CommandShortcut.displayName = 'CommandShortcut';

export {
	Command,
	CommandDialog,
	CommandInput,
	CommandList,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandShortcut,
	CommandSeparator,
};
