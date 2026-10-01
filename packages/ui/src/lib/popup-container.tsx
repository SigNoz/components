import { createContext, type ReactNode, type RefObject, useContext, useRef } from 'react';
import styles from './popup-container.module.scss';

/**
 * @access private
 */
export type PopupContainerRef = RefObject<HTMLDivElement | null>;

const PopupContainerContext = createContext<PopupContainerRef | undefined>(undefined);

/**
 * Renders an empty element for popups to be portalled into, and hands it to every popup below.
 *
 * A modal dialog traps focus inside its panel and turns pointer events off on the body. A Base UI
 * popup portalled into the body can then be neither clicked nor reached with the keyboard: the
 * dialog pulls the focus straight back to the trigger. Portalled in here, the popup sits inside
 * the panel instead.
 *
 * @access private
 */
export function PopupContainer({ children }: { children: ReactNode }): ReactNode {
	const ref = useRef<HTMLDivElement | null>(null);

	return (
		<PopupContainerContext.Provider value={ref}>
			{/* Before the children: React sets its ref before the layout effects below run, and a
			    Base UI portal reads the ref in one. */}
			<div ref={ref} data-slot="popup-container" className={styles['popup-container']} />
			{children}
		</PopupContainerContext.Provider>
	);
}

/**
 * The element popups here are portalled into, `undefined` outside a `PopupContainer`.
 *
 * @access private
 */
export function usePopupContainer(): PopupContainerRef | undefined {
	return useContext(PopupContainerContext);
}
