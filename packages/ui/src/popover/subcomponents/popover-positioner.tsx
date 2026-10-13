import { Popover as PopoverPrimitive } from '@base-ui/react/popover';
import type { ReactNode } from 'react';
import { useLayerZIndex } from '../../lib/layer-z-index.js';
import { POPOVER_ALIGN_OFFSET, POPOVER_SIDE_OFFSET } from '../constants.js';
import styles from '../popover.module.scss';
import type { PopoverAnchorType, PopoverSideType } from '../types.js';

/**
 * Places the popup against its anchor, stacked above the layer the trigger sits in.
 *
 * Mounts on open, so the layer is read once per open. The offsets are fixed: good defaults, not
 * knobs.
 *
 * @access private
 */
export function PopoverPositioner({
	trigger,
	side,
	align,
	anchor,
	children,
}: {
	trigger: Element | null;
	side: PopoverSideType;
	align: NonNullable<PopoverPrimitive.Positioner.Props['align']>;
	anchor: PopoverAnchorType;
	children: ReactNode;
}): ReactNode {
	const layerStyle = useLayerZIndex(trigger, 'var(--popover-z-index, 50)');

	return (
		<PopoverPrimitive.Positioner
			side={side}
			align={align}
			sideOffset={POPOVER_SIDE_OFFSET}
			alignOffset={POPOVER_ALIGN_OFFSET}
			anchor={anchor}
			data-slot="popover-positioner"
			className={styles['popover__positioner']}
			style={layerStyle}
		>
			{children}
		</PopoverPrimitive.Positioner>
	);
}
