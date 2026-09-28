import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip';
import * as React from 'react';
import { cn } from '../../lib/utils.js';
import { useTooltipContentId } from '../tooltip-content-id-context.js';
import { TooltipTriggerProvider, useIsInsideTooltipTrigger } from '../tooltip-trigger-context.js';

/**
 * @access private
 */
export type TooltipTriggerProps = Omit<
	React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger>,
	'className'
> & {
	className?: string;
	testId?: string;
	/**
	 * Id of the popup this trigger describes. Only needed when the content is not
	 * rendered inside a `TooltipRoot` above the trigger, which is where the id
	 * otherwise comes from. `null` says there is no popup to point at, which the id
	 * from above cannot say.
	 */
	contentId?: string | null;
};

/**
 * @access private
 */
export const TooltipTrigger = React.forwardRef<HTMLButtonElement, TooltipTriggerProps>(
	function TooltipTrigger({ testId, handle, contentId, children, ...props }, ref) {
		const inheritedContentId = useTooltipContentId();
		const insideTrigger = useIsInsideTooltipTrigger();
		const childRef = React.isValidElement(children) ? getElementRef(children) : undefined;
		// `cloneElement` below replaces the ref of the child, so the two are merged first.
		const mergedRef = React.useMemo(
			() =>
				childRef == null || ref == null
					? (childRef ?? ref)
					: (node: HTMLButtonElement | null) => {
							setRef(childRef, node);
							setRef(ref, node);
						},
			[childRef, ref],
		);
		// Only spread when set: `cloneElement` below would otherwise replace the
		// `data-testid` the child brought along with `undefined`.
		const testIdProps = testId === undefined ? {} : { 'data-testid': testId };

		// The element is already the trigger of the tooltip above, which stacks the
		// content below it.
		if (insideTrigger) {
			if (!React.isValidElement<{ className?: string }>(children)) {
				return children;
			}

			// `handle` and `contentId` are dropped: the tooltip above owns the popup.
			return React.cloneElement(children, {
				...testIdProps,
				...props,
				...(props.className === undefined
					? {}
					: { className: cn(children.props.className, props.className) }),
				...(mergedRef == null ? {} : { ref: mergedRef }),
			} as React.Attributes);
		}

		return (
			<TooltipTriggerProvider>
				<TooltipPrimitive.Trigger
					ref={ref}
					data-slot="tooltip-trigger"
					handle={handle}
					aria-describedby={contentId === null ? undefined : (contentId ?? inheritedContentId)}
					{...testIdProps}
					{...props}
					{...(React.isValidElement(children) ? { render: children } : { children })}
				/>
			</TooltipTriggerProvider>
		);
	},
);

type ElementRef = React.Ref<HTMLButtonElement> | undefined;

// React 18 keeps the ref of an element next to its props, React 19 inside them.
function getElementRef(element: React.ReactElement): ElementRef {
	return (element.props as { ref?: ElementRef }).ref ?? (element as { ref?: ElementRef }).ref;
}

function setRef(ref: React.Ref<HTMLButtonElement>, node: HTMLButtonElement | null): void {
	if (typeof ref === 'function') {
		ref(node);
	} else if (ref != null) {
		(ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
	}
}
