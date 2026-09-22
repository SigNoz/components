import type { Menu } from '@base-ui/react/menu';
import { createContext, type CSSProperties, type ReactNode, useContext } from 'react';

/**
 * What every row needs from the menu around it, and what a submenu passes on unchanged.
 *
 * @access private
 */
export type DropdownContextValue = {
	/**
	 * The menu's own `testId`, the stem every row is named from.
	 */
	testId: string | undefined;
	/**
	 * Closes the whole menu, submenus included. The async action path is the only caller: every
	 * row renders with `closeOnClick={false}` so the handler's return value decides.
	 */
	close: () => void;
	/**
	 * The `value` of the row whose async action is in flight, or `null`.
	 */
	pendingValue: string | null;
	/**
	 * Marks a row as awaiting its handler, or clears it with `null`.
	 */
	setPendingValue: (value: string | null) => void;
	/**
	 * Where every popup is portalled to, the submenus included.
	 */
	container: Menu.Portal.Props['container'];
	/**
	 * The size custom properties `contentMaxWidth` and `contentMaxHeight` wrote.
	 *
	 * A submenu is portalled to the same container rather than nested inside the menu's popup, so
	 * nothing cascades into it. It is handed the same declarations instead.
	 */
	popupStyle: CSSProperties | undefined;
};

const NOT_IN_A_DROPDOWN: DropdownContextValue = {
	testId: undefined,
	close: (): void => {},
	pendingValue: null,
	setPendingValue: (): void => {},
	container: undefined,
	popupStyle: undefined,
};

const DropdownContext = createContext<DropdownContextValue>(NOT_IN_A_DROPDOWN);

/**
 * @access private
 */
export function DropdownProvider({
	value,
	children,
}: {
	value: DropdownContextValue;
	children: ReactNode;
}): ReactNode {
	return <DropdownContext.Provider value={value}>{children}</DropdownContext.Provider>;
}

/**
 * @access private
 */
export function useDropdownContext(): DropdownContextValue {
	return useContext(DropdownContext);
}
