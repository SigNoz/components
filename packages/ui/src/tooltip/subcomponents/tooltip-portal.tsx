import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip';
import type * as React from 'react';
import { usePopupContainer } from '../../lib/popup-container.js';
import { useTooltipConfig } from '../tooltip-config-context.js';

/**
 * @access private
 */
export type TooltipPortalProps = React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Portal>;

/**
 * @access private
 */
export function TooltipPortal({ container, ...props }: TooltipPortalProps): React.ReactNode {
	const config = useTooltipConfig();
	const popupContainer = usePopupContainer();
	// The dialog around the tooltip, if any, comes last: its container is a default, the other
	// two are asked for.
	const inherited = config.container === undefined ? popupContainer : config.container;

	return (
		<TooltipPrimitive.Portal
			container={container === undefined ? inherited : container}
			{...props}
		/>
	);
}
