import { Popover as PopoverPrimitive } from '@base-ui/react/popover';
import { type AriaAttributes, type CSSProperties, forwardRef, type ReactNode } from 'react';
import { partTestId } from '../../lib/utils.js';
import styles from '../popover.module.scss';
import type { PopoverProps } from '../types.js';

/**
 * @access private
 */
export type PopoverPopupProps = {
	popupId: string;
	initialFocus: PopoverProps['initialFocus'];
	finalFocus: PopoverProps['finalFocus'];
	style: CSSProperties;
	testId: string | undefined;
	/**
	 * Open for a `preview` trigger: a card about that trigger, not a dialog.
	 */
	preview: boolean;
	/**
	 * Wraps the content in the viewport that swaps it as the popup moves between triggers.
	 */
	viewport: boolean;
	/**
	 * Open for one of the handle's `Popover.Trigger`s, so the popup moves and resizes between them.
	 */
	shared: boolean;
	children: ReactNode;
} & AriaAttributes & { [key: `data-${string}`]: unknown };

/**
 * The popup shell: surface, border, radius, shadow and zero padding. The content slot owns all
 * of it. Base UI makes it a `role="dialog"`, unless a `preview` trigger opened it. `aria-*` and
 * `data-*` from the call site land here.
 *
 * @access private
 */
export const PopoverPopup = forwardRef<HTMLDivElement, PopoverPopupProps>(function PopoverPopup(
	{
		popupId,
		initialFocus,
		finalFocus,
		style,
		testId,
		preview,
		viewport,
		shared,
		children,
		'aria-label': ariaLabel,
		'aria-labelledby': ariaLabelledBy,
		...props
	},
	ref,
) {
	return (
		<PopoverPrimitive.Popup
			ref={ref}
			id={popupId}
			// A card describes its trigger and takes no focus, so the focus stays where the reader put
			// it, on the way in and out.
			initialFocus={preview ? false : initialFocus}
			finalFocus={preview ? false : finalFocus}
			className={styles['popover']}
			style={style}
			data-testid={partTestId(testId, 'popup')}
			{...props}
			// Base UI makes every popup a dialog, and a card is not one. A name needs a role to belong to.
			{...(preview
				? { role: undefined }
				: { 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy })}
			data-preview={preview || undefined}
			data-shared={shared || undefined}
			// After the spread: a `data-*` from the call site may not take the slot the component
			// is found by.
			data-slot="popover-popup"
		>
			{viewport ? (
				<PopoverPrimitive.Viewport
					data-slot="popover-viewport"
					className={styles['popover__viewport']}
				>
					{children}
				</PopoverPrimitive.Viewport>
			) : (
				children
			)}
		</PopoverPrimitive.Popup>
	);
});
