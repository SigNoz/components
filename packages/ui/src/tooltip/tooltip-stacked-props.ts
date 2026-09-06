import type { TooltipTriggerProps } from './subcomponents/tooltip-trigger.js';
import { useIsInsideTooltipTrigger } from './tooltip-trigger-context.js';
import type { TooltipProps } from './types.js';

type TooltipOwnProps = Omit<TooltipProps, 'title' | 'children'>;

/**
 * @access private
 */
export function useStackedTooltipProps({
	side,
	sideOffset,
	align,
	alignOffset,
	container,
	...rest
}: TooltipOwnProps): {
	stacked: boolean;
	triggerProps: TooltipTriggerProps;
	contentProps: TooltipOwnProps;
} {
	const stacked = useIsInsideTooltipTrigger();

	return stacked
		? { stacked, triggerProps: rest, contentProps: {} }
		: {
				stacked,
				triggerProps: {},
				contentProps: { side, sideOffset, align, alignOffset, container, ...rest },
			};
}
