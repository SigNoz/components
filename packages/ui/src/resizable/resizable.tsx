import { DragHandleDots2Icon } from '@radix-ui/react-icons';
import type { CSSProperties, Ref } from 'react';
import React from 'react';
import type {
	GroupImperativeHandle,
	Layout,
	LayoutStorage,
	OnGroupLayoutChange,
	PanelImperativeHandle,
	PanelSize,
} from 'react-resizable-panels';
import {
	Group,
	Panel,
	Separator,
	useDefaultLayout,
	useGroupCallbackRef,
	useGroupRef,
	usePanelCallbackRef,
	usePanelRef,
} from 'react-resizable-panels';
import { cn } from '../lib/utils.js';
import styles from './resizable.module.scss';

export { useDefaultLayout, useGroupRef, usePanelRef, useGroupCallbackRef, usePanelCallbackRef };
export type {
	Layout,
	PanelSize,
	GroupImperativeHandle,
	PanelImperativeHandle,
	OnGroupLayoutChange,
	LayoutStorage,
};

export type ResizablePanelGroupProps = Pick<
	React.ComponentPropsWithoutRef<'div'>,
	'className' | 'children'
> & {
	/**
	 * Default layout for the Group.
	 *
	 * ℹ️ This value allows layouts to be remembered between page reloads.
	 *
	 * ⚠️ Refer to the documentation for how to avoid layout shift when using server components.
	 */
	defaultLayout?: Layout | undefined;
	/**
	 * This library sets custom mouse cursor styles to indicate drag state.
	 * Use this prop to disable that behavior for Panels and Separators in this group.
	 */
	disableCursor?: boolean | undefined;
	/**
	 * Disable resize functionality.
	 */
	disabled?: boolean | undefined;
	/**
	 * Exposes the following imperative API:
	 * - `getLayout(): Layout`
	 * - `setLayout(layout: Layout): void`
	 *
	 * ℹ️ The `useGroupRef` and `useGroupCallbackRef` hooks are exported for convenience use in TypeScript projects.
	 */
	groupRef?: Ref<GroupImperativeHandle | null> | undefined;
	/**
	 * Uniquely identifies this group within an application.
	 * Falls back to `useId` when not provided.
	 *
	 * ℹ️ This value will also be assigned to the `data-group` attribute.
	 */
	id?: string | undefined;
	/**
	 * Called when the Group's layout is changing.
	 *
	 * ⚠️ For layout changes caused by pointer events, this method is called each time the pointer is moved.
	 * For most cases, it is recommended to use the `onLayoutChanged` callback instead.
	 */
	onLayoutChange?: (layout: Layout) => void | undefined;
	/**
	 * Called after the Group's layout has  been changed.
	 *
	 * ℹ️ For layout changes caused by pointer events, this method is not called until the pointer has been released.
	 * This method is recommended when saving layouts to some storage api.
	 */
	onLayoutChanged?: (layout: Layout) => void | undefined;
	/**
	 * Minimum size of the resizable hit target area (either `Separator` or `Panel` edge)
	 * This threshold ensures are large enough to avoid mis-clicks.
	 *
	 * - Coarse inputs (typically a finger on a touchscreen) have reduced accuracy;
	 * to ensure accessibility and ease of use, hit targets should be larger to prevent mis-clicks.
	 * - Fine inputs (typically a mouse) can be smaller
	 *
	 * ℹ️ [Apple interface guidelines](https://developer.apple.com/design/human-interface-guidelines/accessibility) suggest `20pt` (`27px`) on desktops and `28pt` (`37px`) for touch devices
	 * In practice this seems to be much larger than many of their own applications use though.
	 */
	resizeTargetMinimumSize?: {
		coarse: number;
		fine: number;
	};
	/**
	 * Specifies the resizable orientation ("horizontal" or "vertical"); defaults to "horizontal"
	 */
	orientation?: 'horizontal' | 'vertical' | undefined;
	/**
	 * CSS properties.
	 *
	 * ⚠️ The following styles cannot be overridden: `display`, `flex-direction`, `flex-wrap`, and `overflow`.
	 */
	style?: CSSProperties | undefined;
	/**
	 * The testId associated with the panel group.
	 */
	testId?: string;
};

/**
 * ResizablePanelGroup is a container for resizable panels.
 * It manages the layout and resizing behavior of its child panels.
 *
 * @example
 * ```tsx
 * // Basic horizontal layout
 * <ResizablePanelGroup orientation="horizontal">
 *   <ResizablePanel defaultSize="25%">
 *     <div>Sidebar</div>
 *   </ResizablePanel>
 *   <ResizableHandle />
 *   <ResizablePanel defaultSize="75%">
 *     <div>Main Content</div>
 *   </ResizablePanel>
 * </ResizablePanelGroup>
 * ```
 *
 * @example
 * ```tsx
 * // Vertical layout
 * <ResizablePanelGroup orientation="vertical">
 *   <ResizablePanel defaultSize="70%">
 *     <div>Editor</div>
 *   </ResizablePanel>
 *   <ResizableHandle />
 *   <ResizablePanel defaultSize="30%">
 *     <div>Terminal</div>
 *   </ResizablePanel>
 * </ResizablePanelGroup>
 * ```
 *
 * @example
 * ```tsx
 * // With persistent layout using useDefaultLayout
 * const { defaultLayout, onLayoutChanged } = useDefaultLayout({
 *   id: 'my-layout',
 *   storage: localStorage,
 * });
 *
 * <ResizablePanelGroup
 *   orientation="horizontal"
 *   defaultLayout={defaultLayout}
 *   onLayoutChanged={onLayoutChanged}
 * >
 *   <ResizablePanel defaultSize="25%">Sidebar</ResizablePanel>
 *   <ResizableHandle />
 *   <ResizablePanel defaultSize="75%">Main</ResizablePanel>
 * </ResizablePanelGroup>
 * ```
 */
const ResizablePanelGroup = React.forwardRef<HTMLDivElement, ResizablePanelGroupProps>(
	({ className, testId, ...props }, ref) => (
		<Group
			className={cn(styles['resizable-group'], className)}
			data-testid={testId}
			elementRef={ref}
			{...props}
		/>
	)
);
ResizablePanelGroup.displayName = 'ResizablePanelGroup';

export type ResizablePanelProps = Pick<React.ComponentPropsWithoutRef<'div'>, 'children'> & {
	/**
	 * CSS class name.
	 *
	 * ⚠️ Class is applied to nested `HTMLDivElement` to avoid styles that interfere with Flex layout.
	 */
	className?: string | undefined;
	/**
	 * Panel size when collapsed; defaults to 0%.
	 */
	collapsedSize?: number | string | undefined;
	/**
	 * This panel can be collapsed.
	 *
	 * ℹ️ A collapsible panel will collapse when it's size is less than of the specified `minSize`
	 */
	collapsible?: boolean | undefined;
	/**
	 * Default size of Panel within its parent group; default is auto-assigned based on the total number of Panels.
	 */
	defaultSize?: number | string | undefined;
	/**
	 * When disabled, a panel cannot be resized either directly or indirectly (by resizing another panel).
	 */
	disabled?: boolean | undefined;
	/**
	 * How should this Panel behave if the parent Group is resized?
	 * Defaults to `preserve-relative-size`.
	 *
	 * - `preserve-relative-size`: Retain the current relative size (as a percentage of the Group)
	 * - `preserve-pixel-size`: Retain its current size (in pixels)
	 *
	 * ℹ️ Panel min/max size constraints may impact this behavior.
	 *
	 * ⚠️ A Group must contain at least one Panel with `preserve-relative-size` resize behavior.
	 */
	groupResizeBehavior?: 'preserve-relative-size' | 'preserve-pixel-size' | undefined;
	/**
	 * Uniquely identifies this panel within the parent group.
	 * Falls back to `useId` when not provided.
	 *
	 * ℹ️ This prop is used to associate persisted group layouts with the original panel.
	 *
	 * ℹ️ This value will also be assigned to the `data-panel` attribute.
	 */
	id?: string | undefined;
	/**
	 * Maximum size of Panel within its parent group; defaults to 100%.
	 */
	maxSize?: number | string | undefined;
	/**
	 * Minimum size of Panel within its parent group; defaults to 0%.
	 */
	minSize?: number | string | undefined;
	/**
	 * Called when panel sizes change.
	 *
	 * @param panelSize Panel size (both as a percentage of the parent Group and in pixels)
	 * @param id Panel id (if one was provided as a prop)
	 * @param prevPanelSize Previous panel size (will be undefined on mount)
	 */
	onResize?:
		| ((
				panelSize: PanelSize,
				id: string | number | undefined,
				prevPanelSize: PanelSize | undefined
		  ) => void)
		| undefined;
	/**
	 * Exposes the following imperative API:
	 * - `collapse(): void`
	 * - `expand(): void`
	 * - `getSize(): number`
	 * - `isCollapsed(): boolean`
	 * - `resize(size: number): void`
	 *
	 * ℹ️ The `usePanelRef` and `usePanelCallbackRef` hooks are exported for convenience use in TypeScript projects.
	 */
	panelRef?: Ref<PanelImperativeHandle | null> | undefined;
	/**
	 * CSS properties.
	 *
	 * ⚠️ Style is applied to nested `HTMLDivElement` to avoid styles that interfere with Flex layout.
	 */
	style?: CSSProperties | undefined;
	/**
	 * The testId associated with the panel.
	 */
	testId?: string;
};

/**
 * ResizablePanel represents a single panel within a ResizablePanelGroup.
 *
 * @example
 * ```tsx
 * // Basic panel with default size
 * <ResizablePanel defaultSize="50%">
 *   <div>Panel Content</div>
 * </ResizablePanel>
 * ```
 *
 * @example
 * ```tsx
 * // Panel with size constraints
 * <ResizablePanel
 *   defaultSize="30%"
 *   minSize="20%"
 *   maxSize="60%"
 * >
 *   <div>Constrained Panel</div>
 * </ResizablePanel>
 * ```
 *
 * @example
 * ```tsx
 * // Collapsible panel
 * <ResizablePanel
 *   defaultSize="25%"
 *   collapsible={true}
 * >
 *   <div>Collapsible Sidebar</div>
 * </ResizablePanel>
 * ```
 */
const ResizablePanel = React.forwardRef<HTMLDivElement, ResizablePanelProps>(
	({ className, testId, ...props }, ref) => (
		<Panel className={className} data-testid={testId} elementRef={ref} {...props} />
	)
);
ResizablePanel.displayName = 'ResizablePanel';

export type ResizableHandleProps = Pick<React.ComponentPropsWithoutRef<'div'>, 'children'> & {
	/**
	 * CSS class name.
	 *
	 * ℹ️ Use the `data-separator` attribute for custom _hover_ and _active_ styles
	 *
	 * ⚠️ The following properties cannot be overridden: `flex-grow`, `flex-shrink`
	 */
	className?: string | undefined;
	/**
	 * When disabled, the separator cannot be used to resize its neighboring panels.
	 *
	 * ℹ️ The panels may still be resized indirectly (while other panels are being resized).
	 * To prevent a panel from being resized at all, it needs to also be disabled.
	 */
	disabled?: boolean | undefined;
	/**
	 * Uniquely identifies the separator within the parent group.
	 * Falls back to `useId` when not provided.
	 *
	 * ℹ️ This value will also be assigned to the `data-separator` attribute.
	 */
	id?: string | undefined;
	/**
	 * CSS properties.
	 *
	 * ℹ️ Use the `data-separator` attribute for custom _hover_ and _active_ styles
	 *
	 * ⚠️ The following properties cannot be overridden: `flex-grow`, `flex-shrink`
	 */
	style?: CSSProperties | undefined;
	/**
	 * The testId associated with the handle.
	 */
	testId?: string;
	/**
	 * Show a visible drag indicator.
	 */
	withHandle?: boolean;
};

/**
 * ResizableHandle is the draggable divider between panels.
 *
 * @example
 * ```tsx
 * // Basic handle
 * <ResizableHandle />
 * ```
 *
 * @example
 * ```tsx
 * // Handle with visible drag indicator
 * <ResizableHandle withHandle />
 * ```
 *
 * @example
 * ```tsx
 * // Disabled handle
 * <ResizableHandle disabled />
 * ```
 */
const ResizableHandle = React.forwardRef<HTMLDivElement, ResizableHandleProps>(
	({ withHandle, className, testId, ...props }, ref) => (
		<Separator
			className={cn(styles['resizable-handle'], className)}
			data-testid={testId}
			elementRef={ref}
			{...props}
		>
			{withHandle && (
				<div className={styles['resizable-handle__icon-wrapper']}>
					<DragHandleDots2Icon className={styles['resizable-handle__icon']} />
				</div>
			)}
		</Separator>
	)
);
ResizableHandle.displayName = 'ResizableHandle';

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
