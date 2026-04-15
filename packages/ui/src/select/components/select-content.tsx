import * as SelectPrimitive from '@radix-ui/react-select';
import { ChevronDown, ChevronUp } from '@signozhq/icons';
import * as React from 'react';
import { cn } from '../../lib/utils.js';
import styles from '../select.module.scss';

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
	onEscapeKeyDown?: (event: KeyboardEvent) => void;
	/** Callback fired when pointer is pressed outside the content. */
	onPointerDownOutside?: (event: CustomEvent) => void;
};

/**
 * Dropdown content container that holds the selectable items.
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
export const SelectContent = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Content>,
	SelectContentProps
>(
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
			sideOffset = 4,
			...props
		},
		ref
	) => {
		const content = (
			<SelectPrimitive.Content
				ref={ref}
				id={id}
				className={cn(styles.select__content, className)}
				style={style}
				data-slot="select-content"
				data-testid={testId}
				position={position}
				sideOffset={sideOffset}
				{...props}
			>
				{withViewport ? (
					<SelectPrimitive.Viewport className={styles.select__viewport}>
						{children}
					</SelectPrimitive.Viewport>
				) : (
					children
				)}
			</SelectPrimitive.Content>
		);

		if (withPortal) {
			return <SelectPrimitive.Portal>{content}</SelectPrimitive.Portal>;
		}

		return content;
	}
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
export const SelectViewport = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Viewport>,
	SelectViewportProps
>(({ className, style, id, testId, ...props }, ref) => (
	<SelectPrimitive.Viewport
		ref={ref}
		id={id}
		className={cn(styles.select__viewport, className)}
		style={style}
		data-slot="select-viewport"
		data-testid={testId}
		{...props}
	/>
));
SelectViewport.displayName = 'SelectViewport';

export type SelectPortalProps = {
	/** The container element to portal into. */
	container?: HTMLElement | null;
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
export const SelectScrollUpButton = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
	SelectScrollUpButtonProps
>(({ className, style, id, testId, children, ...props }, ref) => (
	<SelectPrimitive.ScrollUpButton
		ref={ref}
		id={id}
		className={cn(styles['select__scroll-button'], className)}
		style={style}
		data-slot="select-scroll-up-button"
		data-testid={testId}
		{...props}
	>
		{children ?? <ChevronUp />}
	</SelectPrimitive.ScrollUpButton>
));
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
export const SelectScrollDownButton = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
	SelectScrollDownButtonProps
>(({ className, style, id, testId, children, ...props }, ref) => (
	<SelectPrimitive.ScrollDownButton
		ref={ref}
		id={id}
		className={cn(styles['select__scroll-button'], className)}
		style={style}
		data-slot="select-scroll-down-button"
		data-testid={testId}
		{...props}
	>
		{children ?? <ChevronDown />}
	</SelectPrimitive.ScrollDownButton>
));
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
	/** The width of the arrow in pixels. */
	width?: number;
	/** The height of the arrow in pixels. */
	height?: number;
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
export const SelectArrow = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Arrow>,
	SelectArrowProps
>(({ className, style, id, testId, ...props }, ref) => (
	<SelectPrimitive.Arrow
		ref={ref}
		id={id}
		className={cn(styles.select__arrow, className)}
		style={style}
		data-slot="select-arrow"
		data-testid={testId}
		{...props}
	/>
));
SelectArrow.displayName = 'SelectArrow';
