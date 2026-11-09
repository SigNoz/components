import * as React from 'react';
import { cn, joinIdRefs } from '../../lib/utils.js';
import {
	hasTooltipContent,
	TooltipContentStackProvider,
	useRegisterTooltipContent,
	useTooltipContentStackEntries,
} from '../tooltip-content-stack-context.js';
import { TooltipTriggerProvider, useIsInsideTooltipTrigger } from '../tooltip-trigger-context.js';
import { useTooltipLazyOpen } from '../use-tooltip-lazy-open.js';
import { useTooltipTriggerRef } from '../use-tooltip-trigger-ref.js';
import { toTooltipTriggerElement } from '../utils.js';
import type { TooltipContentProps } from './tooltip-content.js';
import { TooltipProviderIfMissing } from './tooltip-provider.js';

const loadPopup = () => import('./tooltip-lazy-popup.js');

// Base UI and the positioner load with the first tooltip that opens, not with every component
// that can show one. The hover delay covers the load.
const TooltipLazyPopup = React.lazy(() =>
	loadPopup().then((module) => ({ default: module.TooltipLazyPopup })),
);

/**
 * @access private
 */
export type TooltipAnchorProps = {
	/**
	 * What this element has to say. Empty content still opens a popup when a tooltip nested in the
	 * trigger stacks an entry onto it. With neither, nothing opens.
	 */
	content: React.ReactNode;
	/**
	 * The trigger. One element keeps its own element and props, with the hover handlers and
	 * `aria-describedby` added. Anything else is wrapped in a `<button>`.
	 */
	children: React.ReactNode;
	/**
	 * Shows the popup while true and hides it while false, ignoring hover and focus.
	 */
	open?: boolean;
	/**
	 * Never opens on hover or focus.
	 *
	 * @default false
	 */
	disabled?: boolean;
	/**
	 * Opens at once when the trigger takes the focus from the keyboard, and closes when it loses it.
	 *
	 * @default true
	 */
	openOnFocus?: boolean;
	contentProps?: Omit<TooltipContentProps, 'children'>;
	id?: string;
	testId?: string;
	className?: string;
	/**
	 * Replaces the popup as the description of the trigger, as on the slider thumbs where the value
	 * is already announced.
	 */
	'aria-describedby'?: string;
	[dataAttribute: `data-${string}`]: unknown;
};

/**
 * A trigger and the popup it opens, for the `Tooltip` and every component that carries a tooltip
 * of its own.
 *
 * The trigger carries no tooltip parts. The popup mounts when it opens and unmounts once it has
 * closed, and its code loads with the first one that opens. Hover opens it after the `delay` of the
 * provider, at once while another tooltip of the provider is open or closed less than its `timeout`
 * ago, and it stays open while the pointer is over the trigger or the popup. A press on the
 * trigger, Escape and a press outside close it until the pointer comes back. Touch never opens it.
 *
 * Owns the content stack: a tooltip nested in the trigger adds its entry here, so the popup opens
 * for it even when this element has nothing to say itself. Inside the trigger of another tooltip it
 * adds its own content to that one instead.
 *
 * @access private
 */
export const TooltipAnchor = React.forwardRef<HTMLButtonElement, TooltipAnchorProps>(
	function TooltipAnchor(props, ref) {
		const stacked = useIsInsideTooltipTrigger();

		if (stacked) {
			return <TooltipStackedAnchor ref={ref} {...props} />;
		}

		// The provider an anchor adds when there is none above is shared by the anchors inside its
		// trigger, so opening one of those closes this one.
		return (
			<TooltipProviderIfMissing>
				<TooltipContentStackProvider>
					<TooltipAnchorParts ref={ref} {...props} />
				</TooltipContentStackProvider>
			</TooltipProviderIfMissing>
		);
	},
);

/**
 * The element is already the trigger of the tooltip above, which stacks the content below it.
 */
const TooltipStackedAnchor = React.forwardRef<HTMLButtonElement, TooltipAnchorProps>(
	function TooltipStackedAnchor(
		{
			content,
			children,
			open: _open,
			disabled: _disabled,
			openOnFocus: _openOnFocus,
			contentProps: _contentProps,
			testId,
			className,
			...triggerProps
		},
		ref,
	) {
		useRegisterTooltipContent(content);
		const child = toTooltipTriggerElement(children);
		const triggerRef = useTooltipTriggerRef(child, ref);

		return React.cloneElement(child, {
			...(testId === undefined ? {} : { 'data-testid': testId }),
			...triggerProps,
			...(className === undefined ? {} : { className: cn(child.props.className, className) }),
			ref: triggerRef,
		} as React.Attributes);
	},
);

const TooltipAnchorParts = React.forwardRef<HTMLButtonElement, TooltipAnchorProps>(
	function TooltipAnchorParts(
		{
			content,
			children,
			open,
			disabled = false,
			openOnFocus = true,
			contentProps,
			testId,
			className,
			...triggerProps
		},
		ref,
	) {
		const entries = useTooltipContentStackEntries();
		const hasContent = !disabled && (hasTooltipContent(content) || entries.length > 0);
		const generatedId = React.useId();
		const contentId = contentProps?.id ?? generatedId;
		const controlled = open !== undefined;
		const tooltip = useTooltipLazyOpen(hasContent && !controlled);
		const [triggerElement, setTriggerElement] = React.useState<HTMLElement | null>(null);
		const [controlledMounted, setControlledMounted] = React.useState(false);
		const pointerTypeRef = React.useRef<string | undefined>(undefined);
		const child = toTooltipTriggerElement(children);
		const childProps = child.props;
		const triggerRef = useTooltipTriggerRef(child, ref, setTriggerElement);

		const controlledOpen = controlled && open && hasContent;

		// Stays mounted after `open` turns false until the popup has finished closing.
		if (controlledOpen && !controlledMounted) {
			setControlledMounted(true);
		}

		const popupOpen = controlled ? controlledOpen : tooltip.open;
		const popupAnchor = controlled
			? controlledMounted && hasContent
				? triggerElement
				: null
			: tooltip.anchor;

		// Touch has no hover: a tap sends the mouse events too, after a touch pointer.
		const isTouch = (): boolean => pointerTypeRef.current === 'touch';

		const ownDescribedBy =
			'aria-describedby' in triggerProps
				? triggerProps['aria-describedby']
				: joinIdRefs(popupOpen ? contentId : undefined, childProps['aria-describedby']);

		const hoverProps = controlled
			? {}
			: {
					onPointerEnter: (event: React.PointerEvent<HTMLElement>) => {
						childProps.onPointerEnter?.(event);
						pointerTypeRef.current = event.pointerType;
					},
					onPointerMove: (event: React.PointerEvent<HTMLElement>) => {
						childProps.onPointerMove?.(event);
						pointerTypeRef.current = event.pointerType;
					},
					onPointerDown: (event: React.PointerEvent<HTMLElement>) => {
						childProps.onPointerDown?.(event);
						pointerTypeRef.current = event.pointerType;
						tooltip.dismiss();
					},
					onMouseEnter: (event: React.MouseEvent<HTMLElement>) => {
						childProps.onMouseEnter?.(event);

						if (!isTouch()) {
							if (hasContent) {
								void loadPopup();
							}
							tooltip.enterTrigger(event.currentTarget);
						}
					},
					// A pointer already inside when the element mounts, or a script that sends only the
					// native `mouseenter`, which React does not listen to, still opens it on the first move.
					onMouseMove: (event: React.MouseEvent<HTMLElement>) => {
						childProps.onMouseMove?.(event);

						if (!isTouch()) {
							tooltip.moveOverTrigger(event.currentTarget);
						}
					},
					onMouseLeave: (event: React.MouseEvent<HTMLElement>) => {
						childProps.onMouseLeave?.(event);
						pointerTypeRef.current = undefined;
						tooltip.leaveTrigger();
					},
					...(openOnFocus
						? {
								onFocus: (event: React.FocusEvent<HTMLElement>) => {
									childProps.onFocus?.(event);

									// A focus from a press is not a reason to open. The focus of a control inside a
									// group trigger, such as a radio of a radio group, is.
									if ((event.target as HTMLElement).matches(':focus-visible')) {
										tooltip.focusTrigger(event.currentTarget);
									}
								},
								onBlur: (event: React.FocusEvent<HTMLElement>) => {
									childProps.onBlur?.(event);

									// The focus moving between the controls of a group trigger keeps it open.
									if (
										!(event.relatedTarget instanceof Node) ||
										!event.currentTarget.contains(event.relatedTarget)
									) {
										tooltip.blurTrigger();
									}
								},
							}
						: {}),
				};

		const trigger = React.cloneElement(child, {
			...(childProps['data-slot'] === undefined ? { 'data-slot': 'tooltip-trigger' } : {}),
			...(testId === undefined ? {} : { 'data-testid': testId }),
			...triggerProps,
			...(className === undefined ? {} : { className: cn(childProps.className, className) }),
			'aria-describedby': ownDescribedBy,
			...(popupOpen ? { 'data-popup-open': '' } : {}),
			...hoverProps,
			ref: triggerRef,
		} as React.Attributes);

		return (
			<>
				<TooltipTriggerProvider>{trigger}</TooltipTriggerProvider>
				{popupAnchor ? (
					<React.Suspense fallback={null}>
						<TooltipLazyPopup
							anchor={popupAnchor}
							open={popupOpen}
							contentProps={{ ...contentProps, id: contentId }}
							onPopupEnter={tooltip.enterPopup}
							onPopupLeave={tooltip.leavePopup}
							onDismiss={tooltip.dismiss}
							onClosed={() => {
								tooltip.onClosed();

								if (!controlledOpen) {
									setControlledMounted(false);
								}
							}}
						>
							{content}
						</TooltipLazyPopup>
					</React.Suspense>
				) : null}
			</>
		);
	},
);
