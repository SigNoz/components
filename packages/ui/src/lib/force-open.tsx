import { createContext, type ReactElement, type ReactNode, useContext } from 'react';

const ForceOpenContext = createContext(false);

export type ForceOpenProviderProps = {
	/**
	 * The components whose popups are held open.
	 */
	children: ReactNode;
};

/**
 * Holds open the popup of every `Select`, `Combobox`, `DatePicker`, `Dropdown`, `Popover` and
 * `Tooltip` under it, and the `...` list of a `Breadcrumb` while a crumb is collapsed, for a story
 * or a test that needs popups on screen. While held, no click, key or selection closes one.
 *
 * Several popups stay open side by side. Opened by hand, the last one would take the focus and
 * close the others.
 *
 * A disabled or read-only field stays closed, the same as outside the provider.
 *
 * @note For stories and tests, not for app code: the components own their open state.
 */
export function ForceOpenProvider({ children }: ForceOpenProviderProps): ReactElement {
	return <ForceOpenContext.Provider value={true}>{children}</ForceOpenContext.Provider>;
}

/**
 * Gives the popups under it their own open state back inside a `ForceOpenProvider`, for a
 * component that holds its popup open itself, on a part only it knows: the `...` list of a
 * `Breadcrumb`, which shares its popup with the cards of the crumbs, and the time zone `Combobox`
 * inside the popup of a `DatePicker`.
 *
 * @access private
 */
export function ForceOpenReset({ children }: ForceOpenProviderProps): ReactElement {
	return <ForceOpenContext.Provider value={false}>{children}</ForceOpenContext.Provider>;
}

/**
 * Whether a `ForceOpenProvider` holds the popup of the calling component open.
 *
 * @access private
 */
export function useForceOpen(): boolean {
	return useContext(ForceOpenContext);
}
