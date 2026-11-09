import { createContext, type ReactNode, useContext } from 'react';
import type { BreadcrumbEllipsisOptions } from '../breadcrumb/types.js';
import type {
	DrawerClosePositionType,
	DrawerCloseReasonType,
	DrawerCrumbType,
	DrawerStackType,
	DrawerTrailSelectReasonType,
	DrawerTypeType,
} from './types.js';

/**
 * One crumb of a breadcrumb trail: what it shows, how to close the drawer that renders it and read
 * whether it is still open, and, for an earlier step of a drawer's own `trail`, how to show that
 * step again. The steps of one drawer share its `close`, which tells the drawers of a trail apart.
 *
 * @access private
 */
export type DrawerTrailEntry = Omit<DrawerCrumbType, 'title'> & {
	title: ReactNode;
	close: (reason: DrawerCloseReasonType) => void;
	/**
	 * Whether the drawer is open as of the last commit. An unmounted drawer is closed.
	 */
	isOpen: () => boolean;
	select?: (reason: DrawerTrailSelectReasonType) => void;
};

/**
 * What an open drawer tells the drawers opened inside it.
 *
 * @access private
 */
export type DrawerStackContextValue = {
	/**
	 * How the drawers opened inside it render, its own `stack` prop.
	 */
	stack: DrawerStackType;
	/**
	 * Its panel, which a nested drawer measures to take its width from.
	 */
	panel: HTMLElement | null;
	/**
	 * The breadcrumb trail it ends, root first. A drawer outside a breadcrumb trail is the only
	 * entry of its own.
	 */
	trail: readonly DrawerTrailEntry[];
	/**
	 * The type of the first drawer of the trail, which sets the backdrop and the focus trap of
	 * every drawer of a breadcrumb trail.
	 */
	trailType: DrawerTypeType;
	/**
	 * The `trailEllipsis` of the first drawer of the trail, which sets the `...` crumb of every
	 * drawer of a breadcrumb trail.
	 */
	trailEllipsis: BreadcrumbEllipsisOptions | undefined;
	/**
	 * The `closePosition` of the first drawer of the trail, which places the close button of every
	 * drawer of a breadcrumb trail.
	 */
	trailClosePosition: DrawerClosePositionType;
	/**
	 * Called by a nested drawer while it is open. The drawer takes no input until every cleanup it
	 * returned has run.
	 */
	cover: () => () => void;
};

const DrawerStackContext = createContext<DrawerStackContextValue | null>(null);

/**
 * Hands an open drawer's stack to the drawers declared inside it.
 *
 * @access private
 */
export function DrawerStackProvider({
	value,
	children,
}: {
	value: DrawerStackContextValue;
	children: ReactNode;
}): ReactNode {
	return <DrawerStackContext.Provider value={value}>{children}</DrawerStackContext.Provider>;
}

/**
 * Ends the stack of the drawer it is declared in, for a `Dialog` or an `AlertDialog` opened from a
 * drawer. A drawer opened from that dialog opens over it as a drawer of its own: it does not join
 * the outer drawer's trail, take its width or cover it, and its close button closes it alone.
 *
 * @access private
 */
export function DrawerStackReset({ children }: { children: ReactNode }): ReactNode {
	return <DrawerStackContext.Provider value={null}>{children}</DrawerStackContext.Provider>;
}

/**
 * The stack of the drawer this one is declared in, `null` for a drawer that is not nested.
 *
 * @access private
 */
export function useParentDrawerStack(): DrawerStackContextValue | null {
	return useContext(DrawerStackContext);
}
