import { type ReactNode, useState } from 'react';
import { useLayerZIndex } from '../../lib/layer-z-index.js';
import styles from '../command.module.scss';

/**
 * The one stacking layer of the palette. The backdrop and the panel sit inside it and share its
 * z-index: `--command-z-index` moves both, and the rules an app writes for the `dialog-*` slots
 * match neither.
 *
 * Mounts on open and reads the layer the focus is in at that moment, such as a modal from another
 * library, to stack above it. Base UI moves the focus into the panel only after this first render.
 *
 * @access private
 */
export function CommandLayer({ children }: { children: ReactNode }): ReactNode {
	const [opener] = useState(() => document.activeElement);
	const layerStyle = useLayerZIndex(opener, 'var(--command-z-index, 50)');

	return (
		<div data-slot="command-layer" className={styles['command__layer']} style={layerStyle}>
			{children}
		</div>
	);
}
