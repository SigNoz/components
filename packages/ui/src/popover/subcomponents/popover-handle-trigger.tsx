import { Popover as PopoverPrimitive } from '@base-ui/react/popover';
import { type ReactElement, useEffect, useId, useMemo, useState } from 'react';
import {
	POPOVER_HOVER_CLOSE_DELAY,
	POPOVER_HOVER_DELAY,
	POPOVER_PREVIEW_TRIGGER_RESET,
} from '../constants.js';
import type { PopoverTriggerPayload } from '../popover-handle.js';
import type { PopoverTriggerProps } from '../types.js';
import { usePopoverPreviewFocus } from '../use-popover-preview-focus.js';

/**
 * A trigger of the popover its `handle` is passed to, rendered anywhere in the tree. Reached as
 * `Popover.Trigger`, not imported on its own.
 *
 * Every trigger of one handle opens the same popup. It moves to the trigger the pointer or the
 * focus is on and swaps its content for that trigger's `payload`, which the popover's `children`
 * function receives. The popup is never mounted twice, so a row of triggers costs one popup.
 *
 * `children` is rendered as the element you pass, with the trigger's props merged into it, the way
 * the popover's own `trigger` is. A trigger opens the popup on a press, and with `openOnHover` on
 * hover as well. A `preview` trigger opens a card about its element instead: see `preview`.
 *
 * ### Asserting on it
 *
 * The element keeps its own `data-slot` and `data-testid`, and gets `data-slot="popover-trigger"`
 * when it has none. Base UI marks the trigger the popup is open for with `data-popup-open`.
 *
 * @example
 * ```tsx
 * const card = usePopoverHandle<Service>();
 *
 * <Popover handle={card} side="bottom" align="start">
 *   {(service) => <ServiceSummary service={service} />}
 * </Popover>
 *
 * {services.map((service) => (
 *   <Popover.Trigger key={service.id} handle={card} payload={service} nativeButton={false} preview>
 *     <a href={service.href}>{service.name}</a>
 *   </Popover.Trigger>
 * ))}
 * ```
 */
export function PopoverHandleTrigger<Payload>({
	handle,
	payload,
	children,
	nativeButton,
	preview = false,
	openOnHover = false,
	delay = POPOVER_HOVER_DELAY,
	closeDelay = POPOVER_HOVER_CLOSE_DELAY,
}: PopoverTriggerProps<Payload>): ReactElement {
	const generatedId = useId();
	// The id Base UI tracks the trigger by. The element's own id would replace it, since the props
	// of the `render` element win.
	const id = children.props.id ?? generatedId;
	const focus = usePopoverPreviewFocus(handle, id, delay);
	const [element, setElement] = useState<HTMLElement | null>(null);

	// Base UI keeps a popup open after its trigger has gone, placed against nothing at the top left
	// of the page: a row deleted or filtered out while its popover is open. It goes with the trigger.
	useEffect(
		() => () => {
			if (element !== null && handle.isOpen && handle.activeTrigger === element) {
				handle.close();
			}
		},
		[handle, element],
	);
	// One object per payload: Base UI writes a new payload into the popup's store, which renders
	// the popover, and so this trigger, again.
	const envelope = useMemo<PopoverTriggerPayload<Payload>>(
		() => ({ value: payload, preview }),
		[payload, preview],
	);

	return (
		<PopoverPrimitive.Trigger
			ref={setElement}
			handle={handle.primitive}
			payload={envelope}
			id={id}
			nativeButton={nativeButton}
			data-slot="popover-trigger"
			render={children}
			{...((openOnHover || preview) && { openOnHover: true, delay, closeDelay })}
			{...(preview && POPOVER_PREVIEW_TRIGGER_RESET)}
			onClick={
				preview
					? (event) => {
							event.preventBaseUIHandler();

							// Base UI leaves a press on another trigger alone, so a popup a press opened
							// elsewhere would outlive the click that a press outside closes it with.
							if (handle.isOpen && !event.currentTarget.hasAttribute('data-popup-open')) {
								handle.close();
							}
						}
					: undefined
			}
			onKeyDown={preview ? (event) => event.preventBaseUIHandler() : undefined}
			onKeyUp={preview ? (event) => event.preventBaseUIHandler() : undefined}
			onFocus={preview ? focus.onFocus : undefined}
			onBlur={preview ? focus.onBlur : undefined}
		/>
	);
}

PopoverHandleTrigger.displayName = 'Popover.Trigger';
