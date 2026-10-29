import * as React from 'react';
import { joinIdRefs } from '../../lib/utils.js';
import {
	hasTooltipContent,
	TooltipContentStackProvider,
	useTooltipContentStackEntries,
} from '../tooltip-content-stack-context.js';
import { TooltipTriggerProvider, useIsInsideTooltipTrigger } from '../tooltip-trigger-context.js';
import { useTooltipLazyOpen } from '../use-tooltip-lazy-open.js';
import { TooltipAnchor, type TooltipAnchorProps } from './tooltip-anchor.js';
import { TooltipLazyPopup } from './tooltip-lazy-popup.js';

type TriggerChildProps = {
	'aria-describedby'?: string;
	onPointerEnter?: React.PointerEventHandler<HTMLElement>;
	onPointerMove?: React.PointerEventHandler<HTMLElement>;
	onPointerDown?: React.PointerEventHandler<HTMLElement>;
	onMouseEnter?: React.MouseEventHandler<HTMLElement>;
	onMouseMove?: React.MouseEventHandler<HTMLElement>;
	onMouseLeave?: React.MouseEventHandler<HTMLElement>;
	onFocus?: React.FocusEventHandler<HTMLElement>;
	onBlur?: React.FocusEventHandler<HTMLElement>;
};

/**
 * @access private
 */
export type TooltipLazyAnchorProps = Pick<TooltipAnchorProps, 'content' | 'contentProps'> & {
	/**
	 * The trigger element. It keeps its own element and props, with the hover handlers and
	 * `aria-describedby` added.
	 */
	children: React.ReactElement<TriggerChildProps>;
	/**
	 * Opens at once when the trigger takes the focus from the keyboard, and closes when it loses
	 * it. For a trigger that is focusable.
	 *
	 * @default false
	 */
	openOnFocus?: boolean;
};

/**
 * A trigger that carries no tooltip parts until the pointer is over it, or with `openOnFocus` until
 * it takes the focus. For an element rendered many times that seldom shows its tooltip, such as a
 * cut text in a table cell: a `TooltipAnchor` there mounts a Base UI trigger per element.
 *
 * Opens after the `delay` of the provider, at once while another tooltip of the provider is open or
 * closed less than its `timeout` ago, and stays open while the pointer is over the trigger or the
 * popup. A press on the trigger, Escape and a press outside close it until the pointer comes back.
 * Touch never opens it.
 *
 * Inside the trigger of another tooltip it stacks into that one, the same as `TooltipAnchor`.
 *
 * @access private
 */
export function TooltipLazyAnchor(props: TooltipLazyAnchorProps): React.ReactNode {
	const stacked = useIsInsideTooltipTrigger();

	if (stacked) {
		return (
			<TooltipAnchor content={props.content} contentProps={props.contentProps}>
				{props.children}
			</TooltipAnchor>
		);
	}

	return (
		<TooltipContentStackProvider>
			<TooltipLazyAnchorParts {...props} />
		</TooltipContentStackProvider>
	);
}

function TooltipLazyAnchorParts({
	content,
	contentProps,
	openOnFocus = false,
	children,
}: TooltipLazyAnchorProps): React.ReactNode {
	const entries = useTooltipContentStackEntries();
	const hasContent = hasTooltipContent(content) || entries.length > 0;
	const generatedId = React.useId();
	const contentId = contentProps?.id ?? generatedId;
	const tooltip = useTooltipLazyOpen(hasContent);
	const pointerTypeRef = React.useRef<string | undefined>(undefined);
	const childProps = children.props;

	// Touch has no hover: a tap sends the mouse events too, after a touch pointer.
	const isTouch = (): boolean => pointerTypeRef.current === 'touch';

	const trigger = React.cloneElement(children, {
		'aria-describedby': joinIdRefs(
			childProps['aria-describedby'],
			tooltip.open ? contentId : undefined,
		),
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
				tooltip.enterTrigger(event.currentTarget);
			}
		},
		// A pointer already inside when the element mounts, or a script that sends only the native
		// `mouseenter`, which React does not listen to, still opens it on the first move.
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

						// The focus of a child, or one from a press, is not a reason to open.
						if (
							event.target === event.currentTarget &&
							event.currentTarget.matches(':focus-visible')
						) {
							tooltip.focusTrigger(event.currentTarget);
						}
					},
					onBlur: (event: React.FocusEvent<HTMLElement>) => {
						childProps.onBlur?.(event);
						tooltip.blurTrigger();
					},
				}
			: {}),
	});

	return (
		<>
			<TooltipTriggerProvider>{trigger}</TooltipTriggerProvider>
			{tooltip.anchor ? (
				<TooltipLazyPopup
					anchor={tooltip.anchor}
					open={tooltip.open}
					contentProps={{ ...contentProps, id: contentId }}
					onPopupEnter={tooltip.enterPopup}
					onPopupLeave={tooltip.leavePopup}
					onDismiss={tooltip.dismiss}
					onClosed={tooltip.onClosed}
				>
					{content}
				</TooltipLazyPopup>
			) : null}
		</>
	);
}
