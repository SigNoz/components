import * as React from 'react';

/**
 * Configuration that Radix accepted on `Tooltip.Provider`/`Tooltip.Root` but
 * Base UI expects on other parts: the hover delay belongs to the trigger, and
 * hoverable-content is a root prop. Passing it down through context keeps our
 * public API on the components callers already use.
 */
export interface TooltipSettings {
	/** Hover delay in milliseconds, inherited from `TooltipProvider` or `TooltipRoot`. */
	delayDuration?: number;
	/** Whether hovering the tooltip content closes it. */
	disableHoverableContent?: boolean;
}

const TooltipSettingsContext = React.createContext<TooltipSettings>({});

export function TooltipSettingsProvider({
	value,
	children,
}: {
	value: TooltipSettings;
	children?: React.ReactNode;
}) {
	return (
		<TooltipSettingsContext.Provider value={value}>{children}</TooltipSettingsContext.Provider>
	);
}

export function useTooltipSettings(): TooltipSettings {
	return React.useContext(TooltipSettingsContext);
}
