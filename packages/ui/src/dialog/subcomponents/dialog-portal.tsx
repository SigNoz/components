import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { createContext, type ReactNode, useContext, useRef } from 'react';
import type { DialogProps } from '../types.js';

type Container = Exclude<DialogProps['container'], undefined>;

// `document.body`, read when the portal mounts so that a server render never touches `document`.
const BODY_CONTAINER: Container = {
	get current() {
		return typeof document === 'undefined' ? null : document.body;
	},
};

const DialogPortalNodeContext = createContext<Container>(BODY_CONTAINER);

/**
 * Where a dialog renders: `container`, else the portal node of the dialog it is nested in, else
 * `document.body`.
 *
 * With no container, Base UI portals into the nearest portal node above, whatever popup made it.
 * A `Dialog` declared in a Popover inside another dialog's panel would land in that panel, where
 * its `position: fixed` backdrop is sized to the panel, because the panel has a `will-change`. A
 * dialog nested in another one is portalled next to it instead, in the same `container`. Base UI
 * also needs the child's portal node inside the parent's, to keep it out of the `aria-hidden` and
 * `inert` it puts on everything else.
 *
 * @access private
 */
export function DialogPortal({
	container,
	children,
}: {
	container: DialogProps['container'];
	children: ReactNode;
}): ReactNode {
	const parentPortalNode = useContext(DialogPortalNodeContext);
	const portalNode = useRef<HTMLDivElement | null>(null);

	return (
		<DialogPortalNodeContext.Provider value={portalNode}>
			<DialogPrimitive.Portal
				ref={portalNode}
				container={container === undefined ? parentPortalNode : container}
			>
				{children}
			</DialogPrimitive.Portal>
		</DialogPortalNodeContext.Provider>
	);
}
