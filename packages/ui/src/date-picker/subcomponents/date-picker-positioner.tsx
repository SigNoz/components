import { Popover as BasePopover } from '@base-ui/react/popover';
import type { ReactNode } from 'react';
import { useLayerZIndex } from '../../lib/layer-z-index.js';
import { DATE_PICKER_SIDE_OFFSET } from '../constants.js';
import styles from '../date-picker.module.scss';

/**
 * Places the popup under the trigger, stacked above the layer the trigger sits in.
 *
 * Mounts on open, so the layer around the trigger is read once per open.
 *
 * @access private
 */
export function DatePickerPositioner({
	trigger,
	children,
}: {
	trigger: Element | null;
	children: ReactNode;
}): ReactNode {
	const layerStyle = useLayerZIndex(trigger, 'var(--date-picker-z-index, 50)');

	return (
		<BasePopover.Positioner
			side="bottom"
			align="start"
			sideOffset={DATE_PICKER_SIDE_OFFSET}
			data-slot="date-picker-positioner"
			className={styles['date-picker__positioner']}
			style={layerStyle}
		>
			{children}
		</BasePopover.Positioner>
	);
}
