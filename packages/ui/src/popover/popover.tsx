import * as PopoverPrimitive from '@radix-ui/react-popover';
import * as React from 'react';

import { cn } from '../lib/utils.js';
import styles from './popover.module.css';

export type PopoverProps = {
	/**
	 * The children of the popover.
	 */
	children?: React.ReactNode;
	/**
	 * The controlled open state of the popover. Must be used in conjunction with onOpenChange.
	 */
	open?: boolean;
	/**
	 * The open state of the popover when it is initially rendered. Use when you do not need to control its open state.
	 */
	defaultOpen?: boolean;
	/**
	 * Event handler called when the open state of the popover changes.
	 */
	onOpenChange?: (open: boolean) => void;
	/**
	 * The modality of the popover. When set to true, interaction with outside elements will be disabled and only popover content will be visible to screen readers.
	 */
	modal?: boolean;
	/**
	 * The test id of the popover.
	 */
	testId?: string;
};

/**
 * Root component that manages the open state and accessibility wiring for a popover.
 * Compose with `PopoverTrigger` and `PopoverContent` for the standard pattern, or use
 * `PopoverAnchor` when positioning against a different element than the trigger.
 *
 * @example
 * ```tsx
 * <Popover>
 *   <PopoverTrigger asChild>
 *     <Button variant="outline">Open popover</Button>
 *   </PopoverTrigger>
 *   <PopoverContent className="w-80">
 *     <div className="space-y-2">
 *       <h4 className="font-medium">Dimensions</h4>
 *       <p className="text-sm text-muted-foreground">Set the dimensions for the layer.</p>
 *     </div>
 *   </PopoverContent>
 * </Popover>
 * ```
 *
 * @example
 * ```tsx
 * const [open, setOpen] = React.useState(false);
 * <Popover open={open} onOpenChange={setOpen}>
 *   <PopoverTrigger asChild>
 *     <Button>{date ? date.toLocaleDateString() : 'Pick a date'}</Button>
 *   </PopoverTrigger>
 *   <PopoverContent align="start">
 *     <Calendar mode="single" selected={date} onSelect={(d) => { setDate(d); setOpen(false); }} />
 *   </PopoverContent>
 * </Popover>
 * ```
 *
 * @example
 * ```tsx
 * <Popover defaultOpen>
 *   <PopoverTrigger asChild>
 *     <Button>Open by default</Button>
 *   </PopoverTrigger>
 *   <PopoverContent>
 *     <p>I am open by default</p>
 *   </PopoverContent>
 * </Popover>
 * ```
 */
export function Popover({ testId, ...props }: PopoverProps) {
	return <PopoverPrimitive.Root data-slot="popover" data-testid={testId} {...props} />;
}

export type PopoverTriggerProps = Omit<
	React.ComponentProps<typeof PopoverPrimitive.Trigger>,
	'id' | 'className'
> & {
	/**
	 * The id of the popover trigger.
	 */
	id?: string;
	/**
	 * The class name of the popover trigger.
	 */
	className?: string;
	/**
	 * The test id of the popover trigger.
	 */
	testId?: string;
};

/**
 * The button that toggles the popover. Use `asChild` to delegate to a child element (e.g. a Button).
 * By default, `PopoverContent` positions itself against the trigger.
 *
 * @example
 * ```tsx
 * <Popover>
 *   <PopoverTrigger asChild>
 *     <Button variant="outline">Open popover</Button>
 *   </PopoverTrigger>
 *   <PopoverContent>...</PopoverContent>
 * </Popover>
 * ```
 */
export const PopoverTrigger = React.forwardRef<HTMLButtonElement, PopoverTriggerProps>(
	({ testId, id, className, ...props }, ref) => {
		return (
			<PopoverPrimitive.Trigger
				ref={ref}
				data-slot="popover-trigger"
				data-testid={testId}
				id={id}
				className={className}
				{...props}
			/>
		);
	}
);

export type PopoverAnchorProps = Omit<
	React.ComponentProps<typeof PopoverPrimitive.Anchor>,
	'id' | 'className'
> & {
	/**
	 * The id of the popover anchor.
	 */
	id?: string;
	/**
	 * The class name of the popover anchor.
	 */
	className?: string;
	/**
	 * The test id of the popover anchor.
	 */
	testId?: string;
};

/**
 * Optional element to position `PopoverContent` against. If not used, content positions against `PopoverTrigger`.
 * Use when you want the popover anchored to a different element than the trigger.
 *
 * @example
 * ```tsx
 * <Popover>
 *   <PopoverAnchor asChild>
 *     <div className="flex gap-2">
 *       <span>Row as anchor</span>
 *       <PopoverTrigger>Trigger</PopoverTrigger>
 *     </div>
 *   </PopoverAnchor>
 *   <PopoverContent>Content positioned against the anchor row</PopoverContent>
 * </Popover>
 * ```
 */
export const PopoverAnchor = React.forwardRef<HTMLDivElement, PopoverAnchorProps>(
	({ testId, id, className, ...props }, ref) => {
		return (
			<PopoverPrimitive.Anchor
				ref={ref}
				data-slot="popover-anchor"
				data-testid={testId}
				id={id}
				className={className}
				{...props}
			/>
		);
	}
);

export type PopoverPortalProps = React.ComponentProps<typeof PopoverPrimitive.Portal> & {
	/**
	 * The test id of the popover portal.
	 */
	testId?: string;
};

/**
 * Portals the popover content into `document.body`. Used internally by `PopoverContent`.
 * Use directly when you need a custom `container` or `forceMount` behavior.
 */
export const PopoverPortal = ({ testId, ...props }: PopoverPortalProps) => {
	return <PopoverPrimitive.Portal data-slot="popover-portal" data-testid={testId} {...props} />;
};

export type PopoverArrowProps = {
	/**
	 * The test id of the popover arrow.
	 */
	testId?: string;
} & Pick<React.ComponentProps<'svg'>, 'className' | 'style'>;

/**
 * Optional arrow element to visually link the trigger with the content.
 * Must be rendered inside `PopoverContent`. Use `PopoverContent`'s `arrow` prop for the common case.
 *
 * @example
 * ```tsx
 * <PopoverContent arrow>
 *   <p>Content with arrow</p>
 * </PopoverContent>
 * ```
 */
export const PopoverArrow = React.forwardRef<SVGSVGElement, PopoverArrowProps>(
	({ testId, className, style }, ref) => {
		return (
			<PopoverPrimitive.Arrow
				ref={ref}
				data-slot="popover-arrow"
				data-testid={testId}
				asChild
				className={cn(styles.popover__arrow, className)}
				style={style}
			>
				<svg width={10} height={5} viewBox="0 0 30 10" preserveAspectRatio="none">
					<path d="M 0,0 L 15,10 L 30,0" className={styles.popover__arrowPath} />
				</svg>
			</PopoverPrimitive.Arrow>
		);
	}
);

type OriginalPopoverContentProps = React.ComponentProps<typeof PopoverPrimitive.Content>;

export type PopoverContentProps = {
	/**
	 * Used to force mounting when more control is needed. Useful when
	 * controlling animation with React animation libraries.
	 */
	forceMount?: true;
	/**
	 * Event handler called when auto-focusing on open.
	 * Can be prevented.
	 */
	onOpenAutoFocus?: OriginalPopoverContentProps['onOpenAutoFocus'];
	/**
	 * Event handler called when auto-focusing on close.
	 * Can be prevented.
	 */
	onCloseAutoFocus?: OriginalPopoverContentProps['onCloseAutoFocus'];
	/**
	 * When `true`, hover/focus/click interactions will be disabled on elements outside
	 * the `DismissableLayer`. Users will need to click twice on outside elements to
	 * interact with them: once to close the `DismissableLayer`, and again to trigger the element.
	 */
	disableOutsidePointerEvents?: boolean;
	/**
	 * Event handler called when the escape key is down.
	 * Can be prevented.
	 */
	onEscapeKeyDown?: (event: KeyboardEvent) => void;
	/**
	 * Event handler called when the a `pointerdown` event happens outside of the `DismissableLayer`.
	 * Can be prevented.
	 */
	onPointerDownOutside?: OriginalPopoverContentProps['onPointerDownOutside'];
	/**
	 * Event handler called when the focus moves outside of the `DismissableLayer`.
	 * Can be prevented.
	 */
	onFocusOutside?: OriginalPopoverContentProps['onFocusOutside'];
	/**
	 * Event handler called when an interaction happens outside the `DismissableLayer`.
	 * Specifically, when a `pointerdown` event happens outside or focus moves outside of it.
	 * Can be prevented.
	 */
	onInteractOutside?: OriginalPopoverContentProps['onInteractOutside'];
	/**
	 * The preferred side of the trigger to render against when open. Will be reversed when collisions occur and avoidCollisions is enabled.
	 */
	side?: OriginalPopoverContentProps['side'];
	/**
	 * The distance in pixels from the trigger.
	 * @default 4
	 */
	sideOffset?: number;
	/**
	 * The preferred alignment against the trigger. May change when collisions occur.
	 */
	align?: OriginalPopoverContentProps['align'];
	/**
	 * An offset in pixels from the "start" or "end" alignment options.
	 */
	alignOffset?: number;
	/**
	 * The padding between the arrow and the edges of the content. If your content has border-radius, this will prevent it from overflowing the corners.
	 */
	arrowPadding?: number;
	/**
	 * When true, overrides the side and align preferences to prevent collisions with boundary edges.
	 */
	avoidCollisions?: boolean;
	/**
	 * The element used as the collision boundary. By default this is the viewport, though you can provide additional element(s) to be included in this check.
	 */
	collisionBoundary?: OriginalPopoverContentProps['collisionBoundary'];
	/**
	 * The distance in pixels from the boundary edges where collision detection should occur. Accepts a number (same for all sides), or a partial padding object, for example: { top: 20, left: 20 }.
	 */
	collisionPadding?: OriginalPopoverContentProps['collisionPadding'];
	/**
	 * The sticky behavior on the align axis. "partial" will keep the content in the boundary as long as the trigger is at least partially in the boundary whilst "always" will keep the content in the boundary regardless.
	 */
	sticky?: 'partial' | 'always';
	/**
	 * Whether to hide the content when the trigger becomes fully occluded.
	 */
	hideWhenDetached?: boolean;
	/**
	 * The strategy used to update the position of the content. "optimized" will use ResizeObserver to
	 * only update when necessary; "always" will update on every frame.
	 * @defaultValue 'optimized'
	 */
	updatePositionStrategy?: 'optimized' | 'always';
	/**
	 * The test id of the popover content.
	 */
	testId?: string;
	/**
	 * Whether to show the arrow.
	 */
	arrow?: boolean;
	/**
	 * Only change to false when you want to include a popover inside another popover.
	 *
	 * @default true
	 */
	withPortal?: boolean;
} & Pick<React.ComponentProps<'div'>, 'id' | 'className' | 'style' | 'children'>;

/**
 * The content that pops out when the popover is open. Rendered in a portal.
 * Supports positioning via `side`, `align`, and collision detection.
 *
 * @example
 * ```tsx
 * <PopoverContent className="w-80" side="bottom" align="center" arrow>
 *   <div className="space-y-2">
 *     <h4 className="font-medium">Title</h4>
 *     <p className="text-sm text-muted-foreground">Rich content here.</p>
 *   </div>
 * </PopoverContent>
 * ```
 *
 * @example
 * ```tsx
 * <PopoverContent side="top" align="end" arrow>
 *   <p>Positioned above, aligned to end</p>
 * </PopoverContent>
 * ```
 */
export const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
	(
		{
			className,
			align = 'center',
			sideOffset = 4,
			testId,
			children,
			arrow = false,
			withPortal = true,
			...props
		},
		ref
	) => {
		const popoverContent = (
			<PopoverPrimitive.Content
				ref={ref}
				data-slot="popover-content"
				data-testid={testId}
				align={align}
				sideOffset={sideOffset}
				className={cn(styles.popover__content, className)}
				{...props}
			>
				{arrow && <PopoverArrow />}
				{children}
			</PopoverPrimitive.Content>
		);

		if (!withPortal) {
			return popoverContent;
		}

		return <PopoverPortal>{popoverContent}</PopoverPortal>;
	}
);

export type PopoverCloseProps = React.ComponentProps<typeof PopoverPrimitive.Close> & {
	/**
	 * The test id of the popover close.
	 */
	testId?: string;
};

/**
 * Button that closes the popover when clicked. Place inside `PopoverContent`.
 *
 * @example
 * ```tsx
 * <PopoverContent>
 *   <p>Some content</p>
 *   <PopoverClose asChild>
 *     <Button variant="outline" size="sm">Close</Button>
 *   </PopoverClose>
 * </PopoverContent>
 * ```
 */
export const PopoverClose = React.forwardRef<HTMLButtonElement, PopoverCloseProps>(
	({ testId, ...props }, ref) => {
		return (
			<PopoverPrimitive.Close ref={ref} data-slot="popover-close" data-testid={testId} {...props} />
		);
	}
);
