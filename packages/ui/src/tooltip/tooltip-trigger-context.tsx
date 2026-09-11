import { createContext, type ReactNode, useContext } from 'react';

const TooltipTriggerContext = createContext(false);

/**
 * Marks everything below it as living inside a tooltip trigger. Sits around the
 * trigger rather than inside it: the trigger hands its single child to Base UI as
 * `render`, so a provider element there would become the rendered element and
 * swallow the props meant for the trigger.
 *
 * @access private
 */
export function TooltipTriggerProvider({ children }: { children: ReactNode }): ReactNode {
	return <TooltipTriggerContext.Provider value={true}>{children}</TooltipTriggerContext.Provider>;
}

/**
 * True when the caller is rendered inside a `TooltipTrigger`.
 *
 * @access private
 */
export function useIsInsideTooltipTrigger(): boolean {
	return useContext(TooltipTriggerContext);
}
