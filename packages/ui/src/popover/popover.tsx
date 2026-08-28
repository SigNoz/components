import { Popover as PopoverPrimitive } from '@base-ui/react/popover';
import * as React from 'react';

import { AsChild } from '../lib/as-child.js';
import {
	type DismissHandlers,
	DismissRegistryProvider,
	runDismissHandlers,
	useDismissRegistry,
	useRegisterDismissHandlers,
} from '../lib/dismiss-handlers.js';
import { InlinePortal } from '../lib/inline-portal.js';
import { cn } from '../lib/utils.js';
import type { CollisionBoundary, CollisionPadding } from '../lib/positioning.js';
import styles from './popover.module.css';

/**
 * Base UI has no `Anchor` part — the positioner takes an `anchor` element
 * directly. `PopoverAnchor` therefore registers its element here so that
 * `PopoverContent` can position against it instead of the trigger.
 */
const PopoverAnchorContext = React.createContext<{
	anchor: HTMLElement | null;
	setAnchor: (element: HTMLElement | null) => void;
} | null>(null);

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
	 *
	 * Accepted for API compatibility only — the root renders no element of its own,
	 * so this has never reached the DOM.
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
export function Popover({ open, defaultOpen, onOpenChange, modal, children }: PopoverProps) {
	const registry = useDismissRegistry();
	const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);
	const anchorValue = React.useMemo(() => ({ anchor, setAnchor }), [anchor]);

	const handleOpenChange = React.useCallback(
		(nextOpen: boolean, eventDetails: PopoverPrimitive.Root.ChangeEventDetails) => {
			runDismissHandlers(registry, nextOpen, eventDetails);
			if (eventDetails.isCanceled) {
				return;
			}
			onOpenChange?.(nextOpen);
		},
		[onOpenChange, registry],
	);

	return (
		<PopoverPrimitive.Root
			open={open}
			defaultOpen={defaultOpen}
			onOpenChange={handleOpenChange}
			modal={modal}
		>
			<PopoverAnchorContext.Provider value={anchorValue}>
				<DismissRegistryProvider registry={registry}>{children}</DismissRegistryProvider>
			</PopoverAnchorContext.Provider>
		</PopoverPrimitive.Root>
	);
}

/**
 * Base UI intersects a part's own `RefAttributes` with the ref of the element it
 * renders, which no single `forwardRef` type satisfies. The rendered element is
 * known per part, so the forwarded ref is widened to it.
 */
type TriggerRef = React.ComponentProps<typeof PopoverPrimitive.Trigger>['ref'];
type CloseRef = React.ComponentProps<typeof PopoverPrimitive.Close>['ref'];

export type PopoverTriggerProps = {
	/**
	 * The children of the popover trigger.
	 */
	children?: React.ReactNode;
	/**
	 * When true, merges props onto the child element instead of rendering a wrapper.
	 */
	asChild?: boolean;
	/**
	 * Whether the trigger is disabled.
	 */
	disabled?: boolean;
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
} & Pick<React.ComponentProps<'button'>, 'style' | 'onClick' | 'aria-label' | 'type'>;

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
	({ asChild, testId, children, ...props }, ref) => {
		const child = asChild && React.isValidElement(children) ? children : undefined;

		if (child !== undefined) {
			return (
				<PopoverPrimitive.Trigger
					ref={ref as TriggerRef}
					data-slot="popover-trigger"
					data-testid={testId}
					render={child}
					{...props}
				/>
			);
		}

		return (
			<PopoverPrimitive.Trigger
				ref={ref as TriggerRef}
				data-slot="popover-trigger"
				data-testid={testId}
				{...props}
			>
				{children}
			</PopoverPrimitive.Trigger>
		);
	},
);
PopoverTrigger.displayName = 'PopoverTrigger';

export type PopoverAnchorProps = {
	/**
	 * The children of the popover anchor.
	 */
	children?: React.ReactNode;
	/**
	 * When true, merges props onto the child element instead of rendering a wrapper.
	 */
	asChild?: boolean;
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
} & Pick<React.ComponentProps<'div'>, 'style'>;

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
	({ asChild, testId, children, ...props }, ref) => {
		const anchorContext = React.useContext(PopoverAnchorContext);
		const setAnchor = anchorContext?.setAnchor;

		// Registers the rendered element as the positioner's anchor, and keeps the
		// caller's own ref working alongside it.
		const registerAnchor = React.useCallback(
			(element: HTMLDivElement | null) => {
				setAnchor?.(element);
				if (typeof ref === 'function') {
					ref(element);
				} else if (ref !== null && ref !== undefined) {
					(ref as React.MutableRefObject<HTMLDivElement | null>).current = element;
				}
			},
			[ref, setAnchor],
		);

		const elementProps = {
			...props,
			'data-slot': 'popover-anchor',
			'data-testid': testId,
		};

		if (asChild) {
			return (
				<AsChild
					child={children}
					props={elementProps}
					defaultTagName="div"
					elementRef={registerAnchor as React.Ref<Element>}
				/>
			);
		}

		return (
			<div ref={registerAnchor} {...elementProps}>
				{children}
			</div>
		);
	},
);
PopoverAnchor.displayName = 'PopoverAnchor';

export type PopoverPortalProps = {
	/**
	 * The content to portal.
	 */
	children?: React.ReactNode;
	/**
	 * Whether to keep the portal mounted in the DOM while the popover is closed.
	 */
	keepMounted?: boolean;
	/**
	 * A parent element to render the portal element into.
	 */
	container?: React.ComponentProps<typeof PopoverPrimitive.Portal>['container'];
	/**
	 * The test id of the popover portal.
	 */
	testId?: string;
};

/**
 * Portals the popover content into `document.body`. Used internally by `PopoverContent`.
 * Use directly when you need a custom `container` or `keepMounted` behavior.
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
				data-slot="popover-arrow"
				data-testid={testId}
				className={cn(styles.popover__arrow, className)}
				style={style}
				render={
					<svg ref={ref} width={10} height={5} viewBox="0 0 30 10" preserveAspectRatio="none">
						<path d="M 0,0 L 15,10 L 30,0" className={styles.popover__arrowPath} />
					</svg>
				}
			/>
		);
	},
);
PopoverArrow.displayName = 'PopoverArrow';

type PositionerProps = React.ComponentProps<typeof PopoverPrimitive.Positioner>;

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
	onOpenAutoFocus?: (event: Event) => void;
	/**
	 * Event handler called when auto-focusing on close.
	 * Can be prevented.
	 */
	onCloseAutoFocus?: (event: Event) => void;
	/**
	 * When `true`, hover/focus/click interactions will be disabled on elements outside
	 * the popover. Users will need to click twice on outside elements to interact with
	 * them: once to close the popover, and again to trigger the element.
	 */
	disableOutsidePointerEvents?: boolean;
	/**
	 * Event handler called when the escape key is down.
	 * Can be prevented.
	 */
	onEscapeKeyDown?: DismissHandlers['onEscapeKeyDown'];
	/**
	 * Event handler called when the a `pointerdown` event happens outside of the popover.
	 * Can be prevented.
	 */
	onPointerDownOutside?: DismissHandlers['onPointerDownOutside'];
	/**
	 * Event handler called when the focus moves outside of the popover.
	 * Can be prevented.
	 */
	onFocusOutside?: DismissHandlers['onFocusOutside'];
	/**
	 * Event handler called when an interaction happens outside the popover.
	 * Specifically, when a `pointerdown` event happens outside or focus moves outside of it.
	 * Can be prevented.
	 */
	onInteractOutside?: DismissHandlers['onInteractOutside'];
	/**
	 * The preferred side of the trigger to render against when open. Will be reversed when collisions occur and avoidCollisions is enabled.
	 */
	side?: PositionerProps['side'];
	/**
	 * The distance in pixels from the trigger.
	 * @default 4
	 */
	sideOffset?: number;
	/**
	 * The preferred alignment against the trigger. May change when collisions occur.
	 */
	align?: PositionerProps['align'];
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
	collisionBoundary?: CollisionBoundary;
	/**
	 * The distance in pixels from the boundary edges where collision detection should occur. Accepts a number (same for all sides), or a partial padding object, for example: { top: 20, left: 20 }.
	 */
	collisionPadding?: CollisionPadding;
	/**
	 * The sticky behavior on the align axis. "partial" will keep the content in the boundary as long as the trigger is at least partially in the boundary whilst "always" will keep the content in the boundary regardless.
	 */
	sticky?: 'partial' | 'always';
	/**
	 * Whether to hide the content when the trigger becomes fully occluded.
	 */
	hideWhenDetached?: boolean;
	/**
	 * The strategy used to update the position of the content.
	 *
	 * @deprecated No longer configurable — the position is always tracked while the
	 * popover is open. Accepted for API compatibility and otherwise ignored.
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
 * Radix took a single `avoidCollisions` boolean; Base UI takes a per-axis
 * strategy. `flip`/`shift` reproduces Radix's behaviour of reversing the side
 * and nudging the alignment.
 */
const COLLISIONS_ON: PositionerProps['collisionAvoidance'] = { side: 'flip', align: 'shift' };
const COLLISIONS_OFF: PositionerProps['collisionAvoidance'] = { side: 'none', align: 'none' };

/**
 * Bridges Radix's cancellable auto-focus events onto Base UI's `initialFocus`
 * and `finalFocus`, which take the decision as a return value rather than
 * reporting it as a preventable event.
 *
 * `true` selects Base UI's normal focus target and `false` suppresses focusing
 * entirely — returning `undefined` suppresses it too, so a handler that does not
 * call `preventDefault()` must resolve to `true`. Supplying a resolver also
 * replaces Base UI's own default, which focuses the popup itself when opened by
 * touch to keep the virtual keyboard closed.
 */
function useAutoFocusBridge(handler: ((event: Event) => void) | undefined, type: string) {
	return React.useMemo(() => {
		if (handler === undefined) {
			return undefined;
		}
		return () => {
			const event = new Event(type, { cancelable: true });
			handler(event);
			return !event.defaultPrevented;
		};
	}, [handler, type]);
}

const PopoverContentInner = React.forwardRef<
	HTMLDivElement,
	Omit<PopoverContentProps, 'withPortal' | 'forceMount'>
>(
	(
		{
			className,
			side,
			align = 'center',
			sideOffset = 4,
			alignOffset,
			arrowPadding,
			avoidCollisions,
			collisionBoundary,
			collisionPadding,
			sticky,
			hideWhenDetached,
			updatePositionStrategy: _updatePositionStrategy,
			disableOutsidePointerEvents = false,
			onOpenAutoFocus,
			onCloseAutoFocus,
			onEscapeKeyDown,
			onPointerDownOutside,
			onFocusOutside,
			onInteractOutside,
			testId,
			children,
			arrow = false,
			...popupProps
		},
		ref,
	) => {
		const anchorContext = React.useContext(PopoverAnchorContext);
		const initialFocus = useAutoFocusBridge(onOpenAutoFocus, 'openAutoFocus');
		const finalFocus = useAutoFocusBridge(onCloseAutoFocus, 'closeAutoFocus');

		useRegisterDismissHandlers({
			onEscapeKeyDown,
			onPointerDownOutside,
			onFocusOutside,
			onInteractOutside,
		});

		return (
			<>
				{/* Radix disabled outside pointer events on the content; Base UI covers
            the page with a backdrop to the same effect. */}
				{disableOutsidePointerEvents && (
					<PopoverPrimitive.Backdrop className={styles.popover__backdrop} />
				)}
				<PopoverPrimitive.Positioner
					className={styles.popover__positioner}
					data-hide-when-detached={hideWhenDetached ? '' : undefined}
					anchor={anchorContext?.anchor ?? undefined}
					side={side}
					sideOffset={sideOffset}
					align={align}
					alignOffset={alignOffset}
					arrowPadding={arrowPadding}
					collisionBoundary={collisionBoundary ?? undefined}
					collisionPadding={collisionPadding}
					sticky={sticky === 'always'}
					collisionAvoidance={
						avoidCollisions === undefined
							? undefined
							: avoidCollisions
								? COLLISIONS_ON
								: COLLISIONS_OFF
					}
				>
					<PopoverPrimitive.Popup
						ref={ref}
						data-slot="popover-content"
						data-testid={testId}
						className={cn(styles.popover__content, className)}
						initialFocus={initialFocus}
						finalFocus={finalFocus}
						{...popupProps}
					>
						{arrow && <PopoverArrow />}
						{children}
					</PopoverPrimitive.Popup>
				</PopoverPrimitive.Positioner>
			</>
		);
	},
);
PopoverContentInner.displayName = 'PopoverContentInner';

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
	({ withPortal = true, forceMount, ...props }, ref) => {
		if (withPortal) {
			return (
				<PopoverPrimitive.Portal keepMounted={forceMount}>
					<PopoverContentInner ref={ref} {...props} />
				</PopoverPrimitive.Portal>
			);
		}

		return (
			<InlinePortal Portal={PopoverPrimitive.Portal} keepMounted={forceMount}>
				<PopoverContentInner ref={ref} {...props} />
			</InlinePortal>
		);
	},
);
PopoverContent.displayName = 'PopoverContent';

export type PopoverCloseProps = {
	/**
	 * The children of the popover close button.
	 */
	children?: React.ReactNode;
	/**
	 * When true, merges props onto the child element instead of rendering a wrapper.
	 */
	asChild?: boolean;
	/**
	 * The test id of the popover close.
	 */
	testId?: string;
} & Pick<React.ComponentProps<'button'>, 'id' | 'className' | 'style' | 'onClick' | 'aria-label'>;

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
	({ asChild, testId, children, ...props }, ref) => {
		const child = asChild && React.isValidElement(children) ? children : undefined;

		if (child !== undefined) {
			return (
				<PopoverPrimitive.Close
					ref={ref as CloseRef}
					data-slot="popover-close"
					data-testid={testId}
					render={child}
					{...props}
				/>
			);
		}

		return (
			<PopoverPrimitive.Close
				ref={ref as CloseRef}
				data-slot="popover-close"
				data-testid={testId}
				{...props}
			>
				{children}
			</PopoverPrimitive.Close>
		);
	},
);
PopoverClose.displayName = 'PopoverClose';
