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
	children: ReactNode;
} & AriaAttributes & { [key: `data-${string}`]: unknown };

/**
 * The popup shell: surface, border, radius, shadow and zero padding. The content slot owns all
 * of it. Base UI makes it a `role="dialog"`. `aria-*` and `data-*` from the call site land here.
 *
 * @access private
 */
export const PopoverPopup = forwardRef<HTMLDivElement, PopoverPopupProps>(function PopoverPopup(
	{ popupId, initialFocus, finalFocus, style, testId, children, ...props },
	ref,
) {
	return (
		<PopoverPrimitive.Popup
			ref={ref}
			id={popupId}
			initialFocus={initialFocus}
			finalFocus={finalFocus}
			className={styles['popover']}
			style={style}
			data-testid={partTestId(testId, 'popup')}
			{...props}
			// After the spread: a `data-*` from the call site may not take the slot the component
			// is found by.
			data-slot="popover-popup"
		>
			{children}
		</PopoverPrimitive.Popup>
	);
});
