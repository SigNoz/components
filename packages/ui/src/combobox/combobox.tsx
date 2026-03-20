import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Check, ChevronDown } from 'lucide-react';
import * as React from 'react';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	type CommandItemProps,
	CommandList,
	CommandLoading,
	CommandSeparator,
} from '../command/index.js';
import { cn } from '../lib/utils.js';
import { PopoverContent, type PopoverContentProps } from '../popover/index.js';
import styles from './combobox.module.scss';

/**
 * Root component for the combobox. Controls open/close state of the popover.
 *
 * Compose with `ComboboxTrigger`, `ComboboxContent`, `ComboboxCommand`, `ComboboxInput`,
 * `ComboboxList`, `ComboboxGroup`, `ComboboxItem`, `ComboboxEmpty`,
 * `ComboboxSeparator`, and `ComboboxLoading`.
 *
 * @example
 * ```tsx
 * const [value, setValue] = useState('');
 * const [open, setOpen] = useState(false);
 *
 * return (
 *   <Combobox open={open} onOpenChange={setOpen}>
 *     <ComboboxTrigger placeholder="Select..." value={value} />
 *     <ComboboxContent>
 *       <ComboboxCommand>
 *         <ComboboxInput placeholder="Search..." />
 *         <ComboboxList>
 *           <ComboboxItem value="react" onSelect={() => setValue('react')}>
 *             React
 *           </ComboboxItem>
 *           <ComboboxEmpty>No results.</ComboboxEmpty>
 *         </ComboboxList>
 *       </ComboboxCommand>
 *     </ComboboxContent>
 *   </Combobox>
 * );
 * ```
 */
export const Combobox = PopoverPrimitive.Root;

export type ComboboxTriggerProps = Omit<
	React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>,
	'value'
> & {
	placeholder?: React.ReactNode;
	value?: React.ReactNode;
};

/**
 * Trigger button that opens the combobox popover and displays the selected value.
 *
 * Use `placeholder` when no value is selected and `value` to show the current selection.
 *
 * @example
 * ```tsx
 * <Combobox>
 *   <ComboboxTrigger placeholder="Select a framework..." value={selectedLabel} />
 *   <ComboboxContent>
 *     ...
 *   </ComboboxContent>
 * </Combobox>
 * ```
 */
export const ComboboxTrigger = React.forwardRef<
	React.ElementRef<typeof PopoverPrimitive.Trigger>,
	ComboboxTriggerProps
>(({ className, placeholder, value, ...props }, ref) => (
	<PopoverPrimitive.Trigger
		ref={ref}
		className={cn(styles['combobox__trigger'], className)}
		{...props}
	>
		<span className={styles['combobox__trigger-value']}>
			{value || placeholder || 'Select an option...'}
		</span>
		<ChevronDown className={styles['combobox__trigger-icon']} />
	</PopoverPrimitive.Trigger>
));

export type ComboboxContentProps = PopoverContentProps;

/**
 * Popover content container that wraps the combobox command and list.
 *
 * Renders in a portal and positions relative to the trigger.
 *
 * @example
 * ```tsx
 * <ComboboxContent>
 *   <ComboboxCommand>
 *     <ComboboxInput placeholder="Search..." />
 *     <ComboboxList>
 *       <ComboboxItem value="react">React</ComboboxItem>
 *     </ComboboxList>
 *   </ComboboxCommand>
 * </ComboboxContent>
 * ```
 */
export const ComboboxContent = React.forwardRef<
	React.ElementRef<typeof PopoverPrimitive.Content>,
	ComboboxContentProps
>(({ className, ...props }, ref) => (
	<PopoverContent
		ref={ref}
		data-slot="combobox-content"
		className={cn(className, styles.combobox__content)}
		{...props}
	/>
));

export type ComboboxCommandProps = React.ComponentPropsWithoutRef<typeof Command>;

/**
 * Command root used inside the combobox for filtering and keyboard navigation.
 *
 * Wraps `Command` with combobox-specific data attributes. Use `shouldFilter={false}`
 * when implementing custom filtering (e.g. async search).
 *
 * @example
 * ```tsx
 * <ComboboxContent>
 *   <ComboboxCommand shouldFilter={false}>
 *     <ComboboxInput placeholder="Search..." onValueChange={setQuery} />
 *     <ComboboxList>
 *       {filteredItems.map((item) => (
 *         <ComboboxItem key={item.value} value={item.value} onSelect={() => setValue(item.value)}>
 *           {item.label}
 *         </ComboboxItem>
 *       ))}
 *     </ComboboxList>
 *   </ComboboxCommand>
 * </ComboboxContent>
 * ```
 */
export function ComboboxCommand(props: ComboboxCommandProps) {
	return <Command data-slot="combobox-command" {...props} />;
}

export type ComboboxInputProps = React.ComponentPropsWithoutRef<typeof CommandInput>;

/**
 * Search input inside the combobox.
 *
 * Renders a search icon and forwards props to the underlying command input.
 *
 * @example
 * ```tsx
 * <ComboboxCommand>
 *   <ComboboxInput
 *     placeholder="Search frameworks..."
 *     onValueChange={(value) => setQuery(value)}
 *   />
 *   <ComboboxList>...</ComboboxList>
 * </ComboboxCommand>
 * ```
 */
export function ComboboxInput(props: ComboboxInputProps) {
	return <CommandInput data-slot="combobox-input" {...props} />;
}

export type ComboboxListProps = React.ComponentPropsWithoutRef<typeof CommandList>;

/**
 * Scrollable list container for combobox items.
 *
 * Use inside `ComboboxCommand` to render the selectable options.
 *
 * @example
 * ```tsx
 * <ComboboxList>
 *   <ComboboxGroup heading="Frameworks">
 *     <ComboboxItem value="react">React</ComboboxItem>
 *     <ComboboxItem value="vue">Vue</ComboboxItem>
 *   </ComboboxGroup>
 *   <ComboboxEmpty>No results.</ComboboxEmpty>
 * </ComboboxList>
 * ```
 */
export function ComboboxList(props: ComboboxListProps) {
	return <CommandList data-slot="combobox-list" {...props} />;
}

export type ComboboxEmptyProps = React.ComponentPropsWithoutRef<typeof CommandEmpty>;

/**
 * Fallback content shown when there are no matching results.
 *
 * Place inside `ComboboxList` to customize the empty state.
 *
 * @example
 * ```tsx
 * <ComboboxList>
 *   {items.map(...)}
 *   <ComboboxEmpty>No framework found. Try a different search.</ComboboxEmpty>
 * </ComboboxList>
 * ```
 */
export function ComboboxEmpty(props: ComboboxEmptyProps) {
	return <CommandEmpty data-slot="combobox-empty" {...props} />;
}

export type ComboboxLoadingProps = React.ComponentPropsWithoutRef<typeof CommandLoading>;

/**
 * Loading indicator shown while fetching or filtering items.
 *
 * Place inside `ComboboxList` when performing async operations.
 *
 * @example
 * ```tsx
 * <ComboboxList>
 *   {isLoading ? (
 *     <ComboboxLoading>Loading options...</ComboboxLoading>
 *   ) : (
 *     items.map(...)
 *   )}
 * </ComboboxList>
 * ```
 */
export function ComboboxLoading(props: ComboboxLoadingProps) {
	return <CommandLoading data-slot="combobox-loading" {...props} />;
}

export type ComboboxGroupProps = React.ComponentPropsWithoutRef<typeof CommandGroup>;

/**
 * Groups related combobox items.
 *
 * @example
 * ```tsx
 * <ComboboxGroup heading="Frameworks">
 *   <ComboboxItem value="react">React</ComboboxItem>
 *   <ComboboxItem value="vue">Vue</ComboboxItem>
 * </ComboboxGroup>
 * ```
 */
export function ComboboxGroup({ children, ...props }: ComboboxGroupProps) {
	return (
		<CommandGroup data-slot="combobox-group" {...props}>
			{children}
		</CommandGroup>
	);
}

export type ComboboxItemProps = CommandItemProps & {
	isSelected?: boolean;
};

/**
 * Selectable item in the combobox list.
 *
 * Use `isSelected` to show a checkmark for the current value. Pass `prefix={null}`
 * to hide the default check icon.
 *
 * @example
 * ```tsx
 * <ComboboxItem
 *   value="react"
 *   onSelect={() => setValue('react')}
 *   isSelected={value === 'react'}
 * >
 *   React
 * </ComboboxItem>
 * ```
 */
export function ComboboxItem({ prefix, isSelected = false, ...props }: ComboboxItemProps) {
	const resolvedPrefix: React.ReactNode =
		prefix === undefined ? (
			<span className={styles['combobox__item-check']} data-selected={isSelected}>
				<Check />
			</span>
		) : (
			prefix
		);
	return <CommandItem data-slot="combobox-item" {...props} prefix={resolvedPrefix} />;
}

export type ComboboxSeparatorProps = React.ComponentPropsWithoutRef<typeof CommandSeparator>;

/**
 * Visual divider between groups inside the combobox list.
 *
 * @example
 * ```tsx
 * <ComboboxList>
 *   <ComboboxGroup heading="Frameworks">
 *     <ComboboxItem value="react">React</ComboboxItem>
 *   </ComboboxGroup>
 *   <ComboboxSeparator />
 *   <ComboboxGroup heading="Languages">
 *     <ComboboxItem value="ts">TypeScript</ComboboxItem>
 *   </ComboboxGroup>
 * </ComboboxList>
 * ```
 */
export function ComboboxSeparator(props: ComboboxSeparatorProps) {
	return <CommandSeparator data-slot="combobox-separator" {...props} />;
}
