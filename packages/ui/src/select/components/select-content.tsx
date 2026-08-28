import { Select as SelectPrimitive } from '@base-ui/react/select';
import { ChevronDown, ChevronUp } from '@signozhq/icons';
import * as React from 'react';
import { type DismissHandlers, useRegisterDismissHandlers } from '../../lib/dismiss-handlers.js';
import { InlinePortal } from '../../lib/inline-portal.js';
import { cn } from '../../lib/utils.js';
import styles from '../select.module.scss';

/**
 * Radix took a single `avoidCollisions` boolean; Base UI takes a per-axis
 * strategy. `flip`/`shift` reproduces Radix's behaviour.
 */
const COLLISIONS_ON = { side: 'flip', align: 'shift' } as const;
const COLLISIONS_OFF = { side: 'none', align: 'none' } as const;

export type SelectContentProps = {
	/** Additional CSS class names. */
	className?: string;
	/** Inline styles for the element. */
	style?: React.CSSProperties;
	/** Unique identifier for the element. */
	id?: string;
	/** Test identifier for testing libraries. */
	testId?: string;
	/** The content to render inside. */
	children?: React.ReactNode;
	/**
	 * Whether to render the content in a portal.
	 * @default true
	 */
	withPortal?: boolean;
	/**
	 * Whether to automatically wrap children in a SelectViewport.
	 * Set to false when using SelectScrollUpButton/SelectScrollDownButton,
	 * as scroll buttons must be siblings of SelectViewport, not children.
	 * @default true
	 */
	withViewport?: boolean;
	/**
	 * The positioning mode for the content.
	 * @default "popper"
	 */
	position?: 'item-aligned' | 'popper';
	/**
	 * The preferred side of the trigger to render against when position is "popper".
	 * @default "bottom"
	 */
	side?: 'top' | 'right' | 'bottom' | 'left';
	/**
	 * Distance in pixels from the trigger.
	 * @default 4
	 */
	sideOffset?: number;
	/**
	 * The preferred alignment against the trigger.
	 * @default "start"
	 */
	align?: 'start' | 'center' | 'end';
	/** Offset in pixels from the "start" or "end" alignment. */
	alignOffset?: number;
	/** Whether to prevent scrolling the body when content is open. */
	avoidCollisions?: boolean;
	/** Callback fired when escape key is pressed. */
	onEscapeKeyDown?: DismissHandlers['onEscapeKeyDown'];
	/**
	 * Callback fired when pointer is pressed outside the content.
	 *
	 * ℹ️ The event is a `PointerDownOutsideEvent`; the originating pointer event is
	 * available on `event.detail.originalEvent`.
	 */
	onPointerDownOutside?: DismissHandlers['onPointerDownOutside'];
};

/**
 * DropdownMenuSimple content container that holds the selectable items.
 *
 * By default, children are wrapped in a SelectViewport. When using scroll buttons
 * or SelectArrow, set `withViewport={false}` and manually include SelectViewport.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <SelectContent>
 *   <SelectItem value="a">Option A</SelectItem>
 * </SelectContent>
 *
 * // With scroll buttons
 * <SelectContent withViewport={false}>
 *   <SelectScrollUpButton />
 *   <SelectViewport>
 *     <SelectItem value="a">Option A</SelectItem>
 *   </SelectViewport>
 *   <SelectScrollDownButton />
 * </SelectContent>
 * ```
 */
export const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
	(
		{
			className,
			style,
			id,
			testId,
			children,
			withPortal = true,
			withViewport = true,
			position = 'popper',
			side,
			sideOffset = 4,
			align,
			alignOffset,
			avoidCollisions,
			onEscapeKeyDown,
			onPointerDownOutside,
		},
		ref,
	) => {
		useRegisterDismissHandlers({ onEscapeKeyDown, onPointerDownOutside });

		const content = (
			<SelectPrimitive.Positioner
				className={styles.select__positioner}
				// Radix's `position="item-aligned"` is the primitive's own
				// item-aligned mode; `popper` is plain anchor positioning.
				alignItemWithTrigger={position === 'item-aligned'}
				side={side}
				sideOffset={sideOffset}
				align={align}
				alignOffset={alignOffset}
				collisionAvoidance={
					avoidCollisions === undefined
						? undefined
						: avoidCollisions
							? COLLISIONS_ON
							: COLLISIONS_OFF
				}
			>
				<SelectPrimitive.Popup
					ref={ref}
					id={id}
					className={cn(styles.select__content, className)}
					style={style}
					data-slot="select-content"
					data-testid={testId}
					data-position={position}
				>
					{withViewport ? (
						<SelectPrimitive.List className={styles.select__viewport}>
							{children}
						</SelectPrimitive.List>
					) : (
						children
					)}
				</SelectPrimitive.Popup>
			</SelectPrimitive.Positioner>
		);

		if (withPortal) {
			return <SelectPrimitive.Portal>{content}</SelectPrimitive.Portal>;
		}

		return <InlinePortal Portal={SelectPrimitive.Portal}>{content}</InlinePortal>;
	},
);
SelectContent.displayName = 'SelectContent';

export type SelectViewportProps = {
	/** Additional CSS class names. */
	className?: string;
	/** Inline styles for the element. */
	style?: React.CSSProperties;
	/** Unique identifier for the element. */
	id?: string;
	/** Test identifier for testing libraries. */
	testId?: string;
	/** The select items to render. */
	children?: React.ReactNode;
};

/**
 * Scrollable viewport for select items.
 *
 * @example
 * ```tsx
 * <SelectContent withViewport={false}>
 *   <SelectViewport>
 *     <SelectItem value="a">Option A</SelectItem>
 *   </SelectViewport>
 * </SelectContent>
 * ```
 */
export const SelectViewport = React.forwardRef<HTMLDivElement, SelectViewportProps>(
	({ className, style, id, testId, ...props }, ref) => (
		<SelectPrimitive.List
			ref={ref}
			id={id}
			className={cn(styles.select__viewport, className)}
			style={style}
			data-slot="select-viewport"
			data-testid={testId}
			{...props}
		/>
	),
);
SelectViewport.displayName = 'SelectViewport';

export type SelectPortalProps = {
	/** The container element to portal into. */
	container?: React.ComponentProps<typeof SelectPrimitive.Portal>['container'];
	/** The content to portal. */
	children?: React.ReactNode;
};

/**
 * When used, portals the content part into the body.
 *
 * @example
 * ```tsx
 * <SelectPortal>
 *   <SelectContent withPortal={false}>
 *     <SelectItem value="a">Option A</SelectItem>
 *   </SelectContent>
 * </SelectPortal>
 * ```
 */
export const SelectPortal = SelectPrimitive.Portal;

export type SelectScrollUpButtonProps = {
	/** Additional CSS class names. */
	className?: string;
	/** Inline styles for the element. */
	style?: React.CSSProperties;
	/** Unique identifier for the element. */
	id?: string;
	/** Test identifier for testing libraries. */
	testId?: string;
	/** Custom icon content. Defaults to ChevronUp. */
	children?: React.ReactNode;
};

/**
 * An optional button used as an affordance to show the viewport overflow
 * as well as to scroll up. Must be rendered within SelectContent.
 *
 * @example
 * ```tsx
 * <SelectContent withViewport={false}>
 *   <SelectScrollUpButton />
 *   <SelectViewport>...</SelectViewport>
 *   <SelectScrollDownButton />
 * </SelectContent>
 * ```
 */
export const SelectScrollUpButton = React.forwardRef<HTMLDivElement, SelectScrollUpButtonProps>(
	({ className, style, id, testId, children, ...props }, ref) => (
		<SelectPrimitive.ScrollUpArrow
			ref={ref}
			id={id}
			className={cn(styles['select__scroll-button'], className)}
			style={style}
			data-slot="select-scroll-up-button"
			data-testid={testId}
			{...props}
		>
			{children ?? <ChevronUp />}
		</SelectPrimitive.ScrollUpArrow>
	),
);
SelectScrollUpButton.displayName = 'SelectScrollUpButton';

export type SelectScrollDownButtonProps = {
	/** Additional CSS class names. */
	className?: string;
	/** Inline styles for the element. */
	style?: React.CSSProperties;
	/** Unique identifier for the element. */
	id?: string;
	/** Test identifier for testing libraries. */
	testId?: string;
	/** Custom icon content. Defaults to ChevronDown. */
	children?: React.ReactNode;
};

/**
 * An optional button used as an affordance to show the viewport overflow
 * as well as to scroll down. Must be rendered within SelectContent.
 *
 * @example
 * ```tsx
 * <SelectContent withViewport={false}>
 *   <SelectScrollUpButton />
 *   <SelectViewport>...</SelectViewport>
 *   <SelectScrollDownButton />
 * </SelectContent>
 * ```
 */
export const SelectScrollDownButton = React.forwardRef<HTMLDivElement, SelectScrollDownButtonProps>(
	({ className, style, id, testId, children, ...props }, ref) => (
		<SelectPrimitive.ScrollDownArrow
			ref={ref}
			id={id}
			className={cn(styles['select__scroll-button'], className)}
			style={style}
			data-slot="select-scroll-down-button"
			data-testid={testId}
			{...props}
		>
			{children ?? <ChevronDown />}
		</SelectPrimitive.ScrollDownArrow>
	),
);
SelectScrollDownButton.displayName = 'SelectScrollDownButton';

export type SelectArrowProps = {
	/** Additional CSS class names. */
	className?: string;
	/** Inline styles for the element. */
	style?: React.CSSProperties;
	/** Unique identifier for the element. */
	id?: string;
	/** Test identifier for testing libraries. */
	testId?: string;
	/** The width of the arrow; numbers are pixels. */
	width?: number | string;
	/** The height of the arrow; numbers are pixels. */
	height?: number | string;
};

/**
 * An optional arrow element to render alongside the content.
 * This can be used to help visually link the trigger with the SelectContent.
 * Must be rendered inside SelectContent.
 *
 * @example
 * ```tsx
 * <SelectContent withViewport={false}>
 *   <SelectViewport>
 *     <SelectItem value="a">Option A</SelectItem>
 *   </SelectViewport>
 *   <SelectArrow />
 * </SelectContent>
 * ```
 */
export const SelectArrow = React.forwardRef<HTMLDivElement, SelectArrowProps>(
	({ className, style, id, testId, ...props }, ref) => (
		<SelectPrimitive.Arrow
			ref={ref}
			id={id}
			className={cn(styles.select__arrow, className)}
			style={style}
			data-slot="select-arrow"
			data-testid={testId}
			{...props}
		/>
	),
);
SelectArrow.displayName = 'SelectArrow';
