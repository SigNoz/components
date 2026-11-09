import type * as React from 'react';
import { TooltipLayerProvider } from '../tooltip-layer.js';
import { TooltipContent, type TooltipContentProps } from './tooltip-content.js';
import { TooltipRoot } from './tooltip-root.js';

/**
 * @access private
 */
export type TooltipLazyPopupProps = {
	anchor: HTMLElement;
	open: boolean;
	contentProps: Omit<TooltipContentProps, 'children'>;
	children: React.ReactNode;
	onPopupEnter: () => void;
	onPopupLeave: () => void;
	onDismiss: () => void;
	onClosed: () => void;
};

/**
 * The popup of `TooltipLazyAnchor`, mounted only while it is open or closing. It holds no state:
 * the anchor decides when it opens, and hears when the pointer is over it and when it was
 * dismissed or finished closing.
 *
 * @access private
 */
export function TooltipLazyPopup({
	anchor,
	open,
	contentProps,
	children,
	onPopupEnter,
	onPopupLeave,
	onDismiss,
	onClosed,
}: TooltipLazyPopupProps): React.ReactNode {
	return (
		<TooltipLayerProvider value={anchor}>
			<TooltipRoot
				open={open}
				onOpenChange={(next, details) => {
					// Leaving the popup is a hover, which this component times itself.
					if (!next && details.reason !== 'trigger-hover') {
						onDismiss();
					}
				}}
				onOpenChangeComplete={(next) => {
					if (!next) {
						onClosed();
					}
				}}
			>
				<TooltipContent
					{...contentProps}
					anchor={anchor}
					onMouseEnter={(event) => {
						contentProps.onMouseEnter?.(event);
						onPopupEnter();
					}}
					onMouseLeave={(event) => {
						contentProps.onMouseLeave?.(event);
						onPopupLeave();
					}}
				>
					{children}
				</TooltipContent>
			</TooltipRoot>
		</TooltipLayerProvider>
	);
}
