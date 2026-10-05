import { createContext, type ReactElement, type ReactNode, useContext } from 'react';

const PersistToastsContext = createContext(false);

export type PersistToastsProviderProps = {
	/**
	 * The tree holding the `Toaster` whose toasts are kept on screen.
	 */
	children: ReactNode;
};

/**
 * Keeps every toast of a `Toaster` under it on screen, for a story or a test that needs them
 * there. No timer closes a toast, the stack shows every toast whatever the `limit`, and it stays
 * spread, as hover spreads it, with each button exposed to assistive technology.
 *
 * The rest is the component as it ships: the toasts are raised with `toast`, and the button,
 * a swipe and `toast.dismiss` still close them.
 *
 * @note For stories and tests, not for app code: toasts are meant to close on their own.
 */
export function PersistToastsProvider({ children }: PersistToastsProviderProps): ReactElement {
	return <PersistToastsContext.Provider value={true}>{children}</PersistToastsContext.Provider>;
}

/**
 * Whether a `PersistToastsProvider` keeps the toasts of the calling `Toaster` on screen.
 *
 * @access private
 */
export function usePersistToasts(): boolean {
	return useContext(PersistToastsContext);
}
