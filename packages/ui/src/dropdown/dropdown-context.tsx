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
	 * Closes the whole menu, submenus included.
	 *
	 * @note Every row renders with `closeOnClick={false}`, so the action and link rows call this
	 * themselves, once the row is known to be pickable.
	 */
	close: () => void;
	/**
	 * The state an uncontrolled checkbox or radio group picked, by row key.
	 *
	 * @note Held here rather than in the Base UI part, which unmounts with the popup on close and
	 * with the row when the search hides it. A row that keeps its own state keeps it across both.
	 */
	rememberedSelections: Readonly<Record<string, boolean | string>>;
	rememberSelection: (rowKey: string, selection: boolean | string) => void;
	/**
	 * Where every popup is portalled to, the submenus included.
	 */
	container: Menu.Portal.Props['container'];
	/**
	 * The consumer's `style`, plus the size custom properties `contentMaxWidth` and
	 * `contentMaxHeight` wrote.
	 *
	 * A submenu is portalled to the same container rather than nested inside the menu's popup, so
	 * nothing cascades into it. It is handed the same declarations instead.
	 */
	popupStyle: CSSProperties | undefined;
	/**
	 * The consumer's `className`, for the same reason: a rule written for the menu has to reach
	 * the submenu popups too, and no selector spans two portals.
	 */
	popupClassName: string | undefined;
};

const NOT_IN_A_DROPDOWN: DropdownContextValue = {
	testId: undefined,
	close: (): void => {},
	rememberedSelections: {},
	rememberSelection: (): void => {},
	container: undefined,
	popupStyle: undefined,
	popupClassName: undefined,
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

const DropdownScopeContext = createContext('');

/**
 * Opens a level of the tree for the rows inside it: a group, a radio group or a submenu.
 *
 * @access private
 */
export function DropdownScope({
	value,
	children,
}: {
	value: string;
	children: ReactNode;
}): ReactNode {
	const rowKey = useDropdownRowKey(value);

	return <DropdownScopeContext.Provider value={rowKey}>{children}</DropdownScopeContext.Provider>;
}

/**
 * A row's identity across the whole menu: its `value` and the `value` of every level above it.
 *
 * `value` alone is only unique among siblings, so two rows at different levels may share one.
 *
 * @access private
 */
export function useDropdownRowKey(value: string): string {
	const scope = useContext(DropdownScopeContext);

	return `${scope}\u001f${value}`;
}
