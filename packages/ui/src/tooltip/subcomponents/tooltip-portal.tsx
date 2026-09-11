import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip';
import type * as React from 'react';
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

	return (
		<TooltipPrimitive.Portal
			container={container === undefined ? config.container : container}
			{...props}
		/>
	);
}
