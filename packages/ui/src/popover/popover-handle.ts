import { Popover as PopoverPrimitive } from '@base-ui/react/popover';
import { PopupHandle } from '../lib/popup-handle.js';

/**
 * What a `Popover.Trigger` hands Base UI: the payload of the call site, and whether the trigger
 * opens a preview.
 *
 * @access private
 */
export type PopoverTriggerPayload<Payload> = {
	value: Payload | undefined;
	preview: boolean;
};

/**
 * Shows and hides a `Popover` from application state, and connects the `Popover.Trigger`s that
 * share its popup. Created by `usePopoverHandle()`.
 */
export class PopoverHandle<Payload = void> extends PopupHandle<Payload> {
	/**
	 * The Base UI handle the `Popover.Trigger`s of this handle register with.
	 *
	 * @access private
	 */
	readonly primitive = PopoverPrimitive.createHandle<PopoverTriggerPayload<Payload>>();

	private popup: HTMLElement | null = null;

	/**
	 * Opens the popup for the `Popover.Trigger` whose element has this `id`, as a hover or a press
	 * on it would. It shows that trigger's `payload`.
	 *
	 * @note The trigger has to be mounted, and so does the `Popover` the handle is passed to.
	 */
	openTrigger(id: string): void {
		this.primitive.open(id);
	}

	/**
	 * The popup while it is open, so a preview trigger can tell a focus that went into it from one
	 * that left.
	 *
	 * @access private
	 */
	get popupElement(): HTMLElement | null {
		return this.popup;
	}

	/**
	 * @access private
	 */
	setPopupElement(element: HTMLElement | null): void {
		this.popup = element;
	}

	/**
	 * Records an open that a `Popover.Trigger` caused: the popup goes to that trigger and shows its
	 * payload, not what `showAt` last named.
	 *
	 * @access private
	 */
	openFromTrigger(): void {
		this.set({ open: true, anchor: null, payload: undefined });
	}
}
