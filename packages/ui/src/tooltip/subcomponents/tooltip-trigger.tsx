import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip';
import * as React from 'react';
import { getElementRef, setRef } from '../../lib/merge-refs.js';
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
		const childRef = React.isValidElement(children)
			? getElementRef<HTMLButtonElement>(children)
			: undefined;
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

		// An `aria-describedby` written on the trigger replaces the popup, as on the slider thumbs
		// where the value is already announced.
		const ownDescribedBy =
			'aria-describedby' in props
				? props['aria-describedby']
				: contentId === null
					? undefined
					: (contentId ?? inheritedContentId);

		if (!React.isValidElement<TriggerChildProps>(children)) {
			return (
				<TooltipTriggerProvider>
					<TooltipPrimitive.Trigger
						ref={ref}
						data-slot="tooltip-trigger"
						handle={handle}
						{...testIdProps}
						{...props}
						aria-describedby={ownDescribedBy}
					>
						{children}
					</TooltipPrimitive.Trigger>
				</TooltipTriggerProvider>
			);
		}

		// Base UI merges the props of the `render` element over its own, so the child's `id` and
		// `aria-describedby` would replace the trigger's: the id Base UI tracks the trigger by, and
		// the popup it describes. The trigger takes the child's id, and the two descriptions join.
		const childDescribedBy = children.props['aria-describedby'];
		const describedBy = joinIdRefs(ownDescribedBy, childDescribedBy);

		return (
			<TooltipTriggerProvider>
				<TooltipPrimitive.Trigger
					ref={ref}
					data-slot="tooltip-trigger"
					handle={handle}
					{...testIdProps}
					{...props}
					id={props.id ?? children.props.id}
					aria-describedby={describedBy}
					render={
						childDescribedBy === undefined
							? children
							: React.cloneElement(children, { 'aria-describedby': describedBy })
					}
				/>
			</TooltipTriggerProvider>
		);
	},
);

type TriggerChildProps = {
	id?: string;
	'aria-describedby'?: string;
};

function joinIdRefs(...lists: Array<string | undefined>): string | undefined {
	const ids = new Set(lists.flatMap((list) => list?.split(/\s+/).filter(Boolean) ?? []));

	return ids.size === 0 ? undefined : [...ids].join(' ');
}
