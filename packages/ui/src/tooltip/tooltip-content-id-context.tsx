import { createContext, type ReactNode, useContext, useId } from 'react';

const TooltipContentIdContext = createContext<string | undefined>(undefined);

/**
 * Hands the trigger and the content of one tooltip a shared id. Base UI leaves
 * the two unrelated, so without it the trigger has nothing to point
 * `aria-describedby` at and the tooltip goes unannounced.
 *
 * @access private
 */
export function TooltipContentIdProvider({ children }: { children: ReactNode }): ReactNode {
	const id = useId();

	return <TooltipContentIdContext.Provider value={id}>{children}</TooltipContentIdContext.Provider>;
}

/**
 * @access private
 */
export function useTooltipContentId(): string | undefined {
	return useContext(TooltipContentIdContext);
}
