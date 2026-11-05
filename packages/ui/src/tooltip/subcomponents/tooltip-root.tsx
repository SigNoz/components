import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip';
import * as React from 'react';
import { useTooltipConfig } from '../tooltip-config-context.js';
import { TooltipContentIdProvider } from '../tooltip-content-id-context.js';
import { TooltipContentStackProviderIfMissing } from '../tooltip-content-stack-context.js';
import { useIsInsideTooltipTrigger } from '../tooltip-trigger-context.js';

/**
 * @access private
 */
export type TooltipRootProps = Omit<
	React.ComponentProps<typeof TooltipPrimitive.Root>,
	'children'
> & {
	children?: React.ReactNode;
};

/**
 * @access private
 */
export function TooltipRoot({
	children,
	onOpenChange,
	...props
}: TooltipRootProps): React.ReactNode {
	const insideTrigger = useIsInsideTooltipTrigger();
	const { group } = useTooltipConfig();
	const id = React.useId();
	const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
	const open = props.open ?? uncontrolledOpen;

	React.useEffect(() => {
		if (!group || !open) {
			return undefined;
		}

		group.setOpen(id, true);

		return () => group.setOpen(id, false);
	}, [group, id, open]);

	// A second tooltip on the same element would open on the same hover, so the parts
	// below stack into the tooltip above instead.
	if (insideTrigger) {
		return children;
	}

	return (
		<TooltipPrimitive.Root
			{...props}
			onOpenChange={(next, details) => {
				onOpenChange?.(next, details);

				if (!details.isCanceled) {
					setUncontrolledOpen(next);
				}
			}}
		>
			<TooltipContentIdProvider>
				<TooltipContentStackProviderIfMissing>{children}</TooltipContentStackProviderIfMissing>
			</TooltipContentIdProvider>
		</TooltipPrimitive.Root>
	);
}
