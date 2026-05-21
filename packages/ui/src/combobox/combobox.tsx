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
			data-slot="combobox-trigger"
			data-testid={testId}
			id={id}
			{...props}
		>
			<span data-slot="combobox-value" className={styles['combobox__trigger-value']}>
				{value || placeholder || 'Select an option...'}
			</span>
			<ChevronDown data-slot="combobox-icon" className={styles['combobox__trigger-icon']} />
		</PopoverPrimitive.Trigger>
	);
});
ComboboxTrigger.displayName = 'ComboboxTrigger';

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
ComboboxContent.displayName = 'ComboboxContent';

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
export const ComboboxCommand = React.forwardRef<
	React.ElementRef<typeof Command>,
	ComboboxCommandProps
>((props, ref) => <Command ref={ref} data-slot="combobox-command" {...props} />);
ComboboxCommand.displayName = 'ComboboxCommand';

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
export const ComboboxInput = React.forwardRef<HTMLInputElement, ComboboxInputProps>(
	(props, ref) => <CommandInput ref={ref} data-slot="combobox-input" {...props} />
);
ComboboxInput.displayName = 'ComboboxInput';

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
export const ComboboxList = React.forwardRef<
	React.ElementRef<typeof CommandList>,
	ComboboxListProps
>((props, ref) => <CommandList ref={ref} data-slot="combobox-list" {...props} />);
ComboboxList.displayName = 'ComboboxList';

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
export const ComboboxEmpty = React.forwardRef<
	React.ElementRef<typeof CommandEmpty>,
	ComboboxEmptyProps
>((props, ref) => <CommandEmpty ref={ref} data-slot="combobox-empty" {...props} />);
ComboboxEmpty.displayName = 'ComboboxEmpty';

export type ComboboxLoadingProps = Omit<
	React.ComponentPropsWithoutRef<'div'>,
	'id' | 'className'
> & {
	/**
	 * Additional CSS classes to apply to the loading container.
	 */
	className?: string;
	/**
	 * Inline styles for the loading container.
	 */
	style?: React.CSSProperties;
	/**
	 * Unique identifier for the element.
	 */
	id?: string;
	/**
	 * Test identifier for testing libraries.
	 */
	testId?: string;
	/**
	 * The loading content to display.
	 * @default "Loading..."
	 */
	children?: React.ReactNode;
};

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
export const ComboboxLoading = React.forwardRef<
	React.ElementRef<typeof CommandLoading>,
	ComboboxLoadingProps
>((props, ref) => <CommandLoading ref={ref} data-slot="combobox-loading" {...props} />);
ComboboxLoading.displayName = 'ComboboxLoading';

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
export const ComboboxGroup = React.forwardRef<
	React.ElementRef<typeof CommandGroup>,
	ComboboxGroupProps
>(({ children, ...props }, ref) => (
	<CommandGroup ref={ref} data-slot="combobox-group" {...props}>
		{children}
	</CommandGroup>
));
ComboboxGroup.displayName = 'ComboboxGroup';

export type ComboboxItemProps = CommandItemProps & {
	isSelected?: boolean;
	/**
	 * When true, inserts value into input instead of selecting it.
	 * Useful for hints/suggestions that provide a prefix for user to continue typing.
	 * @default false
	 */
	insertOnInput?: boolean;
	/**
	 * Callback when item is used to insert into input. Called with the value to insert.
	 * Only used when insertOnInput is true.
	 */
	onInsert?: (value: string) => void;
};

/**
 * Selectable item in the combobox list.
 *
 * Use `isSelected` to show a checkmark for the current value. Pass `prefix={null}`
 * to hide the default check icon.
 *
 * Set `insertOnInput` to insert value into the input field instead of selecting it.
 * This is useful for hint items that provide a prefix for the user to continue typing.
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
 *
 * @example Hint item that inserts into input
 * ```tsx
 * <ComboboxItem
 *   value="status:"
 *   insertOnInput
 *   onInsert={(value) => setInputValue(value)}
 *   prefix={<HintIcon />}
 * >
 *   Filter by status...
 * </ComboboxItem>
 * ```
 */
export const ComboboxItem = React.forwardRef<
	React.ElementRef<typeof CommandItem>,
	ComboboxItemProps
>(
	(
		{ prefix, isSelected = false, insertOnInput = false, onInsert, onSelect, value, ...props },
		ref
	) => {
		const resolvedPrefix: React.ReactNode =
			prefix === undefined ? (
				<span
					data-slot="combobox-item-indicator"
					className={styles['combobox__item-check']}
					data-selected={isSelected}
				>
					<Check />
				</span>
			) : (
				prefix
			);

		const handleSelect = (currentValue: string) => {
			if (insertOnInput && onInsert) {
				onInsert(value ?? currentValue);
			} else if (onSelect) {
				onSelect(currentValue);
			}
		};

		return (
			<CommandItem
				ref={ref}
				data-slot="combobox-item"
				data-insert-on-input={insertOnInput}
				value={value}
				onSelect={handleSelect}
				{...props}
				prefix={resolvedPrefix}
			/>
		);
	}
);
ComboboxItem.displayName = 'ComboboxItem';

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
export const ComboboxSeparator = React.forwardRef<
	React.ElementRef<typeof CommandSeparator>,
	ComboboxSeparatorProps
>((props, ref) => <CommandSeparator ref={ref} data-slot="combobox-separator" {...props} />);
ComboboxSeparator.displayName = 'ComboboxSeparator';

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
export const ComboboxPill = React.forwardRef<HTMLSpanElement, ComboboxPillProps>(
	({ value, onRemove, children, className }, ref) => {
		return (
			<span ref={ref} className={cn(styles.combobox__pill, className)} data-slot="combobox-pill">
				<span data-slot="combobox-pill-text" className={styles['combobox__pill-text']}>
					{children}
				</span>
				<button
					type="button"
					data-slot="combobox-pill-remove"
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
);
ComboboxPill.displayName = 'ComboboxPill';

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
					data-slot="combobox-multi-input"
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
export const ComboboxCreateItem = React.forwardRef<
	React.ElementRef<typeof CommandItem>,
	ComboboxCreateItemProps
>(({ inputValue, children, className, ...props }, ref) => (
	<CommandItem
		ref={ref}
		data-slot="combobox-create-item"
		className={cn(styles['combobox__create-item'], className)}
		{...props}
	>
		{children ?? `Create "${inputValue}"`}
	</CommandItem>
));
ComboboxCreateItem.displayName = 'ComboboxCreateItem';

export type ComboboxHintProps = Omit<CommandItemProps, 'onSelect'> & {
	/** The value to insert into the input when this hint is selected. */
	insertValue: string;
	/** Callback when hint is selected. Called with the insertValue. */
	onInsert: (value: string) => void;
	/** Custom content for the hint. */
	children: React.ReactNode;
};

/**
 * Hint item that inserts a value into the input instead of selecting it.
 * Useful for providing suggestions that serve as prefixes for continued typing.
 *
 * @example
 * ```tsx
 * <ComboboxHint
 *   insertValue="status:"
 *   onInsert={(value) => setInputValue(value)}
 * >
 *   Filter by status...
 * </ComboboxHint>
 * ```
 */
export const ComboboxHint = React.forwardRef<
	React.ElementRef<typeof CommandItem>,
	ComboboxHintProps
>(({ insertValue, onInsert, children, className, prefix = null, ...props }, ref) => (
	<CommandItem
		ref={ref}
		data-slot="combobox-hint"
		className={cn(styles['combobox__hint-item'], className)}
		onSelect={() => onInsert(insertValue)}
		prefix={prefix}
		{...props}
	>
		{children}
	</CommandItem>
));
ComboboxHint.displayName = 'ComboboxHint';
