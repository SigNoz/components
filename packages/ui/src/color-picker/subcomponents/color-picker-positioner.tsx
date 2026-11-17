import { Popover as PopoverPrimitive } from '@base-ui/react/popover';
import type { ReactNode } from 'react';
import { useLayerZIndex } from '../../lib/layer-z-index.js';
import styles from '../color-picker.module.scss';
import { COLOR_PICKER_SIDE_OFFSET } from '../constants.js';
import type { ColorPickerAlignType, ColorPickerSideType } from '../types.js';

/**
 * @access private
 */
export type ColorPickerPositionerProps = {
	trigger: Element | null;
	side: ColorPickerSideType;
	align: ColorPickerAlignType;
	children: ReactNode;
};

/**
 * Places the popup against the trigger, stacked above the layer the trigger sits in. Mounts on
 * open, so the layer is read once per open.
 *
 * @access private
 */
export function ColorPickerPositioner({
	trigger,
	side,
	align,
	children,
}: ColorPickerPositionerProps): ReactNode {
	const layerStyle = useLayerZIndex(trigger, 'var(--color-picker-z-index, 50)');

	return (
		<PopoverPrimitive.Positioner
			side={side}
			align={align}
			sideOffset={COLOR_PICKER_SIDE_OFFSET}
			data-slot="color-picker-positioner"
			className={styles['color-picker__positioner']}
			style={layerStyle}
		>
			{children}
		</PopoverPrimitive.Positioner>
	);
}
