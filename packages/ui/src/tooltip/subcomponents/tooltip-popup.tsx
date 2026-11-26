import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip';
import * as React from 'react';
import { cn } from '../../lib/utils.js';
import { useTooltipContentId } from '../tooltip-content-id-context.js';
import { TooltipToneProvider, useTooltipTones } from '../tooltip-tone-context.js';
import styles from '../tooltip.module.scss';

/**
 * @access private
 */
export type TooltipPopupProps = Omit<
	React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Popup>,
	'className'
> & {
	className?: string;
	testId?: string;
};

/**
 * @access private
 */
export const TooltipPopup = React.forwardRef<HTMLDivElement, TooltipPopupProps>(
	function TooltipPopup({ className, id, testId, children, ...props }, ref) {
		const contentId = useTooltipContentId();
		const [tones, setTones] = useTooltipTones();

		return (
			<TooltipPrimitive.Popup
				ref={ref}
				// Base UI leaves the popup roleless; screen readers need the role to
				// read it out as the description of the trigger.
				role="tooltip"
				id={id ?? contentId}
				className={cn(styles['tooltip__content'], className)}
				data-testid={testId}
				{...props}
				// After the spread: a `data-*` from the call site may not take the slot the
				// component is found by, nor the tone its content asked for.
				data-slot="tooltip-content"
				data-tone={tones[0]}
			>
				<TooltipToneProvider setTones={setTones}>{children}</TooltipToneProvider>
			</TooltipPrimitive.Popup>
		);
	},
);
