import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Check, ChevronDown, X } from '@signozhq/icons';
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
	'value' | 'id' | 'className'
> & {
	/**
	 * The id of the combobox trigger.
	 */
	id?: string;
	/**
	 * The class name of the combobox trigger.
	 */
	className?: string;
	/**
	 * The testId associated with the combobox trigger.
	 */
	testId?: string;
	placeholder?: React.ReactNode;
	value?: React.ReactNode;
	/**
	 * When true, renders child element as trigger instead of default button.
	 * Use when trigger needs to contain interactive elements like pill remove buttons.
	 */
	asChild?: boolean;
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
>(({ className, placeholder, value, testId, id, asChild, children, ...props }, ref) => {
	if (asChild) {
		return (
			<PopoverPrimitive.Trigger ref={ref} asChild {...props}>
				{children}
			</PopoverPrimitive.Trigger>
		);
	}
	return (
		<PopoverPrimitive.Trigger
			ref={ref}
			className={cn(styles['combobox__trigger'], className)}
			data-testid={testId}
			id={id}
			{...props}
		>
			<span className={styles['combobox__trigger-value']}>
				{value || placeholder || 'Select an option...'}
			</span>
			<ChevronDown className={styles['combobox__trigger-icon']} />
		</PopoverPrimitive.Trigger>
	);
});

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

export type ComboboxPillProps = {
	/** The value represented by this pill. */
	value: string;
	/** Callback fired when the remove button is clicked. */
	onRemove: (value: string) => void;
	/** Content to render inside the pill. */
	children: React.ReactNode;
	/** Additional CSS class names. */
	className?: string;
};

/**
 * Removable pill/tag for multi-select combobox.
 *
 * @example
 * ```tsx
 * <ComboboxPill value="react" onRemove={handleRemove}>
 *   React
 * </ComboboxPill>
 * ```
 */
export function ComboboxPill({ value, onRemove, children, className }: ComboboxPillProps) {
	return (
		<span className={cn(styles.combobox__pill, className)} data-slot="combobox-pill">
			<span className={styles['combobox__pill-text']}>{children}</span>
			<button
				type="button"
				className={styles['combobox__pill-remove']}
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					onRemove(value);
				}}
				aria-label={`Remove ${value}`}
			>
				<X />
			</button>
		</span>
	);
}

export type ComboboxMultiTriggerProps = {
	/** Additional CSS class names. */
	className?: string;
	/** Inline styles for the element. */
	style?: React.CSSProperties;
	/** Unique identifier for the element. */
	id?: string;
	/** Test identifier for testing libraries. */
	testId?: string;
	/** Placeholder text when no values are selected. */
	placeholder?: string;
	/** Current input value. */
	inputValue: string;
	/** Callback fired when input value changes. */
	onInputChange: (value: string) => void;
	/** Callback fired when Enter is pressed. */
	onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
	/** Callback fired when input receives focus. */
	onFocus?: () => void;
	/** Whether the trigger is disabled. */
	disabled?: boolean;
	/** Content to render before the input (typically pills). */
	children?: React.ReactNode;
};

/**
 * Multi-select trigger with inline input and pills.
 *
 * @example
 * ```tsx
 * <ComboboxMultiTrigger
 *   placeholder="Select or create..."
 *   inputValue={inputValue}
 *   onInputChange={setInputValue}
 *   onKeyDown={handleKeyDown}
 *   onFocus={() => setOpen(true)}
 * >
 *   {selectedValues.map((v) => (
 *     <ComboboxPill key={v} value={v} onRemove={handleRemove}>
 *       {v}
 *     </ComboboxPill>
 *   ))}
 * </ComboboxMultiTrigger>
 * ```
 */
export const ComboboxMultiTrigger = React.forwardRef<HTMLDivElement, ComboboxMultiTriggerProps>(
	(
		{
			className,
			style,
			id,
			testId,
			placeholder,
			inputValue,
			onInputChange,
			onKeyDown,
			onFocus,
			disabled,
			children,
		},
		ref
	) => {
		const inputRef = React.useRef<HTMLInputElement>(null);

		const handleContainerClick = () => {
			if (!disabled) {
				inputRef.current?.focus();
			}
		};

		return (
			<div
				ref={ref}
				id={id}
				className={cn(styles['combobox__multi-trigger'], className)}
				style={style}
				data-slot="combobox-multi-trigger"
				data-testid={testId}
				data-disabled={disabled}
				onClick={handleContainerClick}
			>
				{children}
				<input
					ref={inputRef}
					type="text"
					className={styles['combobox__multi-input']}
					placeholder={React.Children.count(children) === 0 ? placeholder : undefined}
					value={inputValue}
					onChange={(e) => onInputChange(e.target.value)}
					onKeyDown={onKeyDown}
					onFocus={onFocus}
					disabled={disabled}
				/>
			</div>
		);
	}
);
ComboboxMultiTrigger.displayName = 'ComboboxMultiTrigger';

export type ComboboxCreateItemProps = Omit<CommandItemProps, 'children'> & {
	/** The input value to create. */
	inputValue: string;
	/** Custom render function for the create option. */
	children?: React.ReactNode;
};

/**
 * Option to create a new item from the current input value.
 *
 * @example
 * ```tsx
 * <ComboboxCreateItem inputValue={inputValue} onSelect={handleCreate}>
 *   Create "{inputValue}"
 * </ComboboxCreateItem>
 * ```
 */
export function ComboboxCreateItem({
	inputValue,
	children,
	className,
	...props
}: ComboboxCreateItemProps) {
	return (
		<CommandItem
			data-slot="combobox-create-item"
			className={cn(styles['combobox__create-item'], className)}
			{...props}
		>
			{children ?? `Create "${inputValue}"`}
		</CommandItem>
	);
}
