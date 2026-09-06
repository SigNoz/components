import * as React from 'react';
import {
	useRegisterTooltipContent,
	useTooltipContentStackEntries,
} from '../tooltip-content-stack-context.js';
import { TooltipPopup, type TooltipPopupProps } from './tooltip-popup.js';
import { TooltipPortal, type TooltipPortalProps } from './tooltip-portal.js';
import { TooltipPositioner, type TooltipPositionerProps } from './tooltip-positioner.js';
import { TooltipStack } from './tooltip-stack.js';

/**
 * @access private
 */
export type TooltipContentProps = TooltipPopupProps & {
	container?: TooltipPortalProps['container'];
} & Pick<TooltipPositionerProps, 'side' | 'align' | 'sideOffset' | 'alignOffset'>;

/**
 * @access private
 */
export const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
	function TooltipContent(
		{ side, align, sideOffset, alignOffset, container, children, ...popupProps },
		ref,
	) {
		const entries = useTooltipContentStackEntries();
		const stacked = useRegisterTooltipContent(children);

		if (stacked) {
			return null;
		}

		return (
			<TooltipPortal container={container}>
				<TooltipPositioner
					side={side}
					align={align}
					sideOffset={sideOffset}
					alignOffset={alignOffset}
				>
					<TooltipPopup ref={ref} {...popupProps}>
						<TooltipStack items={[{ id: 'content', content: children }, ...entries]} />
					</TooltipPopup>
				</TooltipPositioner>
			</TooltipPortal>
		);
	},
);
