import type { ReactNode } from 'react';
import { useOpenerLayerZIndex } from '../../lib/layer-z-index.js';

/**
 * The one stacking layer of a dialog, shared by `Dialog`, `AlertDialog` and `Drawer`. The backdrop
 * and the viewport sit inside it and share its z-index.
 *
 * `className` carries the layer's own z-index, and `zIndex` is the same value as a CSS expression,
 * the floor the layer never goes under when it stacks above another one.
 *
 * Mounts on open and reads the layer the focus is in at that moment, to stack above it: the
 * drawer a dialog opens from, the dialog a drawer opens from, or the parent dialog of a nested one.
 * Base UI moves the focus into the panel only after this first render. With the focus on `body`,
 * it reads the highest open modal instead.
 *
 * @access private
 */
export function DialogLayer({
	children,
	className,
	slot,
	zIndex,
}: {
	children: ReactNode;
	className: string;
	slot: string;
	zIndex: string;
}): ReactNode {
	const layerStyle = useOpenerLayerZIndex(zIndex);

	return (
		<div data-slot={slot} className={className} style={layerStyle}>
			{children}
		</div>
	);
}
