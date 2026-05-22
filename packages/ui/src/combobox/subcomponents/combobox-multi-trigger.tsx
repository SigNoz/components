import * as React from 'react';
import { cn } from '../../lib/utils.js';
import styles from '../combobox.module.scss';

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
