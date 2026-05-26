import { X } from '@signozhq/icons';
import * as React from 'react';
import { cn } from '../../lib/utils.js';
import styles from '../combobox.module.scss';

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
