import type { TooltipTriggerProps } from './subcomponents/tooltip-trigger.js';
import { useIsInsideTooltipTrigger } from './tooltip-trigger-context.js';
import type { TooltipProps } from './types.js';

// `handle` is consumed by the preset itself: it drives visibility, and never reaches the
// trigger, whose own `handle` is Base UI's trigger-to-root link.
type TooltipOwnProps = Omit<TooltipProps, 'title' | 'children' | 'handle'>;

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
