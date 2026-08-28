import { useRender } from '@base-ui/react/use-render';
import type * as React from 'react';
import { isValidElement } from 'react';

interface AsChildProps {
	/**
	 * The single element to render in place of the component's own element.
	 * Anything that is not a valid element falls back to `defaultTagName`.
	 */
	child: React.ReactNode;
	/**
	 * Props merged onto the rendered element. Event handlers are composed,
	 * `className` and `style` are joined, and other props overwrite the child's.
	 */
	props: Record<string, unknown>;
	/**
	 * Element rendered when `child` is not a single valid element.
	 */
	defaultTagName: keyof React.JSX.IntrinsicElements;
	/**
	 * Ref applied to the rendered element.
	 */
	elementRef?: React.Ref<Element>;
}

/**
 * Renders `child` in place of a component's own element, merging `props` onto
 * it — the behaviour Radix's `Slot` provided for our public `asChild` prop,
 * reimplemented on Base UI's `useRender`.
 *
 * Deliberately a component rather than a hook: callers branch on `asChild`, and
 * a hook would have to run on the non-`asChild` path too (or worse, be called
 * conditionally). As a component the branch stays a plain early return.
 */
export function AsChild({ child, props, defaultTagName, elementRef }: AsChildProps) {
	return useRender({
		defaultTagName,
		render: isValidElement(child) ? child : undefined,
		ref: elementRef,
		props,
	});
}
