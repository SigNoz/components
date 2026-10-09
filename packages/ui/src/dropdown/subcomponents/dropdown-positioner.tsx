import { Menu } from '@base-ui/react/menu';
import type { ReactNode } from 'react';
import { useLayerZIndex } from '../../lib/layer-z-index.js';
import { DROPDOWN_SIDE_OFFSET } from '../constants.js';
import styles from '../dropdown.module.scss';

/**
 * Places the menu or a submenu against its trigger, stacked above the layer that trigger sits in.
 *
 * Mounts on open, so the layer is read once per open. A submenu's trigger is a row of the menu,
 * which puts the submenu above the menu.
 *
 * @access private
 */
export function DropdownPositioner({
	trigger,
	side,
	align,
	children,
}: {
	trigger: Element | null;
	side: Menu.Positioner.Props['side'];
	align: Menu.Positioner.Props['align'];
	children: ReactNode;
}): ReactNode {
	const layerStyle = useLayerZIndex(trigger, 'var(--dropdown-z-index, 50)');

	return (
		<Menu.Positioner
			side={side}
			align={align}
			sideOffset={DROPDOWN_SIDE_OFFSET}
			data-slot="dropdown-positioner"
			className={styles['dropdown__positioner']}
			style={layerStyle}
		>
			{children}
		</Menu.Positioner>
	);
}
