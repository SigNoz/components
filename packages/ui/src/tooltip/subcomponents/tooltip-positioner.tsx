import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip';
import * as React from 'react';
import { cn } from '../../lib/utils.js';
import { getLayerZIndex, useTooltipLayerTrigger } from '../tooltip-layer.js';
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
	function TooltipPositioner({ className, sideOffset = SIDE_OFFSET, children, ...props }, ref) {
		const trigger = useTooltipLayerTrigger();
		// The positioner mounts on open, so the layer is read once per open.
		const [layer] = React.useState(() => (trigger ? getLayerZIndex(trigger) : 0));
		// `--tooltip-z-index` stays the floor. A trigger inside a drawer, a modal or a
		// floating panel lifts the popup just above that layer, and one behind it stays under.
		const layerStyle =
			layer > 0 ? { zIndex: `max(var(--tooltip-z-index, 50), ${layer + 1})` } : undefined;

		return (
			<TooltipPrimitive.Positioner
				ref={ref}
				data-slot="tooltip-positioner"
				className={cn(styles['tooltip__positioner'], className)}
				style={layerStyle}
				sideOffset={sideOffset}
				{...props}
			>
				{children}
			</TooltipPrimitive.Positioner>
		);
	},
);
