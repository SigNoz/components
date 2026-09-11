import type * as React from 'react';
import type { TooltipPositionerProps } from './subcomponents/tooltip-positioner.js';
import type { TooltipRootProps } from './subcomponents/tooltip-root.js';
import type { TooltipContainer } from './tooltip-config-context.js';

type OriginalPositionerProps = TooltipPositionerProps;

export interface TooltipProps {
	/**
	 * The content of the tooltip. No tooltip is rendered while it is empty, and the
	 * trigger stays the element it already was.
	 */
	title: React.ReactNode;
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
	 * Whether the tooltip is open. Set, the tooltip shows exactly what it is told to and
	 * neither hover nor focus changes that.
	 *
	 * @note For a story or a test that needs a popup on screen, not for app code: a
	 * tooltip belongs to the pointer, and holding one open from the outside takes that
	 * away. Leave it out and let hover and focus drive it.
	 */
	open?: TooltipRootProps['open'];
	/**
	 * The element the tooltip is portalled into. Defaults to the one the surrounding
	 * `TooltipProvider` was given, and to `document.body` without one. Pass the
	 * dialog or drawer element to keep the tooltip inside it.
	 */
	container?: TooltipContainer;
	/**
	 * Class name of the tooltip content. Merges with the styles of the component
	 * instead of replacing them.
	 *
	 * @note Reach for it only when nothing else works: padding and colours belong in
	 * the component, not at the call site.
	 */
	className?: string;
	/**
	 * Inline styles of the tooltip content, for the exceptional case a class name
	 * cannot cover.
	 */
	style?: React.CSSProperties;
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
	 * on the trigger it clones, next to its `className` and `style`.
	 */
	[dataAttribute: `data-${string}`]: unknown;
}
