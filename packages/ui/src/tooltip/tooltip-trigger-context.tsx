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
 * Marks everything below it as outside any tooltip trigger, so a tooltip below opens on its own
 * instead of stacking into the trigger above. For a trigger that holds controls with tooltips of
 * their own, such as the thumbs of a slider. The two must never have content at the same time,
 * or both open on the same hover.
 *
 * @access private
 */
export function TooltipTriggerBoundary({ children }: { children: ReactNode }): ReactNode {
	return <TooltipTriggerContext.Provider value={false}>{children}</TooltipTriggerContext.Provider>;
}

/**
 * True when the caller is rendered inside a `TooltipTrigger`.
 *
 * @access private
 */
export function useIsInsideTooltipTrigger(): boolean {
	return useContext(TooltipTriggerContext);
}
