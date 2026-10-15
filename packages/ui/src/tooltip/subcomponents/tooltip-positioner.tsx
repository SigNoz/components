import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip';
import * as React from 'react';
import { useLayerZIndex } from '../../lib/layer-z-index.js';
import { cn } from '../../lib/utils.js';
import { useTooltipLayerTrigger } from '../tooltip-layer.js';
import styles from '../tooltip.module.scss';

const SIDE_OFFSET = 4;

/**
 * @access private
 */
export type TooltipPositionerProps = Omit<
	React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Positioner>,
	'className'
> & {
	className?: string;
};

/**
 * @access private
 */
export const TooltipPositioner = React.forwardRef<HTMLDivElement, TooltipPositionerProps>(
	function TooltipPositioner(
		{ className, sideOffset = SIDE_OFFSET, anchor, children, ...props },
		ref,
	) {
		const trigger = useTooltipLayerTrigger();
		// The anchor is where the popup appears, so its layer is the one to clear. A tooltip a
		// handle shows is anchored away from the trigger it was declared on.
		const layerStyle = useLayerZIndex(anchor ?? trigger, 'var(--tooltip-z-index, 50)');

		return (
			<TooltipPrimitive.Positioner
				ref={ref}
				data-slot="tooltip-positioner"
				className={cn(styles['tooltip__positioner'], className)}
				style={layerStyle}
				anchor={anchor}
				sideOffset={sideOffset}
				{...props}
			>
				{children}
			</TooltipPrimitive.Positioner>
		);
	},
);
