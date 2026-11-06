import { DismissableLayer, DismissableLayerBranch } from '@radix-ui/react-dismissable-layer';
import { FocusScope } from '@radix-ui/react-focus-scope';
import type { ReactNode } from 'react';
import { useOpenerLayerZIndex } from '../../lib/layer-z-index.js';
import styles from '../dialog.module.scss';
import { preventDefault } from '../utils.js';

/**
 * The one stacking layer of a dialog. The backdrop and the viewport sit inside it and share its
 * z-index, which `--dialog-z-index` moves.
 *
 * Mounts on open and reads the layer the focus is in at that moment, to stack above it: the
 * drawer a dialog opens from, or the parent dialog of a nested one. Base UI moves the focus into
 * the panel only after this first render. With the focus on `body`, it reads the highest open
 * modal instead.
 *
 * The Radix wrappers let a dialog open over a Radix modal, which the Drawer still is. That modal
 * turns off pointer events on `body`, takes `Esc` while it is the top Radix layer, and pulls the
 * focus back into itself. As a layer, a branch and a focus scope of their own, the dialog is the
 * top layer, its presses are not outside the drawer, and the drawer's focus trap pauses until it
 * closes. They do nothing else: `Esc`, outside presses and the focus stay with Base UI.
 *
 * @access private
 */
export function DialogLayer({ children }: { children: ReactNode }): ReactNode {
	const layerStyle = useOpenerLayerZIndex('var(--dialog-z-index, 50)');

	return (
		<DismissableLayerBranch asChild>
			<DismissableLayer asChild>
				<FocusScope asChild onMountAutoFocus={preventDefault} onUnmountAutoFocus={preventDefault}>
					<div data-slot="dialog-layer" className={styles['dialog__layer']} style={layerStyle}>
						{children}
					</div>
				</FocusScope>
			</DismissableLayer>
		</DismissableLayerBranch>
	);
}
