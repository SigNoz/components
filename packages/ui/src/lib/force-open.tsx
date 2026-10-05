import { createContext, type ReactElement, type ReactNode, useContext } from 'react';

const ForceOpenContext = createContext(false);

export type ForceOpenProviderProps = {
	/**
	 * The components whose popups are held open.
	 */
	children: ReactNode;
};

/**
 * Holds open the popup of every `Select`, `Combobox`, `Dropdown` and `Tooltip` under it, for a
 * story or a test that needs popups on screen. While held, no click, key or selection closes one.
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
 * Whether a `ForceOpenProvider` holds the popup of the calling component open.
 *
 * @access private
 */
export function useForceOpen(): boolean {
	return useContext(ForceOpenContext);
}
