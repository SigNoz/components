import type * as React from 'react';
import type { PopupHandle } from '../lib/popup-handle.js';
import type { TooltipPositionerProps } from './subcomponents/tooltip-positioner.js';
import type { TooltipContainer } from './tooltip-config-context.js';

type OriginalPositionerProps = TooltipPositionerProps;

export interface TooltipProps<Payload = unknown> {
	/**
	 * The content of the tooltip. No tooltip is rendered while it is empty, and the
	 * trigger stays the element it already was.
	 *
	 * With a `handle`, pass a function instead: it receives the payload of the most recent
	 * `showAt` call, so one declared tooltip serves many rows.
	 */
	title: React.ReactNode | ((payload: Payload | undefined) => React.ReactNode);
	/**
	 * Shows and hides the tooltip from application state rather than from the pointer.
	 *
	 * For a description positioned against one element but opened by something the tooltip
	 * cannot observe — a row the pointer entered, a selection that changed. Create one with
	 * `useTooltipHandle()`.
	 *
	 * @note A tooltip belongs to the pointer. Reach for this only when the surface is driven
	 * from elsewhere; an ordinary tooltip needs nothing but `title`.
	 */
	handle?: PopupHandle<Payload>;
	/**
	 * The trigger element.
	 */
	children: React.ReactNode;
	/**
	 * Which side of the trigger the tooltip opens against. May change on its own to
	 * avoid the edges of the viewport.
	 *
	 * @default 'top'
	 */
	side?: OriginalPositionerProps['side'];
	/**
	 * The distance in pixels between the tooltip and the trigger.
	 *
	 * @default 4
	 */
	sideOffset?: OriginalPositionerProps['sideOffset'];
	/**
	 * How the tooltip is aligned along the side it opens against.
	 *
	 * @default 'center'
	 */
	align?: OriginalPositionerProps['align'];
	/**
	 * An offset in pixels from the `start` or `end` alignment.
	 *
	 * @default 0
	 */
	alignOffset?: OriginalPositionerProps['alignOffset'];
	/**
	 * The element the tooltip is portalled into. Defaults to the one the surrounding
	 * `TooltipProvider` was given, and to `document.body` without one. Pass the
	 * dialog or drawer element to keep the tooltip inside it.
	 */
	container?: TooltipContainer;
	/**
	 * Id of the tooltip content. One is generated when it is left out.
	 */
	id?: string;
	/**
	 * Alias for `data-testid`, set on the tooltip content.
	 */
	testId?: string;
	/**
	 * Any `data-*` attribute is forwarded to the tooltip content, the only element this
	 * component renders of its own. A stacked tooltip has no content, so its `data-*` land
	 * on the trigger it clones.
	 */
	[dataAttribute: `data-${string}`]: unknown;
}
