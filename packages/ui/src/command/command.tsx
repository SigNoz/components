import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { Command as CommandPrimitive } from 'cmdk';
import * as React from 'react';
import { Dialog, DialogContent, type DialogPosition } from '../dialog/index.js';
import { cn } from '../lib/utils.js';
import styles from './command.module.scss';

export type CommandProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive>;

/**
 * High-level wrapper around `cmdk`'s `Command` root.
 *
 * Use this as the container for your command palette, and compose it with
 * `CommandInput`, `CommandList`, `CommandGroup`, `CommandItem`, `CommandEmpty`,
 * `CommandSeparator`, and `CommandShortcut`.
 *
 * @example
 * ```tsx
 * <Command>
 *   <CommandInput placeholder="Search commands…" />
 *   <CommandList>
 *     <CommandGroup heading="General">
 *       <CommandItem onSelect={() => console.log('Open settings')}>
 *         Open settings
 *         <CommandShortcut>⌘S</CommandShortcut>
 *       </CommandItem>
 *     </CommandGroup>
 *
 *     <CommandSeparator />
 *
 *     <CommandGroup heading="More">
 *       <CommandItem onSelect={() => console.log('Create report')}>
 *         Create report
 *       </CommandItem>
 *     </CommandGroup>
 *
 *     <CommandEmpty>No results.</CommandEmpty>
 *   </CommandList>
 * </Command>
 * ```
 */
export const Command = React.forwardRef<React.ElementRef<typeof CommandPrimitive>, CommandProps>(
	({ className, ...props }, ref) => (
		<CommandPrimitive ref={ref} className={cn(styles['command'], className)} {...props} />
	)
);

export type CommandDialogProps = React.ComponentProps<typeof Dialog> & {
	position?: DialogPosition;
	offset?: number;
	contentClassName?: string;
};

/**
 * Dialog wrapper for rendering a `Command` palette inside a modal.
 *
 * This is ideal for global command palettes that should float above the page.
 * It accepts all `Dialog` props plus positioning controls (`position`, `offset`)
 * and an optional `contentClassName` to customize the dialog container.
 *
 * @example
 * ```tsx
 * const [open, setOpen] = React.useState(false);
 *
 * return (
 *   <>
 *     <Button type="button" onClick={() => setOpen(true)}>
 *       Open Command Dialog
 *     </Button>
 *
 *     <CommandDialog open={open} onOpenChange={setOpen} position="top" offset={110}>
 *       <CommandInput placeholder="Search or run a command…" />
 *       <CommandList>
 *         <CommandGroup heading="Quick actions">
 *           <CommandItem
 *             onSelect={() => {
 *               console.log('Create report');
 *               setOpen(false);
 *             }}
 *           >
 *             Create report
 *             <CommandShortcut>⌘N</CommandShortcut>
 *           </CommandItem>
 *         </CommandGroup>
 *         <CommandEmpty>No results.</CommandEmpty>
 *       </CommandList>
 *     </CommandDialog>
 *   </>
 * );
 * ```
 */
export const CommandDialog = ({
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

export type CommandInputProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>;

/**
 * Input field used inside `Command` to capture the search query.
 *
 * Renders a search icon and forwards all props to `cmdk`'s `Command.Input`.
 * Use `placeholder` to guide users and `onValueChange` to react to input value.
 *
 * @example
 * ```tsx
 * <Command>
 *   <CommandInput
 *     placeholder="Search or type a command…"
 *     onValueChange={(value) => console.log('Query:', value)}
 *   />
 *   <CommandList>
 *     <CommandEmpty>No results.</CommandEmpty>
 *   </CommandList>
 * </Command>
 * ```
 */
export const CommandInput = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.Input>,
	CommandInputProps
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

export type CommandListProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>;

/**
 * Scrollable list container for `CommandItem`, `CommandGroup`, `CommandEmpty`,
 * and `CommandSeparator`.
 *
 * Use this inside `Command` to render the command results.
 *
 * @example
 * ```tsx
 * <Command>
 *   <CommandInput placeholder="Search commands…" />
 *   <CommandList>
 *     <CommandGroup heading="General">
 *       <CommandItem onSelect={() => console.log('Open settings')}>
 *         Open settings
 *       </CommandItem>
 *     </CommandGroup>
 *     <CommandEmpty>No results.</CommandEmpty>
 *   </CommandList>
 * </Command>
 * ```
 */
export const CommandList = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.List>,
	CommandListProps
>(({ className, ...props }, ref) => (
	<CommandPrimitive.List ref={ref} className={cn(styles['command__list'], className)} {...props} />
));

export type CommandEmptyProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>;

/**
 * Fallback content shown when there are no matching results.
 *
 * Place this inside `CommandList` to customize the empty state wording.
 *
 * @example
 * ```tsx
 * <CommandList>
 *    ...groups and items...
 *   <CommandEmpty>No results. Try a different keyword.</CommandEmpty>
 * </CommandList>
 * ```
 */
export const CommandEmpty = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.Empty>,
	CommandEmptyProps
>((props, ref) => (
	<CommandPrimitive.Empty ref={ref} className={styles['command__empty']} {...props} />
));

export type CommandLoadingProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive.Loading>;

export const CommandLoading = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.Loading>,
	CommandLoadingProps
>(({ className, ...props }, ref) => (
	<CommandPrimitive.Loading
		ref={ref}
		className={cn(styles['command__loading'], className)}
		{...props}
	/>
));

export type CommandGroupProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>;

/**
 * Groups related `CommandItem` entries under an optional heading.
 *
 * Useful for visually separating different kinds of actions or scopes.
 *
 * @example
 * ```tsx
 * <CommandList>
 *   <CommandGroup heading="General">
 *     <CommandItem onSelect={() => console.log('Toggle sidebar')}>
 *       Toggle sidebar
 *     </CommandItem>
 *   </CommandGroup>
 *
 *   <CommandSeparator />
 *
 *   <CommandGroup heading="Reports">
 *     <CommandItem onSelect={() => console.log('Create report')}>
 *       Create report
 *     </CommandItem>
 *   </CommandGroup>
 * </CommandList>
 * ```
 */
export const CommandGroup = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.Group>,
	CommandGroupProps
>(({ className, ...props }, ref) => (
	<CommandPrimitive.Group
		ref={ref}
		className={cn(styles['command__group'], className)}
		{...props}
	/>
));

export type CommandSeparatorProps = React.ComponentPropsWithoutRef<
	typeof CommandPrimitive.Separator
>;

/**
 * Visual divider between sections inside `CommandList`.
 *
 * Place between `CommandGroup` blocks to separate categories of commands.
 *
 * @example
 * ```tsx
 * <CommandList>
 *   <CommandGroup heading="Top picks">
 *     <CommandItem onSelect={() => console.log('Alpha')}>Alpha</CommandItem>
 *   </CommandGroup>
 *
 *   <CommandSeparator />
 *
 *   <CommandGroup heading="More suggestions">
 *     <CommandItem onSelect={() => console.log('Beta')}>Beta</CommandItem>
 *   </CommandGroup>
 * </CommandList>
 * ```
 */
export const CommandSeparator = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.Separator>,
	CommandSeparatorProps
>(({ className, ...props }, ref) => (
	<CommandPrimitive.Separator
		ref={ref}
		className={cn(styles['command__separator'], className)}
		{...props}
	/>
));

export type CommandItemProps = Omit<
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>,
	'prefix' | 'suffix'
> & {
	/**
	 * The prefix to display before the item label.
	 * null will not render the default prefix (Check icon).
	 */
	prefix?: React.ReactNode | null;
	/**
	 * The suffix to display after the item label.
	 * null will not render the suffix.
	 */
	suffix?: React.ReactNode | null;
};

/**
 * Clickable or keyboard-selectable item representing a single command.
 *
 * Use inside `CommandGroup` or directly in `CommandList`. Handle the `onSelect`
 * callback to react when the user activates the item.
 *
 * @example
 * ```tsx
 * <CommandList>
 *   <CommandGroup heading="Actions">
 *     <CommandItem
 *       onSelect={() => {
 *         console.log('Open settings');
 *       }}
 *     >
 *       Open settings
 *       <CommandShortcut>⌘S</CommandShortcut>
 *     </CommandItem>
 *   </CommandGroup>
 * </CommandList>
 * ```
 */
export const CommandItem = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.Item>,
	CommandItemProps
>(({ className, prefix, suffix, children, ...props }, ref) => (
	<CommandPrimitive.Item ref={ref} className={cn(styles['command__item'], className)} {...props}>
		{prefix != null && <span className={styles['command__item-prefix']}>{prefix}</span>}
		{children}
		{suffix != null && <span className={styles['command__item-suffix']}>{suffix}</span>}
	</CommandPrimitive.Item>
));

export type CommandShortcutProps = React.HTMLAttributes<HTMLSpanElement>;

/**
 * Right-aligned helper text, typically used to display keyboard shortcuts
 * next to a `CommandItem` label.
 *
 * @example
 * ```tsx
 * <CommandItem onSelect={() => console.log('New report')}>
 *   Create report
 *   <CommandShortcut>⌘N</CommandShortcut>
 * </CommandItem>
 * ```
 */
export const CommandShortcut = ({ className, ...props }: CommandShortcutProps) => {
	return <span className={cn(styles['command__shortcut'], className)} {...props} />;
};
