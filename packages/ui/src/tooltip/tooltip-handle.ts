import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip';
import { useState } from 'react';

/**
 * A handle that ties a `TooltipTrigger` to a `TooltipRoot` rendered next to it
 * instead of around it.
 *
 * @access private
 */
export function useTooltipHandle(): ReturnType<typeof TooltipPrimitive.createHandle> {
	const [handle] = useState(TooltipPrimitive.createHandle);

	return handle;
}
