import { Popover as PopoverPrimitive } from '@base-ui/react/popover';
import { forwardRef, isValidElement, type ReactNode } from 'react';

/**
 * @access private
 */
export type PopoverTriggerProps = {
	children: ReactNode;
	// Optional on the root, where the validator requires it only alongside a `trigger`. This
	// part renders only when there is one, so a value is always passed in practice.
	nativeButton: boolean | undefined;
	openOnHover: boolean;
	delay: number;
	closeDelay: number;
	testId: string | undefined;
};

/**
 * The popover's trigger, merged into the element the call site passes as `trigger`.
 *
 * @access private
 */
export const PopoverTrigger = forwardRef<HTMLButtonElement, PopoverTriggerProps>(
	function PopoverTrigger({ children, nativeButton, openOnHover, delay, closeDelay, testId }, ref) {
		return (
			<PopoverPrimitive.Trigger
				ref={ref}
				data-slot="popover-trigger"
				nativeButton={nativeButton}
				{...(openOnHover && { openOnHover: true, delay, closeDelay })}
				{...(testId === undefined ? {} : { 'data-testid': testId })}
				{...(isValidElement(children) ? { render: children } : { children })}
			/>
		);
	},
);
